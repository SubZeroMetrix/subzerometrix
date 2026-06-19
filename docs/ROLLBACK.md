# Rollback Plan

## Rollback Reference

- **Tag:** pre-major-build-1
- **Commit:** 6cf8b4a315d286fe4f89cc75bf7571cb0679c3cb
- **Branch:** main (at the time of tagging)

## Steps to Rollback

### 1. Code Rollback

```bash
git checkout main
git reset --hard pre-major-build-1
git push origin main --force
```

**Warning:** Force-pushing to main is destructive. Ensure the major-build-1 branch is preserved before doing this.

### 2. Vercel

Vercel will automatically redeploy from the reset main branch. Alternatively, use the Vercel dashboard to promote a previous deployment.

### 3. Supabase

If the new migrations have been applied:
- The old schema no longer exists in the database
- You may need to restore from a Supabase backup
- Contact Supabase support if Point-in-Time Recovery is needed

If the new migrations have NOT been applied:
- No database action needed

### 4. DNS

If DNS was changed:
- Revert DNS records to previous configuration
- Note: DNS propagation may take up to 48 hours

### 5. Stripe

If Stripe products were created:
- Archive the products in Stripe dashboard
- No customer data should be affected (no live checkout was enabled)

## Safer Alternative

Instead of force-pushing, create a revert commit:

```bash
git checkout main
git revert --no-commit major-build-1..HEAD
git commit -m "revert: roll back major-build-1 changes"
git push origin main
```

This preserves the full history.
