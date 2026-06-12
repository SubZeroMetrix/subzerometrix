# Sync Status UI Component (Account-2C)

**Status:** Presentational / readiness only. **No cloud sync wired. No Supabase writes.**
Part of **Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).
Pairs with `src/lib/syncContracts.ts` and `cloud-sync-architecture-map.md`.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** the badge renders the status it is **passed**. "Synced to your account"
> renders **only** when a caller explicitly passes `status="synced_to_account"` — which only
> happens after a real, confirmed cloud write. Today every surface passes
> `status="saved_on_device"`.

## What Account-2C built

- **`src/components/SyncStatusBadge.tsx`** — a reusable, presentational storage-status chip.
  No network calls, no localStorage, no Supabase writes; never infers "synced". Default
  status is `saved_on_device`.
- **`src/lib/syncContracts.ts`** — three pure presentational helpers (no side effects):
  `getSyncStatusDescription()`, `getSyncStatusActionLabel()`, `getSyncStatusTone()`, plus the
  `SyncStatusTone` type.

## SyncStatusBadge props

- `status?: SyncStatus` — **defaults to `saved_on_device`**.
- `entityType?: SyncEntityType` — optional flow this badge describes.
- `lastSavedAt?: string | null` — optional ISO local-save time.
- `lastSyncedAt?: string | null` — optional ISO confirmed-sync time (only shown when
  `status === 'synced_to_account'`).
- `compact?: boolean` — single-line pill vs. full card with description.
- `className?: string`.

## Status labels

| `SyncStatus` | Label | Tone | When it should be passed |
|---|---|---|---|
| `saved_on_device` | **Saved on this device** | neutral | Default — local only (today) |
| `synced_to_account` | **Synced to your account** | positive | ONLY after a confirmed cloud write |
| `sync_unavailable` | **Sync unavailable** | warning | A flow clearly cannot sync |
| `sign_in_to_back_up` | **Sign in to back up progress** | prompt | Signed-out with local data (no sign-in flow wired here) |

## Where the component appears

All current placements pass `status="saved_on_device"` — honest device-local truth:

- **`/dashboard`** — after the device-local activity summary, near the trackers
  (`entityType="metrix_score_history"`).
- **`/report`** — under the roadmap checklist progress bar
  (`entityType="roadmap_action_progress"`, compact).
- **`/results`** — in the "saved on this device" snapshot note
  (`entityType="assessment_history"`, compact).

No sign-in flow and no account UI are added in this phase.

## Why the default is device-local

Until a flow has a real, confirmed Supabase write (Account-2D onward), the only honest
status is "Saved on this device." Defaulting there — and requiring an explicit
`status="synced_to_account"` — makes it structurally impossible for the badge to overclaim.

## No active sync wired yet

The badge is purely presentational. No `metrixCloudSync`/`cloud_sync_*` writer is invoked,
no Supabase call is made, and `syncContracts` `cloudWriteWired` is still false for every
entity. This phase only tells users **where their progress is saved**.

## How Account-2D will use it

When Account-2D wires the first real flow (assessment / MetrixScore™ history, lowest
privacy risk), it will:

1. Apply migration `002` and verify RLS.
2. Perform a confirmed write to `cloud_sync_assessment_history` / `cloud_sync_score_history`.
3. **Only after the write returns success**, pass `status="synced_to_account"` with a real
   `lastSyncedAt`. On failure/offline, pass `sync_unavailable`; signed-out with local data,
   pass `sign_in_to_back_up`.

## UX rule

**Never leave users guessing where their progress is saved.** Every major progress / tracker
/ checklist surface should show a `SyncStatusBadge` so storage is always explicit and honest.

## Product-5 dependency

The Guided Business Foundation Builder (Product-5) must use `SyncStatusBadge` **from day
one** for its checklist/tracker surfaces — so foundation progress never silently lives in
one browser without the user knowing, consistent with the Quality-1 Cloud Sync Standard.
