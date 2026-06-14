// ─────────────────────────────────────────────────────────────────────────────
// SZM-2A — priority action paths characterization tests (Node runner).
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateScores, type RawAnswers } from '../../scoring'
import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { MetrixScoreSnapshot } from '../../metrixHistory'
import {
  evaluateMetrixProfile, normalizeAssessment, buildCompletionPaths,
  toMetrixScore, getRecommendedCompletionPath, getPrimaryActionSteps,
  getNextUpPriorities, getPriorityProgress, getCompletionPaths,
  adaptLegacyScoreResult, adaptLegacyHistorySnapshot, projectCanonicalToLegacyScoreResult,
  type MetrixPriority,
} from '../index'

const NOW = '2026-01-01T00:00:00.000Z'
const opts = (id: string) => ({ now: NOW, profileId: id })
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const ALL_SETUP = ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res', 'website', 'gbp']
const lead = { firstName: 'X', email: 'x@example.com' }

// ── Reusable live personas ─────────────────────────────────────────────────────
const licensingPersona = evaluateMetrixProfile(
  { business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead },
  intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), opts('mp_lic'))

const pricingPersona = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Texas', city: 'Dallas' }, stage: 'months_6_12', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'existing_base', blocker: 'pricing', lead },
  intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas', biggestChallenge: 'pricing' }), opts('mp_prc'))

const financialPersona = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Texas', city: 'Dallas' }, stage: 'months_6_12', setup_steps: ALL_SETUP, financial: 'not_sure', customer_plan: 'existing_base', blocker: 'confidence', lead },
  intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas' }), opts('mp_fin'))

const preLaunchPersona = evaluateMetrixProfile(
  { business_type: 'hvac', location: { state: 'Texas', city: 'Austin' }, stage: 'planning', setup_steps: ['none_yet'], financial: 'under_2k', customer_plan: 'no_plan', blocker: 'pricing', lead },
  intake({ stage: 'planning', trade: 'hvac', region: 'Texas' }), opts('mp_pre'))

const pathTypes = (s = licensingPersona) => getCompletionPaths(s).map(p => p.pathType)

// 1 — every actionable primary priority has ≥1 completion path.
test('SZM-2A: actionable priority has at least one completion path', () => {
  for (const s of [licensingPersona, pricingPersona, financialPersona, preLaunchPersona]) {
    assert.ok(s.completionPaths.length >= 1)
  }
})

// 2 — exactly one path is recommended.
test('SZM-2A: exactly one recommended path', () => {
  for (const s of [licensingPersona, pricingPersona, financialPersona, preLaunchPersona]) {
    assert.equal(s.completionPaths.filter(p => p.recommended).length, 1)
    assert.equal(getRecommendedCompletionPath(s)?.pathId, s.recommendedCompletionPathId)
  }
})

// 3 — licensing uncertainty recommends an official-authority route.
test('SZM-2A: licensing recommends official_authority', () => {
  const rec = getRecommendedCompletionPath(licensingPersona)!
  assert.equal(licensingPersona.metrixPriority.domain, 'licensing')
  assert.equal(rec.pathType, 'official_authority')
  assert.equal(rec.providerCategory, 'official')
})

// 4 — licensing never produces a "license not required" DIY path.
test('SZM-2A: licensing never declares no license needed', () => {
  for (const p of getCompletionPaths(licensingPersona)) {
    assert.notEqual(p.pathType, 'guided_diy')
    assert.doesNotMatch(`${p.title} ${p.description}`, /not required|no license|don'?t need a license/i)
  }
})

// 5 — severe pricing weakness offers DIY, tool, and specialist paths.
test('SZM-2A: pricing offers diy/tool/specialist', () => {
  assert.equal(pricingPersona.metrixPriority.domain, 'pricing')
  const t = pathTypes(pricingPersona)
  for (const want of ['guided_diy', 'tool_assisted', 'specialist_assisted']) assert.ok((t as string[]).includes(want))
})

// 6 — financial-visibility weakness offers DIY, tool, and specialist paths.
test('SZM-2A: financial visibility offers diy/tool/specialist', () => {
  assert.equal(financialPersona.metrixPriority.domain, 'financial_visibility')
  const t = pathTypes(financialPersona)
  for (const want of ['guided_diy', 'tool_assisted', 'specialist_assisted']) assert.ok((t as string[]).includes(want))
})

// 7 — capacity does not recommend additional marketing (policy, synthetic primary).
test('SZM-2A: capacity does not recommend marketing', () => {
  const capacityPriority: MetrixPriority = {
    priorityId: 'priority_capacity', title: 'Confirm your capacity', requiredOutcome: 'Confirm capacity vs demand.',
    rationale: '', domain: 'capacity', domainCategory: 'operations', severity: 'moderate', sourceGateIds: ['gate_capacity'],
    sourceConstraintIds: [], reasonCodes: [], dependencies: [], blockedRecommendations: [],
    firstAction: 'Map your current capacity vs. demand before adding leads.', completionCriteria: 'Capacity documented.',
    reassessmentTrigger: '', evidenceStatus: 'partial_evidence', rulesetVersion: 3, rank: 1,
  }
  const norm = normalizeAssessment({ business_type: 'roofing', stage: 'over_1yr' } as RawAnswers, intake({ trade: 'roofing', region: 'Colorado' }))
  const res = buildCompletionPaths(capacityPriority, [], norm)
  const rec = res.paths.find(p => p.recommended)!
  assert.equal(rec.pathType, 'guided_diy')
  assert.doesNotMatch(`${rec.title} ${rec.description}`, /market|advertis|more leads|add demand/i)
  assert.ok(res.paths.some(p => p.pathType === 'not_ready'))  // "hold additional marketing" exists, NOT recommended
  assert.equal(res.paths.find(p => p.pathType === 'not_ready')!.recommended, false)
})

// 8 — customer path becomes prerequisite_first when blocked by a higher gate.
test('SZM-2A: customer path is prerequisite_first when a higher gate blocks demand', () => {
  const s = evaluateMetrixProfile(
    { business_type: 'hvac', location: { state: 'Arizona', city: 'Mesa' }, stage: 'over_1yr', setup_steps: ALL_SETUP, financial: 'over_25k', customer_plan: 'no_plan', blocker: 'confidence', lead },
    intake({ stage: 'over_1yr', trade: 'hvac', region: 'Arizona', teamSize: '4_10', mainGoal: 'hire_scale' }), opts('mp_cust'))
  assert.equal(s.metrixPriority.domain, 'customer_path')
  assert.equal(getRecommendedCompletionPath(s)!.pathType, 'prerequisite_first')
})

// 9 — missing prerequisites produce prerequisite_first.
test('SZM-2A: missing scope yields prerequisite_first', () => {
  const s = evaluateMetrixProfile(
    { business_type: 'electrical', stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead },
    intake({ stage: 'months_6_12', trade: 'electrical' }), opts('mp_scope')) // no region
  assert.equal(s.metrixPriority.domain, 'licensing')
  assert.equal(getRecommendedCompletionPath(s)!.pathType, 'prerequisite_first')
})

// 10 — every actionable priority has ≥1 ordered action step.
test('SZM-2A: actionable priority has at least one action step', () => {
  for (const s of [licensingPersona, pricingPersona, financialPersona, preLaunchPersona]) {
    assert.ok(getPrimaryActionSteps(s).length >= 1)
  }
})

// 11 — complex priorities contain multiple ordered steps.
test('SZM-2A: complex priority has multiple ordered steps', () => {
  assert.ok(getPrimaryActionSteps(licensingPersona).length >= 2)
  const orders = getPrimaryActionSteps(licensingPersona).map(s => s.order)
  assert.deepStrictEqual(orders, [...orders].sort((a, b) => a - b))
})

// 12 — first action matches the first required action step.
test('SZM-2A: first action equals first action step', () => {
  for (const s of [licensingPersona, pricingPersona, financialPersona]) {
    assert.equal(getPrimaryActionSteps(s)[0].instruction, s.metrixPriority.firstAction)
  }
})

// 13 — completing a sub-step would not replace the primary priority.
test('SZM-2A: progress tracks under the priority, never replaces it', () => {
  const p = getPriorityProgress(licensingPersona)
  assert.equal(p.priorityId, licensingPersona.metrixPriority.priorityId)
  assert.equal(p.completedStepIds.length, 0)
  assert.equal(p.reassessmentEligible, false)
})

// 14 — reassessment eligibility is false on a new profile.
test('SZM-2A: reassessmentEligible is false on a new profile', () => {
  for (const s of [licensingPersona, pricingPersona, preLaunchPersona]) {
    assert.equal(getPriorityProgress(s).reassessmentEligible, false)
    assert.equal(getPriorityProgress(s).status, 'not_started')
    assert.equal(getPriorityProgress(s).selectedPathId, null)
    assert.equal(getPriorityProgress(s).completionPercent, 0)
  }
})

// 15 — exactly one primary priority remains active.
test('SZM-2A: exactly one active primary priority', () => {
  assert.equal(licensingPersona.metrixPriority.rank, 1)
  assert.equal(typeof licensingPersona.metrixPriority, 'object')
})

// 16 — secondary priorities are retained.
test('SZM-2A: secondary priorities retained', () => {
  assert.ok(preLaunchPersona.secondaryPriorities.length >= 1)
})

// 17 — next-up queue contains no more than three items.
test('SZM-2A: next-up has at most three items', () => {
  for (const s of [licensingPersona, preLaunchPersona, pricingPersona]) {
    assert.ok(getNextUpPriorities(s).length <= 3)
  }
})

// 18 — blocked recommendations cannot appear in next-up.
test('SZM-2A: blocked recommendations never appear in next-up', () => {
  const blockedIds = new Set(preLaunchPersona.blockedRecommendations.map(b => b.id))
  for (const item of getNextUpPriorities(preLaunchPersona)) {
    assert.equal(blockedIds.has(item.priorityId), false)
    assert.match(item.priorityId, /^priority_/)
  }
})

// 19 — next-up ordering is deterministic + densely ranked.
test('SZM-2A: next-up ordering is deterministic', () => {
  const a = evaluateMetrixProfile(preLaunchPersona.normalizedAnswers.rawAnswers, null, opts('mp_nu'))
  const b = evaluateMetrixProfile(preLaunchPersona.normalizedAnswers.rawAnswers, null, opts('mp_nu'))
  assert.deepStrictEqual(a.nextUpPriorities, b.nextUpPriorities)
  a.nextUpPriorities.forEach((it, i) => assert.equal(it.rank, i + 1))
})

// 20 — recommended completion path is deterministic.
test('SZM-2A: recommended completion path is deterministic', () => {
  const a = evaluateMetrixProfile(pricingPersona.normalizedAnswers.rawAnswers, intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas', biggestChallenge: 'pricing' }), opts('mp_rp'))
  const b = evaluateMetrixProfile(pricingPersona.normalizedAnswers.rawAnswers, intake({ stage: 'months_6_12', trade: 'hvac', region: 'Texas', biggestChallenge: 'pricing' }), opts('mp_rp'))
  assert.equal(a.recommendedCompletionPathId, b.recommendedCompletionPathId)
  assert.deepStrictEqual(a.completionPaths, b.completionPaths)
})

// 21 — stored and displayed action paths are identical through the read model.
test('SZM-2A: stored == displayed action paths via read model', () => {
  assert.equal(getRecommendedCompletionPath(licensingPersona)!.pathId, licensingPersona.recommendedCompletionPathId)
  assert.equal(getPrimaryActionSteps(licensingPersona), licensingPersona.primaryActionSteps)
  assert.equal(getCompletionPaths(licensingPersona), licensingPersona.completionPaths)
})

// 22 — historical records remain readable.
test('SZM-2A: historical records remain readable', () => {
  const hist = { id: 'h1', createdAt: NOW, source: 'initial_assessment', overall: 50, categories: [], riskLevel: 'elevated', riskLabel: 'Elevated Risk', profileCompletion: 50, trade: 'hvac', region: 'Texas', businessStage: 'months_6_12', mainGoal: null, biggestChallenge: null } as unknown as MetrixScoreSnapshot
  const fromHist = adaptLegacyHistorySnapshot(hist)
  assert.deepStrictEqual(fromHist.completionPaths, [])
  assert.equal(fromHist.recommendedCompletionPathId, null)
  assert.equal(fromHist.priorityProgress.status, 'not_started')
  const legacy = calculateScores(licensingPersona.normalizedAnswers.rawAnswers)
  const adapted = adaptLegacyScoreResult(legacy, intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), opts('mp_leg'))
  assert.ok(adapted.completionPaths.length >= 1)
})

// 23 — existing gate and priority behavior remains unchanged.
test('SZM-2A: gate + priority behavior unchanged', () => {
  assert.equal(licensingPersona.metrixPriority.domain, 'licensing')
  assert.equal(licensingPersona.criticalGates.find(g => g.id === 'gate_licensing')!.title, 'Trade licensing not confirmed')
  assert.equal(financialPersona.metrixPriority.domain, 'financial_visibility')
})

// 24 — existing paid-roadmap projection remains canonical-derived.
test('SZM-2A: paid-roadmap projection stays canonical-derived', () => {
  const projected = projectCanonicalToLegacyScoreResult(pricingPersona, pricingPersona.normalizedAnswers.rawAnswers, lead)
  assert.equal(projected.overall, pricingPersona.readiness.overall)
})

// 25 — full evaluation remains deterministic.
test('SZM-2A: full evaluation is deterministic', () => {
  const a = evaluateMetrixProfile(licensingPersona.normalizedAnswers.rawAnswers, intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), opts('mp_det'))
  const b = evaluateMetrixProfile(licensingPersona.normalizedAnswers.rawAnswers, intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), opts('mp_det'))
  assert.deepStrictEqual(a, b)
})
