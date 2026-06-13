# Growth-8 — Email Capture & Nurture Foundation

**Status:** Built (capture foundation; delivery/sequence future). Owner/operator:
**The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**, **MetrixScore™** (™, not ®).

A compliant, consent-first email-capture foundation that converts public contractor-startup
traffic into a consented update list — **no spam, no fake urgency, no unsupported automation
claims**.

## Capture architecture

- **Model + writer:** `src/lib/emailCapture.ts` — typed `EmailCaptureInput`, validation
  (trim/normalize, format, length, allowed trade/state, **honeypot**, submit cooldown),
  versioned consent constants, and `submitEmailCapture()` which inserts into
  `public.marketing_subscriptions` via the **browser anon client** (INSERT-only RLS).
- **Form:** `src/components/EmailCaptureForm.tsx` — reusable, accessible, consent-first.
- **Migration:** `supabase/migrations/003_marketing_subscriptions.sql`.

## Consent

- **Consent version:** `v1-2026-06` (stored on every row as `consent_text_version`).
- **Consent text:** "I agree to receive educational contractor-business emails and product
  updates from The Modern Trades Mentor LLC and SubZeroMetrix™. I can unsubscribe at any time."
- The consent checkbox is **unchecked by default**; submit is disabled until it is checked
  and a valid email is present. No prechecked box, no dark patterns. Consent is **explicit**
  — users are never enrolled for creating an account, completing an assessment, downloading,
  or using a tool.

## Fields collected

`email`, `email_normalized`, optional `first_name`, optional `selected_trade`, optional
`selected_state`, `source_page`, `source_intent`, optional `resource_requested`,
`consent_to_email`, `consent_text_version`, `consent_timestamp`, optional `locale`,
`status`, `created_at`/`updated_at`.

## Fields prohibited (never collected)

Passwords, API keys, SSNs, banking details, private customer info, sensitive free-form
notes, assessment answers, MetrixScore™ values, roadmap progress, Foundation Builder notes.

## Storage behavior + RLS / server security

- `public.marketing_subscriptions` with **RLS enabled** and a **single INSERT-only policy**
  for `anon`/`authenticated` requiring `consent_to_email = true`. **No SELECT/UPDATE/DELETE
  policy exists**, so no public or signed-in user can list, read, modify, or delete
  subscribers (RLS denies by default).
- Server-side **CHECK constraints**: email format, length ≤ 254, consent must be true,
  status ∈ {subscribed, unsubscribed, bounced, suppressed}. **UNIQUE(email_normalized)** for
  dedupe.
- The browser uses the **anon key only** — the service-role key is never used.
- **No upsert / no silent re-subscribe:** a re-submit of an existing email hits the UNIQUE
  constraint; the app treats it as "already on the list" and **does not modify** the existing
  (possibly unsubscribed) record.
- **Honest persistence:** until migration `003` is applied to the project, inserts fail and
  the form shows an honest "sign-ups are not available right now" state — it **never claims a
  save that did not happen**. Success is shown **only after a confirmed insert** (or a
  confirmed existing record).

## Public-page placements (one form per page)

`/learn/starting-a-contractor-business`, `/learn/contractor-startup-checklist`,
`/learn/start-a-trade-business`, `/learn/start-a-home-service-business`,
`/learn/contractor-business-readiness`, `/learn/foundation-builder-guide`, and `/trades`.
Controlled by `resourceHasEmailCapture()` so there is never more than one competing form
per page.

## Trade / state attribution

Trade and state are optional selectors (normalized values: 10 supported trades; launch
states FL, CO, TX, AZ, OH, NC) captured **only when the user selects them**. Nothing
sensitive is inferred. State nurture content must route to official sources and must not
claim state guidance is exhaustive or current.

## Analytics

Events prepared via the existing privacy-safe no-op `trackEvent`: `email_capture_viewed`,
`email_capture_started`, `email_capture_submitted`, `email_capture_success`,
`email_capture_failed` — with non-PII context only (`sourcePage`, `sourceIntent`, selected
`trade`/`state`, failure `reason`). **The email address, name, and raw form content are
never sent to analytics.** No third-party pixels, cookies, or trackers.

## Delivery-provider status

**No email-delivery provider is configured.** No emails are sent in this phase. Copy uses
honest "Join the update list" wording — it does **not** claim an immediate guide download or
email delivery. The success state explicitly notes no emails are sent until the delivery
list is live.

## Future nurture sequence (NOT active)

Educational sequence to build once delivery is configured:
1. Contractor startup foundation (trade skill vs. business readiness; links to guide + assessment).
2. Legal / licensing / tax / insurance starting points (educational; official-source routing; no individualized advice).
3. Pricing & financial readiness (startup costs, overhead, labor, margin, cash flow; professional-advisor reminder).
4. Customer acquisition foundation (GBP, reviews, referrals, local SEO, lead tracking).
5. Operations foundation (scheduling, dispatch, estimating, job costing, communication, field-service systems).
6. Contractor launch roadmap (assessment, MetrixScore™, roadmap, Foundation Builder, progress tracking).

Future segmentation may use trade / state / startup stage / source intent / resource interest
— **never** private assessment answers or synced progress without a separate explicit consent
and privacy review.

## Unsubscribe readiness

Status field models `subscribed | unsubscribed | bounced | suppressed`. **No fake unsubscribe
link** is created. Unsubscribe processing belongs to the future delivery integration; status
fields and consent history are preserved for safe future implementation. If a provider is
later activated, use its official unsubscribe mechanism — do not build a weaker parallel one.

## Privacy / disclosure copy

The form states what is collected and why, who operates it (The Modern Trades Mentor LLC),
that consent is optional and unsubscribe is available, links to the privacy policy, and that
joining does **not** create a contractor license, legal relationship, financial approval, or
guaranteed business outcome — and that trade/state requirements must be verified through
official sources. This adds a clearly-scoped, consent-gated collection consistent with
current stated practices.

## Growth-8 completion criteria (met)

- UI accurately reflects actual persistence (honest unavailable/error vs. confirmed save).
- Consent is explicit (unchecked default; required to submit).
- Successful-save messaging is truthful (only after a confirmed insert).
- Private data is not exposed (public form reads no account/assessment/score/sync data).
- TypeScript + build pass.

## Next phase

**Pre-Launch Audit-1A — Security, Privacy, Legal, Compliance, and Trust.**
