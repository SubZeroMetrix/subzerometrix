// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 fix — public homepage default + rollback (Node runner).
// Proves the runtime selector: a default/empty environment and any missing env render the NEW
// HomeExperience; only an explicit NEXT_PUBLIC_USE_LEGACY_HOMEPAGE=true renders the legacy homepage.
// Also locks that the homepage depends on NO commercial flag and that pricing/checkout/Stripe/
// Founding remain independently controlled. Source + flag inspection — no Stripe, no activation.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { isLegacyHomepageEnabled, LEGACY_HOMEPAGE_ENV_VAR } from '../../home/homepageMode'
import { isFeatureEnabled } from '../../featureFlags'
import { buildApprovedCheckoutIntent } from '../../entitlements/checkout'
import { PRICING_PLANS } from '../../pricing/pricingPlans'
import { FOUNDING_AVAILABILITY } from '../../pricing/foundingAvailability'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('home: a default/empty environment renders HomeExperience (not legacy)', () => {
  assert.equal(isLegacyHomepageEnabled({}), false)
})

test('home: missing/unset env vars render HomeExperience', () => {
  assert.equal(isLegacyHomepageEnabled({ SOME_OTHER_VAR: 'x' }), false)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: undefined }), false)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: '' }), false)
  assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: 'false' }), false)
})

test('home: only an explicit truthy rollback flag renders LegacyHomeExperience', () => {
  for (const v of ['true', '1', 'on', 'yes', 'enabled', 'TRUE', ' On ']) {
    assert.equal(isLegacyHomepageEnabled({ [LEGACY_HOMEPAGE_ENV_VAR]: v }), true, v)
  }
})

test('home: the rollback switch env var is the dedicated NEXT_PUBLIC_USE_LEGACY_HOMEPAGE', () => {
  assert.equal(LEGACY_HOMEPAGE_ENV_VAR, 'NEXT_PUBLIC_USE_LEGACY_HOMEPAGE')
})

test('home: page.tsx defaults to HomeExperience and gates legacy behind the rollback switch', () => {
  const page = read('src/app/page.tsx')
  assert.ok(/isLegacyHomepageEnabled\(\)/.test(page), 'page uses the rollback switch')
  assert.ok(/if \(isLegacyHomepageEnabled\(\)\) \{\s*return <LegacyHomeExperience/.test(page), 'legacy only on rollback')
  assert.ok(/<HomeExperience \/>/.test(page), 'HomeExperience is rendered by default')
  // The homepage must not depend on any commercial feature flag.
  assert.ok(!/isFeatureEnabled/.test(page), 'homepage reads no commercial feature flag')
  assert.ok(!/presentation_shell/.test(page), 'homepage no longer keyed on presentation_shell')
})

test('home: approved pricing presentation remains independently disabled', () => {
  assert.equal(isFeatureEnabled('approved_pricing_presentation', undefined, {}), false)
})

test('home: live approved checkout remains independently disabled', () => {
  assert.equal(isFeatureEnabled('live_approved_checkout', undefined, {}), false)
})

test('home: legacy live Stripe checkout prices are unchanged', () => {
  const route = read('src/app/api/checkout/route.ts')
  assert.ok(/amount:\s*999\b/.test(route) && /amount:\s*1999\b/.test(route) && /amount:\s*2900\b/.test(route))
  // The approved amounts still derive from the model (no divergence).
  const r = buildApprovedCheckoutIntent('build')
  assert.equal(r.ok && r.intent.lineItem.unitAmount, PRICING_PLANS.build.priceCents)
})

test('home: Founding inventory remains unavailable (unknown, no fabricated count)', () => {
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.remaining, null)
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
})
