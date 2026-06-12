# Customer Proof / Review Engine — Future Build Backlog

**Status:** Backlog / not started. This is a planning doc for a future phase. No code,
UI, scoring, payment, or data writes are implemented by adding this file.

## Why

SubZeroMetrix™ helps contractors build a business; the platform should capture and
ethically surface proof that it works — satisfaction, testimonials, and case studies —
while routing unhappy customers to support and product improvement instead of public
reviews.

## Scope (planned components)

1. **In-app feedback checkpoints**
   - Lightweight prompts at natural moments (after results, after completing an outcome
     step, at reassessment) asking "was this helpful?"
   - Captured locally first (device), account-synced later — same honest local→cloud
     pattern as the retention foundation.

2. **Customer satisfaction score**
   - A simple satisfaction signal (e.g., a 1–5 or thumbs scale) tracked over time.
   - Internal product metric first; never presented as part of the MetrixScore™.

3. **Testimonial capture**
   - Opt-in flow for a contractor to share a short written testimonial.
   - Explicit consent required before any storage or display.

4. **Case-study candidate capture**
   - Flag accounts that show meaningful progress (score improvement, completed plans)
     as potential case-study candidates for outreach — internal only until consented.

5. **Ethical public review routing**
   - Only invite clearly-satisfied users to leave a public review.
   - No incentives for reviews; follow each platform's review policy.
   - Never filter to only positive reviewers in a way that violates platform rules —
     invite genuinely-satisfied users and let them say what they think.

6. **Review consent / permission**
   - No name, quote, business, or testimonial is shown publicly without explicit,
     revocable consent. Store consent state and honor revocation.

7. **Negative-feedback → support / product-improvement flow**
   - Dissatisfied feedback routes privately to support and the product backlog, NOT to
     a public review prompt — fix the problem first.

## Guardrails (apply when built)

- Honest copy only — no "guaranteed", "benchmarked", "predictive" framing.
- **Never use credit-bureau / credit-score brand names** in any user-facing copy
  (platform-wide permanent rule).
- No fake testimonials, no purchased reviews, no "approved/preferred vendor" implications.
- Consent-first: nothing public without explicit permission.
- Keep separate from the MetrixScore™ engine — satisfaction is a product metric, not a
  readiness score input.

## Out of scope for now

No implementation, UI, schema, or writes. This is a backlog placeholder to be picked up
in a dedicated future phase after the current retention + outcome-plan work.
