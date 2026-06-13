# Pre-Launch Audit-1B — Product Quality, Blind Spots & Ten-Trade Coverage

**Date:** 2026-06-12 · **Checkpoint:** `e231fe6` (Fix-1 complete). Method: code/build
inspection (live Supabase/Stripe/device flows documented as manual-required). Owner/operator:
**The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**, **MetrixScore™** (™).

## 1. Executive verdict

**PASS WITH REQUIRED FIXES — 0 blockers.** The core journey is intact in code (intake →
assessment → score/results → unlock → checkout → verify-session → paid report → roadmap →
Foundation Builder → dashboard tracking → reassessment). The 10-trade taxonomy and 6 launch
states are consistent across systems. The highest-risk finding is an **email-delivery /
consent contradiction**: a built, env-gated Resend automation route (`/api/email-trigger`)
exists and contradicts the Growth-8 + Privacy-Policy statements that no email delivery is
configured. It is gated off without `RESEND_API_KEY` (not a functional blocker) but must be
reconciled before launch. Build passes; all intended routes compile.

## 2. Journey test results (code inspection)

- **Anonymous:** Homepage → `/start` (intake) → `/assessment` → `/results` (score + "Unlock
  Full Roadmap" CTA → `/unlock`). Public `/learn`, `/trades`, `/resources`, `/foundation-builder`
  reachable. Free vs paid is clear (score band free; full breakdown/roadmap paid). **OK.**
- **Signed-in:** Sign-in is magic-link (`accountAuth`); **no sign-in UI surface is wired**, so
  in practice users are local-only today. Dashboard, Foundation Builder, KPI tracking, and
  account privacy/export/delete exist and degrade honestly when signed out. **OK with caveat
  (no sign-in entry point — see should-fix).**
- **Returning:** Local-first restore via `szm_*` keys; Foundation Builder upgrades trade steps
  idempotently; state resources persist from intake `region`; completed/blocked states persist.
  **OK (code).**
- **Paid:** Checkout → `/report?session_id` → server `verify-session` (`paid:true` only on
  Stripe `payment_status==='paid'`) → `if (!paid) return <payment-required>`. Direct-nav
  protected. Report substantial (112 kB). **OK.**
- **Local-only:** Permitted local features work; honest device-local + "sign in to back up"
  messaging; no false sync claims (sync badge confirmed-write-only). **OK.**

## 3. Ten-trade coverage matrix

Taxonomy is consistent across `intake.TRADE_OPTIONS`, `foundationBuilder.FoundationTrade`,
`publicResources.SUPPORTED_TRADES`, and `emailCapture.ALLOWED_TRADES` (same 10 slugs + `other`
fallback). Each trade has a Foundation Builder trade-specific licensing/insurance step.

| Trade | Assessment relevance | Recommendation/roadmap | Foundation Builder step | Public content | Resource/vendor | Status |
|---|---|---|---|---|---|---|
| HVAC | trade selectable; generic readiness Qs | category roadmap | `trade-hvac-license` (EPA 608) | `/trades`, learn pages | report vendor library | OK |
| Electrical | ✓ | ✓ | `trade-electrical-license` | ✓ | ✓ | OK |
| Plumbing | ✓ | ✓ | `trade-plumbing-license` (backflow) | ✓ | ✓ | OK |
| Roofing | ✓ | ✓ | `trade-roofing-license` (bonding/insurance) | ✓ | ✓ | OK |
| Construction/GC | ✓ | ✓ | `trade-construction-license` (bonding) | ✓ | ✓ | OK |
| Handyman | ✓ | ✓ | `trade-handyman-scope` | ✓ | ✓ | OK |
| Landscaping | ✓ | ✓ | `trade-landscaping-requirements` (pesticide) | ✓ | ✓ | OK |
| Cleaning | ✓ | ✓ | `trade-cleaning-bonding` | ✓ | ✓ | OK |
| Painting | ✓ | ✓ | `trade-painting-rrp` (lead-safe) | ✓ | ✓ | OK |
| Solar | ✓ | ✓ | `trade-solar-license` (interconnection) | ✓ | ✓ | OK |

**Gap (should-fix):** assessment questions and the scoring categories are **general business
readiness** (not trade-specific question branching); trade context appears in Foundation
Builder + public content + branded platform pages, not in the assessment questions themselves.
Acceptable for MVP; deeper trade-specific assessment depth is Fix-2/future.

## 4. Six-state routing matrix

`FOUNDATION_LAUNCH_STATES` = FL, CO, TX, AZ, OH, NC. `getFoundationStateResources(state, category)`
returns entity (SOS/registration), tax (DOR), licensing (board) official-portal links + federal
EIN/GBP; non-launch states fall back to federal + a "set your state / verify officially" message.

| State | Entity | Tax | Licensing | Fallback | Issues |
|---|---|---|---|---|---|
| Florida | Sunbiz | FL DOR | DBPR | n/a | links are homepage/portal-level (stability) |
| Colorado | CO SOS | CO Taxation | DORA | n/a | — |
| Texas | TX SOS | Comptroller | TDLR | n/a | — |
| Arizona | AZ Corp Commission | AZ DOR | ROC | n/a | — |
| Ohio | OH SOS | OH Taxation | eLicense | n/a | — |
| North Carolina | NC SOS | NC DOR | NCLBGC | n/a | — |
| Other states | — | — | — | federal + verify-your-state | working |

Links resolve to official government domains; labeled "official starting point — verify current
requirements; not advice." **No completeness/authority claim.** Intake `region` flows to the
Foundation Builder; resources render only on `officialSourceReminder` steps. **OK.** Manual:
click-test each live link before launch (flag stale/redirected URLs).

## 5. BLOCKERS

**None.** No broken route, no data loss, no destructive behavior; core journey completes in code;
payment gating intact; trade/state routing correct.

## 6. SHOULD FIX BEFORE LAUNCH

1. **Email delivery / consent contradiction (highest risk).** `src/app/api/email-trigger/route.ts`
   is a built **Resend** automation (assessment-complete / post-purchase / day7 / day30 /
   day89 sequences) that sends to the assessment-collected email when `RESEND_API_KEY` is set.
   This contradicts Growth-8 (`growth-8-email-capture-nurture-foundation.md`) and the updated
   Privacy Policy, which state no email-delivery provider is configured. Reconcile in Fix-2:
   confirm `RESEND_API_KEY` is unset for launch (no sends) **and** update Growth-8 + Privacy
   Policy to disclose the gated Resend integration + the assessment-email sequence, OR align
   the consent model (the assessment-email consent vs. Growth-8 explicit-list consent) and
   wire unsubscribe before enabling. Until reconciled, do not enable `RESEND_API_KEY` in prod.
2. **Email-trigger urgency copy.** Subject/body lines like "don't lose it" and "the longer you
   wait, the longer your business runs cold" are pressure phrasing. Review for the no-fake-
   urgency standard before any send.
3. **"AI coaching"/benchmarks framed as current upgrade benefits.** `src/app/page.tsx:489` and
   `src/app/platform-ecosystem/page.tsx:143,192` describe the trade-platform upgrade as
   "unlocks deeper benchmarks, AI coaching, and KPI tracking," while `tierPreview.ts` lists
   "AI coach" and "Benchmarking" as **not yet available**. Add clear "planned/future" framing
   so the upgrade isn't presented as delivering AI coaching today.
4. **Paid-report "Coming soon" footnotes.** `src/app/report/page.tsx:420,677,1645` show
   "Coming soon — scripts, templates, calculators, SOPs" inside the paid report. Honestly
   labeled, but ensure the paid tier's delivered value is sufficient without them; consider
   removing or replacing with shipped content.
5. **Company-name consistency.** `src/app/terms/page.tsx:113` (and some copy) says "The Modern
   Trades Mentor"; the Privacy Policy now says "The Modern Trades Mentor LLC." Standardize to
   the LLC name across formal docs.
6. **No sign-in UI entry point.** Account auth + sync + export/delete exist, but there is no
   visible sign-in surface, so cloud backup is effectively unreachable for users. Either wire a
   minimal honest sign-in entry or clearly present account features as "coming soon" so they
   don't read as currently available.

## 7. NICE TO HAVE

- Stronger re-score prompting after action completion (close the outcome loop more visibly).
- Trade-specific assessment question depth (currently general readiness).
- `/install` "native app store versions coming soon" is fine; minor.
- Surface a subset of the vendor research library to free users as a teaser.

## 8. Feature-claim accuracy matrix

| Claim | Location | Actual | Match? | Correction |
|---|---|---|---|---|
| Free assessment + Starter MetrixScore™ | home, /start, learn | built | ✓ | — |
| Personalized roadmap | results/report | built (`pathActions`/`roadmapProgress`) | ✓ | — |
| Action + progress tracking | dashboard, report | built (device-local `szm_path_complete`, KPI) | ✓ | — |
| Trade-specific guidance | Foundation Builder, /trades | built (10 trade steps) | ✓ | — |
| State-resource routing | Foundation Builder | built (6 states + fallback) | ✓ | — |
| Spanish support | Foundation Builder | UI-chrome only; honest "not fully Spanish" | ✓ | — |
| Cloud backup / account sync | dashboard badges | built but **no sign-in UI** | partial | wire sign-in or label future (should-fix #6) |
| Email updates / sequences | email capture, /api/email-trigger | capture built; **delivery gated/undisclosed** | mismatch | reconcile (should-fix #1) |
| AI coaching / benchmarks | home, platform-ecosystem | **not built** (tierPreview: not-yet) | mismatch | label future (should-fix #3) |
| Vendor research | paid report | built (`vendorCategories`, neutral) | ✓ | — |
| Exports (CSV/PDF) | Foundation Builder | built (injection-safe CSV, escaped HTML) | ✓ | — |
| Account export/delete | /account/privacy | built (RLS-scoped; admin-assisted account delete) | ✓ | — |

## 9. Customer-objection results

Answered well: "does it know my trade/state?" (Foundation Builder trade steps + state resources),
"is this legal advice?" (educational + official-source routing throughout), "what happens to my
info?" (updated Privacy Policy + /account/privacy), "can I use it without an account?" (local-first),
"will my progress be saved?" (device-local + honest sync), "are vendors paid?" (no active affiliate;
disclosed). **Weak/unclear:** "what do I do after the score?" (clear unlock CTA, but the free
post-score next-step into Foundation Builder could be more prominent), "will this actually help me
start?" / "useful after year one?" (depends on paid report depth + the "coming soon" sections),
"is cloud backup real?" (no sign-in UI), "is this only for HVAC?" (all 10 trades present — good).

## 10. Outcome-engine loop evaluation

**Loop exists end-to-end but is partly manual.** Assessment (`/start`+`/assessment`) → Score
(MetrixScore™/results) → Prioritized roadmap (report + `roadmapProgress`) → Action completion
(`szm_path_complete`) → Progress tracking (dashboard + Foundation Builder summary) → Outcome/KPI
capture (`BusinessOutcomeTracker`, **manual entry**) → Re-scoring (retake assessment / 90-day
reassessment). **Weak points:** outcome capture is manual; the link from "completed actions" to a
changed score runs through a manual reassessment rather than automatic re-scoring; re-score
prompting is light. Acceptable for MVP; strengthening re-score prompts + outcome capture is Fix-2/
post-launch.

## 11. Confirmed-safe / working product systems

Build compiles with all intended routes (7 `/learn/[slug]` SSG, `/trades`, `/learn`,
`/foundation-builder`, `/resources`, `/account/privacy`, `/report`, `/dashboard`, `/results`,
`/assessment`, `/start`, `/unlock`, platform/[trade]). Consistent 10-trade taxonomy; 6-state
official routing + fallback; Foundation Builder idempotent trade upgrades, stable IDs, safe
unknown-trade fallback, CSV-injection neutralization, HTML escaping, honest sync badges,
local-save-before-cloud; payment gating server-trusted; export/delete RLS-scoped; no TODO/FIXME/
lorem/placeholder in critical flows; no private data on public pages (per Audit-1A).

## 12. Exact files / systems requiring edits (Fix-2)

- `src/app/api/email-trigger/route.ts` + `growth-8-email-capture-nurture-foundation.md` +
  `src/app/privacy/page.tsx` (reconcile email delivery/consent disclosure).
- `src/app/page.tsx`, `src/app/platform-ecosystem/page.tsx` (future-frame AI coaching/benchmarks).
- `src/app/report/page.tsx` (paid "coming soon" sections).
- `src/app/terms/page.tsx` (and any "The Modern Trades Mentor" → add "LLC").
- Sign-in entry point or honest "coming soon" labeling for account/cloud features.

## 13. Proposed Pre-Launch Fix-2 plan

- **Journey/activation:** decide sign-in entry vs. label account features future; make the
  free post-score path into Foundation Builder more prominent.
- **Trade/state quality:** click-verify the 6×3 official links; consider light trade-specific
  assessment nuance (future).
- **Roadmap/action quality:** strengthen re-score prompts; tie completion to a visible "reassess"
  nudge.
- **Foundation Builder:** none required (verified solid); optional polish.
- **Report:** resolve/replace "coming soon" paid sections.
- **Dashboard:** ensure single clear primary next action.
- **Resources/vendors:** none required (neutral, no active affiliate).
- **Copy/terminology:** standardize "The Modern Trades Mentor LLC"; future-frame AI/benchmarks.
- **Email:** reconcile delivery/consent (the highest-priority Fix-2 item).
- **Errors/empty states:** verified honest in code; manual-test the live failure paths.
- **Mobile/accessibility:** manual device review (Audit-1C) — forms have labels/`sr-only`,
  touch-target classes, disabled states; no code-evident blocker.

## 14. Manual testing still required

Live Supabase with migration `003` applied (sync, export/delete, public email insert, RLS);
real Stripe **test** checkout → paid report unlock; multi-device/browser responsive + tap-target
review; human visual review of report/dashboard/Foundation Builder; click-test all official state
links; contractor beta testers for relevance/clarity; confirm `RESEND_API_KEY` is unset (or the
email/consent model reconciled) before launch.

---

**Next:** **Pre-Launch Fix-2** (required — reconcile email delivery/consent + the should-fix
list), then **Pre-Launch Audit-1C** (visual/accessibility polish).
