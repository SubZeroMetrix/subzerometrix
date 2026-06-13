// ─────────────────────────────────────────────────────────────────────────────
// SZM-2 — critical gates + Metrix Priority characterization tests (Node runner).
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateScores, type RawAnswers } from '../../scoring'
import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { MetrixScoreSnapshot } from '../../metrixHistory'
import {
  evaluateMetrixProfile, selectMetrixPriority, toMetrixScore,
  getMetrixPriority, getActiveCriticalGates, getNextBestQuestions, getBlockedRecommendations,
  adaptLegacyScoreResult, adaptLegacyHistorySnapshot, projectCanonicalToLegacyScoreResult,
  type CriticalGate, type ConstraintCandidate, type ProfileQuality, type GateDomain, type GateSeverity,
} from '../index'

const NOW = '2026-01-01T00:00:00.000Z'
const opts = (id: string) => ({ now: NOW, profileId: id })
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const ALL_SETUP = ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res', 'website', 'gbp']
const lead = { firstName: 'X', email: 'x@example.com' }

// Synthetic builders for direct POLICY tests (proves ranking independent of live data limits).
function gate(domain: GateDomain, severity: GateSeverity, o: Partial<CriticalGate> = {}): CriticalGate {
  return {
    id: `gate_${domain}`, domain, severity, status: 'triggered', title: `${domain} gate`,
    explanation: '', reasonCodes: [], triggeringEvidence: [], missingEvidence: [], affectedStage: 'all',
    blocksGrowth: false, blocksPaidWork: false, blocksStageAdvance: false, requiredOutcome: '',
    resolutionPathIds: [], evidenceStatus: 'evidence_backed', sourceType: 'assessment', rulesetVersion: 2, ...o,
  }
}
const growthConstraint: ConstraintCandidate = { category: 'growth_risk', label: 'Growth & Risk', score: 40, severity: 'moderate', rank: 1 }
const QUALITY: ProfileQuality = { coverage: { answered: 14, total: 21, level: 'substantial' }, evidenceQuality: 'inferred', dataFreshness: { basisDate: NOW, category: 'fresh' }, notSureCount: 0 }

// ── 1 — Licensing uncertainty outranks customer acquisition (live) ─────────────
test('SZM-2: licensing uncertainty outranks customer acquisition', () => {
  const a: RawAnswers = { business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'electrical', teamSize: '2_3' }), opts('mp1'))
  assert.equal(snap.metrixPriority.domain, 'licensing')
  assert.notEqual(snap.metrixPriority.domain, 'customer_path')
  assert.equal(getActiveCriticalGates(snap).some(g => g.domain === 'licensing'), true)
})

// ── 2 — Missing insurance outranks growth (live) ───────────────────────────────
test('SZM-2: missing insurance outranks growth', () => {
  const a: RawAnswers = { business_type: 'electrical', stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'license_res', 'website', 'gbp'], financial: 'over_25k', customer_plan: 'existing_base', blocker: 'confidence', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'electrical', teamSize: '2_3' }), opts('mp2'))
  assert.equal(snap.metrixPriority.domain, 'insurance')
  assert.equal(snap.metrixPriority.severity, 'blocking')
})

// ── 3 — Severe pricing risk outranks adding demand (live) ──────────────────────
test('SZM-2: pricing risk outranks adding demand', () => {
  const a: RawAnswers = { business_type: 'hvac', stage: 'months_6_12', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'pricing', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'hvac', teamSize: '2_3', biggestChallenge: 'pricing' }), opts('mp3'))
  assert.equal(snap.metrixPriority.domain, 'pricing')
})

// ── 4 — Capacity constraint blocks growth priority (policy) ────────────────────
test('SZM-2: capacity gate blocks growth priority', () => {
  const sel = selectMetrixPriority([gate('capacity', 'high', { blocksGrowth: true })], [growthConstraint], QUALITY)
  assert.equal(sel.primary.domain, 'capacity')
  assert.ok(sel.blockedRecommendations.length > 0)
  assert.equal(sel.blockedRecommendations[0].blockedByGateId, 'gate_capacity')
})

// ── 5 — Quality/callback risk outranks growth when supported (policy) ──────────
test('SZM-2: quality risk outranks growth when supported', () => {
  const sel = selectMetrixPriority([gate('quality', 'high')], [growthConstraint], QUALITY)
  assert.equal(sel.primary.domain, 'quality')
  assert.notEqual(sel.primary.domain, 'growth')
})

// ── 6 — Weak customer acquisition becomes primary when no higher gate (live) ──
test('SZM-2: weak acquisition is primary when no higher gate', () => {
  const a: RawAnswers = { business_type: 'plumbing', stage: 'months_6_12', setup_steps: ALL_SETUP, financial: 'k10_25', customer_plan: 'no_plan', blocker: 'customers', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'plumbing', teamSize: '2_3', mainGoal: 'more_leads', biggestChallenge: 'leads' }), opts('mp6'))
  assert.equal(snap.metrixPriority.domain, 'customer_path')
  assert.equal(getActiveCriticalGates(snap).some(g => ['licensing', 'entity', 'insurance', 'pricing'].includes(g.domain)), false)
})

// ── 7 — Strong operator receives no artificial blocking priority (live) ───────
test('SZM-2: strong operator gets outcome-leverage, not foundation busywork', () => {
  const a: RawAnswers = { business_type: 'hvac', stage: 'over_1yr', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'confidence', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'over_1yr', trade: 'hvac', teamSize: '4_10', mainGoal: 'systematize', confidence: 'high' }), opts('mp7'))
  assert.equal(['licensing', 'entity', 'insurance', 'banking'].includes(snap.metrixPriority.domain), false)
  assert.notEqual(snap.metrixPriority.severity, 'blocking')
  assert.equal(snap.metrixPriority.sourceGateIds.length, 0)
  assert.equal(getActiveCriticalGates(snap).length, 0)
})

// ── 8 — Incomplete info → unknown/possible, not false certainty (live) ────────
test('SZM-2: incomplete info yields unknown gates, not false clears', () => {
  const a: RawAnswers = { business_type: 'other', stage: 'thinking', setup_steps: [], lead } as RawAnswers
  const snap = evaluateMetrixProfile(a, null, opts('mp8'))
  const byId = (id: string) => snap.criticalGates.find(g => g.id === id)!
  assert.equal(byId('gate_capacity').status, 'unknown')
  assert.equal(byId('gate_quality').status, 'unknown')
  assert.equal(byId('gate_capacity').evidenceStatus, 'no_evidence')
  // a gate with no evidence is never falsely "cleared"
  assert.notEqual(byId('gate_quality').status, 'cleared')
})

// ── 9 — Contradictory answers produce a clarification candidate (live) ────────
test('SZM-2: contradictory answers produce a clarification question', () => {
  const a: RawAnswers = { business_type: 'hvac', stage: 'over_1yr', setup_steps: ['none_yet'], financial: 'k2_10', customer_plan: 'word_of_mouth', blocker: 'confidence', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'over_1yr', trade: 'hvac' }), opts('mp9'))
  const dq = snap.criticalGates.find(g => g.id === 'gate_data_quality')!
  assert.equal(dq.status, 'triggered')
  assert.equal(snap.nextBestQuestions.some(q => q.questionKey === 'clarify_conflict' && q.currentDataStatus === 'conflicting'), true)
})

// ── 10 — Highest-impact missing question is ranked first (live) ───────────────
test('SZM-2: highest-impact question ranks first', () => {
  const a: RawAnswers = { business_type: 'roofing', stage: 'over_1yr', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'confidence', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'over_1yr', trade: 'roofing', teamSize: '4_10', mainGoal: 'hire_scale' }), opts('mp10'))
  const q = getNextBestQuestions(snap)
  assert.ok(q.length > 0)
  assert.equal(q[0].expectedDecisionImpact, 'changes_priority')
  assert.equal(q[0].rank, 1)
  // capacity is surfaced as a blocking, priority-changing question (truthful "confirm before growth")
  assert.equal(q.some(c => c.questionKey === 'capacity_status' && c.blocking === true && c.expectedDecisionImpact === 'changes_priority'), true)
})

// ── 11 — Exactly one primary priority ─────────────────────────────────────────
test('SZM-2: exactly one primary priority', () => {
  const a: RawAnswers = { business_type: 'hvac', stage: 'planning', setup_steps: ['none_yet'], financial: 'under_2k', customer_plan: 'no_plan', blocker: 'pricing', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'planning', trade: 'hvac' }), opts('mp11'))
  assert.equal(typeof snap.metrixPriority, 'object')
  assert.equal(snap.metrixPriority.rank, 1)
  assert.ok(Array.isArray(snap.secondaryPriorities))
  assert.equal(snap.secondaryPriorities.some(p => p.rank === 1), false)
})

// ── 12 — Roadmap seed first outcome aligns with the primary priority ──────────
test('SZM-2: roadmap seed first step aligns with primary priority', () => {
  const a: RawAnswers = { business_type: 'electrical', stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'electrical' }), opts('mp12'))
  assert.equal(snap.roadmapSeed.steps[0].category, snap.metrixPriority.domainCategory)
  assert.equal(snap.roadmapSeed.steps[0].reason, 'priority_focus')
})

// ── 13 — Repeated evaluation is deterministic (gates + priority + questions) ──
test('SZM-2: gates/priority/questions are deterministic', () => {
  const a: RawAnswers = { business_type: 'plumbing', stage: 'months_6_12', setup_steps: ['biz_name', 'bank'], financial: 'not_sure', customer_plan: 'no_plan', blocker: 'pricing', lead }
  const i = intake({ stage: 'months_6_12', trade: 'plumbing', teamSize: 'just_me' })
  const a1 = evaluateMetrixProfile(a, i, opts('mpd'))
  const a2 = evaluateMetrixProfile(a, i, opts('mpd'))
  assert.deepStrictEqual(a1.criticalGates, a2.criticalGates)
  assert.deepStrictEqual(a1.metrixPriority, a2.metrixPriority)
  assert.deepStrictEqual(a1.nextBestQuestions, a2.nextBestQuestions)
})

// ── 14 — Stored and displayed priority are identical through the read model ───
test('SZM-2: stored == displayed priority via read model', () => {
  const a: RawAnswers = { business_type: 'hvac', stage: 'months_6_12', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'pricing', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'hvac' }), opts('mp14'))
  assert.equal(getMetrixPriority(snap), snap.metrixPriority)
  assert.equal(toMetrixScore(snap).recommendedPath.focusCategory, snap.metrixPriority.domainCategory)
})

// ── 15 — Historical canonical/legacy records remain readable ──────────────────
test('SZM-2: historical legacy records remain readable + carry a priority', () => {
  const historical = calculateScores({ business_type: 'hvac', stage: 'planning', setup_steps: ['none_yet'], financial: 'under_2k', customer_plan: 'no_plan', blocker: 'pricing', lead })
  const adapted = adaptLegacyScoreResult(historical, intake({ stage: 'planning', trade: 'hvac' }), opts('mp15'))
  assert.equal(adapted.metrixPriority.rank, 1)
  assert.ok(adapted.metrixPriority.domain)
  const hist = { id: 'h1', createdAt: NOW, source: 'initial_assessment', overall: 50, categories: [], riskLevel: 'elevated', riskLabel: 'Elevated Risk', profileCompletion: 50, trade: 'hvac', region: 'Texas', businessStage: 'months_6_12', mainGoal: null, biggestChallenge: null } as unknown as MetrixScoreSnapshot
  const fromHist = adaptLegacyHistorySnapshot(hist)
  assert.equal(fromHist.metrixPriority.priorityId, 'priority_unknown')
  assert.equal(fromHist.source, 'legacy_history')
})

// ── 16 — Existing paid-roadmap projection remains canonical-derived ───────────
test('SZM-2: paid-roadmap projection stays canonical-derived', () => {
  const a: RawAnswers = { business_type: 'electrical', stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead }
  const snap = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'electrical' }), opts('mp16'))
  const projected = projectCanonicalToLegacyScoreResult(snap, a, lead)
  assert.equal(projected.overall, snap.readiness.overall)
  assert.notEqual(projected.overall, calculateScores(a).overall)
})
