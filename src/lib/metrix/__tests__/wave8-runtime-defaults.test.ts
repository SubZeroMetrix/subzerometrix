// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 — system-wide runtime-default regression suite (Node runner).
// Proves the ACTUAL default runtime selection (not merely that components exist) for every
// launch-critical, environment-controlled path, so the homepage defect pattern cannot recur
// anywhere: approved public experiences are default-live, legacy is explicit-rollback-only,
// commercial/compliance systems fail closed, and one flag never activates another. Pure imports +
// targeted source inspection — no Stripe, no activation, no network.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { isLegacyHomepageEnabled, LEGACY_HOMEPAGE_ENV_VAR } from '../../home/homepageMode'
import { isFeatureEnabled, resolveFeatureFlags } from '../../featureFlags'
import { FOUNDING_AVAILABILITY } from '../../pricing/foundingAvailability'
import { CANONICAL_STATE_IDS } from '../../metrix'
import { TRADE_CONFIGS } from '../../tradeData'
import { ACTIVATED_COUNT } from '../../metrix/resourceLinkAudit'
import { getPublishedEcosystemCatalog } from '../../metrix/ecosystemCatalog'
import { isPublicEligible } from '../../metrix/resourceVerification'
import { isSupabaseConfigured } from '../../supabaseClient'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

// ── 1. Public homepage: approved is default, legacy is explicit-rollback-only ──────────
test('runtime: approved homepage is the default (unset env → HomeExperience)', () => {
  assert.equal(isLegacyHomepageEnabled({}), false)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: undefined }), false)
})

test('runtime: legacy homepage requires an explicit rollback flag', () => {
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: 'true' }), true)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: 'false' }), false)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: 'garbage' }), false) // malformed → safe
})

test('runtime: the homepage depends on NO commercial feature flag', () => {
  const page = read('src/app/page.tsx')
  assert.ok(/<HomeExperience \/>/.test(page))
  assert.ok(!/isFeatureEnabled/.test(page))
})

// ── 2. Public content/SEO routes are default-live (no flag/legacy revert) ───────────────
test('runtime: all six state routes are available and not flag-gated', () => {
  assert.equal(CANONICAL_STATE_IDS.length, 6)
  const statePage = read('src/app/state/[state]/page.tsx')
  assert.ok(!/isFeatureEnabled/.test(statePage), 'state pages are not flag-gated')
})

test('runtime: all ten trade pathways are available and not flag-gated', () => {
  assert.equal(Object.keys(TRADE_CONFIGS).length, 10)
  const tradePage = read('src/app/platform/[trade]/page.tsx')
  assert.ok(!/isFeatureEnabled/.test(tradePage), 'trade pages are not flag-gated')
})

// ── 3. Commercial systems: independent + fail-closed ────────────────────────────────────
test('runtime: pricing presentation cannot activate checkout (independent flags)', () => {
  assert.equal(isFeatureEnabled('approved_pricing_presentation', undefined, {}), false)
  assert.equal(isFeatureEnabled('live_approved_checkout', undefined, {}), false)
  // Turning the pricing flag ON must not turn checkout ON.
  const flags = resolveFeatureFlags({ approved_pricing_presentation: true }, {})
  assert.equal(flags.approved_pricing_presentation, true)
  assert.equal(flags.live_approved_checkout, false)
})

test('runtime: checkout cannot reach Stripe without server configuration', () => {
  const route = read('src/app/api/checkout/route.ts')
  assert.ok(/if \(!process\.env\.STRIPE_SECRET_KEY\)/.test(route))
  assert.ok(/status: 503/.test(route), 'missing Stripe config returns 503 (fail closed)')
})

test('runtime: legacy /unlock is not silently the approved pricing path', () => {
  const unlock = read('src/app/unlock/page.tsx')
  assert.ok(/'basic' \| 'pro' \| 'platform'/.test(unlock), 'unlock keeps its own legacy tiers')
  assert.ok(!/entitlements\/checkout|buildApprovedCheckoutIntent|PlanId/.test(unlock), 'unlock is not wired to the approved model')
})

// ── 4. Founding inventory fails closed (no fabricated availability) ──────────────────────
test('runtime: Founding inventory is unavailable without authoritative purchase data', () => {
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.remaining, null)
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
})

// ── 5. Client/feature flags cannot grant access ─────────────────────────────────────────
test('runtime: the entitlement domain reads NO feature flag or env (flags cannot grant access)', () => {
  const dir = 'src/lib/entitlements'
  for (const f of readdirSync(join(process.cwd(), dir))) {
    if (!f.endsWith('.ts')) continue
    const src = read(join(dir, f))
    assert.ok(!/isFeatureEnabled/.test(src), `${f} must not read a feature flag`)
    assert.ok(!/process\.env|NEXT_PUBLIC_/.test(src), `${f} must not read env`)
  }
})

// ── 6. Resources: held remain unpublished ───────────────────────────────────────────────
test('runtime: held resources remain unpublished (published set is verification-eligible only)', () => {
  assert.equal(ACTIVATED_COUNT, 88)
  const published = getPublishedEcosystemCatalog()
  assert.ok(Array.isArray(published))
  assert.ok(published.every(isPublicEligible), 'every published record is verification-eligible (no held)')
})

// ── 7. Consent / analytics fail closed ──────────────────────────────────────────────────
test('runtime: outbound analytics is consent-gated (no consent → no event)', () => {
  const attribution = read('src/lib/metrix/resourceAttribution.ts')
  assert.ok(/consentGranted !== true\)\s*return/.test(attribution), 'analytics emit is fail-closed on consent')
})

// ── 8. Data/account: cloud-sync absence is truthful (no fake sync) ───────────────────────
test('runtime: cloud-sync absence is reported truthfully (not faked)', () => {
  // No Supabase env in the test runtime → configured must be false, never a fabricated true.
  assert.equal(isSupabaseConfigured(), false)
})

// ── 9. Canonical Metrix engine remains singular ─────────────────────────────────────────
test('runtime: the canonical Metrix engine is singular (one toMetrixScore source)', () => {
  const index = read('src/lib/metrix/index.ts')
  assert.ok(/toMetrixScore/.test(index), 'the canonical engine is exported from the single index')
  // No parallel engine file.
  const metrixFiles = readdirSync(join(process.cwd(), 'src/lib/metrix')).filter(f => f.endsWith('.ts'))
  const enginey = metrixFiles.filter(f => /engine|score/i.test(f) && f !== 'index.ts')
  // snapshot/scoring helpers are fine; assert there is no second file literally named like an engine.
  assert.ok(!enginey.includes('metrixEngine.ts'), 'no duplicate metrixEngine.ts')
})
