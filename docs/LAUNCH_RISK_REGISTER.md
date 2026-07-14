# Launch Risk / Blocker Register

*See [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) and [`GO_LIVE_CRITERIA.md`](./GO_LIVE_CRITERIA.md). Cross-referenced against [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md) (privacy/legal risks), [`INFRASTRUCTURE.md`](./INFRASTRUCTURE.md) (isolation/security risks), and [`DEPLOYMENT.md`](./DEPLOYMENT.md) (release-process risks) — no contradictions found between this register and those documents.*

## Critical (launch-blocking)

### L-1 — RESOLVED — Legal review of combined domain content
- **Description:** This domain (`www.subzerometrix.com`) carries both the original affiliate-platform legal content and Metrix Command Center marketing/pricing/lead-capture content. `/terms` and `/privacy` were updated with new disclosures (MCC pricing/trial/cancellation summary, third-party processors, cross-domain routing, Vercel Analytics) and marked `[DRAFT — ATTORNEY REVIEW REQUIRED]` pending review.
- **Impact:** Legal/compliance exposure if the disclosures were inaccurate or incomplete.
- **Severity:** was CRITICAL, now RESOLVED.
- **Owner:** Founder.
- **Resolution:** Owner (Richard Fritzke) confirmed directly that attorney review of this content has already been completed and approved. The `[DRAFT — ATTORNEY REVIEW REQUIRED]` markers were removed from `/terms` and `/privacy` on his explicit instruction; the underlying factual content (pricing, cancellation terms, third-party processors, cross-domain routing, Vercel Analytics disclosure) is unchanged from what was reviewed.
- **Verification:** Explicit owner statement recorded here, per this document's own verification requirement ("written sign-off or explicit founder acceptance"). No independent attorney documentation was provided to or reviewed by this session — this entry records the owner's representation, not a document seen directly.
- **Classification: RESOLVED.**

## High

### L-2 — No Search Console / Bing Webmaster verification
- **Description:** Sitemap and robots.txt are correct and live, but neither search engine has confirmed ownership or received the sitemap submission.
- **Impact:** Indexing timeline is unmanaged; organic discovery delayed.
- **Severity:** HIGH.
- **Owner:** Founder.
- **Resolution:** Verify ownership in both consoles, submit sitemap.
- **Verification:** Coverage report showing indexed pages in both consoles.

### L-3 — No email provider configured
- **Description:** New leads are captured and stored, but no one is notified. `EMAIL_PROVIDER`/`EMAIL_PROVIDER_API_KEY` are unset.
- **Impact:** Real leads could sit unnoticed in the database.
- **Severity:** HIGH.
- **Owner:** Founder.
- **Resolution:** Configure a real email provider and wire owner notification on new-lead insert.
- **Verification:** A real test lead triggers a real received email.

### L-4 — Accessibility not independently verified
- **Description:** A skip link was added, but keyboard-only navigation, screen-reader behavior, and color contrast have not been independently measured — only inferred from design tokens and code review.
- **Impact:** Real accessibility barriers could exist undetected; WCAG 2.2 AA is claimed as a target, not yet proven.
- **Severity:** HIGH.
- **Owner:** Founder.
- **Resolution:** Manual keyboard-only pass, screen-reader pass, and a real contrast-checker run against the live site.
- **Verification:** Documented pass/fail results per check.

### L-5 — Commercial readiness depends on a repository out of this audit's scope
- **Description:** This landing page correctly routes to `mcc.subzerometrix.com/signup`, but whether MCC's own billing/Stripe flow is production-live is governed by the `command-center` repository, which this audit did not (and should not, per standing project boundaries) verify.
- **Impact:** A visitor could complete this page's funnel and hit an unverified downstream flow.
- **Severity:** HIGH (from this repo's visibility), but resolution is outside this repo.
- **Owner:** Founder (cross-repo coordination).
- **Resolution:** A real signup test run against `command-center`'s current state, not addressable from this repository.
- **Verification:** Out of scope for this document — should be tracked in `command-center`'s own launch documentation.
- **Status update (this pass):** A scoped, read-only audit of `command-center` was authorized and performed for this task. Confirmed via direct code review: `createCheckoutAction` implements a real Stripe Checkout session (`mode: "subscription"`, `trial_period_days: 7` — matches the advertised 7-day trial), Founder CRM requires an atomically-redeemed founder code with 100-seat cap enforcement *before* any Stripe session is created, `allow_promotion_codes: false` (promo codes are not supported — not advertised anywhere either, so not a contradiction), checkout requires an authenticated session. The webhook handler (`app/api/webhooks/stripe/route.ts`) verifies Stripe's signature, is idempotent (keyed on `event.id`), rate-limited, and writes via a service-role-only RPC. Cancellation runs through Stripe's own hosted Billing Portal, gated by a real `get_my_entitlement_v0` entitlement check. **All of this is real, coherent, and well-built code — not a shell.** However: `STRIPE_SECRET_KEY` is **not set** in `command-center`'s local `.env.local` (checked existence only, no value read), so neither a local nor a live checkout could be executed or tested this pass, and production Vercel environment-variable state for that project was not checked (out of this repo's access). **Classification: TECHNICALLY VERIFIED (code-level) / OWNER ACTION REQUIRED (live end-to-end test + confirm production Stripe mode, both must happen inside `command-center`, not this repo).**

## Medium

### L-6 — No Core Web Vitals measurement
- **Description:** Performance is architecturally reasonable (optimized images, self-hosted fonts, lean bundle) but no real Lighthouse/PageSpeed run has been performed against the live URL.
- **Impact:** Unknown real-world performance; SEO ranking factor.
- **Severity:** MEDIUM.
- **Owner:** Founder.
- **Resolution:** Run PageSpeed Insights / Lighthouse against `https://www.subzerometrix.com`.
- **Verification:** Documented Core Web Vitals scores.

### L-7 — In-memory rate limiting resets on redeploy
- **Description:** The lead form's rate limiter is a process-local `Map`, not persisted — every deploy clears it, and it doesn't share state across serverless instances.
- **Impact:** Rate limiting is weaker than it appears; a determined actor across multiple requests/instances could exceed the intended limit.
- **Severity:** MEDIUM.
- **Owner:** Founder.
- **Resolution:** Acceptable for launch given low expected traffic; revisit with a real persisted rate-limit store if abuse is observed.
- **Verification:** Monitor for abuse post-launch; no action required pre-launch.

### L-8 — No real product visuals
- **Description:** The homepage has zero screenshots or dashboard previews — by deliberate choice, since no real assets exist and fabricating one would violate `BRAND_CONSTITUTION.md`'s claims policy.
- **Impact:** Reduced conversion credibility for a product whose core pitch is "AI does real work."
- **Severity:** MEDIUM (a real gap, not a blocker — shipping honest-but-thin beats shipping fabricated).
- **Owner:** Founder.
- **Resolution:** Capture a real, approved product screenshot once available.
- **Verification:** Image added, confirmed to depict real, current product UI.

## Low

### L-9 — No admin UI for captured leads
- **Description:** Leads are retrievable only via direct Supabase query, not a built admin page.
- **Impact:** Operational friction, not a launch blocker at current expected volume.
- **Severity:** LOW.
- **Owner:** Founder.
- **Resolution:** Build a simple `/admin/mcc-leads` view post-launch.
- **Verification:** Page exists, lists real leads, matches `admin_email_allowlist` gating pattern used elsewhere.

### L-10 — No formal support SLA
- **Description:** Support is a single mailto link with no documented response-time commitment.
- **Impact:** Low at current scale; matters more as volume grows.
- **Severity:** LOW.
- **Owner:** Founder.
- **Resolution:** Document a real, honest response-time expectation once support volume justifies it.
- **Verification:** `CUSTOMER_PROMISE.md` updated with a specific, kept commitment.
