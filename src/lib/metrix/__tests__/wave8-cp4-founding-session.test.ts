// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP4 — Founding inventory counting + session verification (Node runner).
// Proves the founding counter derives strictly from eligible completed purchases and stays UNKNOWN
// (R9 fail-safe) until a caller explicitly asserts a reliable source; and that the checkout-session
// summary is privacy-safe (plan/product/capabilities only — never PII). No Stripe / network here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  countFoundingInventory,
  foundingInventorySourceFromRecords,
  resolveFoundingAvailabilityFromRecords,
} from '../../entitlements/foundingInventory'
import { summarizeCheckoutSession } from '../../entitlements/session'
import { deriveEntitlementsFromCheckout } from '../../entitlements/provisioning'
import { FOUNDING_AVAILABILITY } from '../../pricing/foundingAvailability'
import { ENTITLEMENT_SCHEMA_VERSION, type EntitlementRecord } from '../../entitlements/types'

const NOW = '2026-06-14T00:00:00.000Z'

function founding(over: Partial<EntitlementRecord> = {}): EntitlementRecord {
  return {
    id: 'f',
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: 'o',
    product: 'founding_lifetime',
    capabilities: ['build_access', 'growth_access', 'founding_lifetime_access'],
    source: 'purchase',
    status: 'active',
    createdAt: NOW,
    activatedAt: NOW,
    expiresAt: null,
    externalTransactionRef: 'pi_x',
    ...over,
  }
}

test('cp4: only eligible completed founding purchases are counted', () => {
  const records = [
    founding({ id: 'a', externalTransactionRef: 'pi_a' }), // counts
    founding({ id: 'b', externalTransactionRef: 'pi_b' }), // counts
    founding({ id: 'c', source: 'administrative' }), // excluded
    founding({ id: 'd', source: 'promotion' }), // excluded
    founding({ id: 'e', status: 'refunded' }), // excluded
    founding({ id: 'g', externalTransactionRef: undefined }), // excluded (no txn ref)
  ]
  assert.equal(countFoundingInventory(records), 2)
  assert.equal(countFoundingInventory([]), 0)
  assert.equal(countFoundingInventory(null as never), 0)
})

test('cp4: availability stays UNKNOWN with no reliable source (R9 fail-safe)', () => {
  const records = [founding({ id: 'a', externalTransactionRef: 'pi_a' })]
  const avail = resolveFoundingAvailabilityFromRecords(records) // default reliable=false
  assert.equal(avail.status, 'unknown')
  assert.equal(avail.remaining, null)
  assert.equal(avail.liveCounterActive, false)
})

test('cp4: a reliable source produces a clamped, truthful remaining count', () => {
  const two = [
    founding({ id: 'a', externalTransactionRef: 'pi_a' }),
    founding({ id: 'b', externalTransactionRef: 'pi_b' }),
  ]
  const avail = resolveFoundingAvailabilityFromRecords(two, { reliable: true })
  assert.equal(avail.status, 'available')
  assert.equal(avail.remaining, 98)
  assert.equal(avail.totalSeats, 100)
  assert.equal(avail.liveCounterActive, true)
})

test('cp4: a reliable empty source shows all seats available', () => {
  const avail = resolveFoundingAvailabilityFromRecords([], { reliable: true })
  assert.equal(avail.status, 'available')
  assert.equal(avail.remaining, 100)
})

test('cp4: the inventory source shape never counts non-candidates', () => {
  const src = foundingInventorySourceFromRecords([founding({ source: 'administrative' })], true)
  assert.equal(src.completedVerifiedPurchases, 0)
  assert.equal(src.reliable, true)
})

test('cp4: the SHIPPED founding availability remains UNKNOWN (no source wired)', () => {
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.remaining, null)
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
})

test('cp4: session summary is privacy-safe and derives the plan/capabilities', () => {
  const summary = summarizeCheckoutSession({
    payment_status: 'paid',
    metadata: { plan_id: 'build', account_user_id: 'u1' },
  })
  assert.equal(summary.paid, true)
  assert.equal(summary.planId, 'build')
  assert.equal(summary.productKey, 'build_monthly')
  assert.deepEqual(summary.capabilities, ['build_access'])
  // Privacy: the summary exposes no PII keys.
  assert.equal(Object.keys(summary).some(k => /email|name|amount|customer/i.test(k)), false)
})

test('cp4: unpaid or unknown-plan sessions summarize safely', () => {
  const unpaid = summarizeCheckoutSession({ payment_status: 'unpaid', metadata: { plan_id: 'build' } })
  assert.equal(unpaid.paid, false)

  const unknownPlan = summarizeCheckoutSession({ payment_status: 'paid', metadata: { plan_id: 'mystery' } })
  assert.equal(unknownPlan.planId, null)
  assert.deepEqual(unknownPlan.capabilities, [])

  const empty = summarizeCheckoutSession(null)
  assert.equal(empty.paid, false)
  assert.equal(empty.planId, null)
})

test('cp4: counting integrates with derived provisioning records', () => {
  const recs = deriveEntitlementsFromCheckout({
    planId: 'founding_lifetime',
    ownerId: 'o',
    activatedAt: NOW,
    idBase: 'cs_1',
    externalTransactionRef: 'pi_real',
  })
  assert.equal(countFoundingInventory(recs), 1)
})
