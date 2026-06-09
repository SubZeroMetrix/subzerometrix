# Claude Instructions for SubZeroMetrix

## Important

Before doing any work, read:

1. PROJECT_BRIEF.md
2. CLAUDE.md

Treat PROJECT_BRIEF.md as the project source of truth.

## Role

You are working on the SubZeroMetrix web app as the developer inside the codebase.

## Before Making Changes

Always:
- Review the current file structure.
- Identify the files related to the task.
- Explain your plan before making major changes.
- Ask for approval before large rewrites.

## Development Rules

Always:
- Preserve existing working features.
- Make small, testable changes.
- Do not rewrite the whole app unless explicitly asked.
- Do not expose or hardcode secret keys.
- Keep the project compatible with Vercel.
- After meaningful edits, run npm.cmd run build.
- If the build fails, explain the error and suggest the fix.
- Summarize every file changed.

## Tech Assumptions

- Next.js app
- Vercel deployment
- Supabase may be used for auth/database
- Stripe may be used for payments
- Use the existing project structure unless there is a clear reason to change it.

## Business Rules

- This app serves tradespeople who want to start and grow contracting businesses.
- Copy should sound practical, direct, field-tested, and trustworthy.
- Avoid hype, vague startup language, or corporate filler.
- Rich is the final decision maker.

## Current Priorities

1. Stability
2. Clean UI
3. Contractor-readiness scoring
4. Roadmap/dashboard experience
5. Supabase and Stripe integration
6. Future vendor/affiliate marketplace
