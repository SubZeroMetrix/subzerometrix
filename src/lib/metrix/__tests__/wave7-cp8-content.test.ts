// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — CP8 public content/discovery surface tests (Node runner).
// Verifies the canonical data the state/trade pages consume: 6 supported states with
// authorities + provenance + verify-before-action language, 10 first-class trades, and that the
// new /state/[state] + disclosure routes are registered (preservation). No competing engine.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { STATE_REGISTRY, CANONICAL_STATE_IDS, resolveState, CANONICAL_TRADE_IDS } from '../index'
import { ROUTE_INVENTORY } from '../../preservation/inventory'

test('all 6 launch states are supported with authorities, provenance, and verify-before-action', () => {
  assert.equal(CANONICAL_STATE_IDS.length, 6)
  assert.deepEqual([...CANONICAL_STATE_IDS], ['FL', 'CO', 'TX', 'AZ', 'OH', 'NC'])
  for (const id of CANONICAL_STATE_IDS) {
    const e = STATE_REGISTRY[id]
    assert.ok(e.displayName.length > 0)
    assert.ok(e.authorities.length >= 1, `${id} has at least one authority`)
    for (const a of e.authorities) assert.ok(a.name && a.role, `${id} authority has name + role`)
    assert.ok(e.reviewedDate.length > 0, `${id} has a reviewed date (provenance)`)
    assert.ok(e.verifyBeforeAction.length > 0, `${id} has verify-before-action language`)
    assert.ok(e.notes.length > 0, `${id} has state/local notes`)
  }
})

test('each state route param (lowercase code) resolves to its canonical state', () => {
  for (const id of CANONICAL_STATE_IDS) {
    assert.equal(resolveState(id.toLowerCase()).id, id)
  }
})

test('verify-before-action language makes no claim of legal certainty', () => {
  for (const id of CANONICAL_STATE_IDS) {
    const v = STATE_REGISTRY[id].verifyBeforeAction.toLowerCase()
    assert.ok(!/guarantee|guaranteed|legal advice|definitely compliant/.test(v), `${id} avoids certainty claims`)
  }
})

test('all 10 launch trades are first-class', () => {
  assert.equal(CANONICAL_TRADE_IDS.length, 10)
})

test('the new /state/[state] and /resource-directory-disclosure routes are registered + preserved', () => {
  const paths = new Set(ROUTE_INVENTORY.map(r => r.path))
  assert.ok(paths.has('/state/[state]'))
  assert.ok(paths.has('/resource-directory-disclosure'))
  for (const p of ['/state/[state]', '/resource-directory-disclosure']) {
    assert.equal(ROUTE_INVENTORY.find(r => r.path === p)!.preserve, true)
  }
  // No duplicate routes introduced.
  assert.equal(paths.size, ROUTE_INVENTORY.length)
})
