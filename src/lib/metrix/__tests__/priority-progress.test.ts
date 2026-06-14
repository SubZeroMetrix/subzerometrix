// ─────────────────────────────────────────────────────────────────────────────
// SZM-2E — priority progress persistence tests (Node runner, memory storage stub).
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, getPrimaryActionSteps,
  createProgressRecord, recompute, selectPath, toggleStep, canCompleteStep,
  getActiveProgress, persistProgress, getProgressArchive,
  getPriorityProgressSyncReadiness, reconcilePriorityProgress, PRIORITY_PROGRESS_CLOUD_WIRED,
  type PersistedPriorityProgress,
} from '../index'

// In-memory localStorage so the device-local store works under Node.
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

// Licensing persona → recommended official_authority with 4 ordered steps (first is blocking).
const snap = evaluateMetrixProfile(
  { business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead },
  intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), { now: NOW, profileId: 'mp_A', assessmentId: 'as_A' })

// A different-priority snapshot (financial_visibility) for the priority-change test.
const snapB = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Texas', city: 'Dallas' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res', 'website', 'gbp'], financial: 'not_sure', customer_plan: 'existing_base', blocker: 'confidence', lead },
  intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas' }), { now: NOW, profileId: 'mp_B', assessmentId: 'as_B' })

const steps = getPrimaryActionSteps(snap)
const stepId = (i: number) => steps[i].stepId

// 1 — path selection persists.
test('SZM-2E: path selection persists', () => {
  let r = createProgressRecord(snap, NOW)
  const pathId = snap.recommendedCompletionPathId!
  r = selectPath(r, pathId, snap, NOW)
  assert.equal(r.selectedPathId, pathId)
  assert.notEqual(r.startedAt, null)
})

// 2 — step completion / uncompletion persists.
test('SZM-2E: step completion and uncompletion persist', () => {
  let r = createProgressRecord(snap, NOW)
  r = toggleStep(r, stepId(0), snap, NOW)
  assert.ok(r.completedStepIds.includes(stepId(0)))
  r = toggleStep(r, stepId(0), snap, NOW)
  assert.equal(r.completedStepIds.includes(stepId(0)), false)
})

// 3 — progress percent uses required steps only.
test('SZM-2E: progress percent uses required steps', () => {
  const required = steps.filter(s => !s.optional).length
  let r = createProgressRecord(snap, NOW)
  r = toggleStep(r, stepId(0), snap, NOW)
  assert.equal(r.completionPercent, Math.round((1 / required) * 100))
})

// 4 — prerequisites block invalid completion.
test('SZM-2E: a later step is blocked until the blocking first step is done', () => {
  let r = createProgressRecord(snap, NOW)
  assert.equal(canCompleteStep(r, snap, stepId(1)), false)   // step 2 blocked before step 1
  r = toggleStep(r, stepId(1), snap, NOW)                     // attempt → no-op
  assert.equal(r.completedStepIds.includes(stepId(1)), false)
  r = toggleStep(r, stepId(0), snap, NOW)                     // complete blocking step 1
  assert.equal(canCompleteStep(r, snap, stepId(1)), true)
  r = toggleStep(r, stepId(1), snap, NOW)
  assert.ok(r.completedStepIds.includes(stepId(1)))
})

// 5 — reassessment eligibility requires completion of required steps.
test('SZM-2E: reassessment eligible only when required steps complete', () => {
  let r = createProgressRecord(snap, NOW)
  assert.equal(r.reassessmentEligible, false)
  for (const s of steps.filter(x => !x.optional)) r = toggleStep(r, s.stepId, snap, NOW)
  assert.equal(r.reassessmentEligible, true)
  assert.ok(r.status === 'ready_for_review' || r.status === 'completed')
})

// 6 — anonymous reload resumes progress (device-local).
test('SZM-2E: anonymous reload resumes progress', () => {
  let r = getActiveProgress(snap, NOW)
  r = toggleStep(r, stepId(0), snap, NOW)
  persistProgress(r)
  const resumed = getActiveProgress(snap, LATER)
  assert.ok(resumed.completedStepIds.includes(stepId(0)))
  assert.equal(resumed.priorityId, snap.metrixPriority.priorityId)
})

// 7 — cloud sync is now WIRED (migration 004), but never fakes "synced" without a write.
test('SZM-2E: cloud sync is wired and truthful', async () => {
  assert.equal(PRIORITY_PROGRESS_CLOUD_WIRED, true)
  // No Supabase configured in the test env → honest device-local readiness, never synced.
  const r = await getPriorityProgressSyncReadiness()
  assert.equal(r.cloudWired, true)
  assert.notEqual(r.status, 'synced_to_account')
  assert.equal(r.canSync, false)            // no client in this env → cannot sync
  assert.ok(['saved_on_device', 'sign_in_to_back_up', 'sync_unavailable'].includes(r.status))
})

// 8 — without a Supabase session, readiness never reports a confirmed cloud write.
test('SZM-2E: never reports synced without a confirmed write', async () => {
  const r = await getPriorityProgressSyncReadiness()
  assert.equal(r.status === 'synced_to_account', false)
})

// 9 — reconciliation keeps newer/more-complete data (union, never lose).
test('SZM-2E: reconciliation unions completed steps, keeps newest selection', () => {
  const base = createProgressRecord(snap, NOW)
  const local: PersistedPriorityProgress = { ...base, completedStepIds: [stepId(0)], selectedPathId: 'path_a', updatedAt: NOW }
  const account: PersistedPriorityProgress = { ...base, completedStepIds: [stepId(0), stepId(1)], selectedPathId: 'path_b', updatedAt: LATER }
  const res = reconcilePriorityProgress(local, account)
  assert.equal(res.action, 'merged')
  assert.deepStrictEqual([...res.resolved!.completedStepIds].sort(), [stepId(0), stepId(1)].sort())
  assert.equal(res.resolved!.selectedPathId, 'path_b')        // newest wins
  // no account → keep local
  assert.equal(reconcilePriorityProgress(local, null).action, 'no_account')
  // never overwrite more-complete local with an older, less-complete account
  const olderAccount: PersistedPriorityProgress = { ...base, completedStepIds: [], selectedPathId: 'path_c', updatedAt: '2025-01-01T00:00:00.000Z' }
  const r2 = reconcilePriorityProgress({ ...local, completedStepIds: [stepId(0), stepId(1)] }, olderAccount)
  assert.equal(r2.resolved!.completedStepIds.length, 2)
})

// 10 — priority change starts a fresh active record; old is archived.
test('SZM-2E: priority change starts fresh active progress', () => {
  let a = getActiveProgress(snap, NOW)
  a = toggleStep(a, stepId(0), snap, NOW)
  persistProgress(a)
  const fresh = getActiveProgress(snapB, LATER)               // different priority
  assert.equal(fresh.completedStepIds.length, 0)
  assert.equal(fresh.priorityId, snapB.metrixPriority.priorityId)
  assert.ok(getProgressArchive().some(rec => rec.priorityId === snap.metrixPriority.priorityId))
})

// 11 — stale / historical step ids are ignored safely.
test('SZM-2E: stale step ids are pruned without crashing', () => {
  const r = createProgressRecord(snap, NOW)
  const withStale: PersistedPriorityProgress = { ...r, completedStepIds: [stepId(0), 'step_bogus_99'] }
  const cleaned = recompute(withStale, snap, NOW)
  assert.equal(cleaned.completedStepIds.includes('step_bogus_99'), false)
  assert.ok(cleaned.completedStepIds.includes(stepId(0)))
})

// 12 — the data the UI binds (selected path, completed steps, percent, status) is correct.
test('SZM-2E: UI-bound progress data is correct', () => {
  let r = createProgressRecord(snap, NOW)
  r = selectPath(r, snap.recommendedCompletionPathId!, snap, NOW)
  r = toggleStep(r, stepId(0), snap, NOW)
  assert.equal(r.selectedPathId, snap.recommendedCompletionPathId)
  assert.ok(r.completedStepIds.length === 1)
  assert.ok(r.completionPercent > 0)
  assert.ok(['in_progress', 'ready_for_review', 'completed'].includes(r.status))
})

// 13 — scoring / priority / path derivation remains unchanged.
test('SZM-2E: scoring + priority + path derivation unchanged', () => {
  assert.equal(snap.metrixPriority.domain, 'licensing')
  assert.equal(snap.criticalGates.find(g => g.id === 'gate_licensing')!.title, 'Trade licensing not confirmed')
  assert.ok(snap.completionPaths.length >= 1)
})

// 14 — deterministic operations.
test('SZM-2E: operations are deterministic', () => {
  const a = toggleStep(createProgressRecord(snap, NOW), stepId(0), snap, NOW)
  const b = toggleStep(createProgressRecord(snap, NOW), stepId(0), snap, NOW)
  assert.deepStrictEqual(a, b)
})
