# Affiliate Revenue Setup

## Overview

SubZeroMetrix earns affiliate revenue by connecting tradespeople with relevant vendors, tools, and services. Revenue is tracked via the existing postback and click-tracking system in `src/app/api/`.

## Tracking Architecture (Existing)

| File | Purpose |
|---|---|
| `src/app/api/track-click/route.ts` | Logs affiliate link clicks |
| `src/app/api/postback/[vendor]/route.ts` | Receives conversion postbacks from vendors |
| `src/lib/affiliates.ts` | Affiliate link definitions |
| `src/lib/tracking.ts` | Tracking helpers |

## Setup Checklist (Per Vendor)

- [ ] Apply to affiliate program
- [ ] Receive affiliate ID and tracking link format
- [ ] Add vendor entry to `src/lib/affiliates.ts`
- [ ] Test click tracking via `track-click` route
- [ ] Configure postback URL with vendor (points to `/api/postback/[vendor]`)
- [ ] Verify conversion data in Supabase
- [ ] Add vendor card to resources/marketplace page

## Revenue Notes

- Do not add vendor links without affiliate approval.
- Disclose affiliate relationships per FTC guidelines (see `/affiliate-disclosure` page).
- Track EPC (earnings per click) per vendor once live data accumulates.

## Next Steps

See `affiliate-market-map.md` for the full vendor category list to prioritize.
