-- SubZeroMetrix — Schema v5: Affiliate Tracking & Compliance Tables
-- Run AFTER schema.sql and schema_v4_additions.sql
-- Adds the tables used by track-click, postback, and disclosure logging APIs

-- ── Referral clicks — every outbound affiliate link click ─────────────────────
create table if not exists referral_clicks (
  id                  uuid primary key default gen_random_uuid(),
  clicked_at          timestamptz default now(),

  -- User context
  user_id             uuid,                        -- null for anonymous
  session_id          text not null,

  -- What was clicked
  vendor_slug         text not null,               -- 'jobber', 'simply-business'
  vendor_category     text not null,               -- 'field-software', 'insurance'
  vendor_vertical     text not null,               -- 'saa', 'ins', 'bnk', 'frm', 'mkt'

  -- Where in the platform
  source_page         text,                        -- 'report', 'resources', 'roadmap'
  source_position     text,                        -- e.g. 'roadmap-step-3'
  placement_type      text default 'organic',      -- 'organic', 'affiliate', 'featured'

  -- Tracking
  subid               text not null,               -- SubID sent to partner
  full_tracking_url   text not null,               -- full URL with params

  -- User snapshot at time of click (denormalized for analytics)
  user_trade          text,
  user_state          text,
  user_score          integer,
  user_band           text,
  user_stage          text,

  -- UTM attribution
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,

  -- Compliance
  disclosure_shown    boolean not null default false,
  disclosure_text     text,
  disclosure_shown_at timestamptz
);

alter table referral_clicks enable row level security;
create index if not exists ref_clicks_subid_idx     on referral_clicks (subid);
create index if not exists ref_clicks_vendor_idx    on referral_clicks (vendor_slug);
create index if not exists ref_clicks_clicked_idx   on referral_clicks (clicked_at);
create index if not exists ref_clicks_session_idx   on referral_clicks (session_id);

-- Service role only — no public reads
-- (insert is done server-side via service role key in track-click route)

-- ── Referral conversions — S2S postbacks from partners ───────────────────────
create table if not exists referral_conversions (
  id                      uuid primary key default gen_random_uuid(),
  received_at             timestamptz default now(),

  -- Match back to click
  click_id                uuid references referral_clicks(id),
  subid                   text not null,
  vendor_slug             text,

  -- Conversion data
  conversion_type         text not null,           -- 'signup', 'account_open', 'policy_bound'
  conversion_value        numeric(10,2),           -- partner-reported value
  commission_owed         numeric(10,2),           -- calculated commission
  currency                text default 'USD',

  -- Partner's reference
  partner_order_id        text,
  partner_event_name      text,

  -- Postback verification
  postback_source         text,                    -- 's2s', 'pixel', 'api'
  postback_raw            jsonb,                   -- sanitized raw payload
  postback_verified       boolean default false,
  partner_ip              text,

  -- Status
  status                  text default 'received', -- received | verified | paid | disputed
  payout_date             date,

  -- Compliance
  regulated_data_received boolean default false,
  regulated_data_notes    text
);

alter table referral_conversions enable row level security;
create index if not exists ref_conv_subid_idx    on referral_conversions (subid);
create index if not exists ref_conv_click_idx    on referral_conversions (click_id);
create index if not exists ref_conv_vendor_idx   on referral_conversions (vendor_slug);
create index if not exists ref_conv_status_idx   on referral_conversions (status);

-- ── Disclosures log — immutable audit of every compliance disclosure shown ────
create table if not exists disclosures_log (
  id                  uuid primary key default gen_random_uuid(),
  logged_at           timestamptz default now(),

  user_id             uuid,
  session_id          text,
  vendor_slug         text,

  disclosure_type     text not null,               -- 'affiliate', 'insurance-routing', 'banking-routing'
  disclosure_text     text not null,               -- exact text shown (immutable)
  page_url            text,

  user_acknowledged   boolean default false,
  acknowledged_at     timestamptz
);

alter table disclosures_log enable row level security;
create index if not exists disc_log_session_idx  on disclosures_log (session_id);
create index if not exists disc_log_type_idx     on disclosures_log (disclosure_type);
create index if not exists disc_log_logged_idx   on disclosures_log (logged_at);

-- ── Analytics view — affiliate dashboard ─────────────────────────────────────
create or replace view affiliate_dashboard as
select
  date_trunc('day', rc.clicked_at)    as date,
  rc.vendor_vertical                   as vertical,
  rc.vendor_category                   as category,
  rc.vendor_slug                       as vendor,
  rc.user_state                        as state,
  rc.user_trade                        as trade,
  rc.user_band                         as score_band,
  rc.source_page                       as traffic_source,
  count(rc.id)                         as clicks,
  count(distinct rc.session_id)        as unique_sessions,
  count(conv.id)                       as conversions,
  round(count(conv.id)::numeric / nullif(count(rc.id), 0) * 100, 1) as conversion_rate_pct,
  sum(conv.commission_owed)            as commission_earned,
  sum(case when rc.disclosure_shown then 1 else 0 end) as disclosures_shown
from referral_clicks rc
left join referral_conversions conv on conv.click_id = rc.id
group by 1,2,3,4,5,6,7,8
order by date desc, clicks desc;
