# Claude Instructions for SubZero Metrix

## Project

SubZero Metrix is an affiliate software comparison platform at subzerometric.com (provisional domain). It compares software for websites, email, automation, ecommerce, newsletters, SEO, and online business growth.

## Brand Rules

- Use the exact supplied logo at public/brand/subzero-metrix-logo.png without modification
- Legal entity: SubZero Metrix LLC
- Trademark: SubZero Metrix™
- Colors: midnight navy, electric blue, icy cyan, metallic silver, white
- Never fabricate reviews, user counts, discounts, or rankings

## Tech Stack

- Next.js 14 (App Router, TypeScript, React 18)
- Tailwind CSS
- Supabase (auth, database, RLS)
- Stripe (future products only — not for affiliate commissions)
- Vercel deployment

## Key Directories

- src/app/ — routes
- src/components/ — shared components
- src/lib/ — utilities (supabase/, affiliate/, analytics/, email/, stripe/, validation/)
- content/ — seed data for products, comparisons, tool-finder rules
- types/ — TypeScript interfaces
- database/ — Supabase migrations
- docs/ — project documentation
- public/brand/ — logo and brand assets

## Development

```
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Rules

- Never commit real environment values
- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser
- Affiliate disclosures must appear near commercial content
- Do not make unsubstantiated income or results claims
- All editorial recommendations must be based on use-case fit, not commission rates
