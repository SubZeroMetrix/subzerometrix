-- SubZeroMetrix — Schema v4 Additions
-- Run AFTER the existing schema.sql
-- Adds: email_events, affiliate_clicks, reassessments tables
-- Also adds tier column to assessments and purchases

-- ── Add tier tracking to assessments ─────────────────────────────────────────
alter table assessments
  add column if not exists tier_purchased  text,     -- 'basic' | 'pro' | 'platform'
  add column if not exists tier_amount     integer,  -- cents
  add column if not exists referral_code   text,     -- referrer's code
  add column if not exists referred_by     text;     -- referrer email

-- ── Add tier to purchases ─────────────────────────────────────────────────────
alter table purchases
  add column if not exists tier_purchased  text,
  add column if not exists tier_amount     integer;

-- ── Email events ──────────────────────────────────────────────────────────────
create table if not exists email_events (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid references assessments(id),
  lead_email      text not null,
  sequence_name   text,            -- 'unpaid_nurture' | 'post_purchase' | 'reassessment'
  sequence_day    integer,         -- day 1, 7, 30, 89...
  subject         text,
  sent_at         timestamptz default now(),
  opened_at       timestamptz,
  clicked_at      timestamptz,
  clicked_link    text,
  converted       boolean default false,
  created_at      timestamptz default now()
);

alter table email_events enable row level security;
create index if not exists email_events_email_idx  on email_events (lead_email);
create index if not exists email_events_assess_idx on email_events (assessment_id);

-- ── Affiliate clicks ──────────────────────────────────────────────────────────
create table if not exists affiliate_clicks (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid references assessments(id),
  lead_email      text,
  partner_name    text not null,   -- 'quickbooks' | 'jobber' | 'simplybusiness' etc.
  partner_url     text,
  gap_area        text,            -- which score area triggered this link
  clicked_at      timestamptz default now(),
  converted       boolean default false,
  conversion_at   timestamptz,
  estimated_earn  numeric(8,2)
);

alter table affiliate_clicks enable row level security;
create index if not exists aff_clicks_partner_idx on affiliate_clicks (partner_name);
create index if not exists aff_clicks_assess_idx  on affiliate_clicks (assessment_id);

-- ── Reassessments (score history) ────────────────────────────────────────────
create table if not exists reassessments (
  id                  uuid primary key default gen_random_uuid(),
  original_id         uuid references assessments(id),
  lead_email          text not null,
  previous_score      integer,
  new_score           integer,
  score_delta         integer generated always as (new_score - previous_score) stored,
  previous_band       text,
  new_band            text,
  days_between        integer,
  category_delta      jsonb,       -- per-area improvement/decline
  assessment_id       uuid references assessments(id),
  created_at          timestamptz default now()
);

alter table reassessments enable row level security;
create index if not exists reassess_email_idx  on reassessments (lead_email);
create index if not exists reassess_orig_idx   on reassessments (original_id);

-- ── Referrals ─────────────────────────────────────────────────────────────────
create table if not exists referrals (
  id              uuid primary key default gen_random_uuid(),
  referrer_email  text not null,
  referrer_code   text unique not null,
  referred_email  text,
  referred_id     uuid references assessments(id),
  converted       boolean default false,
  commission_usd  numeric(6,2) default 5.00,
  paid_out        boolean default false,
  created_at      timestamptz default now()
);

alter table referrals enable row level security;
create index if not exists referrals_code_idx  on referrals (referrer_code);
create index if not exists referrals_email_idx on referrals (referrer_email);

-- Service role access for all new tables (automation via n8n / server routes)
-- No public reads on any table — only service role key bypasses RLS
