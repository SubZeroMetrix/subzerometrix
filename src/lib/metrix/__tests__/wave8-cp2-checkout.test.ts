// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP2 — approved-model checkout intent (Node runner).
// Proves the pure plan→checkout mapping: amounts/modes derive from the approved model and never
// diverge, Growth is never self-purchasable (invitation-only), Founding Lifetime is purchasable
// only with a confirmed available seat, free plans have no checkout, and the live approved-checkout
// flag defaults OFF. No Stripe / network here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildApprovedCheckoutIntent,
  isSelfPurchasable,
  selfPurchasablePlanIds,
  checkoutModeForPlan,
} from '../../entitlements/checkout'
import { PRICING_PLANS, getPricingPlan } from '../../pricing/pricingPlans'
import { isFeatureEnabled, FEATURE_FLAGS } from '../../featureFlags'

test('cp2: live_approved_checkout flag exists and defaults OFF', () => {
  assert.ok(FEATURE_FLAGS.includes('live_approved_checkout'))
  assert.equal(isFeatureEnabled('live_approved_checkout', undefined, {}), false)
})

test('cp2: Roadmap Pass builds a one-time payment intent at the approved amount', () => {
  const r = buildApprovedCheckoutIntent('roadmap_pass')
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.intent.mode, 'payment')
  assert.equal(r.intent.lineItem.unitAmount, PRICING_PLANS.roadmap_pass.priceCents)
  assert.equal(r.intent.lineItem.unitAmount, 1900)
  assert.equal(r.intent.lineItem.recurringInterval, null)
  assert.equal(r.intent.lineItem.productName, PRICING_PLANS.roadmap_pass.name)
})

test('cp2: Build builds a monthly subscription intent at the approved amount', () => {
  const r = buildApprovedCheckoutIntent('build')
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.intent.mode, 'subscription')
  assert.equal(r.intent.lineItem.unitAmount, 3900)
  assert.equal(r.intent.lineItem.recurringInterval, 'month')
})

test('cp2: Growth is invitation-only and never self-purchasable', () => {
  const r = buildApprovedCheckoutIntent('growth')
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.equal(r.reason, 'invitation_only')
  assert.equal(isSelfPurchasable('growth'), false)
})

test('cp2: Founding Lifetime requires a confirmed available seat', () => {
  const blocked = buildApprovedCheckoutIntent('founding_lifetime')
  assert.equal(blocked.ok, false)
  if (!blocked.ok) assert.equal(blocked.reason, 'requires_founding_availability')

  const blockedExplicit = buildApprovedCheckoutIntent('founding_lifetime', { foundingSeatAvailable: false })
  assert.equal(blockedExplicit.ok, false)

  const allowed = buildApprovedCheckoutIntent('founding_lifetime', { foundingSeatAvailable: true })
  assert.equal(allowed.ok, true)
  if (allowed.ok) {
    assert.equal(allowed.intent.mode, 'payment')
    assert.equal(allowed.intent.lineItem.unitAmount, 64900)
    assert.equal(allowed.intent.lineItem.recurringInterval, null)
  }
})

test('cp2: the free plan has no checkout', () => {
  const r = buildApprovedCheckoutIntent('initial_direction')
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'no_payment_required')
  assert.equal(isSelfPurchasable('initial_direction'), false)
})

test('cp2: an unknown plan id is rejected', () => {
  // deliberately bad cast — the route receives untrusted input
  const r = buildApprovedCheckoutIntent('bogus' as never)
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'unknown_plan')
})

test('cp2: amounts and modes never diverge from the approved model', () => {
  for (const plan of Object.values(PRICING_PLANS)) {
    const r = buildApprovedCheckoutIntent(plan.id, { foundingSeatAvailable: true })
    if (!r.ok) continue
    assert.equal(r.intent.lineItem.unitAmount, plan.priceCents, plan.id)
    assert.equal(r.intent.mode, checkoutModeForPlan(plan), plan.id)
  }
})

test('cp2: self-purchasable set is exactly Roadmap Pass, Build, and Founding Lifetime', () => {
  assert.deepEqual(selfPurchasablePlanIds().sort(), ['build', 'founding_lifetime', 'roadmap_pass'])
})

test('cp2: pricing plan lookup is the single amount source (sanity)', () => {
  assert.equal(getPricingPlan('build')?.priceCents, 3900)
  assert.equal(getPricingPlan('growth')?.invitationOnly, true)
})
