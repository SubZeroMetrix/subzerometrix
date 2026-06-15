// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP1A — public presentation activation correction (Node runner).
// Proves the approved pricing presentation has its OWN default-OFF flag, decoupled from
// `presentation_shell`, so the public homepage / positioning can be activated WITHOUT exposing
// the held, checkout-divergent /pricing surface (R8). Verifies the route + sitemap gate on the new
// flag and that no flag defaults ON. Pure source/flag inspection — no Stripe, no activation.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  FEATURE_FLAGS,
  FEATURE_FLAG_DEFAULTS,
  isFeatureEnabled,
  resolveFeatureFlags,
} from '../../featureFlags'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('cp1a: a dedicated approved_pricing_presentation flag exists and defaults OFF', () => {
  assert.ok(FEATURE_FLAGS.includes('approved_pricing_presentation'))
  assert.equal(FEATURE_FLAG_DEFAULTS.approved_pricing_presentation, false)
  assert.equal(isFeatureEnabled('approved_pricing_presentation', undefined, {}), false)
  assert.equal(resolveFeatureFlags(undefined, {}).approved_pricing_presentation, false)
})

test('cp1a: every feature flag still defaults OFF after adding the pricing flag', () => {
  for (const f of FEATURE_FLAGS) {
    assert.equal(isFeatureEnabled(f, undefined, {}), false, `${f} must default OFF`)
  }
})

test('cp1a: /pricing is gated by approved_pricing_presentation, NOT presentation_shell', () => {
  const page = read('src/app/pricing/page.tsx')
  assert.ok(
    /isFeatureEnabled\('approved_pricing_presentation'\)/.test(page) && /notFound\(\)/.test(page),
    'pricing route 404s unless the dedicated pricing flag is on',
  )
  assert.ok(
    !/isFeatureEnabled\('presentation_shell'\)/.test(page),
    'pricing route must NOT be coupled to presentation_shell',
  )
})

test('cp1a: /pricing sitemap entry is gated by the dedicated pricing flag', () => {
  const sitemap = read('src/app/sitemap.ts')
  assert.ok(
    /isFeatureEnabled\('approved_pricing_presentation'\)[\s\S]*?'\/pricing'/.test(sitemap),
    'pricing sitemap entry follows the dedicated pricing flag',
  )
})

test('cp1a: the homepage is independent of every commercial feature flag', () => {
  const home = read('src/app/page.tsx')
  // Wave 8 fix: the homepage selector is the dedicated rollback switch, NOT a commercial flag.
  assert.ok(/isLegacyHomepageEnabled/.test(home), 'homepage uses the dedicated rollback switch')
  assert.ok(!/isFeatureEnabled/.test(home), 'homepage must not read any commercial feature flag')
  assert.ok(!/presentation_shell/.test(home), 'homepage must not depend on presentation_shell')
  assert.ok(!/approved_pricing_presentation/.test(home), 'homepage must not depend on the pricing flag')
})
