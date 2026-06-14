# SubZeroMetrix — Curated 108 Resource Launch-Set Import Audit (Wave 7 Checkpoint 5)

> **Purpose.** The authoritative audit of the curated launch-set import. It parses, deduplicates,
> classifies, and maps the **108** curated records from the workbook into the canonical Wave 5–6
> resource architecture **without publicly activating any provider** and **without importing the
> 2,063-item backlog.** The machine-readable mapping lives in
> `src/lib/metrix/resourceLaunchImport.ts` (`RESOURCE_LAUNCH_IMPORT`) and is test-enforced by
> `src/lib/metrix/__tests__/wave7-resource-launch-import.test.ts`.

- **Branch:** `feature/metrix-wave7-full-site-ux-discovery`
- **Checkpoint:** 5 — Curated 108-Resource Integration (data/audit only; no UI, no redirect activation)

---

## 1. Workbook metadata

| Field | Value |
| --- | --- |
| Path | `docs/data/SubZeroMetrix_Resource_Directory_Master_Catalog_and_Audit.xlsx` |
| Size | 120,364 bytes |
| SHA-1 | `a1fc6f9c752f718cc06810fe61cd9cb1c84366ce` |
| Format | OOXML (.xlsx); inline strings; namespaced `x:` elements |

### Sheets & row counts
| Sheet | Total rows | Data rows (excl. header) | Cols |
| --- | --- | --- | --- |
| Executive Summary | 10 | 9 | 2 |
| **Verified Launch Set** (curated) | 109 | **108** | 14 |
| Master Catalog (backlog) | 2,064 | **2,063 — NOT imported** | 10 |
| Verification Workflow | 11 | 10 | 4 |
| Roadmap Mapping | 4 | 3 | 3 |

**The curated 108 records are in the sheet `Verified Launch Set`** (table `VerifiedLaunchTable`,
range `A1:N109`). The Executive Summary sheet independently confirms: *“Master catalog items
extracted = 2063”*, *“Launch-set records with official destinations identified = 108”*, *“Only
records with Verified status should be clickable.”*

### Curated-sheet header (14 columns)
`Resource ID · Provider / Resource · Category · Subcategory / Function · Trades Served ·
Business Stages · States / Regions · Official URL · Resource Type · Verification Status ·
HTTP Status · Last Reviewed · Important Limitations · Disclosure Text`

### Parse & data-quality results
- **All 108 rows parsed without error.**
- **Blank required fields (Resource ID, Provider, Category, Official URL):** 0.
- **Duplicate workbook IDs:** 0 (`VER-001` … `VER-108`).
- **Duplicate official URLs:** 0.
- **Duplicate normalized domains:** 0.
- **Duplicate normalized provider names:** 0.
- **Last Reviewed present:** 108/108 (`2026-06-14`). **Disclosure Text present:** 108/108.
- **Workbook `Verification Status`:** all 108 = `"Verified - official destination identified"`.
- **Workbook `HTTP Status`:** all 108 = `"Not continuously monitored"`.

> **Critical interpretation.** “Verified – official destination identified” means only that a
> destination was **identified** — it is **not** publication verification. Because every record’s
> HTTP status is **“Not continuously monitored,”** the Wave 6 **active/healthy-link gate is unmet.**
> Therefore **no curated record is public-eligible** in this checkpoint.

---

## 2. Existing repository inventory (cross-check sources)

Each curated record was cross-checked against the canonical + legacy sources:
`vendorCategories.ts` (vendors → `vendor:<id>`), `affiliates.ts` (partners → `affiliate:<id>`),
`publicResources.ts` (guides → `guide:<slug>`), `stateResources.ts`,
`metrix/resourceRegistry.ts`, `metrix/licensingSources.ts`, `metrix/licensingPathways.ts`,
`metrix/licensingRouting.ts`.

Extracted signals: **180 distinct existing official domains** and **160 distinct normalized
provider names.** The canonical registry that accepted records map onto is
`metrix/resourceRegistry.ts` (`vendor:` / `affiliate:` / `guide:` IDs) and, for licensing
authorities, the `metrix/licensingSources.ts` / `stateResources.ts` references.

---

## 3. Deterministic deduplication method

- **Primary signals:** canonical resource ID, canonical vendor ID, **normalized official domain**,
  normalized destination URL.
- **Secondary signals:** normalized provider name, category, resource type.
- **URL/domain normalization:** lowercased; protocol, `www.`, path, query string, and fragment
  stripped; trailing punctuation removed → registrable host.
- **Name normalization:** lowercased; `&`→“and”; punctuation removed; company suffixes
  (`inc/llc/corp/co/ltd/company/the`) dropped; whitespace collapsed.
- **Rule honored:** records are **not** merged on name similarity alone — a name match without a
  domain match is **held for review**, not merged.

---

## 4. Dispositions — every curated record accounted for exactly once

| Disposition | Count | Meaning |
| --- | ---: | --- |
| `reuse_existing` | **29** | official domain **and** provider name match an existing canonical record |
| `merge_into_existing` | **12** | official domain matches an existing canonical record; enrich with launch metadata |
| `create_new` | **66** | no domain/name match — recorded as a **draft**, not public |
| `hold_for_review` | **1** | provider name matches an existing record but the domain differs — confirm before merge |
| `exclude` | **0** | — |
| **Total** | **108** | ✅ each curated record has exactly one disposition |

- **Existing canonical IDs win.** Workbook IDs (`VER-*`) are retained only as
  `workbookResourceId` source references; they never become canonical IDs.
- **Canonical IDs resolved:** 37 records resolved to a concrete `vendor:`/`affiliate:` ID.
  The remaining 4 domain matches (`VER-011`…`VER-014`) are **state licensing authorities**
  (Arizona ROC, NC Licensing Board, Ohio CILB, Texas TDLR) already present as official
  licensing/state references — matched by domain, canonical resource ID left `null` with a note
  (they are licensing-source references, not vendor/affiliate resources).

### Conflicts
| Conflict type | Count |
| --- | ---: |
| Workbook-internal duplicates (ID / URL / domain / name) | **0** |
| Canonical **ID conflicts** (`VER-*` vs existing IDs) | **0** |
| **URL / domain conflicts** | **0** |
| **Name / alias conflicts** (name matches, domain differs → held) | **1** |

---

## 5. Truthful verification mapping

The workbook’s “official destination identified” is recorded as the internal state
`verificationStatus: 'destination_identified'` for all 108 — **not** `approved_for_publication`.
Because the active/healthy-link gate is unmet, **`publicationStatus: 'held_for_review'` for all
108**, and each record carries `pending_live_link_check` (plus, where applicable,
`pending_commercial_status_confirmation`, `pending_regulated_category_disclosure`, and
`pending_geographic_review`) in `conflictNotes`.

| Hold reason | Count |
| --- | ---: |
| `pending_live_link_check` (all records) | **108** |
| `pending_commercial_status_confirmation` (commercial-status holds) | **86** |
| `pending_regulated_category_disclosure` (regulated-category holds) | **46** |
| `pending_geographic_review` (supplier/local availability) | **13** |

> No affiliate, referral, reseller, sponsorship, or partnership status was invented. Where the
> workbook reported a “partner/affiliate path … terms must be verified,” the record is held with a
> `pending_commercial_status_confirmation` note — it is **not** marked as an affiliate.
> Government / nonprofit / official-free resources (23 records) follow a lighter commercial review
> but still require a live-link + freshness check, so they too remain held in this checkpoint.

---

## 6. Commercial neutrality

- `publicationStatus` is **identical (`held_for_review`) for commercial and free/government
  records alike** — commercial status does not gate publication.
- The import map carries **no** `relevance` / `ranking` / `score` / `priority` field, so commercial
  status cannot bias MetrixScore, Metrix Priority, licensing guidance, pathway ordering,
  applicability, recommendation relevance, or recommendation-quality ranking (test-enforced).
- Free government options, nonprofit options, association resources, licensing authorities, and
  official agency links are preserved (held, never excluded); “use-another-provider” remains a
  property of the Wave 6 ecosystem model, untouched here.

---

## 7. Import boundary

- Imported only the **108** accepted, deduplicated curated records (as held import metadata).
- The **2,063-item Master Catalog backlog was NOT imported** (`MASTER_CATALOG_IMPORTED = false`,
  `MASTER_CATALOG_BACKLOG_SIZE = 2063`). It remains an unpublished verification backlog.
- Tracked redirects were **not** activated. Flags `expanded_resource_catalog`,
  `verified_launch_resources`, and `tracked_resource_redirects` remain **default OFF.**
- The published ecosystem catalog (`getPublishedEcosystemCatalog()`) remains **empty**
  (test-enforced) — **no provider was publicly activated.**

---

## 8. Tally summary

| Metric | Value |
| --- | ---: |
| Curated records found / accounted for | 108 / 108 |
| Reused | 29 |
| Merged | 12 |
| Newly created (draft) | 66 |
| Held for review | 1 |
| Excluded | 0 |
| Workbook-internal duplicates | 0 |
| Canonical ID conflicts | 0 |
| URL/domain conflicts | 0 |
| Name/alias conflicts | 1 |
| Regulated-category holds | 46 |
| Commercial-status holds | 86 |
| **Public-eligible** | **0** |
| **Pending verification** | **108** |
| Free/official/government/nonprofit alternatives preserved | 23 |

**Confirmations:**
- ✅ Every curated record is accounted for **exactly once** (108 unique workbook IDs).
- ✅ The **2,063-item backlog was not imported.**
- ✅ **No provider was publicly activated;** the published catalog is empty.
- ✅ Commercial status does not alter recommendation relevance, ranking, or any canonical
  intelligence (eligibility/ranking read zero commercial fields — Wave 6 invariant, carried).

---

## 9. Artifacts

- `docs/RESOURCE-LAUNCH-SET-IMPORT-AUDIT.md` (this file).
- `src/lib/metrix/resourceLaunchImport.ts` — machine-readable mapping
  (`RESOURCE_LAUNCH_IMPORT`, `RESOURCE_LAUNCH_IMPORT_SOURCE`, `summarizeLaunchImport`) with fields:
  `workbookResourceId · canonicalResourceId · canonicalVendorId · providerName · normalizedDomain ·
  resourceType · disposition · matchReason · matchConfidence · verificationStatus ·
  publicationStatus · conflictNotes`.
- `src/lib/metrix/__tests__/wave7-resource-launch-import.test.ts` — 16 deterministic tests.

The workbook itself remains a **non-runtime** data artifact under `docs/data/` (it is not imported
by any application module — only this derived mapping is).
