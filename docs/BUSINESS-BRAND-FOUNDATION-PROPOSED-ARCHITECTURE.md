# Business Brand Foundation — Proposed Architecture

> Planning only. No code. The design favors REUSE of the canonical Metrix system and the existing
> Business Foundation Builder; it introduces NO competing score, profile, roadmap, or progress engine.

## 1. Guiding principles

- One canonical system: the Brand Foundation is a **domain inside** Metrix Profile / Score /
  Priority / Roadmap / Progress / Reassessment — not a parallel app.
- One overall score: brand work feeds **evidence/readiness into existing MetrixCategories**
  (`sales_marketing` primarily, `business_foundation` secondarily). No "BrandScore" as a competing
  overall number.
- Reuse, don't duplicate: extract a shared builder framework from the Business Foundation Builder;
  the Brand Foundation is a content/config + thin domain layer on top.
- Fail-closed: every new surface ships behind a default-OFF flag; legal/platform-held behavior stays
  disabled and routes to official sources.

## 2. Business Foundation Builder — architecture (the reuse baseline)

`src/lib/foundationBuilder.ts` provides:
- Data model: `FoundationSection` → `FoundationCategory` → `FoundationStepDefinition`
  (`stepName`, `description`, `whyItMatters`, `priority`, `estimatedTime`, `defaultStage`, optional `trade`).
- Item model: `createFoundationItemFromDefinition` → `FoundationChecklistItem` (status
  `not_started|in_progress|done|blocked`, `completed`, `completedAt`, `note`, `blockedReason`).
- Progress: `getFoundationCompletionStats`, `getFoundationProgressSummary` (counts, percent, last*).
- Labels/i18n: stage/status/priority/section label helpers (en/es).
- Sync: `foundationBuilderSync` (local + cloud, honest status via `syncContracts` `SyncStatus`).
- UI: `FoundationBuilderChecklist.tsx`; route `/foundation-builder`.
- Gating: surfaced as guided content; entitlement/flag-gateable.

## 3. Shared builder framework (proposed extraction — CP1)

Extract a domain-agnostic core (e.g. `src/lib/builder/`):
- `BuilderSection`, `BuilderCategory`, `BuilderStepDefinition`, `BuilderChecklistItem` (generalized
  from the Foundation types).
- `createItemFromDefinition`, `getCompletionStats`, `getProgressSummary`, label helpers.
- A shared sync adapter pattern (reuse `syncContracts`).
Then re-express the Foundation Builder as `domain: 'foundation'` content over the shared core
(behavior-preserving), and add `domain: 'brand'` content. **Shared:** framework, task/checklist
components, progress + evidence model, sync adapter, completion statuses, roadmap action types.
**Separate:** the brand domain's content/configuration and a few brand-specific tools.

## 4. Brand domain canonical integration

- **Profile:** add a `brandContext` (or reuse `businessContext` + `normalizedAnswers`) with brand
  readiness fields (company-name readiness, visual identity, messaging, website, local profile,
  reputation, social, field presentation, market presence, referral, measurement) — each with
  evidence references + reviewed dates + completion status.
- **Score:** a **non-score readiness domain**. Brand completion/evidence raises the EXISTING
  `sales_marketing` (and partly `business_foundation`) category readiness through the established
  evidence mechanism. No new overall score. (Safer than a "Brand Foundation domain score feeding
  MetrixScore" because it reuses one scoring path and cannot drift into a competing number.)
- **Priority:** a **Brand Priority** computed within the brand domain, surfaced subordinate to the
  canonical Metrix Priority (never replacing it).
- **Roadmap/Progress:** brand roadmap actions reuse existing roadmap action types; progress/evidence
  reuse the builder item model; reassessment reuses the existing reassessment flow.

## 5. Free / paid placement (gate only; do not activate)

| Tier | Brand capability |
| --- | --- |
| Free (Initial Direction) | basic brand-readiness questions, brand-gap summary, one Brand Priority, high-level next steps |
| Roadmap Pass / Build | full guided Brand Foundation Builder: checklists, tools, templates, evidence, progress, resource routing, 30/60/90 plan |
| Growth (invitation) | channel profitability, review/reputation + referral performance, market-presence tracking, advanced acquisition measurement, repeat/reactivation |

Gating via existing entitlement/flag machinery; new flags default OFF (e.g. `brand_foundation`,
`brand_foundation_growth`). Nothing activated by this audit.

## 6. Proposed routes & navigation

- `/brand-foundation` — guided Brand Foundation Builder (mirrors `/foundation-builder`).
- `/brand-foundation/tools/[tool]` or embedded components — brand tools (flag-gated).
- Brand readiness questions in the existing assessment/profile flow; Brand gap + Brand Priority on
  `/results` and `/dashboard`, subordinate to MetrixScore/Priority. All under AppShell + entitlements.

## 7. End-user flow (per-step)

| Step | Route | Reusable component | Data source | Access | Output | Empty state | Completion | Sync | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Brand readiness Qs | assessment | intake/profile | profile | Free | answers | unanswered = honest incomplete | all answered | — | — |
| 2 Brand gap report | /results | results card | brand readiness | Free | gaps | "answer to see gaps" | n/a | — | — |
| 3 Brand Priority | /results,/dashboard | priority card | brand domain | Free | 1 priority | "complete intake" | n/a | — | — |
| 4 Brand roadmap actions | /dashboard | roadmap action | roadmap | Paid | actions | "unlock roadmap" | per action | yes | optional |
| 5 Guided builder | /brand-foundation | shared builder | brand content | Paid | checklist | "no items yet" | stats=100% | yes | per step |
| 6 Tools/templates | /brand-foundation/tools | tool components | user inputs | Paid | tool output | "start tool" | n/a | optional | optional |
| 7 Evidence submit | builder | evidence field | builder item | Paid | note/evidence | "no evidence" | item done | yes | yes |
| 8 Progress | /brand-foundation | progress summary | builder items | Paid | percent | "0%" | n/a | yes | — |
| 9 Resource routing | builder/resources | resource cards | directory | Paid | links | "none yet" | n/a | — | — |
| 10 Brand launch | /brand-foundation | launch checklist | builder | Paid | launch status | "not started" | all done | yes | — |
| 11 30-day review | /brand-foundation | review prompt | progress | Paid | review | "too early" | n/a | yes | — |
| 12 90-day reassessment | assessment | reassessment | profile | Paid | new readiness | n/a | n/a | yes | — |

## 8. Build dependency map

CP1 framework → CP2 brand content → CP3 brand assessment + Brand Priority (canonical) → CP4 guided
builder route + sync → CP5 brand tools → CP6 gating + Growth measurement + audit. Framework
extraction (CP1) unblocks all; it is behavior-preserving and must keep the Foundation Builder
identical.

## 9. Implementation checkpoints (proposed)

1. CP1 — shared builder framework extraction (behavior-preserving, tested).
2. CP2 — brand domain content/config (21 domains; data only).
3. CP3 — brand readiness assessment + gap + Brand Priority (non-score readiness → `sales_marketing`).
4. CP4 — `/brand-foundation` guided builder + progress/evidence/sync (flag-gated).
5. CP5 — brand tools (pure, deterministic, flag-gated; legal/platform-held subset stays disabled).
6. CP6 — free/paid gating + entitlement wiring (no activation), Growth measurement, preservation/
   red-team, completion audit + risk register.

## 10. Launch-critical vs post-launch

- Launch-critical: free brand readiness + gap + Brand Priority; core guided builder (setup-level
  brand reusing existing steps); low-legal-risk tools (Company Name Scorecard, GBP Checklist,
  Review Response Builder, Paid Lead Profitability Calculator, Local Listing Tracker, Brand Launch
  Checklist).
- Post-launch / held: vehicle/uniform/field, printed materials, comms scripts (SMS/recording legal),
  local market presence, proof/photo library (consent), content planner, performance dashboard,
  advanced Growth measurement, and any platform-terms-held behavior.

## 11. Preservation guarantees

No change to canonical Metrix Profile/Score/Priority/Roadmap/Progress/reassessment, the Business
Foundation Builder behavior, 10 trades, 6 states, resource IDs/accounting, consent, analytics,
pricing, entitlements, Stripe, migrations, RLS, cloud-sync, feature flags, or public routes. The
brand domain is additive and default-OFF.

## 12. Go/no-go

**GO via shared-framework reuse**, default-OFF, with legal/platform-held items disabled and
legal-sensitive claims routed to official sources. Substantial content/tool build; low architectural
risk. Build only when explicitly instructed.
