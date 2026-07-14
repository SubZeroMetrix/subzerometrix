-- Landing-page AI Help Center, Customer Care Center, Feedback Loop,
-- Qualification, and Referral/Partner Interest foundation.
--
-- Applied directly to the dedicated, isolated Supabase project
-- "SubZeroMetrixLandingPage" (ref sskgceffpkiuxjhlyjjr) via
-- `supabase db query --linked -f`, same isolation rule as
-- 0003_mcc_leads.sql. This project's migration-history ledger only
-- tracks that earlier apply under its own internal version id, so this
-- file is applied directly rather than via `supabase db push` to avoid
-- any ambiguity with this repo's separate affiliate-platform migration
-- sequence (0001/0002), which does not belong on this project.
--
-- Kept in this repo's migrations directory for history/reference only.

-- ── Help Center: curated knowledge base (human-authored, versioned) ──
-- No LLM/chat integration -- every answer is authored and approved by
-- a human reviewer, tagged with a verification status, and grounded in
-- a real public source path on this site.
create table if not exists public.help_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  answer text not null,
  source_path text not null,
  status text not null default 'VERIFIED' check (status in ('VERIFIED', 'LIMITED', 'PLANNED', 'UNKNOWN')),
  version integer not null default 1,
  last_verified_date date not null default current_date,
  reviewer text not null default 'SubZero Metrix team',
  escalation_rule text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists help_articles_category_idx on public.help_articles (category);
create index if not exists help_articles_status_idx on public.help_articles (status);

-- ── Feedback loop: per-answer ratings + general site feedback ──
create table if not exists public.help_feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'helpful_answer', 'unhelpful_answer', 'missing_information', 'incorrect_information',
    'website_bug', 'accessibility_issue', 'product_question', 'pricing_question',
    'trust_security_concern', 'feature_interest', 'content_request', 'other'
  )),
  route text not null,
  help_article_id uuid references public.help_articles(id) on delete set null,
  rating text check (rating in ('helpful', 'unhelpful')),
  comment text,
  consent_analytics boolean not null default false,
  visitor_id text,
  contact_email text,
  status text not null default 'NEW' check (status in (
    'NEW', 'REVIEWED', 'ACTIONABLE', 'PLANNED', 'COMPLETED', 'DECLINED', 'DUPLICATE', 'SPAM'
  )),
  review_outcome text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists help_feedback_status_idx on public.help_feedback (status);
create index if not exists help_feedback_category_idx on public.help_feedback (category);
create index if not exists help_feedback_created_at_idx on public.help_feedback (created_at desc);

-- ── Customer Care Center: general support/report/suggestion requests ──
create table if not exists public.customer_care_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in (
    'website_problem', 'incorrect_information', 'suggestion', 'next_step_help',
    'contact_support', 'privacy_request', 'accessibility_feedback',
    'security_concern', 'product_interest', 'mcc_account_support'
  )),
  message text not null,
  route text,
  name text,
  contact_email text,
  status text not null default 'NEW' check (status in (
    'NEW', 'REVIEWED', 'ACTIONABLE', 'PLANNED', 'COMPLETED', 'DECLINED', 'DUPLICATE', 'SPAM'
  )),
  resolution_notes text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_care_requests_type_idx on public.customer_care_requests (request_type);
create index if not exists customer_care_requests_status_idx on public.customer_care_requests (status);
create index if not exists customer_care_requests_created_at_idx on public.customer_care_requests (created_at desc);

-- ── Qualification: lightweight lead-qualification flow ──
create table if not exists public.qualification_responses (
  id uuid primary key default gen_random_uuid(),
  trade_type text,
  role text,
  company_size_range text,
  current_method text,
  primary_pain text,
  opportunity_volume_range text,
  current_software text,
  desired_next_step text,
  name text not null,
  email text not null,
  phone text,
  how_heard text,
  consent_given boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  landing_page text,
  status text not null default 'NEW' check (status in (
    'NEW', 'REVIEWED', 'QUALIFIED', 'NOT_QUALIFIED', 'HANDED_OFF', 'DUPLICATE', 'SPAM'
  )),
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists qualification_responses_email_idx on public.qualification_responses (email);
create index if not exists qualification_responses_status_idx on public.qualification_responses (status);
create index if not exists qualification_responses_created_at_idx on public.qualification_responses (created_at desc);

-- ── Referral / partner interest (interest-only, no payouts/automation) ──
create table if not exists public.referral_partner_interest (
  id uuid primary key default gen_random_uuid(),
  interest_type text not null check (interest_type in ('referral', 'partner')),
  name text not null,
  email text not null,
  business_name text,
  message text,
  source_attribution text,
  consent_given boolean not null default false,
  status text not null default 'NEW' check (status in (
    'NEW', 'REVIEWED', 'APPROVED', 'DECLINED', 'DUPLICATE', 'SPAM'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists referral_partner_interest_type_idx on public.referral_partner_interest (interest_type);
create index if not exists referral_partner_interest_status_idx on public.referral_partner_interest (status);

-- ── First-party landing-page events (Help Center / Care / Feedback /
--    Qualification / Referral taxonomy only -- separate from and does
--    not extend into any MCC/CRM event system) ──
create table if not exists public.landing_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_version smallint not null default 1,
  visitor_id text not null,
  session_id text not null,
  route text not null,
  related_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  consent_analytics boolean not null default false,
  environment text not null default 'production',
  created_at timestamptz not null default now()
);

create index if not exists landing_events_name_idx on public.landing_events (event_name);
create index if not exists landing_events_visitor_idx on public.landing_events (visitor_id);
create index if not exists landing_events_created_at_idx on public.landing_events (created_at desc);

-- ── RLS: no public read/write policies on any of the above -- all
--    access goes through the service role via server-side API routes,
--    matching the mcc_leads pattern in 0003. ──
alter table public.help_articles enable row level security;
alter table public.help_feedback enable row level security;
alter table public.customer_care_requests enable row level security;
alter table public.qualification_responses enable row level security;
alter table public.referral_partner_interest enable row level security;
alter table public.landing_events enable row level security;
