import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

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
      'Full MetrixScore™ report: score reveal, 6-area breakdown, top 3 risks, 5 action steps, and curated resource links.',
    recurring: false,
  },
  pro: {
    amount: 1999,
    name: 'SubZeroMetrix MetrixScore™ Pro',
    description:
      'Complete report + personalized 90-day roadmap, AI trade-specific actions, affiliate resource map, and reassessment sequence.',
    recurring: false,
  },
  platform: {
    amount: 2900,
    name: 'SubZeroMetrix Trade Platform',
    description:
      'Monthly trade-specific platform: live KPI dashboard, AI coach, peer benchmarking, and proactive metric alerts.',
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
