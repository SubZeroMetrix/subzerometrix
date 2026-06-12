# Product-5 — Guided Business Foundation Builder (Roadmap)

**Status:** Roadmap / documentation only. **Not built.** No feature, code, scoring,
payment, or data change comes from recording this.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®). Future branded/premium concept name (concept only):
**MetrixFoundation™**.

## Strategic purpose

Turn SubZeroMetrix™ into a guided execution system where users track real-world
business-foundation setup steps, understand what each step means, learn how to
complete it, and mark completion over time — like a detailed Excel tracker, but inside
the platform with guidance, status tracking, and future personalization.

This ties directly into the SubZeroMetrix™ outcome-engine loop:
**Assessment → Score → Roadmap → Action → Tracking → Outcome → Re-scoring.**
The Builder should improve **measurable readiness**, not just provide information.

## Feature concept

A detailed guided checklist with: step-by-step instructions, why each step matters,
what "done" looks like, official-source reminders where needed, reference links,
status tracking, notes, priority, estimated time, owner/responsible party, completion
checkbox, next action, last-updated date, and (future) PDF/Excel export, account sync,
and trade/state-specific guidance.

## Core categories

1. Business Identity
2. Domain + Website
3. Business Email
4. DNS + Email Deliverability
5. Legal / Entity Setup
6. Tax / EIN / Official Registrations
7. Banking + Bookkeeping
8. Licensing / Insurance
9. Brand Profiles
10. Google Business Profile
11. Social Media Profiles
12. Review / Customer Proof Foundation
13. Partner / Vendor Accounts
14. Marketing Launch Assets
15. Sales / Pricing Foundation
16. Operations Setup
17. Technology Stack
18. Cybersecurity / Passwords / 2FA
19. Document Storage / Admin Organization
20. Hiring / Subcontractor Readiness
21. Customer Communication Setup
22. Launch Readiness
23. Post-Launch Weekly Review

## Checklist item shape (future data model)

Each item should eventually support:

- `id`
- `category`
- `stepName`
- `description` (plain-language)
- `whyItMatters`
- `whatToDo`
- `howToDo`
- `whatDoneMeans`
- `requiredLinks` / resources
- `recommendedTools` / vendors (neutral; no endorsement unless verified)
- `officialSourceReminder`
- `disclaimer` (legal/tax/licensing, where relevant)
- `priority`
- `estimatedTime`
- `status`
- `completed` (checkbox)
- `notes`
- `referenceLink`
- `owner` (responsible party)
- `lastUpdated`
- `nextAction`

## Quality gate — Quality-1 Platform Standard

Product-5 build work (starting at Product-5A) must pass the **Quality-1 — Platform
Quality, Trust, UX, and Customer Success Standard** (`platform-quality-trust-ux-standard.md`):
answer the 8-question feature gate, keep the Builder an **execution system** (not a content
library), apply the User Simplicity Standard (Start Here · Do This Next · Later · Done ·
Blocked; progressive disclosure, not a checklist wall), honor the Cloud Sync Standard
(below), and support outcome measurement (started/completed/blocked/skipped/revisited/
improved/exported).

## Dependency — Account-2 Cloud Sync Activation Layer

The full Foundation Builder **should not be built as local-only.** The **Account-2 Cloud
Sync Activation Layer** (`account-cloud-sync-activation-layer.md`) should be **completed or
actively wired** before **Product-5B (In-App Foundation Checklist)** and **Product-5C
(Completion Tracking)** become a core customer feature — otherwise a contractor's
foundation progress lives in one browser and is lost if cache is cleared. Account-2I
(Foundation Builder Sync Readiness) is the bridge: design the Foundation Builder data
model **cloud-ready from day one**. Device-local is an acceptable fallback/first step,
**not** the final destination for this progress.

## Future build phases

- **Product-5A** — Foundation Builder Data Model *(built — `src/lib/foundationBuilder.ts`;
  see `product-5a-foundation-builder-data-model.md`. 5 sections, 14 categories, starter
  step catalog, stages/status/priority/completion model, pure helpers, SSR-safe storage at
  `szm_foundation_builder`. Data model only — no UI.)*
- **Product-5B** — In-App Foundation Checklist *(built — `src/components/FoundationBuilderChecklist.tsx`
  at `/foundation-builder`; renders sections → categories → steps, stage controls, local
  notes, progress summary, next recommended step, and an honest `SyncStatusBadge`. Dashboard
  entry card added. Local-first via `szm_foundation_builder`.)*
- **Product-5C** — Device-Local Completion Tracking *(built — items now track `completedAt`
  + `blockedReason`; pure helpers `updateFoundationItem` / `completeFoundationItem` /
  `blockFoundationItem` / `getFoundationCompletionStats` / `getFoundationItemsByStage`; UI
  routes all changes through the helpers, shows completed dates + a blocked-reason input.
  Local-first via `szm_foundation_builder`.)*
- **Product-5D** — Dashboard Foundation Progress Summary *(built — dashboard card shows
  completed/total/percent, blocked count, and next recommended step via
  `getFoundationCompletionStats` + `getNextFoundationItem`; links to `/foundation-builder`.
  Device-local read.)*
- **Product-5E** — PDF/Excel Export *(built — pure dependency-free helpers
  `foundationItemsToCsv` / `foundationItemsToPrintableHtml` (+ `foundationItemsToRows`,
  `FOUNDATION_EXPORT_HEADERS`); checklist UI has Download CSV + Print/Save PDF buttons. CSV
  cells neutralized against formula injection; HTML escaped. Exports user's own local
  progress only, with a pre-export no-secrets reminder.)*
- **Product-5F** — Trade-Specific Foundation Steps *(next)*
- **Product-5G** — State-Specific Official-Resource Routing
- **Product-5H** — Spanish Foundation Builder
- **Product-5I** — Account-Synced Foundation Progress *(sync plumbing ready: Account-2I
  `src/lib/foundationBuilderSync.ts` + the three `cloud_sync_*` tables; populate
  `FOUNDATION_BUILDER_KEYS` from the Product-5 data model to activate, no further wiring)*

## Suggested future feature names

Business Foundation Builder · Guided Foundation Builder · Launch Foundation Tracker ·
MetrixFoundation™ (branded/premium concept only).

## Guardrails

- Educational only. **No legal, tax, financial, or licensing advice.**
- Route users to official state/local/professional sources where needed.
- **No guarantee** of approval, licensing, leads, revenue, rankings, or success.
- **Do not claim cloud sync** unless actually built (Product-5C is device-local;
  account sync is Product-5I, future).
- **Do not claim legal compliance.**
- Recommended tools/vendors are neutral — no "official partner / preferred / approved /
  affiliate" claims unless verified.
- Use **SubZeroMetrix™** and **MetrixScore™** properly; **The Modern Trades Mentor LLC**
  as owner/operator where applicable.
