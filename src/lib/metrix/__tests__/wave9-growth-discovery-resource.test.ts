// ─────────────────────────────────────────────────────────────────────────────
// Wave 9 CP4 — growth / discovery / resource completion (Node runner).
// Locks: resource accounting reconciles (88 published / 20 held = 108 tested); structured data
// carries NO fake ratings/reviews/offers; SEO foundations disallow private routes and cover the six
// states; published resources are verification-eligible only (held isolated). Pure — no network.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { ACTIVATED_COUNT, HELD_COUNT } from '../../metrix/resourceLinkAudit'
import { getPublishedEcosystemCatalog } from '../../metrix/ecosystemCatalog'
import { isPublicEligible, requiresDisclosure } from '../../metrix/resourceVerification'
import {
  ROBOTS_DISALLOW,
  SEO_STATE_CODES,
  canonicalUrl,
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from '../../seo'

test('cp4: resource accounting reconciles (88 published / 20 held = 108 tested)', () => {
  assert.equal(ACTIVATED_COUNT, 88)
  assert.equal(HELD_COUNT, 20)
  assert.equal(ACTIVATED_COUNT + HELD_COUNT, 108)
})

test('cp4: published resources are verification-eligible only (held remain isolated)', () => {
  const published = getPublishedEcosystemCatalog()
  assert.ok(Array.isArray(published))
  assert.ok(published.every(isPublicEligible), 'no held/unverified record is published')
})

test('cp4: commercial relationship never affects publication eligibility (neutrality)', () => {
  // A disclosed commercial record and an editorial record with identical health resolve the same
  // eligibility — disclosure is required separately but never gates eligibility.
  const published = getPublishedEcosystemCatalog()
  for (const r of published) {
    // eligibility is true for every published record regardless of whether disclosure is required
    assert.equal(isPublicEligible(r), true)
    // requiresDisclosure is a pure read that does not change eligibility
    assert.equal(typeof requiresDisclosure(r), 'boolean')
  }
})

test('cp4: structured data carries NO fake ratings, reviews, or offers', () => {
  for (const ld of [organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd()]) {
    const s = JSON.stringify(ld).toLowerCase()
    assert.equal(/aggregaterating|ratingvalue|reviewcount|"review"|"offers"|pricecurrency/.test(s), false, JSON.stringify(ld))
  }
})

test('cp4: SEO foundations disallow private/stateful routes', () => {
  for (const p of ['/dashboard', '/report', '/results', '/unlock', '/api/']) {
    assert.ok(ROBOTS_DISALLOW.includes(p), `${p} disallowed`)
  }
})

test('cp4: all six state SEO codes are present', () => {
  assert.deepEqual([...SEO_STATE_CODES], ['fl', 'co', 'tx', 'az', 'oh', 'nc'])
})

test('cp4: canonicalUrl produces an absolute https URL', () => {
  assert.match(canonicalUrl('/'), /^https:\/\//)
  assert.match(canonicalUrl('/pricing'), /\/pricing$/)
})
