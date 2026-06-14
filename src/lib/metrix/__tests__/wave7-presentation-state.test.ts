// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — presentation-state mapper tests (Node runner).
// Deterministic checks that the Checkpoint 2 design-system state mappers translate the
// ALREADY-DERIVED canonical state strings to honest display descriptors — and never invent
// confidence, recompute a score, or crash on malformed input.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { scoreBand, TEMPERATURE } from '../../ui/tokens'
import {
  confidencePresentation, freshnessPresentation, syncPresentation,
  riskPresentation, scorePresentation, toneClasses, type Tone,
} from '../../ui/presentationState'

test('scoreBand covers 0–100 contiguously, cold→hot, clamps out-of-range', () => {
  assert.equal(scoreBand(0).key, 'sub_zero')
  assert.equal(scoreBand(29).key, 'sub_zero')
  assert.equal(scoreBand(30).key, 'cold')
  assert.equal(scoreBand(49).key, 'cold')
  assert.equal(scoreBand(50).key, 'warm')
  assert.equal(scoreBand(69).key, 'warm')
  assert.equal(scoreBand(70).key, 'hot')
  assert.equal(scoreBand(84).key, 'hot')
  assert.equal(scoreBand(85).key, 'superheated')
  assert.equal(scoreBand(100).key, 'superheated')
  // out-of-range and NaN clamp safely, never throw
  assert.equal(scoreBand(-50).key, 'sub_zero')
  assert.equal(scoreBand(9999).key, 'superheated')
  assert.equal(scoreBand(NaN).key, 'sub_zero')
})

test('every score band maps to a real temperature color', () => {
  const tempColors = new Set<string>(TEMPERATURE.map(t => t.color))
  for (let n = 0; n <= 100; n += 5) {
    assert.ok(tempColors.has(scoreBand(n).color), `score ${n} color is a temperature color`)
  }
})

test('confidence mapping is honest: low/unknown never read as positive', () => {
  assert.equal(confidencePresentation('high').tone, 'positive')
  assert.equal(confidencePresentation('medium').tone, 'info')
  assert.equal(confidencePresentation('low').tone, 'caution')
  assert.equal(confidencePresentation('LOW').tone, 'caution') // case-insensitive
  const unknown = confidencePresentation(undefined)
  assert.equal(unknown.tone, 'neutral')
  assert.notEqual(unknown.tone, 'positive')
})

test('freshness mapping degrades stale/unknown to verify-before-acting tones', () => {
  assert.equal(freshnessPresentation('fresh').tone, 'positive')
  assert.equal(freshnessPresentation('aging').tone, 'info')
  assert.equal(freshnessPresentation('stale').tone, 'caution')
  assert.equal(freshnessPresentation('').tone, 'neutral')
  assert.match(freshnessPresentation('stale').description, /verify/i)
})

test('sync mapping covers every PresentationSyncStatus value', () => {
  assert.equal(syncPresentation('synced').tone, 'positive')
  assert.equal(syncPresentation('pending').tone, 'info')
  assert.equal(syncPresentation('offline').tone, 'caution')
  assert.equal(syncPresentation('conflict').tone, 'critical')
  assert.equal(syncPresentation('local_only').tone, 'info')
  assert.equal(syncPresentation('unknown').tone, 'neutral')
  assert.equal(syncPresentation('garbage').tone, 'neutral')
})

test('risk mapping tolerates multiple engine vocabularies', () => {
  assert.equal(riskPresentation('low').tone, 'positive')
  assert.equal(riskPresentation('strong').tone, 'positive')
  assert.equal(riskPresentation('moderate').tone, 'caution')
  assert.equal(riskPresentation('high').tone, 'critical')
  assert.equal(riskPresentation('critical').tone, 'critical')
  assert.equal(riskPresentation(null).tone, 'neutral')
})

test('scorePresentation returns a temperature color + tone without recomputing the number', () => {
  const p = scorePresentation(88)
  assert.equal(p.label, 'Superheated')
  assert.equal(p.color, scoreBand(88).color) // color comes from the band, not recomputed
  assert.ok(['positive', 'neutral'].includes(p.tone))
})

test('toneClasses returns class fragments for every tone', () => {
  const tones: Tone[] = ['positive', 'caution', 'critical', 'info', 'neutral']
  for (const t of tones) {
    const c = toneClasses(t)
    assert.ok(c.text && c.border && c.bg && c.dot, `tone ${t} has all fragments`)
  }
})

test('mappers are deterministic: same input → identical descriptor', () => {
  assert.deepEqual(confidencePresentation('medium'), confidencePresentation('medium'))
  assert.deepEqual(syncPresentation('offline'), syncPresentation('offline'))
  assert.deepEqual(scorePresentation(42), scorePresentation(42))
})
