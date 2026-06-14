// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — public Resource Directory tests (CP6, Node runner).
// Verifies the directory consumes ONLY public-eligible records, shows an empty directory while
// the published catalog is empty, filters deterministically once eligible records exist, exposes
// only presentation-safe card fields, and that publication gating + flags hold.
// In-memory fixtures are NEVER published — the canonical published catalog stays empty.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildDirectoryView, toRecommendationCard, getPublishedEcosystemCatalog,
  defaultEcosystemExtension, RESOURCE_REGISTRY, isPublicEligible,
  type EcosystemResource, type DirectoryEntry,
} from '../index'
import {
  DIRECTORY_CATEGORY_OPTIONS, DIRECTORY_TRADE_OPTIONS, DIRECTORY_STATE_OPTIONS,
  DIRECTORY_LIFECYCLE_OPTIONS, DIRECTORY_RELATIONSHIP_OPTIONS,
} from '../directoryOptions'
import { ECOSYSTEM_CATEGORIES } from '../resourceEcosystem'
import { isFeatureEnabled } from '../../featureFlags'

// Build an in-memory ecosystem record (NOT published) from a real canonical base.
function makeRecord(overrides: Partial<EcosystemResource> = {}): EcosystemResource {
  const base = RESOURCE_REGISTRY[0]
  const ext = defaultEcosystemExtension('banking', 'business banking')
  return {
    ...base,
    ...ext,
    active: true, stale: false, broken: false,
    tradeApplicability: ['hvac'],
    review: { ...ext.review, verificationStatus: 'verified', reviewedDate: '2026-06-14', verificationOwner: 'reviewer', verificationNotes: 'confirmed' },
    operations: { ...ext.operations, regionsServed: ['FL'], lifecycleStagesServed: ['Launch'], businessNeed: 'business banking' },
    ...overrides,
  } as EcosystemResource
}

test('directory is EMPTY while the published catalog is empty (no held record surfaces)', () => {
  assert.equal(getPublishedEcosystemCatalog().length, 0)
  assert.deepEqual(buildDirectoryView(getPublishedEcosystemCatalog(), {}), [])
})

test('a verified+active record surfaces; non-eligible records never do', () => {
  const verified = makeRecord()
  assert.equal(isPublicEligible(verified), true)
  assert.equal(buildDirectoryView([verified], {}).length, 1)

  for (const bad of [
    makeRecord({ review: { ...makeRecord().review, verificationStatus: 'pending_verification' } }),
    makeRecord({ review: { ...makeRecord().review, verificationStatus: 'draft' } }),
    makeRecord({ stale: true }),
    makeRecord({ broken: true }),
    makeRecord({ active: false }),
  ]) {
    assert.equal(isPublicEligible(bad), false)
    assert.equal(buildDirectoryView([bad], {}).length, 0)
  }
})

test('filters apply deterministically (category/trade/region/lifecycle/relationship/need)', () => {
  const r = makeRecord({ ecosystemCategory: 'banking', relationshipStatus: 'editorial' })
  assert.equal(buildDirectoryView([r], { category: 'banking' }).length, 1)
  assert.equal(buildDirectoryView([r], { category: 'insurance_bonding' }).length, 0)
  assert.equal(buildDirectoryView([r], { trade: 'hvac' }).length, 1)
  assert.equal(buildDirectoryView([r], { trade: 'plumbing' }).length, 0)
  assert.equal(buildDirectoryView([r], { region: 'FL' }).length, 1)
  assert.equal(buildDirectoryView([r], { region: 'TX' }).length, 0)
  assert.equal(buildDirectoryView([r], { lifecycleStage: 'Launch' }).length, 1)
  assert.equal(buildDirectoryView([r], { lifecycleStage: 'Scale' }).length, 0)
  assert.equal(buildDirectoryView([r], { relationshipType: 'editorial' }).length, 1)
  assert.equal(buildDirectoryView([r], { relationshipType: 'affiliate' }).length, 0)
  assert.equal(buildDirectoryView([r], { businessNeed: 'banking' }).length, 1)
  assert.equal(buildDirectoryView([r], { businessNeed: 'roofing' }).length, 0)
})

test('directory entry exposes only presentation-safe fields (no internal verification/commercial metadata)', () => {
  const entry: DirectoryEntry = buildDirectoryView([makeRecord()], {})[0]
  const keys = Object.keys(entry)
  for (const banned of ['verificationNotes', 'verificationOwner', 'compensationDisclosure', 'supportContact', 'eligibility', 'verificationPriority']) {
    assert.ok(!keys.includes(banned), `directory entry must not expose '${banned}'`)
  }
  assert.ok(keys.includes('reviewedDate') && keys.includes('disclosureRequired') && keys.includes('useAnotherProviderOption'))
})

test('directory and recommendations both refuse non-public-eligible records', () => {
  const held = makeRecord({ review: { ...makeRecord().review, verificationStatus: 'pending_verification' } })
  assert.equal(buildDirectoryView([held], {}).length, 0)
  assert.equal(toRecommendationCard(held, 'why'), null)
})

test('filter option lists are complete and canonical', () => {
  assert.equal(DIRECTORY_CATEGORY_OPTIONS.length, ECOSYSTEM_CATEGORIES.length)
  assert.equal(DIRECTORY_CATEGORY_OPTIONS.length, 29)
  assert.equal(DIRECTORY_TRADE_OPTIONS.length, 10)
  assert.equal(DIRECTORY_STATE_OPTIONS.length, 6)
  assert.equal(DIRECTORY_LIFECYCLE_OPTIONS.length, 8)
  assert.equal(DIRECTORY_RELATIONSHIP_OPTIONS.length, 5)
  assert.deepEqual(DIRECTORY_STATE_OPTIONS.map(o => o.value), ['FL', 'CO', 'TX', 'AZ', 'OH', 'NC'])
})

test('public_resource_directory flag is default OFF', () => {
  assert.equal(isFeatureEnabled('public_resource_directory', undefined, {}), false)
})
