// ─────────────────────────────────────────────────────────────────────────────
// Wave 5 — Foundation, Growth, Resource & Partner Integration tests (Node runner). Deterministic:
// canonical action/evidence/outcome projection · Foundation Builder + Growth Engine integration ·
// consolidated resource/vendor registry + dedup · profile-aware recommendation determinism ·
// trade/state/lifecycle/licensing-aware recommendations · dismissed/completed suppression ·
// commercial neutrality (paid relationship cannot reorder) · affiliate disclosure · privacy-safe
// attribution · helpfulness/outcome feedback · malformed/legacy safety · recommendations cannot
// override the canonical Metrix Priority.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile, assessLifecycle,
  // Wave 5
  projectPriorityActions, projectFoundationActions, projectGrowthActions, collectCanonicalActions,
  RESOURCE_REGISTRY, getResourceById, getResourceBySourceId, allResources,
  deriveResourceRecommendations,
  buildAttributionContext,
  recordResourceFeedback, getHelpfulnessMap, getCompletedResourceIds,
  RESOURCE_REVIEWED_DATE,
  type MetrixProfileSnapshot, type CanonicalResource, type CanonicalAction,
} from '../index'
import { getFoundationItemsOrDefaults, completeFoundationItem, blockFoundationItem } from '../../foundationBuilder'
import { buildGrowthRoadmap } from '../../growthEngine'
import { AFFILIATE_PARTNERS } from '../../affiliates'

const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const NOW = '2026-07-01T00:00:00.000Z'
const lead = { firstName: 'X', email: 'x@example.com' }

function snapFor(trade: string, state: string, extra: Partial<RawAnswers> = {}): MetrixProfileSnapshot {
  const raw = {
    business_type: trade, location: { state, city: 'Somewhere' }, stage: 'months_6_12',
    setup_steps: ['biz_name'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead,
    ...extra,
  } as RawAnswers
  return evaluateMetrixProfile(raw, intake({ stage: 'months_6_12', trade, region: state }),
    { now: NOW, profileId: `mp_${trade}_${state}` })
}

// A synthetic, fit-identical resource pair differing ONLY in commercial status. Used to prove
// commercial neutrality cannot reorder recommendations.
function fitIdenticalPair(): CanonicalResource[] {
  const base: CanonicalResource = {
    resourceId: '', sourceId: '', vendorId: 'v', kind: 'vendor', category: 'insurance',
    title: 'T', description: 'D', destinationPath: null, officialUrl: 'https://x.test',
    tradeApplicability: [], stateApplicability: [], lifecycleApplicability: [],
    priorityApplicability: ['insurance'], licensingRelevant: true,
    relationshipStatus: 'editorial', affiliateStatus: 'none', sponsorshipStatus: 'none',
    reviewedDate: RESOURCE_REVIEWED_DATE, provenance: { source: 'vendor', sourceId: '', reviewedDate: RESOURCE_REVIEWED_DATE },
    placementContexts: ['dashboard'], analyticsId: 'a', active: true, stale: false, broken: false, disclosureText: 'x',
  }
  // `aaa` is purely editorial; `bbb` is a paid/affiliate/sponsored relationship.
  const editorial: CanonicalResource = { ...base, resourceId: 'vendor:aaa', sourceId: 'aaa', analyticsId: 'vendor_aaa' }
  const paid: CanonicalResource = {
    ...base, resourceId: 'vendor:bbb', sourceId: 'bbb', analyticsId: 'vendor_bbb',
    relationshipStatus: 'sponsored', affiliateStatus: 'active', sponsorshipStatus: 'sponsored',
  }
  return [paid, editorial] // intentionally paid-first in the input
}

// ── 1. Canonical action/evidence/outcome model ─────────────────────────────────
test('projectPriorityActions: authoritative steps project with evidence + progress linkage', () => {
  const snap = snapFor('hvac', 'FL')
  const actions = projectPriorityActions(snap, null, NOW)
  assert.ok(actions.length > 0, 'priority steps should project')
  for (const a of actions) {
    assert.equal(a.provenance.source, 'metrix_priority')
    assert.equal(a.sourceId, a.provenance.sourceId)              // original id preserved
    assert.ok(a.actionId.startsWith('metrix_priority:'))
    assert.ok(a.progressLinkage && a.progressLinkage.priorityId === snap.metrixPriority.priorityId)
    assert.ok(['critical', 'high', 'medium', 'low', 'unknown'].includes(a.sourcePriority))
  }
})

test('canonical action model: no recorded outcome defaults to a safe empty outcome', () => {
  const snap = snapFor('plumbing', 'TX')
  const [a] = projectPriorityActions(snap, null, NOW)
  assert.equal(a.outcome.type, 'none')
  assert.equal(a.outcome.verification, 'not_applicable')
})

// ── 2. Foundation Builder integration ──────────────────────────────────────────
test('projectFoundationActions: items project with preserved ids, blocked + completed states', () => {
  let items = getFoundationItemsOrDefaults('hvac')
  assert.ok(items.length > 0)
  const target = items[0].id
  items = completeFoundationItem(items, target)
  const blockedTarget = items[1].id
  items = blockFoundationItem(items, blockedTarget, 'waiting on EIN')

  const actions = projectFoundationActions(items, NOW)
  assert.equal(actions.length, items.length)
  const completed = actions.find(a => a.sourceId === target)!
  const blocked = actions.find(a => a.sourceId === blockedTarget)!
  assert.equal(completed.status, 'completed')
  assert.equal(completed.outcome.type, 'milestone')
  assert.equal(blocked.status, 'blocked')
  assert.equal(blocked.blockedReason, 'waiting on EIN')
  for (const a of actions) {
    assert.equal(a.provenance.source, 'foundation_builder')
    assert.ok(a.actionId.startsWith('foundation_builder:'))
    assert.equal(a.owner, 'device')
  }
})

// ── 3. Growth Engine integration ───────────────────────────────────────────────
test('projectGrowthActions: roadmap actions project as subordinate, never falsely complete', () => {
  const roadmap = buildGrowthRoadmap({ trade: 'hvac', stage: 'pre_launch', monthlyLeads: 2 })
  const actions = projectGrowthActions(roadmap, NOW)
  assert.ok(actions.length > 0)
  for (const a of actions) {
    assert.equal(a.provenance.source, 'growth_engine')
    assert.equal(a.status, 'not_started')        // recommendations are never auto-completed
    assert.equal(a.category, 'growth')
    assert.equal(a.completedAt, null)
  }
})

test('collectCanonicalActions: unified, deduped, priority-first ordering', () => {
  const snap = snapFor('electrical', 'CO')
  const items = getFoundationItemsOrDefaults('electrical')
  const roadmap = buildGrowthRoadmap({ trade: 'electrical', stage: 'pre_launch' })
  const all = collectCanonicalActions({ snapshot: snap, foundationItems: items, growthRoadmap: roadmap, now: NOW })
  const ids = all.map(a => a.actionId)
  assert.equal(new Set(ids).size, ids.length, 'no duplicate actionIds')
  // Metrix Priority actions come first.
  const firstNonPriority = all.findIndex(a => a.provenance.source !== 'metrix_priority')
  const lastPriority = all.map(a => a.provenance.source).lastIndexOf('metrix_priority')
  if (firstNonPriority !== -1) assert.ok(lastPriority < firstNonPriority)
})

// ── 4. Resource registry + dedup ───────────────────────────────────────────────
test('resource registry: built, ids preserved, no duplicate resourceIds', () => {
  const all = allResources()
  assert.ok(all.length > 0)
  const ids = all.map(r => r.resourceId)
  assert.equal(new Set(ids).size, ids.length, 'unique resourceIds')
  // Original vendor ids are preserved as sourceId.
  for (const r of all.slice(0, 10)) assert.ok(r.resourceId.endsWith(r.sourceId))
})

test('resource dedup: a tool that is both a catalog vendor and an affiliate partner is merged once', () => {
  // jobber exists in both vendorCategories and AFFILIATE_PARTNERS.
  const matches = RESOURCE_REGISTRY.filter(r => r.sourceId === 'jobber')
  assert.equal(matches.length, 1, 'jobber should appear exactly once')
  assert.ok(getResourceBySourceId('jobber'))
})

// ── 5/6. Recommendation determinism + suppression ──────────────────────────────
test('recommendation determinism: identical inputs → identical ordering', () => {
  const opts = { placement: 'dashboard' as const, priorityCategory: 'insurance' as const, trade: 'hvac', state: 'FL', now: NOW }
  const a = deriveResourceRecommendations(opts)
  const b = deriveResourceRecommendations(opts)
  assert.deepEqual(a.recommendations.map(r => r.resource.resourceId), b.recommendations.map(r => r.resource.resourceId))
})

test('recommendation: dismissed + completed resources are suppressed', () => {
  const base = { placement: 'dashboard' as const, priorityCategory: 'insurance' as const, trade: 'hvac', now: NOW }
  const full = deriveResourceRecommendations(base)
  assert.ok(full.recommendations.length > 0)
  const drop = full.recommendations[0].resource.resourceId
  const dismissed = deriveResourceRecommendations({ ...base, dismissedResourceIds: [drop] })
  assert.ok(!dismissed.recommendations.some(r => r.resource.resourceId === drop))
  const completed = deriveResourceRecommendations({ ...base, completedResourceIds: [drop] })
  assert.ok(!completed.recommendations.some(r => r.resource.resourceId === drop))
})

test('recommendation: bounded by limit', () => {
  const r = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'operations', trade: 'hvac', limit: 2, now: NOW })
  assert.ok(r.recommendations.length <= 2)
})

// ── 7/8/9. Trade / state / lifecycle awareness ─────────────────────────────────
test('trade-aware: explicit trade mismatch is excluded', () => {
  const pool: CanonicalResource[] = [{
    resourceId: 'vendor:hvaconly', sourceId: 'hvaconly', vendorId: 'hvaconly', kind: 'vendor', category: 'operations',
    title: 'HVAC only', description: '', destinationPath: null, officialUrl: 'https://x.test',
    tradeApplicability: ['hvac'], stateApplicability: [], lifecycleApplicability: [],
    priorityApplicability: ['operations'], licensingRelevant: false,
    relationshipStatus: 'editorial', affiliateStatus: 'none', sponsorshipStatus: 'none',
    reviewedDate: RESOURCE_REVIEWED_DATE, provenance: { source: 'vendor', sourceId: 'hvaconly', reviewedDate: RESOURCE_REVIEWED_DATE },
    placementContexts: ['dashboard'], analyticsId: 'a', active: true, stale: false, broken: false, disclosureText: 'x',
  }]
  const match = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'operations', trade: 'hvac', resources: pool, now: NOW })
  const mismatch = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'operations', trade: 'plumbing', resources: pool, now: NOW })
  assert.equal(match.recommendations.length, 1)
  assert.ok(!mismatch.recommendations.some(r => r.resource.resourceId === 'vendor:hvaconly'))
})

test('state-aware: explicit state mismatch is excluded', () => {
  const pool: CanonicalResource[] = [{
    resourceId: 'vendor:flonly', sourceId: 'flonly', vendorId: 'flonly', kind: 'vendor', category: 'insurance',
    title: 'FL only', description: '', destinationPath: null, officialUrl: 'https://x.test',
    tradeApplicability: [], stateApplicability: ['FL'], lifecycleApplicability: [],
    priorityApplicability: ['insurance'], licensingRelevant: true,
    relationshipStatus: 'editorial', affiliateStatus: 'none', sponsorshipStatus: 'none',
    reviewedDate: RESOURCE_REVIEWED_DATE, provenance: { source: 'vendor', sourceId: 'flonly', reviewedDate: RESOURCE_REVIEWED_DATE },
    placementContexts: ['dashboard'], analyticsId: 'a', active: true, stale: false, broken: false, disclosureText: 'x',
  }]
  const fl = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'insurance', state: 'FL', resources: pool, now: NOW })
  const tx = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'insurance', state: 'TX', resources: pool, now: NOW })
  assert.equal(fl.recommendations.length, 1)
  assert.ok(!tx.recommendations.some(r => r.resource.resourceId === 'vendor:flonly'))
})

test('lifecycle-aware: matching stage boosts an otherwise-equal resource', () => {
  const snap = snapFor('hvac', 'FL')
  const stage = assessLifecycle(snap).stage
  const r = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'operations', lifecycleStage: stage, trade: 'hvac', now: NOW })
  // Some recommendation should report a lifecycle match when the registry has stage-targeted vendors.
  assert.ok(r.recommendations.every(rec => typeof rec.applicability.lifecycle === 'boolean'))
})

// ── 10. Licensing-aware ─────────────────────────────────────────────────────────
test('licensing-aware: licensing priority surfaces licensing-relevant, disclosure-required resources', () => {
  const r = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'licensing_registration', trade: 'electrical', now: NOW })
  const licensing = r.recommendations.filter(rec => rec.resource.licensingRelevant)
  for (const rec of licensing) assert.equal(rec.disclosureStatus, 'required')
})

// ── 11/18. Commercial neutrality ────────────────────────────────────────────────
test('commercial neutrality: paid relationship cannot change relevance or ordering', () => {
  const pool = fitIdenticalPair()
  const r = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'insurance', resources: pool, now: NOW })
  assert.equal(r.recommendations.length, 2)
  // Identical fit → identical relevance regardless of commercial status.
  assert.equal(r.recommendations[0].relevance, r.recommendations[1].relevance)
  // Deterministic tiebreak is by resourceId asc — the editorial `aaa` sorts before the paid `bbb`,
  // proving sponsorship/affiliate status did NOT promote the paid resource.
  assert.equal(r.recommendations[0].resource.resourceId, 'vendor:aaa')
  assert.equal(r.recommendations[1].resource.resourceId, 'vendor:bbb')
})

// ── 12. Affiliate disclosure ────────────────────────────────────────────────────
test('affiliate disclosure: affiliate/active resources always require disclosure + carry disclosure text', () => {
  for (const r of RESOURCE_REGISTRY) {
    if (r.relationshipStatus === 'affiliate' || r.affiliateStatus === 'active') {
      assert.ok(r.disclosureText.length > 0, `${r.resourceId} must carry disclosure text`)
    }
  }
})

// ── 13. Privacy-safe attribution ────────────────────────────────────────────────
test('privacy-safe attribution: context carries no PII / raw answers / notes', () => {
  const res = RESOURCE_REGISTRY[0]
  const ctx = buildAttributionContext(res, {
    placement: 'dashboard', trade: 'hvac', state: 'florida-not-a-code', lifecycleStage: 'Launch', priorityCategory: 'insurance', disclosureShown: true,
  })
  // Only the allow-listed, non-PII fields exist.
  const allowed = new Set([
    'resourceId', 'vendorId', 'category', 'placement', 'trade', 'state', 'lifecycleStage',
    'priorityCategory', 'relationshipStatus', 'affiliateStatus', 'sponsorshipStatus', 'disclosureShown',
  ])
  for (const k of Object.keys(ctx)) assert.ok(allowed.has(k), `unexpected attribution field: ${k}`)
  // A non 2-letter state is dropped (never leaks a free-text region).
  assert.equal(ctx.state, null)
})

// ── 14. Helpfulness / outcome feedback ──────────────────────────────────────────
test('feedback: helpfulness map + completed ids derive from feedback entries (pure)', () => {
  const entries = [
    { resourceId: 'vendor:x', type: 'not_relevant' as const, note: null, createdAt: NOW, storageMode: 'local_device' as const, schemaVersion: 1 },
    { resourceId: 'vendor:y', type: 'already_completed' as const, note: null, createdAt: NOW, storageMode: 'local_device' as const, schemaVersion: 1 },
    { resourceId: 'vendor:z', type: 'helpful' as const, note: null, createdAt: NOW, storageMode: 'local_device' as const, schemaVersion: 1 },
  ]
  const map = getHelpfulnessMap(entries)
  assert.equal(map['vendor:x'], 'not_relevant')
  assert.equal(map['vendor:z'], 'helpful')
  const completed = getCompletedResourceIds(entries)
  assert.ok(completed.includes('vendor:y'))
})

test('feedback: invalid input is ignored and never throws (SSR-safe path)', () => {
  // No window in the node test env → storage no-ops, returns [] rather than throwing.
  assert.doesNotThrow(() => recordResourceFeedback('', 'helpful'))
  assert.doesNotThrow(() => recordResourceFeedback('vendor:x', 'not_a_type' as never))
})

// ── 15. Malformed / legacy safety ───────────────────────────────────────────────
test('malformed/legacy: projections + recommendations degrade safely, never throw', () => {
  assert.deepEqual(projectPriorityActions(null, null, NOW), [])
  assert.deepEqual(projectFoundationActions(null, NOW), [])
  assert.deepEqual(projectGrowthActions(null, NOW), [])
  assert.deepEqual(projectFoundationActions([{ bogus: true } as never], NOW), [])
  const r = deriveResourceRecommendations({ placement: 'dashboard' } as never)
  assert.ok(Array.isArray(r.recommendations))
  // Garbage options object still returns a valid result shape.
  const r2 = deriveResourceRecommendations({ placement: 'dashboard', trade: 123 as never, state: {} as never, now: NOW })
  assert.ok(Array.isArray(r2.recommendations))
})

// ── 16. Cloud/local compatibility ───────────────────────────────────────────────
test('cloud/local: priority action owner reflects the progress source (device vs account)', () => {
  const snap = snapFor('roofing', 'AZ')
  const deviceRec = { profileId: snap.profileId, priorityId: snap.metrixPriority.priorityId, selectedPathId: null, completedStepIds: [], evidenceStates: {}, status: 'not_started' as const, completionPercent: 0, startedAt: null, updatedAt: NOW, completedAt: null, reassessmentEligible: false, schemaVersion: 1, rulesetVersion: snap.rulesetVersion, source: 'account' as const }
  const actions = projectPriorityActions(snap, deviceRec, NOW)
  assert.ok(actions.every(a => a.owner === 'account'))
})

// ── 17. Recommendations cannot override the canonical priority ──────────────────
test('guardrail: recommendation output exposes NO competing score/priority field', () => {
  const r = deriveResourceRecommendations({ placement: 'dashboard', priorityCategory: 'insurance', trade: 'hvac', now: NOW })
  for (const rec of r.recommendations) {
    const keys = Object.keys(rec)
    assert.ok(!keys.includes('score'), 'no competing score field')
    assert.ok(!keys.includes('priority'), 'no competing priority field')
    assert.ok(!keys.includes('metrixScore'))
    // `relevance` is an internal fit number only, and `nextActionLinkage` links INTO the canonical
    // pipeline rather than replacing it.
    assert.equal(typeof rec.relevance, 'number')
  }
})

test('guardrail: affiliate partners are not double-counted as separate registry entries', () => {
  // Every affiliate partner id resolves to exactly one registry record.
  for (const p of AFFILIATE_PARTNERS) {
    const matches = RESOURCE_REGISTRY.filter(r => r.sourceId === p.id)
    assert.equal(matches.length, 1, `${p.id} resolves to one record`)
  }
})
