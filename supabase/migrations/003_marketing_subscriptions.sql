-- ─────────────────────────────────────────────────────────────────────────────
-- 003_marketing_subscriptions.sql — Growth-8 email capture (consent-first)
-- ─────────────────────────────────────────────────────────────────────────────
-- A single, narrowly-scoped table for explicit-consent marketing/nurture interest
-- captured from PUBLIC contractor-startup pages. RLS allows ANON/AUTHENTICATED to
-- INSERT ONLY — there is NO select/update/delete policy, so no public or signed-in
-- user can list, read, modify, or delete subscribers (RLS denies by default).
--
-- SECURITY / PRIVACY MODEL
--   • INSERT-only public policy with a CHECK that consent_to_email = true, plus a
--     server-side email-format CHECK and a UNIQUE(email_normalized) for dedupe.
--   • The browser uses the ANON key only — the service-role key is NEVER used here.
--   • No assessment/score/roadmap/Foundation Builder/account data is stored here.
--   • status defaults to 'subscribed'; this migration never upserts, so an existing
--     (possibly unsubscribed) row is NOT silently re-subscribed — a re-submit hits the
--     UNIQUE constraint and is treated as "already on the list" by the app.
--
-- DELIVERY: no email provider is configured. This table only records consented
-- interest; no emails are sent until a verified delivery integration exists. Until this
-- migration is APPLIED to the project, inserts fail and the form shows an honest
-- "sign-ups unavailable" state (it never claims a save that did not happen).
--
-- Idempotent (IF NOT EXISTS + DROP POLICY IF EXISTS) so a reviewer can re-apply safely.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.marketing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text not null,
  first_name text,
  selected_trade text,
  selected_state text,
  source_page text,
  source_intent text,
  resource_requested text,
  consent_to_email boolean not null default false,
  consent_text_version text not null,
  consent_timestamp timestamptz,
  locale text,
  status text not null default 'subscribed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_subscriptions_email_norm_key unique (email_normalized),
  constraint marketing_subscriptions_email_format
    check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint marketing_subscriptions_email_len check (char_length(email) <= 254),
  constraint marketing_subscriptions_consent_required check (consent_to_email = true),
  constraint marketing_subscriptions_status_valid
    check (status in ('subscribed', 'unsubscribed', 'bounced', 'suppressed'))
);

alter table public.marketing_subscriptions enable row level security;

-- INSERT-only for anon + authenticated; consent must be true. No SELECT/UPDATE/DELETE
-- policy exists, so reads/lists/modifications/deletes are denied for everyone via RLS.
drop policy if exists "marketing_subscriptions_insert_consented" on public.marketing_subscriptions;
create policy "marketing_subscriptions_insert_consented"
  on public.marketing_subscriptions
  for insert
  to anon, authenticated
  with check (consent_to_email = true);
