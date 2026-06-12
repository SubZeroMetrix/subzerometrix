# Assessment / MetrixScore™ History Sync (Account-2D)

**Status:** First active cloud-sync flow — **narrow, low-risk, and honest.** Syncs ONLY
assessment (MetrixProfile™) history and MetrixScore™ history. No other surface is wired.
Part of **Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** "Synced to your account" is shown ONLY after a confirmed successful
> Supabase write. If signed out → "Sign in to back up progress"; if the table/migration is
> missing or a write fails → "Sync unavailable." Local storage is always left intact.

## What Account-2D built

- **`src/lib/assessmentHistorySync.ts`** — the first real sync writer/reader, scoped to two
  tables only. Exports `AssessmentSyncStatus`, `AssessmentSyncResult`,
  `AssessmentSyncReadiness`, `getAssessmentSyncReadiness()`,
  `syncAssessmentHistoryToAccount()`, `loadAssessmentHistoryFromAccount()`,
  `getAssessmentSyncErrorMessage()`.
- Wired the live status into `SyncStatusBadge` on `/results` and `/dashboard`.

## Synced tables (only these two)

| Local source | Cloud table | Contents |
|---|---|---|
| `MetrixProfileSnapshot[]` (`szm_metrix_*`) | `cloud_sync_assessment_history` | Business-readiness selections (trade, region, stage, years, revenue band, team size, goal, challenge, confidence, completion) |
| `MetrixScoreSnapshot[]` | `cloud_sync_score_history` | MetrixScore™ overall + per-category scores, risk level/label, profile context |

Upsert is keyed on `(user_id, local_id)` — idempotent; a re-sync replaces, never
duplicates. Payloads are structured `jsonb` only.

## No PII / no free-text sync

These two entities hold **structured business-readiness data only** — no names, emails,
phone numbers, or free-text form content. The free-text / PII surfaces (customer feedback,
partner interest) and analytics are **explicitly NOT synced** in this phase.

## Local-first fallback preserved

Local save remains primary. Cloud sync is an **additive backup**: if it fails, the page
works normally, the badge reads "Saved on this device" (or "Sync unavailable"), and no
local data is deleted or mutated. Sync attempts never block rendering and never throw into
the UI.

## Migration 002 must be applied before live sync works

`supabase/migrations/002_cloud_sync_progress_records.sql` defines `cloud_sync_assessment_history`
and `cloud_sync_score_history` with owner-only RLS. Until a reviewer **applies** it to the
Supabase project, a write returns a missing-table error, which the helper maps to
**`sync_unavailable`** — local data stays intact and the UI stays honest.

## Expected failure / status states

| Condition | Status shown |
|---|---|
| Supabase not configured | `saved_on_device` |
| Signed out (Supabase available) | `sign_in_to_back_up` |
| Signed in, nothing to back up yet | `saved_on_device` |
| Signed in, table/migration missing or write failed | `sync_unavailable` |
| Signed in, confirmed write succeeded | `synced_to_account` (+ last-synced time) |

No sign-in UI is added in this phase, so in practice users currently see `saved_on_device`
or `sign_in_to_back_up`. No broad "all your data is synced" claim is made anywhere — copy
is specific to "Assessment history" / "MetrixScore™ history".

## Account-2E — next

Wire **Roadmap Action + KPI sync** (`cloud_sync_roadmap_action_progress`,
`cloud_sync_kpi_entries`) using the same local-first, confirmed-write-only pattern. Still
no PII/free-text sync; feedback/partner/growth remain deferred to later phases.
