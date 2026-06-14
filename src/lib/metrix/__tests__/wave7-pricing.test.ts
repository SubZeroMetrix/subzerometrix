// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 CP11 — pricing presentation + Founding Lifetime counter integrity (Node runner).
// Proves the approved pricing model is exact, the offer types are structurally distinguished,
// no misleading/savings/annual/financing/outcome field can exist, the Roadmap Pass never auto-
// subscribes, and the founding counter never fabricates scarcity. No Stripe / checkout here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  PRICING_PLANS, PRICING_PLAN_LIST, PRICING_DISCLOSURES, FOUNDING_SEAT_LIMIT,
  FOUNDING_LIFETIME_SCOPE,
  getPricingPlan, subscriptionPlans, oneTimePlans, invitationOnlyPlans,
} from '../../pricing/pricingPlans'
import {
  resolveFoundingAvailability, FOUNDING_AVAILABILITY,
} from '../../pricing/foundingAvailability'
import { isFeatureEnabled } from '../../featureFlags'

// ── 1. Approved prices are exact ─────────────────────────────────────────────────
test('pricing: approved model prices match exactly', () => {
  assert.equal(PRICING_PLANS.initial_direction.priceCents, 0)
  assert.equal(PRICING_PLANS.roadmap_pass.priceCents, 1900)
  assert.equal(PRICING_PLANS.build.priceCents, 3900)
  assert.equal(PRICING_PLANS.growth.priceCents, 7900)
  assert.equal(PRICING_PLANS.founding_lifetime.priceCents, 64900)
  assert.equal(PRICING_PLAN_LIST.length, 5)
  assert.deepEqual(
    PRICING_PLAN_LIST.map(p => p.id),
    ['initial_direction', 'roadmap_pass', 'build', 'growth', 'founding_lifetime'],
  )
})

// ── 2. Offer types are structurally distinguished ────────────────────────────────
test('pricing: one-time, subscription, invitation, and lifetime are distinct', () => {
  assert.equal(PRICING_PLANS.initial_direction.billingKind, 'free')
  assert.equal(PRICING_PLANS.roadmap_pass.billingKind, 'one_time')
  assert.equal(PRICING_PLANS.build.billingKind, 'subscription')
  assert.equal(PRICING_PLANS.growth.billingKind, 'subscription')
  assert.equal(PRICING_PLANS.founding_lifetime.billingKind, 'lifetime')

  assert.deepEqual(subscriptionPlans().map(p => p.id), ['build', 'growth'])
  assert.deepEqual(oneTimePlans().map(p => p.id), ['roadmap_pass', 'founding_lifetime'])
  assert.deepEqual(invitationOnlyPlans().map(p => p.id), ['growth'])
  assert.equal(getPricingPlan('build')!.cadenceLabel, 'Per month')
})

// ── 3. Roadmap Pass: one-time, included 30-day Build access, no auto-subscription ─
test('pricing: Roadmap Pass is one-time with 30 days Build access and never auto-renews', () => {
  const pass = PRICING_PLANS.roadmap_pass
  assert.equal(pass.billingKind, 'one_time')
  assert.equal(pass.autoRenews, false)
  assert.equal(pass.invitationOnly, false)
  assert.ok(pass.includedAccess, 'Roadmap Pass includes a defined access window')
  assert.equal(pass.includedAccess!.plan, 'build')
  assert.equal(pass.includedAccess!.days, 30)
  // The no-auto-subscription promise must be stated explicitly, not implied.
  assert.ok(pass.scopeNotes.some(n => /does not (start a subscription|renew)/i.test(n)))
})

// ── 4. Subscriptions renew; invitation-only cannot self-checkout ─────────────────
test('pricing: Build/Growth are monthly; Growth is invitation-only', () => {
  assert.equal(PRICING_PLANS.build.autoRenews, true)
  assert.equal(PRICING_PLANS.build.accessGate, 'purchase')
  assert.equal(PRICING_PLANS.growth.autoRenews, true)
  assert.equal(PRICING_PLANS.growth.invitationOnly, true)
  assert.equal(PRICING_PLANS.growth.accessGate, 'invitation')
})

// ── 5. Founding Lifetime scope is truthful and bounded ───────────────────────────
test('pricing: Founding Lifetime is seat-limited with no coaching/ownership claims', () => {
  const f = PRICING_PLANS.founding_lifetime
  assert.equal(f.billingKind, 'lifetime')
  assert.equal(f.autoRenews, false)
  assert.equal(f.seatLimited, true)
  assert.equal(f.seatLimit, FOUNDING_SEAT_LIMIT)
  assert.equal(FOUNDING_SEAT_LIMIT, 100)
  // Required explicit boundaries.
  const scope = FOUNDING_LIFETIME_SCOPE.join(' ').toLowerCase()
  assert.ok(scope.includes('no human coaching'), 'must state no human coaching')
  assert.ok(/no ownership|partnership/.test(scope), 'must disclaim ownership/partnership')
  assert.ok(/future product|unreleased future|third-party/.test(scope), 'must bound future/third-party')
  assert.ok(scope.includes('first 100 verified purchasers'))
  // No plan ever bundles human coaching in its included features.
  for (const p of PRICING_PLAN_LIST) {
    assert.ok(!p.includes.some(i => /coaching|consult|done-for-you/i.test(i)), `${p.id} must not bundle coaching`)
  }
})

// ── 6. No misleading / fabricated commercial fields anywhere ──────────────────────
test('pricing: no annual, financing, fabricated savings, or guaranteed outcomes', () => {
  for (const p of PRICING_PLAN_LIST) {
    assert.equal(p.hasAnnualOption, false)
    assert.equal(p.hasFinancing, false)
    assert.equal(p.guaranteesOutcome, false)
    assert.equal(p.hasFabricatedSavings, false)
    // No "was/now" or "save $" framing in any visible copy.
    const copy = [p.summary, p.whoFor, ...p.includes, ...p.scopeNotes].join(' ').toLowerCase()
    assert.ok(!/\bsave \$|\bwas \$|\bdiscount\b|\b% off\b|per year|annually|guaranteed (income|revenue|outcome|results)/.test(copy),
      `${p.id} copy must not make misleading savings/annual/outcome claims`)
  }
  // Disclosures explicitly deny annual/financing/guarantees.
  const disc = PRICING_DISCLOSURES.join(' ').toLowerCase()
  assert.ok(disc.includes('no annual plans'))
})

// ── 7. Founding counter integrity — no fabricated scarcity ───────────────────────
test('founding-counter: unknown when no reliable source; never fabricates a number', () => {
  const noSource = resolveFoundingAvailability(null)
  assert.equal(noSource.status, 'unknown')
  assert.equal(noSource.remaining, null)
  assert.equal(noSource.liveCounterActive, false)

  // Unreliable or malformed inputs all degrade to unknown — never a guessed count.
  assert.equal(resolveFoundingAvailability({ completedVerifiedPurchases: 10, reliable: false }).status, 'unknown')
  assert.equal(resolveFoundingAvailability({ completedVerifiedPurchases: -1, reliable: true }).status, 'unknown')
  assert.equal(resolveFoundingAvailability({ completedVerifiedPurchases: 1.5, reliable: true }).status, 'unknown')
  assert.equal(resolveFoundingAvailability({ completedVerifiedPurchases: Number.NaN, reliable: true }).status, 'unknown')
})

test('founding-counter: remaining derives only from completed purchases and clamps', () => {
  const fresh = resolveFoundingAvailability({ completedVerifiedPurchases: 0, reliable: true })
  assert.equal(fresh.status, 'available')
  assert.equal(fresh.remaining, 100)
  assert.equal(fresh.liveCounterActive, true)

  const mid = resolveFoundingAvailability({ completedVerifiedPurchases: 40, reliable: true })
  assert.equal(mid.remaining, 60)

  const full = resolveFoundingAvailability({ completedVerifiedPurchases: 100, reliable: true })
  assert.equal(full.status, 'sold_out')
  assert.equal(full.remaining, 0)

  // Over-cap can never produce negative remaining or imply seats beyond the limit.
  const over = resolveFoundingAvailability({ completedVerifiedPurchases: 150, reliable: true })
  assert.equal(over.status, 'sold_out')
  assert.equal(over.remaining, 0)
})

test('founding-counter: shipped default is unknown with NO live counter (no source wired)', () => {
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.remaining, null)
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
  assert.equal(FOUNDING_AVAILABILITY.totalSeats, 100)
})

// ── 8. Payment-dependent presentation stays behind a default-OFF flag ────────────
test('pricing: payment-dependent flags default OFF', () => {
  assert.equal(isFeatureEnabled('lifetime_offer_presentation', undefined, {}), false)
  assert.equal(isFeatureEnabled('presentation_shell', undefined, {}), false)
})
