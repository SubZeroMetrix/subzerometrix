# Vercel Deployment Notes

## Live URLs

- **Production:** https://subzerometrix.vercel.app
- **GitHub repo:** https://github.com/SubZeroMetrix/subzerometrix.git

## Deployment Method

Vercel auto-deploys from the `main` branch on GitHub push.

To deploy: `git push origin main`

## Environment Variables

Set in the Vercel dashboard under **Project Settings > Environment Variables**.

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel only | Never expose client-side |
| `STRIPE_SECRET_KEY` | Vercel + `.env.local` | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Vercel + `.env.local` | Stripe webhook signing |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel + `.env.local` | Stripe public key |
| `DEV_UNLOCK` | `.env.local` ONLY | **Never add to Vercel production** |

## Local Dev Setup

1. Copy `.env.example` to `.env.local`
2. Fill in real values
3. Run `npm.cmd install`
4. Run `npm.cmd run dev`
5. Visit http://localhost:3000

## Important Rules

- Never commit `.env.local`.
- `DEV_UNLOCK=true` is local only.
- Do not use the old OneDrive folder for development.
- Always run `npm.cmd run build` before pushing to confirm no build errors.

## Build Check

```powershell
cd C:\AI-Projects\subzerometrix
npm.cmd run build
```

## Vercel Config

See `vercel.json` in the project root for any custom routing or header config.
