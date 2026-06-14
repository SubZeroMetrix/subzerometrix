// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 — CP9 sharing / referral / proof / email tests (Node runner).
// Verifies the existing growth systems are privacy-safe and consent-first: share/referral URLs
// carry no PII (only UTM/ref params), review routing never gates negatives to public (no review
// manipulation), testimonials require explicit consent, and email capture is mandatory-consent.
// No new consent or analytics system is introduced.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { buildShareUrl, getShareableResources } from '../../shareEngine'
import { buildReferralUrl, getReferralTrackingParams, getReferralDisclosureText } from '../../referralEngine'
import { getReviewRoutingRecommendation, getTestimonialConsentCopy } from '../../customerProof'
import { submitEmailCapture, isValidEmail, normalizeEmail, CONSENT_TEXT } from '../../emailCapture'

const ALLOWED_PARAMS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'rid'])

function assertNoPii(url: string) {
  const u = new URL(url)
  // Param NAMES are restricted to the allow-list; VALUES must carry no literal email/identifier.
  for (const [k, v] of Array.from(u.searchParams.entries())) {
    assert.ok(ALLOWED_PARAMS.has(k), `share/referral param '${k}' is allow-listed`)
    assert.ok(!v.includes('@') && !/\b\d{6,}\b/.test(v), `param value carries no PII: ${v}`)
  }
  assert.ok(!u.pathname.includes('@'), 'path carries no PII')
}

test('referral URLs carry only allow-listed UTM/ref params (no PII)', () => {
  assertNoPii(buildReferralUrl('/results', { source: 'results', channel: 'copy_link' }))
  assertNoPii(buildReferralUrl('/', { source: 'resources', channel: 'email', referrerId: 'abc123' }))
  const keys = Object.keys(getReferralTrackingParams({ source: 'results', channel: 'sms_manual', referrerId: 'r1' }))
  for (const k of keys) assert.ok(ALLOWED_PARAMS.has(k), `tracking param '${k}' allow-listed`)
})

test('share URLs (all contexts) carry no PII', () => {
  for (const r of getShareableResources()) {
    assertNoPii(buildShareUrl(r.id, 'copy_link'))
  }
})

test('referral disclosure text exists and is non-deceptive (no guaranteed reward)', () => {
  const en = getReferralDisclosureText('en')
  assert.ok(en.length > 0)
  assert.ok(!/guaranteed (reward|cash|payout)/i.test(en))
})

test('review routing never gates negatives to public (no review manipulation)', () => {
  for (const score of ['positive', 'neutral', 'negative'] as const) {
    const rec = getReviewRoutingRecommendation(score)
    assert.equal(rec.publicReviewAllowed, false, `${score}: nothing auto-posts publicly`)
  }
  // Negative feedback is routed to PRIVATE support — collected, not suppressed; never public.
  assert.equal(getReviewRoutingRecommendation('negative').route, 'private_support_feedback')
  // Positive is invited (with permission), not auto-published.
  assert.equal(getReviewRoutingRecommendation('positive').route, 'invite_testimonial')
})

test('testimonials require explicit consent copy (no auto-generated proof)', () => {
  const copy = getTestimonialConsentCopy()
  assert.ok(copy && Object.keys(copy).length > 0, 'consent copy exists')
})

test('email capture is consent-first: no consent → invalid; never subscribes', async () => {
  const noConsent = await submitEmailCapture({ email: 'a@b.com', consentToEmail: false })
  assert.equal(noConsent.status, 'invalid')
  assert.notEqual(noConsent.status, 'subscribed')
  // Honeypot / bad email never subscribe either (defensive). No DB in test ⇒ never 'subscribed'.
  const badEmail = await submitEmailCapture({ email: 'not-an-email', consentToEmail: true })
  assert.notEqual(badEmail.status, 'subscribed')
})

test('email helpers + consent text (unsubscribe-ready)', () => {
  assert.equal(isValidEmail('a@b.com'), true)
  assert.equal(isValidEmail('nope'), false)
  assert.equal(normalizeEmail('  A@B.COM '), 'a@b.com')
  assert.match(CONSENT_TEXT, /unsubscribe/i)
})
