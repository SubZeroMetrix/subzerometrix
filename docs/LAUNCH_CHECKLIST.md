# Launch Checklist — Item-Level Scorecard

*See [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) for the category-level dashboard this checklist supports. Acceptance criteria below are the concrete, checkable form of [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md)'s Definition of Done and [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md)'s commitments.*

Status values: **NOT STARTED · IN PROGRESS · READY · VERIFIED · BLOCKED**. Every item has an objective, checkable acceptance criterion — not a subjective judgment call.

## Product & Design
| Item | Status | Acceptance Criteria |
|---|---|---|
| Homepage describes only shipped MCC capability | VERIFIED | No feature mentioned that isn't real and live (audited this session) |
| Buster has real, prominent visual presence | VERIFIED | Hero + dedicated section + footer nav, real badge asset (confirmed live) |
| Real product screenshot/dashboard preview | NOT STARTED | A real, non-fabricated image of the actual product exists on the page |
| Skip-to-content link | VERIFIED | `Skip to main content` present and functional (confirmed live) |

## SEO
| Item | Status | Acceptance Criteria |
|---|---|---|
| Canonical URL points at serving host, not a redirect | VERIFIED | `<link rel="canonical">` = `www.subzerometrix.com` (confirmed live) |
| Sitemap includes core public routes | VERIFIED | `/sitemap.xml` returns 200 with correct URLs (confirmed live) |
| `robots.txt` correctly scoped | VERIFIED | Returns 200, disallows `/api/`, `/admin/`, `/go/` (confirmed live) |
| `llms.txt` describes both products on this domain | VERIFIED | Mentions "Metrix Command Center" (confirmed live, 3 occurrences) |
| Google Search Console verified + sitemap submitted | NOT STARTED | Verification meta tag or DNS record present, sitemap submitted in GSC |
| Bing Webmaster Tools verified + sitemap submitted | NOT STARTED | Same, for Bing |

## Accessibility
| Item | Status | Acceptance Criteria |
|---|---|---|
| Skip link | VERIFIED | See above |
| Keyboard-only navigation trace | NOT STARTED | Every interactive element reachable and operable via keyboard alone |
| Screen-reader pass | NOT STARTED | Page makes sense read top-to-bottom by a screen reader |
| Contrast ratios meet WCAG AA | NOT STARTED | Measured with a real contrast-checking tool, not assumed from design tokens |

## Security & Privacy
| Item | Status | Acceptance Criteria |
|---|---|---|
| RLS enabled on all tables | VERIFIED | Confirmed via migration files + live schema check this session |
| Service-role key never exposed client-side | VERIFIED | Confirmed via code review; server-only usage throughout |
| Lead data isolated from MCC production and legacy schema | VERIFIED | Live end-to-end test this session: write landed only in the dedicated project |
| Rate limiting on lead form | VERIFIED | In-memory, 5 req/min/IP (known limitation: resets on redeploy — see Risk Register) |
| Privacy Policy discloses all current data collection | VERIFIED | Reconciled against real data flows (third-party processors, cross-domain routing, Vercel Analytics), attorney-reviewed — see `LEGAL_REVIEW_PACKAGE.md` |
| Terms of Use covers MCC pricing/trial/cancellation/refund | VERIFIED | Sourced from real live pricing constants, attorney-reviewed |
| Formal legal review of combined Terms/Privacy for this domain | VERIFIED | Owner-confirmed attorney sign-off — see `LAUNCH_RISK_REGISTER.md` L-1 |

## Commercial Funnel (L-5)
| Item | Status | Acceptance Criteria |
|---|---|---|
| Stripe checkout session creation (code-level) | VERIFIED | Real `mode: "subscription"`, `trial_period_days: 7`, confirmed via read-only audit of `command-center` |
| Founder-code eligibility + 100-seat cap enforcement | VERIFIED | Atomic RPC redemption before any Stripe session created, confirmed via code review |
| Webhook signature verification + idempotency | VERIFIED | Confirmed via code review: signature-checked, keyed on `event.id`, rate-limited |
| Entitlement-gated billing portal (cancellation) | VERIFIED | Real `get_my_entitlement_v0` check before Stripe Billing Portal session, confirmed via code review |
| Live end-to-end checkout test | BLOCKED (OWNER ACTION REQUIRED) | `STRIPE_SECRET_KEY` not set locally in `command-center`; no confirmed test-mode credential; must be run inside that repo |
| Production Stripe mode (test vs. live) confirmed | BLOCKED (OWNER ACTION REQUIRED) | Not checkable from this repo's access level |

## Infrastructure & Deployment
| Item | Status | Acceptance Criteria |
|---|---|---|
| DNS configured and live | VERIFIED | `www.subzerometrix.com` resolves and serves 200 (confirmed live) |
| Five-stage release process functioning | VERIFIED | Proven this session: committed → pushed → deployed → aliased → live-verified |
| Stale-alias safeguard documented and exercised | VERIFIED | Real incident documented in `DEPLOYMENT.md`, safeguard used successfully since |
| Isolated MCC-leads Supabase project | VERIFIED | `sskgceffpkiuxjhlyjjr`, migration applied, zero legacy schema (confirmed this session) |

## Analytics & Conversion
| Item | Status | Acceptance Criteria |
|---|---|---|
| Vercel Analytics installed | VERIFIED | `<Analytics />` in root layout, confirmed live |
| Real traffic data reviewed | NOT STARTED | Too new — needs real visitors before this can be checked |
| Pricing/CTA routing correct | VERIFIED | Live-tested this session; routes to `mcc.subzerometrix.com/signup` |

## Lead Capture & Email
| Item | Status | Acceptance Criteria |
|---|---|---|
| Lead form end-to-end (submit/validate/dedupe/honeypot) | VERIFIED | Full live test suite passed this session |
| TEST SEED data cleaned up | VERIFIED | Confirmed zero rows remain post-test |
| Admin UI to view captured leads | NOT STARTED | A real page/view, not just direct DB query |
| Owner email notification on new lead | NOT STARTED | No email provider configured yet |

## Support & Documentation
| Item | Status | Acceptance Criteria |
|---|---|---|
| Support contact method exists | READY | `info@subzerometrix.com` live and correct |
| Formal support process/SLA | NOT STARTED | Documented response-time commitment |
| Governing documentation complete and cross-referenced | VERIFIED | Constitution set + `DOCUMENTATION_INDEX.md` (this session) |
