# SubZeroMetrix — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your keys
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open http://localhost:3000

> **Note:** The app browses and runs the full assessment without any env vars configured.  
> Only Stripe payment and Supabase persistence require live keys.

---

## Required Environment Variables

Fill in `.env.local` with:

| Variable                             | Where to get it                                          |
|--------------------------------------|----------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase → Project Settings → API                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase → Project Settings → API                        |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase → Project Settings → API                        |
| `STRIPE_SECRET_KEY`                  | Stripe Dashboard → Developers → API Keys                 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys                 |
| `STRIPE_WEBHOOK_SECRET`              | Stripe Dashboard → Webhooks → your endpoint              |
| `NEXT_PUBLIC_APP_URL`                | `http://localhost:3000` (dev) or your production domain  |

## Optional Environment Variables

| Variable          | Service | Notes                                                 |
|-------------------|---------|-------------------------------------------------------|
| `RESEND_API_KEY`  | Resend  | Email sequences. App runs fine without it.           |
| `POSTBACK_SECRET_*` | Partners | Per-partner HMAC secrets. Safe to leave blank.   |

---

## Database Setup

Run these SQL files in Supabase SQL Editor in order:

```
Supabase Dashboard → SQL Editor → New query
```

**Run in this order:**

1. `supabase/schema.sql` — Core tables (assessments, purchases)
2. `supabase/schema_v4_additions.sql` — Email, affiliate, and referral click tables  
3. `supabase/schema_v5_tracking.sql` — Conversion tracking and disclosure audit tables

All scripts use `IF NOT EXISTS` — safe to re-run if you need to reset.

---

## Pricing Tiers (server-validated)

Prices are enforced server-side in `src/app/api/checkout/route.ts`.  
Client-sent amounts are ignored.

| Tier                   | Price   | Stripe `mode`  |
|------------------------|---------|----------------|
| MetrixScore™           | $9.99   | `payment`      |
| MetrixScore™ Pro       | $19.99  | `payment`      |
| Trade Platform         | $29/mo  | `subscription` |

---

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in `.env.local`

For local testing with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

The CLI will output a `whsec_...` secret — use that as `STRIPE_WEBHOOK_SECRET` locally.

---

## Build Verification

Before deploying, run the full check:

```bash
npm run typecheck   # TypeScript — must pass with 0 errors
npm run lint        # ESLint — must pass with 0 errors
npm run build       # Next.js production build — must succeed
```

Or run all three in sequence:
```bash
npm run check
```

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import your repo
3. Add all environment variables from `.env.example`
4. Deploy
5. Set up Stripe webhook pointing to your Vercel URL
6. Run the Supabase SQL files if not done already

The `vercel.json` in the project root configures the build command, output directory, and maps env var names to Vercel secret references.

---

## Pages Reference

| Route                   | Description                                                |
|-------------------------|------------------------------------------------------------|
| `/`                     | Homepage                                                   |
| `/assessment`           | 7-question MetrixScore™ flow                               |
| `/unlock`               | Tiered paywall (shown after assessment completes)          |
| `/report`               | Full report (requires verified Stripe payment)             |
| `/platform-ecosystem`   | All 10 trade platforms explained                           |
| `/platform/[trade]`     | Trade-specific KPIs, benchmarks, tools                     |
| `/resources`            | Affiliate and free resource map                            |
| `/install`              | PWA install instructions                                   |
| `/privacy`              | Privacy Policy                                             |
| `/terms`                | Terms of Service                                           |
| `/cancellation`         | Cancellation & Refund Policy                               |
| `/affiliate-disclosure` | FTC-compliant affiliate disclosure                         |
| `/disclaimer`           | Full educational disclaimer                                |

---

## Reviewer Checklist

A reviewer can verify the project is deploy-ready by confirming:

- [ ] `npm install` — completes with no errors
- [ ] `npm run typecheck` — 0 TypeScript errors
- [ ] `npm run lint` — 0 ESLint errors
- [ ] `npm run build` — builds cleanly
- [ ] `npm run dev` — starts on localhost:3000
- [ ] `/` loads — landing page renders
- [ ] `/assessment` loads — 7 steps render and advance
- [ ] `/unlock` loads — tiers display (Stripe not needed to load page)
- [ ] `/resources` loads — affiliate categories render
- [ ] `/platform-ecosystem` loads — trade grid renders
- [ ] `/api/checkout` POST with missing Stripe key — returns 500 (expected)
- [ ] `/api/verify-session` GET without session_id — returns 400
- [ ] `/api/webhook` POST without signature — returns 400
- [ ] `/api/track-click` POST with missing Supabase env — returns URL, logs non-fatal error
- [ ] `/api/postback/jobber` GET without subid — returns 400
