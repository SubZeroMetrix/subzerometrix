// ─────────────────────────────────────────────────────────────────────────────
// SZM-2F — reassessment & profile-update loop tests (Node runner, memory storage stub).
// Covers: unchanged inputs · meaningful change · priority change · history preservation ·
// completed-progress preservation · malformed legacy data · no reassessment before
// eligibility · repeat reassessment idempotency.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, getPrimaryActionSteps,
  createProgressRecord, toggleStep,
  reassessProfile, diffSnapshots,
  loadReassessmentHistory, saveReassessmentHistory, getLatestReassessment,
  type MetrixProfileSnapshot, type PersistedPriorityProgress, type ReassessmentRecord,
} from '../index'

// In-memory localStorage so the device-local history store works under Node.
;(() => {
  const store = new Map<string, string>()
  const g = globalThis as unknown as { window?: { localStorage: unknown } }
  g.window = g.window ?? ({} as { localStorage: unknown })
  g.window.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
    removeItem: (k: string) => { store.delete(k) },
    clear: () => { store.clear() },
  }
})()

const NOW = '2026-01-01T00:00:00.000Z'
const LATER = '2026-02-01T00:00:00.000Z'
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const lead = { firstName: 'X', email: 'x@example.com' }

// Licensing persona → priority domain 'licensing' (setup_steps lacks a license confirmation).
const ANS_LICENSING: RawAnswers = {
  business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12',
  setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'],
  financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead,
}
// Same persona, now with licensing handled → a meaningful profile change.
const ANS_LICENSED: RawAnswers = {
  ...ANS_LICENSING,
  setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res'],
}
// A clearly different persona → a different Metrix Priority (financial visibility).
const ANS_OTHER: RawAnswers = {
  business_type: 'hvac', location: { state: 'Texas', city: 'Dallas' }, stage: 'months_6_12',
  setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res', 'website', 'gbp'],
  financial: 'not_sure', customer_plan: 'existing_base', blocker: 'confidence', lead,
}

const IN_ELEC = intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' })
const IN_HVAC = intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas' })

const baseSnap = () =>
  evaluateMetrixProfile(ANS_LICENSING, IN_ELEC, { now: NOW, profileId: 'mp_X', assessmentId: 'as_X' })

// Build a fully-completed (reassessment-eligible) progress record for a snapshot.
function completedProgress(snap: MetrixProfileSnapshot): PersistedPriorityProgress {
  let r = createProgressRecord(snap, NOW)
  for (const s of getPrimaryActionSteps(snap).filter(x => !x.optional)) r = toggleStep(r, s.stepId, snap, NOW)
  assert.equal(r.reassessmentEligible, true) // guard: persona must reach eligibility
  return r
}

// 1 — unchanged inputs: not eligible + identical answers → safe no-op (no re-score).
test('SZM-2F: unchanged inputs are a no-op', () => {
  const snap = baseSnap()
  const progress = createProgressRecord(snap, NOW) // not eligible
  const res = reassessProfile(snap, progress, ANS_LICENSING, IN_ELEC, [], { now: LATER })
  assert.equal(res.status, 'skipped')
  assert.equal(res.trigger, 'none')
  assert.strictEqual(res.next, snap)              // snapshot untouched
  assert.equal(res.diff.hasChanges, false)
  assert.equal(res.record, null)
  assert.deepStrictEqual(res.history, [])
  assert.strictEqual(res.progress.active, progress) // progress preserved exactly
})

// 2 — a meaningful profile change re-scores and reports what changed.
test('SZM-2F: meaningful score/profile change is applied', () => {
  const snap = baseSnap()
  const progress = createProgressRecord(snap, NOW)
  const res = reassessProfile(snap, progress, ANS_LICENSED, IN_ELEC, [], { now: LATER })
  assert.equal(res.status, 'reassessed')
  assert.equal(res.trigger, 'profile_change')
  assert.equal(res.diff.hasChanges, true)
  assert.equal(res.next.profileId, snap.profileId)        // same canonical profile, updated
  assert.equal(res.next.source, 'reassessment')
  assert.equal(res.next.updatedAt, LATER)
  assert.ok(res.record)
  assert.equal(res.record!.newOverall, res.diff.score.next)
})

// 3 — a priority change archives the old progress and starts fresh (never lost).
test('SZM-2F: priority change archives old progress and restarts', () => {
  const snap = baseSnap()
  const progress = completedProgress(snap)
  const res = reassessProfile(snap, progress, ANS_OTHER, IN_HVAC, [], { now: LATER })
  assert.equal(res.status, 'reassessed')
  assert.equal(res.diff.priority.changed, true)
  assert.equal(res.progress.changed, true)
  assert.ok(res.progress.archived)                                  // old record kept as history
  assert.deepStrictEqual(res.progress.archived!.completedStepIds, progress.completedStepIds)
  assert.equal(res.progress.active.completedStepIds.length, 0)      // fresh — old steps never count anew
  assert.equal(res.progress.active.priorityId, res.next.metrixPriority.priorityId)
  assert.equal(res.record!.priorityChanged, true)
})

// 4 — history preservation: prior records are kept and the new one is appended (+ store round-trip).
test('SZM-2F: reassessment history is preserved and persists device-locally', () => {
  const snap = baseSnap()
  const prior: ReassessmentRecord = {
    id: 'ra_old', reassessedAt: '2025-12-01T00:00:00.000Z', profileId: 'mp_X', trigger: 'profile_change',
    previousOverall: 10, newOverall: 20, scoreDelta: 10, previousPriorityId: 'p_old', newPriorityId: 'p_old',
    priorityChanged: false, newlyTriggeredGateIds: [], newlyClearedGateIds: [], schemaVersion: 1,
  }
  const res = reassessProfile(snap, createProgressRecord(snap, NOW), ANS_OTHER, IN_HVAC, [prior], { now: LATER })
  assert.equal(res.history.length, 2)
  assert.strictEqual(res.history[0], prior)             // prior record untouched
  assert.equal(res.history[1], res.record)

  saveReassessmentHistory(res.history)
  const reloaded = loadReassessmentHistory()
  assert.equal(reloaded.length, 2)
  assert.equal(getLatestReassessment()!.id, res.record!.id)
})

// 5 — completed progress is preserved when the priority does not change.
test('SZM-2F: completed progress survives a same-priority reassessment', () => {
  const snap = baseSnap()
  const progress = completedProgress(snap)
  // Eligible + identical answers → runs, but the snapshot is materially identical.
  const res = reassessProfile(snap, progress, ANS_LICENSING, IN_ELEC, [], { now: LATER })
  assert.equal(res.status, 'unchanged')
  assert.equal(res.trigger, 'eligibility')
  assert.equal(res.progress.changed, false)
  assert.deepStrictEqual(res.progress.active.completedStepIds, progress.completedStepIds)
  assert.equal(res.progress.active.reassessmentEligible, true) // still eligible, nothing lost
})

// 6 — malformed / legacy records degrade safely (no throw).
test('SZM-2F: malformed legacy snapshot and progress do not throw', () => {
  const malformedPrev = { profileId: 'mp_legacy', normalizedAnswers: { rawAnswers: {} } } as unknown as MetrixProfileSnapshot
  const malformedProgress = { profileId: 'mp_legacy' } as unknown as PersistedPriorityProgress
  let threw = false
  let res!: ReturnType<typeof reassessProfile>
  try {
    res = reassessProfile(malformedPrev, malformedProgress, ANS_LICENSING, IN_ELEC, [], { now: LATER })
  } catch {
    threw = true
  }
  assert.equal(threw, false)
  assert.equal(res.status, 'reassessed')        // changed vs. the empty legacy answers
  assert.equal(res.next.profileId, 'mp_legacy') // still updates the same profile id
  // diffSnapshots is also independently null-safe.
  assert.doesNotThrow(() => diffSnapshots(malformedPrev, malformedPrev))
})

// 7 — no reassessment before eligibility (and no change) — the page-load guard.
test('SZM-2F: no reassessment before eligibility', () => {
  const snap = baseSnap()
  const notEligible = createProgressRecord(snap, NOW)
  assert.equal(notEligible.reassessmentEligible, false)
  const res = reassessProfile(snap, notEligible, ANS_LICENSING, IN_ELEC, [], { now: LATER })
  assert.equal(res.status, 'skipped')           // ineligible + unchanged → nothing happens
  assert.equal(res.record, null)
})

// 8 — repeat reassessment with the same inputs is idempotent (no history churn).
test('SZM-2F: repeat reassessment is idempotent', () => {
  const snap = baseSnap()
  const progress = completedProgress(snap)
  const first = reassessProfile(snap, progress, ANS_LICENSED, IN_ELEC, [], { now: LATER })
  assert.equal(first.status, 'reassessed')
  assert.equal(first.history.length, 1)

  // Re-run with the now-current snapshot/progress/answers → no new material change.
  const second = reassessProfile(first.next, first.progress.active, ANS_LICENSED, IN_ELEC, first.history, { now: '2026-03-01T00:00:00.000Z' })
  assert.notEqual(second.status, 'reassessed')  // 'unchanged' or 'skipped', never a fresh re-score
  assert.equal(second.record, null)
  assert.equal(second.history.length, 1)        // history did not grow
})

// 9 — determinism: identical inputs yield byte-identical diffs.
test('SZM-2F: diff is deterministic', () => {
  const snap = baseSnap()
  const a = reassessProfile(snap, createProgressRecord(snap, NOW), ANS_LICENSED, IN_ELEC, [], { now: LATER })
  const b = reassessProfile(snap, createProgressRecord(snap, NOW), ANS_LICENSED, IN_ELEC, [], { now: LATER })
  assert.deepStrictEqual(a.diff, b.diff)
})
