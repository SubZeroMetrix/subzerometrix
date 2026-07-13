-- Lead capture for the Metrix Command Center marketing sections of the
-- public SubZero Metrix landing page. Deliberately a separate table from
-- lead_signups (the affiliate email-list signup) -- different schema,
-- different funnel, different downstream handling. Lives in this
-- project's own Supabase (ref vzbcunnrkexnmspeiwiu) -- never MCC
-- production (ref lnfokebqcdlzgnvcxmub).

create table if not exists public.mcc_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  source text not null default 'landing_page',
  consent_given boolean not null default false,
  consent_text text not null,
  consent_timestamp timestamptz not null default now(),
  ip_address text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists mcc_leads_email_idx on public.mcc_leads (email);
create index if not exists mcc_leads_created_at_idx on public.mcc_leads (created_at desc);

alter table public.mcc_leads enable row level security;

-- No public read/write policies -- all access goes through the service
-- role via the server-side API route (src/app/api/mcc-lead/route.ts) and
-- the internal admin view, matching the existing lead_signups pattern.
