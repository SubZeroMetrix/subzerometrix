-- SubZero Citation Intelligence -- persistence for AI/search-visibility
-- observations, citations, competitors, content/technical gaps,
-- opportunities, and outcomes.
--
-- NOT YET APPLIED. Blocked on a missing SUPABASE_DB_PASSWORD / direct
-- Postgres connection string -- the Supabase CLI and Management API both
-- return 403 "User is banned" for this project, and the existing
-- SUPABASE_SERVICE_ROLE_KEY (a PostgREST REST credential) cannot execute
-- DDL. This file is idempotent (create if not exists) and reviewable;
-- apply with `supabase db push --db-url <connection-string>` once that
-- credential exists. Do not apply with a guessed or reconstructed
-- password.
--
-- Entity Registry and Prompt Library remain static/committed TypeScript
-- data (src/lib/citation-intelligence/*.ts), not tables -- they don't
-- change often enough to need a database, and static data ships without
-- this migration.

create extension if not exists "pgcrypto";

-- Bulk CSV/JSON import runs (validation happens in the app before any
-- write -- see src/lib/citation-intelligence/import.ts -- this table
-- records the outcome of a run, not raw uploaded files). Created first
-- since citation_observations references it.
create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  source_format text not null,          -- 'csv' | 'json'
  filename text,
  submitted_by text not null,
  row_count integer not null default 0,
  success_count integer not null default 0,
  error_count integer not null default 0,
  errors jsonb default '[]',
  status text not null default 'pending', -- 'pending' | 'dry_run' | 'applied' | 'failed'
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- One row per (platform, prompt, run) observation of an AI/search answer.
create table if not exists public.citation_observations (
  id uuid primary key default gen_random_uuid(),
  prompt_id text not null,              -- matches Prompt.id in prompts.ts
  prompt_text text not null,            -- denormalized snapshot of the prompt at observation time
  platform text not null,               -- e.g. 'chatgpt-search', 'google-ai-overview', 'bing-copilot', 'perplexity'
  platform_model text,                  -- model/mode where visible (e.g. 'gpt-4o', 'gpt-5-search')
  geography text,
  observed_at timestamptz not null default now(),
  retrieved_at timestamptz not null default now(),
  successful boolean not null default true,   -- false = the query itself failed (rate limit, error), not "no mention"
  raw_answer_excerpt text,              -- short excerpt only -- see content-length constraint below
  observer text not null default 'manual',    -- 'manual' | 'browser' | 'csv-import' | 'json-import'
  import_job_id uuid references public.import_jobs(id) on delete set null,
  limitations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint citation_observations_excerpt_length check (char_length(coalesce(raw_answer_excerpt, '')) <= 2000)
);

create index if not exists citation_observations_prompt_idx on public.citation_observations (prompt_id);
create index if not exists citation_observations_platform_idx on public.citation_observations (platform);
create index if not exists citation_observations_observed_at_idx on public.citation_observations (observed_at desc);

-- Whether/how a portfolio entity was mentioned within one observation.
create table if not exists public.citation_mentions (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.citation_observations(id) on delete cascade,
  entity_id text not null,              -- matches PortfolioEntity.id in entities.ts
  mentioned boolean not null,
  described_accurately boolean,         -- null = not applicable (not mentioned)
  inaccuracy_note text,
  created_at timestamptz not null default now()
);

create index if not exists citation_mentions_observation_idx on public.citation_mentions (observation_id);
create index if not exists citation_mentions_entity_idx on public.citation_mentions (entity_id);

-- A specific cited source URL within one observation.
create table if not exists public.citation_sources (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.citation_observations(id) on delete cascade,
  cited_url text not null,
  cited_domain text not null,
  source_title text,
  is_portfolio_url boolean not null default false,
  position_in_answer integer,           -- only when the platform explicitly exposes ordering
  created_at timestamptz not null default now(),
  constraint citation_sources_url_format check (cited_url ~ '^https?://')
);

create index if not exists citation_sources_observation_idx on public.citation_sources (observation_id);
create index if not exists citation_sources_domain_idx on public.citation_sources (cited_domain);

-- A competitor entity/domain cited in place of (or alongside) the portfolio.
create table if not exists public.citation_competitors (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.citation_observations(id) on delete cascade,
  competitor_name text not null,
  competitor_domain text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists citation_competitors_observation_idx on public.citation_competitors (observation_id);

-- A content gap identified from one or more observations for one prompt.
create table if not exists public.citation_content_gaps (
  id uuid primary key default gen_random_uuid(),
  prompt_id text not null,
  gap_type text not null,               -- 'NO_RESOURCE' | 'WRONG_PROPERTY' | 'THIN_RESOURCE' | 'UNSOURCED_CLAIM'
                                         -- | 'OUTDATED_SOURCE' | 'ENTITY_CONFUSION' | 'OWNERSHIP_ERROR'
                                         -- | 'NOT_INDEXED' | 'CRAWLER_BLOCKED' | 'MISSING_DIRECT_ANSWER'
                                         -- | 'MISSING_ORIGINAL_EVIDENCE' | 'BROKEN_CONVERSION_PATH'
                                         -- | 'COMPETITOR_CITED_PORTFOLIO_ABSENT' | 'UNKNOWN'
  affected_url text,
  recommended_action text,
  priority text not null default 'medium', -- 'high' | 'medium' | 'low'
  status text not null default 'open',     -- 'open' | 'in_progress' | 'resolved' | 'wont_fix'
  evidence_observation_ids uuid[] default '{}',
  reviewer text,
  review_status text not null default 'unreviewed', -- 'unreviewed' | 'reviewed' | 'disputed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint citation_content_gaps_type_check check (gap_type in (
    'NO_RESOURCE','WRONG_PROPERTY','THIN_RESOURCE','UNSOURCED_CLAIM','OUTDATED_SOURCE',
    'ENTITY_CONFUSION','OWNERSHIP_ERROR','NOT_INDEXED','CRAWLER_BLOCKED','MISSING_DIRECT_ANSWER',
    'MISSING_ORIGINAL_EVIDENCE','BROKEN_CONVERSION_PATH','COMPETITOR_CITED_PORTFOLIO_ABSENT','UNKNOWN'
  ))
);

create index if not exists citation_content_gaps_prompt_idx on public.citation_content_gaps (prompt_id);
create index if not exists citation_content_gaps_status_idx on public.citation_content_gaps (status);

-- Technical discovery issues (robots, crawler access, indexing state, schema).
create table if not exists public.citation_technical_gaps (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  issue_type text not null,             -- 'robots_blocked' | 'noindex' | 'not_in_sitemap' | 'not_indexed'
                                         -- | 'invalid_schema' | 'canonical_mismatch' | 'crawler_blocked'
  detail text,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'open',  -- 'open' | 'resolved'
  created_at timestamptz not null default now(),
  constraint citation_technical_gaps_url_format check (url ~ '^https?://')
);

create index if not exists citation_technical_gaps_status_idx on public.citation_technical_gaps (status);

-- A prioritized next action derived from one or more gaps.
create table if not exists public.citation_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  source_gap_id uuid references public.citation_content_gaps(id) on delete set null,
  source_technical_gap_id uuid references public.citation_technical_gaps(id) on delete set null,
  priority text not null default 'medium',
  status text not null default 'open',  -- 'open' | 'in_progress' | 'done' | 'dismissed'
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists citation_opportunities_status_idx on public.citation_opportunities (status);

-- Business-result attribution connected back to citation/AI-search activity.
create table if not exists public.citation_outcomes (
  id uuid primary key default gen_random_uuid(),
  outcome_type text not null,           -- 'ai_referral_session' | 'crm_click' | 'crm_subscriber'
                                         -- | 'tmt_click' | 'tmt_inquiry' | 'tmt_booked' | 'tmt_sold'
  cited_landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  related_observation_id uuid references public.citation_observations(id) on delete set null,
  occurred_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  constraint citation_outcomes_type_check check (outcome_type in (
    'ai_referral_session','crm_click','crm_subscriber','tmt_click','tmt_inquiry','tmt_booked','tmt_sold'
  ))
);

create index if not exists citation_outcomes_type_idx on public.citation_outcomes (outcome_type);
create index if not exists citation_outcomes_occurred_at_idx on public.citation_outcomes (occurred_at desc);

-- Generic audit trail for admin-made changes to gap/opportunity status.
create table if not exists public.citation_change_history (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  changed_by text not null,
  field_name text not null,
  old_value text,
  new_value text,
  changed_at timestamptz not null default now()
);

create index if not exists citation_change_history_record_idx on public.citation_change_history (table_name, record_id);

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.citation_observations;
create trigger set_updated_at before update on public.citation_observations
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.citation_content_gaps;
create trigger set_updated_at before update on public.citation_content_gaps
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.citation_opportunities;
create trigger set_updated_at before update on public.citation_opportunities
  for each row execute function public.set_updated_at();

-- Row-level security: admin-only, no public/anon access. This mirrors the
-- allowlist enforced in src/lib/admin/allowlist.ts -- RLS is the database
-- boundary, the allowlist check is the application boundary; both must
-- hold independently.
alter table public.citation_observations enable row level security;
alter table public.citation_mentions enable row level security;
alter table public.citation_sources enable row level security;
alter table public.citation_competitors enable row level security;
alter table public.citation_content_gaps enable row level security;
alter table public.citation_technical_gaps enable row level security;
alter table public.citation_opportunities enable row level security;
alter table public.citation_outcomes enable row level security;
alter table public.import_jobs enable row level security;
alter table public.citation_change_history enable row level security;

-- No policies are created for anon/authenticated roles -- with RLS
-- enabled and zero policies, every role except the service_role (which
-- bypasses RLS by design) is denied by default. The application's own
-- admin-email allowlist (src/lib/supabase/admin-auth.ts) gates who can
-- reach the server code that uses the service_role key; nothing here is
-- reachable directly from the browser.
