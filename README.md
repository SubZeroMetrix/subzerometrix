# SubZeroMetrix — v0.17.0

**MetrixScore™ Business Readiness Assessment**  
A trust-first contractor roadmap and recommendation platform.

---

## Overview

SubZeroMetrix is a mobile-first PWA where tradespeople and contractors complete a 7-question MetrixScore™ assessment, then unlock their full personalized roadmap and report via Stripe.

Users answer questions about their business type, location, stage, setup status, financial readiness, customer acquisition plan, and biggest blocker. The result is a 0–100 MetrixScore™ with a score band, category breakdown, risk areas, action steps, and an affiliate resource map matched to their specific gaps.

Affiliate recommendations are:
- Needs-first and budget-aware
- Based on trade, state, score, stage, and gaps
- Transparent with inline and footer disclosures
- Secondary to education and roadmap value

---

## Score Bands

| Score  | Band             |
|--------|------------------|
| 0–39   | High Risk        |
| 40–59  | Foundation Stage |
| 60–79  | Launch Ready     |
| 80–100 | Growth Ready     |

---

## Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Framework   | Next.js 14 (App Router)     |
| Language    | TypeScript                  |
| Styling     | Tailwind CSS                |
| Database    | Supabase (Postgres)         |
| Payments    | Stripe Checkout             |
| Email       | Resend (optional)           |
| Deployment  | Vercel                      |
| PWA         | next-pwa (optional, graceful if missing) |

---

## Pricing Tiers

| Tier                  | Price   | Type        |
|-----------------------|---------|-------------|
| MetrixScore™          | $9.99   | One-time    |
| MetrixScore™ Pro      | $19.99  | One-time (default shown) |
| Trade Platform        | $29/mo  | Subscription |

Prices are validated server-side in `src/app/api/checkout/route.ts`. Client-sent amounts are never trusted.

---

## Pages

| Route                    | Description                                                      |
|--------------------------|------------------------------------------------------------------|
| `/`                      | Landing page                                                     |
| `/start`                 | Redirects to `/assessment`                                       |
| `/assessment`            | 7-question MetrixScore™ assessment flow                          |
| `/unlock`                | Locked result screen + tiered Stripe Checkout CTA                |
| `/report`                | Full report (payment verified server-side via `/api/verify-session`) |
| `/resources`             | Curated affiliate and free resource map                          |
| `/platform-ecosystem`    | All 10 trade-specific platforms explained                        |
| `/platform/[trade]`      | Trade-specific KPI, benchmarks, and tools (slug-based)           |
| `/contractor-builders`   | Legacy URL → permanent redirect to `/platform-ecosystem`         |
| `/install`               | PWA installation instructions                                    |
| `/privacy`               | Privacy Policy                                                   |
| `/terms`                 | Terms of Service                                                 |
| `/cancellation`          | Cancellation & Refund Policy                                     |
| `/affiliate-disclosure`  | FTC-compliant affiliate disclosure                               |
| `/disclaimer`            | Full educational disclaimer                                      |

---

## Assessment Flow

1. **Q1 — Business Type** (single select, 10 pts)  
   Trade or service category → routes to trade-specific platform and resources.

2. **Q2 — Location** (state + city text input, 10 pts)  
   Used for state-specific licensing links and vendor availability gating.

3. **Q3 — Stage** (single select, 15 pts)  
   Pre-launch through 3+ years in business → drives roadmap phase priority.

4. **Q4 — Setup Steps** (checkbox multi-select, 20 pts)  
   Business entity, EIN, insurance, banking, etc. → identifies legal/financial gaps.

5. **Q5 — Financial Readiness** (single select, 20 pts)  
   Available startup capital → used for budget-matched resource routing.

6. **Q6 — Customer Plan** (single select, 15 pts)  
   Referrals only through full marketing system → drives sales/marketing roadmap items.

7. **Q7 — Biggest Blocker** (single select, 10 pts)  
   Single biggest obstacle → used to surface most urgent roadmap item.

8. **Lead Capture** (first name + email, no points)  
   Collected before score reveal. Stored to Supabase. Not gated — user can skip email input.

Score range: **0–100** across 7 categories.

---

## API Routes

| Route                          | Method | Description                                      |
|--------------------------------|--------|--------------------------------------------------|
| `/api/checkout`                | POST   | Creates Stripe Checkout session (server-validated price) |
| `/api/verify-session`          | GET    | Confirms Stripe payment before revealing report  |
| `/api/webhook`                 | POST   | Stripe webhook → marks assessment paid in Supabase |
| `/api/track-click`             | POST   | Logs affiliate click before redirect             |
| `/api/postback/[vendor]`       | GET/POST | S2S postback endpoint for affiliate conversion tracking |
| `/api/email-trigger`           | POST   | Fires Resend email sequence (called by Supabase/n8n) |

---

## Environment Variables

See `.env.example` for the full list with comments.

**Required for core operation:**

| Variable                           | Service       |
|------------------------------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL`         | Supabase      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | Supabase      |
| `SUPABASE_SERVICE_ROLE_KEY`        | Supabase      |
| `STRIPE_SECRET_KEY`                | Stripe        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe      |
| `STRIPE_WEBHOOK_SECRET`            | Stripe        |
| `NEXT_PUBLIC_APP_URL`              | App           |

**Optional (app runs without them, features degrade gracefully):**

| Variable           | Service | Feature                    |
|--------------------|---------|----------------------------|
| `RESEND_API_KEY`   | Resend  | Email automation sequences |
| `POSTBACK_SECRET_*`| Partners| Affiliate HMAC verification|

---

## Graceful Degradation

All third-party integrations are guarded so the app builds and runs without env vars:

- **Supabase** — API routes check for env vars before creating clients. Missing = skips DB writes, never crashes.
- **Stripe** — Routes return 500 if key missing (expected behavior — payments require live keys).
- **Resend** — Email trigger returns 503 if key missing, logged clearly.
- **Postback secrets** — Signature verification skipped if secret not configured; postbacks still logged.
- **next-pwa** — Wrapped in try/catch in `next.config.js`; build proceeds without the package.

---

## Key Source Files

| File                          | Purpose                                      |
|-------------------------------|----------------------------------------------|
| `src/lib/questions.ts`        | All 7 assessment questions and scoring schema |
| `src/lib/scoring.ts`          | MetrixScore™ calculation engine              |
| `src/lib/roadmap.ts`          | Needs-first roadmap generation logic         |
| `src/lib/affiliates.ts`       | Affiliate partner registry + URL builder     |
| `src/lib/tracking.ts`         | SubID builder, state gating, disclosures     |
| `src/lib/tradeData.ts`        | Trade-specific KPIs, benchmarks, tools       |
| `src/lib/stateResources.ts`   | State licensing and resource links           |
| `supabase/schema.sql`         | Core tables (run first)                      |
| `supabase/schema_v4_additions.sql` | Email, affiliate, referral tables       |
| `supabase/schema_v5_tracking.sql`  | Conversion tracking tables              |

---

## Affiliate Model

SubZeroMetrix is a publisher and education platform. It routes users to licensed third-party vendors. It does not quote, approve, underwrite, bind, or process any regulated financial products.

Every affiliate link is:
- Preceded by educational content explaining what to look for and common mistakes
- Followed by a DIY free option
- Clearly labeled as a referral link
- Accompanied by the appropriate FTC/regulatory disclosure

See `src/lib/roadmap.ts` for the full education-first recommendation structure.

---

## Local Development

```bash
git clone <repo>
cd subzerometrix
npm install
cp .env.example .env.local
# Fill in .env.local with your keys
npm run dev
```

Open http://localhost:3000

The app works without Supabase or Stripe keys for browsing and assessment — only payment and data persistence require live keys.

---

## Build & Deploy Checklist

```bash
npm run typecheck   # must pass with 0 errors
npm run lint        # must pass with 0 errors  
npm run build       # must pass cleanly
```

Then:
1. Push to GitHub
2. Import project in Vercel
3. Add all env variables from `.env.example`
4. Add Stripe webhook: `https://yourdomain.com/api/webhook`
5. Run all three Supabase SQL files in order
6. Deploy

---

## Database Setup

Run in Supabase SQL Editor in this order:

1. `supabase/schema.sql` — Core tables (assessments, purchases)
2. `supabase/schema_v4_additions.sql` — Email tracking, affiliate click tables
3. `supabase/schema_v5_tracking.sql` — Referral conversion and disclosure audit tables

All files use `IF NOT EXISTS` — safe to re-run.

---

## PWA

The app includes a `public/manifest.json` and splash/icon assets in `public/icons/`.

`next-pwa` is optional — `next.config.js` wraps it in a try/catch so the build works without it.  
To enable offline caching: `npm install next-pwa`

---

*SubZeroMetrix — by The Modern Trades Mentor*  
*info@subzerometrix.com · subzerometrix.com*
