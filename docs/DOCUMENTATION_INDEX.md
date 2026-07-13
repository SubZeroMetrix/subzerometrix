# Documentation Index

**The master documentation map for this repository.** This repository's history spans three product generations under evolving branding — this index exists so nobody has to re-derive that history from scratch again. Where a document's status is ARCHIVE, its content describes a superseded product and must not be treated as current fact.

## Product generations (why this repo has three eras of docs)

1. **Gen 1 — MetrixScore™ / SubZeroMetrix™** trades-business readiness platform, owned by **The Modern Trades Mentor LLC**. Fully replaced; docs preserved under `docs/archive/`.
2. **Gen 2 — SubZero Metrix** affiliate software-comparison platform, owned by **SubZero Metrix LLC**. Still live today under `/tools`, `/compare`, `/reviews`, `/guides`.
3. **Gen 3 — Metrix Command Center** landing page, owned by **SubZero Metrix LLC**. The current homepage (`/`), live at `www.subzerometrix.com`, marketing the separate MCC product app at `mcc.subzerometrix.com`.

## Governing documents (canonical, read first)

| Document | Purpose | Owner | Status | Last relevance | Superseded by |
|---|---|---|---|---|---|
| `COMPANY_CONSTITUTION.md` | Mission, values, decision hierarchy | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `BRAND_CONSTITUTION.md` | Voice, brand identity, Buster's role, claims policy | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `PRODUCT_PHILOSOPHY.md` | Why Metrix exists, who it serves | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `ENGINEERING_CONSTITUTION.md` | Build/release/quality standards | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `CUSTOMER_PROMISE.md` | What customers can rely on | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `FOUNDER_PROFILE.md` | Repo-local summary; full profile lives in AI memory system | Richard Fritzke | ACTIVE | 2026-07-13 | — |
| `AI_COLLABORATION_GUIDE.md` | Operating discipline for AI collaborators (TruthMode, scope discipline) | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `DOCUMENTATION_INDEX.md` (this file) | Master map of every doc | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |

## Launch readiness documents (Gen 3, current)

| Document | Purpose | Owner | Status | Last relevance | Superseded by |
|---|---|---|---|---|---|
| `LAUNCH_READINESS.md` | Master 20-category launch dashboard | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `LAUNCH_CHECKLIST.md` | Item-level scorecard with objective acceptance criteria | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `LAUNCH_RISK_REGISTER.md` | Blocker register (L-1 through L-10) | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `GO_LIVE_CRITERIA.md` | Formal launch gate (Must/Should/Nice to Have) | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `POST_LAUNCH_PLAN.md` | Immediate post-launch monitoring plan | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |
| `30-60-90_DAY_PLAN.md` | Timed roadmap, 30 days through 12 months | SubZero Metrix LLC | ACTIVE | 2026-07-13 | — |

## Operational documents (Gen 3, current)

| Document | Purpose | Owner | Status | Last relevance | Notes |
|---|---|---|---|---|---|
| `../CLAUDE.md` | AI agent operating instructions for this repo | SubZero Metrix LLC | ACTIVE | 2026-07-13 | Points to the constitution set |
| `INFRASTRUCTURE.md` | GitHub/Vercel/Supabase architecture, verified branch/DB identity audits | SubZero Metrix LLC | ACTIVE | 2026-07-13 | Canonical for repo/deployment identity |
| `DEPLOYMENT.md` | Five-stage release process, stale-alias safeguard | SubZero Metrix LLC | ACTIVE | 2026-07-13 | Canonical release process |
| `ENVIRONMENT.md` | Environment variable reference | SubZero Metrix LLC | ACTIVE | 2026-07-13 | Updated this pass to include `MCC_LEADS_*` vars |
| `ROLLBACK.md` | Rollback procedure | SubZero Metrix LLC | ACTIVE | unknown, generic | References `pre-major-build-1` tag; still applicable |

## Gen 2 (affiliate platform) — REFERENCE, still describes a live part of the site

| Document | Purpose | Owner | Status | Last relevance | Notes |
|---|---|---|---|---|---|
| `README.md` | Repo overview | SubZero Metrix LLC | REFERENCE | stale | Describes only the affiliate platform, not the Gen 3 homepage — accurate as far as it goes, incomplete |
| `LAUNCH-OPERATIONS.md` | Affiliate-platform launch checklist | SubZero Metrix LLC | REFERENCE | Gen 2 launch era | Historical checklist, not re-verified for Gen 3 |
| `LEGAL-COMPLIANCE-GATE.md` | FTC/affiliate legal checklist | SubZero Metrix LLC | REFERENCE | Gen 2 launch era | Applies to affiliate platform only |
| `AFFILIATE-COMPLIANCE.md` | Affiliate disclosure requirements | SubZero Metrix LLC | ACTIVE | ongoing | Governs live `/tools` etc. content |
| `CONTENT-METHODOLOGY.md` | Editorial evaluation criteria | SubZero Metrix LLC | ACTIVE | ongoing | Governs live affiliate content |
| `30-DAY-PUBLISHING-PLAN.md` | Content calendar | SubZero Metrix LLC | REFERENCE | Gen 2 launch era | Historical plan, not a live calendar |
| `MAJOR-BUILD-1-REPORT.md` | Record of Gen 1 → Gen 2 replacement | SubZero Metrix LLC | REFERENCE | historical record | Explains why `docs/archive/` exists |
| `MAJOR-BUILD-2-REPORT.md` | Gen 2 build record | SubZero Metrix LLC | REFERENCE | historical record | — |
| `TESTING/local-testing-checklist.md` | Local dev testing checklist | SubZero Metrix LLC | REFERENCE | Gen 2 era | Generic enough to still be useful |
| `CLAUDE_PROMPTS/README.md` | Empty scaffold for reusable prompts | SubZero Metrix LLC | REFERENCE | n/a | No content yet, generation-agnostic |
| `BRAND-RULES.md` | Legacy brand rules (old logo, old domain typo) | SubZero Metrix LLC | **SUPERSEDED** | Gen 2/early Gen 3 | **Superseded by `BRAND_CONSTITUTION.md`.** Not archived this pass — has an uncommitted, pre-existing working-tree edit from outside this audit that isn't safe to move without losing that in-progress work; flagging supersession here instead. |

## Archived (Gen 1 — MetrixScore™ / SubZeroMetrix™ trades platform, The Modern Trades Mentor LLC)

Full context: `docs/archive/README.md`. All ARCHIVE status, superseded by the Gen 2 replacement (`MAJOR-BUILD-1-REPORT.md`) and, for the current site, by Gen 3 (this documentation set). Preserved for history, not current fact.

| Directory | File count | Canonical replacement |
|---|---|---|
| `archive/ROADMAP/` | 38 files | None — this roadmap was never built; superseded by the Gen 2/3 product direction |
| `archive/SYSTEM/` | 6 files | None — described a scoring engine (`metrixEngine.ts`, `scoring.ts`) that no longer exists in this repo |
| `archive/ARCHITECTURE/` | 2 files | None |
| `archive/AFFILIATES/` | 2 files | Superseded in spirit by `AFFILIATE-COMPLIANCE.md` / `CONTENT-METHODOLOGY.md` (different business model — vendor marketplace for tradespeople vs. software-comparison affiliate links) |
| `archive/STRATEGY/product-roadmap.md` | 1 file | Superseded by `PRODUCT_PHILOSOPHY.md` |
| `archive/DEPLOYMENT/vercel-deployment-notes.md` | 1 file | Superseded by `DEPLOYMENT.md` |

## Conflicts found and resolved this pass

- `BRAND-RULES.md` claimed the canonical logo is `subzero-metrix-logo.png` — that file was deleted by explicit owner instruction; `BRAND_CONSTITUTION.md` now states the correct current assets. `CLAUDE.md` also had one stale reference to `buster-icon.png` (fixed in the prior commit).
- `ENVIRONMENT.md` was missing the `MCC_LEADS_SUPABASE_URL` / `MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY` variables entirely — fixed this pass.
- `docs/archive/DEPLOYMENT/vercel-deployment-notes.md` directly conflicted with `DEPLOYMENT.md` on branch name (`main` vs. `major-build-1`), production URL, and local repo path — resolved by archiving the stale version; `DEPLOYMENT.md` is sole authority on release process going forward.
- No conflicting company-philosophy or engineering-standard documents were found between Gen 2 docs and the new constitution — Gen 2 docs (affiliate compliance, content methodology) describe a narrower operational scope that doesn't contradict the constitution, just predates it.
