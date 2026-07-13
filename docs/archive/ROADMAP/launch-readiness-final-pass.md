# Launch Readiness Final Pass — SubZeroMetrix™

**Date:** 2026-06-13 · **Checkpoint tested:** `948c9cc` (Pre-Launch Fix-3 complete) ·
Owner/operator: **The Modern Trades Mentor LLC** · Branding: **SubZeroMetrix™**, **MetrixScore™**.

This pass is verification-first. It does **not** re-run Audit-1A/1B/1C. It separates two kinds of
checks honestly:

- **Code/repo-verifiable (done here):** baseline, build, type-check, migration SQL + RLS policy
  shape, payment-gating logic, email-capture logic, route graph, link inventory, accessibility
  markup, claims/terminology scan.
- **Live-infrastructure (operator-required):** anything that needs the running production Supabase
  project, live Stripe (test mode), the deployed Vercel build, or a real device/AT. These cannot be
  executed from inside the codebase and are marked **OPERATOR-REQUIRED** — they are *not* claimed as
  passed here.

---

## 1. Executive verdict — **CONDITIONAL GO**

The **code is launch-ready**: working tree clean, type-check and production build pass, payment
gating and RLS policies are correctly shaped, email capture is consent-first and honest, and the
Pre-Launch Fix-3 UX corrections are present at the tested commit. **No code blockers found.**

Launch is **CONDITIONAL** on the operator completing the live-infrastructure verification list in
§17–§18 against the production Supabase project, Stripe (test mode first), and real devices. None of
those revealed a contradiction in code review, but they assert runtime behavior that only a live
environment can prove, so they gate public opening.

- **Code blockers:** 0
- **Required-before-launch (operator/manual) items:** see §18 (live RLS, auth round-trip, Stripe
  test checkout, email-capture insert against applied migration 003, export/delete, link
  click-test, real-device sweep, legal review, Vercel deploy-commit confirmation).
- **Acceptable post-launch:** see §19.

---

## 2. Commit / deployment tested

- Branch: `main` · HEAD: `948c9cc` · `origin/main`: `948c9cc` (in sync) · working tree: clean.
- `git diff --check`: clean. No `.env.local` / `.next` / `node_modules` / screenshots / temp files
  staged (all gitignored). `package.json` / `package-lock.json`: unchanged since initial commit.
- **OPERATOR-REQUIRED:** confirm the Vercel **production** deployment is built from `948c9cc` (or a
  later approved commit) and that required production env vars exist (Stripe secret, Supabase URL +
  anon + service-role, `NEXT_PUBLIC_*`, optional `RESEND_API_KEY`). No secret values inspected or
  printed in this pass.

---

## 3. Code validation — **PASS**

| Check | Result |
|---|---|
| `git status --short` | clean |
| `git log -1 --oneline` | `948c9cc Complete Pre-Launch Fix-3 UX corrections` |
| `npx tsc --noEmit` | **TSC_EXIT:0** |
| `npm run build` | **BUILD_EXIT:0** — 46 pages generated |
| `git diff --check` | clean |

All required routes compile: `/`, `/start`, `/assessment`, `/results`, `/unlock`, `/report`,
`/dashboard`, `/foundation-builder`, `/growth`, `/account/privacy`, `/resources`,
`/learn` + `/learn/[slug]` (7 SSG slugs), `/trades`, and legal/privacy routes
(`/privacy`, `/terms`, `/disclaimer`, `/cancellation`, `/affiliate-disclosure`, `/about`).
API routes present: `/api/checkout`, `/api/verify-session`, `/api/webhook`, `/api/email-trigger`,
`/api/track-click`, `/api/postback/[vendor]`.

---

## 4. Migrations / RLS — **CODE PASS · live OPERATOR-REQUIRED**

Migration files present: `001_metrix_account_sync.sql`, `002_cloud_sync_progress_records.sql`,
`003_marketing_subscriptions.sql`.

**Policy shape verified in SQL:**
- **001 (metrix_* account tables):** RLS enabled; owner-only `select/insert/update/delete` policies,
  all keyed on `auth.uid() = account_user_id`. No anon read/write policy.
- **002 (cloud_sync_* progress tables):** RLS enabled; owner-only CRUD via `auth.uid()` (7 RLS
  statements). No anon policy.
- **003 (marketing_subscriptions):** RLS enabled; **INSERT-only** policy for `anon, authenticated`
  with `check (consent_to_email = true)`. No `select/update/delete` policy → reads/lists/edits/
  deletes denied by default. `unique(email_normalized)` + email-format CHECK + consent CHECK; the
  app never upserts (no silent resubscribe).

**OPERATOR-REQUIRED (cannot run from repo):** apply 001–003 to the production project; confirm 003
is applied **before** testing public email capture; then verify live: signed-out cannot read owned
rows; User A cannot read/update/delete User B; owner can read/write/delete own; export returns only
the signed-in user's rows; cloud delete removes only the signed-in user's rows; anonymous insert
with valid consent succeeds; anonymous/authenticated **select fails**; anon update/delete fails;
duplicate normalized email does not resubscribe; `consent=false` insert fails; malformed email
fails; no subscriber list is exposed in UI/client.

---

## 5. Authentication / account flow — **CODE PASS · live OPERATOR-REQUIRED**

Magic-link helpers present (`accountAuth.ts`: `requestMagicLink`, `signOutAccount`,
`getCurrentAccountUser`, `getAccountAuthStatus`). `AccountAuthPanel` exposes honest unavailable /
link-sent / signed-in states and does not fake sign-in. `/account/privacy` builds and is reachable
from the dashboard. Browser uses the Supabase **anon** client only; service-role is confined to
`src/app/api/*` server routes.

**OPERATOR-REQUIRED:** real magic-link round-trip on production Supabase — submit email → honest
"link sent" → open link → session established → post-auth redirect → dashboard/account state updates
→ Sign Out works → signed-out local use still works → sign-in not forced for local-first features.

---

## 6. Cloud sync status — **CODE PASS · live OPERATOR-REQUIRED**

Four sync states modeled (`SyncStatusBadge` / `syncContracts`): `Saved on this device`,
`Sign in to back up progress`, `Synced to your account` (confirmed-write only), `Sync unavailable`.
"Synced to your account" is asserted only after a confirmed write — no optimistic false-synced
claim in code.

**OPERATOR-REQUIRED:** drive each state live (local save first; signed-out; signed-in confirmed
write; backend unavailable) and confirm no local progress is deleted during sign-in and a returning
session restores account-backed behavior.

---

## 7. Foundation Builder — **CODE PASS · live OPERATOR-REQUIRED**

Builds (`/foundation-builder`, 176 kB first load). Checklist, stage select, item complete/block,
notes, CSV export, printable view, trade-specific step, and state official-resource panel are
present; dashboard totals are derived from the same checklist state (Fix-3 reconciled the primary
CTA to `foundationStats`). Notes are rendered as React text (escaped), not `dangerouslySetInnerHTML`.

**OPERATOR-REQUIRED (real device):** persistence across reload; one launch trade + one
unsupported/other fallback; one launch state + one unsupported-state fallback; CSV download +
print window on mobile; signed-in sync status after a real write.

---

## 8. Customer Growth Roadmap (Product-6) — **CODE PASS · live OPERATOR-REQUIRED**

Builds (`/growth`, 105 kB). `growthEngine.ts` diagnoses 7 constraints → Do-now/next/later groups →
channels → trade cross-sell → social rhythm → KPIs; honest "no guarantees" footer; local-first
(`szm_growth_engine`). **Accessibility fix confirmed in markup:** the stage `<select>` and all 8
number inputs carry `aria-label` (Business stage, Monthly leads, Response time in minutes, Missed
calls per week, Booking rate percent, Close rate percent, Average ticket in dollars, Repeat customer
percent, Total reviews) — no control relies on placeholder alone.

**OPERATOR-REQUIRED (real device + AT):** run the three scenarios — A lead-volume (low leads /
ok conversion / spare capacity → visibility/acquisition), B conversion (ok leads / low booking-close
/ weak follow-up → sales-process before more ads), C capacity (strong demand / high close / weak
fulfillment → operations, not "buy more leads"); verify primary/secondary constraints and the
highest-impact action are plausible; confirm trade-aware cross-sell for HVAC, Electrical, Plumbing +
one more; verify keyboard focus visibility and mobile usability.

---

## 9. MetrixScore™ / results — **CODE PASS · live OPERATOR-REQUIRED**

`/results` (198 kB) renders the unified Starter MetrixScore™ with category explanation; Fix-3 added
the prominent "Your next step (free)" block — Foundation Builder primary (ambiguous/startup-safe),
Customer Growth Roadmap clearly-labeled secondary. No "not a credit score" / credit / lending /
underwriting terminology anywhere (scan clean). No scoring math changed in this pass. Report/results
read historical/local results with safe fallbacks (`REPORT LOCKED` / `SCORE NOT FOUND` states).

**Honest limitation (recorded):** the core assessment remains **startup-weighted**; deeper
growth-stage diagnosis is supplied by Product-6 (`/growth`). We do **not** claim the main score
already measures every growth-stage need.

**OPERATOR-REQUIRED:** click-through that results → free next step has no dead-end on a real device.

---

## 10. Stripe / payment / report — **CODE PASS · live OPERATOR-REQUIRED**

`/api/verify-session` is server-trusted: returns `paid:true` **only** when Stripe reports
`payment_status === 'paid'`; missing/invalid session → 400/402/500 with **generic** browser errors
(provider message logged server-side only, never returned); no secrets or full payment objects
exposed. `DEV_UNLOCK` is double-gated (`=== 'true' && NODE_ENV !== 'production'`) — inert in
production. `/report` renders `REPORT LOCKED` when `!paid`; access is granted only after the verify
fetch returns `paid === true`. Report "coming soon" purchase CTAs were removed in Fix-3 (scan
confirms none remain in `/report`).

**OPERATOR-REQUIRED (Stripe test mode):** checkout initiation → successful test payment → success
return → verify-session confirms paid → report unlocks; direct `/report` without verified payment is
blocked; forged/missing session blocked; canceled checkout does not unlock; `DEV_UNLOCK` unset in
production; paid deliverable matches current copy.

---

## 11. Public email capture — **CODE PASS · live OPERATOR-REQUIRED**

`emailCapture.ts` + `EmailCaptureForm`: consent checkbox **unchecked by default** (`useState(false)`);
submit disabled until consent + email; honeypot rejects bots; 3000 ms cooldown guards rapid
duplicate UI submits; `subscribed` returned **only** on a confirmed insert; duplicate →
`already` (no upsert/resubscribe); missing table → honest `unavailable`; no email-delivery or
guide-delivery claim; no fake unsubscribe link. Analytics events carry only `sourcePage`,
`sourceIntent`, `trade`, `state`, `reason` — **no email/name/raw payload**.

`RESEND_API_KEY`: `/api/email-trigger` is env-gated and returns a 202 skip when unset (no send/claim
when unset). **OPERATOR-REQUIRED:** if `RESEND_API_KEY` is set, do not send until consent + double
opt-in + suppression + unsubscribe workflow are verified.

**OPERATOR-REQUIRED:** after 003 is applied, submit a live consented insert and confirm success
shows only after a confirmed insert; duplicate shows the honest state; anon select stays denied.

---

## 12. Account export / delete — **CODE PASS · live OPERATOR-REQUIRED**

`/account/privacy` hosts export + delete. Export is scoped to the signed-in user (owner-only RLS
enforces row scope); cloud delete requires an explicit confirmation checkbox; device-local clear is
a separate confirmation; auth-account deletion is described as admin-assisted where unsupported.

**OPERATOR-REQUIRED (signed-in):** export JSON contains only the current user's rows; per-table
failures reported honestly (partial failure not reported as full success); cloud delete removes only
cloud rows and device-local data remains; device clear only via its own confirmation.

---

## 13. State official-resource links — **CODE PASS · live click-test OPERATOR-REQUIRED**

`stateResources.ts` covers all 6 launch states (Texas, Florida, Colorado, Arizona, Ohio, North
Carolina), each with formation/entity, licensing, tax (+ insurance + SBDC) URLs on official
government domains (`.gov` / official SoS / licensing-board hosts). Copy frames these as an
"official starting point" with no completeness/current-law claim. Unsupported-state fallback,
federal EIN link, and Google Business Profile link exist in the Foundation Builder flow.

**OPERATOR-REQUIRED:** live click-test the 18 launch-state category links (6 × entity/tax/licensing)
plus the EIN and Google Business Profile links — confirm each resolves, matches its category and
state, opens safely (`rel="noopener noreferrer"` is present in code), and shows no stale redirect.

---

## 14. Public route / SEO — **CODE PASS · live OPERATOR-REQUIRED**

Build emits `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD on public pages (FAQ schema only where
visible FAQs exist), and all 7 `/learn` SSG slugs + `/trades` + `/resources`. All ten trades appear
across content; contractor focus is clear; no unsupported benchmarking claim and no user-facing
data-selling slogan in scan. No private/account route is in the public sitemap set.

**OPERATOR-REQUIRED (live):** confirm title/meta/canonical/OG/Twitter render correctly on the
deployed pages, breadcrumbs + JSON-LD match visible content, no broken internal links, no
private/account page indexed, and sitemap matches intended public routes.

---

## 15. Mobile / accessibility / visual QA — **OPERATOR-REQUIRED (human judgment)**

Markup is mobile-first (width-capped containers, `touch-target`, responsive grids, disabled-state
opacity, `sr-only`/`aria-label` on form controls). Genuine cross-device, keyboard, screen-reader,
and color-contrast verification requires a human on real/emulated widths (360 / 390 / 768 / 1024+)
across homepage, assessment, results, unlock, report, dashboard, Foundation Builder, Growth Roadmap,
account/auth, account privacy, resources, learn, trades, and email capture. Record any finding with
route / viewport / issue / severity / screenshot ref. **Not executable from the codebase.**

---

## 16. Ten-trade smoke test — **CODE PASS · live OPERATOR-REQUIRED**

Trade taxonomy supports all ten (`hvac, electrical, plumbing, roofing, construction, handyman,
landscaping, cleaning, painting, solar`) with normalization, trade cross-sell/channel context
(`growthEngine.ts` `CROSS_SELL`), and an unsupported-trade/`other` fallback. No guaranteed-outcome
copy in scan.

**OPERATOR-REQUIRED (smoke, not a new audit):** quick functional pass for HVAC startup, Electrical
owner-operator, Plumbing one-truck, Roofing growth-stage, GC/remodeler, Handyman, Landscaping,
Cleaning, Painting, Solar — confirm correct trade normalization, a relevant Foundation step, relevant
Growth cross-sell/channel context, correct state fallback, a useful next action, and no incorrect
trade copy.

---

## 17. BLOCKERS

**Code blockers: 0.** No payment, auth, RLS, data-protection, core-journey, build, or critical-UX
failure was found in code review. (Runtime assertions remain to be proven live — see §18.)

---

## 18. Required before public launch (operator / live infrastructure)

1. Confirm Vercel production is deployed from `948c9cc` (or later approved); confirm required prod
   env vars exist (no values printed).
2. Apply migrations 001–003 to the production Supabase project; confirm 003 applied before testing
   email capture.
3. Live RLS: signed-out denied; cross-user denied; owner-only read/write/delete; export/delete row
   scope; marketing INSERT-only (anon select/update/delete denied; consent-false + malformed
   rejected; no resubscribe).
4. Live magic-link auth round-trip + post-auth redirect + signed-in cloud write; Sign Out; local-
   first still works unsigned.
5. Stripe **test-mode** checkout → verify-session → report unlock; direct/forged/missing session
   blocked; canceled checkout does not unlock; `DEV_UNLOCK` unset in production.
6. Live consented email insert against applied 003; honest duplicate state; anon select denied.
   Keep `RESEND_API_KEY` unset (or finish double-opt-in/suppression/unsubscribe before any send).
7. Signed-in export/delete: correct row scope, honest partial-failure handling, device-local data
   survives cloud delete.
8. Click-test the 18 state links + EIN + Google Business Profile (resolve, correct state/category,
   open safely).
9. Real-device + keyboard + screen-reader + contrast sweep of all listed surfaces and states.
10. Human visual QA of the paid report; ten-trade smoke test.
11. Attorney review of Terms / Privacy / Disclaimer; contractor beta testing.

---

## 19. Acceptable post-launch (non-blocking)

- Desktop wide-layout polish; first-run hint on `/growth`; consistent icon-only control aria-labels;
  motion-reduction respect (Audit-1C nice-to-haves).
- `/install` page copy: "Native app store versions coming soon" — honest roadmap statement on the
  PWA page, not a purchase CTA; review/keep at discretion.
- Wire a real analytics provider to the existing `trackEvent` sink when ready (currently a safe
  no-op / dataLayer push, no PII).

---

## 20. Final GO checklist (operator sign-off)

- [ ] Vercel production on approved commit; prod env vars present
- [ ] Migrations 001–003 applied; 003 confirmed before email-capture test
- [ ] Live RLS owner-only + marketing INSERT-only verified
- [ ] Magic-link auth round-trip + redirect + signed-in write verified
- [ ] Stripe test checkout → report unlock; unpaid/forged blocked; DEV_UNLOCK unset
- [ ] Live consented email insert verified; anon select denied; no false delivery claim
- [ ] Export/delete row-scoped + honest partial-failure handling
- [ ] 18 state links + EIN + GBP click-tested
- [ ] Real-device + AT + contrast sweep complete
- [ ] Paid report human QA + ten-trade smoke test complete
- [ ] Legal review of Terms/Privacy/Disclaimer complete

**When every box is checked, CONDITIONAL GO → GO.**

---

### Code-validation evidence (this pass)

`TSC_EXIT:0` · `BUILD_EXIT:0` (46 pages) · `git diff --check` clean · HEAD `948c9cc` == `origin/main`
· working tree clean · no code change required.
