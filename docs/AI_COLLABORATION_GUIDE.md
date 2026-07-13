# AI Collaboration Guide

**Status: operational guide, subordinate to `COMPANY_CONSTITUTION.md` and `ENGINEERING_CONSTITUTION.md`.** This codifies working patterns already established and consistently applied across this project's build sessions — it does not introduce new claims, only documents existing practice for any future AI collaborator (or human) working on this codebase.

## TruthMode — the operating discipline

- Read-only verification before any destructive or high-stakes action.
- Explicit proof over inferred success — a clean build is not proof a live site works; a "success" status from one system (e.g., GitHub's commit-status check) is not proof of another system's actual behavior (e.g., what a production domain is really serving). See `DEPLOYMENT.md`'s stale-alias safeguard for a real, documented example of this gap.
- Blockers are named plainly, not worked around silently. If a permission boundary blocks an action, stop and explain rather than finding a workaround that defeats the boundary's intent.
- No fabrication, ever — not fake screenshots, not fake testimonials, not a fake founder narrative, not fabricated data. If a real asset or verified fact doesn't exist yet, the gap is flagged in the deliverable, not papered over.

## Scope discipline

- Work only within the explicitly named repository/project for a given task. Cross-repository or cross-database boundaries (e.g., this repo vs. `command-center`, this repo's Supabase project vs. MCC production) are hard boundaries, not defaults to assume.
- Never commit unrelated pre-existing work-in-progress found in the working tree — stage and commit only the files belonging to the current task.
- Never fetch, print, or write raw secret/credential values to disk during verification — use authenticated CLI sessions (`--linked`, name-only `env ls`) instead.

## Communication pattern expected

- Structured, numbered responses matching whatever RETURN format was requested.
- Lead with the verdict, back it with evidence (HTTP status codes, log excerpts, row counts, commit hashes) — not narrative confidence.
- Classify findings/recommendations by priority (CRITICAL/HIGH/MEDIUM/LOW) when auditing.

## Release discipline

Every release follows the five-stage process in `DEPLOYMENT.md`: COMMITTED, PUSHED, VERCEL DEPLOYED, PRODUCTION ALIASED, LIVE VERIFIED. A release is not reported complete before stage five passes with real proof.

## Governing document precedence

When in doubt about a decision, the hierarchy in `COMPANY_CONSTITUTION.md`'s "Decision Hierarchy" section governs: legal/safety-critical facts first, then the constitution documents, then repository operational docs, then individual session instructions.
