# Partner Interest Sync — Consent-Gated (Account-2G)

**Status:** Fourth active cloud-sync flow, and the **highest-PII surface.** Syncs ONLY a
user's own partner-interest records to their own account, behind a strict **consent gate**.
Part of **Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).
Pairs with `partner-vendor-association-distribution-system.md` (Growth-5).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write of at least one eligible record. Signed out → "Sign in to back up
> progress"; missing table/migration or a write failure → "Sync unavailable." Local data
> is always left intact.

## What Account-2G built

- **`src/lib/partnerInterestSync.ts`** — consent-gated sync writer/reader scoped to ONE
  table. Exports `PartnerInterestSyncStatus`, `PartnerInterestSyncResult`,
  `PartnerInterestSyncReadiness`, `PartnerEligibility`, `getPartnerEligibility()`,
  `getPartnerInterestSyncReadiness()`, `syncPartnerInterestToAccount()`,
  `loadPartnerInterestFromAccount()`, `getPartnerInterestSyncErrorMessage()`.
- Wired the live status into `SyncStatusBadge` in `PartnerInterestForm` (the saved-state
  confirmation on `/partners`).

## Synced table (only this one)

| Local source | Cloud table | Contents |
|---|---|---|
| `PartnerInterestSubmission[]` (`szm_partner_interest`) | `cloud_sync_partner_interest` | `name`, `company`, `channelType`, `website`, `email`, free-text `collaborationNote`, `consentToContact`, `status` |

Upsert keyed on `(user_id, local_id)` — idempotent. **This is the highest-PII surface**
(name / company / email / website + free text), hence the strict consent gate below.

## Consent + privacy gate

`getPartnerEligibility(record)` decides whether a record may be backed up:

- **Strict consent gate** — a record is eligible **only when `consentToContact === true`**.
  Without explicit contact permission it is **skipped and kept local-only**.
- A record is also **skipped** when malformed, or when its free-text `collaborationNote`
  appears to contain obvious secrets/credentials (`password`, `api key`, `secret`, `token`,
  `private key`, `credit card`, `SSN` / `social security`, `bank account`, or SSN-/card-like
  digit runs).
- All fields (incl. consent) are preserved verbatim in the payload — a **private,
  account-scoped backup only**. No outreach, no CRM push, no public listing.
- Conservative skip heuristic, **not a full DLP system** (documented as such).

## Skipped-record behavior

`syncPartnerInterestToAccount()` returns a result with `written`, `skipped`, and `total`
counts. Skipped (non-consented or sensitive) records stay local-only. The result makes
skips explicit — we never imply "all partner interest synced". If **no** record is
eligible, status stays `saved_on_device` (nothing is written).

## Not synced in this phase

Growth analytics, Foundation Builder progress, vendor/tool tracker, and launch readiness
remain **deferred**. The helper references **only** `cloud_sync_partner_interest`.

## Local-first fallback preserved

Local save remains primary; cloud sync is an **additive backup**. If it fails, the form
works normally, the badge reads "Saved on this device" (or "Sync unavailable"), and no
local data is deleted or mutated. Sync attempts never block rendering or throw into UI.

## Migration 002 must be applied before live sync works

`cloud_sync_partner_interest` is defined in
`supabase/migrations/002_cloud_sync_progress_records.sql` with owner-only RLS (no public
read, no anon). Until a reviewer **applies** it, a write returns a missing-table error,
mapped to **`sync_unavailable`** — local data stays intact.

## Expected failure / status states

| Condition | Status shown |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| Signed in, nothing consented/eligible | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write of ≥1 eligible record | `synced_to_account` (+ last-synced time) |

No sign-in UI is added in this phase. No broad "all your data is synced" claim is made.

## Account-2H — next

Wire **Growth Analytics Privacy-Safe Sync** (`cloud_sync_growth_events`). That entity is
**non-PII by design** and must stay aggregate-only — a privacy / non-invasive review is
required before any write, and it must never become third-party-style tracking. Foundation
Builder, vendor tracker, and launch readiness remain deferred.
