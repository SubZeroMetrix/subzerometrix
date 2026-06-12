# Account-2 — Cloud Sync Activation Layer (Roadmap)

**Status:** Roadmap / architecture alignment only. **Not built. Cloud sync is NOT live.**
No feature, schema, migration, scoring, payment, or data change comes from recording this.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## Strategic purpose

Create the account-backed sync layer so user progress — checklist completion, roadmap
actions, KPI entries, feedback, partner interest, privacy-safe analytics milestones, and
the future Guided Business Foundation Builder records — can move from **device-local
fallback** to **account-backed persistence**.

**Required principle:** device-local storage may be a fallback or a safe first step, but
no major customer-progress feature should remain local-only as its **final** destination.
A contractor who clears their browser must not lose their foundation progress.

This phase is the required infrastructure step **before** the Guided Business Foundation
Builder (Product-5) becomes a core customer feature. It builds on the existing
Mega-Phase 3 work — see [`account-sync-schema-plan.md`](account-sync-schema-plan.md) —
and **extends** it to the flows that are still local-only.

> **Honesty rule for this whole layer:** never show "Synced to your account" until a
> real write is confirmed. Until then the truth is "Saved on this device." The
> sync-status labels in this doc are a **future product standard**, not a claim that
> sync runs today.

## Account-2A artifacts (built — architecture / contracts only)

Account-2A audited the account/Supabase/local-storage foundation and produced the concrete
architecture, migration plan, and developer-facing contract. **No migration, no schema
change, no wired sync.**

- [`cloud-sync-architecture-map.md`](cloud-sync-architecture-map.md) — every local key →
  owning feature, record type, free-text/PII flags, future Supabase table, sync priority,
  privacy risk, local-fallback rule, and status label.
- [`cloud-sync-migration-plan.md`](cloud-sync-migration-plan.md) — Account-2B→2K order,
  table-creation order, RLS, migration/conflict/offline strategy, sync-status UX,
  privacy/export/delete, testing checklist, rollback plan, and the "do not claim sync live"
  warning.
- `src/lib/syncContracts.ts` — TypeScript contract: `SyncStatus`, `SyncStorageMode`,
  `SyncEntityType`, `SyncPriority`, `SyncPrivacyRisk`, `SyncEntityContract`,
  `SyncEntityMap`, and `getSyncEntityContracts()` / `getSyncStatusLabel()` /
  `getSyncStorageModeLabel()` / `getSyncEntityByType()` / `getSyncReadinessSummary()`.
  **Contract/status labels only — no network writes; `cloudWriteWired` is false for every
  entity.**

**Phase boundaries:**

- **Account-2A** — architecture / migration plan / contracts only *(built)*.
- **Account-2B** — Supabase tables + RLS *(built — `supabase/migrations/002_cloud_sync_progress_records.sql`)*.
- **Account-2C** — sync-status UI component *(built — `SyncStatusBadge.tsx`; see `sync-status-ui-component.md`)*.
- **Account-2D** — assessment / MetrixScore™ history sync *(built — `assessmentHistorySync.ts`; see `assessment-score-history-sync.md`)*. First active flow; structured non-PII data only; local-first preserved; migration `002` must be applied for live sync.
- **Account-2E** — roadmap action + KPI sync *(built — `roadmapKpiSync.ts`; see `roadmap-kpi-sync.md`)*. Structured no-PII data only (KPI note is the user's own low-risk private note); wired into `/dashboard` + `/report`; local-first preserved.
- **Account-2F** — feedback / customer proof sync *(built, privacy-gated — `customerFeedbackSync.ts`; see `customer-feedback-sync.md`)*. First free-text flow; consent metadata preserved; records with secret-like comments or missing consent metadata are skipped (kept local-only, counted); no publishing/reviews/incentives; wired into `/dashboard` + `/report`.
- **Account-2G** — partner interest sync *(built, consent-gated — `partnerInterestSync.ts`; see `partner-interest-sync.md`)*. Highest-PII surface; syncs only records with `consentToContact === true`; non-consented or secret-like-note records skipped (kept local-only, counted); private backup only — no outreach/CRM/public listing; wired into `PartnerInterestForm` (`/partners`).
- **Account-2H** — growth analytics privacy-safe sync *(built — `growthAnalyticsSync.ts`; see `growth-analytics-sync.md`)*. Whitelist payload of structured non-PII fields only (free-form `metadata` never synced) + skip gate for free-text/PII-looking events; no third-party analytics/cookies/pixels; wired into `/dashboard`.
- **Account-2I** — Foundation Builder sync readiness *(built, readiness only — `foundationBuilderSync.ts`; see `foundation-builder-sync.md`)*. Cloud-ready plumbing for the three Foundation Builder tables; no UI/feature built (that is Product-5); no live local data yet, so nothing is written/claimed; notes screened for secrets; vendor references store URLs only.
- **Account-2J** — local-to-cloud migration + conflict handling *(built — `src/lib/syncConflict.ts` + `reconcile*FromAccount` on every wired flow; see `local-to-cloud-migration-conflict-handling.md`)*. Newest-wins by id (`updatedAt ?? createdAt`); recommendation only, never overwrites local; tie/local-newer keeps local; skipped/PII records never reintroduced.
- **Account-2K** — data export / delete / privacy controls *(built — `src/lib/accountDataPrivacy.ts` + `/account/privacy`; export own rows from the ten `cloud_sync_*` tables as JSON, delete own rows via RLS with explicit confirmation, separate device-local clear; "all deleted" only when every table succeeds; auth-account deletion labeled admin-assisted (service-role not in browser))*. *(Account-2 cloud sync layer complete, 2A–2K.)*

## Account-2B artifacts (built — schema + RLS only)

`supabase/migrations/002_cloud_sync_progress_records.sql` creates ten unified,
payload-first per-user tables (one per `SyncEntityType`):
`cloud_sync_assessment_history`, `cloud_sync_score_history`,
`cloud_sync_roadmap_action_progress`, `cloud_sync_kpi_entries`,
`cloud_sync_customer_feedback`, `cloud_sync_partner_interest`,
`cloud_sync_growth_events`, `cloud_sync_foundation_builder_progress`,
`cloud_sync_vendor_tool_tracker`, `cloud_sync_launch_readiness_progress`.

- **RLS owner-only on every table:** `select/insert/update/delete` gated on
  `auth.uid() = user_id`. No public read, no anonymous access, no service-role-only policy.
- `user_id references auth.users(id) on delete cascade`; `UNIQUE (user_id, local_id)` for
  idempotent upserts; `payload jsonb` for schema flexibility; `deleted_at` for soft delete;
  an `updated_at` trigger (`cloud_sync_set_updated_at`).
- **Privacy:** `cloud_sync_partner_interest` may hold PII (name/company/email/website) +
  free text — highest risk; `cloud_sync_customer_feedback` holds a free-text comment —
  moderate; `cloud_sync_growth_events` is **non-PII by design** (no names/emails/phone/
  company/free text). All three are user-owned under strict RLS and require a privacy
  review before any flow writes to them.
- **Status:** schema + RLS only. **No app flow is wired; nothing claims "Synced to your
  account."** The migration is not auto-applied. The earlier Mega-Phase 3C `metrix_*`
  tables (`001`) are untouched.

---

## 1. Current state audit

### Already has a real (but not-yet-live) cloud-sync foundation

The Metrix retention history already has a **real writer** (`src/lib/metrixCloudSync.ts`,
Mega-Phase 3C) plus a migration (`supabase/migrations/001_metrix_account_sync.sql`) with
six RLS-protected per-user tables. It upserts through the browser anon client + the
user's session JWT, keyed on `(account_user_id, client_id)`. **It is not live today**
because (a) the migration is not applied to the Supabase project and (b) no sign-in UI
is wired — so the writer returns `migration_required` / `signed_out` and **no rows are
written**. Identity exists (`src/lib/accountAuth.ts`, magic-link, honest statuses); the
sync preparation layer exists (`src/lib/metrixAccountSync.ts`).

These flows already have cloud **plumbing** (covered by Account-2D / 2E below — activate,
don't rebuild):

| Flow | Local source | Cloud table (exists in migration 001) |
|---|---|---|
| MetrixProfile™ | `szm_metrix_profile` / `szm_metrix_history` | `metrix_profiles` |
| MetrixScore™ + assessment history | `szm_metrix_history` | `metrix_score_snapshots` |
| Roadmap action progress | `szm_metrix_history` | `metrix_action_progress` |
| Reassessment events | `szm_metrix_history` | `metrix_reassessment_events` |
| Manual KPI entries | `szm_metrix_history` | `metrix_kpi_snapshots` |
| Reminder preferences | (reminders state) | `metrix_reminder_preferences` |

### Still fully local-only — NO cloud path yet

These have **no cloud table and no writer** and are the new surface area Account-2 adds:

| Flow | Local key | Notes |
|---|---|---|
| Customer feedback / proof | `szm_customer_feedback` | Free-text + rating + consent → privacy review required (2F) |
| Partner interest records | `szm_partner_interest` | Contact-ish intent data → privacy review (2G) |
| Privacy-safe growth/activation events | `szm_growth_events` | Must stay non-PII; aggregate-only sync (2H) |
| Foundation Builder checklist progress | *(future)* | Built fresh as cloud-ready (2I / Product-5) |
| Roadmap path completion flags | `szm_path_complete` | Coarse path state; folds into action progress |
| Foundation / Growth checklist flags | `szm_foundation_complete`, `szm_growth_complete` | Report-card booleans |
| Business setup notes / references | *(future)* | Foundation Builder field (2I) |
| Saved vendor / tool tracker items | *(future)* | Foundation Builder field (2I) |
| Launch readiness progress | *(future)* | Foundation Builder category (2I) |

> Latest-score/intake convenience keys (`szm_score`, `szm_intake`, `szm_assessment_id`)
> and pure UI-dismissal keys (`szm_install_dismissed`, `szm_proof_dismissed`) are **not**
> sync targets — they are device-session conveniences, not customer progress.

## 2. Required sync destinations

Cloud sync should eventually cover:

- Assessment history
- MetrixScore™ history
- Roadmap action progress
- KPI entries
- Customer feedback / proof responses *(privacy-reviewed)*
- Partner interest records *(privacy-reviewed)*
- Privacy-safe growth / activation events *(non-PII, aggregate)*
- Guided Business Foundation checklist progress
- Business setup notes / references
- Saved vendor / tool tracker items
- Launch readiness progress
- Future export / backup metadata

## 3. Architecture plan

### Supabase table requirements

- Reuse the six existing `metrix_*` tables (migration `001`) for the retention flows —
  do **not** redefine them.
- New per-user, RLS-protected tables (future migrations, **not created in this phase**):
  `metrix_customer_feedback`, `metrix_partner_interest`,
  `metrix_growth_events` (aggregate/non-PII), and the Foundation Builder set
  (`metrix_foundation_items`, `metrix_foundation_notes`, `metrix_vendor_tracker`,
  `metrix_launch_readiness`).
- Common columns mirror the existing pattern: `id` (uuid pk), `account_user_id`
  (uuid → `auth.users.id` on delete cascade), `client_id` (text, originating local id),
  `created_at`, `updated_at`, plus a future `synced_at` and per-row sync status.
- Idempotency via `UNIQUE (account_user_id, client_id)` so re-sync upserts, never
  duplicates — same contract as today's writer.

### Row Level Security requirements

- RLS **enabled** on every new table; owner-only `select/insert/update/delete` where
  `auth.uid() = account_user_id`. No anon read/write of user progress data.
- `account_user_id` derived from the session JWT — never trusted from the client body.
- Browser writes use the **anon key + session JWT only**; the service-role key stays
  server-only. **Do not weaken RLS to make a flow easier.**

### Account ownership model

- Identity = the magic-link account user (`accountAuth.AccountUser { id, email }`).
- Every synced row is owned by exactly one `account_user_id`. Account (identity) and
  entitlement (paid report access) stay **decoupled** — sync must not change who can
  view the paid report. (See [`account-sync-schema-plan.md`](account-sync-schema-plan.md) §9.)

### Local-to-cloud migration approach

- First sign-in performs a **one-time adoption** per flow: read the local key, shape it,
  upsert keyed on `client_id`. The retention adoption already exists
  (`adoptLocalMetrixHistoryToAccount`); the new flows get equivalent adopters.
- Adoption is idempotent and **never deletes or mutates local data**. After a confirmed
  sync, local storage becomes a cache of the account; until then it stays authoritative.

### Local fallback behavior

- Every flow keeps writing locally first, exactly as today, so the product works
  signed-out and offline. Cloud sync is **additive**, never a replacement that can fail
  closed. **Do not break local fallback.**

### Sync conflict handling

- Last-write-wins per `client_id` via upsert is the v1 default (matches today's writer).
- For records that can change on two devices (e.g., a checklist item toggled in two
  places), prefer a `updated_at` comparison (newest wins) and surface a non-destructive
  "updated elsewhere" note rather than silently clobbering. Full merge/CRDT is out of
  scope for v1.

### Sync status labels (product standard)

Exactly one of, per flow, shown honestly:

- **Saved on this device** — local only; no confirmed cloud write.
- **Synced to your account** — only after a confirmed successful write.
- **Sync unavailable** — Supabase not configured, offline, or write failed (non-scary).
- **Sign in to back up progress** — signed-out with local data present.

### Privacy / data deletion / export considerations

- Account-2K provides export (download my data) and delete (remove my account data).
- Deletion cascades via `on delete cascade` on `account_user_id`.
- Free-text and contact-ish data (feedback, partner interest) require a **privacy review
  before sync** and explicit consent surfacing.

### Offline / online behavior

- Offline: local writes succeed; status reads "Saved on this device" / "Sync unavailable."
- Back online + signed in: a sync pass upserts pending rows, then flips to "Synced to
  your account" only on confirmed success. No blocking spinners that trap the user.

### Future admin / support limitations

- Support/admin must **not** get blanket read access to user rows via RLS bypass.
- Any future support tooling is a separate, audited, server-side capability with explicit
  scope — never the browser anon path, never a weakened policy.

## 4. User experience requirements

Every synced feature should eventually show:

- **Storage status** (one of the four labels above).
- **Last saved time** (local write time).
- **Last synced time** when a confirmed cloud write exists.
- **Sign-in prompt** when data is local-only ("Sign in to back up progress").
- **Non-scary failure state** when sync is unavailable — keep the user's work, retry
  later, never imply data loss occurred.
- **Clear note that local-only progress can be lost if browser data is cleared** — the
  honest reason to sign in.

## 5. Implementation phases (future build)

- **Account-2A** — Cloud Sync Architecture + Migration Plan
- **Account-2B** — Supabase Tables + RLS for Progress Records
- **Account-2C** — Sync Status UI Component
- **Account-2D** — Assessment / MetrixScore™ History Sync
- **Account-2E** — Roadmap Action + KPI Sync
- **Account-2F** — Feedback / Customer Proof Sync *(privacy review first)*
- **Account-2G** — Partner Interest Sync *(privacy review first)*
- **Account-2H** — Growth Analytics Privacy-Safe Sync *(non-PII, aggregate)*
- **Account-2I** — Foundation Builder Sync Readiness
- **Account-2J** — Local-to-Cloud Migration + Conflict Handling
- **Account-2K** — Data Export / Delete / Privacy Controls

> Sequencing note: 2D/2E mostly **activate** the existing 3C writer (apply migration +
> wire sign-in UI + cloud→local hydrate). 2F–2I add new tables/writers. 2J/2K harden
> migration, conflict, and privacy controls.

## 6. Product-5 dependency

The full Guided Business Foundation Builder **should not be built as local-only.** The
Account-2 Cloud Sync Activation Layer should be **completed or actively wired** before
**Product-5B (In-App Foundation Checklist)** / **Product-5C (Completion Tracking)** become
a core customer feature — otherwise a contractor's foundation progress lives only in one
browser and is lost when cache is cleared. Account-2I (Foundation Builder Sync Readiness)
is the explicit bridge: design the Foundation Builder data model cloud-ready from day one.

## Relationship to Quality-1

The Cloud Sync Standard (pillar 2) of **Quality-1 — Platform Quality, Trust, UX, and
Customer Success Standard** (`platform-quality-trust-ux-standard.md`) is defined by this
layer: the four honest sync-status labels and the "no core progress stays local-only"
rule. Quality-1 depends on Account-2 being on the roadmap; this doc is that dependency.

## 7. Guardrails

- **Do not claim cloud sync is live** unless the exact flow is built, tested, and labeled.
- **Do not expose Supabase keys/secrets** — anon key only in the browser; service-role key
  stays server-side.
- **Do not weaken RLS** — owner-only on every table; `account_user_id = auth.uid()`.
- **Do not sync PII-heavy or free-text data** (feedback, partner interest) without a
  privacy review and explicit consent.
- **Do not sync analytics in a way that becomes invasive tracking** — non-PII, aggregate,
  privacy-safe only.
- **Do not break local fallback** — local-first always; cloud sync is additive.
- **Do not change** payment, Stripe, checkout, webhook, verify-session, DEV_UNLOCK, report
  gating, scoring math, package/dependencies, or `.env.local`.
- **Do not use banned credit-score comparison terminology.**
- Use **SubZeroMetrix™** and **MetrixScore™** properly; **The Modern Trades Mentor LLC**
  as owner/operator.

## 8. Local-storage key → future cloud owner (docs-only audit)

| Local key | Holds | Future cloud table | Sync phase |
|---|---|---|---|
| `szm_metrix_profile` | Latest MetrixProfile™ | `metrix_profiles` | 2D |
| `szm_metrix_history` | Score/action/reassessment/KPI history | `metrix_score_snapshots` + `metrix_action_progress` + `metrix_reassessment_events` + `metrix_kpi_snapshots` | 2D / 2E |
| `szm_metrix_last_recorded_at` | Retention timestamp | *(derived; not synced as a row)* | — |
| `szm_path_complete` | Roadmap path completion | `metrix_action_progress` (folded) | 2E |
| `szm_foundation_complete` | Foundation checklist flag | `metrix_foundation_items` (future) | 2I |
| `szm_growth_complete` | Growth checklist flag | `metrix_action_progress` / foundation (future) | 2E / 2I |
| `szm_customer_feedback` | Rating + comment + consent | `metrix_customer_feedback` (future) | 2F |
| `szm_partner_interest` | Partner interest records | `metrix_partner_interest` (future) | 2G |
| `szm_growth_events` | Privacy-safe activation events | `metrix_growth_events` (aggregate, future) | 2H |
| `szm_feedback` | Site feedback | *(privacy review; may stay local)* | 2F (review) |
| `szm_score` / `szm_intake` / `szm_assessment_id` | Latest-result conveniences | *(not synced; superseded by history rows)* | — |
| `szm_install_dismissed` / `szm_proof_dismissed` | UI dismissals | *(not synced)* | — |

---

### Out of scope for this phase (explicitly NOT done)

No migrations created, no Supabase schema change, no cloud sync wired, no sign-in UI, no
new dependency, and no change to checkout / webhook / verify-session / report gating /
DEV_UNLOCK / scoring / pricing / roadmap logic / `.env.local`. This phase is **roadmap +
architecture alignment only**.
