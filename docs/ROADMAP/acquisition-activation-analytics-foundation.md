# Acquisition + Activation Analytics Foundation — Growth-6 (Active Foundation)

**Status:** Active foundation. Lightweight, **privacy-respecting, device-local**
acquisition + activation analytics. No third-party trackers, no ad pixels, no
retargeting, no cookies, no PII, no account/cloud sync.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-6 built

- **`src/lib/growthAnalytics.ts`** — `AcquisitionChannel`, `ActivationMilestone`,
  `GrowthEventName`, `GrowthEventContext`, `GrowthSourceContext`,
  `GrowthActivationRecord`; helpers `getGrowthSourceContext`, `createGrowthEvent`,
  `trackGrowthEvent`, `getActivationMilestoneLabel`, `getAcquisitionChannelLabel`,
  `saveGrowthEventLocal`, `getGrowthEventsLocal`, `getGrowthAnalyticsDisclosureText`.
- **`src/components/GrowthEventTracker.tsx`** — fires one device-local activation event
  on mount; renders nothing; no PII; no external calls.
- **`src/components/GrowthAnalyticsSummary.tsx`** — device-local "Your activity" summary
  on the dashboard (milestone counts; no business-result claims, no benchmarking).
- **`src/lib/analytics.ts`** — added `growth_event_tracked`,
  `acquisition_source_detected`, `activation_milestone_reached` to the no-op stub.
- Trackers placed on `/general-business-starter`, `/business-readiness`, `/es`,
  `/es/como-empezar-un-negocio`, `/partners`, `/results`, `/dashboard`, `/report`.

## Acquisition channel taxonomy

`organic_search` · `ai_search` · `direct` · `referral` · `partner` · `vendor` ·
`association` · `community` · `spanish_discovery` · `general_business_starter` ·
`resource_page` · `unknown`. Channel is inferred from the referral `ref` param and the
referrer **host** only (e.g., a search-engine or AI host) — never a full URL, never PII.

## Activation milestone taxonomy

`public_page_viewed` · `starter_assessment_started` · `starter_assessment_completed` ·
`results_viewed` · `report_viewed` · `dashboard_viewed` · `roadmap_action_viewed` ·
`kpi_saved` · `feedback_submitted` · `share_link_copied` · `referral_created` ·
`partner_interest_saved` · `reassessment_completed`.

## Local/device-side event storage

Events are saved under `szm_growth_events` (capped to the most recent 300,
`storageMode: 'local_device'`). Each record holds `id`, `eventName`, `createdAt`,
`path` (pathname only), `source`, `channel`, `language`, `locale`, `milestone`, and
non-PII `metadata`. Events also pass through the existing no-op `trackEvent` stub.

## What is NOT tracked

No email, name, phone, company, or free-text form content. No full URLs/query strings,
no cookies, no fingerprinting, no cross-account/user identity, no third-party scripts,
no ad pixels, no retargeting, no external network calls.

## Spanish / source segmentation

`language`/`locale` (`es` / `es-US` on Spanish pages) and `source`/`channel` are
recorded per event, enabling future segmentation by language and acquisition source —
including partner/referral/source attribution from the `ref` param.

## Privacy / trust guardrails

- Device-local only; no account/cloud analytics sync.
- No PII, no cookies, no ad pixels, no retargeting, no third-party vendors.
- Educational / product-improvement focused.
- No guaranteed leads, revenue, rankings, or business success; no benchmarking claims.

## Future (planned, NOT built)

- A local activation dashboard view (richer than the current summary).
- Account/cloud analytics **only after auth + a privacy review**.
- Ad/CRM integrations **only after explicit consent + compliance review**.
