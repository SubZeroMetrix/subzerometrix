# SubZeroMetrix — Deploy Notes (v0.17.0 → cleanup)

This document summarizes every change made during the deploy-readiness cleanup pass.
No features were removed. No redesign was done.

---

## Bugs Fixed

### 1. `SUPABASE_URL` env var mismatch — `src/app/api/webhook/route.ts`

**Problem:** The webhook route checked for `process.env.SUPABASE_URL` and passed it to
`createClient()`. The actual env var name throughout the rest of the codebase is
`NEXT_PUBLIC_SUPABASE_URL`. This caused silent failure in production — the webhook would
receive Stripe events, skip all DB writes without error, and return `{ received: true }`.
Payments would succeed on Stripe but never be marked paid in Supabase.

**Fix:** Changed both the guard check and the `createClient()` call to use
`NEXT_PUBLIC_SUPABASE_URL` consistently.

```diff
- if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
-   const supabase = createClient(process.env.SUPABASE_URL, ...)
+ if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
+   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, ...)
```

**File:** `src/app/api/webhook/route.ts`

---

## Documentation Fixed

### 2. Pricing mismatch across docs

**Problem:** Three sources disagreed on prices:
- `README.md` said `$8.99`
- `SETUP.md` said `$7.99`
- `src/app/unlock/page.tsx` (the actual UI) and `src/app/api/checkout/route.ts` (server truth) both said `$9.99` / `$19.99` / `$29`

**Fix:** Updated README.md and SETUP.md to match the code. Server-side prices in
`src/app/api/checkout/route.ts` are the source of truth — client-sent amounts are never trusted.

### 3. README assessment flow section was empty

**Problem:** README had a `## Assessment Flow` heading followed by `---` with no content.

**Fix:** Wrote complete assessment flow documentation covering all 7 questions plus lead capture.

### 4. `.env.example` had unused / misleading vars

**Problem:** `.env.example` listed `ANTHROPIC_API_KEY`, `N8N_WEBHOOK_SECRET`, and PostHog
vars as if they were required. None of these are used in any current route or page.
A reviewer or new developer would spend time configuring services that aren't wired up.

**Fix:** Moved these to a clearly labeled "Optional / Future integrations" section with
comments explaining they are not currently used.

### 5. README listed outdated pages

**Problem:** README listed `/contractor-builders` as a regular page. It is actually a
redirect page that immediately redirects to `/platform-ecosystem`. The redirect is also
set in `next.config.js` as a permanent 301.

**Fix:** Noted in README that it is a legacy URL / redirect.

### 6. README had no API routes documentation

**Fix:** Added complete API routes table covering all 6 routes.

### 7. SETUP.md had no reviewer checklist

**Fix:** Added explicit reviewer checklist with pass/fail criteria for each verification step.

---

## Files Cleaned

### 8. Removed `tsconfig.tsbuildinfo` from project

**Problem:** The 280KB generated TypeScript build info file was included in the zip.
It is already in `.gitignore` and should never be committed or distributed.

**Fix:** Deleted from project root. It will regenerate on first `tsc` run.

---

## No Changes Made To

- Any source TypeScript or TSX files (except webhook env var fix)
- Any lib files (`scoring.ts`, `questions.ts`, `roadmap.ts`, `affiliates.ts`, `tracking.ts`, `tradeData.ts`, `stateResources.ts`)
- `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- `package.json` scripts (already correct)
- All page components and API routes (except webhook bug fix)
- All Supabase SQL schema files
- `public/` directory
- `.gitignore`

---

## Verification Commands

```bash
npm install          # should complete cleanly
npm run typecheck    # should report 0 errors
npm run lint         # should report 0 errors
npm run build        # should succeed
npm run dev          # should start on port 3000
```

---

*Cleanup pass performed: 2026*

---

## v0.17.1 Polish Pass — Additional Fixes

### Fix 1: `assessment/page.tsx` — useEffect missing deps warning resolved

**Warning:** `React Hook useEffect has missing dependencies: 'answers' and 'isLeadStep'`

**Root cause:** The state-restoration `useEffect` read `answers` and `isLeadStep` (derived from `step`) but only listed `[step]` in the dep array.

**Fix:** Introduced `answersRef` — a `React.useRef` that is kept in sync with the latest `answers` value via a separate effect with `[answers]` deps. The restoration effect now reads from `answersRef.current`, so `answers` is no longer a direct dependency. `isLeadStep` was replaced with the inline expression `step === LEAD_STEP` making it clear it is derived from `step`. No suppression comment used. No infinite loop risk.

**File:** `src/app/assessment/page.tsx`

---

### Fix 2: Stripe routes — 503 before Stripe instantiation when env vars missing

**Problem:** All three Stripe routes instantiated `new Stripe(process.env.STRIPE_SECRET_KEY!, ...)` at module load time. If the key is missing, this throws a confusing Stripe SDK error rather than a clear configuration message.

**Fix:** Replaced module-level Stripe init with a lazy `getStripe()` function. Each handler now explicitly checks `process.env.STRIPE_SECRET_KEY` (and `STRIPE_WEBHOOK_SECRET` for webhook) before calling Stripe. Missing keys return HTTP 503 with a clear message.

| Route | Guard added |
|---|---|
| `checkout/route.ts` | 503 if `STRIPE_SECRET_KEY` missing |
| `verify-session/route.ts` | 503 if `STRIPE_SECRET_KEY` missing |
| `webhook/route.ts` | 503 if `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` missing |

**Files:** `src/app/api/checkout/route.ts`, `src/app/api/verify-session/route.ts`, `src/app/api/webhook/route.ts`

---

### Fix 3: `postback/[vendor]/route.ts` — 500 → 503 with clear message

**Problem:** When Supabase env vars were missing, the route returned HTTP 500 with `{ error: "Configuration error" }` — confusing and not helpful.

**Fix:** Returns HTTP 503 with `{ error: "Referral conversion tracking is not configured. Missing Supabase service environment variables." }`

**File:** `src/app/api/postback/[vendor]/route.ts`

---

### Fix 4: `email-trigger/route.ts` — graceful skip when RESEND_API_KEY missing

**Problem:** Missing `RESEND_API_KEY` returned HTTP 500. Email is optional at launch.

**Fix:** Returns HTTP 202 with `{ status: "skipped", reason: "Email automation is not configured. Missing RESEND_API_KEY." }`. Does not crash. Does not mark anything as sent.

**File:** `src/app/api/email-trigger/route.ts`

---

### Fix 5: package-lock.json

**Action required locally** — network-isolated build environment cannot run `npm install`.

```bash
# After unzipping, run once locally:
cd subzerometrix
npm install
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

This ensures Vercel and all developers use identical dependency versions.

---

### Fix 6: `vercel.json` simplified to Option B

**Before:** 17 env vars with `@secret_name` references that require matching Vercel secret names exactly.

**After:** Minimal config with no env references — set env vars directly in Vercel dashboard.

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**Required env vars to set in Vercel dashboard:**

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → your endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_APP_URL` | Your production domain: `https://subzerometrix.com` |
| `RESEND_API_KEY` | Resend Dashboard (optional — email skips gracefully if missing) |
| `POSTBACK_SECRET_*` | From each affiliate partner when onboarded (optional) |

**File:** `vercel.json`

---

### Fix 7: `platform/[trade]/page.tsx` — improved not-found state

**Before:** Generic "PLATFORM NOT FOUND / This trade platform is not yet available." with one link.

**After:** Shows the invalid slug from the URL, explains what happened, provides two clear paths (view all platforms, or take the free assessment to find your platform).

**File:** `src/app/platform/[trade]/page.tsx`

---

## API Smoke Test Expected Results

| Request | Expected response |
|---|---|
| `POST /api/checkout` empty body | 400 `{ error: "Missing scoreData" }` |
| `POST /api/checkout` no Stripe key | 503 `{ error: "Stripe is not configured..." }` |
| `GET /api/verify-session?session_id=fake` no Stripe key | 503 `{ error: "Stripe is not configured..." }` |
| `POST /api/webhook` no sig header, with Stripe key | 400 `{ error: "Missing stripe-signature header" }` |
| `POST /api/webhook` no Stripe key | 503 `{ error: "Stripe is not configured..." }` |
| `POST /api/webhook` no webhook secret | 503 `{ error: "Stripe webhook is not configured..." }` |
| `POST /api/track-click` valid vendorId | 200 `{ url, clickId, subId, disclosures }` |
| `GET /api/postback/jobber?subid=fake` no Supabase | 503 `{ error: "Referral conversion tracking..." }` |
| `POST /api/email-trigger` no RESEND_API_KEY | 202 `{ status: "skipped", reason: "..." }` |
