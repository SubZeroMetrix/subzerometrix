# Foundation Builder Sync Readiness (Account-2I)

**Status:** Sync **readiness** only. The Product-5 Guided Business Foundation Builder
feature is **not built yet**, so there is no live local data source today — this helper
backs up nothing and claims nothing until Product-5 exists. It is the **cloud-ready,
local-first** plumbing so the Foundation Builder is sync-ready from day one. Part of
**Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).
Pairs with `guided-business-foundation-builder.md` (Product-5).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write. With no local Foundation Builder data today, the helper returns
> `saved_on_device` and writes nothing.

## What Account-2I built

- **`src/lib/foundationBuilderSync.ts`** — cloud-ready sync writer/reader scoped to THREE
  Foundation Builder tables. Exports `FoundationBuilderSyncStatus`,
  `FoundationBuilderSyncResult`, `FoundationBuilderSyncReadiness`,
  `FoundationItemEligibility`, the forward-looking item shapes (`FoundationChecklistItem`,
  `VendorToolItem`, `LaunchReadinessItem`), `FOUNDATION_BUILDER_KEYS`,
  `getFoundationItemEligibility()`, `getFoundationBuilderSyncReadiness()`,
  `syncFoundationBuilderToAccount()`, `loadFoundationBuilderFromAccount()`,
  `getFoundationBuilderSyncErrorMessage()`.
- **No UI is wired** — the Foundation Builder surface does not exist yet (Product-5). This
  phase is readiness/plumbing only.

## Tables (only these three)

| Future local source | Cloud table | Contents |
|---|---|---|
| `FoundationChecklistItem[]` (`szm_foundation_builder`) | `cloud_sync_foundation_builder_progress` | category, stepName, status, completed, free-text note |
| `VendorToolItem[]` (`szm_vendor_tracker`) | `cloud_sync_vendor_tool_tracker` | label, category, reference URL (**never credentials**), note |
| `LaunchReadinessItem[]` (`szm_launch_readiness`) | `cloud_sync_launch_readiness_progress` | label, status, completed, note |

Upsert keyed on `(user_id, local_id)` — idempotent. The future local-storage keys are
defined in `FOUNDATION_BUILDER_KEYS`; today the readers return `[]`.

## Privacy model

- These are the user's **own setup notes** — low-risk, no PII expected. Notes are free
  text, so an item is **skipped (kept local-only)** if its note or reference URL looks like
  a secret/credential (password, API key, secret, token, private key, credit card, SSN /
  social security, bank account, SSN-/card-like digits, or an oversized string).
- **Vendor references store a URL/label only — never credentials, passwords, or API keys.**
- Conservative heuristic, **not** a full DLP system.

## Not synced

Partner interest, customer feedback, growth analytics, assessment/score, roadmap, and KPI
data are **not** touched by this helper. It references only the three Foundation Builder
tables above.

## Local-first / cloud-ready

When Product-5 adds the local Foundation Builder data model (populating
`FOUNDATION_BUILDER_KEYS`), this helper syncs eligible items with **no further wiring** —
local-first, confirmed-write-only, additive backup. `getFoundationBuilderSyncReadiness()`
reports `localModelExists` so the future UI can show a `SyncStatusBadge`
(`entityType="foundation_builder_progress"`) honestly. Until then, nothing is written.

## Migration 002 must be applied before live sync works

`cloud_sync_foundation_builder_progress`, `cloud_sync_vendor_tool_tracker`, and
`cloud_sync_launch_readiness_progress` are defined in
`supabase/migrations/002_cloud_sync_progress_records.sql` with owner-only RLS (no public
read, no anon). Until a reviewer **applies** it, a write returns a missing-table error,
mapped to **`sync_unavailable`** — local data stays intact.

## Expected failure / status states

| Condition | Status |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| No local Foundation Builder data yet (today) | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write of ≥1 eligible item | `synced_to_account` (+ last-synced time) |

## Next — Product-5A: Foundation Builder Data Model

With the sync plumbing ready, the next build is **Product-5A — Foundation Builder Data
Model** (`guided-business-foundation-builder.md`): create the local Foundation Builder data
model that populates `FOUNDATION_BUILDER_KEYS`. Once it exists, this helper syncs it with no
further wiring. (Account-2J — Local-to-Cloud Migration + Conflict Handling — and Account-2K
— Data Export / Delete / Privacy Controls — remain as later Account-2 hardening phases.)
