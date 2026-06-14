import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { isFeatureEnabled } from '@/lib/featureFlags'
import { buildApprovedCheckoutIntent } from '@/lib/entitlements/checkout'
import type { PlanId } from '@/lib/pricing/pricingPlans'

// Stripe client is created lazily inside the handler so we can return a clean
// 503 if the env var is missing, rather than throwing at module-load time.
function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_NOT_CONFIGURED')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
}

// Tier price map — server-side only, never trust client-sent amounts
const TIER_PRICES: Record<string, {
  amount: number
  name: string
  description: string
  recurring: boolean
}> = {
  basic: {
    amount: 999,
    name: 'SubZeroMetrix MetrixScore™',
    description:
      'Full report, category breakdown, top risk areas, prioritized first actions, and official resource links.',
    recurring: false,
  },
  pro: {
    amount: 1999,
    name: 'SubZeroMetrix MetrixScore™ Pro',
    description:
      'Full roadmap, growth phases, financial and sales systems, practical contractor tools, vendor research, and risk/category detail.',
    recurring: false,
  },
  platform: {
    amount: 2900,
    name: 'SubZeroMetrix Trade Platform',
    description:
      'Everything in Pro plus trade-specific platform access, trade-focused KPIs and guidance, and future-facing trade modules as released.',
    recurring: true,
  },
}

export async function POST(req: NextRequest) {
  // Guard: return 503 if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()

    // ── Wave 8 CP2: approved-model checkout (flag-gated, default OFF) ─────────────────
    // Only active behind `live_approved_checkout`. When OFF (production default), this branch is
    // skipped entirely and the legacy tier checkout below runs unchanged. The amount/mode are
    // derived server-side from the approved model — never from the client.
    if (isFeatureEnabled('live_approved_checkout') && typeof body?.planId === 'string') {
      const result = buildApprovedCheckoutIntent(body.planId as PlanId, {
        foundingSeatAvailable: false, // CP4 wires a verified-purchase-backed source; held until then.
      })
      if (!result.ok) {
        return NextResponse.json({ error: `Plan not available for checkout: ${result.reason}` }, { status: 400 })
      }
      const { intent } = result
      const approvedOrigin =
        process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'https://subzerometrix.com'
      const stripeClient = getStripe()
      const approvedSession = await stripeClient.checkout.sessions.create({
        mode: intent.mode,
        customer_email: typeof body?.leadEmail === 'string' ? body.leadEmail : undefined,
        line_items: [
          {
            price_data: {
              currency: intent.lineItem.currency,
              product_data: {
                name: intent.lineItem.productName,
                description: intent.lineItem.productDescription,
              },
              unit_amount: intent.lineItem.unitAmount,
              ...(intent.lineItem.recurringInterval
                ? { recurring: { interval: intent.lineItem.recurringInterval } }
                : {}),
            },
            quantity: 1,
          },
        ],
        success_url: `${approvedOrigin}/report?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${approvedOrigin}/pricing?cancelled=true`,
        metadata: {
          plan_id: intent.planId,
          checkout_model: 'approved',
        },
      })
      return NextResponse.json({ url: approvedSession.url })
    }

    const { scoreData, assessmentId, tierId = 'pro' } = body

    if (!scoreData) {
      return NextResponse.json({ error: 'Missing scoreData' }, { status: 400 })
    }

    const tier = TIER_PRICES[tierId] ?? TIER_PRICES.pro
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      'https://subzerometrix.com'

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: tier.recurring ? 'subscription' : 'payment',
      customer_email: scoreData?.leadEmail || undefined,
      line_items: [
        {
          price_data: tier.recurring
            ? {
                currency: 'usd',
                product_data: {
                  name: tier.name,
                  description: tier.description,
                },
                unit_amount: tier.amount,
                recurring: { interval: 'month' },
              }
            : {
                currency: 'usd',
                product_data: {
                  name: tier.name,
                  description: tier.description,
                },
                unit_amount: tier.amount,
              },
          quantity: 1,
        },
      ],
      success_url: `${origin}/report?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/unlock?cancelled=true`,
      metadata: {
        assessment_id: assessmentId ?? '',
        tier_id:       tierId,
        tier_amount:   tier.amount.toString(),
        score:         scoreData?.overall?.toString() ?? '',
        band:          scoreData?.band               ?? '',
        business_type: scoreData?.businessType       ?? '',
        stage:         scoreData?.stage              ?? '',
        lead_name:     scoreData?.leadName           ?? '',
        lead_email:    scoreData?.leadEmail          ?? '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
