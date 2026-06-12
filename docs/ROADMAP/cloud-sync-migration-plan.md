# Cloud Sync Migration Plan (Account-2A)

**Status:** Plan only. **No migration created. No schema change. No cloud sync wired.**
Pairs with `cloud-sync-architecture-map.md` and `src/lib/syncContracts.ts`. Part of
**Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> ⚠️ **Do not claim sync is live until each flow is wired AND tested AND labeled.** The
> four sync-status labels are a future standard; "Synced to your account" may only appear
> after a real confirmed write.

## Account-2B status — schema + RLS migration created (built)

`supabase/migrations/002_cloud_sync_progress_records.sql` creates the ten unified,
payload-first `cloud_sync_*` tables (one per `SyncEntityType`), each with **RLS enabled
and owner-only** policies (`auth.uid() = user_id`), an `updated_at` trigger, and a
`UNIQUE (user_id, local_id)` constraint for idempotent upserts. **Schema + RLS only — no
app flow is wired, and nothing claims "Synced to your account."** The migration is **not
auto-applied**; a reviewer applies it. The earlier Mega-Phase 3C `metrix_*` tables
(migration `001`) are left untouched; reconciling them with the `cloud_sync_*` schema is a
later wiring phase (2D onward). **Next: Account-2C — Sync Status UI.**

## Implementation order (Account-2B → Account-2K)

1. **Account-2B — Supabase Tables + RLS for Progress Records.** *(Built — migration `002`.)*
   Ten `cloud_sync_*` tables, RLS owner-only, `updated_at` trigger. No writer wired.
2. **Account-2C — Sync Status UI Component.** A small, honest status chip reading the
   four `SyncStatus` labels — defaults to "Saved on this device"; shows "Synced to your
   account" only on a confirmed `synced` result.
3. **Account-2D — Assessment / MetrixScore™ History Sync.** Wire the existing
   `metrixCloudSync` writer + sign-in + cloud→local hydrate. Lowest privacy risk first.
4. **Account-2E — Roadmap Action + KPI Sync.** Activate the existing action/KPI writers.
5. **Account-2F — Feedback / Customer Proof Sync.** New table + writer. **Privacy review
   first** (free-text `comment`).
6. **Account-2G — Partner Interest Sync.** New table + writer. **Privacy review first**
   (PII: name/company/email/website). Explicit consent gate.
7. **Account-2H — Growth Analytics Privacy-Safe Sync.** Aggregate, non-PII only. Privacy /
   non-invasive review first.
8. **Account-2I — Foundation Builder Sync Readiness.** Build the Foundation Builder data
   model cloud-ready from day one (Product-5 dependency).
9. **Account-2J — Local-to-Cloud Migration + Conflict Handling.** One-time adoption per
   flow + `updated_at` newest-wins conflict resolution.
10. **Account-2K — Data Export / Delete / Privacy Controls.** Export-my-data and
    delete-my-account-data, cascading on `account_user_id`.

## Tables created in migration `002` (Account-2B)

All ten are user-owned, RLS-protected, payload-first, with an `updated_at` trigger and a
`UNIQUE (user_id, local_id)` idempotency constraint:

1. `cloud_sync_assessment_history` — no PII, no free text (wire first, 2D).
2. `cloud_sync_score_history` — no PII, no free text (2D).
3. `cloud_sync_roadmap_action_progress` — no PII, no free text (2E).
4. `cloud_sync_kpi_entries` — free-text note, no PII (2E).
5. `cloud_sync_customer_feedback` — **free-text comment**; privacy review before wiring (2F).
6. `cloud_sync_partner_interest` — **PII + free text**; consent + privacy review before wiring (2G).
7. `cloud_sync_growth_events` — **non-PII by design**; aggregate only (2H).
8. `cloud_sync_foundation_builder_progress` — free-text notes (2I / Product-5).
9. `cloud_sync_vendor_tool_tracker` — references only, never secrets (2I).
10. `cloud_sync_launch_readiness_progress` — free-text notes (2I).

> Tables are **created** by `002` but **not wired**. Writing rows is a later phase; the
> privacy-sensitive tables (5–7) require a privacy review before any flow writes to them.

## RLS policy requirements

- **Enable RLS on every table.** Owner-only `select/insert/update/delete` where
  `auth.uid() = account_user_id`. No anon or public read/write of user progress.
- `account_user_id` always derived from the session JWT — never trusted from the client.
- Browser writes use the **anon key + session JWT only**; the service-role key stays
  server-side. **Do not weaken RLS** to make any flow easier.
- Idempotency via `UNIQUE (account_user_id, client_id)` so re-sync upserts, never
  duplicates — same contract as the existing writer.

## Local-to-cloud migration strategy

- First sign-in runs a **one-time adoption** per flow: read the local key, shape it via
  the entity contract, upsert keyed on `client_id`. The retention adoption already exists
  (`adoptLocalMetrixHistoryToAccount`); new flows get equivalent adopters.
- Adoption is **idempotent** and **never deletes or mutates local data**. After a confirmed
  sync, local storage becomes a cache; until then it stays authoritative.

## Conflict handling

- Default: last-write-wins per `client_id` via upsert (matches today's writer).
- For records editable on two devices, compare `updated_at` (**newest wins**) and surface a
  non-destructive "updated elsewhere" note rather than silently clobbering. No CRDT in v1.

## Offline fallback

- Offline: local writes succeed; status reads "Saved on this device" / "Sync unavailable."
- Back online + signed in: a sync pass upserts pending rows, then flips to "Synced to your
  account" **only** on confirmed success. No blocking spinners; **local fallback never breaks.**

## Sync-status UX

- Exactly one status per flow: **Saved on this device / Synced to your account / Sync
  unavailable / Sign in to back up progress.**
- Show last saved time; last synced time when a confirmed write exists; a sign-in prompt
  when local-only; a non-scary failure state; and a clear note that local-only progress can
  be lost if browser data is cleared.

## Privacy / data deletion / export considerations

- Free-text and PII flows (feedback, partner interest) require a **privacy review and
  explicit consent** before any sync.
- Export (2K): download-my-data across owned rows. Delete (2K): remove account data,
  cascading via `on delete cascade`.
- Analytics sync stays non-PII/aggregate; never third-party-style tracking, no ad pixels,
  no retargeting.

## Testing checklist (per flow, before calling it "synced")

- [ ] RLS verified: a second account cannot read/write another user's rows.
- [ ] Anon key alone (no session) cannot read/write protected tables.
- [ ] Idempotent upsert: re-sync replaces, never duplicates (`client_id`).
- [ ] Local data preserved on sync failure; honest `sync_unavailable` shown.
- [ ] Signed-out shows "Sign in to back up progress", never "Synced to your account."
- [ ] Confirmed write → and only then → status flips to "Synced to your account."
- [ ] Offline path: local write succeeds; no data loss; status honest.
- [ ] No payment / report-gating / scoring behavior changed.

## Rollback plan

- Sync is **additive**: disabling the writer or reverting the UI returns the product to
  device-local, with no data loss (local is never destroyed).
- A migration can be rolled back by dropping the **new** tables only; migration `001`
  tables are independent of the payment-logging tables and of report gating.
- Feature-flag each flow's writer so it can be turned off without a deploy if RLS or
  privacy issues surface.

## Do-not warnings

- **Do not claim sync is live** until a flow is wired, tested, and labeled.
- **Do not** create migrations, change Supabase schema, sync PII/free-text, weaken RLS,
  expose secrets, add dependencies, or touch payment/Stripe/checkout/webhook/
  verify-session/DEV_UNLOCK/report gating/scoring/`package.json`/`.env.local` in 2A.
