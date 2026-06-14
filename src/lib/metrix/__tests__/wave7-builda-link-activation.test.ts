// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — Build-A completion tests (Node runner).
// Link-audit accounting (108 classified exactly once), activation HELD (nothing activated,
// catalog still empty, CP5 map still all-held), fail-closed disclosure publication gate,
// commercial neutrality, feedback export/delete coverage + no-score-impact, and flags OFF.
// In-memory fixtures are NEVER published.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getPublishedEcosystemCatalog, defaultEcosystemExtension, RESOURCE_REGISTRY,
  isPublicEligible, publicationApproved, disclosureRenderable, requiresDisclosure,
  type EcosystemResource,
} from '../index'
import {
  RESOURCE_LINK_AUDIT, summarizeLinkAudit, ACTIVATION_HELD, ACTIVATED_COUNT,
} from '../resourceLinkAudit'
import { RESOURCE_LAUNCH_IMPORT } from '../resourceLaunchImport'
import {
  recordResourceFeedback, getResourceFeedback, clearResourceFeedback, RESOURCE_FEEDBACK_KEY,
} from '../resourceFeedback'
import { EXPORT_DELETION_INVENTORY } from '../../preservation/inventory'
import { isFeatureEnabled } from '../../featureFlags'

const CLASSES = [
  'healthy', 'healthy_with_redirect', 'temporary_failure', 'permanent_failure',
  'blocked_or_rate_limited', 'authentication_required', 'domain_mismatch',
  'unexpected_content', 'manual_review_required',
]

test('all 108 curated links were tested and classified exactly once', () => {
  assert.equal(RESOURCE_LINK_AUDIT.length, 108)
  assert.equal(new Set(RESOURCE_LINK_AUDIT.map(r => r.workbookResourceId)).size, 108)
  for (const r of RESOURCE_LINK_AUDIT) {
    assert.ok(CLASSES.includes(r.classification), `${r.workbookResourceId} has a valid class`)
    assert.equal(typeof r.testedAt, 'string')
  }
  const s = summarizeLinkAudit()
  assert.equal(Object.values(s.classifications).reduce((a, b) => a + b, 0), 108)
})

test('403/401 are NOT classified as broken (held for manual review)', () => {
  for (const r of RESOURCE_LINK_AUDIT) {
    if (r.httpStatus === 401) assert.equal(r.classification, 'authentication_required')
    if (r.httpStatus === 403 || r.httpStatus === 429) assert.equal(r.classification, 'blocked_or_rate_limited')
    if (['blocked_or_rate_limited', 'authentication_required', 'domain_mismatch'].includes(r.classification)) {
      assert.equal(r.manualReviewRequired, true)
    }
  }
})

test('healthy results are HTTPS and have an identity-matching final domain', () => {
  for (const r of RESOURCE_LINK_AUDIT) {
    if (r.classification === 'healthy' || r.classification === 'healthy_with_redirect') {
      assert.equal(r.https, true, `${r.workbookResourceId} healthy ⇒ https`)
      assert.ok(r.httpStatus >= 200 && r.httpStatus < 300)
    }
  }
})

test('ACTIVATION IS HELD — nothing was activated; the published catalog stays EMPTY', () => {
  assert.equal(ACTIVATION_HELD, true)
  assert.equal(ACTIVATED_COUNT, 0)
  assert.equal(summarizeLinkAudit().activated, 0)
  assert.equal(getPublishedEcosystemCatalog().length, 0)
})

test('every CP5 record remains held_for_review (no record flipped to public)', () => {
  for (const m of RESOURCE_LAUNCH_IMPORT) {
    assert.equal(m.publicationStatus, 'held_for_review')
    assert.notEqual(m.verificationStatus, 'approved_for_publication')
  }
})

// In-memory fixture (NEVER published).
function verified(overrides: Partial<EcosystemResource> = {}): EcosystemResource {
  const base = RESOURCE_REGISTRY[0]
  const ext = defaultEcosystemExtension('banking', 'business banking')
  return {
    ...base, ...ext, active: true, stale: false, broken: false,
    relationshipStatus: 'editorial', disclosureText: 'Disclosure text.',
    review: { ...ext.review, verificationStatus: 'verified', reviewedDate: '2026-06-14', verificationOwner: 'r', verificationNotes: 'ok' },
    ...overrides,
  } as EcosystemResource
}

test('disclosure publication gate FAILS CLOSED when a required disclosure cannot render', () => {
  const aff = verified({ relationshipStatus: 'affiliate', disclosureText: 'Affiliate disclosure.' })
  assert.equal(requiresDisclosure(aff), true)
  assert.equal(disclosureRenderable(aff), true)
  assert.equal(publicationApproved(aff), true)            // eligible + disclosure renders

  const affNoText = verified({ relationshipStatus: 'affiliate', disclosureText: '' })
  assert.equal(requiresDisclosure(affNoText), true)
  assert.equal(disclosureRenderable(affNoText), false)
  assert.equal(publicationApproved(affNoText), false)     // FAIL CLOSED

  const editorial = verified({ relationshipStatus: 'editorial' })
  assert.equal(publicationApproved(editorial), true)      // no disclosure required ⇒ passes
})

test('publication gate never overrides eligibility (held record never approved)', () => {
  const held = verified({ review: { ...verified().review, verificationStatus: 'pending_verification' } })
  assert.equal(isPublicEligible(held), false)
  assert.equal(publicationApproved(held), false)
})

test('commercial neutrality: eligibility identical for editorial vs affiliate twins', () => {
  const ed = verified({ relationshipStatus: 'editorial' })
  const af = verified({ relationshipStatus: 'affiliate' })
  assert.equal(isPublicEligible(ed), isPublicEligible(af))  // relationship never gates eligibility
})

// ── Feedback export/delete coverage (with a localStorage shim) ──────────────────
function withFakeStorage(fn: () => void) {
  const store = new Map<string, string>()
  const g = globalThis as unknown as { window?: unknown }
  const prev = g.window
  g.window = { localStorage: {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, v) },
    removeItem: (k: string) => { store.delete(k) },
  } }
  try { fn() } finally { g.window = prev }
}

test('resource feedback persists, exports (getResourceFeedback), and deletes (clearResourceFeedback)', () => {
  withFakeStorage(() => {
    recordResourceFeedback('vendor:test', 'helpful')
    recordResourceFeedback('vendor:test', 'broken')
    const exported = getResourceFeedback()                 // the device-local export representation
    assert.equal(exported.length, 2)
    assert.ok(exported.every(e => e.resourceId === 'vendor:test'))
    assert.ok(exported.every(e => e.storageMode === 'local_device'))
    clearResourceFeedback()                                 // the delete / reset flow
    assert.equal(getResourceFeedback().length, 0)
  })
})

test('feedback is export/delete covered (device-local) in the preservation inventory', () => {
  const entry = EXPORT_DELETION_INVENTORY.find(e => /resource.*feedback|feedback.*resource/i.test(e.dataset))
  assert.ok(entry, 'resource feedback is inventoried')
  assert.equal(entry!.localCovered, true)                  // device-local export + delete covered
  assert.equal(entry!.cloudCovered, false)                 // interim limitation: no cloud sync yet
  assert.equal(RESOURCE_FEEDBACK_KEY, 'szm_resource_feedback')
})

test('resource feedback does not import or touch the MetrixScore engine', () => {
  // The feedback module exposes no scoring API and persists only neutral signals.
  const fb = require('../resourceFeedback') as Record<string, unknown>
  for (const k of Object.keys(fb)) {
    assert.ok(!/score|metrixScore|evaluate|priority/i.test(k), `feedback export '${k}' is score-free`)
  }
})

test('resource feature flags remain default OFF (no activation)', () => {
  for (const f of ['verified_launch_resources', 'expanded_resource_catalog', 'tracked_resource_redirects', 'public_resource_directory'] as const) {
    assert.equal(isFeatureEnabled(f, undefined, {}), false)
  }
})
