// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — CP10 SEO / organic-discovery tests (Node runner).
// Verifies canonical URLs, truthful structured data (no fake ratings/reviews/prices), robots
// disallow of private/redirect routes, and sitemap coverage of the public state pages while
// excluding private/stateful routes. No doorway/keyword-spam; honest contractor-strongest framing.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  SITE_URL, canonicalUrl, buildOpenGraph, organizationJsonLd, websiteJsonLd,
  softwareApplicationJsonLd, breadcrumbJsonLd, ROBOTS_DISALLOW, SEO_STATE_CODES,
} from '../../seo'
import { CANONICAL_STATE_IDS } from '../index'

test('canonical URLs join cleanly', () => {
  assert.equal(canonicalUrl('/'), SITE_URL)
  assert.equal(canonicalUrl('/state/fl'), `${SITE_URL}/state/fl`)
  assert.equal(canonicalUrl('resources'), `${SITE_URL}/resources`)
})

test('structured data is truthful — no fake ratings, reviews, or prices', () => {
  for (const ld of [organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd()]) {
    const s = JSON.stringify(ld)
    assert.match(s, /schema\.org/)
    for (const banned of ['aggregateRating', 'ratingValue', 'reviewCount', 'review', 'offers', 'price']) {
      assert.ok(!s.includes(banned), `structured data omits '${banned}'`)
    }
  }
  assert.equal((organizationJsonLd() as Record<string, unknown>)['@type'], 'Organization')
  assert.equal((softwareApplicationJsonLd() as Record<string, unknown>)['@type'], 'SoftwareApplication')
})

test('open graph default is a website card with canonical url', () => {
  const og = buildOpenGraph()
  assert.equal(og.type, 'website')
  assert.equal(og.url, SITE_URL)
})

test('breadcrumb structured data builds a BreadcrumbList with positions', () => {
  const bc = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Florida', path: '/state/fl' }]) as Record<string, unknown>
  assert.equal(bc['@type'], 'BreadcrumbList')
  assert.ok(Array.isArray(bc.itemListElement))
})

test('robots disallows private, account, paid, stateful, and redirect routes', () => {
  for (const p of ['/api/', '/dashboard', '/account', '/report', '/unlock', '/results', '/resources/go']) {
    assert.ok(ROBOTS_DISALLOW.includes(p), `robots disallows ${p}`)
  }
  // Public state pages are NOT disallowed (they should be indexable).
  for (const code of SEO_STATE_CODES) {
    assert.ok(!ROBOTS_DISALLOW.includes(`/state/${code}`), `/state/${code} is indexable`)
  }
})

test('the public state sitemap codes match the canonical state set, with clean URLs', () => {
  assert.deepEqual([...SEO_STATE_CODES].map(c => c.toUpperCase()), [...CANONICAL_STATE_IDS])
  for (const code of SEO_STATE_CODES) {
    assert.equal(canonicalUrl(`/state/${code}`), `${SITE_URL}/state/${code}`)
  }
})
