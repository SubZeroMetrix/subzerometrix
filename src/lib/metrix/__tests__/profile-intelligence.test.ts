// ─────────────────────────────────────────────────────────────────────────────
// Wave 2 — Profile Intelligence tests (Node runner). Deterministic coverage for:
// all lifecycle stages · transitions · completeness · evidence confidence · known vs
// unknown · next-best-question ranking · repeated-question prevention · priority
// explanation · unchanged reassessment · meaningful change · malformed legacy ·
// version/history preservation · identical-inputs determinism · no duplicate scoring.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, reassessProfile, createProgressRecord,
  assessLifecycle, deriveLifecycleStage, deriveStageConfidence, detectStageTransition,
  LIFECYCLE_VERSION, INTELLIGENCE_VERSION,
  deriveCompleteness, deriveEvidenceConfidence, deriveKnownFacts, deriveImportantUnknowns,
  selectProgressiveQuestions, explainPriorityDetail,
  deriveProfileIntelligence, deriveProfileHistory, deriveReassessmentTriggers, deriveOutcomeDefinitions,
  type MetrixProfileSnapshot, type BusinessStage, type CoverageLevel,
  type CriticalGate, type NextBestQuestion, type LifecycleStage,
} from '../index'

// In-memory localStorage (harmless; some adapters tolerate a browser env).
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

const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const NOW = '2026-01-01T00:00:00.000Z'

// Lightweight snapshot builder for pure lifecycle/stage mapping (only the read fields).
function lc(opts: {
  stage?: BusinessStage | ''
  overall?: number
  level?: CoverageLevel
  triggered?: Partial<CriticalGate>[]
  raw?: Record<string, unknown>
  notSure?: number
  evidenceQuality?: 'inferred' | 'self_reported' | 'mixed'
}): MetrixProfileSnapshot {
  return {
    businessContext: { stage: opts.stage ?? '', stageGroup: 'early', trade: null, region: null },
    readiness: { overall: opts.overall ?? 0 },
    criticalGates: (opts.triggered ?? []) as CriticalGate[],
    profileQuality: {
      coverage: { answered: 0, total: 21, level: opts.level ?? 'minimal' },
      evidenceQuality: opts.evidenceQuality ?? 'inferred',
      dataFreshness: { basisDate: NOW, category: 'fresh' },
      notSureCount: opts.notSure ?? 0,
    },
    normalizedAnswers: { rawAnswers: (opts.raw ?? {}) as RawAnswers, intake: null, stage: opts.stage ?? '', trade: null, region: null },
  } as unknown as MetrixProfileSnapshot
}

const gate = (over: Partial<CriticalGate>): Partial<CriticalGate> =>
  ({ id: 'g', domain: 'licensing', status: 'triggered', severity: 'blocking', title: 'Gate', blocksPaidWork: false, ...over })

// Real personas for integration tests.
const lead = { firstName: 'X', email: 'x@example.com' }
const ANS_LICENSING: RawAnswers = {
  business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12',
  setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'],
  financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead,
}
const ANS_LICENSED: RawAnswers = { ...ANS_LICENSING, setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res'] }
const IN_ELEC = intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' })
const realSnap = () => evaluateMetrixProfile(ANS_LICENSING, IN_ELEC, { now: NOW, profileId: 'mp_w2', assessmentId: 'as_w2' })

// ── 1. All lifecycle stages ──────────────────────────────────────────────────
test('w2: derives every lifecycle stage', () => {
  const cases: [MetrixProfileSnapshot, LifecycleStage][] = [
    [lc({ stage: 'thinking' }), 'Explore'],
    [lc({ stage: 'thinking', raw: { financial: 'k10_25' } }), 'Side Hustle'],
    [lc({ stage: 'planning' }), 'Prepare'],
    [lc({ stage: 'planning', raw: { customer_plan: 'existing_base' } }), 'Side Hustle'],
    [lc({ stage: 'launched_u6' }), 'Launch'],
    [lc({ stage: 'months_6_12' }), 'Stabilize'],
    [lc({ stage: 'over_1yr', overall: 50 }), 'Grow'],
    [lc({ stage: 'over_1yr', overall: 80, level: 'substantial', triggered: [] }), 'Scale'],
    [lc({ stage: 'reset' }), 'Recover'],
    [lc({ stage: '' }), 'Explore'],                                  // unknown stage default
  ]
  for (const [snap, expected] of cases) {
    assert.equal(deriveLifecycleStage(snap), expected, `expected ${expected}`)
  }
})

// over_1yr stays Grow (not Scale) when a paid-work gate is triggered.
test('w2: established + blocked stays Grow, not Scale', () => {
  const snap = lc({ stage: 'over_1yr', overall: 90, level: 'substantial', triggered: [gate({ blocksPaidWork: true })] })
  assert.equal(deriveLifecycleStage(snap), 'Grow')
})

// ── 2. Stage transitions ─────────────────────────────────────────────────────
test('w2: stage transitions report direction', () => {
  assert.deepEqual(
    pick(detectStageTransition(lc({ stage: 'thinking' }), lc({ stage: 'launched_u6' }))),
    { from: 'Explore', to: 'Launch', changed: true, direction: 'advanced' })
  assert.equal(detectStageTransition(lc({ stage: 'months_6_12' }), lc({ stage: 'thinking' })).direction, 'regressed')
  assert.equal(detectStageTransition(lc({ stage: 'over_1yr', overall: 80, level: 'substantial' }), lc({ stage: 'reset' })).direction, 'reset')
  assert.equal(detectStageTransition(lc({ stage: 'reset' }), lc({ stage: 'launched_u6' })).direction, 'advanced')
  assert.equal(detectStageTransition(lc({ stage: 'months_6_12' }), lc({ stage: 'months_6_12' })).changed, false)
})
function pick(t: ReturnType<typeof detectStageTransition>) { return { from: t.from, to: t.to, changed: t.changed, direction: t.direction } }

// ── 3. Completeness ──────────────────────────────────────────────────────────
test('w2: completeness percent + level', () => {
  const snap = { profileQuality: { coverage: { answered: 7, total: 21, level: 'partial' } } } as unknown as MetrixProfileSnapshot
  const c = deriveCompleteness(snap)
  assert.equal(c.answered, 7); assert.equal(c.total, 21); assert.equal(c.percent, 33); assert.equal(c.level, 'partial')
  // malformed → safe defaults.
  const empty = deriveCompleteness({} as MetrixProfileSnapshot)
  assert.equal(empty.percent, 0); assert.equal(empty.total, 21)
})

// ── 4. Evidence confidence ───────────────────────────────────────────────────
test('w2: evidence confidence is honest (never high while inferred)', () => {
  assert.equal(deriveEvidenceConfidence(lc({ level: 'substantial' })), 'medium')  // inferred-only capped
  assert.equal(deriveEvidenceConfidence(lc({ level: 'minimal' })), 'low')
  assert.equal(deriveEvidenceConfidence(lc({ level: 'partial' })), 'medium')
  assert.equal(deriveEvidenceConfidence(lc({ level: 'substantial', evidenceQuality: 'mixed' })), 'high')
})

// ── 5. Stage confidence ──────────────────────────────────────────────────────
test('w2: stage confidence reflects coverage + conflicts', () => {
  assert.equal(deriveStageConfidence(lc({ level: 'substantial', notSure: 0 })), 'high')
  assert.equal(deriveStageConfidence(lc({ level: 'minimal' })), 'low')
  assert.equal(deriveStageConfidence(lc({ level: 'partial' })), 'medium')
  // a data_quality conflict forces low.
  assert.equal(deriveStageConfidence(lc({ level: 'substantial', triggered: [gate({ domain: 'data_quality', status: 'triggered' })] })), 'low')
})

// ── 6. Known vs unknown fields ───────────────────────────────────────────────
test('w2: known facts vs important unknowns', () => {
  const snap = realSnap()
  const known = deriveKnownFacts(snap)
  assert.ok(known.some(f => f.key === 'trade' && f.value === 'electrical'))
  assert.ok(known.some(f => f.key === 'region' && f.value === 'Texas'))
  // A snapshot missing trade surfaces it as an important unknown.
  const noTrade = evaluateMetrixProfile({ ...ANS_LICENSING, business_type: '' }, intake({ stage: 'months_6_12', region: 'Texas' }), { now: NOW, profileId: 'mp_nt' })
  assert.ok(deriveImportantUnknowns(noTrade).some(u => u.key === 'trade'))
})

// ── 7. Next-best-question ranking + repeated-question prevention ──────────────
test('w2: progressive questions rank, dedupe, bound, and skip answered/dismissed', () => {
  const qs: NextBestQuestion[] = [
    q('q_a', 'k1', 'e1', 'changes_priority'),
    q('q_b', 'k1', 'e1b', 'confirms_gate'),   // duplicate questionKey → removed
    q('q_c', 'k2', 'e2', 'confirms_gate'),
    q('q_d', 'k3', 'e3', 'refines_roadmap'),
  ]
  const snap = (raw: Record<string, unknown> = {}) =>
    ({ nextBestQuestions: qs, normalizedAnswers: { rawAnswers: raw } } as unknown as MetrixProfileSnapshot)

  const top2 = selectProgressiveQuestions(snap(), { limit: 2 })
  assert.deepEqual(top2.map(x => x.questionKey), ['k1', 'k2'])      // ranked order preserved, deduped, bounded
  assert.equal(top2[0].candidateId, 'q_a')                          // question id preserved

  const dismissed = selectProgressiveQuestions(snap(), { limit: 5, dismissed: ['k2'] })
  assert.deepEqual(dismissed.map(x => x.questionKey), ['k1', 'k3']) // dismissed removed

  const answered = selectProgressiveQuestions(snap({ k1: 'yes' }), { limit: 5 })
  assert.equal(answered.some(x => x.questionKey === 'k1'), false)   // already answered → not re-asked

  assert.deepEqual(selectProgressiveQuestions(snap(), { limit: 0 }), [])
})
function q(candidateId: string, questionKey: string, evidenceKey: string, impact: NextBestQuestion['expectedDecisionImpact']): NextBestQuestion {
  return { candidateId, questionKey, evidenceKey, reason: `r_${questionKey}`, relatedGateId: null, expectedDecisionImpact: impact, urgency: 'now', blocking: false, currentDataStatus: 'missing', rank: 0 }
}

// ── 8. Priority explanation ──────────────────────────────────────────────────
test('w2: priority explanation is complete and explainable', () => {
  const snap = realSnap()
  const ex = explainPriorityDetail(snap)
  assert.equal(ex.title, snap.metrixPriority.title)            // reads canonical priority, not recomputed
  assert.ok(ex.whySelected.length > 0)
  assert.ok(ex.inputsAndRules.some(s => /priority order/i.test(s)))
  assert.ok(ex.gateInvolvement.length >= 1)                    // licensing gate feeds it
  assert.ok(ex.whatCouldChange.length > 0)
  assert.deepEqual(ex.whatStayedUnchanged, [])
  // supplying a reassessment diff's unchanged lines surfaces them.
  const ex2 = explainPriorityDetail(snap, { unchanged: ['Readiness score', 'Top priority'] })
  assert.deepEqual(ex2.whatStayedUnchanged, ['Readiness score', 'Top priority'])
})

// ── 9. Unchanged reassessment + meaningful change feed the explanation ────────
test('w2: unchanged vs meaningful reassessment reflected in intelligence', () => {
  const snap = realSnap()
  const progress = createProgressRecord(snap, NOW)
  // Unchanged: same answers, eligibility override → diff.unchanged is non-empty.
  const unchangedRes = reassessProfile(snap, progress, ANS_LICENSING, IN_ELEC, [], { now: NOW, eligibleOverride: true })
  const intelU = deriveProfileIntelligence(unchangedRes.next, { unchanged: unchangedRes.diff.unchanged })
  assert.ok(intelU.priorityExplanation.whatStayedUnchanged.length > 0)
  // Meaningful change: licensing handled → score/priority can change; lifecycle still derived.
  const changedRes = reassessProfile(snap, progress, ANS_LICENSED, IN_ELEC, [], { now: NOW, eligibleOverride: true })
  assert.equal(changedRes.status, 'reassessed')
  const intelC = deriveProfileIntelligence(changedRes.next)
  assert.equal(intelC.priorityExplanation.title, changedRes.next.metrixPriority.title)
})

// ── 10. Malformed / legacy records degrade safely ────────────────────────────
test('w2: malformed legacy snapshot does not throw', () => {
  assert.doesNotThrow(() => assessLifecycle({} as MetrixProfileSnapshot))
  let intel!: ReturnType<typeof deriveProfileIntelligence>
  assert.doesNotThrow(() => { intel = deriveProfileIntelligence({} as MetrixProfileSnapshot) })
  assert.equal(intel.lifecycle.stage, 'Explore')
  assert.equal(intel.completeness.percent, 0)
  assert.equal(intel.priorityExplanation.title, 'No active priority')
})

// ── 11. Versions + history preservation ──────────────────────────────────────
test('w2: versions and profile history are preserved', () => {
  const snap = realSnap()
  const intel = deriveProfileIntelligence(snap)
  assert.equal(intel.versions.profileSchemaVersion, snap.profileSchemaVersion)
  assert.equal(intel.versions.rulesetVersion, snap.rulesetVersion)
  assert.equal(intel.versions.lifecycleVersion, LIFECYCLE_VERSION)
  assert.equal(intel.versions.intelligenceVersion, INTELLIGENCE_VERSION)
  // history: empty records → one initial point; provided records preserved.
  assert.equal(deriveProfileHistory([], snap).length, 1)
  const records = [{
    id: 'ra_1', reassessedAt: NOW, profileId: 'mp_w2', trigger: 'profile_change' as const,
    previousOverall: 30, newOverall: 45, scoreDelta: 15, previousPriorityId: 'p1', newPriorityId: 'p2',
    priorityChanged: true, newlyTriggeredGateIds: [], newlyClearedGateIds: [], schemaVersion: 1,
  }]
  const hist = deriveProfileHistory(records, snap)
  assert.equal(hist.length, 1)
  assert.equal(hist[0].overall, 45)
  assert.deepEqual(records.length, 1)   // input not mutated
})

// ── 12. Reassessment triggers + outcome definitions ──────────────────────────
test('w2: reassessment triggers and outcome definitions derive from canonical priority', () => {
  const snap = realSnap()
  const triggers = deriveReassessmentTriggers(snap)
  assert.ok(triggers.some(t => t.id === 'priority_resolved'))
  assert.ok(triggers.some(t => t.id === 'situation_changed'))
  const outcomes = deriveOutcomeDefinitions(snap)
  assert.ok(outcomes.length >= 1)
  assert.equal(outcomes[0].id, snap.metrixPriority.priorityId)
  assert.equal(outcomes[0].definition, snap.metrixPriority.requiredOutcome)
})

// ── 13. Identical inputs → identical outputs (determinism) ────────────────────
test('w2: identical inputs produce identical intelligence', () => {
  const snap = realSnap()
  assert.deepStrictEqual(deriveProfileIntelligence(snap), deriveProfileIntelligence(snap))
  assert.deepStrictEqual(assessLifecycle(snap), assessLifecycle(snap))
})

// ── 14. No duplicate scoring/priority logic (reads canonical, never recomputes) ─
test('w2: intelligence reads the canonical priority/score, never recomputes', () => {
  const snap = realSnap()
  const intel = deriveProfileIntelligence(snap)
  // The intelligence priority MUST equal the canonical snapshot's priority verbatim.
  assert.equal(intel.priorityExplanation.title, snap.metrixPriority.title)
  assert.equal(intel.priorityExplanation.requiredOutcome, snap.metrixPriority.requiredOutcome)
  assert.equal(intel.priorityExplanation.evidenceStatus, snap.metrixPriority.evidenceStatus)
  // Completeness mirrors the canonical coverage count (no independent recount).
  assert.equal(intel.completeness.answered, snap.profileQuality.coverage.answered)
  // Re-evaluating the same answers yields the same canonical priority the layer reports.
  const snap2 = evaluateMetrixProfile(ANS_LICENSING, IN_ELEC, { now: NOW, profileId: 'mp_w2', assessmentId: 'as_w2' })
  assert.equal(snap2.metrixPriority.priorityId, snap.metrixPriority.priorityId)
})
