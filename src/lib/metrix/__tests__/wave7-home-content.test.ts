// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — homepage content contract tests (Node runner).
// Deterministic checks on the Checkpoint 3 conversion architecture: exactly one primary CTA
// with the canonical label/target, canonical positioning, the real 6-stage lifecycle + a
// separate Recover path, the 8 audience entry points, all 10 trades and 6 states, links only
// to preserved routes, and NO hype / fake-proof / fake-scarcity phrasing.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  POSITIONING, PRIMARY_CTA, SECONDARY_LINKS, CONNECTED_SYSTEM,
  LIFECYCLE_STAGES, RECOVER_PATH, AUDIENCE_ROUTING, LAUNCH_TRADES, LAUNCH_STATES,
  MARKET_CLARITY, TRUST_POINTS, BANNED_HOMEPAGE_PHRASES, HOME_LINKED_ROUTES,
} from '../../home/homeContent'
import { ROUTE_INVENTORY } from '../../preservation/inventory'

test('positioning is the canonical Wave 7 language', () => {
  assert.equal(POSITIONING.tagline, 'Start it. Build it. Grow it.')
  assert.equal(POSITIONING.promise, 'Find the next business move that matters most.')
  assert.match(POSITIONING.forWho, /contractors, tradespeople, and service businesses/i)
})

test('there is exactly one primary CTA, with the canonical label → /start', () => {
  assert.equal(PRIMARY_CTA.label, 'Find My Next Move — Free')
  assert.equal(PRIMARY_CTA.href, '/start')
  // Secondary links must never reuse the primary label (no competing primary buttons).
  for (const l of SECONDARY_LINKS) assert.notEqual(l.label, PRIMARY_CTA.label)
})

test('connected system lists the five products in canonical order', () => {
  assert.deepEqual(
    CONNECTED_SYSTEM.map(s => s.name),
    ['Metrix Profile', 'MetrixScore', 'Metrix Priority', 'Metrix Roadmap', 'Metrix Progress'],
  )
  for (const s of CONNECTED_SYSTEM) assert.ok(s.what.length > 20, `${s.name} has an explanation`)
})

test('lifecycle is the canonical 6-stage line; Recover is a separate path', () => {
  assert.deepEqual([...LIFECYCLE_STAGES], [
    'Idea / Side Hustle', 'Startup Readiness', 'Launch', 'Stabilize', 'Grow', 'Scale',
  ])
  assert.equal(RECOVER_PATH.label, 'Recover')
  assert.ok(!LIFECYCLE_STAGES.includes('Recover' as never), 'Recover is not in the linear sequence')
})

test('all 8 audience entry points are present and unique', () => {
  assert.equal(AUDIENCE_ROUTING.length, 8)
  const keys = new Set(AUDIENCE_ROUTING.map(a => a.key))
  assert.equal(keys.size, 8)
  const labels = AUDIENCE_ROUTING.map(a => a.label.toLowerCase())
  for (const needed of [
    'exploring an idea', 'starting a side hustle', 'preparing to launch', 'newly launched',
    'stabilizing', 'growing', 'scaling', 'recovering',
  ]) {
    assert.ok(labels.includes(needed), `audience routing includes "${needed}"`)
  }
})

test('all 10 launch trades and 6 launch states are first-class', () => {
  assert.equal(LAUNCH_TRADES.length, 10)
  assert.equal(LAUNCH_STATES.length, 6)
  assert.deepEqual(LAUNCH_STATES.map(s => s.code), ['FL', 'CO', 'TX', 'AZ', 'OH', 'NC'])
})

test('market clarity states verify-before-acting and bounded-depth truths', () => {
  const joined = MARKET_CLARITY.join(' ').toLowerCase()
  assert.match(joined, /verify/i)
  assert.match(joined, /official authorities/i)
  assert.match(joined, /not equally deep/i)
  assert.match(joined, /not legal advice/i)
})

test('homepage copy contains none of the banned hype / fake-proof phrases', () => {
  const corpus = [
    POSITIONING.tagline, POSITIONING.promise, POSITIONING.forWho,
    ...CONNECTED_SYSTEM.flatMap(s => [s.name, s.what]),
    ...MARKET_CLARITY,
    ...TRUST_POINTS.flatMap(t => [t.title, t.body]),
    RECOVER_PATH.note,
  ].join(' \n ').toLowerCase()
  for (const phrase of BANNED_HOMEPAGE_PHRASES) {
    assert.ok(!corpus.includes(phrase.toLowerCase()), `copy must not contain "${phrase}"`)
  }
})

test('every internal route the homepage links to is a preserved route', () => {
  const preserved = new Set(ROUTE_INVENTORY.map(r => r.path))
  for (const href of HOME_LINKED_ROUTES) {
    assert.ok(preserved.has(href), `linked route ${href} exists in ROUTE_INVENTORY`)
  }
})
