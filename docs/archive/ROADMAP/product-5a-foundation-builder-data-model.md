# Product-5A — Foundation Builder Data Model

**Status:** Data model only. **No UI, no routes.** The local-first, cloud-ready data model
for the Guided Business Foundation Builder (`guided-business-foundation-builder.md`). It
activates the Account-2I sync readiness plumbing (`foundation-builder-sync.md`) — once the
Product-5B UI writes items to local storage, they sync with no further wiring.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Guardrails:** educational only — **no legal, tax, financial, or licensing advice**;
> steps prompt action and route to official sources (`officialSourceReminder`). **Never
> stores secrets/credentials/passwords/API keys.** Local-first, SSR-safe.

## What Product-5A built

- **`src/lib/foundationBuilder.ts`** — the canonical Foundation Builder data model:
  catalog (sections → categories → step definitions), the per-user checklist item shape,
  workflow stages, status, priority, completion model, stable ids/keys, and pure helpers.
- **`src/lib/foundationBuilderSync.ts`** — updated to **import** the shared types/keys
  (`FOUNDATION_BUILDER_KEYS`, `FoundationChecklistItem`, `VendorToolItem`,
  `LaunchReadinessItem`) from the model (single source of truth), with backward-compatible
  re-exports. No behavior change to the sync layer.

## Model

- **Stages** (`FoundationStage`): `start_here`, `do_this_next`, `later`, `done`, `blocked`.
- **Status** (`FoundationItemStatus`): `not_started`, `in_progress`, `done`, `blocked`.
- **Priority** (`FoundationPriority`): `critical`, `high`, `medium`, `low`.
- **Completion:** `completed: boolean` is the single source of truth (true when stage `done`).
- **Sections** (5): Identity & Digital, Legal & Financial, Brand & Presence, Operations &
  Sales, Launch & Review.
- **Categories** (14): business identity, domain/website, business email, legal/entity,
  tax/EIN, banking/bookkeeping, licensing/insurance, brand profiles, Google Business
  Profile, operations, pricing/sales, tech stack, launch readiness, weekly review.
- **Step catalog** (`FOUNDATION_STEP_DEFINITIONS`): starter steps across every category,
  each with a stable `id`, `description`, `whyItMatters`, `priority`, `estimatedTime`,
  `defaultStage`, and an `officialSourceReminder` flag for legal/tax/licensing steps.

### Checklist item (`FoundationChecklistItem`)

`id` (= step definition id, stable for idempotent sync), `createdAt`, `updatedAt`,
`category`, `sectionId`, `stepDefId`, `stepName`, `stage`, `status`, `priority`,
`completed`, and a free-text `note` (the user's own; the sync layer screens it for secrets).

## Helpers

- `getFoundationSections()` / `getFoundationCategories()` / `getFoundationStepDefinitions()`
- `createFoundationItemFromDefinition()` / `createDefaultFoundationItems()` — fresh default
  checklist (one item per step definition); pure, writes nothing.
- `setFoundationItemStage()` — move an item to a stage, keeping status/completed in sync.
- `loadFoundationItems()` / `saveFoundationItems()` / `getFoundationItemsOrDefaults()` —
  SSR-safe local-storage contract (`szm_foundation_builder`).
- `getFoundationProgressSummary()` — totals, percent, blocked count, by-stage, by-category.
- `getNextFoundationItem()` — next recommended item by stage order → priority → created.
- Label helpers for stage / status / priority.

## Stable keys / sync readiness

`FOUNDATION_BUILDER_KEYS` (`szm_foundation_builder`, `szm_vendor_tracker`,
`szm_launch_readiness`) is the single canonical definition, consumed by Account-2I. The
checklist item `id` doubles as the sync `local_id`, so backups are idempotent. No sync is
wired by this phase beyond the existing Account-2I readiness — nothing is written until a UI
saves items.

## Not built (by design)

- **No UI / routes / components** — that is **Product-5B**.
- **No migrations** (the three `cloud_sync_*` tables already exist in `002`).
- **No payment / scoring / report-gating / DEV_UNLOCK / deps / env changes.**
- **No vendor/launch tracker UI** — those item shapes exist for Account-2I; dedicated
  trackers are later Product-5 sub-phases.

## Next — Product-5B: In-App Foundation Checklist

Build the in-app checklist UI on top of this model — render sections → categories → steps,
let users move items across stages (Start here / Do this next / Later / Done / Blocked),
add notes, and show progress via `getFoundationProgressSummary()`. Surface a
`SyncStatusBadge` (`entityType="foundation_builder_progress"`) honestly once items are
saved, using the Account-2I sync helper.
