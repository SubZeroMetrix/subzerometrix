# Local Testing Checklist

## Environment

- **Local dev URL:** http://localhost:3000
- **Report bypass URL:** http://localhost:3000/report?session_id=dev_bypass
- **Requires:** `DEV_UNLOCK=true` in `.env.local`

## Before Every Push

- [ ] `npm.cmd run build` passes with no errors
- [ ] No TypeScript errors
- [ ] `.env.local` is not staged in git
- [ ] `node_modules` is not staged in git
- [ ] `.next` is not staged in git

## Core Flow Tests

### Homepage
- [ ] Page loads at http://localhost:3000
- [ ] CTA buttons work
- [ ] Navigation links resolve

### Assessment
- [ ] `/assessment` loads
- [ ] All questions render
- [ ] Submitting completes without error
- [ ] Score is calculated and displayed

### Report / Roadmap
- [ ] `/report?session_id=dev_bypass` loads locally
- [ ] Roadmap items display correctly
- [ ] Affiliate links are present and tracked

### Stripe Payment Flow
- [ ] Checkout route responds (`/api/checkout`)
- [ ] Webhook route is reachable (`/api/webhook`)
- [ ] Session verification works (`/api/verify-session`)
- [ ] Do not test with real card numbers locally — use Stripe test mode keys

### Affiliate Tracking
- [ ] Click tracking fires (`/api/track-click`)
- [ ] Postback route accepts test payload (`/api/postback/[vendor]`)

## After Build

- [ ] No new console errors in browser
- [ ] No layout regressions on homepage
- [ ] Mobile view checks out (resize browser or DevTools)

## Notes

- DEV_UNLOCK bypasses Stripe session check on `/report`. Keep local only.
- Run `CLEAN_NEXT.ps1` if you hit stale build cache issues.
