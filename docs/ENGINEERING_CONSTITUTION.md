# Engineering Constitution

**Status: Permanent governing document.** Subordinate to `COMPANY_CONSTITUTION.md`. Operational detail lives in `docs/DEPLOYMENT.md` (release process) and `docs/INFRASTRUCTURE.md` (system architecture) — this document sets the non-negotiable principles those operational docs must follow.

## No Shell Builds

A feature is not "built" if only part of it exists. Every shipped feature needs its full path — UI, data layer, validation, and (where AI is involved) governance/audit logging — not a UI that calls nothing real, or a backend nothing calls. If a feature can't be completed end-to-end in the current scope, it is not shipped partially and presented as done; it is explicitly deferred and labeled as such.

## Build It Right the First Time

Prefer correctness on the first pass over fast-and-fix-later, especially for anything touching payments, authentication, data isolation, or AI-action paths. Rework is acceptable; silently shipping known-wrong behavior is not.

## One Complete Feature

Each unit of work should be a complete, independently verifiable feature — buildable, testable, and provably working end-to-end — rather than a fragment that only makes sense alongside several other unfinished fragments.

## Validation Standards

Every code change must pass, before commit:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build` (production build)

No change is committed with a known-failing validation step.

## Testing Requirements

Where automated tests exist for a given repository, they must pass before commit. Where no test suite is configured (as is currently the case in this repository), correctness must instead be proven through direct verification — real HTTP requests, real log inspection, real database queries — not assumed from a clean build alone.

## Release Process

Governed by `docs/DEPLOYMENT.md`. The core rule: a release is not complete until it is **LIVE VERIFIED**, not merely committed, pushed, or reported as deployed. A GitHub deployment-success status is not sufficient proof by itself — see `docs/DEPLOYMENT.md`'s stale-alias safeguard, which documents a real incident where it wasn't.

## Security

- Service-role keys and other secrets are never committed, never printed to logs/transcripts, and never materialized to disk during verification — use authenticated CLI sessions (`--linked`, name-only `env ls`) instead of fetching raw key values.
- RLS is enabled on all database tables; no public write access without an explicit, reviewed policy.
- Database isolation between distinct systems (e.g., landing-page leads vs. product data) is enforced architecturally, not by convention — see `docs/INFRASTRUCTURE.md`'s documented isolation of `MCC_LEADS_SUPABASE_URL` from the shared affiliate-site database.

## Accessibility

WCAG 2.2 AA is the target standard for all customer-facing pages: skip-to-content links, semantic landmarks, keyboard navigability, sufficient contrast, and meaningful alt text. Accessibility fixes identified in an audit are treated as real defects, not optional polish.

## Performance

Preserve Core Web Vitals: lean bundle size, optimized images (`next/image`, correct `sizes`/lazy-loading), self-hosted fonts to avoid external font-loading waterfalls, minimal unnecessary JavaScript.

## Documentation

Governing and operational documentation must be kept accurate as the system changes — a stale doc (wrong branch name, wrong domain, wrong asset path) is a real defect, not a low-priority cleanup item, because stale documentation is exactly what causes future sessions to re-derive context incorrectly or repeat resolved investigations.

## Technical Debt Policy

Known gaps and deferred work must be recorded explicitly (in commit messages, docs, or both) rather than left silently implicit. It is acceptable to defer something; it is not acceptable to let it look finished.

## Definition of Done

A change is Done only when: it is committed with an accurate message, validated (lint/typecheck/build clean), pushed, actually deployed (verified via the five-stage release process in `docs/DEPLOYMENT.md`), live-verified with real proof, and any relevant governing documentation is updated to match the new reality.
