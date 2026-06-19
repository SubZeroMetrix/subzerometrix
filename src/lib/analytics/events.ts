import { classifySource, type TrafficSource } from './attribution'

export type AnalyticsEvent =
  | 'page_view'
  | 'product_viewed'
  | 'comparison_viewed'
  | 'guide_viewed'
  | 'tool_finder_started'
  | 'tool_finder_completed'
  | 'recommendation_viewed'
  | 'affiliate_link_clicked'
  | 'lead_form_started'
  | 'lead_form_submitted'
  | 'contact_submitted'
  | 'outbound_resource_clicked'

type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

let consentState: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function updateConsent(consent: Partial<ConsentState>) {
  consentState = { ...consentState, ...consent }
  if (typeof window !== 'undefined') {
    localStorage.setItem('szm_consent', JSON.stringify(consentState))
  }
}

export function getConsent(): ConsentState {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('szm_consent')
      if (stored) {
        consentState = { ...consentState, ...JSON.parse(stored) }
      }
    } catch { /* ignore parse errors */ }
  }
  return consentState
}

export function getTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') return 'unknown'
  const referrer = document.referrer || null
  const params = new URLSearchParams(window.location.search)
  const utmSource = params.get('utm_source')
  return classifySource(referrer, utmSource)
}

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
) {
  const consent = getConsent()
  if (!consent.analytics) return

  const source = getTrafficSource()
  const enriched = {
    ...properties,
    traffic_source: source,
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  }

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, enriched)
  }
}
