# Legal Review Package

*See [`LAUNCH_RISK_REGISTER.md`](./LAUNCH_RISK_REGISTER.md) L-1 (RESOLVED). Governed by [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md) and [`BRAND_CONSTITUTION.md`](./BRAND_CONSTITUTION.md)'s claims policy.*

**Status: attorney review complete, per owner confirmation.** The owner (Richard Fritzke) confirmed directly that the content described in this package — the new MCC-related sections of `/terms` and `/privacy` — has been reviewed and approved by an attorney. The `[DRAFT — ATTORNEY REVIEW REQUIRED]` markers were removed from the live pages on that instruction. This session did not independently see attorney documentation; this package records the owner's representation, consistent with this document's own "written sign-off or explicit founder acceptance" verification standard.

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

- [x] Confirm Terms of Use's new "Metrix Command Center" section (pricing/trial/cancellation/refund summary) is accurate and sufficiently protective, or redraft. — owner-confirmed reviewed and approved.
- [x] Confirm Privacy Policy's new third-party processor and cross-domain disclosures are complete and correctly characterized. — owner-confirmed reviewed and approved.
- [ ] Answer Unresolved Legal Questions 1–6 above. — not confirmed as individually answered; still worth a direct answer for the record even though the content itself is approved.
- [ ] Decide whether a standalone Acceptable Use Policy and/or AI Disclosure page are required; if so, scope them. — open, not required for current launch per owner's approval of existing content.
- [x] Confirm refund/cancellation language complies with applicable state auto-renewal and subscription-cancellation statutes for the jurisdictions the business operates in. — covered by the same approval.
- [x] Sign off (or direct correction of) all `[DRAFT — ATTORNEY REVIEW REQUIRED]` markers currently live on `/privacy` and `/terms`. — markers removed on owner instruction.

## Exact Pages Requiring Review

- `https://www.subzerometrix.com/terms` — new "Metrix Command Center" section.
- `https://www.subzerometrix.com/privacy` — new Vercel Analytics disclosure, new third-party processor list, new cross-domain routing disclosure, new MCC data-retention line.
- `https://www.subzerometrix.com/affiliate-disclosure` — unchanged, included for completeness of a full review rather than assumed clean.

## Owner Sign-Off

- [x] Owner (Richard Fritzke) confirmed in-session that this content has been reviewed and approved by an attorney, and directed removal of the `[DRAFT — ATTORNEY REVIEW REQUIRED]` markers from `/privacy` and `/terms`.

This entry is a record of that confirmation as given in conversation, not a substitute for retaining the actual attorney documentation in the company's own records.
