-- ─────────────────────────────────────────────────────────────────────────────
-- 001_metrix_account_sync.sql — account-owned MetrixProfile™ + history (3C)
-- ─────────────────────────────────────────────────────────────────────────────
-- Per-user retention tables for cloud-saved MetrixProfile™, MetrixScore™ history,
-- action progress, reassessment events, manual KPI snapshots, and reminder
-- preferences. Cross-device continuity for signed-in account users.
--
-- SECURITY MODEL
--   • Every table is RLS-protected: a user may only read/write rows where
--     account_user_id = auth.uid(). No public/anon read or write.
--   • account_user_id references auth.users(id) on delete cascade.
--   • The service-role key is NEVER used by the browser; client writes go through
--     the anon key + the user's session JWT, which RLS enforces.
--   • Idempotent local→cloud adoption: each row carries client_id (the originating
--     local snapshot id). UNIQUE (account_user_id, client_id) lets upserts replace
--     rather than duplicate when a device re-syncs.
--   • NO payment/entitlement coupling — these tables say nothing about paid access.
--
-- NOTE: table names mirror METRIX_CLOUD_TABLES in src/lib/metrixCloudSchema.ts.
-- The KPI table is `metrix_kpi_snapshots` (it stores MANUAL KPI snapshots).
-- This migration is idempotent (IF NOT EXISTS + DROP POLICY IF EXISTS) so it can
-- be applied and re-applied safely by a reviewer.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── metrix_profiles ──────────────────────────────────────────────────────────
create table if not exists public.metrix_profiles (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  trade text,
  region text,
  business_stage text,
  years_in_business text,
  revenue_range text,
  team_size text,
  main_goal text,
  biggest_challenge text,
  confidence text,
  profile_completion integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_profiles_user_client_key unique (account_user_id, client_id)
);

-- ── metrix_score_snapshots ───────────────────────────────────────────────────
create table if not exists public.metrix_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  source text,
  overall integer not null,
  categories jsonb not null default '[]'::jsonb,
  risk_level text,
  risk_label text,
  profile_completion integer,
  trade text,
  region text,
  business_stage text,
  main_goal text,
  biggest_challenge text,
  assessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_score_snapshots_user_client_key unique (account_user_id, client_id)
);

-- ── metrix_action_progress ───────────────────────────────────────────────────
create table if not exists public.metrix_action_progress (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  completed_action_ids text[] not null default '{}',
  completed_count integer not null default 0,
  total_actions integer,
  source text,
  recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_action_progress_user_client_key unique (account_user_id, client_id)
);

-- ── metrix_reassessment_events ───────────────────────────────────────────────
create table if not exists public.metrix_reassessment_events (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  reason text,
  previous_score_snapshot_id text,
  new_score_snapshot_id text,
  score_delta integer,
  note text,
  occurred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_reassessment_events_user_client_key unique (account_user_id, client_id)
);

-- ── metrix_kpi_snapshots (MANUAL KPI snapshots) ──────────────────────────────
create table if not exists public.metrix_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  period_label text,
  values jsonb not null default '{}'::jsonb,
  note text,
  recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_kpi_snapshots_user_client_key unique (account_user_id, client_id)
);

-- ── metrix_reminder_preferences ──────────────────────────────────────────────
create table if not exists public.metrix_reminder_preferences (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  type text,
  enabled boolean,
  cadence text,
  priority text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metrix_reminder_preferences_user_client_key unique (account_user_id, client_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security — owner-only access on every table
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'metrix_profiles',
    'metrix_score_snapshots',
    'metrix_action_progress',
    'metrix_reassessment_events',
    'metrix_kpi_snapshots',
    'metrix_reminder_preferences'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%s_select_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_insert_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_update_own" on public.%I;', t, t);
    execute format('drop policy if exists "%s_delete_own" on public.%I;', t, t);

    execute format(
      'create policy "%s_select_own" on public.%I for select using (auth.uid() = account_user_id);', t, t);
    execute format(
      'create policy "%s_insert_own" on public.%I for insert with check (auth.uid() = account_user_id);', t, t);
    execute format(
      'create policy "%s_update_own" on public.%I for update using (auth.uid() = account_user_id) with check (auth.uid() = account_user_id);', t, t);
    execute format(
      'create policy "%s_delete_own" on public.%I for delete using (auth.uid() = account_user_id);', t, t);
  end loop;
end $$;
