# Vendor Interest Tracking Plan (Future — Not Yet Built)

**Status:** Planning only. No new analytics or tracking code is built as part of this plan.
**Purpose:** Before applying for affiliate or vendor agreements, measure which vendor
markets contractors actually care about — by category, stage, trade, and goal — so outreach
targets the highest-demand partners first.

## What already exists

`POST /api/track-click` already logs every outbound vendor click to the Supabase
`referral_clicks` table (non-fatal, never blocks redirect). It currently captures:

- `vendor_slug`, `vendor_category`, `vendor_vertical`
- `source_page`, `source_position`, `placement_type`
- `subid`, `full_tracking_url`
- `user_id`, `session_id`
- `user_trade`, `user_state`, `user_score`, `user_band`, `user_stage`
- `utm_source`, `utm_medium`, `utm_campaign`
- `disclosure_shown`, `disclosure_text`, `disclosure_shown_at`

A `disclosures_log` table records each disclosure shown (compliance audit).

## Fields the plan wants to capture per vendor-interest event

| Field | Status today | Notes |
|---|---|---|
| `vendorId` | ✅ (`vendor_slug`) | Already captured |
| `vendorName` | ➕ add | Derive from vendor registry at log time |
| `categoryId` | ✅ (`vendor_category`) | Already captured |
| `roadmapPhase` | ➕ add | Which growth phase the click came from |
| `userStage` | ✅ (`user_stage`) | Already captured |
| `trade` | ✅ (`user_trade`) | Already captured |
| `state` | ✅ (`user_state`) | Already captured |
| `mainGoal` | ➕ add | From Quick Intake (`szm_intake.mainGoal`) |
| `biggestChallenge` | ➕ add | From Quick Intake (`szm_intake.biggestChallenge`) |
| `score` | ✅ (`user_score`) | Already captured |
| `riskLevel` | ✅ (≈ `user_band`) | Map MetrixScore risk level when new engine is wired |
| `timestamp` | ✅ (row `created_at`) | Already captured |
| `sourcePage` | ✅ (`source_page`) | Already captured |

**Net new fields to add later:** `vendorName`, `roadmapPhase`, `mainGoal`, `biggestChallenge`.
Everything else is already logged.

## How it would work (future implementation, not now)

1. Pass `roadmapPhase`, `mainGoal`, and `biggestChallenge` into the `track-click` POST body
   from the report (read intake from local storage; phase from the growth-phase context).
2. Add the four new columns to `referral_clicks` (Supabase migration).
3. Resolve `vendorName` from the vendor registry server-side at insert time.
4. Build a simple read-only dashboard query: clicks grouped by `vendor_category`,
   `vendor_slug`, `user_stage`, `user_trade`, and `mainGoal` to rank demand.

## Privacy & compliance notes

- No regulated/sensitive data is collected (see `sanitizePostbackPayload` blocklist).
- Logging stays non-fatal — it must never block the user redirect.
- This is interest measurement only — it does not activate affiliate links or add tracking codes.

## Why this matters

The output answers: *"Which vendor categories and specific tools do contractors at each
stage/trade click most?"* That ranking determines which affiliate/vendor agreements to
pursue first — instead of applying broadly and hoping.
