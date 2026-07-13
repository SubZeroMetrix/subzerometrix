# Company Constitution

**Status: Permanent governing document.** This is the constitutional source of truth for every future build, AI agent, employee, contractor, partner, investor, and customer-facing decision across the Metrix ecosystem (Metrix Command Center, SubZeroMetrix, The Modern Trades Mentor / Metrix Score). Where this document and any other document disagree, this document wins unless explicitly and formally amended.

Grounded only in verified fact: the founder profile, this repository's existing governing docs (`CLAUDE.md`, `docs/INFRASTRUCTURE.md`, `docs/DEPLOYMENT.md`), shipped product behavior, and build history. Nothing in this document is aspirational marketing language presented as settled fact — where something is a goal rather than a proven reality, it is labeled as such.

## Mission

Build outcome-driven software for trades and service businesses, made by someone who actually worked the trade — not software designed by outsiders guessing at what contractors need.

## Vision

A connected family of ventures — The Modern Trades Mentor / Metrix Score (business-readiness scoring for contractors), Metrix Command Center (the governed AI business operating system), and SubZeroMetrix (parent brand and public marketing surface) — unified by one thesis, growing into a premium, scalable SaaS company rather than a lifestyle tool. This is the stated long-term direction; it is not yet a completed fact, and should not be presented to customers as more mature than it is.

## Core Values

- **Truth over hype.** Never fabricate capability, data, testimonials, user counts, or results. If something isn't real yet, say so — don't imply otherwise.
- **Human approval, always.** No AI in any Metrix product takes an action a human hasn't explicitly approved. This is architectural, not a feature toggle.
- **Build it right the first time.** No shell builds, no placeholder features presented as complete, no scaffolding mistaken for shipped product.
- **Evidence over assertion.** Claims of "done" require verification (a real HTTP check, a real log, a real database row) — not a clean-sounding summary.
- **Long-term thinking over short-term shortcuts.** Structured, staged, audited builds over ad hoc feature addition.

## Long-Term Objectives

1. Ship a governed AI operating system that measurably helps service businesses recover missed revenue and organize operations.
2. Grow a family of connected products under one honest brand without diluting the no-fabrication standard for the sake of any single launch.
3. Scale from founder-led, high-touch build sessions toward durable, documented processes that don't require re-deriving context from scratch every time.

## Company Principles

- **Customer-first philosophy.** Product decisions are evaluated by whether they solve a real problem for the business owner using the product, not by what's easiest to build or most impressive to demo.
- **Human approval philosophy.** Every AI-drafted recommendation — a message, a record change, a next action — passes safety checks and requires explicit human sign-off before it reaches a customer or executes. There is no autonomous mode anywhere in the product line.
- **AI governance philosophy.** AI collaborators (product AI like Buster, and AI development collaborators building the product itself) are held to the same standard: propose, get approval, execute, log, report honestly. Full audit trails and kill switches are non-negotiable wherever AI acts.
- **TruthMode.** The operating discipline used across build sessions: read-only verification before destructive or high-stakes action, explicit proof over inferred success, blockers named plainly rather than worked around silently, and no action taken outside an explicitly scoped, approved boundary.
- **Premium quality standard.** Fortune-500-grade execution is the bar for anything customer-facing — visual quality, copy discipline, technical correctness — even while the company itself is early-stage. Being early-stage is not license to ship sloppy.
- **Ethical standards.** No fake urgency, no fake scarcity, no guaranteed-results language, no fabricated reviews or social proof, no dark patterns in pricing or cancellation.

## Decision Hierarchy

1. **Legal/safety-critical facts** (pricing terms, refund policy, data handling, security) — must be true and verified before publication; never approximated.
2. **This constitution and its four companion documents** (`BRAND_CONSTITUTION.md`, `PRODUCT_PHILOSOPHY.md`, `ENGINEERING_CONSTITUTION.md`, `CUSTOMER_PROMISE.md`).
3. **Repository-level governing docs** (`CLAUDE.md`, `docs/INFRASTRUCTURE.md`, `docs/DEPLOYMENT.md`) — operational detail, must not contradict this document.
4. **Individual build/session instructions** — must operate within the above; a one-off instruction that conflicts with this constitution should be flagged, not silently followed.

## Definition of Success

A build, feature, or release is successful only when it is real (not a shell), verified (proven live, not assumed), honest (no fabricated claim anywhere in its copy or data), and governed (any AI action within it requires human approval and is logged). A release that is fast but fails any of these is not a success by this constitution's definition.
