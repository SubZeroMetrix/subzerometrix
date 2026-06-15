// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP5 — disclosures, consent guard, and customer states (Node runner).
// Proves checkout disclosures are COMPOSED from approved data only (no new legal copy), Terms/
// Privacy linking + paid-plan consent are required, the analytics guard admits only allow-listed
// non-PII descriptors, and customer presentation states map neutrally. No Stripe / network here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  requiredCheckoutDisclosures,
  isCheckoutAnalyticsPayloadSafe,
  sanitizeCheckoutAnalyticsPayload,
  CHECKOUT_ANALYTICS_ALLOW_LIST,
} from '../../entitlements/disclosures'
import { customerEntitlementState, hasActiveEntitlement } from '../../entitlements/customerState'
import { PRICING_PLANS, PRICING_DISCLOSURES } from '../../pricing/pricingPlans'
import { ENTITLEMENT_SCHEMA_VERSION, type EntitlementRecord } from '../../entitlements/types'

const NOW = '2026-06-14T00:00:00.000Z'
const LATER = '2026-07-14T00:00:00.000Z'
const AFTER = '2026-08-14T00:00:00.000Z'

function rec(over: Partial<EntitlementRecord> = {}): EntitlementRecord {
  return {
    id: 'e',
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: 'o',
    product: 'build_monthly',
    capabilities: ['build_access'],
    source: 'subscription',
    status: 'active',
    createdAt: NOW,
    activatedAt: NOW,
    expiresAt: LATER,
    ...over,
  }
}

test('cp5: checkout disclosures are composed verbatim from the approved model (no new copy)', () => {
  const d = requiredCheckoutDisclosures('roadmap_pass')
  assert.ok(d)
  if (!d) return
  assert.deepEqual(d.planDisclosures, PRICING_PLANS.roadmap_pass.scopeNotes)
  assert.deepEqual(d.generalDisclosures, PRICING_DISCLOSURES)
  assert.equal(d.requiresTermsLink, true)
  assert.equal(d.requiresPrivacyLink, true)
  assert.equal(d.termsHref, '/terms')
  assert.equal(d.privacyHref, '/privacy')
  assert.equal(d.requiresExplicitConsent, true)
})

test('cp5: the free plan requires no purchase consent; unknown plans return null', () => {
  const free = requiredCheckoutDisclosures('initial_direction')
  assert.equal(free?.requiresExplicitConsent, false)
  assert.equal(requiredCheckoutDisclosures('bogus' as never), null)
})

test('cp5: subscription and lifetime plans require explicit consent', () => {
  assert.equal(requiredCheckoutDisclosures('build')?.requiresExplicitConsent, true)
  assert.equal(requiredCheckoutDisclosures('growth')?.requiresExplicitConsent, true)
  assert.equal(requiredCheckoutDisclosures('founding_lifetime')?.requiresExplicitConsent, true)
})

test('cp5: analytics guard admits only allow-listed non-PII descriptors', () => {
  const safe = { plan_id: 'build', mode: 'subscription', checkout_model: 'approved' }
  assert.equal(isCheckoutAnalyticsPayloadSafe(safe), true)

  assert.equal(isCheckoutAnalyticsPayloadSafe({ plan_id: 'build', email: 'x@y.com' }), false)
  assert.equal(isCheckoutAnalyticsPayloadSafe({ lead_name: 'Jane' }), false)
  assert.equal(isCheckoutAnalyticsPayloadSafe({ payment_intent: 'pi_1' }), false)
  assert.equal(isCheckoutAnalyticsPayloadSafe(null), false)
})

test('cp5: sanitizer strips PII/sensitive keys and keeps allow-listed ones', () => {
  const out = sanitizeCheckoutAnalyticsPayload({
    plan_id: 'build',
    mode: 'subscription',
    email: 'x@y.com',
    lead_name: 'Jane',
    payment_intent: 'pi_1',
    amount: 3900,
  })
  assert.deepEqual(out, { plan_id: 'build', mode: 'subscription' })
  assert.equal(isCheckoutAnalyticsPayloadSafe(out), true)
})

test('cp5: the allow-list contains no PII/payment fields', () => {
  for (const k of CHECKOUT_ANALYTICS_ALLOW_LIST) {
    assert.equal(/email|name|customer|payment|transaction|card|amount/i.test(k), false, k)
  }
})

test('cp5: customer states map neutrally to the access window', () => {
  assert.equal(customerEntitlementState(rec(), NOW), 'active')
  assert.equal(customerEntitlementState(rec({ status: 'canceled', canceledAt: NOW }), NOW), 'ending')
  assert.equal(customerEntitlementState(rec({ status: 'canceled', canceledAt: NOW }), AFTER), 'ended')
  assert.equal(customerEntitlementState(rec({ status: 'pending' }), NOW), 'pending')
  assert.equal(customerEntitlementState(rec({ status: 'refunded', refundedAt: NOW }), NOW), 'ended')
  assert.equal(customerEntitlementState(rec({ status: 'revoked', revokedAt: NOW }), NOW), 'ended')
  assert.equal(customerEntitlementState(rec(), AFTER), 'ended') // active status but past window
})

test('cp5: hasActiveEntitlement reflects current access', () => {
  assert.equal(hasActiveEntitlement([rec()], NOW), true)
  assert.equal(hasActiveEntitlement([rec({ status: 'refunded' })], NOW), false)
  assert.equal(hasActiveEntitlement([], NOW), false)
})
