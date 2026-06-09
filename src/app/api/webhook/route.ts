import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

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

  return NextResponse.json({ received: true })
}
