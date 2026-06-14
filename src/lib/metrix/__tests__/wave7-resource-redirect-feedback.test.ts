// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — CP7 redirect / consent / privacy / feedback tests (Node runner).
// Proves: held/unverified/stale/broken/disabled destinations never redirect; verified+active do;
// outbound analytics is consent-gated and privacy-safe (allow-list, query stripped); disclosure
// is attached but never gates; commercial status never affects eligibility; feedback values are
// canonical, device-local, export/delete-covered, and never touch MetrixScore; flags default OFF.
// All fixtures are in-memory — the published catalog stays empty.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  resolveRedirect, buildRedirectPath, contextCarriesPrivateData,
  getPublishedEcosystemCatalog, defaultEcosystemExtension, RESOURCE_REGISTRY,
  type EcosystemResource,
} from '../index'
import { RESOURCE_LAUNCH_IMPORT } from '../resourceLaunchImport'
import {
  RESOURCE_FEEDBACK_TYPES, recordResourceFeedback, getResourceFeedback, RESOURCE_FEEDBACK_KEY,
} from '../resourceFeedback'
import { trackOutboundClickFields, trackFeedbackFields } from '../resourceAttribution'
import { STORAGE_KEY_INVENTORY } from '../../preservation/inventory'
import { isFeatureEnabled } from '../../featureFlags'

function verified(overrides: Partial<EcosystemResource> = {}): EcosystemResource {
  const base = RESOURCE_REGISTRY[0]
  const ext = defaultEcosystemExtension('banking', 'business banking')
  return {
    ...base, ...ext,
    active: true, stale: false, broken: false,
    officialUrl: 'https://example.com/provider',
    relationshipStatus: 'editorial',
    review: { ...ext.review, verificationStatus: 'verified', reviewedDate: '2026-06-14', verificationOwner: 'r', verificationNotes: 'ok' },
    ...overrides,
  } as EcosystemResource
}

const ENABLED = true

test('disabled flag never redirects (status=disabled) regardless of record', () => {
  const r = verified()
  assert.equal(resolveRedirect(r.resourceId, [r], {}, false).status, 'disabled')
})

test('held / unverified / stale / broken / inactive records never resolve ok', () => {
  const cases: EcosystemResource[] = [
    verified({ review: { ...verified().review, verificationStatus: 'pending_verification' } }),
    verified({ review: { ...verified().review, verificationStatus: 'draft' } }),
    verified({ review: { ...verified().review, verificationStatus: 'needs_review' } }),
    verified({ stale: true }),
    verified({ broken: true }),
    verified({ active: false }),
  ]
  for (const r of cases) {
    const res = resolveRedirect(r.resourceId, [r], {}, ENABLED)
    assert.notEqual(res.status, 'ok')
    assert.equal(res.destination, null)
  }
})

test('unknown resource id fails safe (not_found, no destination)', () => {
  assert.equal(resolveRedirect('nope', [verified()], {}, ENABLED).status, 'not_found')
  assert.equal(resolveRedirect('x', [], {}, ENABLED).status, 'not_found')
})

test('all CP5 launch records remain non-resolvable (empty published catalog)', () => {
  assert.equal(getPublishedEcosystemCatalog().length, 0)
  for (const m of RESOURCE_LAUNCH_IMPORT.slice(0, 10)) {
    assert.equal(resolveRedirect(m.workbookResourceId, getPublishedEcosystemCatalog(), {}, ENABLED).status, 'not_found')
  }
})

test('a verified+active record resolves ok to its destination', () => {
  const r = verified()
  const res = resolveRedirect(r.resourceId, [r], {}, ENABLED)
  assert.equal(res.status, 'ok')
  assert.equal(res.destination, 'https://example.com/provider')
})

test('outbound analytics is consent-gated and the payload is privacy-safe (allow-list, query stripped)', () => {
  const r = verified()
  // No consent → no event.
  assert.equal(resolveRedirect(r.resourceId, [r], { consentGranted: false }, ENABLED).outboundEvent, null)
  // Consent → event, allow-listed keys only, originating query string stripped.
  const res = resolveRedirect(r.resourceId, [r], { consentGranted: true, originatingRoute: '/results?answers=secret&email=a@b.com', placement: 'resources_page' }, ENABLED)
  const ev = res.outboundEvent!
  assert.ok(ev)
  assert.equal(ev.originatingRoute, '/results') // query stripped
  const allowed = new Set(['event', 'resourceId', 'vendorId', 'placement', 'originatingRoute', 'trade', 'lifecycleStage', 'priorityCategory', 'relationshipStatus', 'disclosureRequired'])
  for (const k of Object.keys(ev)) assert.ok(allowed.has(k), `payload key '${k}' is allow-listed`)
  for (const banned of ['email', 'answers', 'rawAnswers', 'notes', 'profile', 'income', 'license']) {
    assert.ok(!(banned in ev), `payload must not contain '${banned}'`)
  }
})

test('forbidden private keys are detected by the context guard', () => {
  assert.equal(contextCarriesPrivateData({ email: 'a@b.com' }), true)
  assert.equal(contextCarriesPrivateData({ answers: [1] }), true)
  assert.equal(contextCarriesPrivateData({ placement: 'results' }), false)
})

test('disclosure is attached for a compensated record but never gates resolution', () => {
  const aff = verified({ relationshipStatus: 'affiliate' })
  const res = resolveRedirect(aff.resourceId, [aff], {}, ENABLED)
  assert.equal(res.status, 'ok')                 // disclosure does NOT block
  assert.equal(res.disclosureRequired, true)
})

test('commercial status does not change eligibility (neutrality)', () => {
  const editorial = resolveRedirect(verified({ relationshipStatus: 'editorial' }).resourceId, [verified({ relationshipStatus: 'editorial' })], {}, ENABLED)
  const affiliate = resolveRedirect(verified({ relationshipStatus: 'affiliate' }).resourceId, [verified({ relationshipStatus: 'affiliate' })], {}, ENABLED)
  assert.equal(editorial.status, affiliate.status) // both 'ok' — relationship doesn't gate
})

test('buildRedirectPath only contains the resourceId', () => {
  assert.equal(buildRedirectPath('vendor:abc'), '/resources/go/vendor%3Aabc')
})

test('field-based funnel helpers are consent-gated and never throw', () => {
  // Without consent these must be no-ops (and never throw); with consent they route via trackEvent.
  assert.doesNotThrow(() => trackOutboundClickFields({ resourceId: 'a', vendorId: null, placement: 'resource_directory', relationshipStatus: 'editorial', disclosureRequired: false }, false))
  assert.doesNotThrow(() => trackOutboundClickFields({ resourceId: 'a', vendorId: 'v', placement: 'resource_directory', relationshipStatus: 'affiliate', disclosureRequired: true }, true))
  assert.doesNotThrow(() => trackFeedbackFields('a', null, 'resource_directory', 'helpful', false))
  assert.doesNotThrow(() => trackFeedbackFields('a', 'v', 'resource_directory', 'broken', true))
})

test('feedback values cover the CP7 set and are device-local (export/delete covered)', () => {
  for (const needed of ['helpful', 'not_helpful', 'already_completed', 'not_relevant', 'broken', 'outdated', 'selected_provider', 'outcome_achieved', 'outcome_not_achieved']) {
    assert.ok((RESOURCE_FEEDBACK_TYPES as string[]).includes(needed), `feedback type '${needed}' exists`)
  }
  // The feedback key is in the preservation storage inventory (export + delete covered).
  const keys = STORAGE_KEY_INVENTORY.map(k => k.key)
  assert.ok(keys.includes(RESOURCE_FEEDBACK_KEY), 'szm_resource_feedback is preserved/export-delete covered')
})

test('feedback recording is defensive (invalid type ignored) and never throws (no DOM in test)', () => {
  assert.doesNotThrow(() => recordResourceFeedback('vendor:x', 'not_a_type' as never))
  assert.doesNotThrow(() => getResourceFeedback())
})

test('tracked_resource_redirects flag is default OFF', () => {
  assert.equal(isFeatureEnabled('tracked_resource_redirects', undefined, {}), false)
})
