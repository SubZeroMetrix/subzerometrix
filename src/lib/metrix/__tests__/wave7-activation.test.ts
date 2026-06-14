// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — educational resource activation tests (Node runner).
// Proves the published launch set is exactly the 88 technically-verified educational listings:
// HTTPS-only, non-commercial (no inferred affiliate/partner), canonical IDs, deterministic
// ordering, canonical redirect routing (no raw bypass), use-another-provider preserved, regulated
// notices render where required, disclosure fails closed, and the 20 held records stay out.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getPublishedEcosystemCatalog, buildDirectoryView, resolveRedirect,
  isPublicEligible, publicationApproved, requiresDisclosure,
  type EcosystemResource,
} from '../index'
import { RESOURCE_LINK_AUDIT } from '../resourceLinkAudit'
import { RESOURCE_LAUNCH_IMPORT } from '../resourceLaunchImport'
import { noticesForCategories, REGULATED_NOTICES } from '../categoryNotices'
import { isFeatureEnabled } from '../../featureFlags'

const CATALOG = getPublishedEcosystemCatalog()

test('exactly 88 educational records are published; all active + launch-eligible', () => {
  assert.equal(CATALOG.length, 88)
  for (const r of CATALOG) {
    assert.equal(r.review.verificationStatus, 'live_link_confirmed')
    assert.equal(r.active, true)
    assert.equal(r.launch.launchEligible, true)
    assert.equal(isPublicEligible(r), true)
    assert.equal(publicationApproved(r), true)
  }
})

test('every active record uses HTTPS', () => {
  for (const r of CATALOG) assert.ok((r.officialUrl ?? '').startsWith('https://'), `${r.resourceId} is https`)
})

test('published set matches the 88 healthy link-audit results (no failed/blocked record)', () => {
  const healthyIds = new Set(
    RESOURCE_LINK_AUDIT.filter(r => r.classification === 'healthy' || r.classification === 'healthy_with_redirect')
      .map(r => r.workbookResourceId),
  )
  assert.equal(healthyIds.size, 88)
  for (const r of CATALOG) assert.ok(healthyIds.has(r.sourceId), `${r.sourceId} was a healthy link result`)
})

test('no affiliate / sponsor / partner status is inferred — every listing is non-commercial', () => {
  for (const r of CATALOG) {
    assert.equal(r.relationshipStatus, 'none')
    assert.equal(r.affiliateStatus, 'none')
    assert.equal(r.sponsorshipStatus, 'none')
    assert.equal(r.relationship.referralStatus, 'none')
    assert.equal(r.relationship.resellerStatus, 'none')
    assert.equal(r.relationship.compensationDisclosure, null)
  }
})

test('canonical IDs are preserved; resourceIds are namespaced, never raw workbook IDs', () => {
  for (const r of CATALOG) {
    assert.ok(/^(vendor|affiliate|guide):/.test(r.resourceId), `${r.resourceId} is namespaced`)
    assert.ok(!r.resourceId.startsWith('VER-'))
  }
  // reuse/merge records preserve the canonical ID from the import map.
  const byId = Object.fromEntries(RESOURCE_LAUNCH_IMPORT.map(m => [m.workbookResourceId, m.canonicalResourceId]))
  for (const r of CATALOG) {
    const canon = byId[r.sourceId]
    if (canon) assert.equal(r.resourceId, canon, `${r.sourceId} preserves canonical id`)
  }
})

test('directory shows all 88, deterministically ordered, via canonical redirect routing', () => {
  const view = buildDirectoryView(CATALOG, {})
  assert.equal(view.length, 88)
  for (const e of view) {
    assert.ok(e.redirectPath.startsWith('/resources/go/'), 'outbound uses canonical redirect')
    assert.equal(e.useAnotherProviderOption, true)
    assert.equal(e.officialAlternativeUrl, null) // no raw direct-alt bypass on these records
  }
  // ordering is by category then title (independent of any commercial status)
  const sorted = [...view].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
  assert.deepEqual(view.map(e => e.resourceId), sorted.map(e => e.resourceId))
})

test('a published record resolves through the canonical redirect; held workbook IDs never do', () => {
  const r = CATALOG[0]
  assert.equal(resolveRedirect(r.resourceId, CATALOG, {}, true).status, 'ok')
  // workbook IDs (VER-*) are never resourceIds in the catalog → always fail safe
  for (const m of RESOURCE_LAUNCH_IMPORT.filter(x => x.publicationStatus === 'held_for_review').slice(0, 5)) {
    assert.equal(resolveRedirect(m.workbookResourceId, CATALOG, {}, true).status, 'not_found')
  }
})

test('redirect fails closed when a required (commercial) disclosure cannot render', () => {
  // A non-authority record that requires disclosure (affiliate) but has no renderable text must be
  // blocked. (Licensing authorities are reference data and resolve via the direct-link path.)
  const base = CATALOG.find(r => r.category !== 'licensing_authority' && r.category !== 'permit_office')!
  const ok: EcosystemResource = { ...base, relationshipStatus: 'affiliate', disclosureText: 'Disclosure.' }
  const broken: EcosystemResource = { ...base, relationshipStatus: 'affiliate', disclosureText: '' }
  assert.equal(requiresDisclosure(broken), true)
  assert.equal(resolveRedirect(ok.resourceId, [ok], {}, true).status, 'ok')        // disclosure renders → ok
  assert.equal(resolveRedirect(broken.resourceId, [broken], {}, true).status, 'blocked') // fail closed
})

test('regulated-category notices render only for their categories (short cleanup text)', () => {
  assert.deepEqual(noticesForCategories(['banking']).map(n => n.key), ['financing'])
  assert.deepEqual(noticesForCategories(['insurance_bonding']).map(n => n.key), ['insurance'])
  assert.deepEqual(noticesForCategories(['accounting_bookkeeping_payroll']).map(n => n.key), ['advice'])
  assert.deepEqual(noticesForCategories(['legal_formation_licensing_compliance']).map(n => n.key), ['advice'])
  assert.deepEqual(noticesForCategories(['marketing_websites_local_search_content']), []) // non-regulated → none
  assert.deepEqual(noticesForCategories([], true).map(n => n.key), ['licensing'])
  assert.equal(REGULATED_NOTICES.financing, 'SubZeroMetrix is not a lender or broker.')
  // notices are concise (cleanup) — not full-paragraph disclaimers
  for (const v of Object.values(REGULATED_NOTICES)) assert.ok(v.length < 90, 'notice is brief')
})

test('published records carry a truthful provider class for factual card labels', () => {
  const view = buildDirectoryView(CATALOG, {})
  const valid = new Set(['official', 'government', 'nonprofit', 'association', 'commercial'])
  for (const e of view) assert.ok(e.providerClass && valid.has(e.providerClass), `${e.resourceId} has a provider class`)
  // commercial listings exist and are labelled factually (not as endorsements)
  assert.ok(view.some(e => e.providerClass === 'commercial'))
  assert.ok(view.some(e => e.providerClass === 'official' || e.providerClass === 'government'))
})

test('licensing-relevant published records carry a renderable disclosure (publication-approved)', () => {
  for (const r of CATALOG) {
    if (requiresDisclosure(r)) {
      assert.ok(typeof r.disclosureText === 'string' && r.disclosureText.trim().length > 0)
    }
  }
})

test('resource flags remain default OFF (controlled preview only)', () => {
  for (const f of ['public_resource_directory', 'verified_launch_resources', 'expanded_resource_catalog', 'tracked_resource_redirects'] as const) {
    assert.equal(isFeatureEnabled(f, undefined, {}), false)
  }
})
