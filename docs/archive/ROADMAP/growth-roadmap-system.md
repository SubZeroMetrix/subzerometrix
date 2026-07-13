# Growth Roadmap System

## Purpose

The roadmap system gives each user a personalized, phase-based action plan based on their contractor readiness score. It is the core post-assessment experience.

## Phases (Current Design)

Phases are defined in `src/lib/growthPhases.ts` and `src/lib/growthRoadmap.ts`.

| Phase | Label | Focus |
|---|---|---|
| 1 | Foundation | Legal setup, licensing, insurance |
| 2 | Launch Ready | Tools, pricing, first clients |
| 3 | Early Growth | Systems, marketing, lead gen |
| 4 | Scaling | Hiring, software, repeat revenue |

## How It Works

1. User completes the assessment (`/assessment`)
2. Score is calculated via `src/lib/scoring.ts`
3. Score maps to a phase
4. Roadmap page (`/report`) displays phase-appropriate action items
5. Items link to affiliate resources where relevant

## Files

| File | Role |
|---|---|
| `src/lib/questions.ts` | Assessment questions |
| `src/lib/scoring.ts` | Score calculation |
| `src/lib/growthPhases.ts` | Phase definitions |
| `src/lib/growthRoadmap.ts` | Roadmap items per phase |
| `src/lib/roadmap.ts` | Roadmap rendering helpers |
| `src/app/report/page.tsx` | Report/roadmap display page |

## Dev Bypass

To test the report page locally without completing the assessment:

```
http://localhost:3000/report?session_id=dev_bypass
```

Requires `DEV_UNLOCK=true` in `.env.local`. Never add this to Vercel production.
