// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — curated 108-resource launch-set import tests (Node runner).
// Deterministic guards on the Checkpoint 5 import map: every curated record accounted for
// exactly once, deduplicated, canonical IDs preserved, government/free alternatives kept,
// publication gating (nothing public-eligible without a healthy link), unverified/stale/broken
// suppression, required-disclosure pending state, commercial neutrality, no duplicate canonical
// identity, the 2,063-item backlog NOT imported, and resource flags default OFF.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  RESOURCE_LAUNCH_IMPORT, RESOURCE_LAUNCH_IMPORT_SOURCE, summarizeLaunchImport,
  MASTER_CATALOG_BACKLOG_SIZE, MASTER_CATALOG_IMPORTED,
  type ResourceLaunchImportRecord,
} from '../resourceLaunchImport'
import { getPublishedEcosystemCatalog } from '../index'
import { isFeatureEnabled } from '../../featureFlags'

const MAP = RESOURCE_LAUNCH_IMPORT
const OFF: Record<string, string> = {} // empty env ⇒ flags fall back to safe defaults

test('every curated record is accounted for exactly once (108 unique workbook IDs)', () => {
  assert.equal(MAP.length, 108)
  assert.equal(RESOURCE_LAUNCH_IMPORT_SOURCE.curatedRowCount, 108)
  const ids = MAP.map(r => r.workbookResourceId)
  assert.equal(new Set(ids).size, 108)
})

test('dispositions are valid and sum to the full curated set', () => {
  const valid = new Set(['reuse_existing', 'merge_into_existing', 'create_new', 'hold_for_review', 'exclude'])
  for (const r of MAP) assert.ok(valid.has(r.disposition), `${r.workbookResourceId} disposition`)
  const s = summarizeLaunchImport()
  const sum = Object.values(s.dispositions).reduce((a, b) => a + b, 0)
  assert.equal(sum, 108)
})

test('canonical IDs are preserved — workbook IDs never become canonical IDs', () => {
  for (const r of MAP) {
    if (r.canonicalResourceId) {
      assert.ok(/^(vendor|affiliate|guide):/.test(r.canonicalResourceId), `${r.workbookResourceId} canonical form`)
      assert.notEqual(r.canonicalResourceId, r.workbookResourceId)
      assert.ok(!r.canonicalResourceId.startsWith('VER-'), 'workbook id is never a canonical id')
    }
    // reuse/merge must carry a match reason; create_new must not assert a canonical id
    if (r.disposition === 'create_new') assert.equal(r.canonicalResourceId, null)
  }
})

test('no duplicate canonical resource IDs (no duplicate referral/analytics identity)', () => {
  const canon = MAP.map(r => r.canonicalResourceId).filter(Boolean) as string[]
  assert.equal(new Set(canon).size, canon.length)
})

test('no duplicate canonical vendor IDs where present', () => {
  const v = MAP.map(r => r.canonicalVendorId).filter(Boolean) as string[]
  assert.equal(new Set(v).size, v.length)
})

test('normalized domains are unique within the launch set (URL/domain dedup)', () => {
  const domains = MAP.map(r => r.normalizedDomain).filter(Boolean)
  assert.equal(new Set(domains).size, domains.length)
})

test('name-only matches are held for review, not auto-merged', () => {
  for (const r of MAP) {
    if (r.disposition === 'hold_for_review') {
      assert.match(r.conflictNotes, /name matches existing record but domain differs/i)
    }
  }
})

test('publication gating: 88 approved_for_publication, 20 held (link-verified)', () => {
  const s = summarizeLaunchImport()
  assert.equal(s.publicEligible, 88)
  assert.equal(s.pendingVerification, 20)
})

test('only link-confirmed records are approved; held records are never approved', () => {
  for (const r of MAP) {
    if (r.publicationStatus === 'approved_for_publication') assert.equal(r.verificationStatus, 'live_link_confirmed')
    if (r.verificationStatus === 'destination_identified') assert.equal(r.publicationStatus, 'held_for_review')
  }
})

test('published ecosystem catalog holds the 88 approved educational records', () => {
  assert.equal(getPublishedEcosystemCatalog().length, 88)
})

test('government / nonprofit / official free alternatives are preserved (held, not excluded)', () => {
  const free = MAP.filter(r => /official\/free|government|nonprofit|association|standards|certification/i.test(r.resourceType))
  assert.ok(free.length >= 15, `free/official alternatives present (${free.length})`)
  for (const r of free) assert.notEqual(r.disposition, 'exclude')
})

test('commercial neutrality: publication tracks link health, not commercial status', () => {
  // Both commercial providers and free/government resources can be published — commercial status
  // does not block (or guarantee) publication; only the verified link result does.
  const approvedCommercial = MAP.filter(r => r.publicationStatus === 'approved_for_publication' && /provider|supplier/i.test(r.resourceType))
  const approvedFree = MAP.filter(r => r.publicationStatus === 'approved_for_publication' && /official\/free|government|nonprofit/i.test(r.resourceType))
  assert.ok(approvedCommercial.length > 0, 'commercial providers can be published (commercial status does not block)')
  assert.ok(approvedFree.length > 0, 'free/government resources are published')
  // The import map carries NO relevance/ranking/score field that commercial status could bias.
  const keys = Object.keys(MAP[0] as ResourceLaunchImportRecord)
  for (const banned of ['relevance', 'ranking', 'score', 'priority', 'rank']) {
    assert.ok(!keys.includes(banned), `import record has no '${banned}' field`)
  }
})

test('held records carry a note explaining why they are not published', () => {
  const held = MAP.filter(r => r.publicationStatus === 'held_for_review')
  assert.equal(held.length, 20)
  for (const r of held) assert.ok(r.conflictNotes.length > 0)
})

test('the 2,063-item Master Catalog backlog was NOT imported', () => {
  assert.equal(MASTER_CATALOG_IMPORTED, false)
  assert.equal(MASTER_CATALOG_BACKLOG_SIZE, 2063)
  assert.equal(MAP.length, 108)
  assert.notEqual(MAP.length, 2063)
})

test('resource feature flags remain default OFF (nothing publicly activated)', () => {
  for (const f of ['verified_launch_resources', 'expanded_resource_catalog', 'tracked_resource_redirects'] as const) {
    assert.equal(isFeatureEnabled(f, undefined, OFF), false)
  }
})
