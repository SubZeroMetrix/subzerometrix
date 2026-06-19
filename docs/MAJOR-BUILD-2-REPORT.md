# Major Build 2 Report

## Branch and Commit
- Branch: major-build-1
- Previous commit: a3b8cd6 (Major Build 1)
- Rollback tag: pre-major-build-1 at 6cf8b4a

## Supabase
- Project: SubZeroMetrix's Project (vzbcunnrkexnmspeiwiu)
- Region: us-east-1
- Migrations applied:
  - 0001_affiliate_platform_init.sql — 17 tables, RLS, seed data
  - 0002_affiliate_program_extensions.sql — scoring columns, compliance fields, indexes
- RLS: enabled on all tables, public read for active products/categories/comparisons

## Admin
- Supabase auth with email allowlist
- Server-side role enforcement via middleware
- No service-role key in browser bundles
- Admin sections: products, affiliate programs, links, comparisons, tool finder rules, leads, contacts, click analytics, verification records

## Tool Finder
- 5-question deterministic flow
- Primary + secondary recommendations
- Reasoning, caveats, best-use-case, complexity, pricing
- Only active products recommended
- No AI-generated recommendations
- Anonymous — no PII collected without separate consent

## Affiliate Programs
- Database schema with full compliance fields
- Application status, approval status, commission terms, restrictions
- 4-score model: User Fit, Commercial Opportunity, Editorial Confidence, Verification Freshness
- Public rankings controlled by User Fit + Editorial Confidence
- No links activated without approval

## Email
- Lead signups stored in Supabase with consent
- Duplicate handling
- Rate limiting
- Source/use-case attribution
- BLOCKED: Outbound email delivery requires provider credentials

## Analytics and Consent
- 12-event taxonomy
- Consent banner (necessary/analytics/marketing)
- Traffic source classification (12 types including AI referrals)
- All features work without analytics consent
- No fingerprinting, session replay, or ad pixels

## AI/GEO Search
- robots.txt with per-crawler rules (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot)
- llms.txt and llms-full.txt
- IndexNow key and submission utility
- Google/Bing Search Console verification support
- Structured data: organization, website, person, breadcrumb

## Launch Content
- Best Online Business Software for Beginners
- Best Email Marketing Software for Beginners
- Best Website Platform for Starting an Online Business
- Editorial Methodology (4-score model)
- Author profile: Richard Fritzke
- 30-day publishing plan documented

## Stripe
- Server-side SDK, test-mode only
- Webhook handler with signature verification
- No live products, no live checkout, no payment collection
- Activation blocked until pricing/tax/refund approved

## Vercel
- Project linked: sub-zero-metrix/subzerometrix
- Framework: Next.js
- vercel.json with caching headers
- Preview deployment available after push

## Domain
- Provisional: subzerometric.com
- DNS change requires owner verification of exact domain spelling
- Do not change until preview validation passes

## Legal/Compliance
- FTC disclosures: complete
- Privacy policy: published
- Terms: published
- Editorial policy: published
- Non-endorsement disclaimer: on author profile
- Full compliance gate documented in docs/LEGAL-COMPLIANCE-GATE.md

## Blockers
1. Email delivery: requires provider credentials (MailerLite/GetResponse/Kit)
2. Affiliate link activation: requires vendor program approvals
3. Analytics provider: consent framework ready, no provider connected
4. Stripe activation: blocked until product/pricing/tax/refund approved
5. Domain DNS: requires owner to verify exact domain before cutover
6. Full WCAG 2.1 AA audit recommended
7. Legal review by qualified attorney recommended before commercial launch
