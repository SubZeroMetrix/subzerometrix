export type AnalyticsEvent =
  | 'page_view'
  | 'category_viewed'
  | 'product_viewed'
  | 'comparison_viewed'
  | 'tool_finder_started'
  | 'tool_finder_completed'
  | 'recommendation_viewed'
  | 'affiliate_link_clicked'
  | 'lead_form_started'
  | 'lead_form_submitted'
  | 'outbound_link_clicked'
  | 'contact_form_submitted'

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

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  const consent = getConsent()
  if (!consent.analytics) return

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, properties)
  }
}
