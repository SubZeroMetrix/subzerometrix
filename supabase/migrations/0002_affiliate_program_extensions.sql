-- Additional affiliate program fields for compliance and management

alter table affiliate_programs add column if not exists payout_threshold text;
alter table affiliate_programs add column if not exists geographic_limitations text;
alter table affiliate_programs add column if not exists paid_search_restrictions text;
alter table affiliate_programs add column if not exists trademark_bidding_restrictions text;
alter table affiliate_programs add column if not exists coupon_restrictions text;
alter table affiliate_programs add column if not exists email_marketing_restrictions text;
alter table affiliate_programs add column if not exists disclosure_requirements text;
alter table affiliate_programs add column if not exists brand_asset_permissions text;
alter table affiliate_programs add column if not exists last_verified_date date;
alter table affiliate_programs add column if not exists source_url text;
alter table affiliate_programs add column if not exists internal_notes text;

-- Scoring model columns on products
alter table products add column if not exists user_fit_score numeric(3,1);
alter table products add column if not exists commercial_opportunity_score numeric(3,1);
alter table products add column if not exists editorial_confidence numeric(3,1);
alter table products add column if not exists verification_freshness numeric(3,1);

-- Ensure verification_records is admin-only (no public policies exist)
-- Add index for faster lookup
create index if not exists idx_verification_entity on verification_records(entity_type, entity_id);
create index if not exists idx_click_events_link on affiliate_click_events(affiliate_link_id);
create index if not exists idx_lead_signups_email on lead_signups(email);
