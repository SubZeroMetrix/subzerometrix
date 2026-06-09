-- SubZeroMetrix — Supabase Schema v3
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — uses IF NOT EXISTS throughout.

-- ── Assessments table ────────────────────────────────────────────────────────
create table if not exists assessments (
  id                uuid primary key default gen_random_uuid(),

  -- Lead capture
  lead_name         text,
  lead_email        text,

  -- Q1: Business type
  business_type     text,

  -- Q2: Location
  state             text,
  city              text,

  -- Q3: Stage
  stage             text,

  -- Q4: Setup steps (multi-select, stored as array)
  setup_steps       text[],

  -- Q5: Financial readiness
  financial         text,

  -- Q6: Customer acquisition plan
  customer_plan     text,

  -- Q7: Biggest blocker
  blocker           text,

  -- Scoring
  overall_score     integer,
  band              text,       -- 'High Risk' | 'Foundation Stage' | 'Launch Ready' | 'Growth Ready'
  score_label       text,       -- same as band, for display
  category_scores   jsonb,      -- { businessClarity, locationClarity, stageReadiness, setupReadiness, financialReadiness, customerReadiness, blockerSeverity }
  report_json       jsonb,      -- { risks, actions, resources, builderPath }
  answers_json      jsonb,      -- full raw RawAnswers for future re-scoring

  -- Payment status (updated by webhook)
  paid              boolean default false,
  stripe_session_id text,
  paid_at           timestamptz,

  completed_at      timestamptz default now(),
  created_at        timestamptz default now()
);

-- Enable Row Level Security
alter table assessments enable row level security;

-- Allow anonymous inserts from the client (assessment submit, no auth required)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'assessments' and policyname = 'allow_anon_insert'
  ) then
    execute 'create policy "allow_anon_insert" on assessments for insert to anon with check (true)';
  end if;
end $$;

-- No public reads — only service role key can read
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'assessments' and policyname = 'no_public_read'
  ) then
    execute 'create policy "no_public_read" on assessments for select using (false)';
  end if;
end $$;

-- Indexes
create index if not exists assessments_email_idx       on assessments (lead_email);
create index if not exists assessments_score_idx       on assessments (overall_score);
create index if not exists assessments_session_idx     on assessments (stripe_session_id);
create index if not exists assessments_paid_idx        on assessments (paid);

-- ── Purchases table ──────────────────────────────────────────────────────────
-- Written by Stripe webhook on checkout.session.completed
create table if not exists purchases (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  assessment_id     uuid references assessments(id),
  customer_email    text,
  amount_total      integer,       -- cents (899 = $8.99)
  score             text,
  band              text,
  business_type     text,
  stage             text,
  lead_name         text,
  completed_at      timestamptz default now(),
  created_at        timestamptz default now()
);

alter table purchases enable row level security;
-- Deny all public access — service role key bypasses RLS

create index if not exists purchases_session_idx   on purchases (stripe_session_id);
create index if not exists purchases_email_idx     on purchases (customer_email);
create index if not exists purchases_assessment_idx on purchases (assessment_id);
