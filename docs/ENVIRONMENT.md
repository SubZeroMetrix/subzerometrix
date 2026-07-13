# Environment Variables

## Required for All Environments

| Variable | Description | Where |
|----------|-------------|-------|
| NEXT_PUBLIC_SITE_URL | Base URL of the site | Vercel + .env.local |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Vercel + .env.local |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key | Vercel + .env.local |

## Required for Server Features

| Variable | Description | Where |
|----------|-------------|-------|
| SUPABASE_SERVICE_ROLE_KEY | Supabase admin key (shared affiliate-site project) | Vercel only (server) |
| MCC_LEADS_SUPABASE_URL | Isolated Metrix Command Center landing-lead Supabase project URL — never the same project as NEXT_PUBLIC_SUPABASE_URL above; see docs/INFRASTRUCTURE.md | Vercel + .env.local |
| MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY | Admin key for the isolated MCC-leads project, used only by src/app/api/mcc-lead/route.ts | Vercel only (server) |
| STRIPE_SECRET_KEY | Stripe secret key | Vercel only (server) |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing | Vercel only (server) |

## Optional

| Variable | Description | When Needed |
|----------|-------------|-------------|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe public key | Future products |
| EMAIL_PROVIDER | Email service name | When email configured |
| EMAIL_PROVIDER_API_KEY | Email service key | When email configured |
| EMAIL_LIST_ID | Default email list | When email configured |
| ANALYTICS_PROVIDER | Analytics service | When analytics configured |
| NEXT_PUBLIC_ANALYTICS_ID | Analytics tracking ID | When analytics configured |
| AFFILIATE_CLICK_SIGNING_SECRET | Click event signing | When click signing enabled |
| CONTACT_EMAIL | Contact form recipient | When contact form sends email |
| ADMIN_EMAIL_ALLOWLIST | Allowed admin emails | When admin auth configured |

## Security Rules

- Never commit real values to the repository
- Never prefix server-only keys with NEXT_PUBLIC_
- SUPABASE_SERVICE_ROLE_KEY must never be exposed to the browser
- STRIPE_SECRET_KEY must never be exposed to the browser
