# Product-Led Sharing + Referral Engine — Growth-3 (Foundation Built)

**Status:** Foundation built. Manual, ethical, trackable sharing of public
SubZeroMetrix™ resources and referral links. **No auto-posting, no automatic invites,
no automatic messages, no social API integration.**

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-3 built

- **`src/lib/referralEngine.ts`** — `ReferralSource`, `ReferralChannel`,
  `ReferralContext`, `ReferralLink`; `buildReferralUrl`, `buildReferralLink`,
  `getReferralTrackingParams`, `getReferralPrompt`, `getReferralDisclosureText`.
- **`src/lib/shareEngine.ts`** — `ShareableResource`, `ShareCopyVariant`,
  `ShareContext`; `getShareableResources`, `getShareableResource`, `getShareCopy`,
  `buildShareUrl`, `getShareCtaLabel`.
- **`src/components/ShareReferralCard.tsx`** — a manual "copy link" card with a visible
  fallback link and honest disclosure copy.
- **`src/lib/analytics.ts`** — added `resource_shared`, `referral_created`,
  `share_link_copied` to the existing no-op event union.
- UI added to `/results`, `/business-readiness`, `/general-business-starter`,
  `/es`, `/es/como-empezar-un-negocio`.

## Manual sharing only

The only share action is **copy a link** (via the browser clipboard API, with a
visible fallback link if the clipboard is unavailable). SubZeroMetrix™ never sends
email/SMS, posts to social, or invites anyone automatically. The card shows a
disclosure: "Sharing is manual and optional. SubZeroMetrix™ never auto-sends
messages or posts on your behalf."

## Referral model

`ReferralSource` (results, report, dashboard, general_business_starter,
business_readiness, spanish_discovery, resources, referral_invite) ×
`ReferralChannel` (copy_link, email, sms_manual, social_manual, community_manual).
`buildReferralUrl` adds UTM-style params (`utm_source=subzerometrix`,
`utm_medium=<channel>`, `utm_campaign=referral`, `ref=<source>`) to a public path.

## Shareable resources

Starter MetrixScore™ insight (→ `/start`), business readiness (`/business-readiness`),
general business starter (`/general-business-starter`), contractor resources
(`/resources`), Spanish discovery (`/es`), Spanish business starter
(`/es/como-empezar-un-negocio`). Share text is **descriptive of the resource** — it
never puts a fake personal endorsement in the user's mouth.

## English / Spanish readiness

English copy for the public English pages; Spanish copy for the Spanish discovery
pages only. **No claim that the full platform is available in Spanish.**

## Future analytics (defined, not wired to a provider)

`resource_shared`, `referral_created`, `share_link_copied` are emitted to the existing
no-op `trackEvent` stub (dataLayer if present, else a dev log). No third-party
analytics and no new dependencies were added. Future segmentation can add source,
channel, and locale dimensions.

## Future connections (planned, not built)

- **Customer proof / review** — a shared, satisfied user is a future testimonial/
  review candidate (consent-first; see `customer-proof-review-engine.md`).
- **Partner / community** — referral channels (community_manual) support future
  partner/association outreach.

## Guardrails

- Manual share only; no auto-posting, no automatic invites, no automatic messages.
- No fake reviews, fake endorsements, or fake backlinks.
- Do not claim a user endorsed SubZeroMetrix™ unless they actively share it.
- No hidden AI prompt injection.
- No guaranteed results, rankings, leads, or business success.
- No legal/tax/financial/licensing advice.
- Spanish support stays discovery-layer only; no full-platform Spanish claim.
