import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { isFeatureEnabled } from '@/lib/featureFlags'
import {
  classifyWebhookEvent,
  deriveEntitlementsFromCheckout,
  entitlementToRow,
  webhookEventIdempotencyKey,
} from '@/lib/entitlements/provisioning'
import type { PlanId } from '@/lib/pricing/pricingPlans'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_NOT_CONFIGURED')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
}

/**
 * Stripe webhook — handles checkout.session.completed
 * App Router: raw body must be read as text for signature verification.
 */
export async function POST(req: NextRequest) {
  // Guard: missing Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
      { status: 503 }
    )
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured. Missing STRIPE_WEBHOOK_SECRET.' },
      { status: 503 }
    )
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const rawBody = await req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature error'
    console.error('Stripe webhook verification failed:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const assessmentId = session.metadata?.assessment_id ?? null

        // 1. Mark the assessment as paid
        if (assessmentId) {
          await supabase
            .from('assessments')
            .update({
              paid:              true,
              stripe_session_id: session.id,
              paid_at:           new Date().toISOString(),
            })
            .eq('id', assessmentId)
        }

        // 2. Insert purchase record
        await supabase.from('purchases').insert({
          stripe_session_id: session.id,
          assessment_id:     assessmentId,
          customer_email:    session.customer_details?.email ?? session.metadata?.lead_email ?? null,
          amount_total:      session.amount_total,
          score:             session.metadata?.score         ?? null,
          band:              session.metadata?.band          ?? null,
          business_type:     session.metadata?.business_type ?? null,
          stage:             session.metadata?.stage         ?? null,
          lead_name:         session.metadata?.lead_name     ?? null,
          completed_at:      new Date().toISOString(),
        })
      } catch (dbErr) {
        console.error('Supabase error (non-fatal):', dbErr)
      }
    }
  }

  // ── Wave 8 CP3: webhook idempotency + entitlement integrity (additive, non-fatal) ──────
  // Runs ONLY when the approved-checkout world is enabled AND Supabase is configured. With the flag
  // OFF or Supabase unset (production default), this block no-ops and the legacy handling above is
  // unchanged. Every DB call is wrapped so a not-yet-applied migration 005 can never fail the
  // webhook. Entitlement ids are deterministic (derived from the session id), so even without the
  // ledger a duplicate delivery cannot double-grant (upsert on conflict).
  if (
    isFeatureEnabled('live_approved_checkout') &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )
      const eventKey = webhookEventIdempotencyKey(event.id)

      let alreadyProcessed = false
      if (eventKey) {
        const { data: seen } = await supabase
          .from('processed_webhook_events')
          .select('event_id')
          .eq('event_id', eventKey)
          .maybeSingle()
        alreadyProcessed = !!seen
      }

      if (!alreadyProcessed) {
        const intent = classifyWebhookEvent(event.type)
        const nowIso = new Date().toISOString()

        if (intent === 'provision' && event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session
          const planId = session.metadata?.plan_id as PlanId | undefined
          const ownerId = session.metadata?.account_user_id ?? null
          // Provision only for the approved model AND when an account identity is present. Without
          // an owner id we cannot attribute an entitlement, so we safely skip (no orphan rows).
          if (planId && ownerId) {
            const records = deriveEntitlementsFromCheckout({
              planId,
              ownerId,
              activatedAt: nowIso,
              idBase: session.id,
              periodEnd: null,
              externalProvider: 'stripe',
              externalCustomerRef: typeof session.customer === 'string' ? session.customer : null,
              externalTransactionRef:
                typeof session.payment_intent === 'string' ? session.payment_intent : null,
              externalSubscriptionRef:
                typeof session.subscription === 'string' ? session.subscription : null,
            })
            for (const rec of records) {
              await supabase
                .from('commercial_entitlements')
                .upsert(entitlementToRow(rec), { onConflict: 'id', ignoreDuplicates: true })
            }
          }
        } else if (intent === 'expire') {
          const sub = event.data.object as Stripe.Subscription
          await supabase
            .from('commercial_entitlements')
            .update({ status: 'expired', updated_at: nowIso })
            .eq('external_subscription_ref', sub.id)
        } else if (intent === 'refund' || intent === 'dispute') {
          const charge = event.data.object as Stripe.Charge
          const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
          if (pi) {
            await supabase
              .from('commercial_entitlements')
              .update({ status: intent === 'refund' ? 'refunded' : 'disputed', updated_at: nowIso })
              .eq('external_transaction_ref', pi)
          }
        }

        if (eventKey) {
          await supabase
            .from('processed_webhook_events')
            .insert({ event_id: eventKey, event_type: event.type })
        }
      }
    } catch (entErr) {
      console.error('Entitlement integrity (non-fatal):', entErr)
    }
  }

  return NextResponse.json({ received: true })
}
