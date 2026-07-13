# Customer Feedback / Proof Sync — Privacy-Gated (Account-2F)

**Status:** Third active cloud-sync flow, and the **first that touches a free-text field**
— so it runs through a conservative **privacy gate**. Syncs ONLY a user's own private
customer-feedback records to their own account. No publishing, no reviews, no incentives.
Part of **Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).
Pairs with `customer-proof-review-engine.md` (Growth-4).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write of at least one eligible record. Signed out → "Sign in to back up
> progress"; missing table/migration or a write failure → "Sync unavailable." Local
> feedback is always left intact.

## What Account-2F built

- **`src/lib/customerFeedbackSync.ts`** — privacy-gated sync writer/reader scoped to ONE
  table. Exports `CustomerFeedbackSyncStatus`, `CustomerFeedbackSyncResult`,
  `CustomerFeedbackSyncReadiness`, `FeedbackEligibility`, `getFeedbackEligibility()`,
  `getCustomerFeedbackSyncReadiness()`, `syncCustomerFeedbackToAccount()`,
  `loadCustomerFeedbackFromAccount()`, `getCustomerFeedbackSyncErrorMessage()`.
- Wired the live status into `SyncStatusBadge` on `/dashboard` and `/report`, next to the
  consent-first `CustomerProofPrompt`.

## Synced table (only this one)

| Local source | Cloud table | Contents |
|---|---|---|
| `CustomerFeedbackRecord[]` (`szm_customer_feedback`) | `cloud_sync_customer_feedback` | `trigger`, `score`, free-text `comment`, and the consent flags `testimonialInterest` / `caseStudyInterest` / `contactLaterOk` |

Upsert keyed on `(user_id, local_id)` — idempotent. The local record has **no name /
email / phone field**; the only free-text surface is `comment`.

## What this phase may sync

- Customer feedback records (the user's own words)
- Testimonial-interest flags
- Case-study-interest flags
- Explicit consent metadata

## What this phase must NOT sync

Partner interest, growth analytics, Foundation Builder progress, vendor/tool tracker,
launch readiness progress, unrelated free text, private customer data, and secrets /
credentials / passwords / API keys. The helper references **only** `cloud_sync_customer_feedback`.

## Privacy gate

`getFeedbackEligibility(record)` decides whether a record may be backed up:

- **Consent metadata preserved** — the testimonial / case-study / contact-later flags are
  copied into the payload verbatim, never stripped and never transformed into a public
  testimonial.
- A record is **skipped (kept local-only)** when it is **malformed**, **missing its consent
  metadata**, or its `comment` **appears to contain obvious secrets / sensitive identifiers**
  (`password`, `api key`, `secret`, `token`, `private key`, `credit card`, `SSN` / `social
  security`, `bank account`, or SSN-/card-like digit runs).
- A blank/absent comment is fine — the record may still sync if its metadata is well-formed.
- This is a **conservative skip heuristic, not a full DLP system** (documented as such).

## Skipped-record behavior

`syncCustomerFeedbackToAccount()` returns a `CustomerFeedbackSyncResult` with `written`,
`skipped`, and `total` counts. Skipped records stay local-only. When records are skipped,
the result makes that explicit — we never imply "all feedback synced". If **no** record is
eligible, the status stays `saved_on_device` (nothing is written).

## No publishing / no reviews / no incentives

This is a **private, account-scoped backup of the user's own feedback.** It does NOT
publish testimonials, post reviews, route positive feedback to public pages, or create any
incentive — consistent with `customer-proof-review-engine.md`.

## Local-first fallback preserved

Local save remains primary; cloud sync is an **additive backup**. If it fails, the page
works normally, the badge reads "Saved on this device" (or "Sync unavailable"), and no
local feedback is deleted or mutated. Sync attempts never block rendering or throw into UI.

## Migration 002 must be applied before live sync works

`cloud_sync_customer_feedback` is defined in
`supabase/migrations/002_cloud_sync_progress_records.sql` with owner-only RLS (no public
read, no anon). Until a reviewer **applies** it, a write returns a missing-table error,
mapped to **`sync_unavailable`** — local data stays intact.

## Expected failure / status states

| Condition | Status shown |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| Signed in, nothing eligible to back up | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write of ≥1 eligible record | `synced_to_account` (+ last-synced time) |

No sign-in UI is added in this phase. No broad "all your data is synced" claim is made —
copy is specific to feedback backup status.

## Account-2G — next (highest privacy care)

Wire **Partner Interest sync** (`cloud_sync_partner_interest`). That entity holds **PII**
(name / company / email / website) plus free text, so it needs the **strictest** privacy
review and an explicit consent gate before any write is wired. Growth analytics (non-PII /
aggregate) and Foundation Builder remain deferred.
