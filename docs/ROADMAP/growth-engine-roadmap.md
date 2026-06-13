# Growth Engine Roadmap — SubZeroMetrix™

**Status:** Planning / roadmap only. Nothing in this document is built yet. No app
behavior, scoring, roadmap logic, payment, or gating changes from recording it.

Owner/operator: **The Modern Trades Mentor LLC**. Branding uses **SubZeroMetrix™** and
**MetrixScore™** (™, not ®, unless federal registration is confirmed).

## Confirmed launch states (initial 6)

| State | Code |
|-------|------|
| Florida | FL |
| Colorado | CO |
| Texas | TX |
| Arizona | AZ |
| Ohio | OH |
| North Carolina | NC |

These six are the planned initial footprint for all organic discovery, AI discovery,
and state/trade content work below.

---

## Growth-1 — Organic Discovery Foundation

Lay the search/discovery foundation so contractors in the launch states can find
SubZeroMetrix™ organically. (See also `growth-1-organic-discovery.md`.)

- `sitemap.xml`
- `robots.txt`
- Metadata audit (titles, descriptions, per-page)
- Canonical URLs
- Open Graph / social metadata
- Structured-data foundation
- Public resource/tool preview page framework (honest previews, no paywall bypass)
- Google Search Console setup documentation
- Future state / trade / resource SEO page plan
- Six-state support (FL, CO, TX, AZ, OH, NC)
- **No thin, duplicate, or doorway pages** — every page must carry genuine, useful content.

## Growth-1B — Keyword + Search Intent Foundation

A source-of-truth keyword/intent system that the discovery pages are built from.

- Source-of-truth keyword system (one place all pages reference)
- Startup intent keywords
- Readiness / assessment intent keywords
- Pricing / job-costing intent keywords
- Lead follow-up / sales intent keywords
- Operations / first-hire intent keywords
- State/trade query mapping for FL, CO, TX, AZ, OH, NC
- 10-trade query mapping
- **No keyword stuffing; no thin duplicate pages.**

## Broad "How to Start a Business" Search Intent Layer (extends Growth-1B + Growth-2)

**Goal:** do not make SubZeroMetrix™ discovery exclusive to the initial 10 contractor
trades. Add a broader business-startup search-intent layer to capture, educate, and
track users researching business startup generally — then use that demand data to
identify future industries, trades, and verticals to expand into under The Modern
Trades Mentor LLC ecosystem.

**Honesty:** SubZeroMetrix™ stays clear that its **current strongest focus is
contractors, trades, and service businesses.** Broad business-startup content is
**educational discovery + routing** content. **Do not claim the platform fully
supports every industry unless that support is actually built.**

### Broad keyword / search-intent clusters

**1. General business startup intent**
- how to start a business
- how to start a small business
- business startup checklist
- small business startup checklist
- new business checklist
- business launch checklist
- startup roadmap for small business
- how to know if I am ready to start a business
- business readiness assessment
- business readiness score
- small business readiness checklist
- business setup checklist
- steps to start a business
- what do I need to start a business

**2. State-based business startup intent**
- how to start a business in Florida / Colorado / Texas / Arizona / Ohio / North Carolina
- small business startup checklist Florida
- small business startup checklist Texas
- business launch checklist by state

**3. Service-business startup intent**
- how to start a service business
- home service business startup checklist
- local service business startup checklist
- field service business startup
- service contractor business checklist
- one-person service business startup
- first-time business owner checklist
- solo operator business checklist

**4. Readiness / self-assessment intent**
- am I ready to start a business
- business readiness test
- business readiness assessment
- startup readiness checklist
- small business readiness score
- business launch readiness
- do I have what I need to start a business

**5. Expansion-discovery intent** (broad searches that may reveal future verticals)
- how to start a cleaning business
- how to start a landscaping business
- how to start a handyman business
- how to start a painting business
- how to start a roofing company
- how to start a restoration business
- how to start a home service business
- how to start a contractor business
- how to start a trade business

### Implementation ideas (future — not built yet)
- A keyword source-of-truth file such as `src/lib/searchIntentKeywords.ts`.
- An `intentType` field, one of:
  `general_business_startup` · `state_business_startup` · `trade_business_startup` ·
  `service_business_startup` · `readiness_assessment` · `pricing_readiness` ·
  `lead_generation` · `first_hire` · `vendor_setup` · `future_vertical_discovery`.

### Tracking fields (future analytics)
`search_intent_type` · `keyword_cluster` · `state` · `trade` · `business_type` ·
`user_selected_industry` · `assessment_started_from_keyword` ·
`assessment_completed_from_keyword` · `report_unlocked_from_keyword` ·
`dashboard_returned_from_keyword` · `referral_created_from_keyword`.

### Future public page strategy
- `/how-to-start-a-business`
- `/business-startup-checklist`
- `/business-readiness-assessment`
- `/small-business-readiness-score`
- `/state/florida/how-to-start-a-business`
- `/state/texas/how-to-start-a-business`
- `/state/colorado/how-to-start-a-business`
- `/state/arizona/how-to-start-a-business`
- `/state/ohio/how-to-start-a-business`
- `/state/north-carolina/how-to-start-a-business`
- `/service-business-startup-checklist`
- `/contractor-business-startup-checklist`
- `/trade-business-launch-roadmap`

### Routing rules
- Broad business-startup pages explain general readiness concepts.
- CTAs route users into the SubZeroMetrix™ assessment.
- If a user selects a contractor / trade / service-business path, personalize accordingly.
- If a user is outside the current supported trades, be honest:
  > "SubZeroMetrix™ is currently strongest for contractors, trades, and service businesses. You can still use the readiness framework, but some recommendations may be less industry-specific."

### Guardrails
- No claim that SubZeroMetrix™ fully supports every business type yet.
- No fake industry expertise.
- No thin duplicate pages.
- No doorway pages.
- No keyword stuffing.
- No guaranteed ranking claims.
- No guaranteed business success claims.
- No legal / tax / financial advice claims.
- State pages should direct users to official resources where appropriate.
- Broad pages should be useful, educational, and clear.

### Strategic reason
This attracts broader startup demand while analytics reveal which verticals, states,
trades, and service-business categories should become future expansion opportunities
under The Modern Trades Mentor LLC ecosystem.

## Growth-2 — AI Answer Engine Discovery Foundation

**Goal:** make SubZeroMetrix™ easier for AI search/chat platforms to discover,
understand, cite, and recommend when users ask about starting or improving a
contractor business — without manipulation.

- AI-readable site guide (e.g. `llms.txt`) if appropriate
- Brand/entity pages for **SubZeroMetrix™**, **MetrixScore™**, and **The Modern Trades Mentor LLC**
- Public FAQ / answer pages for contractor-startup questions
- Crawlable state/trade resource pages
- Structured data / JSON-LD
- Citation-friendly resource pages
- Clear source / disclaimer sections
- Internal linking between resources, assessment, state pages, and trade pages
- Metadata optimized for AI/search understanding

**Target query themes** (content topics, not ranking promises):
- how to start an HVAC business in Florida
- how to start a plumbing business in Texas
- electrical contractor business startup checklist Colorado
- contractor business readiness assessment Arizona
- pricing readiness checklist for contractors Ohio
- contractor business launch roadmap North Carolina
- contractor startup checklist
- business readiness score for contractors
- trade business launch roadmap

## Growth-2B — General Business Starter Information Package

**Status: foundation built** — public page at `/general-business-starter`
(`src/lib/generalBusinessStarter.ts`, `src/app/general-business-starter/page.tsx`); see
`general-business-starter-package.md`. Future improvements (per-state pages,
interactive checklist tracking, expanded analytics) remain planned below.

**Goal:** give value to visitors arriving through broad "how to start a business" /
"business startup checklist" intent, even when they are not in a supported
contractor/trade category — capture general startup demand, educate, route relevant
users into contractor/service paths, and collect future-expansion signals.

**Honesty rule (required on every page):**
> "SubZeroMetrix™ is currently strongest for contractors, tradespeople, and
> service-business owners. This general business starter package is educational and
> may be less industry-specific."
Do **not** claim SubZeroMetrix™ fully supports every industry yet.

### Package contents
- General Business Startup Checklist
- Business Readiness Self-Check
- Business Setup Basics
- Legal / tax / licensing disclaimer + official-resource routing
- Financial Readiness Checklist
- Pricing and Revenue Basics
- Customer Acquisition Basics
- Operations and Systems Basics
- First-Hire Readiness Basics
- Vendor / Tool Readiness Basics
- 30-Day Startup Action Plan
- CTA to take the SubZeroMetrix™ assessment
- Routing into contractor / trade / service-business paths when relevant

### Future page ideas
`/how-to-start-a-business` · `/business-startup-checklist` · `/general-business-starter` ·
`/business-readiness-assessment` · `/small-business-readiness-score`

### Future analytics fields
`user_selected_industry` · `business_type` · `startup_stage` ·
`general_business_starter_viewed` · `general_business_checklist_started` ·
`general_business_checklist_completed` · `routed_to_contractor_path` ·
`routed_to_service_business_path` · `unsupported_industry_selected` ·
`future_vertical_interest`

### Guardrails
- Educational only.
- No legal advice; no tax advice; no financial advice; no licensing advice.
- No guaranteed business success; no guaranteed leads.
- No claim of full industry support; no fake industry expertise.
- No thin duplicate pages; no doorway pages; no keyword stuffing.
- State-specific pages should direct users to official state/local sources where appropriate.

**Placement:** after Growth-2 (AI Answer Engine Discovery Foundation), before Growth-3
(Product-Led Sharing + Referral Engine). Preserves the strongest contractor/trade/
service-business positioning while serving broad startup visitors.

## Growth-3 — Product-Led Sharing + Referral Engine

- Shareable Starter MetrixScore™ snapshot
- Shareable public tool/resource links
- Referral source tracking
- "Invite another contractor" prompt
- Referral code / link model
- Post-results share prompt
- Post-progress share prompt
- Analytics for referral creation and referral conversion

## Growth-4 — Customer Proof / Review Engine

(Consolidates `customer-proof-review-engine.md` — that item remains planned.)

- In-app feedback checkpoints
- Testimonial permission capture
- Case-study candidate capture
- Ethical public review routing
- Negative feedback routed to support / product improvement
- Consent tracking
- **No fake reviews; no incentivized review manipulation.**

## Growth-5 — Partner / Vendor / Association Distribution System

**Status: active foundation built** — public `/partners` page with an active local-device
partner-interest form; channel types, fit, outreach templates, and shareable assets
(`src/lib/partnerDistribution.ts`). See `partner-vendor-association-distribution-system.md`.
Confirmed-partner directory, CRM/email, and co-marketing remain future.


- Partner / co-marketing readiness page plan
- Vendor outreach tracker
- Association / trade-school outreach assets
- Supply-house / contractor-coach resource links
- Embeddable public checklist / resource links
- Future vendor comparison pages **only when legally and business-safe**
- **No "partner / preferred / approved / vendor marketplace" language unless a relationship is verified.**

## Growth-6 — Acquisition + Activation Analytics

**Status: active foundation built** — device-local, privacy-respecting acquisition +
activation analytics (`src/lib/growthAnalytics.ts`, `GrowthEventTracker`,
`GrowthAnalyticsSummary`); no PII, no pixels, no third-party trackers. See
`acquisition-activation-analytics-foundation.md`. Account/cloud analytics and ad/CRM
integrations remain future (after auth + privacy/consent review).


Event roadmap (first-party; no claims of third-party tracking beyond what exists):
- `assessment_started`
- `assessment_completed`
- `results_viewed`
- `unlock_clicked`
- `checkout_started`
- `report_viewed`
- `dashboard_returned`
- `action_completed`
- `kpi_saved`
- `reassessment_completed`
- `resource_shared`
- `referral_created`
- `review_prompt_answered`

---

## Account-2 — Cloud Sync Activation Layer

**Status: roadmap / architecture only (not built; cloud sync is NOT live).** The
account-backed sync layer so user progress — checklist completion, roadmap actions, KPI
entries, feedback, partner interest, privacy-safe analytics, and the future Foundation
Builder — can move from device-local fallback to account-backed persistence. Builds on
the existing Mega-Phase 3 work (`account-sync-schema-plan.md`, `metrixCloudSync.ts`,
migration `001`, which are real but **not yet applied/wired**) and extends sync to the
still-local-only flows. Every synced flow must eventually show one honest status:
**Saved on this device** / **Synced to your account** / **Sync unavailable** /
**Sign in to back up progress** — never "synced" until a write is confirmed.

See `account-cloud-sync-activation-layer.md` (current-state audit, sync destinations,
RLS/ownership/migration/conflict architecture, UX standard, phases Account-2A–2K, and a
local-key → cloud-table audit).

**Sub-phase status:**
- **Account-2A — Cloud Sync Architecture + Migration Plan: built.** Architecture/contracts
  only — `cloud-sync-architecture-map.md`, `cloud-sync-migration-plan.md`, and
  `src/lib/syncContracts.ts`. No migration created, no schema change, no wired sync, no
  active "synced" claim.
- **Account-2B — Supabase Tables + RLS for Progress Records: built.** Migration
  `supabase/migrations/002_cloud_sync_progress_records.sql` — ten user-owned, RLS-protected,
  payload-first `cloud_sync_*` tables (owner-only `auth.uid() = user_id`; no public/anon
  read), an `updated_at` trigger, and `UNIQUE (user_id, local_id)`. Schema + RLS only — no
  writer wired, no "synced" claim. Privacy-sensitive tables (partner_interest = PII+free
  text; customer_feedback = free text; growth_events = non-PII by design) need a privacy
  review before wiring.
- **Account-2C — Sync Status UI: built.** `src/components/SyncStatusBadge.tsx` + three pure
  helpers in `syncContracts.ts` (`sync-status-ui-component.md`). Presentational only —
  defaults to "Saved on this device"; "Synced to your account" renders only when explicitly
  passed (after a confirmed write). Placed on `/dashboard`, `/report`, `/results`, all
  passing device-local status. No Supabase writes, no sign-in flow added.
- **Account-2D — Assessment / MetrixScore™ History Sync: built.** First active sync flow,
  scoped to `cloud_sync_assessment_history` + `cloud_sync_score_history` only
  (`src/lib/assessmentHistorySync.ts`; `assessment-score-history-sync.md`). Structured,
  non-PII, non-free-text data only. Local-first fallback preserved; "Synced to your account"
  only after a confirmed write; missing migration/table → "Sync unavailable" with local
  intact. Wired into `/results` and `/dashboard` badges. Migration `002` must be applied
  before live sync works.
- **Account-2E — Roadmap Action + KPI Sync: built.** Same local-first, confirmed-write-only
  pattern for `cloud_sync_roadmap_action_progress` + `cloud_sync_kpi_entries`
  (`src/lib/roadmapKpiSync.ts`; `roadmap-kpi-sync.md`). Structured, no-PII data only (KPI
  `note` is the user's own low-risk private note). Wired into `/dashboard` (roadmap + KPI)
  and `/report` (roadmap). Local-first preserved; "Synced to your account" only after a
  confirmed write; migration `002` must be applied for live sync.
- **Account-2F — Feedback / Customer Proof Sync: built (privacy-gated).** First flow to
  touch a free-text field. `cloud_sync_customer_feedback` only (`src/lib/customerFeedbackSync.ts`;
  `customer-feedback-sync.md`). A privacy gate preserves consent flags and skips records
  whose comment looks like a secret/credential; skipped records stay local-only and are
  counted (never claims "all feedback synced"). No publishing, no reviews, no incentives.
  Wired into `/dashboard` + `/report` by the consent-first prompt. Local-first preserved;
  migration `002` must be applied for live sync.
- **Account-2G — Partner Interest Sync: built (consent-gated).** Highest-PII surface.
  `cloud_sync_partner_interest` only (`src/lib/partnerInterestSync.ts`;
  `partner-interest-sync.md`). Strict consent gate — a record syncs **only** when
  `consentToContact === true`; non-consented or secret-like-note records are skipped
  (kept local-only, counted; never "all partner interest synced"). Private backup only —
  no outreach/CRM/public listing. Wired into `PartnerInterestForm` (`/partners`).
  Local-first preserved; migration `002` must be applied for live sync.
- **Account-2H — Growth Analytics Privacy-Safe Sync: built.** `cloud_sync_growth_events`
  only (`src/lib/growthAnalyticsSync.ts`; `growth-analytics-sync.md`). Strict whitelist
  payload (structured non-PII fields only; free-form `metadata` never synced) plus a skip
  gate for free-text/PII-looking events; skipped events stay local-only and are counted
  (never "all activity synced"). No third-party analytics/cookies/pixels/retargeting.
  Wired into `/dashboard` by the activity summary. Local-first preserved; migration `002`
  must be applied for live sync.
- **Account-2I — Foundation Builder Sync Readiness: built (readiness only).** Cloud-ready,
  local-first plumbing for `cloud_sync_foundation_builder_progress` + `cloud_sync_vendor_tool_tracker`
  + `cloud_sync_launch_readiness_progress` (`src/lib/foundationBuilderSync.ts`;
  `foundation-builder-sync.md`). No Foundation Builder UI/feature built (that is Product-5);
  no live local data source yet, so it backs up nothing and claims nothing today. Free-text
  notes screened for secrets; vendor references store URLs only, never credentials. Syncs
  with no further wiring once Product-5 populates the local model.
- **Product-5A — Foundation Builder Data Model: built.** `src/lib/foundationBuilder.ts`
  (`product-5a-foundation-builder-data-model.md`) — 5 sections, 14 categories, starter step
  catalog, stages (start_here/do_this_next/later/done/blocked) + status + priority +
  completion model, pure helpers, SSR-safe storage (`szm_foundation_builder`). Data model
  only, no UI; activates the Account-2I sync plumbing once items are saved.
- **Product-5B — In-App Foundation Checklist: built.** `src/components/FoundationBuilderChecklist.tsx`
  at `/foundation-builder` (+ dashboard entry card) — renders the 5A model, stage controls
  (start_here/do_this_next/later/done/blocked), local notes, progress summary, next step, and
  an honest `SyncStatusBadge`. UI only; local-first (`szm_foundation_builder`).
- **Product-5C — Device-Local Completion Tracking: built.** Items track `completedAt` +
  `blockedReason`; pure helpers `updateFoundationItem` / `completeFoundationItem` /
  `blockFoundationItem` / `getFoundationCompletionStats` / `getFoundationItemsByStage`; the
  checklist UI routes all changes through them (completed dates + blocked-reason input).
  Local-first only; no cloud expansion beyond Account-2I.
- **Product-5D — Dashboard Foundation Progress Summary: built.** Dashboard card surfaces
  completed/total/percent + blocked count + next recommended step (`getFoundationCompletionStats`
  + `getNextFoundationItem`), linking to `/foundation-builder`. Device-local read; no cloud
  expansion.
- **Product-5E — PDF/Excel Export: built.** Pure, dependency-free `foundationItemsToCsv` /
  `foundationItemsToPrintableHtml`; checklist UI adds Download CSV + Print/Save PDF
  (client-side, no deps). CSV anti-formula-injection + HTML escaping; user's own local
  progress only; pre-export no-secrets reminder.
- **Product-5F — Trade-Specific Foundation Steps: built.** `FoundationTrade` (reuses intake
  slugs) + trade-specific licensing/insurance steps for HVAC, electrical, plumbing, roofing,
  solar, construction, handyman, landscaping, cleaning, painting; helpers
  `getFoundationItemsByTrade` / `withTradeSteps` / `normalizeFoundationTrade`; checklist seeds
  from the user's intake trade, falls back to general core steps. Trade steps route to official
  state/local sources (educational, not advice).
- **Product-5G — State-Specific Official-Resource Routing: built.** Official-portal starting
  points for the 6 launch states (FL, CO, TX, AZ, OH, NC) on `officialSourceReminder` steps
  (legal/entity, tax/EIN, licensing) + federal EIN/GBP; `getFoundationStateResources` /
  `normalizeFoundationState`; reads intake `region`, generic verify-your-state fallback.
  Educational starting points only — not advice, no completeness/currency claim.
- **Product-5H — Spanish Foundation Builder: built.** Spanish UI-copy layer (`FoundationLang`,
  `getFoundationUiCopy`, language-aware labels) for the Foundation Builder interface
  (sections/stages/statuses/priorities/buttons/reminders/disclaimers); `FoundationBuilderChecklist`
  takes a `lang` prop (English default, Spanish via `lang="es"`). Step IDs/storage/saved
  notes not translated; explicit "not fully available in Spanish" note. No new route.
- **Product-5I — Account-Synced Foundation Progress: built.** The checklist calls the
  Account-2I sync helper after every local save; `SyncStatusBadge` shows the confirmed
  result. Local-first stays primary; "synced" only after a confirmed write; signed-out /
  unapplied-migration falls back to device-local. Foundation Builder progress (+ vendor/launch)
  only — no unrelated sync expansion. **Product-5 Foundation Builder track complete (5A–5I).**
- **Account-2J — Local-to-Cloud Migration + Conflict Handling: built.** `src/lib/syncConflict.ts`
  (pure newest-wins by id, `updatedAt ?? createdAt`) + a `reconcile*FromAccount` on every wired
  flow (2D–2I); see `local-to-cloud-migration-conflict-handling.md`. Recommendation-only —
  never overwrites local; tie/local-newer keeps local; writes stay additive/idempotent;
  skipped/PII records never reintroduced.
- **Account-2K — Data Export / Delete / Privacy Controls: built.** `src/lib/accountDataPrivacy.ts`
  + `/account/privacy` (dashboard "Manage my data" link). Export own rows from the ten
  `cloud_sync_*` tables as JSON; delete own rows via RLS owner-only with explicit confirmation;
  separate, explicitly-confirmed device-local clear. "All deleted" only when every table
  succeeds; auth-account deletion labeled admin-assisted (no service-role in browser).
  **Account-2 Cloud Sync Activation Layer complete (2A–2K).**

**Placement:** after Growth-6, before **Product-5 — Guided Business Foundation Builder**.
Required infrastructure before Product-5B/5C checklist tracking becomes a core feature.

**Guardrails:** do not claim sync is live unless built/tested/labeled; do not expose
Supabase secrets; do not weaken RLS; no PII/free-text sync without privacy review; no
invasive analytics; do not break local fallback; no change to payment/scoring/report
gating/dependencies/`.env.local`; no banned credit-score terminology.

---

## Quality-1 — Platform Quality, Trust, UX, and Customer Success Standard

**Status: roadmap / standard only (not a feature).** A platform operating standard every
future build is judged against — customer usefulness, simplicity, legal/trust safety,
cloud-sync readiness, measurable outcomes, and ethical growth. Core rule: SubZeroMetrix™
must stay an **execution system** (Assessment → Score → Roadmap → Action → Tracking →
Outcome → Re-scoring), **not a content library**. Includes the 8-question feature gate,
10 quality pillars (Simplicity, Cloud Sync, Trust/Legal, Customer Proof, Partner/Vendor,
Security/Privacy, Public Content, Spanish Expansion, Outcome Measurement, Feature Ranking),
a 1–5 × 8-axis feature-ranking rule, and the current top-priority ranking.

See `platform-quality-trust-ux-standard.md`.

**Placement:** after **Account-2 — Cloud Sync Activation Layer** and before **Product-5A**
(Guided Business Foundation Builder build work begins). Depends on Account-2 being on the
roadmap (it is).

**Guardrails:** standard only; educational only; no legal/tax/financial/licensing advice;
no guarantees; no fake reviews/partnerships; RLS + no exposed secrets; no invasive
tracking; no banned credit-score terminology.

---

## Product-5 — Guided Business Foundation Builder

**Status: roadmap only (not built).** A guided, trackable business-foundation checklist
inside the platform — step-by-step instructions, why each step matters, what "done"
looks like, official-source reminders, status/notes/priority/owner, and (future) export,
account sync, and trade/state-specific guidance. Turns SubZeroMetrix™ into a guided
execution system that improves **measurable readiness**, closing the
Assessment → Score → Roadmap → Action → Tracking → Outcome → Re-scoring loop.

See `guided-business-foundation-builder.md` (23 categories, item shape, Product-5A–5I
sub-phases) and `business-guidance-opportunity-map.md` (A–J guidance deep-dive + gaps).

**Placement:** after Growth-6, before the future **Growth-7 — Public Tool / Resource
Page Engine** (currently opportunity #3 in the Highest-Upside section below).

**Guardrails:** educational only; no legal/tax/financial/licensing advice; route to
official sources; no guarantee of approval/licensing/leads/revenue/rankings/success; no
cloud-sync claim unless built; no fake partner/affiliate claims.

## Growth guardrails (apply to every Growth phase)

- No fake backlinks.
- No fake reviews.
- No spam auto-posting.
- No doorway pages.
- No hidden AI prompt injection.
- No keyword stuffing.
- No claim that AI platforms will recommend us.
- No claim of guaranteed Google ranking.
- No claim of guaranteed leads.
- No "partner / preferred / approved / vendor marketplace" language unless relationships are verified.
- No legal, tax, or financial advice claims.
- Keep all content educational and practical.

---

## Highest-Upside / Lowest-Effort Market Distribution Systems

Research findings: the distribution systems that can push SubZeroMetrix™ into the
public ecosystem **ethically**, with the highest upside and the lowest manual
marketing burden. Prioritized.

### 1. AI / Search Discovery Foundation
- Crawler-friendly `robots.txt`
- Sitemap coverage
- Structured public pages
- Brand / entity page
- AI-readable site guide (e.g. `llms.txt`) if appropriate
- Citation-friendly state/trade guides
- Public FAQ / answer pages
- **No hidden AI prompt injection; no claim that AI platforms will recommend us.**

### 2. Keyword + Search Intent Foundation
- Source-of-truth keyword system
- Startup intent keywords
- Readiness / assessment intent keywords
- Pricing / job-costing intent keywords
- Lead follow-up / sales intent keywords
- Operations / first-hire intent keywords
- State/trade query mapping for FL, CO, TX, AZ, OH, NC
- 10-trade query mapping
- **No keyword stuffing; no thin duplicate pages.**

### 3. Public Tool / Resource Page Engine — **BUILT (Growth-7)**
Reusable engine shipped: `src/lib/publicResources.ts` (curated typed dataset, stable slugs,
audience + trade/state applicability, educational disclaimer, CTAs, metadata, structured-data
readiness), `src/components/ResourcePageView.tsx`, and routes `/learn` (index) + `/learn/[slug]`
(`generateStaticParams` over the curated set — no mass generation; `generateMetadata` with
canonical/OG/Twitter; Breadcrumb + FAQPage JSON-LD). Launch set: `starting-a-contractor-business`,
`contractor-startup-checklist`, `metrixscore-overview`, `foundation-builder-guide`. Each page
carries standalone educational value, an honest "what we support" section (strongest for
contractors/trades, not equal for every industry), official-source routing, and conversion
paths to `/start` + `/foundation-builder` + `/resources`. Added to `sitemap.ts`. No thin/doorway
pages, no private data.

**Expanded (search-intent engine):** model enriched (`secondaryIntents`, `contentType`,
`supportedTrades`/`supportedStates`, `indexable`/`published`, `structuredDataType`); added
`src/components/SupportedTrades.tsx` (reusable 10-trade callout), `/trades` overview, and three
new distinct-intent pages — `start-a-trade-business`, `start-a-home-service-business`,
`contractor-business-readiness`. One page owns one primary intent (close variants via
`secondaryIntents`); incomplete pages stay out of the sitemap/index via the flags. Full intent
map (groups A–H), supported trades, and prepared trade/state expansion in
`growth-7-search-intent-content-map.md`. No name-swap pages, no city/county pages, no guarantees,
no fake reviews/stats, regulated questions routed to official sources.

Future preview pages (candidates; build only with real content):
- Business setup checklist page
- Pricing readiness checklist page
- Google Business Profile checklist page
- Lead follow-up checklist page
- Sales script page
- Review request script page
- Vendor setup tracker page

### 4. Product-Led Sharing + Referral Engine
- Shareable Starter MetrixScore™ snapshot
- Shareable business-readiness insight
- Shareable public tool/resource links
- "Invite another contractor" prompt
- Referral source tracking
- Referral code / link model
- Post-results share prompt
- Post-progress share prompt

### 5. Customer Proof / Review Engine
- Feedback checkpoints
- Testimonial permission capture
- Case-study candidate capture
- Ethical review routing
- Negative feedback to support / product improvement
- **No fake reviews; no review incentives that violate platform rules; no positive-only review gating.**

### 6. Partner / Vendor / Association Distribution System
- Association outreach assets
- Trade-school resource assets
- Contractor-coach referral page
- Supply-house resource page
- Vendor co-marketing readiness page
- Embeddable checklist links
- **No partner / preferred / approved claims unless verified.**

### 7. Acquisition + Activation Analytics
Track: `assessment_started`, `assessment_completed`, `results_viewed`,
`unlock_clicked`, `checkout_started`, `report_viewed`, `dashboard_returned`,
`action_completed`, `kpi_saved`, `reassessment_completed`, `resource_shared`,
`referral_created`, `review_prompt_answered`, `testimonial_submitted`.

### Strategic principle
**Traffic alone is not the main success metric.** Measure qualified discovery,
assessment starts, report unlocks, returning dashboard users, referrals, reviews,
testimonials, partner leads, and reassessments.

### Guardrails
- No fake backlinks
- No fake reviews
- No spam auto-posting
- No doorway pages
- No hidden AI prompt injection
- No keyword stuffing
- No guaranteed ranking claims
- No guaranteed lead claims
- No fake local expertise
- No unsupported partner/vendor claims
- No legal / tax / financial advice claims

### Recommended placement (maps to the Growth phases above)
- **Growth-1** — Organic Discovery Foundation → opportunity 1, 3
- **Growth-1B** — Keyword + Search Intent Foundation → opportunity 2
- **Growth-2** — AI Answer Engine Discovery Foundation → opportunity 1
- **Growth-3** — Product-Led Sharing + Referral Engine → opportunity 4
- **Growth-4** — Customer Proof / Review Engine → opportunity 5
- **Growth-5** — Partner / Vendor / Association Distribution → opportunity 6
- **Growth-6** — Acquisition + Activation Analytics → opportunity 7

---

## Implementation sequencing

**Completed:**
- 4A — Outcome Plan + Score Explanation Engine
- 4B — Roadmap Progress + Action Tool Mapping
- 4C — Manual KPI Tracking + Progress Review

**Recommended next:**
1. Growth-1 — Organic Discovery Foundation
2. Growth-1B — Keyword + Search Intent Foundation
3. Growth-2 — AI Answer Engine Discovery Foundation
4. Growth-2B — General Business Starter Information Package
5. Spanish-1 — Spanish Public Discovery Layer (foundation built; `spanish-public-discovery-layer.md`)
6. Growth-3 — Product-Led Sharing + Referral Engine
7. Growth-4 — Customer Proof / Review Engine
8. Growth-5 — Partner / Vendor / Association Distribution System
9. Growth-6 — Acquisition + Activation Analytics
10. Account-2 — Cloud Sync Activation Layer (`account-cloud-sync-activation-layer.md`)
11. Quality-1 — Platform Quality, Trust, UX, and Customer Success Standard (`platform-quality-trust-ux-standard.md`)
12. Product-5 — Guided Business Foundation Builder (`guided-business-foundation-builder.md`)
13. Growth-7 — Public Tool / Resource Page Engine (**built** — `/learn` engine; `publicResources.ts`)
14. Growth-8 — Email Capture / Nurture Foundation (**built** — consent-first capture; `emailCapture.ts` + `EmailCaptureForm.tsx` + migration `003`; `growth-8-email-capture-nurture-foundation.md`)
15. Pre-Launch Audit-1A — Security, Privacy, Legal, Compliance, Trust (**finalized** — verdict **PASS WITH REQUIRED FIXES**, 0 blockers; Privacy Policy aligned at `15b7764`; `pre-launch-audit-1a-security-privacy-legal-trust.md` + `privacy-policy-future-readiness-audit.md`). Not to be re-run without a concrete new risk. Then 1B / 1C (`pre-launch-audit-system.md`).
16. Pre-Launch Fix-1 — **complete.** verify-session generic error (resolved, code); tier-preview vendor terminology (resolved — verified safe, `DO_NOT_CLAIM` guard + neutral copy); marketing-INSERT hardening (deployment/future). 0 active affiliate statuses. Deployment/manual verifications remain (apply `003`, prod RLS, checkout, export/delete, double opt-in before send, attorney review).
17. Pre-Launch Audit-1B — Product Quality, Blind Spots, and Ten-Trade Coverage (**next**)
18. Pre-Launch Audit-1C (`pre-launch-audit-system.md`)
19. Launch Readiness Final Pass (future)
