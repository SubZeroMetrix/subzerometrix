# Account Sync Schema Plan — SubZeroMetrix™ Retention (Mega-Phase 3)

**Status:** Cloud-ready foundation only. **No auth, no Supabase writes, no cloud sync is active today.**

This document is the plan for moving the local/device retention loop (Mega-Phase 2)
to account-based, cross-device persistence. It pairs with the prepared code in
`src/lib/metrixCloudSchema.ts` (schema + local→cloud mappers) and
`src/lib/metrixAccountSync.ts` (safe preparation wrappers that no-op without auth).

> Until real auth + Row Level Security exist, the product remains honest: every
> user's MetrixProfile™, MetrixScore™ history, action progress, reassessments, and
> KPIs are **saved on this device only**. Copy says "Cloud account sync is coming
> later" — never that sync works.

---

## 1. Current state (audited)

- **No Supabase client helper module** (`src/lib/supabase.ts` does not exist).
- **No auth** — no sign-in, session, `getUser`, magic link, or `@supabase/ssr`.
- Supabase is used today only as **anonymous logging**:
  - assessment page inserts a row into `assessments` (anon key, client-side),
  - the Stripe webhook updates `assessments` payment status and inserts `purchases`.
- There is **no per-user data model and no RLS-protected user tables**.
- Report access is **payment-gated, not account-gated** — unchanged by this plan.

## 2. Proposed tables (future)

Names mirror `METRIX_CLOUD_TABLES` in `metrixCloudSchema.ts`.

| Table | Purpose | Key local source |
|---|---|---|
| `metrix_profiles` | Latest saved MetrixProfile™ per user | `MetrixProfileSnapshot` |
| `metrix_score_snapshots` | MetrixScore™ history over time | `MetrixScoreSnapshot` |
| `metrix_action_progress` | Completed action ids / counts | `ActionProgressSnapshot` |
| `metrix_reassessment_events` | Reassessment events + deltas | `ReassessmentEvent` |
| `metrix_kpi_snapshots` | Manual KPI entries over time | `ManualKpiSnapshot` |
| `metrix_reminder_preferences` | In-app reminder settings | `ReminderPreference` |

### Common columns (every table)
- `id` (uuid, pk, server-generated)
- `account_user_id` (uuid, fk → `auth.users.id`) — RLS owner
- `client_id` (text) — the originating local id; **unique per (account_user_id, client_id)** for idempotent upserts
- `storage_status` (text: `local_only` | `cloud_ready` | `synced` | `sync_error`)
- `created_at` (timestamptz) — original local createdAt
- `updated_at` (timestamptz)
- `synced_at` (timestamptz, nullable)

### Table-specific fields
- **metrix_profiles:** trade, region, business_stage, years_in_business, revenue_range, team_size, main_goal, biggest_challenge, confidence, profile_completion.
- **metrix_score_snapshots:** source, overall, categories (jsonb `[{category,score}]`), risk_level, risk_label, profile_completion, trade, region, business_stage, main_goal, biggest_challenge, assessed_at.
- **metrix_action_progress:** completed_action_ids (text[]), completed_count, total_actions, source, recorded_at.
- **metrix_reassessment_events:** reason, previous_score_snapshot_id, new_score_snapshot_id, score_delta, note, occurred_at.
- **metrix_kpi_snapshots:** period_label, values (jsonb `{kpiKey:number}`), note, recorded_at.
- **metrix_reminder_preferences:** type, enabled, cadence, priority.

## 3. RLS considerations

- **Enable RLS on every table.** No anon read/write of user retention data.
- Policies: `account_user_id = auth.uid()` for `select`, `insert`, `update`, `delete`.
- `account_user_id` must be set server-side / from the session — never trusted from the client body.
- Idempotency via a **unique index on `(account_user_id, client_id)`** so re-syncing a local snapshot upserts rather than duplicates.
- Keep the existing **anonymous** `assessments`/`purchases` tables separate from these user-owned tables (different trust model). Do not retrofit RLS onto the payment-logging tables in this effort.

## 4. Sync flow (future)

1. User signs in → a real session yields an `AccountUser { id, email }`.
2. `getCurrentAccountUser()` returns that user (today: always `null`).
3. On retention changes, call `prepare*ForSync()` / `prepareHistoryForSync()` to shape local models into account payloads (`storage_status: 'cloud_ready'`).
4. A thin sync writer (future, not built) upserts payloads keyed on `(account_user_id, client_id)`, then marks rows `synced` with `synced_at`.
5. On load, pull the user's rows and rebuild a `MetrixHistoryState` to seed the local cache.

## 5. Local → cloud migration strategy

- First sign-in performs a **one-time local adoption**: read `szm_metrix_history` + `szm_metrix_profile`, run `prepareHistoryForSync()`, upsert.
- `client_id` = the existing local snapshot/event id, so adoption is idempotent and safe to retry.
- After a successful adoption, local storage becomes a **cache** of the account, not the source of truth. Until then it stays authoritative (local_only).
- Never destroy local data on sync failure; surface `sync_error` and retry.

## 6. Account recovery assumptions

- Identity is the **email** captured at assessment lead-capture (already collected).
- Recovery is **email-based** (magic link / one-time code) — no passwords in v1.
- Losing device access must not lose history once synced — that is the core value of accounts.

## 7. Future auth flow (email / magic-link)

1. User enters email → request a magic link / OTP.
2. Verify → establish a session (Supabase Auth or equivalent).
3. Link the session `user.id` to retention rows via `account_user_id`.
4. No social login required for v1; keep friction low for tradespeople.

## 8. Risk list (before implementation)

- **RLS mistakes** could expose one contractor's data to another — must be tested before any write goes live.
- **Anon-key misuse:** retention tables must never be writable with the anon key the way `assessments` is today.
- **Idempotency:** without the `(account_user_id, client_id)` unique index, reassessment re-syncs would duplicate history.
- **Do not couple to payments:** report gating is payment-based; account sync must not change who can see the paid report.
- **Honest copy:** never show "synced" or "saved to your account" until a write is confirmed; default to "saved on this device."
- **Dependency:** a real auth flow likely needs an auth library/provider. Adding dependencies is **out of scope for this phase** and must be proposed separately.

## 9. Paid-access / entitlement considerations

- Report access today is **payment-gated** (Stripe checkout → `/report?session_id=...` → verify-session), **not** account-gated. Account sync must **not** change who can view the paid report.
- **Identity (account) and entitlement (paid) are separate concerns.** An account can exist with no purchase; a purchase exists today with no account. Keep them decoupled.
- Future enhancement (not now): link a `purchase` to an `account_user_id` so a returning signed-in buyer can regain paid access on a new device. This layers **on top of** the existing payment gate — it must never lock out a paying user or silently unlock the report for a non-buyer.
- Membership tier (`membershipTiers.ts`) should govern **how much** profile depth/history is retained and shown (e.g., lifetime score history), **never** the scoring engine. Tier gating of retention depth is a future read-time entitlement check with honest "upgrade for full history" framing — and **no silent data loss** of what the user already recorded locally.
- Entitlement checks must be **server-validated** (as checkout/verify-session already are). Never reconcile paid access from `localStorage` or client state.

## 10. Exact next build recommendation

A dedicated phase (not bundled with retention-model work), in order:

1. **`src/lib/supabaseClient.ts`** — one lazy, env-guarded client (mirroring the existing lazy pattern in `checkout`/`webhook`), returning `null` when env vars are absent. No change to today's anonymous logging.
2. **Email magic-link auth** — request-link + verify endpoints, establish a session, and expose a real `getCurrentAccountUser()` to replace the `null` stub in `metrixAccountSync.ts`. **This likely requires an auth dependency — stop and get explicit approval before adding it.**
3. **Create the six `metrix_*` tables with RLS** (per §2/§3) via a reviewed migration; add the `(account_user_id, client_id)` unique indexes for idempotent upserts.
4. **One-time local adoption on first sign-in** — read local history, run `prepareHistoryForSync()`, upsert, then mark rows `synced`. Keep local data as a cache; never destroy on failure.
5. **Honest status UI** — surface "Synced to your account" only after a confirmed write; until then keep "Saved on this device."

Do not combine this with any checkout / pricing / report-gating / scoring / roadmap change.

## 11. Mega-Phase 3B — implemented (account identity)

**Shipped (helpers only, no UI, no cloud writes):**
- `src/lib/supabaseClient.ts` — lazy, env-guarded **browser** Supabase client using the **public anon key only** (never the service-role key). Returns `null` on the server and when env vars are missing; never throws at load. Uses the **already-installed** `@supabase/supabase-js` — **no new dependency**.
- `src/lib/accountAuth.ts` — real magic-link auth helpers: `getCurrentAccountUser()`, `getCurrentAccountSession()`, `isAccountSignedIn()`, `getAccountAuthStatus()`, `requestMagicLink()`, `signOutAccount()`, plus sync cache accessors `getCachedAccountUser()` / `getCachedAuthStatus()`. Honest statuses: `unavailable` | `signed_out` | `signed_in` | `error`. Never fakes signed-in state; SSR/build safe.
- `src/lib/metrixAccountSync.ts` — `getCurrentAccountUser()` now reads accountAuth's cache; `canUseAccountSync()` is true only for a real account user; `getAccountSyncStatus()` returns `unavailable` | `local_only` | `account_available` | `error`. `prepare*ForSync()` still return `null` unless a real account user exists.

**Dependency approval needed?** No — `@supabase/supabase-js@^2.44.4` was already a dependency.

**What remains before actual cloud writes:**
1. A small, honest **sign-in UI** (email → magic link → session), calling the async accountAuth checks on mount to populate the cache.
2. The six `metrix_*` **tables + RLS** and `(account_user_id, client_id)` unique indexes (per §2/§3).
3. A **sync writer** that upserts `prepareHistoryForSync()` payloads and flips `storage_status` to `synced` after a confirmed write.
4. **One-time local adoption** on first sign-in (§5).

**Exact next phase:** *Cloud-saved MetrixProfile™ + MetrixScore™ history* — wire the sign-in UI + first-sign-in adoption + RLS-protected upserts, surfacing "Synced to your account" only after a confirmed write. Keep checkout / report gating / pricing / scoring / roadmap unchanged.

---

### Out of scope for Mega-Phase 3 (explicitly NOT done)
Auth, Supabase client/writes, RLS migrations, sign-in UI, real cross-device sync,
any change to checkout / webhook / verify-session / report gating / pricing /
scoring / roadmap. This phase shipped **types, mappers, safe no-op wrappers, and
this plan** only.
