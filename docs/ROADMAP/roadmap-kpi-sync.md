# Roadmap Action + KPI Sync (Account-2E)

**Status:** Second active cloud-sync flow — **narrow, low-risk, and honest.** Syncs ONLY
roadmap action progress and manual KPI entries. No other surface is wired. Follows the same
local-first, confirmed-write-only pattern as Account-2D
(`assessment-score-history-sync.md`). Part of **Account-2 — Cloud Sync Activation Layer**
(`account-cloud-sync-activation-layer.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write. Signed out → "Sign in to back up progress"; missing table/migration or a
> write failure → "Sync unavailable." Local storage is always left intact.

## What Account-2E built

- **`src/lib/roadmapKpiSync.ts`** — sync writer/reader scoped to two tables only. Exports
  `RoadmapKpiSyncStatus`, `RoadmapKpiSyncResult`, `RoadmapKpiSyncReadiness`,
  `getRoadmapKpiSyncReadiness()`, `syncRoadmapKpiProgressToAccount()`,
  `loadRoadmapKpiProgressFromAccount()`, `getRoadmapKpiSyncErrorMessage()`.
- Wired the live status into `SyncStatusBadge` on `/dashboard` (roadmap + KPI) and
  `/report` (roadmap action progress).

## Synced tables (only these two)

| Local source | Cloud table | Contents |
|---|---|---|
| `szm_path_complete` (completed action ids) | `cloud_sync_roadmap_action_progress` | `completedActionIds` (opaque ids), `completedCount`, `updatedAt`, `source: 'roadmap_progress'` |
| `ManualKpiSnapshot[]` (`szm_metrix_history`) | `cloud_sync_kpi_entries` | The user's own numbers (`values` by fixed KPI key), `periodLabel`, optional `note` |

Roadmap progress upserts as a single row (stable `local_id = 'roadmap_progress_current'`);
KPI entries upsert per-snapshot on `local_id`. Both keyed on `(user_id, local_id)` —
idempotent; a re-sync replaces, never duplicates.

## No feedback / partner / growth / Foundation Builder sync

Customer feedback, partner interest, growth analytics, and Foundation Builder data are
**explicitly NOT synced** in this phase. The helper references only the two tables above.

## No PII; KPI note caution

Neither entity carries PII — roadmap ids are opaque, and KPI `values` are the contractor's
own numbers (revenue, leads, close rate, etc.) keyed by a fixed enum. The KPI **`note` is
free text** but is the user's own private, device-local note; it is low-risk by design and
users are guided not to place customer or private information there. No names, emails,
phones, secrets, credentials, or API keys are ever synced.

## Local-first fallback preserved

Local save remains primary; cloud sync is an **additive backup**. If it fails, the page
works normally, the badge reads "Saved on this device" (or "Sync unavailable"), and no
local data is deleted or mutated. Sync attempts never block rendering and never throw into
the UI.

## Migration 002 must be applied before live sync works

`cloud_sync_roadmap_action_progress` and `cloud_sync_kpi_entries` are defined in
`supabase/migrations/002_cloud_sync_progress_records.sql` with owner-only RLS. Until a
reviewer **applies** it, a write returns a missing-table error, which the helper maps to
**`sync_unavailable`** — local data stays intact.

## Expected failure / status states

| Condition | Status shown |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| Signed in, nothing to back up yet | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write succeeded | `synced_to_account` (+ last-synced time) |

No sign-in UI is added in this phase, so users currently see `saved_on_device` or
`sign_in_to_back_up`. No broad "all your data is synced" claim is made — copy is specific to
"Roadmap action progress" / "KPI entries".

## Account-2F — next (requires privacy review)

Wire **Feedback / Customer Proof sync** (`cloud_sync_customer_feedback`). This entity holds
a **free-text comment** and is privacy-sensitive — it requires a **privacy review and
explicit consent handling before any write is wired**. Partner interest (PII), growth
analytics (non-PII/aggregate), and Foundation Builder remain deferred to their own phases.
