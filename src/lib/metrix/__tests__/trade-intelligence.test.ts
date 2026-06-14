// ─────────────────────────────────────────────────────────────────────────────
// Wave 3 — Ten-Trade Contractor Intelligence tests (Node runner). Deterministic coverage:
// one regression persona per launch trade · registry/resolver (aliases, slug, label,
// construction == General Contracting, unsupported, unknown) · shared-dimension reuse +
// cross-trade differentiation · modifiers are not copy-paste shells · deterministic output ·
// unsupported/missing fallback · malformed/legacy safety · trade questions reuse the Wave 2
// framework (dedupe/answered/dismissed/bounded, never changes_priority) · trade intelligence
// cannot replace the canonical priority · reuses Wave 2 evidence confidence (no parallel score).
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, deriveProfileIntelligence, deriveTradeIntelligence,
  resolveTrade, isSupportedTrade,
  CANONICAL_TRADE_IDS, TRADE_REGISTRY, TRADE_MODIFIERS, DIMENSION_LABELS, TRADE_INTELLIGENCE_VERSION,
  type MetrixProfileSnapshot, type CanonicalTradeId,
} from '../index'

const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const NOW = '2026-01-01T00:00:00.000Z'
const lead = { firstName: 'X', email: 'x@example.com' }

// One real persona per trade, evaluated through the canonical engine.
function snapFor(trade: string, extra: Partial<RawAnswers> = {}): MetrixProfileSnapshot {
  const raw = {
    business_type: trade, location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12',
    setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'],
    financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead,
    ...extra,
  } as RawAnswers
  return evaluateMetrixProfile(raw, intake({ stage: 'months_6_12', trade, region: 'Texas' }),
    { now: NOW, profileId: `mp_${trade || 'none'}` })
}

const TRADES: [string, CanonicalTradeId][] = [
  ['hvac', 'hvac'], ['electrical', 'electrical'], ['plumbing', 'plumbing'], ['handyman', 'handyman'],
  ['landscaping', 'landscaping'], ['painting', 'painting'], ['roofing', 'roofing'], ['solar', 'solar'],
  ['construction', 'construction'], ['cleaning', 'cleaning'],
]

// ── 1. One regression persona per launch trade ───────────────────────────────
test('w3: every launch trade yields supported, populated, explainable intelligence', () => {
  assert.equal(TRADES.length, 10)
  for (const [val, id] of TRADES) {
    const ti = deriveTradeIntelligence(snapFor(val))
    assert.equal(ti.supported, true, `${val} supported`)
    assert.equal(ti.trade.id, id, `${val} resolves to ${id}`)
    assert.equal(ti.trade.supportStatus, 'supported')
    assert.ok(ti.operatingModel.length > 0 && ti.revenueModel.length > 0 && ti.customerDemand.length > 0, `${val} models`)
    assert.ok(ti.dimensions.length >= 4, `${val} dimensions`)
    assert.ok(ti.strengths.length > 0 && ti.risks.length > 0, `${val} strengths/risks`)
    assert.ok(ti.recurringRevenueOpportunities.length > 0, `${val} recurring revenue`)
    assert.ok(ti.recommendedResourceCategories.length > 0, `${val} resources`)
    assert.ok(ti.rationale.includes(ti.trade.displayName), `${val} rationale names trade`)
    // every derived conclusion carries a rationale
    for (const x of [...ti.strengths, ...ti.risks, ...ti.importantUnknowns, ...ti.evidenceNeeds])
      assert.ok(x.because.length > 0, `${val} insight rationale`)
    // resource categories carry no providers/URLs (no real providers wired this phase)
    for (const r of ti.recommendedResourceCategories)
      assert.equal(/https?:\/\//.test(r.label + r.reason), false, `${val} no URLs in resources`)
  }
})

// ── 2. Trade registry + resolver ──────────────────────────────────────────────
test('w3: registry resolves IDs, aliases, slugs, labels — and degrades safely', () => {
  assert.equal(CANONICAL_TRADE_IDS.length, 10)
  for (const id of CANONICAL_TRADE_IDS) assert.equal(TRADE_REGISTRY[id].id, id)
  assert.equal(resolveTrade('HVAC').id, 'hvac')
  assert.equal(resolveTrade('Heating & Cooling').id, 'hvac')              // '&' normalized
  assert.equal(resolveTrade('General Contracting').id, 'construction')    // GC == construction (no new id)
  assert.equal(resolveTrade('Construction & Remodeling').id, 'construction')
  assert.equal(resolveTrade('Lawn Care').id, 'landscaping')
  assert.equal(resolveTrade('flow').id, 'plumbing')                       // tradeData slug
  assert.equal(resolveTrade('Electrician').id, 'electrical')
  assert.equal(resolveTrade('').supportStatus, 'unknown')
  assert.equal(resolveTrade(null).supportStatus, 'unknown')
  assert.equal(resolveTrade(undefined).supportStatus, 'unknown')
  assert.equal(resolveTrade('other').supportStatus, 'unsupported')        // generic NOT mapped to a launch trade
  assert.equal(resolveTrade('underwater basket weaving').supportStatus, 'unsupported')
  assert.equal(isSupportedTrade('hvac'), true)
  assert.equal(isSupportedTrade('other'), false)
  assert.equal(isSupportedTrade(null), false)
})

// ── 3. Shared dimensions are reused and trade-differentiated ──────────────────
test('w3: dimensions reuse the shared catalog and differ across trades', () => {
  const idSets = new Set<string>()
  for (const id of CANONICAL_TRADE_IDS) {
    const mod = TRADE_MODIFIERS[id]
    assert.ok(mod.dimensions.length >= 4, `${id} has dimensions`)
    for (const d of mod.dimensions) {
      assert.equal(d.label, DIMENSION_LABELS[d.id], `${id}:${d.id} uses the shared label`)
      assert.ok(d.summary.length > 0, `${id}:${d.id} trade-specific summary`)
      assert.ok(['low', 'moderate', 'high', 'variable'].includes(d.intensity))
    }
    idSets.add(Array.from(new Set(mod.dimensions.map(d => d.id))).sort().join(','))
  }
  assert.equal(idSets.size, CANONICAL_TRADE_IDS.length)   // no two trades share the same dimension set
})

// ── 4. Modifiers are not copy-paste shells ────────────────────────────────────
test('w3: trade modifiers are materially different and fully populated', () => {
  const op = CANONICAL_TRADE_IDS.map(id => TRADE_MODIFIERS[id].operatingModel)
  const rev = CANONICAL_TRADE_IDS.map(id => TRADE_MODIFIERS[id].revenueModel)
  const dem = CANONICAL_TRADE_IDS.map(id => TRADE_MODIFIERS[id].customerDemand)
  assert.equal(new Set(op).size, op.length, 'operating models all distinct')
  assert.equal(new Set(rev).size, rev.length, 'revenue models all distinct')
  assert.equal(new Set(dem).size, dem.length, 'demand models all distinct')
  for (const id of CANONICAL_TRADE_IDS) {
    const m = TRADE_MODIFIERS[id]
    for (const arr of [
      m.strengths, m.risks, m.importantUnknowns, m.evidenceNeeds, m.operatingConstraints,
      m.recurringRevenue, m.ownerDependency, m.capacity, m.resourceCategories, m.questionCandidates,
    ]) assert.ok(arr.length > 0, `${id} advisory bucket populated`)
  }
})

// ── 5. Deterministic output ───────────────────────────────────────────────────
test('w3: identical snapshot produces identical trade intelligence', () => {
  const s = snapFor('electrical')
  assert.deepStrictEqual(deriveTradeIntelligence(s), deriveTradeIntelligence(s))
  assert.deepStrictEqual(deriveTradeIntelligence(s, { limit: 2 }), deriveTradeIntelligence(s, { limit: 2 }))
})

// ── 6. Unsupported / missing trade fallback ───────────────────────────────────
test('w3: unsupported and missing trade degrade safely (no fabricated content)', () => {
  const tiU = deriveTradeIntelligence(snapFor('underwater basket weaving'))
  assert.equal(tiU.supported, false)
  assert.equal(tiU.trade.supportStatus, 'unsupported')
  assert.deepEqual(tiU.dimensions, [])
  assert.deepEqual(tiU.strengths, [])
  assert.deepEqual(tiU.nextBestQuestions, [])
  assert.equal(tiU.confidence, 'low')
  assert.equal(tiU.version, TRADE_INTELLIGENCE_VERSION)

  const tiM = deriveTradeIntelligence(snapFor(''))   // no trade set
  assert.equal(tiM.supported, false)
  assert.equal(tiM.trade.supportStatus, 'unknown')
  assert.deepEqual(tiM.dimensions, [])
})

// ── 7. Malformed / legacy snapshot safety ─────────────────────────────────────
test('w3: malformed / legacy snapshot does not throw', () => {
  assert.doesNotThrow(() => deriveTradeIntelligence({} as MetrixProfileSnapshot))
  const tiEmpty = deriveTradeIntelligence({} as MetrixProfileSnapshot)
  assert.equal(tiEmpty.supported, false)
  assert.equal(tiEmpty.version, TRADE_INTELLIGENCE_VERSION)
  // a sparse legacy-ish object carrying only a trade string still resolves the trade safely
  const legacy = { businessContext: { trade: 'roofing' } } as unknown as MetrixProfileSnapshot
  assert.doesNotThrow(() => deriveTradeIntelligence(legacy))
  const tiL = deriveTradeIntelligence(legacy)
  assert.equal(tiL.supported, true)
  assert.equal(tiL.trade.id, 'roofing')
  // trade questions are trade-static (not answer-gated), so they still surface — bounded + safe
  assert.ok(Array.isArray(tiL.nextBestQuestions) && tiL.nextBestQuestions.length <= 3)
})

// ── 8. Trade questions reuse the Wave 2 framework ─────────────────────────────
test('w3: trade questions are bounded, dedupe, suppress answered/dismissed, never override priority', () => {
  const s = snapFor('hvac')
  const all = deriveTradeIntelligence(s, { limit: 3 }).nextBestQuestions
  assert.ok(all.length <= 3 && all.length > 0)
  // bounded
  assert.ok(deriveTradeIntelligence(s, { limit: 1 }).nextBestQuestions.length <= 1)
  assert.deepEqual(deriveTradeIntelligence(s, { limit: 0 }).nextBestQuestions, [])
  // never claim to change the canonical priority (subordinate by construction)
  for (const qn of all) assert.notEqual(qn.expectedDecisionImpact, 'changes_priority')
  // no repeats by questionKey
  assert.equal(new Set(all.map(q => q.questionKey)).size, all.length)
  // cross-surface dedupe: never repeat a canonical next-best-question
  const canon = new Set((s.nextBestQuestions ?? []).map(q => q.questionKey))
  for (const qn of all) assert.equal(canon.has(qn.questionKey), false)
  // dismissed removed
  const dis = deriveTradeIntelligence(s, { limit: 3, dismissed: [all[0].questionKey] }).nextBestQuestions
  assert.equal(dis.some(qn => qn.questionKey === all[0].questionKey), false)
  // already-answered suppressed (preserving raw answers / question ids)
  const answered = snapFor('hvac', { [all[0].questionKey]: 'yes' } as Partial<RawAnswers>)
  const after = deriveTradeIntelligence(answered, { limit: 3 }).nextBestQuestions
  assert.equal(after.some(qn => qn.questionKey === all[0].questionKey), false)
})

// ── 9. Trade intelligence cannot replace the canonical priority ───────────────
test('w3: trade intelligence cannot independently replace the canonical priority', () => {
  const s = snapFor('plumbing')
  const before = { id: s.metrixPriority.priorityId, title: s.metrixPriority.title, domain: s.metrixPriority.domain }
  const ti = deriveTradeIntelligence(s) as unknown as Record<string, unknown>
  // deriving trade intelligence leaves the canonical priority untouched
  assert.deepEqual({ id: s.metrixPriority.priorityId, title: s.metrixPriority.title, domain: s.metrixPriority.domain }, before)
  // the output exposes NO priority/score field to override the canonical engine with
  for (const banned of ['priority', 'metrixPriority', 'priorityId', 'score', 'overall', 'readiness', 'criticalGates'])
    assert.equal(banned in ti, false, `trade intelligence must not expose ${banned}`)
  // re-evaluating identical answers yields the same canonical priority regardless of trade intel
  assert.equal(snapFor('plumbing').metrixPriority.priorityId, s.metrixPriority.priorityId)
})

// ── 10. No parallel scoring engine: confidence is the Wave 2 read ─────────────
test('w3: reuses the Wave 2 evidence-confidence read (no duplicate scoring)', () => {
  const s = snapFor('roofing')
  const intel = deriveProfileIntelligence(s, { limit: 1 })
  assert.equal(deriveTradeIntelligence(s).confidence, intel.evidenceConfidence)
  // an explicitly supplied Wave 2 intelligence is honored as the single source
  assert.equal(deriveTradeIntelligence(s, { intelligence: intel }).confidence, intel.evidenceConfidence)
})
