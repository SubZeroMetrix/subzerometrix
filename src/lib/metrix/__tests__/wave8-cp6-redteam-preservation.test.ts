// ─────────────────────────────────────────────────────────────────────────────
// Wave 8 CP6 — red-team + preservation audit (Node runner).
// Locks the Wave 8 safety invariants so a future change cannot silently break them: every flag
// (incl. the new ones) defaults OFF, the LEGACY live checkout prices are untouched, the approved
// checkout never diverges from the model, Founding availability stays UNKNOWN, the webhook
// entitlement work is flag-gated and additive, migration 005 is additive + RLS-protected, the
// canonical engine never imports the entitlement domain, and no human-coaching language exists.
// Source-inspection only — no Stripe, no activation.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { FEATURE_FLAGS, isFeatureEnabled } from '../../featureFlags'
import { buildApprovedCheckoutIntent } from '../../entitlements/checkout'
import { PRICING_PLANS } from '../../pricing/pricingPlans'
import { FOUNDING_AVAILABILITY } from '../../pricing/foundingAvailability'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('cp6: every feature flag defaults OFF (incl. the two Wave 8 flags)', () => {
  for (const f of FEATURE_FLAGS) assert.equal(isFeatureEnabled(f, undefined, {}), false, `${f} OFF`)
  assert.ok(FEATURE_FLAGS.includes('approved_pricing_presentation'))
  assert.ok(FEATURE_FLAGS.includes('live_approved_checkout'))
})

test('cp6: legacy live checkout tier prices are UNCHANGED (no live Stripe change)', () => {
  const route = read('src/app/api/checkout/route.ts')
  assert.ok(/amount:\s*999\b/.test(route), 'legacy basic 999 preserved')
  assert.ok(/amount:\s*1999\b/.test(route), 'legacy pro 1999 preserved')
  assert.ok(/amount:\s*2900\b/.test(route), 'legacy platform 2900 preserved')
  // The approved path is strictly flag-gated and additive — the legacy path remains the default.
  assert.ok(/isFeatureEnabled\('live_approved_checkout'\)/.test(route), 'approved checkout is flag-gated')
  assert.ok(/TIER_PRICES/.test(route), 'legacy tier map still present')
})

test('cp6: approved checkout amounts never diverge from the approved model', () => {
  for (const plan of Object.values(PRICING_PLANS)) {
    const r = buildApprovedCheckoutIntent(plan.id, { foundingSeatAvailable: true })
    if (r.ok) assert.equal(r.intent.lineItem.unitAmount, plan.priceCents, plan.id)
  }
})

test('cp6: Founding availability remains UNKNOWN — no quantity exposed', () => {
  assert.equal(FOUNDING_AVAILABILITY.status, 'unknown')
  assert.equal(FOUNDING_AVAILABILITY.remaining, null)
  assert.equal(FOUNDING_AVAILABILITY.liveCounterActive, false)
})

test('cp6: webhook entitlement work is flag-gated and additive (legacy writes preserved)', () => {
  const wh = read('src/app/api/webhook/route.ts')
  assert.ok(/checkout\.session\.completed/.test(wh), 'legacy completed-session handling preserved')
  assert.ok(/\.from\('purchases'\)/.test(wh), 'legacy purchases insert preserved')
  assert.ok(/isFeatureEnabled\('live_approved_checkout'\)/.test(wh), 'entitlement block is flag-gated')
  assert.ok(/processed_webhook_events/.test(wh), 'idempotency ledger referenced')
  assert.ok(/stripe\.webhooks\.constructEvent/.test(wh), 'signature verification preserved')
})

test('cp6: migration 005 is additive and RLS-protected (no destructive ops)', () => {
  const sql = read('supabase/migrations/005_commercial_entitlements.sql')
  assert.ok(/create table if not exists public\.commercial_entitlements/.test(sql))
  assert.ok(/create table if not exists public\.processed_webhook_events/.test(sql))
  assert.ok(/auth\.uid\(\) = owner_user_id/.test(sql), 'owner-scoped RLS present')
  const rlsCount = (sql.match(/enable row level security/g) || []).length
  assert.ok(rlsCount >= 2, 'RLS enabled on both new tables')
  assert.equal(/drop table/i.test(sql), false, 'no table drops')
  assert.equal(/alter table public\.(assessments|purchases|metrix_)/i.test(sql), false, 'no existing tables altered')
  // The idempotency ledger has NO policy (service-role only). Match within a single statement
  // (up to the next semicolon) so a commercial_entitlements policy can't falsely span to the
  // ledger's later mention.
  assert.equal(/create policy[^;]*processed_webhook_events/i.test(sql), false, 'ledger is service-role only')
  assert.equal(/on public\.processed_webhook_events\s+for/i.test(sql), false, 'no policy targets the ledger')
})

test('cp6: the canonical metrix engine never imports the entitlement domain', () => {
  const dir = 'src/lib/metrix'
  const offenders: string[] = []
  for (const f of readdirSync(join(process.cwd(), dir))) {
    if (!f.endsWith('.ts')) continue // skip the __tests__ directory (entries) and non-ts
    const src = read(join(dir, f))
    if (/from ['"][^'"]*entitlements/.test(src)) offenders.push(f)
  }
  assert.deepEqual(offenders, [], `engine must not import entitlements: ${offenders.join(', ')}`)
})

test('cp6: the entitlement domain contains no human-coaching language', () => {
  const dir = 'src/lib/entitlements'
  for (const f of readdirSync(join(process.cwd(), dir))) {
    if (!f.endsWith('.ts')) continue
    const src = read(join(dir, f))
    assert.equal(
      /\b(coaching|coach|mentor|consultant|done-for-you|advisor)\b/i.test(src),
      false,
      `${f} must not contain coaching/advice language`,
    )
  }
})
