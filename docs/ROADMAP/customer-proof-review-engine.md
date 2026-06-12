# Customer Proof / Review Engine — Growth-4 (Active In-App)

**Status:** Active in-app. A real, consent-first feedback prompt is live with
**local/device-side capture**. Public review routing is **intentionally not active yet**
(trust + review-platform compliance). No third-party review integration.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## Active now

- **`src/lib/customerProof.ts`** — model + active local capture:
  `CustomerProofTrigger`, `CustomerFeedbackScore`, `CustomerProofRoute`,
  `TestimonialConsentStatus`, `CaseStudyCandidate`, `ReviewRoutingRecommendation`,
  `CustomerProofPrompt`, `CustomerFeedbackRecord`; helpers `getCustomerProofPrompt`,
  `getReviewRoutingRecommendation`, `getTestimonialConsentCopy`,
  `getCaseStudyCandidateSignal`, `shouldShowCustomerProofPrompt`,
  `getFeedbackStorageKey`, `createCustomerFeedbackRecord`, `saveCustomerFeedbackLocal`,
  `getCustomerFeedbackLocal`.
- **`src/components/CustomerProofPrompt.tsx`** — active client form: usefulness rating →
  optional private written feedback + optional consent-first testimonial/case-study
  interest → **saved on this device** → "Thanks — feedback saved on this device."
- **`src/lib/analytics.ts`** — `feedback_prompt_viewed`, `feedback_score_selected`,
  `testimonial_interest_selected`, `case_study_interest_selected`,
  `product_feedback_submitted` (existing no-op stub).
- **Placement:** live on `/dashboard` (`dashboard_returned`) and `/report`
  (`report_viewed`). Low pressure, dismissible, shows once per device.

## Local storage behavior

Feedback records are saved on the user's device under the `szm_customer_feedback`
key (an array of `CustomerFeedbackRecord`, `storageMode: 'local_device'`), matching the
existing `szm_*` localStorage pattern. **Nothing is sent externally or posted publicly.**
Testimonial/case-study interest is stored as intent only.

## Consent model

Explicit, optional, withdrawable. `getTestimonialConsentCopy()` provides permission,
case-study, contact-later, "never publish without explicit permission / withdraw
anytime," and decline copy. The prompt only records testimonial/case-study **interest**;
**no public use happens without explicit consent.**

## Feedback bands & routing

`positive` · `neutral` · `negative`. Positive → optional, consent-first testimonial/
case-study interest. Neutral → "what would make this more useful?" Negative →
**private** product/support; accepted and used for improvement, **never routed to a
public review page**. `publicReviewAllowed` is `false` for every band.

## Intentionally NOT active yet (and why)

- **Automatic public review posting** — review-platform compliance + trust risk.
- **Public review routing that only sends positive users to review sites** — positive-only
  gating risk (FTC / G2 / Capterra / Google policies).
- **Incentives for positive reviews** — manipulation risk.
- **Publishing testimonials without explicit consent** — consent-first requirement.
- **Third-party review platform integrations** — out of scope for this phase.
- **Automatic emails / SMS / messages** — manual/consent-first only.

## Ethical guardrails (high level)

- **No fake reviews or testimonials.**
- **No positive-only public review gating.**
- **No incentives tied to review sentiment.**
- **No public use of a user's words without explicit, withdrawable consent.**
- **No claim that customer feedback guarantees outcomes.**
- **No legal/tax/financial/licensing advice.**
- Negative feedback goes to private product/support improvement, not public reviews.

## Future (planned, not built)

- Public review invitation for clearly-satisfied, consenting users (no incentives,
  per platform policy).
- Account-synced feedback once auth/cloud sync exist (currently device-only).
- Spanish customer-proof copy (Spanish stays discovery-layer only today).

## Analytics

The five proof events go to the existing **no-op** `trackEvent` stub (dataLayer if
present, else a dev log). No third-party analytics, no network calls, no dependencies.
