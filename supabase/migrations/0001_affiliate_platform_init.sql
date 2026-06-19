-- SubZero Metrix Affiliate Platform — Initial Schema
-- All tables use RLS. Public users cannot modify editorial or product data.

-- ============================================================
-- Products
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category text not null default '',
  website_url text not null default '',
  logo_url text,
  best_for text,
  poor_fit_for text,
  strengths text[] default '{}',
  limitations text[] default '{}',
  pricing_note text,
  free_plan_or_trial boolean not null default false,
  setup_complexity text not null default 'moderate' check (setup_complexity in ('easy', 'moderate', 'advanced')),
  editorial_score numeric(3,1),
  verification_source text,
  last_verified_date date,
  next_review_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;
create policy "products_public_read" on products for select using (is_active = true);

-- ============================================================
-- Product Categories
-- ============================================================
create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true
);

alter table product_categories enable row level security;
create policy "categories_public_read" on product_categories for select using (is_active = true);

-- ============================================================
-- Product Use Cases
-- ============================================================
create table if not exists product_use_cases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  use_case_slug text not null,
  use_case_name text not null,
  relevance_score integer not null default 50
);

alter table product_use_cases enable row level security;
create policy "use_cases_public_read" on product_use_cases for select using (true);

-- ============================================================
-- Affiliate Programs
-- ============================================================
create table if not exists affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  affiliate_network text,
  commission_type text not null default 'one-time' check (commission_type in ('recurring', 'one-time', 'tiered', 'hybrid')),
  commission_display_text text,
  recurring_duration text,
  cookie_duration text,
  approval_status text not null default 'not_applied' check (approval_status in ('approved', 'pending', 'rejected', 'not_applied')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table affiliate_programs enable row level security;
create policy "affiliate_programs_public_read" on affiliate_programs for select using (is_active = true);

-- ============================================================
-- Affiliate Links
-- ============================================================
create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  affiliate_program_id uuid references affiliate_programs(id) on delete set null,
  slug text unique not null,
  destination_url text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table affiliate_links enable row level security;
create policy "affiliate_links_public_read" on affiliate_links for select using (is_active = true);

-- ============================================================
-- Product Comparisons
-- ============================================================
create table if not exists product_comparisons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  product_a_id uuid not null references products(id) on delete cascade,
  product_b_id uuid not null references products(id) on delete cascade,
  best_for_a text,
  best_for_b text,
  summary text,
  last_verified_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table product_comparisons enable row level security;
create policy "comparisons_public_read" on product_comparisons for select using (is_active = true);

-- ============================================================
-- Editorial Reviews
-- ============================================================
create table if not exists editorial_reviews (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  product_id uuid not null references products(id) on delete cascade,
  title text not null,
  summary text,
  body_content text,
  editorial_score numeric(3,1),
  pros text[] default '{}',
  cons text[] default '{}',
  verdict text,
  last_reviewed_date date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table editorial_reviews enable row level security;
create policy "reviews_public_read" on editorial_reviews for select using (is_published = true);

-- ============================================================
-- Verification Records
-- ============================================================
create table if not exists verification_records (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('product', 'comparison', 'review', 'affiliate_link')),
  entity_id uuid not null,
  verified_by text,
  verification_source text,
  verified_date date not null default current_date,
  notes text
);

alter table verification_records enable row level security;
-- No public read — admin only

-- ============================================================
-- Tool Finder Questions
-- ============================================================
create table if not exists tool_finder_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  question_key text unique not null,
  display_order integer not null default 0,
  is_active boolean not null default true
);

alter table tool_finder_questions enable row level security;
create policy "questions_public_read" on tool_finder_questions for select using (is_active = true);

-- ============================================================
-- Tool Finder Answers
-- ============================================================
create table if not exists tool_finder_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references tool_finder_questions(id) on delete cascade,
  answer_text text not null,
  answer_value text not null,
  display_order integer not null default 0
);

alter table tool_finder_answers enable row level security;
create policy "answers_public_read" on tool_finder_answers for select using (true);

-- ============================================================
-- Tool Finder Rules
-- ============================================================
create table if not exists tool_finder_rules (
  id uuid primary key default gen_random_uuid(),
  conditions jsonb not null default '{}',
  primary_product_id uuid not null references products(id) on delete cascade,
  secondary_product_id uuid references products(id) on delete set null,
  reasoning text,
  is_active boolean not null default true
);

alter table tool_finder_rules enable row level security;
create policy "rules_public_read" on tool_finder_rules for select using (is_active = true);

-- ============================================================
-- Lead Signups
-- ============================================================
create table if not exists lead_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  use_case text,
  source text,
  consent_given boolean not null default false,
  consent_text text,
  consent_timestamp timestamptz,
  created_at timestamptz not null default now()
);

alter table lead_signups enable row level security;
-- No public read/write — server-side only via service role

-- ============================================================
-- Affiliate Click Events
-- ============================================================
create table if not exists affiliate_click_events (
  id uuid primary key default gen_random_uuid(),
  affiliate_link_id uuid references affiliate_links(id) on delete set null,
  click_timestamp timestamptz not null default now(),
  source_page text,
  campaign text,
  tool_finder_result boolean not null default false,
  ip_hash text,
  user_agent_hash text
);

alter table affiliate_click_events enable row level security;
-- No public read — admin/analytics only

-- ============================================================
-- Consent Records
-- ============================================================
create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  consent_type text not null check (consent_type in ('necessary', 'analytics', 'marketing')),
  granted boolean not null default false,
  timestamp timestamptz not null default now(),
  ip_hash text
);

alter table consent_records enable row level security;
-- No public read — compliance/audit only

-- ============================================================
-- Content Pages
-- ============================================================
create table if not exists content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body_content text,
  meta_description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table content_pages enable row level security;
create policy "pages_public_read" on content_pages for select using (is_published = true);

-- ============================================================
-- Contact Submissions
-- ============================================================
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;
-- No public read — admin only

-- ============================================================
-- Admin Profiles
-- ============================================================
create table if not exists admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table admin_profiles enable row level security;
create policy "admin_read_own" on admin_profiles for select using (auth.uid() = user_id);

-- ============================================================
-- Seed Products
-- ============================================================
insert into products (slug, name, description, category, website_url, best_for, poor_fit_for, strengths, limitations, pricing_note, free_plan_or_trial, setup_complexity) values
  ('systeme-io', 'Systeme.io', 'All-in-one platform for online business: funnels, email, courses, memberships, and affiliate management.', 'all-in-one', 'https://systeme.io', 'Solo entrepreneurs who want one platform for funnels, email, courses, and selling digital products without juggling multiple tools.', 'Teams needing advanced CRM, deep e-commerce inventory, or enterprise integrations.', '{"Generous free plan","Built-in funnel builder","Email marketing included","Course and membership hosting","Affiliate program management"}', '{"Limited design customization","Fewer third-party integrations","Basic analytics compared to specialists"}', 'Free plan available. Paid plans start at $27/month.', true, 'easy'),
  ('mailerlite', 'MailerLite', 'Email marketing platform with automation, landing pages, and a website builder for growing audiences.', 'email-marketing', 'https://mailerlite.com', 'Creators and small businesses starting email marketing who want clean design, easy automation, and a generous free tier.', 'Businesses needing advanced CRM, complex multi-channel automation, or enterprise deliverability controls.', '{"Clean intuitive interface","Generous free plan up to 1,000 subscribers","Built-in website and landing page builder","Solid automation workflows","Good deliverability reputation"}', '{"Limited advanced segmentation","No built-in CRM","Template variety is moderate"}', 'Free up to 1,000 subscribers. Paid plans start at $10/month.', true, 'easy'),
  ('kinsta', 'Kinsta', 'Premium managed WordPress hosting powered by Google Cloud with high performance and expert support.', 'hosting', 'https://kinsta.com', 'WordPress site owners who want fast, reliable managed hosting with expert support and automated backups.', 'Budget-conscious beginners or those not using WordPress.', '{"Google Cloud infrastructure","Automatic daily backups","Free SSL and CDN","Expert WordPress support","Staging environments"}', '{"Higher price point than shared hosting","WordPress only","No email hosting included"}', 'Plans start at $35/month for managed WordPress hosting.', false, 'moderate'),
  ('getresponse', 'GetResponse', 'Email marketing and automation platform with conversion funnels, webinars, and landing pages.', 'email-marketing', 'https://getresponse.com', 'Marketers who need email automation combined with webinars, funnels, and landing pages in one platform.', 'Users who only need simple newsletters without marketing automation features.', '{"Email and marketing automation","Built-in webinar hosting","Conversion funnel builder","Landing page creator","Good list segmentation"}', '{"Interface can feel complex for beginners","Webinar feature limited on lower tiers","Template editor could be more flexible"}', 'Free plan available for up to 500 contacts. Paid plans start at $19/month.', true, 'moderate'),
  ('kit', 'Kit (formerly ConvertKit)', 'Email marketing platform built for creators with visual automations, landing pages, and paid subscriptions.', 'email-marketing', 'https://kit.com', 'Content creators, writers, and course sellers who want subscriber-first email marketing with paid newsletter support.', 'E-commerce businesses needing product catalog integration or teams wanting complex multi-channel campaigns.', '{"Built for creators","Visual automation builder","Paid newsletter and tip jar features","Clean subscriber management","Good deliverability"}', '{"Limited email template design options","No built-in CRM","Fewer integrations than larger platforms"}', 'Free plan for up to 10,000 subscribers (limited features). Paid plans start at $25/month.', true, 'easy'),
  ('beehiiv', 'beehiiv', 'Newsletter platform with built-in growth tools, monetization, and analytics designed for newsletter operators.', 'newsletter', 'https://beehiiv.com', 'Newsletter creators who want growth tools, ad monetization, referral programs, and audience analytics built in.', 'Businesses needing full marketing automation, CRM, or e-commerce beyond newsletters.', '{"Newsletter-specific growth tools","Built-in ad network monetization","Referral program system","Clean writing experience","Custom website with SEO support"}', '{"Focused on newsletters only","Limited marketing automation","Younger platform with evolving features"}', 'Free plan available. Paid plans start at $49/month.', true, 'easy'),
  ('activecampaign', 'ActiveCampaign', 'Email marketing, automation, and CRM platform for businesses that need advanced multi-channel customer journeys.', 'email-marketing', 'https://activecampaign.com', 'Growing businesses that need deep automation, CRM integration, and multi-channel marketing in a single platform.', 'Beginners looking for a simple email newsletter tool or very small lists.', '{"Powerful automation builder","Built-in CRM","Advanced segmentation and personalization","Multi-channel marketing","Extensive integrations"}', '{"Steeper learning curve","More expensive than simpler alternatives","CRM is mid-tier compared to dedicated CRM tools"}', 'Plans start at $29/month. No free plan; 14-day free trial available.', false, 'advanced'),
  ('shopify', 'Shopify', 'E-commerce platform for building online stores with payments, inventory, shipping, and multichannel selling.', 'ecommerce', 'https://shopify.com', 'Anyone selling physical or digital products who wants a complete, reliable e-commerce platform with payment processing.', 'Content-only sites, blogs, or businesses that do not sell products directly.', '{"Complete e-commerce solution","Built-in payment processing","Huge app ecosystem","Multichannel selling","Reliable and scalable"}', '{"Transaction fees on third-party gateways","Template customization has limits without coding","Monthly costs add up with apps"}', 'Plans start at $39/month. 3-day free trial available.', false, 'moderate'),
  ('semrush', 'Semrush', 'All-in-one SEO and digital marketing toolkit for keyword research, site audits, competitor analysis, and content planning.', 'seo', 'https://semrush.com', 'Marketers and business owners serious about SEO who need keyword research, competitor analysis, and site auditing tools.', 'Beginners on a tight budget or businesses not yet focused on organic search growth.', '{"Comprehensive keyword research","Competitor analysis","Site audit tools","Content marketing toolkit","Backlink analysis"}', '{"Premium pricing","Can be overwhelming for beginners","Some features require higher-tier plans"}', 'Plans start at $139.95/month. 7-day free trial available.', false, 'advanced'),
  ('instantly', 'Instantly', 'Cold email outreach and lead generation platform for B2B sales teams with unlimited email accounts and warmup.', 'outreach', 'https://instantly.ai', 'B2B sales teams and agencies running cold email campaigns who need unlimited email accounts and deliverability tools.', 'Newsletter senders, e-commerce businesses, or anyone not doing outbound B2B prospecting.', '{"Unlimited email accounts","Built-in email warmup","Campaign analytics","Lead database access","Simple campaign builder"}', '{"Focused only on cold outreach","No marketing automation","Deliverability depends on domain reputation management"}', 'Plans start at $37/month for outreach features.', false, 'moderate')
on conflict (slug) do nothing;

-- Seed Categories
insert into product_categories (slug, name, description, display_order) values
  ('all-in-one', 'All-in-One Platforms', 'Complete business platforms combining multiple tools.', 1),
  ('email-marketing', 'Email Marketing', 'Platforms for email campaigns, automation, and list management.', 2),
  ('hosting', 'Web Hosting', 'Website hosting solutions for performance and reliability.', 3),
  ('newsletter', 'Newsletter Platforms', 'Tools for publishing and monetizing email newsletters.', 4),
  ('ecommerce', 'E-Commerce', 'Online store builders and e-commerce platforms.', 5),
  ('seo', 'SEO Tools', 'Search engine optimization research and auditing tools.', 6),
  ('outreach', 'Outreach & Sales', 'Cold outreach and B2B lead generation tools.', 7)
on conflict (slug) do nothing;
