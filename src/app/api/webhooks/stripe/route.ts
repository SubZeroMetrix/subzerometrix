import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] Signature verification failed:', message)
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
  }

  // Idempotency: check event.id has not been processed
  // In production, store processed event IDs in Supabase

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle future SubZero Metrix product purchases
      console.log('[stripe-webhook] Checkout completed:', event.id)
      break

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      console.log('[stripe-webhook] Subscription event:', event.type, event.id)
      break

    default:
      console.log('[stripe-webhook] Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
