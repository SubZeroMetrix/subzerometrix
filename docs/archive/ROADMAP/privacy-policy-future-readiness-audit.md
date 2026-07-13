# Privacy Policy Future-Readiness Audit & Update

**Date:** 2026-06-12 · **File:** `src/app/privacy/page.tsx` · Owner/operator: **The Modern
Trades Mentor LLC**. Branding: **SubZeroMetrix™**, **MetrixScore™** (™, not ®).

Factual update of the Privacy Policy to reflect current MVP data practices while preserving
the future Business Readiness Intelligence roadmap. Kept understandable to an ordinary
contractor; no invented practices; uncertain flows flagged rather than guessed.

## Current MVP collection categories disclosed

Account/contact info; assessment responses; business-readiness & MetrixScore™ information;
roadmap/checklist/milestone/progress; Foundation Builder activity (incl. user notes);
platform usage/interaction; technical/browser/device/diagnostic/security/log; email-consent
& communication-preference; customer feedback; voluntary testimonial/review/case-study/
research participation; referral/acquisition/activation/growth-event via privacy-safe
analytics; and (future) voluntarily provided business-outcome information. Sources are
identified (mostly user-provided; technical/log generated automatically by device +
infrastructure providers). A "do not enter sensitive data in notes" instruction was added.

## Current uses disclosed

The full purpose list was added: provide/operate the platform; create assessments/MetrixScore™/
recommendations/roadmaps/checklists/progress tools; save & synchronize progress (device +
account); personalize guidance from user-provided context; maintain accounts & support;
improve functionality/UX; measure performance/reliability/adoption/effectiveness; protect
security/prevent abuse; communicate on request/consent; develop new tools/features/integrations/
services/resources; internal analytics/product research/quality evaluation; evaluate whether
milestones/recommendations are associated with improved outcomes; create aggregated/de-identified
analytics/benchmarking/research/industry insights; and legal compliance.

## Future analytics & benchmarking rights preserved

Yes. The policy preserves the right to develop readiness/risk/momentum/growth indicators,
benchmarking, outcome analysis, and industry-trend insights, and to compare milestone
completion with voluntarily reported outcomes — **without** claiming such findings exist today.
A "Future Evolution of Our Services" section uses the required forward-looking language and is
explicitly **not** a blanket authorization for unrestricted use.

## Aggregated / de-identified data language added

Yes — a dedicated section states: "de-identified" ≠ "anonymous"; reasonable measures will be
used to prevent association with an individual or business; no intentional re-identification
except where permitted/required for security, compliance, testing, or legal purposes;
aggregated/de-identified info may be retained/used for lawful research, analytics, benchmarking,
product development, operational improvement, and industry insight; and **no speculative
benchmarking/outcome claims are made now** (future publication only with sufficient reliable
data + documented, supportable methodology, never identifying individuals/businesses).

## Unsupported absolute promises removed / corrected

- Removed the loose use of "anonymized" (replaced with "aggregated or de-identified" + the
  de-identification caveat).
- Corrected "database access restricted to server-side code only" → accurate RLS owner-scoping
  with public-key + session (no service-role in browser); added insert-only marketing-list note.
- Softened "100% secure"/headers wording to the honest "no method is completely secure; we
  cannot guarantee absolute security" form.
- Corrected the **email-delivery** disclosure: removed the inaccurate "Resend or similar"
  processor; the policy now states no automated marketing-email delivery system is operating
  yet and that the provider will be named once configured.
- Corrected the **affiliate** disclosure: removed the present-tense "we may receive a
  commission / our pages contain affiliate links"; now states there are **no active** affiliate
  or paid vendor relationships and that any future ones will be disclosed.
- Added a "Your Choices" section (access/export/delete/preferences) reflecting the real
  Account-2K self-service export and cloud-data deletion, the separate device-clear, and the
  **admin-assisted (not automated)** sign-in-account deletion limitation.
- Named **The Modern Trades Mentor LLC** as owner/operator and added a concrete contact
  (info@subzerometrix.com); set effective date "June 12, 2026" with an update process.
- The legally-required state-law sale/targeted-ad disclosures (TDPSA/CPA/OCPA/FDBR rights) were
  **retained** as accurate, current-behavior disclosures (no data selling, no targeted ads).
- No prohibited absolute promises were introduced (no "never use analytics/AI/benchmarking/
  share/retain/combine"; no "100% private/completely secure/fully protected"). No user-facing
  data-selling marketing slogan remains in the policy.

## Processor / data-flow disclosures still needing confirmation

- **Email-delivery provider:** none configured — confirm and name before any marketing send,
  with double opt-in + unsubscribe.
- **Analytics:** `trackEvent` can push to `window.dataLayer` if a tag manager is present.
  None is configured today; confirm before adding any third-party tag/analytics and obtain
  consent where required.
- **Vercel / Supabase / Stripe** are the confirmed processors; verify the production Supabase
  project, RLS, and Stripe live mode at deploy.
- **Retention schedule** ("up to 3 years after last activity") is a stated aim — confirm the
  operational deletion mechanism before relying on it.
- **Sales Tax Notice** content is unchanged and dated; confirm with a tax professional.

## Attorney review recommendation

**Yes — attorney review is recommended before public launch.** This update is drafted to be
factual and conservative, but state-privacy-law applicability (TDPSA/CPA/OCPA/FDBR), the
de-identification/benchmarking provisions, retention, children's-privacy, and the future
analytics/AI provisions are legal-sensitive and should be reviewed by qualified counsel
against the actual production data flows and processor agreements.

## Validation

`npx tsc --noEmit` and `npm.cmd run build` pass. No restricted systems changed (copy/policy
only); no payment/Stripe/scoring/RLS/migration/dependency/env changes.
