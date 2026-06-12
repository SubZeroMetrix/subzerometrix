# Pre-Launch Audit System — SubZeroMetrix™

**Status:** Audit plan / roadmap only. No code, behavior, scoring, payment, gating,
or dependency changes from recording it. These tracks define what a future audit
phase will inspect before launch.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®, unless federal registration is confirmed).

---

## PRE-LAUNCH AUDIT-1A — Security, Legal, Compliance, Privacy & Trust Review

### Audit areas
- Security
- Environment variables
- Client / server boundary
- Supabase usage
- Stripe checkout / webhook / verify-session
- Report gating
- DEV_UNLOCK behavior
- localStorage / sessionStorage usage
- Account / auth / cloud-sync language
- Privacy / data handling
- Legal disclaimers
- Terms / disclaimer / privacy / affiliate disclosure
- Trademark / ownership language
- Affiliate / vendor / review compliance
- Marketing / SEO claims
- Product trust
- Accessibility / basic quality
- Repo hygiene / build validation

### Must flag
- Exposed secrets
- Service-role key exposure
- Payment bypass
- Report unlock bypass
- Production DEV_UNLOCK risk
- localStorage-only proof of payment
- Unsafe client-side trust
- Webhook verification weakness
- Privacy policy gaps
- Cloud-save claims before active sync
- Financial / legal / tax advice risk
- Guaranteed-outcome claims
- Fake partner / vendor / review claims
- Misleading affiliate language
- Improper ® usage
- User-facing use of banned credit-score brand terminology (the credit-bureau brand term that must never appear in user-facing copy)

### Trademark rule
- Use **SubZeroMetrix™** and **MetrixScore™** in visible user-facing branding where appropriate.
- Use **™**, not **®**, unless federal registration is confirmed.
- Do **not** change code identifiers, routes, APIs, file names, or variable names just for trademark formatting.
- Ownership language should identify **The Modern Trades Mentor LLC** as owner/operator where applicable.

---

## PRE-LAUNCH AUDIT-1B — Blindspot QA, 10-Trade Coverage & Product Quality Review

### Trades to audit
1. HVAC
2. Electrical
3. Plumbing
4. Roofing
5. General Contracting
6. Landscaping / Lawn Care
7. Painting
8. Concrete / Masonry
9. Handyman / Home Services
10. Cleaning / Restoration / Specialty Service Contractors

For each trade, inspect:
- Assessment relevance
- Roadmap specificity
- Pricing / job-costing coverage
- Lead generation coverage
- Licensing / insurance / resource disclaimers
- Trade-specific KPIs
- Trade-specific tools / resources
- State-specific considerations across FL, CO, TX, AZ, OH, NC
- Report specificity
- Usefulness to a real contractor

### Contractor persona audit
- Brand-new tradesperson starting a company
- Side-job contractor trying to go legit
- One-truck operator
- Small contractor under $500k revenue
- Contractor with leads but a poor close rate
- Contractor with revenue but weak cash flow
- Contractor hiring a first employee
- Technician becoming an owner
- Contractor expanding into a second trade / service line
- Contractor preparing to buy tools / software / vendors

### Product quality blindspot audit (surfaces)
homepage · assessment · results · unlock · checkout · report · dashboard · roadmap ·
action tracking · outcome plan · score explanation · KPI tracker · tools/resources ·
vendor/tool recommendations · legal/disclaimer pages · mobile experience · trust
elements · customer-proof/review roadmap · SEO/growth roadmap

### Top 25 Blindspots (to be filled during audit execution)
A ranked list of the 25 highest-impact gaps found across trades, personas, and
surfaces — placeholder to be completed when the audit runs.

---

## PRE-LAUNCH AUDIT-1C — Visual UX, Readability, Flow & Eye-Appeal QA

### Audit
- First impression
- Visual hierarchy
- Readability
- Contractor-friendly wording
- Page scanability
- Mobile UX
- Flow: landing → assessment → results → unlock → checkout → report → dashboard → reassessment
- CTA clarity
- Paid / free boundary clarity
- Trust / professionalism
- Conversion clarity
- Retention flow
- Accessibility / usability basics

### Scoring sections (to be rated during audit)
- Mobile Readiness Score
- Readability Score
- Visual Trust Score
- Conversion Clarity Score
- Retention Flow Score

### Ranked lists (to be filled during audit)
- Top 10 visual / UX improvements before launch
- Top 10 flow improvements before launch
- Top 25 blindspots
- Top launch risks
- Recommended next fix phase

---

## Sequencing

These audit tracks run after the Growth phases (see `growth-engine-roadmap.md`):
- Pre-Launch Audit-1A / 1B / 1C
- Pre-Launch Fix-1 — Resolve blockers and launch-trust issues
