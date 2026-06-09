import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_NOT_CONFIGURED')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
}

/**
 * GET /api/verify-session?session_id=cs_xxx
 *
 * Server-side verification of Stripe Checkout session.
 * Returns { paid: true, assessmentId } only when Stripe confirms payment_status === 'paid'.
 * The score/report is never sent from here — the client reads it from sessionStorage
 * only after this route confirms payment.
 *
 * This prevents report access by simply crafting a URL with success=true&session_id=anything.
 */
export async function GET(req: NextRequest) {
  // Local dev bypass — never active in production
  if (
    process.env.DEV_UNLOCK === 'true' &&
    process.env.NODE_ENV !== 'production'
  ) {
    return NextResponse.json({ paid: true, assessmentId: null, band: null })
  }

  // Guard: return 503 if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { paid: false, error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ paid: false, error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ paid: false, error: 'Payment not completed' }, { status: 402 })
    }

    return NextResponse.json({
      paid: true,
      assessmentId: session.metadata?.assessment_id ?? null,
      band:         session.metadata?.band ?? null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('verify-session error:', message)
    return NextResponse.json({ paid: false, error: message }, { status: 500 })
  }
}
