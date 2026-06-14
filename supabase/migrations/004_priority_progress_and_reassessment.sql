-- ─────────────────────────────────────────────────────────────────────────────
-- 004_priority_progress_and_reassessment.sql — SZM Wave 1 (priority-progress cloud)
-- ─────────────────────────────────────────────────────────────────────────────
-- Account-owned, RLS-protected cloud storage for the two metrix progress entities
-- that SZM-2E/2F built locally but could not yet back up because no table existed:
--   • cloud_sync_priority_progress   ← src/lib/metrix/progressRecord.ts
--                                       (PersistedPriorityProgress, key szm_priority_progress)
--   • cloud_sync_reassessment_history ← src/lib/metrix/reassessment.ts
--                                       (ReassessmentRecord[], key szm_reassessment_history)
--
-- This is the missing migration the SZM-2E handoff called out: "Activating cloud sync
-- requires a future cloud_sync_priority_progress migration + a write helper." It extends
-- the same payload-first, owner-only design as migration 002 — it does NOT overload any
-- existing table, change scoring/priority/path policy, or touch the structured 001 tables.
--
-- SECURITY MODEL (identical to 002)
--   • Every table is RLS-protected: a user may read/write ONLY rows where
--     user_id = auth.uid(). No public read, no anonymous access, no service-role policy.
--   • user_id references auth.users(id) on delete cascade.
--   • The service-role key is NEVER used by the browser; client writes go through the
--     anon key + the user's session JWT, which RLS enforces.
--   • Idempotent local→cloud adoption: each row carries local_id (the originating local
--     record identity). UNIQUE (user_id, local_id) lets upserts REPLACE rather than
--     duplicate when a device re-syncs, so duplicate records cannot accumulate.
--   • The full local record travels in payload jsonb (preserving the exact local shape
--     and stable ids); the scalar columns below are promoted copies for queryability and
--     stale-write checks. completed steps + evidence states live in payload.
--
-- DEPENDS ON 002 for the public.cloud_sync_set_updated_at() trigger helper. Migrations
-- apply in order. This migration is idempotent (IF NOT EXISTS + DROP POLICY/TRIGGER IF
-- EXISTS) so a reviewer can apply and re-apply it safely. It is NOT auto-applied by the app.
-- ─────────────────────────────────────────────────────────────────────────────

-- Safety net: ensure the updated_at helper exists even if 002 was not applied first.
create or replace function public.cloud_sync_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── cloud_sync_priority_progress ─────────────────────────────────────────────
-- One row per (profile, priority): the active record AND archived prior-priority
-- records (distinct priority_id ⇒ distinct local_id) all live here, never deleting
-- prior work. local_id is `${profileId}::${priorityId}`.
create table if not exists public.cloud_sync_priority_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,                       -- `${profileId}::${priorityId}` (stable identity)
  sync_source text not null default 'account',
  profile_id text,                     -- canonical Metrix Profile id (unchanged across reassessment)
  priority_id text,                    -- the priority this record tracks
  selected_path_id text,               -- user's chosen completion path (null = none chosen)
  status text,                         -- not_started | in_progress | ready_for_review | completed | blocked
  completion_percent integer,          -- 0..100 over REQUIRED steps
  reassessment_eligible boolean,       -- true once completion criteria are met
  schema_version integer,              -- PROGRESS_SCHEMA_VERSION
  ruleset_version integer,             -- canonical RULESET_VERSION (provenance)
  started_at timestamptz,
  completed_at timestamptz,
  record_updated_at timestamptz,       -- the record's own updatedAt (newest-wins / stale checks)
  payload jsonb not null default '{}'::jsonb,  -- full PersistedPriorityProgress (completedStepIds, evidenceStates, …)
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_priority_progress_user_local_key unique (user_id, local_id)
);

-- ── cloud_sync_reassessment_history ──────────────────────────────────────────
-- One row per completed reassessment event. local_id is the ReassessmentRecord id.
create table if not exists public.cloud_sync_reassessment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,                       -- ReassessmentRecord.id (e.g. ra_…)
  sync_source text not null default 'account',
  profile_id text,
  trigger text,                        -- eligibility | profile_change | both
  previous_overall integer,
  new_overall integer,
  score_delta integer,
  previous_priority_id text,
  new_priority_id text,
  priority_changed boolean,
  reassessed_at timestamptz,
  schema_version integer,              -- REASSESSMENT_SCHEMA_VERSION
  payload jsonb not null default '{}'::jsonb,  -- full ReassessmentRecord
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_reassessment_history_user_local_key unique (user_id, local_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security + updated_at triggers — owner-only on both new tables.
-- A user may select/insert/update/delete ONLY rows where user_id = auth.uid().
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'cloud_sync_priority_progress',
    'cloud_sync_reassessment_history'
  ]
  loop
    -- Helpful index for owner-scoped queries.
    execute format('create index if not exists %I on public.%I (user_id);', t || '_user_id_idx', t);

    -- Enforce ownership at the row level.
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%s_select_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_insert_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_update_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_delete_own" on public.%I;', t, t);

    execute format(
      'create policy "%s_select_own" on public.%I for select using (auth.uid() = user_id);', t, t);
    execute format(
      'create policy "%s_insert_own" on public.%I for insert with check (auth.uid() = user_id);', t, t);
    execute format(
      'create policy "%s_update_own" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t, t);
    execute format(
      'create policy "%s_delete_own" on public.%I for delete using (auth.uid() = user_id);', t, t);

    -- Keep updated_at fresh on every update.
    execute format('drop trigger if exists "%s_set_updated_at" on public.%I;', t, t);
    execute format(
      'create trigger "%s_set_updated_at" before update on public.%I for each row execute function public.cloud_sync_set_updated_at();', t, t);
  end loop;
end $$;
