# Legal Review Package

*See [`LAUNCH_RISK_REGISTER.md`](./LAUNCH_RISK_REGISTER.md) L-1. Governed by [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md) and [`BRAND_CONSTITUTION.md`](./BRAND_CONSTITUTION.md)'s claims policy. **Nothing in this package has been reviewed or approved by an attorney.** Every `[DRAFT — ATTORNEY REVIEW REQUIRED]` marker in the live pages themselves and every item in the checklist below is exactly what it says: unreviewed, requiring real legal sign-off before being relied upon.*

## Document Inventory

| Document | Route | Status |
|---|---|---|
| Terms of Use | `/terms` | Pre-existing content (affiliate platform) unchanged; new "Metrix Command Center" section added this pass, marked DRAFT |
| Privacy Policy | `/privacy` | Pre-existing content largely unchanged; new third-party processor disclosures and cross-domain routing disclosure added this pass, marked DRAFT |
| Affiliate Disclosure | `/affiliate-disclosure` | Unchanged this pass, no MCC-related content, no known issues |
| Acceptable Use Policy | **does not exist** | No dedicated page — gap, see Unresolved Questions |
| AI Disclosure | **does not exist as a dedicated page** | AI-related claims currently live only in homepage FAQ/copy (e.g., "approval-gated AI," "not yet available: SMS") — not consolidated into a standalone disclosure |
| Cookie/Consent language | Embedded in `/privacy`'s "Cookies and Consent" section + `ConsentBanner` component | No dedicated `/cookies` page |

## Business / Data-Flow Summary

This domain (`www.subzerometrix.com`) serves two distinct businesses under one legal entity (SubZero Metrix LLC):

1. **Affiliate software-comparison platform** — `/tools`, `/compare`, `/reviews`, `/guides`, `/tool-finder`. Collects: email list signups (`lead_signups` table), contact form submissions (`contact_submissions` table). Both in this repo's shared Supabase project (`vzbcunnrkexnmspeiwiu`).
2. **Metrix Command Center marketing/lead-capture** — the homepage (`/`). Collects: name, email, phone (optional), company (optional), message (`mcc_leads` table) in a **separate, isolated** Supabase project (`sskgceffpkiuxjhlyjjr`), provisioned specifically to keep this data apart from both the affiliate data above and MCC's own product database. Routes users to `mcc.subzerometrix.com` (a separate application, separate auth, separate billing via Stripe) for actual signup/purchase — this domain does not process payments or authenticate MCC users itself.

Third parties with data access: Supabase (both projects), Vercel (hosting + Vercel Web Analytics, cookieless), and whatever affiliate vendors a visitor clicks through to (governed by their own policies, not ours).

## Unresolved Legal Questions

1. Does cookieless analytics (Vercel Web Analytics) require the same opt-in consent gate as our first-party cookie-based analytics in the relevant jurisdictions we operate in, or is disclosure alone sufficient? (Currently: disclosed, not consent-gated.)
2. Is a standalone Acceptable Use Policy required, or is the current Terms of Use "No Guarantees"/content-use language sufficient for this site's actual functionality (no user-generated content, no marketplace)?
3. Is a standalone AI Disclosure page warranted given Metrix Command Center's AI-driven marketing claims (Buster, approval-gated AI), or is the homepage's own framing plus the Terms of Use's new MCC section sufficient?
4. Does the cross-domain handoff to `mcc.subzerometrix.com` (a different application, different data controller behavior) require more explicit consent/notice at the point of the "Start Free Trial" click, beyond the Privacy Policy disclosure added this pass?
5. Is the existing "No prorated or discretionary refunds... only where legally required" language (already live on the pricing page and now mirrored in Terms) sufficient and enforceable, or does it need jurisdiction-specific carve-outs (e.g., state auto-renewal statutes)?
6. Data retention for `mcc_leads` is currently stated as "until you request deletion or the inquiry is resolved" — is that specific enough, or does it need a maximum retention period?

## Attorney Checklist

- [ ] Confirm Terms of Use's new "Metrix Command Center" section (pricing/trial/cancellation/refund summary) is accurate and sufficiently protective, or redraft.
- [ ] Confirm Privacy Policy's new third-party processor and cross-domain disclosures are complete and correctly characterized.
- [ ] Answer Unresolved Legal Questions 1–6 above.
- [ ] Decide whether a standalone Acceptable Use Policy and/or AI Disclosure page are required; if so, scope them.
- [ ] Confirm refund/cancellation language complies with applicable state auto-renewal and subscription-cancellation statutes for the jurisdictions the business operates in.
- [ ] Sign off (or direct correction of) all `[DRAFT — ATTORNEY REVIEW REQUIRED]` markers currently live on `/privacy` and `/terms`.

## Exact Pages Requiring Review

- `https://www.subzerometrix.com/terms` — new "Metrix Command Center" section.
- `https://www.subzerometrix.com/privacy` — new Vercel Analytics disclosure, new third-party processor list, new cross-domain routing disclosure, new MCC data-retention line.
- `https://www.subzerometrix.com/affiliate-disclosure` — unchanged, included for completeness of a full review rather than assumed clean.

## Owner Sign-Off

- [ ] I have read this package and understand every `[DRAFT — ATTORNEY REVIEW REQUIRED]` marker is unreviewed legal content, not attorney-approved.
- [ ] I authorize this content to remain live pending attorney review / OR I direct it be taken down until reviewed *(circle one, date, initial)*.
- [ ] I accept responsibility for the Unresolved Legal Questions above until formally answered.

Owner: _______________________ Date: _______________
