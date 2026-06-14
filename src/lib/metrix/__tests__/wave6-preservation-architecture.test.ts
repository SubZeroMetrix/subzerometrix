// ─────────────────────────────────────────────────────────────────────────────
// Wave 6 — Preservation, Migration & Interface Architecture tests (Node runner).
// Deterministic checks that protect the full-site rebuild:
//   route / canonical-id / storage-key / analytics-event preservation · resource id uniqueness ·
//   public verification gating · direct-link eligibility · disclosure requirements · privacy-safe
//   redirect payloads (no PII, consent + flag gating) · canonical presentation passthrough (no
//   competing engine) · commercial neutrality of eligibility · feature-flag safe defaults ·
//   non-destructive migration map · no unverified provider publication.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import type { RawAnswers } from '../../scoring'
import {
  evaluateMetrixProfile,
  toMetrixScore,
  RESOURCE_REGISTRY,
  // Wave 6
  defaultEcosystemExtension,
  evaluatePublicEligibility, isPublicEligible, isDirectLinkEligible, requiresDisclosure,
  publicEligibleResources, hasVerificationEvidence,
  buildRedirectPath, resolveRedirect, contextCarriesPrivateData,
  buildDirectoryView, toRecommendationCard,
  buildCanonicalPresentation,
  getPublishedEcosystemCatalog,
  type EcosystemResource, type EcosystemCategory,
  type MetrixProfileSnapshot,
} from '../index'
import {
  PRESERVATION_INVENTORY, validateInventory,
  ROUTE_INVENTORY, CANONICAL_ID_INVENTORY, STORAGE_KEY_INVENTORY,
  CLOUD_TABLE_INVENTORY, ANALYTICS_EVENT_INVENTORY,
  validateMigrationMap, MIGRATION_MAP,
} from '../../preservation'
import {
  FEATURE_FLAGS, FEATURE_FLAG_DEFAULTS, isFeatureEnabled, resolveFeatureFlags, flagEnvVar,
} from '../../featureFlags'

const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const NOW = '2026-07-01T00:00:00.000Z'

function snapFor(trade: string, state: string, extra: Partial<RawAnswers> = {}): MetrixProfileSnapshot {
  const raw = {
    business_type: trade, location: { state, city: 'Somewhere' }, stage: 'months_6_12',
    setup_steps: ['biz_name'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers',
    lead: { firstName: 'X', email: 'x@example.com' }, ...extra,
  } as RawAnswers
  return evaluateMetrixProfile(raw, intake({ stage: 'months_6_12', trade, region: state }),
    { now: NOW, profileId: `mp_${trade}_${state}` })
}

// A factory for a master ecosystem record. `verified` + commercial knobs are explicit so tests
// can prove gating reads health/verification only and never commercial status.
function ecoResource(over: Partial<EcosystemResource> & { resourceId: string }): EcosystemResource {
  const category: EcosystemCategory = 'insurance_bonding'
  const base: EcosystemResource = {
    resourceId: over.resourceId, sourceId: over.resourceId.split(':')[1] ?? over.resourceId,
    vendorId: 'v', kind: 'vendor', category: 'insurance',
    title: 'T', description: 'D', destinationPath: null, officialUrl: 'https://x.test',
    tradeApplicability: [], stateApplicability: [], lifecycleApplicability: [],
    priorityApplicability: ['insurance'], licensingRelevant: false,
    relationshipStatus: 'editorial', affiliateStatus: 'none', sponsorshipStatus: 'none',
    reviewedDate: '2026-06-14',
    provenance: { source: 'vendor', sourceId: 'x', reviewedDate: '2026-06-14' },
    placementContexts: ['dashboard'], analyticsId: 'a', active: true, stale: false, broken: false,
    disclosureText: 'disclosure',
    ...defaultEcosystemExtension(category, 'business insurance'),
  }
  return { ...base, ...over }
}

function verified(over: Partial<EcosystemResource> & { resourceId: string }): EcosystemResource {
  const r = ecoResource(over)
  return {
    ...r,
    review: {
      ...r.review, verificationStatus: 'verified',
      verificationOwner: 'reviewer', verificationNotes: 'confirmed active 2026-06', reviewedDate: '2026-06-14',
    },
  }
}

// ── 1. Route inventory preservation ─────────────────────────────────────────────
test('inventory: structural validation passes (no dup routes/keys/tables/events)', () => {
  const v = validateInventory()
  assert.equal(v.ok, true, JSON.stringify(v))
})

test('routes: critical routes are present and every route is marked preserve', () => {
  const paths = new Set(ROUTE_INVENTORY.map(r => r.path))
  for (const p of ['/', '/assessment', '/results', '/dashboard', '/foundation-builder',
    '/growth', '/resources', '/learn/[slug]', '/platform/[trade]', '/es',
    '/api/checkout', '/api/webhook', '/api/track-click', '/sitemap.xml', '/robots.txt', '/llms.txt']) {
    assert.ok(paths.has(p), `missing route ${p}`)
  }
  assert.ok(ROUTE_INVENTORY.every(r => r.preserve === true))
})

// ── 2. Canonical ID preservation ────────────────────────────────────────────────
test('canonical ids: all 17 kinds present, unique, stable', () => {
  const kinds = CANONICAL_ID_INVENTORY.map(c => c.kind)
  assert.equal(new Set(kinds).size, kinds.length, 'duplicate id kinds')
  for (const k of ['profile', 'assessment', 'score', 'priority', 'gate', 'path', 'action',
    'step', 'question', 'trade', 'state', 'resource', 'vendor', 'referral', 'partner',
    'analytics_event', 'consent_record']) {
    assert.ok(kinds.includes(k as never), `missing id kind ${k}`)
  }
  assert.ok(CANONICAL_ID_INVENTORY.every(c => c.stable === true))
})

// ── 3. Storage-key + cloud-table preservation ───────────────────────────────────
test('storage keys: required szm_ keys preserved and cloud refs valid', () => {
  const keys = new Set(STORAGE_KEY_INVENTORY.map(s => s.key))
  for (const k of ['szm_metrix_canonical', 'szm_priority_progress', 'szm_foundation_builder',
    'szm_growth_engine', 'szm_resource_feedback', 'szm_reassessment_history']) {
    assert.ok(keys.has(k), `missing storage key ${k}`)
  }
  const tables = new Set(CLOUD_TABLE_INVENTORY.map(t => t.table))
  for (const s of STORAGE_KEY_INVENTORY) {
    if (s.cloudTable) assert.ok(tables.has(s.cloudTable), `key ${s.key} → unknown table ${s.cloudTable}`)
  }
  assert.equal(CLOUD_TABLE_INVENTORY.length, 12, 'expected 12 cloud_sync_* tables')
  assert.ok(CLOUD_TABLE_INVENTORY.every(t => t.exportCovered && t.deleteCovered && t.rls === 'owner_only'))
})

// ── 4. Analytics-event preservation ─────────────────────────────────────────────
test('analytics: events unique, no PII flag, key events preserved', () => {
  const names = ANALYTICS_EVENT_INVENTORY.map(e => e.name)
  assert.equal(new Set(names).size, names.length, 'duplicate analytics events')
  assert.ok(ANALYTICS_EVENT_INVENTORY.every(e => e.carriesPii === false))
  for (const n of ['recommendation_impression', 'recommendation_outbound_click',
    'email_capture_submitted', 'referral_created']) {
    assert.ok(names.includes(n), `missing analytics event ${n}`)
  }
})

// ── 5. Resource id uniqueness (registry) ─────────────────────────────────────────
test('resources: canonical registry resourceIds are unique', () => {
  const ids = RESOURCE_REGISTRY.map(r => r.resourceId)
  assert.equal(new Set(ids).size, ids.length, 'duplicate resourceId in registry')
})

// ── 6. Public verification gating ────────────────────────────────────────────────
test('verification: only verified + active + healthy records are public-eligible', () => {
  assert.equal(isPublicEligible(ecoResource({ resourceId: 'vendor:draft' })), false)          // draft
  assert.equal(isPublicEligible(verified({ resourceId: 'vendor:ok' })), true)
  assert.equal(isPublicEligible(verified({ resourceId: 'vendor:broken', broken: true })), false)
  assert.equal(isPublicEligible(verified({ resourceId: 'vendor:stale', stale: true })), false)
  assert.equal(isPublicEligible(verified({ resourceId: 'vendor:inactive', active: false })), false)
  assert.equal(evaluatePublicEligibility(ecoResource({ resourceId: 'vendor:d' })).reason, 'not_verified')
})

test('verification: a record cannot claim verification without evidence', () => {
  assert.equal(hasVerificationEvidence(ecoResource({ resourceId: 'vendor:noevidence' })), false)
  assert.equal(hasVerificationEvidence(verified({ resourceId: 'vendor:evidence' })), true)
})

// ── 7. Commercial neutrality of eligibility (no commercial influence) ────────────
test('neutrality: eligibility is identical for fit-identical records differing only commercially', () => {
  const editorial = verified({ resourceId: 'vendor:edi' })
  const paid = verified({
    resourceId: 'vendor:paid', relationshipStatus: 'sponsored', affiliateStatus: 'active',
    sponsorshipStatus: 'sponsored',
    relationship: { referralStatus: 'active', resellerStatus: 'reseller', integrationStatus: 'api',
      compensationDisclosure: 'paid placement' },
  })
  assert.deepEqual(evaluatePublicEligibility(editorial), evaluatePublicEligibility(paid))
  // ...but the paid one requires a disclosure and the editorial one does not.
  assert.equal(requiresDisclosure(editorial), false)
  assert.equal(requiresDisclosure(paid), true)
})

// ── 8. Direct-link eligibility (regulatory authorities always reachable) ─────────
test('direct-link: regulatory authority is directly linkable even when not verified', () => {
  const authority = ecoResource({ resourceId: 'guide:fl-cilb', category: 'licensing_authority', kind: 'guide' })
  assert.equal(isPublicEligible(authority), false)        // not verified...
  assert.equal(isDirectLinkEligible(authority), true)     // ...but an authority is still reachable
  const unverifiedVendor = ecoResource({ resourceId: 'vendor:unv' })
  assert.equal(isDirectLinkEligible(unverifiedVendor), false)
})

// ── 9. Disclosure requirements ───────────────────────────────────────────────────
test('disclosure: required for any commercial relationship or licensing relevance', () => {
  assert.equal(requiresDisclosure(ecoResource({ resourceId: 'v:1', relationshipStatus: 'affiliate' })), true)
  assert.equal(requiresDisclosure(ecoResource({ resourceId: 'v:2', licensingRelevant: true })), true)
  assert.equal(requiresDisclosure(ecoResource({ resourceId: 'v:3' })), false)  // editorial, neutral
})

// ── 10. Privacy-safe redirect payloads ───────────────────────────────────────────
test('redirect: path only contains the resourceId', () => {
  assert.equal(buildRedirectPath('vendor:jobber'), '/resources/go/vendor%3Ajobber')
})

test('redirect: disabled flag and empty catalog never reach a provider', () => {
  const cat = [verified({ resourceId: 'vendor:ok' })]
  assert.equal(resolveRedirect('vendor:ok', cat, {}, false).status, 'disabled')   // flag off
  assert.equal(resolveRedirect('vendor:ok', [], {}, true).status, 'not_found')     // empty published
  assert.equal(resolveRedirect('vendor:missing', cat, {}, true).status, 'not_found')
})

test('redirect: resolves only verified destinations and emits PII-free payload only on consent', () => {
  const cat = [
    verified({ resourceId: 'vendor:ok' }),
    verified({ resourceId: 'vendor:broken', broken: true }),
  ]
  const blocked = resolveRedirect('vendor:broken', cat, { consentGranted: true }, true)
  assert.equal(blocked.status, 'blocked')
  assert.equal(blocked.reason, 'broken')

  const noConsent = resolveRedirect('vendor:ok', cat, { consentGranted: false, trade: 'hvac' }, true)
  assert.equal(noConsent.status, 'ok')
  assert.equal(noConsent.outboundEvent, null)               // no consent → no analytics

  const ok = resolveRedirect('vendor:ok', cat, {
    consentGranted: true, trade: 'hvac', placement: 'dashboard',
    originatingRoute: '/dashboard?answers=secret',           // query string must be stripped
  }, true)
  assert.equal(ok.status, 'ok')
  assert.equal(ok.destination, 'https://x.test')
  assert.ok(ok.outboundEvent)
  const allowed = new Set(['event', 'resourceId', 'vendorId', 'placement', 'originatingRoute',
    'trade', 'lifecycleStage', 'priorityCategory', 'relationshipStatus', 'disclosureRequired'])
  for (const k of Object.keys(ok.outboundEvent!)) assert.ok(allowed.has(k), `unexpected payload key ${k}`)
  assert.equal(ok.outboundEvent!.originatingRoute, '/dashboard')  // no query string / no PII
})

test('redirect: context guard detects forbidden private keys', () => {
  assert.equal(contextCarriesPrivateData({ trade: 'hvac', placement: 'dashboard' }), false)
  assert.equal(contextCarriesPrivateData({ email: 'a@b.com' }), true)
  assert.equal(contextCarriesPrivateData({ rawAnswers: {} }), true)
})

// ── 11. Directory / recommendation contracts (public-eligible only) ──────────────
test('directory: only public-eligible records appear; drafts are excluded', () => {
  const cat = [verified({ resourceId: 'vendor:ok' }), ecoResource({ resourceId: 'vendor:draft' })]
  const view = buildDirectoryView(cat)
  assert.equal(view.length, 1)
  assert.equal(view[0].resourceId, 'vendor:ok')
  assert.equal(view[0].redirectPath, '/resources/go/vendor%3Aok')
})

test('recommendation card: returns null for non-public-eligible records', () => {
  assert.equal(toRecommendationCard(ecoResource({ resourceId: 'vendor:draft' }), 'why'), null)
  const card = toRecommendationCard(verified({ resourceId: 'vendor:ok' }), 'fits your focus')
  assert.ok(card)
  assert.equal(card!.reason, 'fits your focus')
  assert.equal(card!.useAnotherProviderOption, true)
})

// ── 12. No unverified provider publication ───────────────────────────────────────
test('no publication: the published ecosystem catalog is empty at Wave 6 close', () => {
  assert.deepEqual(getPublishedEcosystemCatalog(), [])
  assert.deepEqual(buildDirectoryView(getPublishedEcosystemCatalog()), [])
  assert.equal(publicEligibleResources(getPublishedEcosystemCatalog()).length, 0)
})

// ── 13. Canonical presentation passthrough (no competing engine) ─────────────────
test('presentation: score is a passthrough of toMetrixScore (no recomputation)', () => {
  const snap = snapFor('hvac', 'FL')
  const pres = buildCanonicalPresentation({ snapshot: snap })
  assert.equal(pres.score.overall, toMetrixScore(snap).overall)
  assert.equal(pres.priority.priorityId, snap.metrixPriority.priorityId)
  assert.equal(pres.support.profileComplete, true)
})

test('presentation: incomplete / unsupported inputs degrade safely', () => {
  const snap = snapFor('hvac', 'FL')
  const pres = buildCanonicalPresentation({
    snapshot: snap,
    trade: { tradeId: 'underwater_basketweaving', supported: false },
    licensing: { state: 'ZZ', supported: false, freshness: null },
  })
  assert.ok(pres.support.incompleteReasons.includes('trade_unsupported'))
  assert.ok(pres.support.incompleteReasons.includes('state_unsupported'))
  assert.deepEqual(pres.recommendations, [])
})

// ── 14. Feature-flag safe defaults ───────────────────────────────────────────────
test('flags: every flag defaults OFF; env override works; unknown is false', () => {
  for (const f of FEATURE_FLAGS) {
    assert.equal(FEATURE_FLAG_DEFAULTS[f], false, `${f} should default off`)
    assert.equal(isFeatureEnabled(f, undefined, {}), false)
  }
  assert.equal(isFeatureEnabled('public_resource_directory', undefined,
    { [flagEnvVar('public_resource_directory')]: 'on' }), true)
  assert.equal(isFeatureEnabled('public_resource_directory', { public_resource_directory: true }, {}), true)
  // Unknown flag → false, not a throw.
  assert.equal(isFeatureEnabled('totally_unknown' as never, undefined, {}), false)
  const all = resolveFeatureFlags(undefined, {})
  assert.ok(Object.values(all).every(v => v === false))
})

// ── 15. Non-destructive migration map ────────────────────────────────────────────
test('migration: every legacy path is non-destructive with no data loss', () => {
  const v = validateMigrationMap()
  assert.equal(v.ok, true, JSON.stringify(v))
  assert.ok(MIGRATION_MAP.every(m => m.destructive === false && m.dataLossRisk === 'none'))
  assert.ok(MIGRATION_MAP.length >= 8)
})

// ── 16. Inventory completeness sanity ────────────────────────────────────────────
test('inventory: assembled inventory exposes all sections', () => {
  assert.ok(PRESERVATION_INVENTORY.routes.length >= 30)
  assert.ok(PRESERVATION_INVENTORY.canonicalIds.length === 17)
  assert.ok(PRESERVATION_INVENTORY.storageKeys.length >= 20)
  assert.ok(PRESERVATION_INVENTORY.analyticsEvents.length === 23)
})
