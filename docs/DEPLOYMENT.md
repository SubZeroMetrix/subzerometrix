# Deployment

Live domain: **https://www.subzerometrix.com** (apex `subzerometrix.com` 308-redirects to `www`). Default/production branch: **`major-build-1`** (`main` was deleted from the remote — do not recreate it or target it in a PR; see `docs/INFRASTRUCTURE.md`). Vercel project: `sub-zero-metrix/subzerometrix`.

## The five release stages — do not conflate them

A release is not "done" until all five are independently true. Each one can be true while the next is false — that gap is exactly how a stale deployment served for real requests on 2026-07-13 (see "Known incident" below).

1. **COMMITTED** — `git commit` succeeded locally. Proves nothing about what's live.
2. **PUSHED** — `git push origin major-build-1` succeeded. Proves the code reached GitHub. Still proves nothing about what's live.
3. **VERCEL DEPLOYED** — a Vercel deployment exists and reports `READY` for that commit (checkable via `gh api repos/SubZeroMetrix/subzerometrix/commits/<sha>/status`, or `vercel ls`). **This is not proof the production domain is serving it** — a `READY` deployment can exist without ever being aliased to production traffic.
4. **PRODUCTION ALIASED** — the production alias (`www.subzerometrix.com`) actually points at that specific deployment ID. Check with `vercel inspect www.subzerometrix.com --json` and compare the `id` field against the deployment you expect.
5. **LIVE VERIFIED** — a real HTTP request against `https://www.subzerometrix.com` exhibits the new commit's actual behavior (not just a 200 — the specific changed feature must be exercised and proven). This is the only stage that counts as "shipped."

**Never report a release complete before stage 5.** Stages 1-4 can all be true while the live site still serves old code.

## Required release flow

1. **Build** the change locally.
2. **Validate**: `npm run lint`, `npx tsc --noEmit`, `npm run build` — all clean.
3. **Commit** — only the files belonging to this change; never sweep in unrelated pre-existing WIP.
4. **Push** to `origin/major-build-1`.
5. **Confirm GitHub commit status**: `gh api repos/SubZeroMetrix/subzerometrix/commits/<sha>/status` — expect `"state":"success"` with a Vercel context. This proves stage 3 (VERCEL DEPLOYED), nothing more.
6. **Confirm Vercel created a deployment for the exact commit** — cross-check the deployment ID/timestamp from step 5 against `vercel ls`.
7. **Confirm the production alias points to that deployment** — `vercel inspect www.subzerometrix.com --json`, compare `id`. If it does not match, treat this as a release defect, not a formality — proceed to the stale-alias safeguard below before doing anything else.
8. **Verify the live site is serving the new commit** — make a real request that can only succeed/fail based on the new code (not just "homepage returns 200").
9. **Run live route smoke tests** (see checklist below).
10. **Run one feature-specific production proof** — actually exercise the thing that changed (e.g., a real form submission, not just a page load).
11. **Record the final live deployment URL and commit hash** in the change's own report/commit message.

## Stale-alias safeguard

**GitHub deployment success alone is not sufficient proof of a live release.** On 2026-07-13, commit `4c4297a`'s GitHub commit-status showed `"state":"success"` with a completed Vercel deployment, yet the live production alias (`www.subzerometrix.com`) was still serving an older build — confirmed by an old error string (`"Missing Supabase admin credentials"`, from code that commit had already replaced) appearing in live server logs. The mismatch was found only by cross-checking real runtime behavior against the committed source, not by trusting the GitHub check.

If the live production alias is stale or mismatched:
1. Run an explicit production deploy: `vercel --prod` (not just relying on the automatic Git-triggered build).
2. Confirm alias assignment: the CLI output should show `▲ Aliased  https://www.subzerometrix.com`, or re-check via `vercel inspect www.subzerometrix.com --json`.
3. Verify the exact commit is live — re-run the feature-specific proof from step 10 above; do not assume the redeploy fixed it without re-testing.
4. **Do not report deployment complete until live proof passes.** A successful `vercel --prod` command is stage 4 (PRODUCTION ALIASED), not stage 5.

## Live verification checklist (run every release)

- `https://www.subzerometrix.com` → `200`
- Apex `https://subzerometrix.com` → `308` redirect to `https://www.subzerometrix.com` (canonical domain behavior)
- `https://www.subzerometrix.com/sitemap.xml` → `200`
- `https://www.subzerometrix.com/robots.txt` → `200`
- `https://www.subzerometrix.com/privacy` → `200`
- `https://www.subzerometrix.com/terms` → `200`
- No unexpected errors in `vercel logs www.subzerometrix.com` around the deployment window
- The specific changed feature actually works when exercised live (not inferred from a 200)
- No TEST SEED / synthetic verification data left behind in any database afterward

## Environment Variables

Set in Vercel dashboard for each environment (Preview, Production) — see `.env.example` for the full list, including the landing-lead-specific `MCC_LEADS_SUPABASE_URL` / `MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY` pair (isolated to the `SubZeroMetrixLandingPage` Supabase project, `sskgceffpkiuxjhlyjjr` — never the shared affiliate-site project). Never commit real values to the repository, and never fetch/print/write raw key values to disk during verification — use the Supabase/Vercel CLIs' own authenticated sessions (`--linked`, `env ls` names-only) instead.

## Rollback

If the production deployment has issues:
1. Identify the last known-good deployment ID via `vercel ls`.
2. Promote it back to production: `vercel promote <deployment-url>` (or redeploy from the last good commit).
3. Re-run the live verification checklist above against the rollback before considering it complete.
4. See `docs/ROLLBACK.md` for additional detail.

## Domain

Live: `subzerometrix.com` / `www.subzerometrix.com`, DNS configured and verified 2026-07-13.
