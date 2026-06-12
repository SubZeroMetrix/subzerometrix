# Customer Proof / Review Engine — Growth-4 (Foundation Built)

**Status:** Foundation built. Ethical, consent-first feedback + proof model with a
low-pressure in-app prompt. **No fake reviews, no incentivized reviews, no positive-
only gating, no automatic public posting, and no public use of a user's words without
explicit permission.** No third-party review-platform integration yet.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-4 built

- **`src/lib/customerProof.ts`** — model: `CustomerProofTrigger`,
  `CustomerFeedbackScore`, `CustomerProofRoute`, `TestimonialConsentStatus`,
  `CaseStudyCandidate`, `ReviewRoutingRecommendation`, `CustomerProofPrompt`;
  helpers `getCustomerProofPrompt`, `getReviewRoutingRecommendation`,
  `getTestimonialConsentCopy`, `getCaseStudyCandidateSignal`,
  `shouldShowCustomerProofPrompt`.
- **`src/components/CustomerProofPrompt.tsx`** — a low-pressure, dismissible
  "Was this useful?" prompt (shows once per device).
- **`src/lib/analytics.ts`** — added `feedback_prompt_viewed`,
  `feedback_score_selected`, `testimonial_interest_selected`,
  `case_study_interest_selected`, `product_feedback_submitted` to the no-op event union.
- UI added to `/dashboard` (trigger `dashboard_returned`) and `/report`
  (trigger `report_viewed`).

## Feedback score bands

`positive` · `neutral` · `negative`.

## Testimonial consent model

Explicit, optional, withdrawable. The prompt offers a positive user an OPTIONAL
testimonial/case-study interest with clear copy: "We never publish your name, quote,
or business without your explicit permission, and you can withdraw it at any time."
`getTestimonialConsentCopy()` provides permission, case-study, contact-later, no-
public-without-permission, and decline strings. `TestimonialConsentStatus` =
`not_asked | granted | declined | interested_contact_later`.

## Case-study candidate model

`getCaseStudyCandidateSignal(trigger, score)` flags a candidate only when feedback is
**positive after real progress** (action completed, KPI saved, reassessment completed,
roadmap progress) — and even then, **consent is required before any use**.

## Negative feedback routing

Negative feedback routes to `private_support_feedback` — privately to product/support,
**never to a public review page**. Negative feedback is **not suppressed**; it is used
for improvement. `publicReviewAllowed` is `false` for every band in this phase.

## Future public review routing (planned, NOT built)

A future phase may invite clearly-satisfied, consenting users to leave a public review
— with no incentives and following each platform's policy. Not wired here.

## Future Spanish customer-proof support (planned, NOT built)

Spanish proof/feedback copy is a future addition. No Spanish customer-proof flow is
wired today; Spanish remains discovery-layer only.

## Ethical guardrails (FTC / G2 / Capterra / Google-style, high level)

- **No fake reviews or testimonials.**
- **No incentivized review manipulation** (no money/discount/gift for a review).
- **No positive-only review gating** — never filter so only happy users are asked in a
  policy-violating way; ask honestly and let people say what they think.
- **No public use without explicit, withdrawable consent.**
- **No automatic public posting; no auto-invites.**
- **No claim that customer feedback guarantees outcomes.**
- **No legal/tax/financial/licensing advice.**
- Negative feedback goes to private support/product improvement, not public reviews.

## Analytics / future tracking

The five proof events are emitted to the existing **no-op** `trackEvent` stub
(dataLayer if present, else a dev log). No third-party analytics, no network calls,
no new dependencies.
