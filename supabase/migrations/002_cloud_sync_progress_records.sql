-- ─────────────────────────────────────────────────────────────────────────────
-- 002_cloud_sync_progress_records.sql — Account-2B (Cloud Sync Activation Layer)
-- ─────────────────────────────────────────────────────────────────────────────
-- Per-user, RLS-protected progress tables for the Account-2 Cloud Sync Activation
-- Layer. This is the flexible, payload-first schema the activation layer will sync
-- against (one table per syncable entity in src/lib/syncContracts.ts). It is a
-- UNIFIED, forward-looking design distinct from the Mega-Phase 3C structured tables
-- in 001_metrix_account_sync.sql (metrix_profiles, metrix_score_snapshots, ...),
-- which remain untouched. Reconciling the two is a later wiring phase (2D onward).
--
-- SECURITY MODEL (same trust model as 001)
--   • Every table is RLS-protected: a user may only read/write rows where
--     user_id = auth.uid(). NO public read, NO anonymous access.
--   • user_id references auth.users(id) on delete cascade.
--   • The service-role key is NEVER used by the browser; client writes go through
--     the anon key + the user's session JWT, which RLS enforces.
--   • Idempotent local→cloud adoption: each row carries local_id (the originating
--     local record id). UNIQUE (user_id, local_id) lets upserts replace rather than
--     duplicate when a device re-syncs. (NULL local_id rows are allowed and distinct.)
--   • payload jsonb keeps the schema flexible so the app can evolve without repeated
--     schema churn. No payment/entitlement coupling — these tables say nothing about
--     paid access, report gating, or scoring.
--
-- STATUS: schema + RLS only. NO app flow is wired to these tables yet, and nothing
-- in the product claims "Synced to your account". Activation happens in 2C (status
-- UI) and 2D onward (wiring real flows, lowest privacy risk first).
--
-- This migration is idempotent (IF NOT EXISTS + DROP POLICY/TRIGGER IF EXISTS) so a
-- reviewer can apply and re-apply it safely. It is NOT auto-applied by the app.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── updated_at trigger helper (none exists in 001; create it here) ────────────
create or replace function public.cloud_sync_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables — one per syncable entity (src/lib/syncContracts.ts SyncEntityType).
-- Standard shape: id, user_id (owner), local_id (origin id), sync_source, payload
-- (flexible jsonb), deleted_at (soft delete), created_at, updated_at.
-- ─────────────────────────────────────────────────────────────────────────────

-- assessment_history → MetrixProfile™ / assessment inputs (no PII, no free text)
create table if not exists public.cloud_sync_assessment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_assessment_history_user_local_key unique (user_id, local_id)
);

-- metrix_score_history → MetrixScore™ snapshots over time (no PII, no free text)
create table if not exists public.cloud_sync_score_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_score_history_user_local_key unique (user_id, local_id)
);

-- roadmap_action_progress → completed action ids / counts (no PII, no free text)
create table if not exists public.cloud_sync_roadmap_action_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_roadmap_action_progress_user_local_key unique (user_id, local_id)
);

-- kpi_entries → manual KPI numbers + optional note (free text in note; no PII)
create table if not exists public.cloud_sync_kpi_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_kpi_entries_user_local_key unique (user_id, local_id)
);

-- customer_feedback → rating + consent + FREE-TEXT comment.
-- PRIVACY: payload may contain a free-text `comment` the user typed. User-owned only,
-- strict RLS, no public read, no anon. Never posted publicly; consent flags travel in
-- the payload. A privacy review is required before any flow writes here (Account-2F).
create table if not exists public.cloud_sync_customer_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_customer_feedback_user_local_key unique (user_id, local_id)
);

-- partner_interest → HIGHEST PRIVACY/PII SURFACE.
-- PRIVACY: payload may contain PII (name, company, email, website) and a free-text
-- collaboration note. User-owned only, strict RLS, no public read, no anon. An explicit
-- consent flag and a privacy review are required before any flow writes here (Account-2G).
create table if not exists public.cloud_sync_partner_interest (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_partner_interest_user_local_key unique (user_id, local_id)
);

-- growth_events → PRIVACY-SAFE BY DESIGN.
-- PRIVACY: payload must hold only non-PII, aggregate-safe fields (milestone, channel,
-- path, language). It MUST NOT contain names, emails, phone numbers, company, or any
-- free-text form content. User-owned only, strict RLS, no public read, no anon.
create table if not exists public.cloud_sync_growth_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_growth_events_user_local_key unique (user_id, local_id)
);

-- foundation_builder_progress → Foundation Builder checklist (free-text notes; no PII)
create table if not exists public.cloud_sync_foundation_builder_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_foundation_builder_progress_user_local_key unique (user_id, local_id)
);

-- vendor_tool_tracker → vendor/tool references + notes.
-- PRIVACY: store references only — NEVER credentials, passwords, or secrets.
create table if not exists public.cloud_sync_vendor_tool_tracker (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_vendor_tool_tracker_user_local_key unique (user_id, local_id)
);

-- launch_readiness_progress → launch readiness checklist (free-text notes; no PII)
create table if not exists public.cloud_sync_launch_readiness_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  sync_source text not null default 'account',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cloud_sync_launch_readiness_progress_user_local_key unique (user_id, local_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security + updated_at triggers — owner-only on every new table.
-- Policies: a user may select/insert/update/delete ONLY rows where user_id =
-- auth.uid(). No public read, no anonymous access, no service-role-only policy.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'cloud_sync_assessment_history',
    'cloud_sync_score_history',
    'cloud_sync_roadmap_action_progress',
    'cloud_sync_kpi_entries',
    'cloud_sync_customer_feedback',
    'cloud_sync_partner_interest',
    'cloud_sync_growth_events',
    'cloud_sync_foundation_builder_progress',
    'cloud_sync_vendor_tool_tracker',
    'cloud_sync_launch_readiness_progress'
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
