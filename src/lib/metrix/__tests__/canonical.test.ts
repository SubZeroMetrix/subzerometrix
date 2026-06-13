// ─────────────────────────────────────────────────────────────────────────────
// metrix characterization tests (SZM-1) — Node built-in runner, zero new deps.
// Run: npm run test  (tsc -p tsconfig.test.json && node --test dist/metrix-tests)
// Pure engine/adapter/contract coverage only — no browser automation.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateScores, bandFromScore, type RawAnswers } from '../../scoring'
import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import { getSyncEntityByType, getSyncReadinessSummary } from '../../syncContracts'
import {
  evaluateMetrixProfile, toMetrixScore, getCanonicalProfile,
  persistMetrixProfile, loadMetrixProfile,
  isLegacyScoreResult, adaptLegacyScoreResult,
  reconcileCanonicalProfiles,
  projectCanonicalToLegacyScoreResult, projectCanonicalToLegacyAssessmentRow,
  estimatePotentialFromSnapshot,
  PROFILE_SCHEMA_VERSION, SCORING_VERSION, RULESET_VERSION,
  type MetrixProfileSnapshot,
} from '../index'

const LEAD = { firstName: 'B', email: 'b@example.com' }

// ── Fixtures (mirror the canonical-audit personas) ─────────────────────────────
const NOW = '2026-01-01T00:00:00.000Z'

const personaA_answers: RawAnswers = {
  business_type: 'hvac',
  location: { state: 'Texas', city: 'Austin' },
  stage: 'planning',
  setup_steps: ['none_yet'],
  financial: 'under_2k',
  customer_plan: 'no_plan',
  blocker: 'pricing',
  lead: { firstName: 'A', email: 'a@example.com' },
}
const personaA_intake: QuickIntake = {
  ...EMPTY_INTAKE, stage: 'planning', trade: 'hvac', region: 'Texas',
  teamSize: 'just_me', mainGoal: 'launch', biggestChallenge: 'pricing', confidence: 'low',
}

const personaB_answers: RawAnswers = {
  business_type: 'electrical',
  location: { state: 'Ohio', city: 'Columbus' },
  stage: 'months_6_12',
  setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance', 'license_res'],
  financial: 'k2_10',
  customer_plan: 'word_of_mouth',
  blocker: 'customers',
  lead: { firstName: 'B', email: 'b@example.com' },
}
const personaB_intake: QuickIntake = {
  ...EMPTY_INTAKE, stage: 'months_6_12', trade: 'electrical', region: 'Ohio',
  teamSize: '2_3', mainGoal: 'more_leads', biggestChallenge: 'leads', confidence: 'moderate',
}

function installMemoryStorage(): void {
  const store = new Map<string, string>()
  const g = globalThis as unknown as { window?: { localStorage: unknown } }
  g.window = g.window ?? ({} as { localStorage: unknown })
  g.window.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
    removeItem: (k: string) => { store.delete(k) },
    clear: () => { store.clear() },
  }
}

// 1 — current seven-question legacy result (Engine 1) still produces a score + band.
test('legacy Engine-1 result is produced from the 7 questions', () => {
  const e1 = calculateScores(personaB_answers)
  assert.equal(typeof e1.overall, 'number')
  assert.ok(e1.overall >= 0 && e1.overall <= 100)
  assert.equal(typeof e1.band, 'string')
  assert.deepStrictEqual(e1.answers, personaB_answers)
})

// 2 — Engine-1 vs canonical (Engine-2) disagreement is real and documented.
test('Engine-1 and canonical scores can disagree for the same answers', () => {
  const e1 = calculateScores(personaA_answers)
  const canonical = evaluateMetrixProfile(personaA_answers, personaA_intake, { now: NOW, profileId: 'mp_a' })
  assert.notEqual(e1.overall, canonical.readiness.overall)
})

// 3 — canonical determinism: same inputs + opts → byte-identical snapshot.
test('canonical evaluation is deterministic', () => {
  const a = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_fixed', assessmentId: 'as_1' })
  const b = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_fixed', assessmentId: 'as_1' })
  assert.deepStrictEqual(a, b)
})

// 4 — canonical snapshot carries the version + envelope fields.
test('canonical snapshot has version + envelope fields', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_v' })
  assert.equal(snap.profileSchemaVersion, PROFILE_SCHEMA_VERSION)
  assert.equal(snap.scoringVersion, SCORING_VERSION)
  assert.equal(snap.rulesetVersion, RULESET_VERSION)
  assert.equal(snap.profileId, 'mp_v')
  assert.equal(snap.createdAt, NOW)
  assert.equal(snap.source, 'assessment')
  assert.ok(snap.roadmapSeed.steps.length >= 1)
  assert.ok(snap.prioritySeed.path)
  // profile quality must NOT expose a confidence percentage
  assert.equal((snap.profileQuality as unknown as Record<string, unknown>).confidence, undefined)
})

// 5 — legacy szm_score loads via the adapter, preserving raw answers + provenance.
test('legacy szm_score adapts into the canonical model with provenance', () => {
  const legacy = calculateScores(personaA_answers)
  const snap = adaptLegacyScoreResult(legacy, personaA_intake, { profileId: 'mp_leg', now: NOW })
  assert.equal(snap.source, 'legacy_szm_score')
  assert.equal(snap.legacySource?.engine, 'engine1')
  assert.equal(snap.legacySource?.originalOverall, legacy.overall)
  assert.deepStrictEqual(snap.normalizedAnswers.rawAnswers, personaA_answers)
  assert.notEqual(snap.readiness.overall, snap.legacySource?.originalOverall)
})

// 6 — missing optional data does not throw and still yields a usable snapshot.
test('missing optional data is handled safely', () => {
  const sparse: RawAnswers = { business_type: 'plumbing', stage: 'thinking' }
  const snap = evaluateMetrixProfile(sparse, null, { now: NOW, profileId: 'mp_sparse' })
  assert.equal(typeof snap.readiness.overall, 'number')
  assert.ok(snap.profileQuality.coverage.total === 21)
})

// 7 — malformed legacy data is rejected by the detector (no false positives).
test('malformed legacy data is detected and rejected', () => {
  assert.equal(isLegacyScoreResult(null), false)
  assert.equal(isLegacyScoreResult(42), false)
  assert.equal(isLegacyScoreResult({}), false)
  assert.equal(isLegacyScoreResult({ overall: 'x', band: 'y' }), false)
  assert.equal(isLegacyScoreResult(calculateScores(personaB_answers)), true)
})

// 8 — results/report/dashboard read the SAME canonical model (shared read model).
test('all consumers derive an identical MetrixScore from one snapshot', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_shared' })
  const a = toMetrixScore(snap)
  const b = toMetrixScore(snap)
  assert.deepStrictEqual(a, b)
  assert.equal(a.overall, snap.readiness.overall)
  assert.equal(a.recommendedPath.id, snap.prioritySeed.path.id)
})

// 9 — local canonical profile persists + reloads losslessly.
test('canonical profile persists and reloads', () => {
  installMemoryStorage()
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_persist' })
  persistMetrixProfile(snap)
  const reloaded = loadMetrixProfile()
  assert.deepStrictEqual(reloaded, snap)
  // getCanonicalProfile returns the persisted snapshot for the same answers (no re-eval/new id)
  const got = getCanonicalProfile(personaB_answers, personaB_intake)
  assert.equal(got.profileId, 'mp_persist')
})

// 10 — cloud capability contract reflects the live Account-2D writer.
test('cloud capability contract reports the wired history entities', () => {
  assert.equal(getSyncEntityByType('assessment_history').cloudWriteWired, true)
  assert.equal(getSyncEntityByType('metrix_score_history').cloudWriteWired, true)
  assert.equal(getSyncEntityByType('partner_interest').cloudWriteWired, false)
  const summary = getSyncReadinessSummary()
  assert.equal(summary.anyCloudSyncLive, true)
  assert.equal(summary.cloudWriteWired, 2)
})

// 11 — anonymous local + empty account → keep local (additive).
test('reconcile: local + empty cloud keeps local', () => {
  const local = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_local', assessmentId: 'as_x' })
  const r = reconcileCanonicalProfiles(local, [])
  assert.equal(r.action, 'kept_local')
  assert.equal(r.resolved, local)
  assert.equal(r.additive.length, 1)
})

// 12 — anonymous local + matching (older) cloud → keep local, dedup to one.
test('reconcile: local + matching older cloud keeps local', () => {
  const local = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: '2026-02-01T00:00:00.000Z', profileId: 'mp_m', assessmentId: 'as_m' })
  const olderCloud: MetrixProfileSnapshot = { ...local, createdAt: '2026-01-01T00:00:00.000Z' }
  const r = reconcileCanonicalProfiles(local, [olderCloud])
  assert.ok(r.action === 'kept_local' || r.action === 'kept_local_conflict')
  assert.equal(r.resolved, local)
  assert.equal(r.additive.length, 1) // same key → deduped
})

// 13 — anonymous local + conflicting NEWER cloud (>= complete) → adopt cloud, keep both.
test('reconcile: conflicting newer cloud is adopted, nothing dropped', () => {
  const local = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: '2026-01-01T00:00:00.000Z', profileId: 'mp_l2', assessmentId: 'as_l2' })
  const newerCloud = evaluateMetrixProfile(personaA_answers, personaA_intake, { now: '2026-03-01T00:00:00.000Z', profileId: 'mp_c2', assessmentId: 'as_c2' })
  // make cloud at least as complete as local
  const cloud: MetrixProfileSnapshot = { ...newerCloud, profileQuality: { ...newerCloud.profileQuality, coverage: { ...newerCloud.profileQuality.coverage, answered: local.profileQuality.coverage.answered } } }
  const r = reconcileCanonicalProfiles(local, [cloud])
  assert.equal(r.action, 'adopted_cloud')
  assert.equal(r.resolved, cloud)
  assert.equal(r.conflicts.length, 1)
  assert.equal(r.additive.length, 2) // different keys → both retained
})

// 14 — never overwrite a MORE-COMPLETE local even if cloud is newer.
test('reconcile: newer-but-less-complete cloud does not overwrite local', () => {
  const local = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: '2026-01-01T00:00:00.000Z', profileId: 'mp_l3', assessmentId: 'as_l3' })
  const newerCloud = evaluateMetrixProfile(personaA_answers, personaA_intake, { now: '2026-03-01T00:00:00.000Z', profileId: 'mp_c3', assessmentId: 'as_c3' })
  const lessComplete: MetrixProfileSnapshot = { ...newerCloud, profileQuality: { ...newerCloud.profileQuality, coverage: { ...newerCloud.profileQuality.coverage, answered: 0 } } }
  const r = reconcileCanonicalProfiles(local, [lessComplete])
  assert.equal(r.action, 'kept_local_conflict')
  assert.equal(r.resolved, local)
})

// ── SZM-1A: Engine 1 removed from the live submission write path ────────────────

// 15 — the projected szm_score carries the CANONICAL score, not an Engine-1 calculation.
test('SZM-1A: projected szm_score overall is canonical, not Engine-1', () => {
  const snap = evaluateMetrixProfile(personaA_answers, personaA_intake, { now: NOW, profileId: 'mp_p' })
  const projected = projectCanonicalToLegacyScoreResult(snap, personaA_answers, { firstName: 'A', email: 'a@example.com' })
  const e1 = calculateScores(personaA_answers)
  assert.equal(projected.overall, snap.readiness.overall)   // canonical
  assert.notEqual(projected.overall, e1.overall)             // not the Engine-1 number
})

// 16 — the projected band is derived from the canonical score (bandFromScore).
test('SZM-1A: projected band derives from the canonical score', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_b' })
  const projected = projectCanonicalToLegacyScoreResult(snap, personaB_answers, LEAD)
  assert.equal(projected.band, bandFromScore(snap.readiness.overall).band)
})

// 17 — compatibility projection preserves raw answers + canonical timestamp.
test('SZM-1A: projection preserves raw answers and canonical createdAt', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_pa' })
  const projected = projectCanonicalToLegacyScoreResult(snap, personaB_answers, LEAD)
  assert.deepStrictEqual(projected.answers, personaB_answers)
  assert.equal(projected.completedAt, snap.createdAt)
  assert.equal(projected.leadName, 'B')
})

// 18 — the legacy roadmap inputs (categoryScores) derive from the canonical categories.
test('SZM-1A: projected categoryScores derive from canonical readiness', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_cat' })
  const projected = projectCanonicalToLegacyScoreResult(snap, personaB_answers, LEAD)
  const fc = snap.readiness.categories.find(c => c.category === 'financial_control')!.score
  const bf = snap.readiness.categories.find(c => c.category === 'business_foundation')!.score
  assert.equal(projected.categoryScores.financialReadiness, Math.round((fc / 100) * 20))
  assert.equal(projected.categoryScores.setupReadiness, Math.round((bf / 100) * 20))
})

// 19 — the Supabase row is canonical-sourced + version-tagged, not labeled Engine 1.
test('SZM-1A: Supabase row is canonical-sourced and version-tagged', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_row' })
  const row = projectCanonicalToLegacyAssessmentRow(snap, personaB_answers, LEAD) as Record<string, unknown>
  assert.equal(row.overall_score, snap.readiness.overall)
  assert.deepStrictEqual(row.answers_json, personaB_answers)
  const reportJson = row.report_json as Record<string, unknown>
  assert.equal(reportJson.canonical, true)
  assert.equal(reportJson.scoringVersion, SCORING_VERSION)
  assert.equal(reportJson.source, 'assessment')
})

// 20 — stored canonical score equals displayed read-model score.
test('SZM-1A: stored projection overall equals displayed read-model overall', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_eq' })
  const projected = projectCanonicalToLegacyScoreResult(snap, personaB_answers, LEAD)
  assert.equal(projected.overall, toMetrixScore(snap).overall)
})

// 21 — dashboard potential sources CURRENT from the canonical snapshot (no recompute).
test('SZM-1A: potential current equals the canonical snapshot overall', () => {
  const snap = evaluateMetrixProfile(personaB_answers, personaB_intake, { now: NOW, profileId: 'mp_pot' })
  const pot = estimatePotentialFromSnapshot(snap)
  assert.equal(pot.current, snap.readiness.overall)
  assert.ok(pot.projected >= pot.current)
})

// 22 — historical Engine-1 records remain readable + adaptable (provenance retained).
test('SZM-1A: historical Engine-1 record remains readable', () => {
  const historical = calculateScores(personaA_answers)   // an old szm_score shape
  assert.equal(isLegacyScoreResult(historical), true)
  const snap = adaptLegacyScoreResult(historical, personaA_intake, { profileId: 'mp_hist', now: NOW })
  assert.equal(snap.legacySource?.originalOverall, historical.overall)
  assert.deepStrictEqual(snap.normalizedAnswers.rawAnswers, personaA_answers)
})
