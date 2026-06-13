# Pre-Launch Audit-1A — Security, Privacy, Legal, Compliance, and Trust

**Date:** 2026-06-12 · **Checkpoint audited:** `0a82785` (Growth-8 complete, incl. this audit's
small copy fix). Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## 1. Executive verdict

**PASS WITH REQUIRED FIXES.** No BLOCKERS found. The codebase is launch-safe: secrets are
server-only, payment/report-access is server-trusted, Supabase RLS is owner-scoped, the
marketing table is INSERT-only, email consent is explicit, and analytics carry no PII. One
required user-facing fix (data-selling marketing copy) was completed in this phase. Remaining
items are non-blocking SHOULD-FIX copy/UX hardening and **operational deployment steps**
(apply migration `003`, verify RLS in production, do not claim email delivery until a verified
provider exists, test production checkout/export/delete).

## 2. BLOCKERS

**None.** No issue meets the blocker bar (secret exposure, payment bypass, broken
auth/build, unauthorized DB access, or materially false legal/financial/security claims).

## 3. SHOULD FIX BEFORE LAUNCH

1. **verify-session 500 leaks raw Stripe error text.** `src/app/api/verify-session/route.ts:61`
   returns `{ error: message }` (the Stripe error string). Evidence: line 58–62. Risk: minor
   internal-detail disclosure (no secret). Fix: return a generic message; keep `console.error`
   server-side only. *(Payment file — change only as a deliberate Fix-1 task.)*
2. **Tier-preview vendor labels.** `src/lib/tierPreview.ts:50–51` list `'approved vendors'` /
   `'preferred vendors'`. Confirm these render only as **future/premium-tier feature names**,
   never as current claims about real vendors. Fix: verify on-page framing; adjust wording if
   it reads present-tense.
3. **Privacy Policy / Terms "do not sell" statements are formal disclosures (KEEP), but
   confirm accuracy vs. real processors.** `src/app/privacy/page.tsx:43,93,111,168` and
   `src/app/terms/page.tsx:161` are CCPA/TDPSA-style legally-relevant disclosures — retained.
   Fix: confirm against the actual processor list (Supabase, Stripe) before launch; ensure the
   policy lists analytics + email-capture collection added in Growth-6/8.
4. **Email-capture residual abuse risk (documented).** The public marketing table accepts
   direct anonymous INSERTs (by design). Client honeypot + cooldown + length/enum validation +
   server CHECK constraints exist, but a determined script could still insert consented rows.
   Fix (Fix-1/operational): add provider-side double-opt-in confirmation before any send, and
   consider a server route / rate limit if spam appears. Do not add CAPTCHA/paid anti-spam now.

## 4. NICE TO HAVE

- Align Privacy Policy summary line (`privacy:43`) with the detailed CCPA/TDPSA sections for
  one consistent voice.
- Add a short "what we collect" line referencing the new marketing-subscription + analytics
  events to the Privacy Policy.
- Documentation cleanup: cross-link the audit + Fix-1 from the growth roadmap.

## 5. Confirmed-safe systems

- **Secrets/env:** `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` appear **only** in
  `src/app/api/*` server routes (webhook, verify-session, checkout, track-click, postback) via
  `process.env` — never in browser code. No hardcoded `sk_*`/`whsec_`/service-role literals.
  `.gitignore` ignores `.env`, `.env.local`, `.env.*.local`, `.vercel`, `*.pem`. Browser uses
  the public anon key only (`supabaseClient.ts`).
- **Payment / Stripe / report gating:** `verify-session` returns `paid:true` only on Stripe
  `payment_status === 'paid'`; `report/page.tsx` gates `if (!paid) return <payment-required>`
  (no query-param/localStorage/direct-nav bypass). Score/report never sent from the verify
  route. Server-trusted.
- **DEV_UNLOCK:** double-gated — `DEV_UNLOCK === 'true' && NODE_ENV !== 'production'`
  (`verify-session:23–26`). Cannot activate in production.
- **Supabase / RLS:** migration `001` (`metrix_*`, owner-only `account_user_id = auth.uid()`),
  `002` (ten `cloud_sync_*`, owner-only `user_id = auth.uid()`, no public/anon read), `003`
  (`marketing_subscriptions`, **INSERT-only** for anon/authenticated with `consent = true`; no
  SELECT/UPDATE/DELETE policy → no reads/lists/modify/delete). Identity always from session
  JWT; no client-supplied identity bypass.
- **Account export/delete:** `accountDataPrivacy.ts` scopes every read/delete to
  `eq('user_id', user.id)` via the anon client; "all deleted" only when every table succeeds;
  auth-account deletion labeled admin-assisted (no service-role in browser).
- **Local↔cloud sync:** `syncConflict.ts` newest-wins is recommendation-only (never
  overwrites local); skipped/privacy-gated records were never written to cloud, so reconcile
  cannot reintroduce them. Sync status "Synced to your account" only after confirmed write.
- **Email consent (Growth-8):** unchecked by default; submit requires consent + valid email;
  `consent_text_version` (`v1-2026-06`) + timestamp stored; success only after confirmed
  insert; duplicate → "already" with **no upsert / no silent re-subscribe**; honeypot +
  cooldown + length/enum validation + safe generic errors; no fake download/delivery/
  unsubscribe claim.
- **Analytics privacy:** `trackEvent` is a no-op stub (dataLayer/dev-log only). Email-capture
  and growth events send a strict non-PII whitelist (sourcePage, sourceIntent, trade, state,
  reason, milestone) — **no email/name/raw content/credentials**. No third-party pixels/
  cookies/trackers.
- **Public pages:** `/learn`, `/learn/[slug]`, `/trades`, `publicResources.ts`,
  `ResourcePageView.tsx`, `SupportedTrades.tsx` read **no** assessment/score/account/sync data
  (no `loadIntake`/`szm_`/`getCurrentAccountUser`). Curated, no doorway/name-swap/thin pages;
  `indexable`/`published` flags gate the index; FAQ JSON-LD only where visible FAQs exist.
- **Security:** `dangerouslySetInnerHTML` is used **only** for `JSON.stringify(...JsonLd())`
  trusted structured data — no user input. CSV export neutralizes formula injection; printable
  HTML escapes user notes; external links use `rel="noopener noreferrer"`; local JSON parsing
  is guarded (`safeJsonParse`).
- **Trademark/ownership:** `™` only (no `®`) — consistent; The Modern Trades Mentor LLC named
  in policies and consent copy.
- **Affiliate/vendor neutrality:** zero `affiliateStatus: 'active'` (all `none`/`pending`);
  disclaimer states affiliate/vendor relationships are **future** and will be disclosed; no
  present-tense "we earn a commission". Vendor listings are educational/neutral.

## 6. Required deployment / manual actions

- **Apply migration `003`** (and confirm `001`/`002`) in the Supabase project; **verify RLS in
  production** (a second account cannot read another's rows; anon cannot read subscribers).
- **Do not enable email sending** until a verified delivery provider + double-opt-in +
  unsubscribe are configured; keep "update list" wording until then.
- **Confirm the Privacy Policy** against actual processors (Supabase, Stripe) and the new
  marketing-subscription + analytics collection.
- **Test production checkout** end-to-end (paid → report unlock) and confirm DEV_UNLOCK is unset
  in prod.
- **Test signed-in export/delete** and **public email insert** against applied tables.
- Verify public routes/metadata/canonicals and that account/private pages stay noindex
  (`/account/privacy` is `index:false`; `/report`, `/dashboard`, `/unlock`, `/results`,
  `/assessment` excluded from sitemap).

## 7. Files requiring edits

- **Completed this phase:** `src/app/assessment/page.tsx` — removed the user-facing
  data-selling marketing line ("We do not sell your information.") and absolute "securely"
  claims; replaced with an accurate device-local statement linking to the privacy policy.
- **For Fix-1:** `src/app/api/verify-session/route.ts` (generic 500 message),
  `src/lib/tierPreview.ts` (confirm future-tense vendor labels), `src/app/privacy/page.tsx`
  (processor/collection accuracy + voice consistency).

## 8. Proposed Pre-Launch Fix-1 plan

- **Security:** generic verify-session error message; consider server route / rate limit for
  marketing inserts if spam appears.
- **Privacy:** update Privacy Policy to list current processors (Supabase, Stripe) + the
  marketing-subscription and analytics collection; align the "do not sell" voice; document
  retention/deletion limits.
- **Legal/trust:** spot-check assessment/report/Foundation Builder/state copy for any absolute
  "complete/compliant/guaranteed" wording (none found active; keep monitoring).
- **Affiliate/vendor:** confirm tier-preview vendor labels are future-framed; keep all
  `affiliateStatus` factual.
- **UX/accessibility:** confirm focus/keyboard/labels on email capture, account-privacy
  controls, and checkout; ensure destructive-action confirmations are clear (present).
- **Deployment/manual verification:** the section 6 list (apply `003`, verify RLS, production
  checkout, export/delete, email provider + unsubscribe before any send).

## 9. Finalization & status reconciliation (2026-06-12)

**Audit-1A is COMPLETE and will not be repeated** without a concrete new risk or material
data-flow change. Verdict stands: **PASS WITH REQUIRED FIXES — 0 blockers.** Privacy Policy
alignment is complete at commit `15b7764` (audit accepted at `1558dc8`). Remaining items are
transferred to **Pre-Launch Fix-1** / deployment verification — the next phase is Fix-1, not
another Audit-1A run.

### Should-fix reconciliation (4 original)

- **#1 verify-session raw Stripe error string** — **UNRESOLVED → Fix-1 (code).** Not touched
  by `15b7764`. Return a generic user-safe 500 message; keep `console.error` server-side.
- **#2 tier-preview vendor labels (`tierPreview.ts:50–51`)** — **UNRESOLVED → Fix-1 (code/copy
  verify).** Not touched by `15b7764`. Confirm "approved/preferred vendors" render only as
  future/premium-tier feature names; adjust if present-tense.
- **#3 Privacy Policy processor/collection accuracy + sale-language voice** — **RESOLVED by
  `15b7764`.** Processors corrected (Stripe/Supabase/Vercel; the unconfigured "Resend" email
  provider removed); present-tense affiliate commission removed; current collection categories
  (incl. analytics + email-consent), uses, device-vs-cloud storage, de-identified language,
  future-evolution notice, and Account-2K export/delete + admin-assisted account-deletion limit
  disclosed; legally-required state-law sale/opt-out disclosures retained as factual.
- **#4 anonymous marketing-INSERT abuse risk** — **UNRESOLVED → Deployment / future hardening.**
  Add provider-side double-opt-in before any send; consider a server route / rate limit if spam
  appears. (Honeypot + cooldown + length/enum validation + server CHECK constraints already in
  place.) Not a launch blocker.

### Nice-to-have reconciliation (3 original)

- Privacy-summary "do not sell" voice + "what we collect" line — **RESOLVED by `15b7764`** (the
  old standalone reassurance line was replaced; collection categories now list marketing-
  subscription + analytics). Roadmap cross-link — handled in `growth-engine-roadmap.md`.

### Legal-disclosure preservation confirmed

The policy distinguishes **prohibited marketing slogans / absolute promises** (removed) from
**formal factual/legal disclosures required by applicable privacy laws** (retained: TDPSA/CPA/
OCPA/FDBR access/correction/deletion/opt-out-of-sale rights, which accurately state that no
data selling or targeted advertising occurs). No new user-facing data-selling slogan was added.

### Exact items transferred to Pre-Launch Fix-1

| Item | Class |
|---|---|
| Generic verify-session 500 error message (`verify-session/route.ts`) | Fix-1 code |
| Confirm/adjust tier-preview vendor labels (`tierPreview.ts`) | Fix-1 code/copy |
| Marketing-INSERT double-opt-in / rate-limit hardening | Deployment / future hardening |

## 10. Pre-Launch Fix-1 resolution (2026-06-12)

- **#1 verify-session raw Stripe error → RESOLVED.** The catch block now returns a generic
  `"Unable to verify payment right now. Please try again."` (HTTP 500) to the browser; the
  provider message is logged **server-side only** via `console.error` (no secrets/tokens/
  payment-method/full Stripe objects). Stripe verification logic, `payment_status === 'paid'`,
  checkout, webhook, report gating, success/cancel, DEV_UNLOCK, pricing, and env are unchanged.
- **#2 tier-preview vendor terminology → RESOLVED (verified safe; no change needed).** In
  `src/lib/tierPreview.ts`, "approved vendors"/"preferred vendors"/"affiliate tools"/"partner
  marketplace" exist **only** inside the `DO_NOT_CLAIM` blocklist (the guard that prevents such
  claims). Rendered copy is neutral ("Tool and vendor research library", `availableNow`) or
  negative-framed ("Affiliate tools presented as an upsell", `notYetAvailable`). No current
  approved/preferred/partner/sponsored vendor claim exists; the guard was preserved.
- **Active affiliate statuses:** `affiliateStatus: 'active'` count = **0** (focused recheck).
- **#4 anonymous marketing INSERT → remains Deployment / future-hardening** (not redesigned).
  Honest residual risk: a script can insert consented rows outside the browser UI. Current
  mitigations: INSERT-only RLS, no public subscriber reads, consent required, honeypot,
  cooldown, validation, DB CHECK constraints, unique normalized email, no upsert. Before any
  marketing send, require: migration `003` applied, production RLS verified, double opt-in (or
  equivalent verified-consent), and a working unsubscribe/suppression process. Future hardening
  may add a server-side endpoint, rate limiting, Turnstile/CAPTCHA, or provider abuse controls.
  Scripted abuse is **not** claimed to be fully prevented; no service-role key was added to
  browser code; no provider/dependency was added.

**Audit-1A blockers remaining: 0. Privacy Policy alignment remains complete (`15b7764`).**
**Next phase: Pre-Launch Audit-1B — Product Quality, Blind Spots, and Ten-Trade Coverage.**
| Apply migration `003` (+ confirm `001`/`002`); verify production RLS | Deployment/manual |
| Test public email-consent insert against applied tables | Deployment/manual |
| Configure + verify double opt-in / unsubscribe before any marketing send | Deployment/manual |
| Test production Stripe checkout → paid report access; confirm DEV_UNLOCK unset | Deployment/manual |
| Test signed-in account export / delete | Deployment/manual |
| Confirm Privacy Policy vs. actual processors + production data flows | Deployment/manual |
| Attorney review before public launch | Deployment/manual |

> Migration `003` is **authored but NOT confirmed applied** in production — do not treat it as
> applied until the production Supabase project confirms it.
