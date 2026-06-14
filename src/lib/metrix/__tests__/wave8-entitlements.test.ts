// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP1 — commercial entitlement domain (Node runner).
// Proves the pure entitlement model: product→capability intent, the inclusive-start /
// exclusive-end access window, the status→access rule, the Roadmap Pass bounded 30-day Build
// grant, effective-access combination across overlapping records, and the conservative Founding
// Lifetime completed-purchase inventory eligibility safeguards. No Stripe / checkout / I/O here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ENTITLEMENT_SCHEMA_VERSION,
  ROADMAP_PASS_BUILD_ACCESS_DAYS,
  intendedCapabilities,
  type EntitlementRecord,
  type EntitlementProductKey,
  type EntitlementCapability,
  type EntitlementStatus,
} from '../../entitlements/types'
import {
  isValidEntitlementRecord,
  isSupportedSchemaVersion,
  isEntitlementActiveAt,
  entitlementGrantsCapabilityAt,
  computeExpiration,
  effectiveCapabilitiesAt,
  resolveEffectiveAccess,
  createRoadmapPassBuildAccessGrant,
  createRoadmapPassEntitlements,
  foundingInventoryExclusionReason,
  isFoundingInventoryCandidate,
} from '../../entitlements/entitlements'

// Fixed, explicit timestamps — every time-based helper takes the eval time as input.
const ACTIVATED = '2026-06-14T00:00:00.000Z'
const JUST_AFTER = '2026-06-14T00:00:01.000Z'
const BUILD_EXPIRES = '2026-07-14T00:00:00.000Z' // ACTIVATED + 30 days (exclusive)
const JUST_BEFORE_EXPIRY = '2026-07-13T23:59:59.000Z'
const AFTER_EXPIRY = '2026-07-15T00:00:00.000Z'

function makeRecord(over: Partial<EntitlementRecord> = {}): EntitlementRecord {
  return {
    id: 'ent_1',
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: 'owner_1',
    product: 'build_monthly',
    capabilities: ['build_access'],
    source: 'purchase',
    status: 'active',
    createdAt: ACTIVATED,
    activatedAt: ACTIVATED,
    expiresAt: BUILD_EXPIRES,
    ...over,
  }
}

// ── product → capability intent ───────────────────────────────────────────────────

test('Initial Direction intent grants the initial_direction capability', () => {
  assert.deepEqual(intendedCapabilities('initial_direction'), ['initial_direction'])
})

test('product→capability intent matches the approved model', () => {
  assert.deepEqual(intendedCapabilities('roadmap_pass'), ['personalized_roadmap', 'build_access'])
  assert.deepEqual(intendedCapabilities('build_monthly'), ['build_access'])
  assert.deepEqual(intendedCapabilities('growth_monthly'), ['build_access', 'growth_access'])
  assert.deepEqual(intendedCapabilities('founding_lifetime'), [
    'build_access',
    'growth_access',
    'founding_lifetime_access',
  ])
})

test('Initial Direction record grants its capability while active', () => {
  const rec = makeRecord({
    product: 'initial_direction',
    capabilities: ['initial_direction'],
    source: 'promotion',
    expiresAt: null,
  })
  assert.equal(entitlementGrantsCapabilityAt(rec, 'initial_direction', JUST_AFTER), true)
})

// ── Roadmap Pass bounded 30-day Build window ───────────────────────────────────────

test('Roadmap Pass grants the personalized_roadmap capability (persistent record)', () => {
  const [roadmap] = createRoadmapPassEntitlements({
    id: 'rm_roadmap',
    buildAccessId: 'rm_build',
    ownerId: 'owner_1',
    activatedAt: ACTIVATED,
  })
  assert.equal(roadmap.expiresAt, null)
  assert.equal(entitlementGrantsCapabilityAt(roadmap, 'personalized_roadmap', AFTER_EXPIRY), true)
})

test('Roadmap Pass Build grant expires exactly 30 days out (exclusive)', () => {
  const grant = createRoadmapPassBuildAccessGrant({
    id: 'rm_build',
    ownerId: 'owner_1',
    activatedAt: ACTIVATED,
  })
  assert.equal(grant.expiresAt, BUILD_EXPIRES)
  assert.equal(grant.capabilities.length, 1)
  assert.equal(grant.capabilities[0], 'build_access')
  assert.equal(ROADMAP_PASS_BUILD_ACCESS_DAYS, 30)
})

test('Roadmap Pass Build access is active immediately after activation', () => {
  const grant = createRoadmapPassBuildAccessGrant({ id: 'b', ownerId: 'o', activatedAt: ACTIVATED })
  assert.equal(isEntitlementActiveAt(grant, ACTIVATED), true) // startsAt inclusive
  assert.equal(entitlementGrantsCapabilityAt(grant, 'build_access', JUST_AFTER), true)
})

test('Roadmap Pass Build access is active just before the 30-day expiration', () => {
  const grant = createRoadmapPassBuildAccessGrant({ id: 'b', ownerId: 'o', activatedAt: ACTIVATED })
  assert.equal(entitlementGrantsCapabilityAt(grant, 'build_access', JUST_BEFORE_EXPIRY), true)
})

test('Roadmap Pass Build access is inactive at and after expiration (expiresAt exclusive)', () => {
  const grant = createRoadmapPassBuildAccessGrant({ id: 'b', ownerId: 'o', activatedAt: ACTIVATED })
  assert.equal(entitlementGrantsCapabilityAt(grant, 'build_access', BUILD_EXPIRES), false) // exclusive
  assert.equal(entitlementGrantsCapabilityAt(grant, 'build_access', AFTER_EXPIRY), false)
})

// ── Build / Growth / Founding capability shape ─────────────────────────────────────

test('Build Monthly is active within window and inactive outside it', () => {
  const rec = makeRecord({ product: 'build_monthly', capabilities: ['build_access'] })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), true)
  assert.equal(isEntitlementActiveAt(rec, AFTER_EXPIRY), false)
  assert.equal(entitlementGrantsCapabilityAt(rec, 'build_access', JUST_AFTER), true)
  assert.equal(entitlementGrantsCapabilityAt(rec, 'growth_access', JUST_AFTER), false)
})

test('Growth grants both build_access and growth_access while active', () => {
  const rec = makeRecord({
    product: 'growth_monthly',
    capabilities: ['build_access', 'growth_access'],
    source: 'subscription',
  })
  assert.equal(entitlementGrantsCapabilityAt(rec, 'build_access', JUST_AFTER), true)
  assert.equal(entitlementGrantsCapabilityAt(rec, 'growth_access', JUST_AFTER), true)
})

test('Founding Lifetime grants its intended capabilities while active', () => {
  const rec = makeRecord({
    product: 'founding_lifetime',
    capabilities: ['build_access', 'growth_access', 'founding_lifetime_access'],
    expiresAt: null,
    externalTransactionRef: 'txn_abc',
  })
  for (const cap of ['build_access', 'growth_access', 'founding_lifetime_access'] as EntitlementCapability[]) {
    assert.equal(entitlementGrantsCapabilityAt(rec, cap, AFTER_EXPIRY), true)
  }
})

// ── status → access rules ──────────────────────────────────────────────────────────

test('pending does not grant access', () => {
  const rec = makeRecord({ status: 'pending' })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('expired does not grant access', () => {
  const rec = makeRecord({ status: 'expired' })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('revoked does not grant access even within the time window', () => {
  const rec = makeRecord({ status: 'revoked', revokedAt: JUST_AFTER })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('refunded does not grant access even within the time window', () => {
  const rec = makeRecord({ status: 'refunded', refundedAt: JUST_AFTER })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('disputed does not grant access even within the time window', () => {
  const rec = makeRecord({ status: 'disputed', disputedAt: JUST_AFTER })
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('canceled follows the technical rule: access until expiresAt, then none (no legal claim)', () => {
  // Technical access rule only: a canceled record stops renewing but its already-granted window is
  // honored until the existing expiresAt. This asserts no cancellation/refund legal right.
  const rec = makeRecord({ status: 'canceled', canceledAt: JUST_AFTER })
  assert.equal(isEntitlementActiveAt(rec, JUST_BEFORE_EXPIRY), true)
  assert.equal(isEntitlementActiveAt(rec, BUILD_EXPIRES), false)
  assert.equal(isEntitlementActiveAt(rec, AFTER_EXPIRY), false)
})

// ── combining / overlapping records ────────────────────────────────────────────────

test('effective capability set is the union across active records', () => {
  const build = makeRecord({ id: 'b', capabilities: ['build_access'] })
  const growth = makeRecord({
    id: 'g',
    product: 'growth_monthly',
    capabilities: ['build_access', 'growth_access'],
  })
  const caps = effectiveCapabilitiesAt([build, growth], JUST_AFTER)
  assert.equal(caps.has('build_access'), true)
  assert.equal(caps.has('growth_access'), true)
  assert.equal(caps.has('founding_lifetime_access'), false)
})

test('overlapping records resolve build_access effective end to the later expiry', () => {
  const shortWindow = makeRecord({ id: 'short', expiresAt: BUILD_EXPIRES })
  const longWindow = makeRecord({ id: 'long', expiresAt: '2026-08-14T00:00:00.000Z' })
  const access = resolveEffectiveAccess([shortWindow, longWindow], JUST_AFTER)
  assert.equal(access.granted.build_access, true)
  assert.equal(access.effectiveUntil.build_access, '2026-08-14T00:00:00.000Z')
  assert.deepEqual(access.activeRecordIds.sort(), ['long', 'short'])
})

test('an unbounded active record makes the capability effective end null', () => {
  const bounded = makeRecord({ id: 'b', expiresAt: BUILD_EXPIRES })
  const lifetime = makeRecord({
    id: 'life',
    product: 'founding_lifetime',
    capabilities: ['build_access'],
    expiresAt: null,
    externalTransactionRef: 'txn_x',
  })
  const access = resolveEffectiveAccess([bounded, lifetime], JUST_AFTER)
  assert.equal(access.granted.build_access, true)
  assert.equal(access.effectiveUntil.build_access, null)
})

test('inactive records never contribute to the effective set', () => {
  const expired = makeRecord({ id: 'x', status: 'revoked' })
  const access = resolveEffectiveAccess([expired], JUST_AFTER)
  assert.deepEqual(access.capabilities, [])
  assert.deepEqual(access.activeRecordIds, [])
})

// ── fail-safe validity ─────────────────────────────────────────────────────────────

test('invalid evaluation timestamps fail safely', () => {
  const rec = makeRecord()
  assert.equal(isEntitlementActiveAt(rec, 'not-a-date'), false)
  assert.equal(isEntitlementActiveAt(rec, ''), false)
})

test('computeExpiration fails safely on bad inputs', () => {
  assert.equal(computeExpiration('nope', 30), null)
  assert.equal(computeExpiration(ACTIVATED, 0), null)
  assert.equal(computeExpiration(ACTIVATED, -5), null)
  assert.equal(computeExpiration(ACTIVATED, 1.5), null)
  assert.equal(computeExpiration(ACTIVATED, 30), BUILD_EXPIRES)
})

test('unknown schema version fails safely (unsupported, not silently valid)', () => {
  assert.equal(isSupportedSchemaVersion(999), false)
  const rec = makeRecord({ schemaVersion: 999 })
  assert.equal(isValidEntitlementRecord(rec), false)
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), false)
})

test('structurally broken records are rejected', () => {
  assert.equal(isValidEntitlementRecord(null), false)
  assert.equal(isValidEntitlementRecord({}), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ product: 'bogus' as EntitlementProductKey })), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ status: 'bogus' as EntitlementStatus })), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ id: '' })), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ ownerId: '' })), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ expiresAt: 'not-a-date' })), false)
})

test('metadata with sensitive keys or non-primitive values is rejected', () => {
  assert.equal(isValidEntitlementRecord(makeRecord({ metadata: { card_last4: '4242' } })), false)
  assert.equal(isValidEntitlementRecord(makeRecord({ metadata: { password: 'x' } })), false)
  // Nested objects are not safe metadata.
  assert.equal(
    isValidEntitlementRecord(makeRecord({ metadata: { nested: { a: 1 } } as never })),
    false,
  )
  // Flat primitives are fine.
  assert.equal(isValidEntitlementRecord(makeRecord({ metadata: { plan_label: 'build', seat: 7 } })), true)
})

// ── Founding Lifetime inventory safeguards ─────────────────────────────────────────

function foundingRecord(over: Partial<EntitlementRecord> = {}): EntitlementRecord {
  return makeRecord({
    id: 'f',
    product: 'founding_lifetime',
    capabilities: ['build_access', 'growth_access', 'founding_lifetime_access'],
    source: 'purchase',
    status: 'active',
    expiresAt: null,
    externalTransactionRef: 'txn_complete',
    ...over,
  })
}

test('an eligible completed Founding purchase is recognized as an inventory candidate', () => {
  assert.equal(foundingInventoryExclusionReason(foundingRecord()), null)
  assert.equal(isFoundingInventoryCandidate(foundingRecord()), true)
})

test('administrative Founding grant does not count toward inventory', () => {
  const rec = foundingRecord({ source: 'administrative' })
  assert.equal(foundingInventoryExclusionReason(rec), 'non_purchase_source')
  assert.equal(isFoundingInventoryCandidate(rec), false)
})

test('promotional Founding grant does not count toward inventory', () => {
  const rec = foundingRecord({ source: 'promotion' })
  assert.equal(foundingInventoryExclusionReason(rec), 'non_purchase_source')
})

test('a missing external transaction reference does not count toward inventory', () => {
  assert.equal(foundingInventoryExclusionReason(foundingRecord({ externalTransactionRef: undefined })), 'missing_transaction_reference')
  assert.equal(foundingInventoryExclusionReason(foundingRecord({ externalTransactionRef: '' })), 'missing_transaction_reference')
})

test('pending / canceled / refunded / disputed / revoked Founding records do not count', () => {
  for (const status of ['pending', 'canceled', 'refunded', 'disputed', 'revoked'] as EntitlementStatus[]) {
    const rec = foundingRecord({ status })
    assert.equal(foundingInventoryExclusionReason(rec), 'status_not_completed_purchase', status)
    assert.equal(isFoundingInventoryCandidate(rec), false)
  }
})

test('a non-founding product never counts toward Founding inventory', () => {
  const rec = makeRecord({ product: 'build_monthly', externalTransactionRef: 'txn_x' })
  assert.equal(foundingInventoryExclusionReason(rec), 'not_founding_product')
})

test('an invalid record never counts toward Founding inventory', () => {
  assert.equal(foundingInventoryExclusionReason({}), 'invalid_record')
})

// ── determinism ─────────────────────────────────────────────────────────────────────

test('helpers are deterministic for the same timestamp', () => {
  const rec = makeRecord()
  const a = resolveEffectiveAccess([rec], JUST_AFTER)
  const b = resolveEffectiveAccess([rec], JUST_AFTER)
  assert.deepEqual(a, b)
  assert.equal(isEntitlementActiveAt(rec, JUST_AFTER), isEntitlementActiveAt(rec, JUST_AFTER))
})
