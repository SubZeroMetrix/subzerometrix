# Partner / Vendor / Association Distribution System — Growth-5 (Active Foundation)

**Status:** Active foundation. A public partner page with an **active local-device
partner-interest form** is live. No fake partnerships, no endorsements/affiliate
claims unless verified, no automatic outreach, no CRM/email integrations.

Owner/operator: **The Modern Trades Mentor LLC**. Contact: **themoderntradesmentor@gmail.com**.
Branding: **SubZeroMetrix™**, **MetrixScore™** (™, not ®).

## Active now

- **`src/lib/partnerDistribution.ts`** — `PartnerChannelType` (trade_association,
  supplier_vendor, manufacturer, distributor, coach_consultant, trade_school,
  community_group, podcast_media, software_vendor, local_business_network),
  `PartnerFitScore`, `PartnerInterestStatus`, `PartnerDistributionChannel`,
  `PartnerInterestSubmission`, `PartnerOutreachTemplate`, `PartnerResourceAsset`;
  helpers `getPartnerChannelTypes`, `getPartnerDistributionChannels`,
  `getPartnerFitScore`, `getPartnerOutreachTemplates`, `getPartnerResourceAssets`,
  `createPartnerInterestSubmission`, `savePartnerInterestLocal`,
  `getPartnerInterestLocal`, `getPartnerDisclosureText`.
- **`src/app/partners/page.tsx`** — public page: who it is for, how partners can share,
  channel types, shareable resource assets, contact email, disclosure, and the form.
- **`src/components/PartnerInterestForm.tsx`** — active client form (name/company,
  partner type, website, email, collaboration note, consent) → **saved on this device**
  → confirmation pointing to the contact email.
- **Share/referral integration** — added a `partners` share context to
  `shareEngine.ts` / `referralEngine.ts`; `/partners` carries a manual share card.
- **Nav** — light links to `/partners` from `/about`, `/resources`, `/platform-ecosystem`.
- **Discovery** — `/partners` added to `sitemap.ts`; factual mention in `llms.txt`.

## Channel types & fit

Ten channel types with a `PartnerFitScore` (high/medium/low) — associations, trade
schools, communities, and coaches score `high`; suppliers/distributors/software/local
networks/media `medium`; manufacturers `low`. Fit is an internal prioritization signal,
not a claim about any specific organization.

## Local-device capture

`PartnerInterestSubmission` records are saved under `szm_partner_interest`
(`storageMode: 'local_device'`), default `status: 'research'` — **never
`active_confirmed` automatically**. Nothing is sent externally; formal contact is by
email.

## Outreach templates & resource assets

`getPartnerOutreachTemplates()` provides honest, no-endorsement outreach copy.
`getPartnerResourceAssets()` lists public pages a partner can share (assessment,
business readiness, general starter, resources, Spanish).

## Intentionally NOT active yet (and why)

- **"Official partner" / endorsement / "approved" / "preferred" / "sponsor" / "affiliate"
  claims** — only true if verified in writing.
- **Paid partner placements / affiliate commission claims** — not in place.
- **Automatic outreach emails/messages** — manual/consent-first only.
- **Third-party CRM integrations** — out of scope.
- **Confirmed partner directory** — future, once relationships are verified.

## Future (planned)

CRM/email/partner-portal, a confirmed-partner directory, co-marketing assets, and
account-synced partner records once auth/cloud sync exist.

## Guardrails

- No fake endorsements, partnerships, association relationships, vendor approvals, or
  affiliate status.
- No paid-placement claims; no automatic outreach.
- No guaranteed leads, revenue, rankings, or business success.
- No legal/tax/financial/licensing advice.
- Preserve neutral affiliate/vendor language from prior cleanup; sharing/listing implies
  no endorsement unless confirmed in writing.
