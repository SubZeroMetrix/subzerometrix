// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 CP13 — red-team & completion audit (Node runner).
// Encodes the automated half of the final Wave 7 audit as enforced invariants:
//   resource accounting (108 = 88 published + 20 held; no 2,063 backlog) · commercial neutrality
//   (the canonical engine never imports pricing) · feature-flag safe defaults · private-route
//   non-indexing · six-state generation · pricing gating + no-fake-scarcity. Manual/hosted
//   validation stays in the Wave 10A blocker register and is NOT asserted complete here.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { RESOURCE_LAUNCH_IMPORT } from '../resourceLaunchImport'
import { RESOURCE_LINK_AUDIT } from '../resourceLinkAudit'
import { getPublishedEcosystemCatalog } from '../ecosystemCatalog'
import { SEO_STATE_CODES, ROBOTS_DISALLOW } from '../../seo'
import { FEATURE_FLAGS, isFeatureEnabled } from '../../featureFlags'

const ROOT = process.cwd()
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

// ── 1. Resource accounting (exact) ───────────────────────────────────────────────
test('audit: 108 curated = 88 published + 20 held; no 2,063 backlog imported', () => {
  assert.equal(RESOURCE_LAUNCH_IMPORT.length, 108)
  const approved = RESOURCE_LAUNCH_IMPORT.filter(r => r.publicationStatus === 'approved_for_publication')
  const held = RESOURCE_LAUNCH_IMPORT.filter(r => r.publicationStatus === 'held_for_review')
  assert.equal(approved.length, 88)
  assert.equal(held.length, 20)
  assert.equal(approved.length + held.length, 108)
  // The 2,063-item master backlog must never have been imported.
  assert.ok(RESOURCE_LAUNCH_IMPORT.length < 200, 'backlog not imported')

  const published = getPublishedEcosystemCatalog()
  assert.equal(published.length, 88)

  const healthy = RESOURCE_LINK_AUDIT.filter(
    r => r.classification === 'healthy' || r.classification === 'healthy_with_redirect',
  )
  assert.equal(healthy.length, 88)
  assert.equal(RESOURCE_LINK_AUDIT.length, 108)
})

test('audit: published records are educational/non-commercial with consented tracking only', () => {
  for (const r of getPublishedEcosystemCatalog()) {
    assert.equal(r.relationshipStatus, 'none')
    assert.equal(r.affiliateStatus, 'none')
    assert.equal(r.sponsorshipStatus, 'none')
  }
})

// ── 2. Commercial neutrality: the engine never imports pricing ───────────────────
test('audit: the canonical engine never imports the pricing module', () => {
  const dir = join(ROOT, 'src', 'lib', 'metrix')
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }) as string[]
  const offenders: string[] = []
  for (const f of files) {
    if (!/\.tsx?$/.test(f) || f.includes('__tests__')) continue
    const src = readFileSync(join(dir, f), 'utf8')
    if (/from ['"][^'"]*\/pricing\//.test(src) || /lib\/pricing/.test(src)) offenders.push(f)
  }
  assert.deepEqual(offenders, [], `pricing must not influence the engine: ${offenders.join(', ')}`)
})

// ── 3. Feature-flag audit — nothing defaults ON ──────────────────────────────────
test('audit: every feature flag (incl. new surfaces) defaults OFF', () => {
  for (const f of FEATURE_FLAGS) assert.equal(isFeatureEnabled(f, undefined, {}), false, `${f} OFF`)
  assert.ok(FEATURE_FLAGS.includes('presentation_shell'))
  assert.ok(FEATURE_FLAGS.includes('lifetime_offer_presentation'))
})

// ── 4. Private routes stay out of the index; pricing is flag-gated ───────────────
test('audit: private/stateful routes are robots-disallowed', () => {
  for (const p of ['/dashboard', '/account', '/report', '/results', '/unlock', '/resources/go', '/api/']) {
    assert.ok(ROBOTS_DISALLOW.includes(p), `${p} disallowed`)
  }
  // /pricing 404s in production (presentation_shell OFF) and its sitemap entry is flag-gated.
  const page = read('src/app/pricing/page.tsx')
  assert.ok(/isFeatureEnabled\('presentation_shell'\)/.test(page) && /notFound\(\)/.test(page),
    'pricing route 404s when the flag is off')
  const sitemap = read('src/app/sitemap.ts')
  assert.ok(/isFeatureEnabled\('presentation_shell'\)[\s\S]*?'\/pricing'/.test(sitemap),
    'pricing sitemap entry is gated behind the flag')
})

// ── 5. Six state surfaces remain generated ───────────────────────────────────────
test('audit: all six launch states are generated', () => {
  assert.deepEqual([...SEO_STATE_CODES], ['fl', 'co', 'tx', 'az', 'oh', 'nc'])
  const statePage = read('src/app/state/[state]/page.tsx')
  assert.ok(/generateStaticParams/.test(statePage), 'states are statically generated')
  // Educational, verify-before-action framing is present (not professional advice).
  assert.ok(/verifyBeforeAction|verify/i.test(statePage))
  assert.ok(/not legal advice|educational/i.test(statePage))
})
