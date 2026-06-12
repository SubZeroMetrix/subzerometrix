# Quality-1 — Platform Quality, Trust, UX, and Customer Success Standard (Roadmap)

**Status:** Roadmap / documentation only. **Not a feature.** This is the operating
standard every future SubZeroMetrix™ build is judged against. No feature, code, scoring,
payment, or data change comes from recording this.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## Strategic purpose

A platform operating standard so every feature is judged against **customer usefulness,
simplicity, legal/trust safety, cloud-sync readiness, measurable outcomes, and ethical
growth** — keeping the product simple, useful, ethical, legally safer, and outcome-focused
as it grows.

## Core product rule

**SubZeroMetrix™ must not become a content library. It must remain an execution system:**

**Assessment → Score → Roadmap → Action → Tracking → Outcome → Re-scoring.**

Information exists only to drive a tracked action that improves **measurable readiness**.
If a feature only adds reading material, it fails this standard.

## The 8-question feature gate

Every major feature must answer all eight before build:

1. **What does the user do?**
2. **Why does it matter?**
3. **What does "done" mean?**
4. **How does the user track progress?**
5. **Where is the progress saved?** (device-local fallback and account-sync path)
6. **What is the next action?**
7. **What risk/trust disclaimer is needed?**
8. **How does it improve readiness or outcomes?**

A feature that cannot answer these is not ready to build.

---

## Required quality pillars

### 1. User Simplicity Standard

- Use simple flow states: **Start Here · Do This Next · Later · Done · Blocked.**
- Avoid overwhelming checklist walls.
- Use plain language (field-tested, direct — no corporate filler or hype).
- Keep every page action-oriented.
- Use **progressive disclosure** — reveal depth on demand instead of dumping everything
  at once.

### 2. Cloud Sync Standard

Every major checklist / tracker / progress flow must eventually support one honest status:

- **Saved on this device**
- **Synced to your account**
- **Sync unavailable**
- **Sign in to back up progress**

Device-local storage is allowed as a fallback, but **core progress features should not
remain local-only.** Pairs with `account-cloud-sync-activation-layer.md` (Account-2) —
which is the infrastructure phase that activates these statuses. Never show "Synced to
your account" until a write is confirmed.

### 3. Trust / Legal Safety Standard

- **Educational only.**
- **No legal, tax, financial, or licensing advice.**
- Route users to **official state/local/professional sources.**
- **No guaranteed** business success, leads, revenue, rankings, licensing, or approval.
- **No fake reviews or testimonials.**
- **No fake partnerships or endorsements.**
- **No public use of user feedback without consent.**
- **No affiliate/vendor claims unless verified.**
- **No hidden AI prompt injection.**
- **No doorway pages or keyword stuffing.**

### 4. Customer Proof Standard

**Allowed:**

- Private feedback
- Usefulness rating
- Testimonial interest
- Case-study interest
- Explicit consent

**Not allowed until properly reviewed:**

- Automatic public review posting
- Positive-only public review routing
- Incentives for positive reviews
- Publishing testimonials without consent

Pairs with `customer-proof-review-engine.md` (Growth-4).

### 5. Partner / Vendor Trust Standard

**Allowed:**

- Partner interest
- Resource sharing
- Community distribution
- Vendor/resource fit

**Not allowed unless confirmed in writing:**

- "Official partner"
- "Preferred vendor"
- "Approved vendor"
- "Sponsor"
- Affiliate commission claim
- Endorsement claim

Pairs with `partner-vendor-association-distribution-system.md` (Growth-5).

### 6. Security / Privacy Standard

- **No exposed secrets** (anon key only in the browser; service-role key server-only).
- **Supabase RLS required** for every exposed cloud table (owner-only).
- **No PII-heavy sync without a privacy review.**
- **No third-party tracking scripts** until a consent/compliance review.
- **No ad pixels or retargeting** in the current phase.
- **No invasive tracking.**
- **Clear data-storage labels** everywhere progress is saved.

### 7. Public Content Standard

- Every public page must provide **real practical value.**
- **No thin SEO pages.**
- **No doorway pages.**
- **No fake "best vendor" claims.**
- Use structured data **only where truthful.**
- Build for **helpful, people-first content.**
- Public tools must solve a **real user problem.**

### 8. Spanish Expansion Standard

- Spanish **discovery** is active (see `spanish-public-discovery-layer.md`).
- **Do not claim a full Spanish platform until built.**
- Future Spanish features should prioritize, in order: **assessment entry → result
  explanation → starter guidance** — before full report/dashboard translation.

### 9. Outcome Measurement Standard

Every major feature should support future measurement of:

- started
- completed
- blocked
- skipped
- revisited
- improved
- exported / backed up (if relevant)

These map to the privacy-safe, device-local growth analytics foundation
(`acquisition-activation-analytics-foundation.md`, Growth-6) — non-PII only.

### 10. Feature Ranking Standard

Score future features **1–5** on each of eight axes (max 40):

- Customer Value
- Trust / Legal Safety
- Ease of Use
- Outcome Impact
- Cloud Sync Need
- Build Complexity *(score 5 = simplest/lowest risk to build)*
- Growth Impact
- Defensibility

**Decision rule:**

| Total | Decision |
|---|---|
| 34–40 | Build now |
| 28–33 | Build soon |
| 20–27 | Roadmap / validate first |
| Under 20 | Park it |

---

## Current top priority ranking

In recommended order (subject to the ranking rule above):

1. **Account-2 — Cloud Sync Activation Layer** (`account-cloud-sync-activation-layer.md`)
2. **Quality-1 — Platform Quality Standard** (this doc)
3. **Product-5 — Guided Business Foundation Builder** (`guided-business-foundation-builder.md`)
4. **Growth-7 — Public Tool / Resource Page Engine** (future)
5. **Email Capture + Nurture Foundation** (future; not yet specced)
6. **Spanish-2 — Assessment Entry + Results Preview** (future; per the Spanish Expansion Standard)

## Dependencies

- **Quality-1 depends on Account-2** (Cloud Sync Activation Layer) being on the roadmap —
  the Cloud Sync Standard (pillar 2) only has teeth once Account-2 exists. Account-2 has
  been added (`account-cloud-sync-activation-layer.md`).
- Quality-1 is a **gate applied before Product-5A** (Foundation Builder) build work begins,
  so the Foundation Builder is designed simple, cloud-sync-ready, and outcome-measured
  from day one.

## Guardrails

- Roadmap/standard only — **no feature built, no code/scoring/payment/data change.**
- Every restricted term in this doc appears **only** as a negated guardrail, an
  allowed/not-allowed trust list, or a future sync-status label — never as an active claim.
- **Do not change** payment, Stripe, checkout, webhook, verify-session, DEV_UNLOCK, report
  gating, scoring math, RLS, package/dependencies, or `.env.local`.
- **No banned credit-score comparison terminology.**
- Use **SubZeroMetrix™** and **MetrixScore™** properly; **The Modern Trades Mentor LLC**
  as owner/operator.
