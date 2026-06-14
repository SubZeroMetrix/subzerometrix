// ─────────────────────────────────────────────────────────────────────────────
// Wave 4 — Six-State Licensing, Jurisdiction & Trusted Routing tests (Node runner). Deterministic:
// 60 trade×state pathway coverage · state registry/resolver · official-source provenance ·
// stale-source behavior · unsupported-state fallback · local-jurisdiction uncertainty · malformed/
// legacy safety · deterministic output · commercial neutrality · licensing cannot override the
// canonical priority · correction reporting · regression across all 10 trades and all 6 states.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, deriveProfileIntelligence, deriveTradeIntelligence,
  deriveLicensingIntelligence,
  resolveState, isSupportedState, CANONICAL_STATE_IDS, STATE_REGISTRY,
  CANONICAL_TRADE_IDS, TRADE_REGISTRY,
  LICENSING_SOURCES, getLicensingSource, getPathway, allPathways, LICENSING_PATHWAYS,
  ROUTING_CATALOG, getRoutingCategories, buildCorrectionReport,
  evaluateFreshness, isSourceStale, computeNextReviewDate,
  LICENSING_REVIEWED_DATE, LICENSING_FRESHNESS_WINDOW_DAYS,
  type MetrixProfileSnapshot, type CanonicalTradeId, type CanonicalStateId,
} from '../index'

const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const NOW = '2026-07-01T00:00:00.000Z'              // shortly after the reviewed date → fresh
const FUTURE = '2030-01-01T00:00:00.000Z'           // long past the freshness window → stale
const lead = { firstName: 'X', email: 'x@example.com' }

// A real persona for a given trade + state, evaluated through the canonical engine.
function snapFor(trade: string, state: string, extra: Partial<RawAnswers> = {}): MetrixProfileSnapshot {
  const raw = {
    business_type: trade, location: { state, city: 'Somewhere' }, stage: 'months_6_12',
    setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'],
    financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead,
    ...extra,
  } as RawAnswers
  return evaluateMetrixProfile(raw, intake({ stage: 'months_6_12', trade, region: state }),
    { now: NOW, profileId: `mp_${trade}_${state}` })
}

const STATE_NAMES: Record<CanonicalStateId, string> = {
  FL: 'Florida', CO: 'Colorado', TX: 'Texas', AZ: 'Arizona', OH: 'Ohio', NC: 'North Carolina',
}

// ── 1. Sixty explicit trade × state pathways ──────────────────────────────────
test('w4: all 60 trade×state pathways exist, are source-backed, and are differentiated', () => {
  assert.equal(CANONICAL_TRADE_IDS.length, 10)
  assert.equal(CANONICAL_STATE_IDS.length, 6)
  assert.equal(allPathways().length, 60)
  assert.equal(Object.keys(LICENSING_PATHWAYS).length, 60)

  const disclaimers = new Set<string>()
  for (const t of CANONICAL_TRADE_IDS) {
    for (const st of CANONICAL_STATE_IDS) {
      const p = getPathway(t, st)
      assert.ok(p, `pathway ${t}×${st} exists`)
      assert.equal(p!.tradeId, t)
      assert.equal(p!.stateId, st)
      assert.ok(p!.sourceIds.length >= 1, `${t}×${st} source-backed`)
      const src = getLicensingSource(t, st)
      assert.ok(src, `${t}×${st} source`)
      assert.equal(p!.sourceIds[0], src!.id)
      assert.ok(p!.disclaimer.length > 0 && /verify|confirm/i.test(p!.disclaimer), `${t}×${st} verify-before-action`)
      assert.ok(p!.routingCategories.length > 0, `${t}×${st} routing`)
      assert.ok(p!.workScopeDistinctions.length > 0, `${t}×${st} scope distinctions`)
      assert.ok(p!.reviewedDate === LICENSING_REVIEWED_DATE)
      disclaimers.add(`${p!.authorityLevel}|${p!.disclaimer}`)
    }
  }
  // Not a label-swap template: authority structure genuinely varies across the matrix.
  const authorityLevels = new Set(allPathways().map(p => p.authorityLevel))
  assert.ok(authorityLevels.size >= 5, 'multiple distinct authority levels across the matrix')
})

// ── 2. Regression: every trade × state yields supported, source-backed intelligence ──
test('w4: regression — all 10 trades in all 6 states resolve to supported licensing intelligence', () => {
  for (const t of CANONICAL_TRADE_IDS) {
    for (const st of CANONICAL_STATE_IDS) {
      const li = deriveLicensingIntelligence(snapFor(t, STATE_NAMES[st]), { now: NOW })
      assert.equal(li.status, 'supported', `${t}×${st} supported`)
      assert.equal(li.trade.id, t)
      assert.equal(li.state.id, st)
      assert.ok(li.officialSources.length > 0, `${t}×${st} sources`)
      assert.ok(/^https:\/\//.test(li.officialSources[0].url), `${t}×${st} https source`)
      assert.ok(li.knownRequirements.length > 0, `${t}×${st} requirements`)
      assert.ok(li.verificationSteps.length > 0, `${t}×${st} verification steps`)
      assert.ok(li.routingCategories.length > 0, `${t}×${st} routing`)
      assert.equal(li.reviewedDate, LICENSING_REVIEWED_DATE)
      assert.ok(li.rationale.includes(TRADE_REGISTRY[t].displayName), `${t}×${st} rationale names trade`)
      assert.ok(li.rationale.includes(STATE_NAMES[st]), `${t}×${st} rationale names state`)
      assert.ok(typeof li.confidence === 'string', 'confidence is categorical (no numeric score)')
    }
  }
})

// ── 3. State registry + resolver ──────────────────────────────────────────────
test('w4: state registry resolves abbreviations/names and degrades safely', () => {
  assert.equal(CANONICAL_STATE_IDS.length, 6)
  for (const id of CANONICAL_STATE_IDS) assert.equal(STATE_REGISTRY[id].id, id)
  assert.equal(resolveState('TX').id, 'TX')
  assert.equal(resolveState('texas').id, 'TX')
  assert.equal(resolveState('Florida').id, 'FL')
  assert.equal(resolveState('north carolina').id, 'NC')
  assert.equal(resolveState('OH').id, 'OH')
  assert.equal(resolveState('').supportStatus, 'unknown')
  assert.equal(resolveState(null).supportStatus, 'unknown')
  assert.equal(resolveState(undefined).supportStatus, 'unknown')
  assert.equal(resolveState('California').supportStatus, 'unsupported')
  assert.equal(resolveState('Narnia').supportStatus, 'unsupported')
  assert.equal(isSupportedState('TX'), true)
  assert.equal(isSupportedState('CA'), false)
  assert.equal(isSupportedState(null), false)
  // Ohio is explicitly partial coverage (much licensing is local).
  assert.equal(STATE_REGISTRY.OH.coverage, 'partial')
})

// ── 4. Official-source provenance (authoritative only) ────────────────────────
test('w4: every source carries authoritative provenance and no non-authoritative origin', () => {
  const ids = Object.keys(LICENSING_SOURCES)
  assert.equal(ids.length, 60)
  const BAD = /(blog|angi|thumbtack|wikipedia|reddit|facebook|yelp|homeadvisor|porch\.com|leadgen)/i
  for (const id of ids) {
    const s = LICENSING_SOURCES[id]
    assert.ok(s.authorityName.length > 0, `${id} authority`)
    assert.ok(/^https:\/\//.test(s.url), `${id} https`)
    assert.equal(BAD.test(s.url), false, `${id} not a non-authoritative source`)
    assert.ok(s.sourceType.length > 0)
    assert.ok(s.jurisdictionLevel.length > 0)
    assert.equal(s.reviewedDate, LICENSING_REVIEWED_DATE)
    assert.equal(s.nextReviewDate, computeNextReviewDate(LICENSING_REVIEWED_DATE, LICENSING_FRESHNESS_WINDOW_DAYS))
    assert.equal(s.tradeApplicability.length, 1)
    assert.equal(s.stateApplicability.length, 1)
    assert.equal(s.correctionStatus, 'none')
    // No raw private data of any kind embedded in provenance.
    assert.equal(/@|\bssn\b/i.test(s.url + s.notes), false, `${id} no private data`)
  }
})

// ── 5. Stale-source behavior ──────────────────────────────────────────────────
test('w4: freshness is deterministic; stale sources are flagged and never shown as current law', () => {
  const s = getLicensingSource('hvac', 'TX')!
  const fresh = evaluateFreshness(s, NOW)
  assert.equal(fresh.status, 'fresh')
  assert.equal(fresh.isStale, false)
  assert.equal(isSourceStale(s, NOW), false)

  const stale = evaluateFreshness(s, FUTURE)
  assert.equal(stale.status, 'stale')
  assert.equal(stale.isStale, true)
  assert.ok(/verify|confirm/i.test(stale.message), 'stale routes to verify')

  // Unparseable reviewed date ⇒ unknown (treated as verify-needed, never silently current).
  const unknown = evaluateFreshness({ ...s, reviewedDate: 'not-a-date' }, NOW)
  assert.equal(unknown.status, 'unknown')
  assert.equal(unknown.isStale, true)

  // At the adapter level, a far-future clock flags staleness without hiding guidance.
  const li = deriveLicensingIntelligence(snapFor('hvac', 'Texas'), { now: FUTURE })
  assert.equal(li.freshness, 'stale')
  assert.ok(li.staleSources.length > 0)
  assert.equal(li.officialSources[0].stale, true)
  assert.ok(li.recommendedNextActions.some(a => /confirm|verify/i.test(a)), 'still routes to verify when stale')
  assert.ok(/not a guarantee/i.test(li.disclaimer))
})

// ── 6. Unsupported-state fallback ─────────────────────────────────────────────
test('w4: outside the six states, fallback is safe and never implies coverage', () => {
  const li = deriveLicensingIntelligence(snapFor('plumbing', 'California'), { now: NOW })
  assert.equal(li.status, 'unsupported_state')
  assert.equal(li.trade.id, 'plumbing')
  assert.equal(li.state.supported, false)
  assert.equal(li.officialSources.length, 0)
  assert.equal(li.authorityLevel, null)
  assert.ok(li.routingCategories.some(r => r.id === 'licensing_authority'))
  assert.ok(/not one of the six/i.test(li.rationale))
  assert.ok(li.recommendedNextActions.length > 0)
  // explicit override also works and does not throw
  const li2 = deriveLicensingIntelligence(snapFor('plumbing', 'Texas'), { state: 'Oregon', now: NOW })
  assert.equal(li2.status, 'unsupported_state')
})

// ── 7. Local-jurisdiction uncertainty ─────────────────────────────────────────
test('w4: local-governed combos surface local verification and partial coverage', () => {
  const ohHvac = getPathway('hvac', 'OH')!
  assert.equal(ohHvac.authorityLevel, 'local_only')
  assert.equal(ohHvac.coverage, 'partial')
  assert.equal(ohHvac.localVerificationRequired, true)

  const li = deriveLicensingIntelligence(snapFor('electrical', 'Ohio'), { now: NOW })
  assert.equal(li.authorityLevel, 'local_only')
  assert.ok(li.importantUnknowns.some(u => u.id === 'local_rules'), 'flags local rules as unknown')
  assert.ok(li.verificationSteps.some(v => v.id === 'check_local'))

  // Scope-dependent trades surface a scope unknown + confirm-scope step.
  const hm = deriveLicensingIntelligence(snapFor('handyman', 'Arizona'), { now: NOW })
  assert.ok(hm.importantUnknowns.some(u => u.id === 'scope'))
  assert.ok(hm.verificationSteps.some(v => v.id === 'confirm_scope'))
})

// ── 8. Malformed / legacy snapshot safety ─────────────────────────────────────
test('w4: malformed / legacy / missing input never throws', () => {
  assert.doesNotThrow(() => deriveLicensingIntelligence({} as unknown as MetrixProfileSnapshot, { now: NOW }))
  assert.doesNotThrow(() => deriveLicensingIntelligence(null as unknown as MetrixProfileSnapshot, { now: NOW }))
  const empty = deriveLicensingIntelligence({ normalizedAnswers: {} } as unknown as MetrixProfileSnapshot, { now: NOW })
  assert.ok(['incomplete', 'unsupported_state', 'unsupported_trade'].includes(empty.status))
  // Supported trade but no state ⇒ unsupported_state (no fabricated pathway).
  const noState = deriveLicensingIntelligence(
    { businessContext: { trade: 'hvac' }, normalizedAnswers: {} } as unknown as MetrixProfileSnapshot, { now: NOW })
  assert.equal(noState.status, 'unsupported_state')
  // Unsupported trade ⇒ unsupported_trade, still safe and routed.
  const weird = deriveLicensingIntelligence(snapFor('underwater basket weaving', 'Texas'), { now: NOW })
  assert.equal(weird.status, 'unsupported_trade')
  assert.ok(weird.routingCategories.length > 0)
})

// ── 9. Deterministic output ───────────────────────────────────────────────────
test('w4: identical snapshot + now produces identical licensing intelligence', () => {
  const s = snapFor('roofing', 'Florida')
  assert.deepEqual(
    deriveLicensingIntelligence(s, { now: NOW }),
    deriveLicensingIntelligence(s, { now: NOW }),
  )
})

// ── 10. Commercial neutrality ─────────────────────────────────────────────────
test('w4: routing is commercially neutral — no providers, urls, or affiliate influence', () => {
  for (const id of Object.keys(ROUTING_CATALOG)) {
    const c = ROUTING_CATALOG[id as keyof typeof ROUTING_CATALOG]
    assert.equal(c.commercial, 'none', `${id} neutral`)
    assert.equal(/https?:\/\//.test(c.label + c.reason), false, `${id} no urls`)
  }
  const li = deriveLicensingIntelligence(snapFor('hvac', 'Texas'), { now: NOW })
  for (const r of [...li.routingCategories, ...li.specialistCategories]) {
    assert.equal(r.commercial, 'none')
    assert.equal(/https?:\/\//.test(r.label + r.reason), false)
  }
  // ordering is stable regardless of any (non-existent) commercial weighting
  const ids = li.routingCategories.map(r => r.id)
  assert.deepEqual(getRoutingCategories(ids).map(r => r.id), ids)
})

// ── 11. Licensing intelligence cannot override the canonical priority ─────────
test('w4: licensing intelligence cannot independently replace the canonical priority', () => {
  const s = snapFor('construction', 'Arizona')
  const before = { id: s.metrixPriority.priorityId, title: s.metrixPriority.title, domain: s.metrixPriority.domain }
  const li = deriveLicensingIntelligence(s, { now: NOW }) as unknown as Record<string, unknown>
  // deriving licensing intelligence leaves the canonical priority untouched
  assert.deepEqual({ id: s.metrixPriority.priorityId, title: s.metrixPriority.title, domain: s.metrixPriority.domain }, before)
  // the output exposes NO priority/score field to override the canonical engine with
  for (const banned of ['priority', 'metrixPriority', 'priorityId', 'score', 'overall', 'readiness', 'criticalGates', 'completionPaths'])
    assert.equal(banned in li, false, `licensing intelligence must not expose ${banned}`)
  // re-evaluating identical answers yields the same canonical priority
  assert.equal(snapFor('construction', 'Arizona').metrixPriority.priorityId, s.metrixPriority.priorityId)
})

// ── 12. Reuses the Wave 2 evidence-confidence read (no parallel score) ────────
test('w4: confidence is the Wave 2 evidence read (no duplicate scoring engine)', () => {
  const s = snapFor('solar', 'North Carolina')
  const intel = deriveProfileIntelligence(s, { limit: 1 })
  assert.equal(deriveLicensingIntelligence(s, { now: NOW }).confidence, intel.evidenceConfidence)
  assert.equal(deriveLicensingIntelligence(s, { intelligence: intel, now: NOW }).confidence, intel.evidenceConfidence)
  // optional Wave 3 trade intelligence is accepted without altering the canonical priority/output shape
  const ti = deriveTradeIntelligence(s)
  assert.doesNotThrow(() => deriveLicensingIntelligence(s, { tradeIntelligence: ti, now: NOW }))
})

// ── 13. Correction reporting (safe payload only) ──────────────────────────────
test('w4: correction reports sanitize private data, are deterministic, and expose no admin systems', () => {
  const r1 = buildCorrectionReport({
    tradeId: 'hvac', stateId: 'TX', sourceId: 'src_hvac_TX', issueType: 'broken_source',
    details: 'Link is dead, email me at jane@example.com or call 555-123-4567',
  })
  assert.equal(r1.status, 'received')
  assert.equal(r1.tradeId, 'hvac')
  assert.equal(r1.stateId, 'TX')
  assert.equal(/@|555-123-4567/.test(r1.details), false, 'private data stripped')
  assert.ok(r1.details.includes('[removed]'))
  assert.ok(r1.verifyWith.length > 0)
  // deterministic id for identical sanitized content
  const r2 = buildCorrectionReport({
    tradeId: 'hvac', stateId: 'TX', sourceId: 'src_hvac_TX', issueType: 'broken_source',
    details: 'Link is dead, email me at jane@example.com or call 555-123-4567',
  })
  assert.equal(r1.id, r2.id)
  // unknown trade/state ⇒ null fields; invalid issue type ⇒ safe default; never throws
  const r3 = buildCorrectionReport({
    tradeId: 'not_a_trade' as unknown as CanonicalTradeId,
    stateId: 'ZZ' as unknown as CanonicalStateId,
    issueType: 'totally_invalid' as never, details: 'x'.repeat(1000),
  })
  assert.equal(r3.tradeId, null)
  assert.equal(r3.stateId, null)
  assert.equal(r3.issueType, 'outdated_source')
  assert.ok(r3.details.length <= 281)
})
