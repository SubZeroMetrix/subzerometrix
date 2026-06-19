# Infrastructure

## Services

| Service | Role | Status |
|---------|------|--------|
| GitHub | Source code at SubZeroMetrix/subzerometrix | Active |
| Vercel | Hosting and deployment | Linked (preview deployment) |
| Supabase | Database, auth, RLS | Migration ready (not yet applied) |
| Stripe | Future SubZero Metrix products | Foundation only (test mode) |
| VPS | Not currently required | Reserved for future use |

## GitHub

- Organization: SubZeroMetrix
- Repository: subzerometrix
- Main branch: main
- Build branch: major-build-1
- Rollback tag: pre-major-build-1

## Vercel

- Linked project: subzerometrix
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Environment variables set in Vercel dashboard

## Supabase

- Migration file: `supabase/migrations/0001_affiliate_platform_init.sql`
- RLS enabled on all tables
- Public read policies on product/category/comparison tables
- No public write access to editorial data
- Service-role key used server-side only

## Stripe

- Used for future SubZero Metrix products only
- NOT used for affiliate commissions
- Webhook handler at `/api/webhooks/stripe`
- Signature verification required
- Live mode activation blocked until pricing/tax/refund terms approved

## VPS

No VPS is currently required. The architecture supports future VPS deployment for:
- Background workers
- Analytics aggregation
- Email queue processing
