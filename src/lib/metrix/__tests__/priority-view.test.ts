// ─────────────────────────────────────────────────────────────────────────────
// SZM-2B — priority experience view-model tests (Node runner).
// The interactive component is a thin renderer over buildPriorityView(); these tests
// cover the read-only, deterministic presentation logic without a DOM.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { MetrixScoreSnapshot } from '../../metrixHistory'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, buildPriorityView, getPrimaryActionSteps, adaptLegacyHistorySnapshot,
} from '../index'

const NOW = '2026-01-01T00:00:00.000Z'
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const ALL_SETUP = ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res', 'website', 'gbp']
const lead = { firstName: 'X', email: 'x@example.com' }

const readySnap = evaluateMetrixProfile(
  { business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead },
  intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), { now: NOW, profileId: 'mp_r' })

const blockedSnap = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['none_yet'], financial: 'under_2k', customer_plan: 'no_plan', blocker: 'pricing', lead },
  intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas' }), { now: NOW, profileId: 'mp_bl' })

const strongSnap = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Arizona', city: 'Mesa' }, stage: 'over_1yr', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'confidence', lead },
  intake({ stage: 'over_1yr', trade: 'hvac', region: 'Arizona', teamSize: '4_10', mainGoal: 'systematize' }), { now: NOW, profileId: 'mp_s' })

const view = buildPriorityView(readySnap)

// 1 — canonical priority renders.
test('SZM-2B: canonical priority renders', () => {
  assert.equal(view.state, 'ready')
  assert.ok(view.priority && view.priority.title.length > 0)
  assert.ok(view.priority!.requiredOutcome.length > 0)
})

// 2 — recommended path appears first; exactly one recommended.
test('SZM-2B: recommended path appears first', () => {
  assert.ok(view.paths.length >= 1)
  assert.equal(view.paths[0].recommended, true)
  assert.equal(view.paths.filter(p => p.recommended).length, 1)
  assert.equal(view.recommendedPathId, view.paths[0].pathId)
})

// 3 — alternatives render without appearing active/selected.
test('SZM-2B: alternatives render and none is selected', () => {
  assert.ok(view.paths.filter(p => !p.recommended).length >= 1)
  assert.equal(readySnap.priorityProgress.selectedPathId, null)
  assert.equal(readySnap.priorityProgress.status, 'not_started')
})

// 4 — first action matches the canonical first step.
test('SZM-2B: first action matches canonical first step', () => {
  assert.ok(view.firstAction)
  assert.equal(view.firstAction!.instruction, readySnap.metrixPriority.firstAction)
  assert.equal(view.firstAction!.instruction, getPrimaryActionSteps(readySnap)[0].instruction)
  assert.equal(view.firstAction!.isFirst, true)
})

// 5 — next-up bounded to three.
test('SZM-2B: next-up bounded to three', () => {
  for (const s of [readySnap, blockedSnap, strongSnap]) {
    assert.ok(buildPriorityView(s).nextUp.length <= 3)
  }
})

// 6 — blocked warning renders only when applicable.
test('SZM-2B: blocked warning renders when applicable', () => {
  assert.notEqual(buildPriorityView(blockedSnap).priority!.blockedWarning, null)
  assert.equal(buildPriorityView(strongSnap).priority!.blockedWarning, null)
})

// 7 — top next-best question renders when available.
test('SZM-2B: top next-best question renders', () => {
  assert.ok(view.topQuestion)
  assert.ok(view.topQuestion!.reason.length > 0)
  assert.ok(view.topQuestion!.impactLabel.length > 0)
})

// 8 — missing/legacy states do not crash.
test('SZM-2B: missing and legacy states are safe', () => {
  assert.equal(buildPriorityView(null).state, 'missing')
  const hist = { id: 'h1', createdAt: NOW, source: 'initial_assessment', overall: 50, categories: [], riskLevel: 'elevated', riskLabel: 'Elevated Risk', profileCompletion: 50, trade: 'hvac', region: 'Texas', businessStage: 'months_6_12', mainGoal: null, biggestChallenge: null } as unknown as MetrixScoreSnapshot
  const legacy = buildPriorityView(adaptLegacyHistorySnapshot(hist))
  assert.equal(legacy.state, 'legacy')
  assert.equal(legacy.paths.length, 0)
})

// 9 — the view mirrors the snapshot (no UI scoring/priority recomputation).
test('SZM-2B: view mirrors the snapshot, no recomputation', () => {
  assert.equal(view.priority!.title, readySnap.metrixPriority.title)
  assert.equal(view.priority!.requiredOutcome, readySnap.metrixPriority.requiredOutcome)
  assert.equal(view.recommendedPathId, readySnap.recommendedCompletionPathId)
  assert.equal(view.actionSteps.length, getPrimaryActionSteps(readySnap).length)
})

// 10 — deterministic rendering + accessible labels present.
test('SZM-2B: deterministic view with non-empty labels', () => {
  assert.deepStrictEqual(buildPriorityView(readySnap), buildPriorityView(readySnap))
  assert.ok(view.priority!.evidenceLabel.length > 0)
  assert.ok(view.paths[0].pathTypeLabel.length > 0)
  assert.ok(view.paths[0].effortLabel.length > 0 && view.paths[0].costLabel.length > 0)
})
