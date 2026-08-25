import { classifySource } from './analytics/attribution'

/**
 * Attribution payload contract per TERMINAL_2_WEBSITES_COMMAND.md.
 * This is the field shape Terminal 1 (HighLevel/GHL) will eventually receive.
 * Field keys are the documented names, not yet confirmed against a live
 * HighLevel custom-field schema -- see sendAttributionPayload() below.
 */
export interface AttributionPayload {
  original_domain: string | null
  original_landing_page: string | null
  funnel_strategy: 'revenue-leak-check' | 'trade-guide' | 'pinellas-local' | 'modern-trades-crm' | 'direct-contact' | 'unknown'
  source_microsite: 'subzerometrix' | null
  source_tool: string | null
  first_problem_signal: string | null
  first_content_topic: string | null
  local_or_national_intent: 'local' | 'national' | 'unknown'
  crm_interest: boolean
  consulting_interest: boolean
  trade: string | null
  city: string | null
  state: string | null
  current_crm: string | null
  current_field_service_system: string | null
  lifecycle_stage: 'lead'
  first_touch_source: string
  last_touch_source: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  email_consent: boolean
  sms_consent: boolean
  consent_source: string
  consent_timestamp: string
  subscription_preference: string | null
}

const FIRST_TOUCH_KEY = 'szm_first_touch_source'
const FIRST_LANDING_KEY = 'szm_first_landing_page'

function readUtm(params: URLSearchParams) {
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }
}

/** Persists first-touch attribution to localStorage on first visit; call once from a root layout/effect. */
export function captureFirstTouch() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(FIRST_TOUCH_KEY)) return
  const source = classifySource(document.referrer || null, new URLSearchParams(window.location.search).get('utm_source'))
  try {
    localStorage.setItem(FIRST_TOUCH_KEY, source)
    localStorage.setItem(FIRST_LANDING_KEY, window.location.pathname)
  } catch { /* storage unavailable, non-fatal */ }
}

function inferFunnelStrategy(path: string): AttributionPayload['funnel_strategy'] {
  if (path.startsWith('/revenue-leak-check')) return 'revenue-leak-check'
  if (path.startsWith('/pinellas-contractor-revenue-recovery')) return 'pinellas-local'
  if (path.startsWith('/resources')) return 'trade-guide'
  if (path.startsWith('/modern-trades-crm')) return 'modern-trades-crm'
  if (path.startsWith('/contact')) return 'direct-contact'
  return 'unknown'
}

/**
 * Builds the attribution payload from real, currently-collectable signals only.
 * Fields the site does not yet capture (trade, city, state, current_crm,
 * current_field_service_system, first_problem_signal, subscription_preference)
 * are left null rather than guessed -- populate them only when a form actually
 * asks for that data.
 */
export function buildAttributionPayload(input: {
  subject: string
  crmInterest?: boolean
  consultingInterest?: boolean
}): AttributionPayload {
  const isBrowser = typeof window !== 'undefined'
  const path = isBrowser ? window.location.pathname : null
  const params = isBrowser ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const utm = readUtm(params)
  const lastTouchSource = isBrowser
    ? classifySource(document.referrer || null, utm.utm_source)
    : 'unknown'
  const firstTouchSource = isBrowser ? localStorage.getItem(FIRST_TOUCH_KEY) : null
  const firstLandingPage = isBrowser ? localStorage.getItem(FIRST_LANDING_KEY) : null

  const funnelStrategy = inferFunnelStrategy(path ?? '')
  const localOrNational: AttributionPayload['local_or_national_intent'] =
    funnelStrategy === 'pinellas-local' ? 'local'
    : funnelStrategy === 'modern-trades-crm' ? 'national'
    : 'unknown'

  return {
    original_domain: isBrowser ? window.location.hostname : null,
    original_landing_page: firstLandingPage ?? path,
    funnel_strategy: funnelStrategy,
    source_microsite: 'subzerometrix',
    source_tool: funnelStrategy === 'revenue-leak-check' ? 'revenue-leak-check' : null,
    first_problem_signal: null,
    first_content_topic: path,
    local_or_national_intent: localOrNational,
    crm_interest: input.crmInterest ?? /crm/i.test(input.subject),
    consulting_interest: input.consultingInterest ?? /tmt|consult|coach|mentor|leak check/i.test(input.subject),
    trade: null,
    city: null,
    state: null,
    current_crm: null,
    current_field_service_system: null,
    lifecycle_stage: 'lead',
    first_touch_source: firstTouchSource ?? lastTouchSource,
    last_touch_source: lastTouchSource,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    email_consent: true,
    sms_consent: false,
    consent_source: 'contact-form-submission',
    consent_timestamp: new Date().toISOString(),
    subscription_preference: null,
  }
}

/**
 * BLOCKED on Terminal 1: HighLevel has not yet supplied a live endpoint or
 * confirmed field keys for this payload (per TERMINAL_2_WEBSITES_COMMAND.md,
 * "forms should be built in disabled/non-live integration mode until then").
 * This function intentionally does not send anything -- it only logs in
 * development so the shape can be inspected before a real endpoint exists.
 * Do not wire this to a live fetch() without a confirmed Terminal 1 endpoint.
 */
export function sendAttributionPayload(payload: AttributionPayload): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[attribution] payload ready, no live endpoint configured', payload)
  }
}
