// ─────────────────────────────────────────────────────────────────────────────
// Analytics — lightweight event placeholders (MVP)
// ─────────────────────────────────────────────────────────────────────────────
// Safe no-op stub. Pushes events to window.dataLayer if a tag manager is present,
// otherwise logs in development. No network calls, no dependencies. Wire this to
// GA4 / PostHog / Segment later without changing call sites.
// ─────────────────────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | 'report_view'
  | 'feedback_rating_selected'
  | 'feedback_submitted'
  // Growth-3 — product-led sharing / referral (manual share only)
  | 'resource_shared'
  | 'referral_created'
  | 'share_link_copied'
  // Growth-4 — customer proof / review (consent-first; no public posting)
  | 'feedback_prompt_viewed'
  | 'feedback_score_selected'
  | 'testimonial_interest_selected'
  | 'case_study_interest_selected'
  | 'product_feedback_submitted'
  // Growth-6 — acquisition / activation analytics (device-local; no PII, no pixels)
  | 'growth_event_tracked'
  | 'acquisition_source_detected'
  | 'activation_milestone_reached'
  // Growth-8 — email capture (NO email/name/raw content ever sent to analytics)
  | 'email_capture_viewed'
  | 'email_capture_started'
  | 'email_capture_submitted'
  | 'email_capture_success'
  | 'email_capture_failed'

export function trackEvent(event: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  const payload = { event, ...props, ts: new Date().toISOString() }
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(payload)
    } else if (process.env.NODE_ENV !== 'production') {
      // Placeholder sink until a real analytics provider is connected.
      console.debug('[analytics]', payload)
    }
  } catch {
    // Analytics must never break the app.
  }
}
