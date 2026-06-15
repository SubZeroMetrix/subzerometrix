// ─────────────────────────────────────────────────────────────────────────────
// Wave 9 CP6 — consolidated launch-readiness preservation gate (Node runner).
// One anchor that re-asserts the top-level launch invariants spanning Waves 1–9, so entering
// Wave 10A is verifiable from a single place: 10 trades, 6 states, 88/20 resources, all flags OFF,
// founding unknown, legacy checkout unchanged, approved homepage default, migration 005 additive +
// RLS, single canonical engine, no human coaching. Pure + source inspection.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { CANONICAL_TRADE_IDS, CANONICAL_STATE_IDS } from '../../metrix'
import { FEATURE_FLAGS, isFeatureEnabled } from '../../featureFlags'
import { FOUNDING_AVAILABILITY } from '../../pricing/foundingAvailability'
import { ACTIVATED_COUNT, HELD_COUNT } from '../../metrix/resourceLinkAudit'
import { isLegacyHomepageEnabled } from '../../home/homepageMode'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('gate: canonical coverage — 10 trades, 6 states', () => {
  assert.equal(CANONICAL_TRADE_IDS.length, 10)
  assert.equal(CANONICAL_STATE_IDS.length, 6)
})

test('gate: resource accounting reconciles (88/20)', () => {
  assert.equal(ACTIVATED_COUNT, 88)
  assert.equal(HELD_COUNT, 20)
})

test('gate: every feature flag defaults OFF; founding availability unknown', () => {
  for (const f of FEATURE_FLAGS) assert.equal(isFeatureEnabled(f, undefined, {}), false, `${f} OFF`)
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
})

test('gate: approved public homepage is default; legacy is rollback-only', () => {
  assert.equal(isLegacyHomepageEnabled({}), false)
  assert.equal(isLegacyHomepageEnabled({ NEXT_PUBLIC_USE_LEGACY_HOMEPAGE: 'true' }), true)
})

test('gate: legacy live checkout prices unchanged (no live Stripe change)', () => {
  const route = read('src/app/api/checkout/route.ts')
  assert.ok(/amount:\s*999\b/.test(route) && /amount:\s*1999\b/.test(route) && /amount:\s*2900\b/.test(route))
})

test('gate: migration 005 is additive + owner-scoped RLS (no destructive ops)', () => {
  const sql = read('supabase/migrations/005_commercial_entitlements.sql')
  assert.ok(/auth\.uid\(\) = owner_user_id/.test(sql))
  assert.equal(/drop table/i.test(sql), false)
})

test('gate: single canonical engine; canonical trade source unified', () => {
  const index = read('src/lib/metrix/index.ts')
  assert.ok(/toMetrixScore/.test(index))
  // Wave 9 CP2: both intelligence modules use the one shared source reader.
  assert.ok(/from '\.\/profileSources'/.test(read('src/lib/metrix/licensingIntelligence.ts')))
  assert.ok(/from '\.\/profileSources'/.test(read('src/lib/metrix/tradeIntelligence.ts')))
})

test('gate: no human-coaching language in the entitlement domain', () => {
  for (const f of ['types.ts', 'entitlements.ts', 'checkout.ts', 'provisioning.ts', 'foundingInventory.ts', 'session.ts', 'disclosures.ts', 'customerState.ts']) {
    const src = read(join('src/lib/entitlements', f))
    assert.equal(/\b(coaching|coach|mentor|consultant|done-for-you)\b/i.test(src), false, f)
  }
})
