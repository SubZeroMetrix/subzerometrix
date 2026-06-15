# SubZeroMetrix — Business Brand Foundation System Audit

> AUDIT & ARCHITECTURE PLANNING ONLY. No product behavior changed; nothing activated. Not legal
> advice. Coverage percentages are reasoned estimates against the proposed 21-domain / 22-tool
> Business Brand Foundation, not precise metrics.

## 1. Executive finding

A coherent, *dedicated* Business Brand Foundation product does **not** exist. However, meaningful
**fragments** already exist and are user-facing and canonical-adjacent:

- The **Business Foundation Builder** (`src/lib/foundationBuilder.ts`, `/foundation-builder`) already
  carries ~7 brand-setup steps under a `brand_presence` / `identity_digital` section: business name,
  simple logo + colors, domain, basic website, professional email, claim core brand profiles, and
  create + verify Google Business Profile — with progress, evidence/notes, completion stats, and
  cloud-sync. This is shallow (binary checklist steps), not a guided brand product.
- The **Growth Engine** (`src/lib/growthPhases.ts`, `/growth`) provides 12 contractor growth phases
  with 30/60/90 plans, KPIs, and `brandImpact`/`salesImpact` narrative — phase 3 covers Google
  reviews + GBP completeness; other phases cover acquisition/referral/retention strategy. This is
  strategy *content*, not a builder with checklists/evidence/progress.
- The **customer-proof / review engine** (`customerProof.ts`, `customerFeedbackSync.ts`) models
  consent-first reviews/testimonials; the **referral/sharing** system (`ShareReferralCard`, referral
  tables) models referrals; the **resource directory** holds (mostly held) marketing/branding links.

There is **no** brand-readiness assessment, brand gap report, Brand Priority, brand roadmap domain,
guided Brand Foundation Builder, brand profile fields, or any of the 22 proposed tools.

## 2–5. Coverage percentages (estimated, against the full proposed product)

| Metric | Estimate | Basis |
| --- | --- | --- |
| Brand Foundation already present (any form) | **~25%** | foundation setup steps + growth strategy content + review/referral primitives + resource links |
| User-facing | **~20%** | foundation-builder + /growth are live; reviews/referral surfaces partial; most domains absent |
| Connected to canonical Metrix (Profile/Score/Priority/Roadmap/Progress) | **~15%** | foundation steps feed the foundation progress domain; growth keyed to stage/trade; **no brand domain in profile/score/priority** |
| Missing | **~70–75%** | 21 domains shallow/absent; all 22 tools absent; no brand assessment/priority/builder |

## 6. Existing components and routes (brand-relevant)

| Area | File / route | Nature |
| --- | --- | --- |
| Foundation Builder | `src/lib/foundationBuilder.ts`, `src/components/FoundationBuilderChecklist.tsx`, `/foundation-builder` | Guided checklist w/ progress, evidence/notes, sync, status (`not_started/in_progress/done/blocked`) |
| Growth phases | `src/lib/growthPhases.ts`, `src/lib/growthEngine.ts`, `/growth` | 12 phases, 30/60/90, KPIs, brand/sales/financial impact, `lockedUpgradePreview` |
| Reviews / proof | `src/lib/customerProof.ts`, `src/lib/customerFeedbackSync.ts`, `src/components/customer proof surfaces` | Consent-first review/testimonial intent (device-local + sync) |
| Referral / sharing | `src/components/ShareReferralCard.tsx`, referral tables (migrations) | Manual referral/share + tracking tables |
| Sales / financial adjacency | `src/lib/salesPlaybooks.ts`, `src/lib/financialSystemsRoadmap.ts` | Adjacent guidance content |
| Resource directory | `src/lib/metrix/ecosystemCatalog.ts`, `/resources` | Marketing/branding resource links (held/legal-gated) |
| Canonical categories | `src/lib/metrix/gates.ts` (`GATE_DOMAIN_CATEGORY`), MetrixCategory `sales_marketing` / `business_foundation` | Existing score categories a brand domain can feed |

## 7. Hidden or fragmented systems

Brand capability is **fragmented**, not hidden behind flags: setup-level brand items live in the
Foundation Builder; reputation/acquisition strategy lives in Growth phases; reviews live in the
proof engine; referrals live in the share system; resources live in the directory. No single brand
domain ties them together, and none expose brand-specific readiness/priority.

## 8. Duplicate systems

None to consolidate yet (no second brand builder exists). The **risk** is creating a duplicate: a
parallel brand checklist/progress/score engine. The Foundation Builder is the canonical pattern to
reuse (see the architecture doc).

## 9. Existing tool inventory (brand-relevant)

- Foundation checklist (binary steps incl. name/logo/domain/website/email/brand-profiles/GBP).
- Growth-phase KPI references + 30/60/90 plans (content, not interactive tools).
- Review/testimonial consent model; referral share card.
- No interactive brand calculators/scorecards/trackers/builders.

## 10. Missing tool inventory

All 22 proposed tools are **MISSING** (Company Name Scorecard; Brand Positioning Builder; Brand
Message Builder; Brand Asset Completeness Tracker; Identity Consistency Checker; Website Readiness
Audit; GBP Checklist tool; Review Request/Response/Link builders; Reputation Dashboard; Social
Profile Builder; 90-Day Content Planner; Paid Lead Profitability Calculator; Local Listing Tracker;
Field Brand Standards Checklist; Vehicle Branding Readability Test; Communication Script Library;
Local Market Presence Planner; Referral/Advocacy Tracker; Brand Proof Asset Library; Brand Launch
Checklist; Brand Performance Dashboard). See the coverage matrix for per-tool classification.

## 11. Business Foundation Builder reuse map

HIGH reuse. The Foundation Builder already provides the exact framework a Brand Foundation needs:
section → category → step-definition data model; `createFoundationItemFromDefinition`;
`getFoundationCompletionStats` / `getFoundationProgressSummary`; status model; `FoundationStage`;
evidence/note fields; `foundationBuilderSync` (local + cloud, honest status); empty/completion
rules; checklist UI. **Recommendation: extract a shared builder framework and add a Brand domain
content config — do NOT copy the builder into a duplicate.** (See architecture doc §reuse.)

## 12. Canonical profile integration recommendation

Add a **Brand Foundation readiness domain** to the canonical profile (category readiness + evidence
+ reviewed dates + next-best brand question + a Brand Priority). Reuse the existing
`businessContext` + `normalizedAnswers` + evidence model. Do **not** add a second user profile.

## 13. Score / priority / roadmap / progress integration recommendation

**Safer architecture: a non-score readiness/progress domain that feeds MetrixScore *evidence*** via
the existing `sales_marketing` (and partly `business_foundation`) MetrixCategory — NOT a second
overall score. Brand work raises the existing category readiness through evidence/completion; a
**Brand Priority** is surfaced within the brand domain (subordinate to the canonical Metrix
Priority); brand roadmap actions reuse the existing roadmap action types and progress/evidence
model. Rationale: a competing overall "BrandScore" would fracture the single-score promise and
duplicate scoring logic (a hard preservation rule).

## 14. Free vs paid placement (evaluate; do NOT activate)

- **Free (Initial Direction):** basic brand-readiness questions, brand-gap summary, one Brand
  Priority, high-level next steps.
- **Roadmap Pass / Build:** full guided Brand Foundation Builder — checklists, tools, templates,
  evidence, progress, resource routing, 30/60/90-day plan.
- **Growth (invitation):** channel profitability, review/reputation + referral performance,
  market-presence tracking, advanced acquisition measurement, repeat/reactivation systems.
- Gating reuses the existing entitlement/flag machinery; **nothing is activated by this audit.**

## 15. Proposed route & navigation structure

- `/brand-foundation` — guided Brand Foundation Builder (mirrors `/foundation-builder`, reuses AppShell).
- `/brand-foundation/tools/[tool]` (or component-embedded) — the brand tools, flag-gated.
- Brand readiness questions added to the existing assessment/profile flow; Brand gap + Brand Priority
  surfaced on `/results` and `/dashboard` (subordinate to MetrixScore/Priority).
- No new public marketing mini-app; all under the canonical shell + entitlements.

## 16. End-user flow

Brand readiness questions → Brand gap report → Brand Priority → Brand roadmap actions → guided
Brand Foundation Builder → tools/templates → evidence submission → progress tracking →
resource/specialist routing → brand launch → 30-day review → 90-day reassessment. Per-step routes,
reusable components, data sources, gating, outputs, empty/completion/sync rules are detailed in the
proposed-architecture doc §end-user-flow.

## 17. Legal / platform-terms holds

- Business-name legal clearance / trademark availability — **AUTHORITATIVE-SOURCE + QUALIFIED LEGAL
  REVIEW REQUIRED** (route to official search; never assert "clear/available").
- Review incentives, review gating, fake/employee reviews, testimonials without permission —
  **SAFE TO KEEP DISABLED** + **PLATFORM-TERMS REVIEW REQUIRED** (Google/Nextdoor/Angi terms).
- SMS/email marketing, call recording — **QUALIFIED LEGAL REVIEW REQUIRED** (TCPA/consent/state law).
- Customer/employee photo usage, customer addresses/job details — **QUALIFIED LEGAL REVIEW REQUIRED**
  (consent/privacy).
- "Best / #1 / guaranteed" claims — **SAFE TO KEEP DISABLED** (no unsupported superiority claims).
- Financing, Angi/HomeAdvisor profitability claims, Google/Nextdoor platform-rule claims —
  **PLATFORM-TERMS + QUALIFIED LEGAL REVIEW REQUIRED**.
- Licensing/insurance status — **AUTHORITATIVE-SOURCE REVIEW REQUIRED** (educational, verify-before-act).
- Everything else (name scorecard logic, asset trackers, checklists, calculators with user-entered
  inputs, message/script *templates*) is **TECHNICAL IMPLEMENTATION READY** when built behind flags.
- Disclaimers must not cure misleading behavior.

## 18. Build dependency map

Shared builder framework (extract) → Brand domain content/config → Brand readiness assessment +
gap + Brand Priority (canonical, non-score) → guided builder route + progress/evidence/sync → brand
tools (pure, flag-gated) → free/paid gating + Growth measurement → preservation/red-team + audit.
Each later step depends on the earlier; the framework extraction unblocks everything and is
behavior-preserving.

## 19. Recommended implementation checkpoints

- **CP1** — Extract a shared builder framework from `foundationBuilder` (reusable core +
  foundation content config); behavior-preserving, fully tested.
- **CP2** — Brand domain content/config (sections, categories, step definitions for the 21 domains);
  data only.
- **CP3** — Brand readiness assessment questions + gap report + **Brand Priority** (non-score
  readiness feeding `sales_marketing` evidence); canonical profile fields.
- **CP4** — `/brand-foundation` guided builder route + progress/evidence/sync (reuse framework +
  `foundationBuilderSync` pattern); flag-gated.
- **CP5** — Brand tools (pure, deterministic, flag-gated): start with Company Name Scorecard, GBP
  Checklist, Review Request/Response builders, Paid Lead Profitability Calculator, Local Listing
  Tracker, Brand Launch Checklist.
- **CP6** — Free/paid gating + entitlement wiring (behind default-OFF flags; no activation),
  Growth-tier measurement, preservation/red-team, completion audit + risk register.

## 20. Launch-critical vs post-launch scope

- **Launch-critical:** free brand readiness + gap + Brand Priority; the core guided builder covering
  setup-level brand (name/logo/website/email/GBP/reviews) — largely reusing what exists; the
  low-legal-risk tools (scorecard, checklists, calculators with user inputs).
- **Post-launch / held:** deep domains (vehicle/uniform/field presentation, printed materials,
  phone/comms scripts, local market presence, photography/proof library), paid-lead marketplace
  measurement, content planner, brand performance dashboard, and any platform/legal-held behavior.

## 21. Estimated implementation complexity by checkpoint

| CP | Complexity | Notes |
| --- | --- | --- |
| CP1 framework extraction | Medium | refactor risk mitigated by behavior-preserving tests |
| CP2 brand content/config | Medium–High | large volume of curated, accurate content across 21 domains |
| CP3 assessment + priority | Medium | reuse intake/profile + evidence; careful canonical integration |
| CP4 guided builder route | Low–Medium | mostly reuse of the foundation framework + sync |
| CP5 brand tools | Medium–High | many pure tools; legal/platform care on a subset |
| CP6 gating + measurement + audit | Medium | flags/entitlements exist; Growth measurement is new |

## 22. Go/no-go recommendation for a consolidated Brand Foundation build

**GO — via the shared-framework approach**, conditioned on keeping all platform/legal-held items
disabled and routing legal-sensitive claims to official sources. The architecture is low-risk
(reuse the proven Foundation Builder + canonical evidence model; no second score), but the build is
substantial (large content + many tools). Recommend a single consolidated build with the six
checkpoints above, defaulting every new surface OFF until free/paid placement and legal/platform
reviews clear. **Do not build until explicitly instructed.**
