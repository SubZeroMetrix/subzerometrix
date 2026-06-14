-- ─────────────────────────────────────────────────────────────────────────────
-- 005_commercial_entitlements.sql — Wave 8 CP3: entitlements + webhook idempotency
-- ─────────────────────────────────────────────────────────────────────────────
-- Two additive tables for the commercial entitlement foundation. Purely additive — no existing
-- table, column, policy, or RLS rule is altered, so applying this is non-destructive and the
-- existing assessments/purchases/cloud_sync behavior is unchanged. Until APPLIED, the webhook's
-- entitlement provisioning is wrapped in a non-fatal try/catch and simply no-ops (consistent with
-- the existing purchases insert), so production behavior is unaffected.
--
-- SECURITY / PRIVACY MODEL
--   • commercial_entitlements is owner-scoped: a signed-in user may read/insert/update/delete ONLY
--     their own rows (auth.uid() = owner_user_id). The Stripe webhook writes with the service-role
--     key, which bypasses RLS — it never relies on a public policy.
--   • No card/bank/token/secret/raw-payload columns exist. External provider references are opaque
--     optional text and are never the canonical identity (owner_user_id is).
--   • metadata is jsonb for safe, non-sensitive values only (enforced in app code, isSafeMetadata).
--   • processed_webhook_events is the idempotency ledger: RLS enabled with NO policies, so it is
--     service-role-only (no anon/authenticated access). A duplicate Stripe delivery hits the
--     primary-key conflict and is skipped.
--   • Entitlement ids are deterministic (derived from the Stripe session id), so re-provisioning a
--     duplicated checkout.session.completed conflicts on the primary key and never double-grants.
--
-- Idempotent (IF NOT EXISTS + DROP POLICY IF EXISTS) so a reviewer can re-apply safely.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.commercial_entitlements (
  id text primary key,
  schema_version integer not null default 1,
  owner_user_id uuid not null,
  product text not null,
  capabilities text[] not null default '{}',
  source text not null,
  status text not null,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  expires_at timestamptz,
  canceled_at timestamptz,
  revoked_at timestamptz,
  refunded_at timestamptz,
  disputed_at timestamptz,
  external_provider text,
  external_customer_ref text,
  external_transaction_ref text,
  external_subscription_ref text,
  metadata jsonb,
  updated_at timestamptz not null default now(),
  constraint commercial_entitlements_product_valid
    check (product in ('initial_direction', 'roadmap_pass', 'build_monthly', 'growth_monthly', 'founding_lifetime')),
  constraint commercial_entitlements_source_valid
    check (source in ('purchase', 'subscription', 'promotion', 'administrative', 'migration')),
  constraint commercial_entitlements_status_valid
    check (status in ('pending', 'active', 'expired', 'canceled', 'revoked', 'refunded', 'disputed'))
);

create index if not exists commercial_entitlements_owner_idx
  on public.commercial_entitlements (owner_user_id);

alter table public.commercial_entitlements enable row level security;

-- Owner-scoped policies (signed-in user manages only their own rows). The service-role webhook
-- bypasses RLS and does not depend on these.
drop policy if exists "commercial_entitlements_select_own" on public.commercial_entitlements;
create policy "commercial_entitlements_select_own"
  on public.commercial_entitlements for select
  using (auth.uid() = owner_user_id);

drop policy if exists "commercial_entitlements_insert_own" on public.commercial_entitlements;
create policy "commercial_entitlements_insert_own"
  on public.commercial_entitlements for insert
  with check (auth.uid() = owner_user_id);

drop policy if exists "commercial_entitlements_update_own" on public.commercial_entitlements;
create policy "commercial_entitlements_update_own"
  on public.commercial_entitlements for update
  using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "commercial_entitlements_delete_own" on public.commercial_entitlements;
create policy "commercial_entitlements_delete_own"
  on public.commercial_entitlements for delete
  using (auth.uid() = owner_user_id);

-- ── Webhook idempotency ledger (service-role only; RLS enabled, no policies) ──────────
create table if not exists public.processed_webhook_events (
  event_id text primary key,
  event_type text,
  processed_at timestamptz not null default now()
);

alter table public.processed_webhook_events enable row level security;
-- Intentionally NO policies: anon/authenticated have no access; only the service-role key (which
-- bypasses RLS) reads/writes this idempotency ledger.
