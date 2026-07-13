# Growth Analytics Privacy-Safe Sync (Account-2H)

**Status:** Fifth active cloud-sync flow. Backs up a user's own device-local activation
events to their own account as **privacy-safe, aggregate, non-PII** fields only. Part of
**Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).
Pairs with `acquisition-activation-analytics-foundation.md` (Growth-6).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write of at least one eligible event. Signed out → "Sign in to back up
> progress"; missing table/migration or a write failure → "Sync unavailable." Local data
> is always left intact.

## What Account-2H built

- **`src/lib/growthAnalyticsSync.ts`** — privacy-safe sync writer/reader scoped to ONE
  table. Exports `GrowthAnalyticsSyncStatus`, `GrowthAnalyticsSyncResult`,
  `GrowthAnalyticsSyncReadiness`, `GrowthEventEligibility`, `getGrowthEventEligibility()`,
  `getGrowthAnalyticsSyncReadiness()`, `syncGrowthAnalyticsToAccount()`,
  `loadGrowthAnalyticsFromAccount()`, `getGrowthAnalyticsSyncErrorMessage()`.
- Wired the live status into `SyncStatusBadge` on `/dashboard`, next to the device-local
  `GrowthAnalyticsSummary`.

## Synced table (only this one)

| Local source | Cloud table | Synced (whitelisted) fields |
|---|---|---|
| `GrowthActivationRecord[]` (`szm_growth_events`) | `cloud_sync_growth_events` | `eventName`, `createdAt`, `path` (pathname), `source`, `channel`, `language`, `locale`, `milestone` |

Upsert keyed on `(user_id, local_id)` — idempotent.

## Privacy model (strict, defense-in-depth)

1. **Whitelist payload** — only the structured, non-PII fields above are synced. The
   free-form `metadata` map is **NEVER synced** (dropped entirely).
2. **Skip gate** — an event is **skipped (kept local-only)** when malformed, or when its
   `path` or any `metadata` value looks like free text or PII: an email pattern, a
   sensitive keyword (`password`, `api key`, `secret`, `token`, `private key`, `SSN` /
   `social security`, `bank account`), an SSN-/card-like digit run, or an unusually long
   string (> 64 chars, treated as free text).

This is a conservative heuristic plus a hard whitelist — **not** a full DLP system.

## Not synced / never done

- **No** names, emails, phones, company, notes, feedback, partner interest, Foundation
  Builder, vendor tracker, or launch readiness data.
- **No** third-party analytics, cookies, pixels, or retargeting. This is a private
  account backup of the user's own aggregate activity — nothing is sent to any third party.
- The helper references **only** `cloud_sync_growth_events`.

## Skipped-event behavior

`syncGrowthAnalyticsToAccount()` returns `written` / `skipped` / `total` counts. Skipped
events stay local-only. The result makes skips explicit — never implies "all activity
synced". If no event is eligible, status stays `saved_on_device` (nothing is written).

## Local-first fallback preserved

Local save remains primary; cloud sync is an **additive backup**. If it fails, the
dashboard works normally, the badge reads "Saved on this device" (or "Sync unavailable"),
and no local data is deleted or mutated. Sync attempts never block rendering or throw.

## Migration 002 must be applied before live sync works

`cloud_sync_growth_events` is defined in
`supabase/migrations/002_cloud_sync_progress_records.sql` with owner-only RLS (no public
read, no anon). Until a reviewer **applies** it, a write returns a missing-table error,
mapped to **`sync_unavailable`** — local data stays intact.

## Expected failure / status states

| Condition | Status shown |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| Signed in, nothing eligible | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write of ≥1 eligible event | `synced_to_account` (+ last-synced time) |

No sign-in UI is added in this phase. No broad "all your data is synced" claim is made.

## Account-2I — next

Wire **Foundation Builder Sync Readiness** (`cloud_sync_foundation_builder_progress` and
the vendor/launch tables) once the Guided Business Foundation Builder (Product-5) data
model exists — designed cloud-ready from day one. Vendor tracker and launch readiness are
part of that set and remain deferred until Product-5.
