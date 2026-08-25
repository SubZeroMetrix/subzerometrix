-- Newsletter subscribers: one preference record per email, two publications,
-- global suppression via unsubscribed_at (not per-publication delete).
--
-- BLOCKED same as 0008_citation_intelligence.sql: no SUPABASE_DB_PASSWORD /
-- direct Postgres connection string exists in this environment, so this
-- migration is written and reviewable but NOT APPLIED. Owner must run it
-- (Supabase dashboard SQL editor, or `supabase db push` once a connection
-- string is available) before the newsletter API routes will work.

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  pinellas_field_notes boolean not null default false,
  growth_systems_brief boolean not null default false,
  source_domain text,
  source_landing_page text,
  source_tool text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_source text not null,
  consent_timestamp timestamptz not null default now(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers (email);
create index if not exists idx_newsletter_subscribers_unsubscribe_token on newsletter_subscribers (unsubscribe_token);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_newsletter_subscribers_updated_at on newsletter_subscribers;
create trigger trg_newsletter_subscribers_updated_at
  before update on newsletter_subscribers
  for each row execute function set_updated_at();

alter table newsletter_subscribers enable row level security;
-- No policies defined: deny-all for anon/authenticated roles, service_role bypasses RLS by design.
