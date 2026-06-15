// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP3 — webhook → entitlement integrity (Node runner).
// Proves the pure provisioning logic: a settled checkout derives the correct entitlement records
// (Roadmap Pass = persistent roadmap + bounded 30-day Build), idempotency is a deterministic
// membership check, lifecycle transitions end access without mutating the original, the event
// classifier never guesses, and the DB-row mapping is faithful. No Stripe / Supabase here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  productKeyForPlan,
  deriveEntitlementsFromCheckout,
  webhookEventIdempotencyKey,
  isDuplicateWebhookEvent,
  applyCancellation,
  applyExpiration,
  applyRefund,
  applyDispute,
  applyRevocation,
  classifyWebhookEvent,
  entitlementToRow,
  type CheckoutProvisionInput,
} from '../../entitlements/provisioning'
import {
  isValidEntitlementRecord,
  isEntitlementActiveAt,
  entitlementGrantsCapabilityAt,
  isFoundingInventoryCandidate,
} from '../../entitlements/entitlements'

const ACTIVATED = '2026-06-14T00:00:00.000Z'
const JUST_AFTER = '2026-06-14T00:00:01.000Z'
const BUILD_EXPIRES = '2026-07-14T00:00:00.000Z'
const AFTER_EXPIRY = '2026-07-15T00:00:00.000Z'

function input(over: Partial<CheckoutProvisionInput> = {}): CheckoutProvisionInput {
  return {
    planId: 'roadmap_pass',
    ownerId: 'owner_1',
    activatedAt: ACTIVATED,
    idBase: 'cs_test_1',
    externalTransactionRef: 'pi_123',
    ...over,
  }
}

test('cp3: plan id maps to the canonical product key', () => {
  assert.equal(productKeyForPlan('build'), 'build_monthly')
  assert.equal(productKeyForPlan('growth'), 'growth_monthly')
  assert.equal(productKeyForPlan('founding_lifetime'), 'founding_lifetime')
  assert.equal(productKeyForPlan('roadmap_pass'), 'roadmap_pass')
})

test('cp3: Roadmap Pass derives a persistent roadmap + a bounded 30-day Build window', () => {
  const recs = deriveEntitlementsFromCheckout(input())
  assert.equal(recs.length, 2)
  for (const r of recs) assert.equal(isValidEntitlementRecord(r), true)

  const roadmap = recs.find(r => r.capabilities.includes('personalized_roadmap'))!
  const build = recs.find(r => r.capabilities.includes('build_access'))!
  assert.equal(roadmap.expiresAt, null)
  assert.equal(entitlementGrantsCapabilityAt(roadmap, 'personalized_roadmap', AFTER_EXPIRY), true)
  assert.equal(build.expiresAt, BUILD_EXPIRES)
  assert.equal(entitlementGrantsCapabilityAt(build, 'build_access', JUST_AFTER), true)
  assert.equal(entitlementGrantsCapabilityAt(build, 'build_access', BUILD_EXPIRES), false)
  // Deterministic ids derived from the session id.
  assert.deepEqual(recs.map(r => r.id).sort(), ['cs_test_1:build', 'cs_test_1:roadmap'])
})

test('cp3: Build derives one subscription record bounded by the period end', () => {
  const recs = deriveEntitlementsFromCheckout(input({ planId: 'build', periodEnd: BUILD_EXPIRES }))
  assert.equal(recs.length, 1)
  assert.equal(recs[0].product, 'build_monthly')
  assert.equal(recs[0].source, 'subscription')
  assert.deepEqual(recs[0].capabilities, ['build_access'])
  assert.equal(recs[0].expiresAt, BUILD_EXPIRES)
})

test('cp3: Growth derives build + growth capabilities', () => {
  const recs = deriveEntitlementsFromCheckout(input({ planId: 'growth', periodEnd: BUILD_EXPIRES }))
  assert.equal(recs.length, 1)
  assert.equal(recs[0].product, 'growth_monthly')
  assert.deepEqual(recs[0].capabilities, ['build_access', 'growth_access'])
})

test('cp3: Founding Lifetime derives an unbounded purchase record that is an inventory candidate', () => {
  const recs = deriveEntitlementsFromCheckout(input({ planId: 'founding_lifetime', externalTransactionRef: 'pi_f' }))
  assert.equal(recs.length, 1)
  assert.equal(recs[0].product, 'founding_lifetime')
  assert.equal(recs[0].source, 'purchase')
  assert.equal(recs[0].expiresAt, null)
  assert.deepEqual(recs[0].capabilities, ['build_access', 'growth_access', 'founding_lifetime_access'])
  assert.equal(isFoundingInventoryCandidate(recs[0]), true)
})

test('cp3: the free plan derives no entitlement', () => {
  assert.deepEqual(deriveEntitlementsFromCheckout(input({ planId: 'initial_direction' })), [])
})

test('cp3: provisioning is deterministic for the same input', () => {
  assert.deepEqual(deriveEntitlementsFromCheckout(input()), deriveEntitlementsFromCheckout(input()))
})

test('cp3: idempotency key is trimmed and rejects blanks', () => {
  assert.equal(webhookEventIdempotencyKey('evt_1'), 'evt_1')
  assert.equal(webhookEventIdempotencyKey('  evt_2  '), 'evt_2')
  assert.equal(webhookEventIdempotencyKey(''), null)
  assert.equal(webhookEventIdempotencyKey(undefined), null)
})

test('cp3: duplicate webhook events are detected via membership', () => {
  const seen = new Set(['evt_1', 'evt_2'])
  assert.equal(isDuplicateWebhookEvent(seen, 'evt_1'), true)
  assert.equal(isDuplicateWebhookEvent(seen, 'evt_3'), false)
  assert.equal(isDuplicateWebhookEvent(['evt_9'], 'evt_9'), true)
  assert.equal(isDuplicateWebhookEvent(null, 'evt_1'), false)
})

test('cp3: lifecycle transitions end access and never mutate the original', () => {
  const [, build] = deriveEntitlementsFromCheckout(input())
  const at = JUST_AFTER

  const refunded = applyRefund(build, at)
  assert.equal(refunded.status, 'refunded')
  assert.equal(refunded.refundedAt, at)
  assert.equal(isEntitlementActiveAt(refunded, JUST_AFTER), false)
  assert.equal(build.status, 'active') // original untouched

  assert.equal(isEntitlementActiveAt(applyDispute(build, at), JUST_AFTER), false)
  assert.equal(isEntitlementActiveAt(applyRevocation(build, at), JUST_AFTER), false)
  assert.equal(isEntitlementActiveAt(applyExpiration(build, at), JUST_AFTER), false)

  // Cancellation keeps access until the existing expiresAt (CP1 technical rule).
  const canceled = applyCancellation(build, at)
  assert.equal(canceled.status, 'canceled')
  assert.equal(isEntitlementActiveAt(canceled, JUST_AFTER), true)
  assert.equal(isEntitlementActiveAt(canceled, AFTER_EXPIRY), false)
})

test('cp3: event classifier maps known events and is conservative otherwise', () => {
  assert.equal(classifyWebhookEvent('checkout.session.completed'), 'provision')
  assert.equal(classifyWebhookEvent('customer.subscription.deleted'), 'expire')
  assert.equal(classifyWebhookEvent('charge.refunded'), 'refund')
  assert.equal(classifyWebhookEvent('charge.dispute.created'), 'dispute')
  assert.equal(classifyWebhookEvent('invoice.payment_failed'), 'none') // grace, no access change
  assert.equal(classifyWebhookEvent('something.unknown'), 'none')
})

test('cp3: entitlement → row mapping is faithful (snake_case, no sensitive columns)', () => {
  const [build] = deriveEntitlementsFromCheckout(input({ planId: 'build', periodEnd: BUILD_EXPIRES }))
  const row = entitlementToRow(build)
  assert.equal(row.id, build.id)
  assert.equal(row.owner_user_id, 'owner_1')
  assert.equal(row.product, 'build_monthly')
  assert.equal(row.status, 'active')
  assert.equal(row.expires_at, BUILD_EXPIRES)
  assert.equal(row.external_transaction_ref, 'pi_123')
  assert.deepEqual(row.capabilities, ['build_access'])
  // No card/bank/token columns are produced.
  assert.equal(Object.keys(row).some(k => /card|cvv|token|secret|password/i.test(k)), false)
})
