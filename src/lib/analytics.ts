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
