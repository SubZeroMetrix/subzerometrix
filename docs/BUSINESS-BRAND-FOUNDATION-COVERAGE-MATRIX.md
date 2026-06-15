# Business Brand Foundation — Coverage Matrix

> Classification per the audit legend. "Where" = current location; "Canon" = canonical Metrix
> connection. Audit only — nothing changed/activated.

Legend: COMPLETE/UF · PARTIAL/UF · HIDDEN · DATA-MODEL · ROADMAP-RULE · RESOURCE-LINK ·
TEST/DOC · DUP · OUTDATED · MISSING · LEGAL-HELD · NEEDS-AUTH-SOURCE · NEEDS-HOSTED.

## A. Domain coverage (21 domains)

| # | Domain | Classification | Where (today) | Canon link | Recommended action |
| --- | --- | --- | --- | --- | --- |
| 1 | Brand strategy & market position | PARTIAL/UF | growthPhases (positioning narrative); tradeData | weak | Add brand-strategy questions + Positioning Builder |
| 2 | Company name foundation | PARTIAL/UF | foundationBuilder step "Decide your business name" (binary) | progress only | Add Company Name Scorecard + official search routing (NEEDS-AUTH-SOURCE for clearance) |
| 3 | Visual identity | PARTIAL/UF | foundationBuilder step "logo + colors" (binary) | progress only | Add asset checklist + Asset Completeness Tracker |
| 4 | Brand messaging & voice | MISSING | salesPlaybooks adjacency | none | Add Message Builder + script/template library |
| 5 | Business contact & credibility | PARTIAL/UF | foundationBuilder (email/domain), licensing intelligence | progress only | Add Identity Consistency Checker (NAP) |
| 6 | Website foundation | PARTIAL/UF | foundationBuilder steps (domain/website) | progress only | Add Website Readiness Audit tool |
| 7 | Google Business Profile | PARTIAL/UF | foundationBuilder "create + verify GBP"; growth phase 3 | progress only | Add GBP Checklist tool (PLATFORM-TERMS for claims) |
| 8 | Review & reputation engine | PARTIAL/UF | customerProof, customerFeedbackSync, growth phase 3 | partial (proof) | Review request/response/link builders + Reputation Dashboard (LEGAL/PLATFORM-HELD on incentives/gating/fake) |
| 9 | Social media foundation | PARTIAL/UF | foundationBuilder "claim brand profiles" (binary) | progress only | Social Profile Builder + 90-Day Content Planner |
| 10 | Nextdoor / neighborhood | RESOURCE-LINK / MISSING | resources only | none | Neighborhood checklist (PLATFORM-TERMS) |
| 11 | Angi / HomeAdvisor / paid leads | ROADMAP-RULE / MISSING | growth phases mention | none | Paid Lead Profitability Calculator (PLATFORM-TERMS on profitability claims) |
| 12 | Local directories & citations | MISSING | — | none | Local Listing Tracker + NAP consistency |
| 13 | Uniform & field presentation | MISSING | — | none | Field Brand Standards Checklist (post-launch) |
| 14 | Vehicle & mobile brand | MISSING | — | none | Vehicle Branding Readability Test (post-launch) |
| 15 | Printed & customer-facing materials | MISSING | salesPlaybooks adjacency | none | Templates library (post-launch) |
| 16 | Phone/email/customer comms | PARTIAL/UF | foundationBuilder (email); growth | weak | Communication Script Library (LEGAL on SMS/recording) |
| 17 | Local market presence | MISSING | growth phases mention | none | Local Market Presence Planner (post-launch) |
| 18 | Referral & customer advocacy | PARTIAL/UF | ShareReferralCard + referral tables; growth | partial | Referral/Advocacy Tracker (LEGAL on incentives) |
| 19 | Photography & proof library | MISSING | customerProof (testimonial intent) | none | Brand Proof Asset Library (LEGAL on photo consent) |
| 20 | Brand launch & 90-day plan | PARTIAL | foundationBuilder launch_readiness; growth 30/60/90 | progress | Brand Launch Checklist (reuse builder) |
| 21 | Brand performance & measurement | PARTIAL/HIDDEN | growthAnalytics(Sync), KPIs in phases | analytics (consent-gated) | Brand Performance Dashboard (Growth tier; consent/attribution limits) |

## B. Tool coverage (22 tools)

| Tool | Status | Notes |
| --- | --- | --- |
| Company Name Scorecard | MISSING | pure logic; clearance routing NEEDS-AUTH-SOURCE |
| Brand Positioning Builder | MISSING | pure |
| Brand Message Builder | MISSING | pure (templates) |
| Brand Asset Completeness Tracker | MISSING | pure |
| Business Identity Consistency Checker | MISSING | pure (NAP) |
| Website Readiness Audit | MISSING | pure checklist (hosted crawl = NEEDS-HOSTED, optional) |
| Google Business Profile Checklist | MISSING (foundation step exists) | PLATFORM-TERMS on claims |
| Review Request Script Builder | MISSING | LEGAL/PLATFORM-HELD (incentives/gating) |
| Review Link Workflow | MISSING | PLATFORM-TERMS |
| Review Response Builder | MISSING | pure templates |
| Reputation Dashboard | MISSING | NEEDS-HOSTED (data) / Growth tier |
| Social Profile Builder | MISSING | pure |
| 90-Day Content Planner | MISSING | pure |
| Paid Lead Profitability Calculator | MISSING | pure; PLATFORM-TERMS on marketplace claims |
| Local Listing Tracker | MISSING | pure tracker |
| Field Brand Standards Checklist | MISSING | pure (post-launch) |
| Vehicle Branding Readability Test | MISSING | pure (post-launch) |
| Customer Communication Script Library | MISSING | LEGAL (SMS/recording) |
| Local Market Presence Planner | MISSING | pure (post-launch) |
| Referral & Advocacy Tracker | MISSING | LEGAL on incentives |
| Brand Proof Asset Library | MISSING | LEGAL (photo consent) |
| Brand Launch Checklist | MISSING (partial via foundation launch_readiness) | reuse builder |
| Brand Performance Dashboard | MISSING | Growth tier; consent/attribution limits |

**Tool summary:** 0 of 22 exist as functional brand tools; 2 are partially represented as binary
Foundation Builder steps (GBP checklist, launch checklist).

## C. Cross-cutting integration status

| Capability | Status |
| --- | --- |
| Brand profile fields | MISSING (use existing `businessContext`/`normalizedAnswers` + new brand fields) |
| Brand readiness/score | MISSING — recommend non-score readiness feeding `sales_marketing` evidence |
| Brand Priority | MISSING (subordinate to canonical Metrix Priority) |
| Brand roadmap actions | MISSING (reuse existing roadmap action types) |
| Brand progress/evidence | REUSABLE (foundation builder model) |
| Brand cloud-sync | REUSABLE (`foundationBuilderSync` pattern) |
| Brand resource routing | PARTIAL (resource directory, mostly held) |
