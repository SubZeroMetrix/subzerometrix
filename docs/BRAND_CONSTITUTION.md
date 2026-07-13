# Brand Constitution

*See also: [`COMPANY_CONSTITUTION.md`](./COMPANY_CONSTITUTION.md) · [`PRODUCT_PHILOSOPHY.md`](./PRODUCT_PHILOSOPHY.md) · [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md) · [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md) · [`FOUNDER_PROFILE.md`](./FOUNDER_PROFILE.md) · [`AI_COLLABORATION_GUIDE.md`](./AI_COLLABORATION_GUIDE.md)*

**Status: Permanent governing document.** Subordinate to `COMPANY_CONSTITUTION.md`. Supersedes any conflicting statement in `docs/BRAND-RULES.md` (a legacy, partially stale file describing the earlier affiliate-platform-only brand — kept as historical reference, not authoritative where it conflicts with this document).

## Brand Identity

- **Legal entity:** SubZero Metrix LLC.
- **Product brand:** Metrix Command Center — the governed AI business operating system, live at the public homepage of `www.subzerometrix.com`, with the product application itself at `mcc.subzerometrix.com`.
- **Company/marketing brand:** SubZero Metrix — the parent brand and public marketing surface, which also hosts an independent affiliate software-comparison platform under `/tools`, `/compare`, `/reviews`, `/guides`.
- **Related venture:** The Modern Trades Mentor / Metrix Score (`themetrixscore.com`) — business-readiness scoring for contractors, part of the same founder-led ecosystem.

## Voice

Direct, specific, and operator-grade. Written by and for people who have actually run a service business — not generic SaaS marketing language. Confident without being boastful; the product's real differentiators (approval-gated AI, full audit trail) are stated plainly because they are true, not inflated with adjectives.

## Tone

Honest first, polished second. Never breathless. When something isn't live yet (e.g., SMS/communications), the copy says so plainly ("Coming Soon," "in active development") rather than implying it. This restraint is itself part of the brand's credibility.

## Writing Standards

- No fabricated reviews, testimonials, user counts, or results.
- No guaranteed-income or guaranteed-outcome language.
- No fake urgency or scarcity ("only X spots left," countdown timers on real pricing).
- No unsupported superlatives ("the best," "#1") without a stated, verifiable basis.
- Every claim about product capability must be true of the shipped product at time of publication — not the roadmap.

## Visual Philosophy

Premium, modern, clean software presentation — not generic AI-SaaS gradients-and-stock-imagery. Prefer real product truth (real assets, real copy) over generic decoration. Light mode primary; dark navy sections used deliberately for contrast (hero, deep-dive sections), not as a default aesthetic choice.

## Buster's Role

Buster is Metrix Command Center's AI Chief of Staff — the product's primary AI-facing identity and its most important brand asset after the wordmark itself. Buster is presented as a governed assistant, not an autonomous agent: every reference to Buster's capability (morning brief, end-of-day summary, health score, recommendations) must be paired, implicitly or explicitly, with the fact that nothing Buster recommends executes without human approval. Buster should have real visual presence in customer-facing product marketing (not a single small icon buried in a feature list) — the current homepage gives Buster a dedicated section, hero placement, and footer navigation link as the baseline standard going forward.

## Logo Usage

Two real, approved image assets exist and must be used unaltered — no redrawing, recoloring, cropping, or regenerating:
- `public/brand/metrix-command-center-logo.png` — the primary Metrix Command Center wordmark (navy/blue "M" mark + "METRIX COMMAND CENTER" text).
- `public/brand/buster-ai-chief-of-staff-badge.png` — the Buster identity badge.

The prior `subzero-metrix-logo.png` and generated SVG mark/favicon were retired and removed by explicit owner instruction ("use only those 2, all the other can go") and must not be reintroduced.

## Color Philosophy

The current, live design-token system (Tailwind `brand.*` tokens in `tailwind.config.ts`: navy `#060918`, navy-light `#0C1425`, electric blue `#2563EB`, cyan `#22D3EE`, silver `#94A3B8`) is the authoritative palette. `docs/BRAND-RULES.md`'s color list is legacy/superseded — do not treat it as current without cross-checking `tailwind.config.ts` first.

## Trust Principles

Trust is built through demonstrated restraint (no fabrication, ever) and through explicit trust content — a real Trust & Security section covering human approval, workspace isolation, audit trails, and data ownership, always describing only what is actually true of the shipped product.

## Marketing Rules

- Never publish a capability as live before it is genuinely shipped and verified.
- Never imply autonomous AI action anywhere in marketing copy.
- Any comparison to competitors or "typical AI tools" must be framed around real, defensible differences (the approval gate, the audit trail) — not disparagement or invented statistics about competitors.
- Roadmap items may be mentioned honestly labeled as roadmap ("in active development," "planned") — never presented as available.

## Claims Policy

Every factual claim in customer-facing copy (pricing, trial length, cancellation terms, feature availability, security practices) must be independently verifiable against the actual product/codebase at time of publication. If a claim cannot be verified as currently true, it does not get published — full stop, no exceptions for launch pressure.

## Review/Testimonial Policy

No reviews, testimonials, case studies, or customer quotes may be published unless they are real, attributable, and consented-to by a real customer. Until real customer proof exists, product pages should rely on transparent product truth (what it does, how the governance model works) rather than manufactured social proof.
