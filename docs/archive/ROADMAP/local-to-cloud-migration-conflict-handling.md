# Local-to-Cloud Migration + Conflict Handling (Account-2J)

**Status:** Built — shared, pure conflict/migration helpers for the wired sync flows
(Account-2D..2I). Part of **Account-2 — Cloud Sync Activation Layer**
(`account-cloud-sync-activation-layer.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

## Core rules

- **Local-first.** Local storage stays the source of truth. Reconciliation **never writes,
  deletes, or overwrites** local data on its own — it returns a recommendation (`merged` +
  `hydrateRecommended` + counts) for a caller to apply **explicitly**.
- **Newest-wins by id** using `updatedAt ?? createdAt` (ISO string compare). On a **tie**,
  or when only the local copy exists, **local wins** (never clobber newer local with older
  cloud).
- **Additive, idempotent writes.** The cloud write path is unchanged — upsert on
  `(user_id, local_id)`, so re-syncing replaces a row rather than duplicating.
- **No reintroduction of skipped records.** Privacy-gated/skipped records were never written
  to the cloud, so a read-side reconcile cannot bring them back. No skipped/PII record is
  ever synced.

## Shared helper

`src/lib/syncConflict.ts` (pure, no I/O):

- `getRecordTimestamp(rec)` → `updatedAt ?? createdAt ?? null`.
- `compareTimestamps(localTs, cloudTs)` → `local_newer | cloud_newer | equal | …`.
- `reconcileByIdNewestWins(local, cloud)` → `ReconcileResult { merged, hydrateRecommended,
  localNewerCount, cloudNewerCount, cloudOnlyCount, localOnlyCount, equalCount }`.

Each wired flow exposes a `reconcile<Flow>FromAccount(local)` that loads the account copy
via its existing `load*FromAccount()` reader and returns a `ReconcileResult` — **a
recommendation only**, never an automatic local overwrite.

## Per-flow conflict rules (Account-2D–2I)

| Flow | Helper fn | Records reconciled | Timestamp | Notes |
|---|---|---|---|---|
| Assessment / MetrixScore™ (2D) | `reconcileAssessmentHistoryFromAccount` | profiles + score snapshots | `createdAt` | Immutable snapshots; cloud-only → hydrate |
| Roadmap + KPI (2E) | `reconcileRoadmapKpiFromAccount` | roadmap progress row + KPI entries | `updatedAt`/`createdAt` | Roadmap = single idempotent row (last-write-wins via upsert); KPI per id |
| Customer feedback (2F) | `reconcileCustomerFeedbackFromAccount` | feedback records | `createdAt` | Only consented/eligible records exist in cloud |
| Partner interest (2G) | `reconcilePartnerInterestFromAccount` | partner records | `createdAt` | Only `consentToContact` records exist in cloud |
| Growth analytics (2H) | `reconcileGrowthAnalyticsFromAccount` | activation events | `createdAt` | Whitelisted, non-PII events only |
| Foundation Builder (2I) | `reconcileFoundationBuilderFromAccount` | foundation (+ vendor/launch) items | `updatedAt`/`createdAt` | Items are mutable → updatedAt drives newest-wins |

## What this phase does NOT do

- No migrations, no schema change, no new dependency, no UI change.
- No automatic local overwrite/hydrate (callers apply `merged` explicitly when safe).
- No payment/Stripe/report gating/DEV_UNLOCK/scoring/env changes.
- No syncing of skipped/privacy-gated records.

## Account-2K — next

Wire **Data Export / Delete / Privacy Controls** — export-my-data across owned rows and
delete-my-account-data (cascading on `account_user_id`), with honest UI.
