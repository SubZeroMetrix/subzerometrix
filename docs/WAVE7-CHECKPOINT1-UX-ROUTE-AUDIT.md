# SubZeroMetrix — Wave 7 Checkpoint 1: UX & Route Dependency Audit

> **Purpose.** The pre-implementation audit required by Wave 7 Checkpoint 1. It inventories every
> public and authenticated surface, maps the current CTA hierarchy and core flows, verifies the
> preserved routes, identifies duplicate/inconsistent UI and raw engine reads that should route
> through the canonical presentation adapter, and documents the planned (non-destructive,
> flag-gated) changes **before** any UI is rebuilt. **No route is removed.**

- **Branch:** `feature/metrix-wave7-full-site-ux-discovery`
- **Base:** `main` @ `ae97915` (Wave 6 finalized handoff), working tree clean at branch creation.
- **Method:** read-only inspection of `src/app`, `src/components`, `src/lib`, the Wave 1–6
  handoffs, `docs/PRESERVATION-INVENTORY.md`, `docs/RESOURCE-ECOSYSTEM-ARCHITECTURE.md`,
  `docs/MIGRATION-ROLLBACK-PLAN.md`, and the machine inventories in `src/lib/preservation/`.

---

## 1. Surface inventory

### 1.1 Public / marketing
| Route | File | Shell (current) | Notes |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` (651 lines) | bespoke inline nav/footer | homepage; **encoding-corrupted copy** (see §5) |
| `/about` | `src/app/about/page.tsx` | bespoke | brand/credibility |
| `/start` | `src/app/start/page.tsx` | bespoke | assessment entry; primary CTA target |
| `/assessment` | `src/app/assessment/page.tsx` | bespoke | assessment flow |
| `/business-readiness` | `src/app/business-readiness/page.tsx` | bespoke | readiness entry |
| `/partners` | `src/app/partners/page.tsx` | bespoke | partner interest |
| `/install` | `src/app/install/page.tsx` | bespoke | PWA install |
| `/unlock` | `src/app/unlock/page.tsx` | bespoke | paid-unlock entry |
| `/resources` | `src/app/resources/page.tsx` (213) | bespoke | **current** resources surface; directory is Wave 7 |

### 1.2 Results
| Route | File | Canonical reads |
| --- | --- | --- |
| `/results` | `src/app/results/page.tsx` (435) | `getCanonicalProfile`, `toMetrixScore` **(raw — not via adapter)** |
| `/report` | `src/app/report/page.tsx` | report view |

### 1.3 Dashboard (authenticated)
| Route | File | Canonical reads |
| --- | --- | --- |
| `/dashboard` | `src/app/dashboard/page.tsx` (575) | `getCanonicalProfile`, `toMetrixScore`, `estimatePotentialFromSnapshot` **(raw)** |
| `/foundation-builder` | `src/app/foundation-builder/page.tsx` | Foundation Builder |
| `/growth` | `src/app/growth/page.tsx` | Growth Engine |
| `/account/privacy` | `src/app/account/privacy/page.tsx` | export/delete controls |

### 1.4 Content / SEO
`/learn`, `/learn/[slug]`, `/trades`, `/platform/[trade]`, `/platform-ecosystem`,
`/contractor-builders`, `/general-business-starter`.

### 1.5 Spanish discovery
`/es`, `/es/como-empezar-un-negocio`, `/es/preparacion-empresarial`.

### 1.6 Legal / disclosure
`/privacy`, `/terms`, `/disclaimer`, `/cancellation`, `/affiliate-disclosure`.

### 1.7 API (no shell — preserve unchanged)
`/api/checkout` *(Stripe — do not touch)*, `/api/webhook` *(Stripe — do not touch)*,
`/api/verify-session`, `/api/track-click` *(canonical outbound-click sink)*,
`/api/postback/[vendor]`, `/api/email-trigger`.

### 1.8 System / SEO
`/sitemap.xml` (`sitemap.ts`), `/robots.txt` (`robots.ts`), `/llms.txt` (`llms.txt/route.ts`).

### 1.9 Gated / dormant (Wave 6)
`/resources/go/[resourceId]` (`resources/go/[resourceId]/route.ts`) — tracked redirect, flag
`tracked_resource_redirects` OFF, published catalog empty ⇒ returns 404 today.

**Route-preservation check:** all **39** routes in `ROUTE_INVENTORY` are present on disk, plus the
separate gated redirect route. ✅ No route is to be removed in Wave 7.

---

## 2. Current CTA hierarchy (homepage `/`)

Today's homepage drives **one** repeated CTA to `/start` under several labels:

1. Hero — "Get My MetrixScore™ — It's Free" → `/start`
2. Roadmap callout — "Get My Personal Roadmap — Free" → `/start`
3. How-it-works — "Start My MetrixScore" → `/start`
4. Report section — "Start My MetrixScore™ — Free" → `/start`
5. Final CTA — "Get My MetrixScore™ — It's Free" → `/start`
6. Nav — "Start Free" → `/start`; "Dashboard" → `/dashboard`
7. Secondary — "Explore the platform ecosystem" → `/platform-ecosystem`

**Assessment:** CTA *destination* is already singular and correct (`/start`), but the **label is
inconsistent** (4 variants) and none match the Wave 7 canonical primary CTA
**"Find My Next Move — Free."** Positioning copy ("KNOW WHERE YOU STAND. BUILD FROM THERE.") does
not yet carry the Wave 7 "Start it. Build it. Grow it." / "Find the next business move that matters
most." line. Lifecycle is shown as a 4-step temperature metaphor (Sub-Zero → Superheated), not the
canonical 6-stage lifecycle (`Idea/Side Hustle → Startup Readiness → Launch → Stabilize → Grow →
Scale`) nor the 8 audience-routing entry points.

---

## 3. Core flow map

```
/  ──► /start ──► (assessment) ──► /results ──► /dashboard ──► /foundation-builder
                                      │                  └────► /growth
                                      └──► /report (printable)         │
 dashboard + results render:                                          ▼
   • MetrixPriorityExperience (dominant next-action)            reassessment loop
   • ProfileIntelligenceCard (Wave 2)
   • TradeIntelligenceCard (Wave 3)
   • LicensingIntelligenceCard (Wave 4)
   • ResourceRecommendations (Wave 5, subordinate)
   • SyncStatusBadge / ReassessmentPanel / RoadmapProgressCard
 resources:  /resources (static public resources today)
             /resources/go/[resourceId] (gated redirect, dormant)
```

**Dominant CTA today:** `MetrixPriorityExperience` already renders the single dominant next-action
on both results and dashboard — the Wave 7 "one dominant next-action CTA, subordinate intelligence
cards" requirement is **already structurally honored** and must be **preserved**, not rebuilt.

---

## 4. Duplicate / conflicting / inconsistent UI findings

| # | Finding | Severity | Planned Wave 7 handling |
| --- | --- | --- | --- |
| D1 | **No shared app shell.** Every page hand-rolls its own nav/footer/container (homepage inlines an `IceCrystal` nav + footer). Inconsistent headers, spacing, and footers across 39 routes. | High | Checkpoint 2: build shared shell components behind `presentation_shell`; adopt incrementally. **Do not** delete per-page markup until the shell renders identically. |
| D2 | **`buildCanonicalPresentation` is wired into ZERO surfaces.** `/results` and `/dashboard` read `toMetrixScore` + `getCanonicalProfile` directly (raw engine reads). | High | Checkpoint 4: route presentation through the adapter additively; the adapter recomputes nothing (test-enforced), so output is identical. |
| D3 | **Inconsistent primary-CTA label** (4 variants of "Get/Start My MetrixScore"). | Medium | Checkpoint 3: standardize on "Find My Next Move — Free" → `/start`. |
| D4 | **Lifecycle metaphor mismatch.** Homepage uses 4 temperature bands; canonical lifecycle is 8 stages (`lifecycle.ts`) / 6 marketing stages. | Medium | Checkpoint 3: present the canonical lifecycle alongside the temperature identity (keep the temperature brand as visual language, not as the lifecycle model). |
| D5 | **Two resource surfaces will coexist** (`/resources` static vs. Wave 7 directory). | Medium | Checkpoint 6: build directory behind `public_resource_directory`; `/resources` preserved; no link-dump. |
| D6 | **Encoding corruption** in `page.tsx` hero/section copy and box-drawing comments (mojibake). | Medium (visible) | Checkpoint 3: homepage rebuild authored in clean UTF-8. |
| D7 | Intelligence cards (Profile/Trade/Licensing/Recommendations) are consistent in data but each card styles itself; visual rhythm varies. | Low | Checkpoint 2/4: unify via shared card primitives; keep each card's canonical data source untouched. |

**No duplicate engines found.** Score, priority, gates, paths, profile, progress, reassessment,
trade intelligence, licensing intelligence, and recommendation ranking each have exactly one owner
(confirmed against the Wave 6 preservation inventory). Wave 7 introduces **no** competing engine.

---

## 5. Raw engine reads to migrate to the canonical adapter

| Surface | Current raw read | Target |
| --- | --- | --- |
| `/results` (`results/page.tsx:111`) | `toMetrixScore(profile)` + `getCanonicalProfile` | feed snapshot into `buildCanonicalPresentation`; render from the returned `CanonicalPresentation` (score/priority/actions/confidence/sync/disclosures) |
| `/dashboard` (`dashboard/page.tsx:221`) | `toMetrixScore`, `estimatePotentialFromSnapshot`, `getCanonicalProfile` | same; potential estimate passed through, not recomputed |

Migration is **additive and behavior-preserving**: the adapter is a pure projection
(`presentation score === toMetrixScore`, test-enforced). It will be introduced behind
`presentation_shell` so the current rendering remains the default until parity is verified.

---

## 6. Planned changes by checkpoint (non-destructive, flag-gated)

All new surfaces ship behind the existing Wave 6 flags (default OFF) per
`docs/MIGRATION-ROLLBACK-PLAN.md`. Production behavior is unchanged until a flag is flipped.

| CP | Work | Flag(s) | Destructive? |
| --- | --- | --- | --- |
| 2 | Shared design system + app shells | `presentation_shell` | No — additive components |
| 3 | Homepage + conversion architecture | `presentation_shell` | No — gated render path |
| 4 | Results/dashboard/roadmap via `canonicalPresentation` | `presentation_shell` | No — additive read path |
| 5 | Curated 108-resource import | `verified_launch_resources` | **BLOCKED — see §7** |
| 6 | Public Resource Directory | `public_resource_directory` | No — new UI on empty-safe catalog |
| 7 | Redirects/tracking/feedback/consent | `tracked_resource_redirects` | No — uses existing sink |
| 8 | Learn/trade/state/business-starter | `new_content_surfaces`, `general_business_starter`, `spanish_discovery` | No |
| 9 | Referrals/sharing/proof/email | `referral_sharing`, `customer_proof_feedback` | No |
| 10 | SEO & discovery | — | No — additive metadata |
| 11 | Founding offer presentation | `lifetime_offer_presentation` | No — **display only; NO Stripe change** |
| 12 | Accessibility/performance/device | — | No |
| 13 | Red-team & blind-spot audit | — | No |

---

## 7. Blocker: Checkpoint 5 data dependency

Checkpoint 5 requires the workbook
**`SubZeroMetrix_Resource_Directory_Master_Catalog_and_Audit.xlsx`** to import the curated 108
launch-set records. **This file is not present anywhere in the repository** (no `.xlsx`, no
`data/` directory). Without it, the 108 records cannot be imported, cross-checked, deduplicated,
or verification-gated — and the guardrails explicitly forbid inventing resource records or
verification results ("do not invent verification results"; "no unverified providers"; "no fake
proof"). Therefore:

- **Checkpoints 2, 3, 4, 10, 12, 13** (presentation, homepage, results/dashboard, SEO, a11y/perf,
  red-team) are **unblocked** and can proceed.
- **Checkpoint 5** is **hard-blocked** pending the workbook.
- **Checkpoints 6 & 7** can build the **directory/redirect UI and contracts** against the
  (empty-by-design) published catalog, but cannot publish real records until CP5 lands. They will
  ship behind their flags showing safe empty/unavailable states.
- **Checkpoints 8, 9, 11** are largely unblocked (content/proof/pricing presentation), except
  where they surface specific resources.

The workbook must be provided (e.g. dropped into `data/` or `docs/data/`) before CP5 can run.

---

## 8. Guardrail confirmations carried into implementation

- No route removal; no canonical ID / storage-key / cloud-table / analytics-event changes.
- All new surfaces behind default-OFF flags; rollback = flip flag off.
- No Stripe/payment logic touched (CP11 is presentation only).
- No competing score/priority/gate/path/profile/progress/reassessment/recommendation engine.
- No commercial influence over recommendation relevance or ordering.
- No PII in links or analytics.
- No fake proof, scarcity, testimonials, partner claims, or unsupported legal/outcome claims.

---

*Checkpoint 1 is a documentation/audit deliverable only — no application code changed.*
</content>
