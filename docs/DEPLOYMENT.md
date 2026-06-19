# Deployment

## Preview Deployment

1. Push the `major-build-1` branch to GitHub
2. Vercel automatically creates a preview deployment
3. Verify the preview URL works correctly
4. Do NOT merge to main until blockers are resolved

## Production Deployment

1. Resolve all blockers listed in MAJOR-BUILD-1-REPORT.md
2. Verify domain spelling (subzerometric.com vs subzerometrix.com)
3. Set all environment variables in Vercel production
4. Apply Supabase migrations to production project
5. Merge major-build-1 to main
6. Vercel deploys automatically
7. Configure custom domain in Vercel dashboard
8. Verify SSL, redirects, and all routes

## Environment Variables

Set in Vercel dashboard for each environment (Preview, Production):
- See .env.example for the full list
- Never commit real values to the repository

## Rollback

If the production deployment has issues:
1. Revert to the pre-major-build-1 tag
2. See docs/ROLLBACK.md for detailed steps

## Domain

The provisional domain is subzerometric.com. Do NOT configure production DNS until the exact domain spelling is verified by the owner.
