// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceAttribution — Wave 5: privacy-safe recommendation attribution
// ─────────────────────────────────────────────────────────────────────────────
// Builds sanitized, consent-aware attribution context + funnel events for the
// recommendation surface (impression → card open → outbound click → feedback). It
// ROUTES THROUGH the existing analytics sink (trackEvent) and reuses the existing
// event-name conventions; the existing server-side /api/track-click + referral_clicks
// log remain the source of truth for outbound affiliate clicks — this adapter never
// duplicates that record, it only emits the privacy-safe funnel signal.
//
// HARD RULES:
//   • NO raw answers, emails, names, notes, or sensitive identifiers ever leave here.
//   • Only an allow-listed, non-PII context is emitted.
//   • Consent-aware: when consent is not granted, events are dropped silently.
//   • Commercial status is recorded for disclosure/auditing only — it is descriptive,
//     never a ranking input (ranking lives in resourceRecommendations.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { trackEvent, type AnalyticsEvent } from '../analytics'
import type { CanonicalResource } from './resourceTypes'
import type { ResourcePlacement } from './resourceTypes'
import type { ResourceHelpfulness } from './resourceRecommendations'

export const ATTRIBUTION_VERSION = 1

// The ONLY fields permitted to leave the device for a recommendation event. Anything
// not on this list is dropped. No free text, no answers, no PII.
export interface AttributionContext {
  resourceId: string
  vendorId: string | null
  category: string
  placement: ResourcePlacement
  trade: string | null
  state: string | null
  lifecycleStage: string | null
  priorityCategory: string | null
  relationshipStatus: string       // descriptive (disclosure/audit) — never affects ranking
  affiliateStatus: string
  sponsorshipStatus: string
  disclosureShown: boolean
}

export interface AttributionOptions {
  placement: ResourcePlacement
  trade?: string | null
  state?: string | null
  lifecycleStage?: string | null
  priorityCategory?: string | null
  disclosureShown?: boolean
  // Consent gate — events are emitted ONLY when this is explicitly true.
  consentGranted?: boolean
}

const ALLOWED_STATE = /^[A-Za-z]{2}$/   // 2-letter state code only; anything else is dropped
const clean = (v: unknown): string | null => {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length > 0 && t.length <= 40 ? t : null
}

/** Build a sanitized, non-PII attribution context for a resource recommendation. */
export function buildAttributionContext(res: CanonicalResource, opts: AttributionOptions): AttributionContext {
  const rawState = clean(opts.state)
  return {
    resourceId: res.resourceId,
    vendorId: res.vendorId,
    category: res.category,
    placement: opts.placement,
    trade: clean(opts.trade),
    state: rawState && ALLOWED_STATE.test(rawState) ? rawState.toUpperCase() : null,
    lifecycleStage: clean(opts.lifecycleStage),
    priorityCategory: clean(opts.priorityCategory),
    relationshipStatus: res.relationshipStatus,
    affiliateStatus: res.affiliateStatus,
    sponsorshipStatus: res.sponsorshipStatus,
    disclosureShown: !!opts.disclosureShown,
  }
}

// Defensive serialization — strips anything that isn't a string/number/boolean primitive.
function toProps(ctx: AttributionContext): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(ctx)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = v
  }
  return out
}

function emit(event: AnalyticsEvent, res: CanonicalResource, opts: AttributionOptions, extra: Record<string, string | number | boolean> = {}): void {
  if (opts.consentGranted !== true) return   // consent-aware: no consent → no event
  try {
    trackEvent(event, { ...toProps(buildAttributionContext(res, opts)), ...extra })
  } catch {
    // Attribution must never break the UI.
  }
}

export function trackRecommendationImpression(res: CanonicalResource, opts: AttributionOptions): void {
  emit('recommendation_impression', res, opts)
}

export function trackRecommendationOpen(res: CanonicalResource, opts: AttributionOptions): void {
  emit('recommendation_card_opened', res, opts)
}

/**
 * Emit the privacy-safe funnel signal for an outbound click. The actual tracked URL +
 * server-side referral_clicks record are still produced by the existing /api/track-click
 * endpoint — this does not duplicate that record.
 */
export function trackRecommendationOutboundClick(res: CanonicalResource, opts: AttributionOptions): void {
  emit('recommendation_outbound_click', res, opts)
}

export function trackRecommendationFeedback(res: CanonicalResource, feedback: ResourceHelpfulness, opts: AttributionOptions): void {
  emit('recommendation_feedback_submitted', res, opts, { feedback })
}
