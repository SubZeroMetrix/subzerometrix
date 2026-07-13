# Manual Launch Verification Checklist

Code/copy fixes from Audit-1A/1B + Fix-1/Fix-2 are complete. The items below require live
infrastructure, real devices, or human review and **cannot be verified by code inspection**.
Complete these before public launch. Owner/operator: **The Modern Trades Mentor LLC**.

## Database / Supabase
- [ ] Apply migrations `001`, `002`, `003` to the production Supabase project.
- [ ] Verify RLS in production: a second account cannot read/write another user's `cloud_sync_*`/`metrix_*` rows; anonymous cannot read `marketing_subscriptions`.
- [ ] Confirm `marketing_subscriptions` is INSERT-only (no select/update/delete for anon/authenticated).

## Authentication / account
- [ ] Verify production Supabase auth (magic-link) end-to-end: request link → click → signed-in → redirect to dashboard → sign out.
- [ ] Verify a signed-in user's progress writes to the cloud and the badge flips to "Synced to your account" only after a confirmed write.
- [ ] Verify account export downloads only the signed-in user's rows; delete removes only their rows; "all deleted" only when every table succeeds.

## Payment / report
- [ ] Confirm `DEV_UNLOCK` is unset in production.
- [ ] Run a real Stripe **test** checkout → confirm `verify-session` returns paid → `/report` unlocks; confirm direct `/report` navigation without payment is blocked.

## Email
- [ ] Confirm `RESEND_API_KEY` is **unset** at launch (no marketing sends) OR reconcile consent (assessment-email vs. explicit-list), apply double opt-in, and verify a working unsubscribe/suppression process before enabling.
- [ ] Test the public marketing-subscription insert against the applied table (consent required; honest unavailable/error/success states).

## Public / SEO / links
- [ ] Click-test all six launch-state official resource links (FL/CO/TX/AZ/OH/NC entity/tax/licensing) — flag any stale/redirected/non-official URLs.
- [ ] Confirm public routes/metadata/canonicals; `/account/privacy` stays `index:false`; `/report`, `/dashboard`, `/unlock`, `/results`, `/assessment` excluded from sitemap.

## Cross-device / accessibility (Audit-1C)
- [ ] Mobile/tablet/desktop responsive review of homepage, assessment, results, report, dashboard, Foundation Builder, account, learn, trades, email capture.
- [ ] Human visual review of the paid report and dashboard.

## Trust / legal
- [ ] Confirm the Privacy Policy against actual production processors (Stripe, Supabase, Vercel, Resend) and data flows.
- [ ] Obtain attorney review of Terms, Privacy Policy, Disclaimer, and the de-identification/benchmarking provisions before public launch.
- [ ] Contractor beta testers for relevance, clarity, and the outcome loop.
