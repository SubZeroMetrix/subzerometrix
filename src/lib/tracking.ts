// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Affiliate Tracking & SubID Engine
// Publisher/referral model only. No regulated financial activity.
// ─────────────────────────────────────────────────────────────────────────────

export type VerticalCode = 'saa' | 'ins' | 'bnk' | 'frm' | 'mkt'
export type SourcePage = 'report' | 'resources' | 'roadmap' | 'email' | 'homepage'
export type TradeCode = 'hvac' | 'elec' | 'plumb' | 'roof' | 'solar' | 'build' | 'hand' | 'land' | 'clean' | 'paint' | 'other'

// ── Vertical code map ─────────────────────────────────────────────────────────
export const VERTICAL_CODES: Record<string, VerticalCode> = {
  'field-software':  'saa',
  'bookkeeping':     'saa',
  'crm':             'saa',
  'estimating':      'saa',
  'payroll':         'saa',
  'marketing-tools': 'saa',
  'insurance':       'ins',
  'bonding':         'ins',
  'banking':         'bnk',
  'funding-credit':  'bnk',
  'formation':       'frm',
  'compliance':      'frm',
  'marketing':       'mkt',
  'directories':     'mkt',
}

// ── Trade code map ────────────────────────────────────────────────────────────
export const TRADE_CODES: Record<string, TradeCode> = {
  'hvac':         'hvac',
  'electrical':   'elec',
  'plumbing':     'plumb',
  'roofing':      'roof',
  'solar':        'solar',
  'construction': 'build',
  'handyman':     'hand',
  'landscaping':  'land',
  'cleaning':     'clean',
  'painting':     'paint',
  'other':        'other',
}

// ── SubID builder ─────────────────────────────────────────────────────────────
// Format: {vertical}_{vendor}_{score}_{state}_{trade}_{source}_{click_id_short}
// Example: ins_simplybiz_054_TX_hvac_report_a3f9b2c1
export function buildSubId({
  vendorId,
  vendorCategory,
  score,
  state,
  trade,
  sourcePage,
  clickId,
}: {
  vendorId: string
  vendorCategory: string
  score: number
  state: string
  trade: string
  sourcePage: SourcePage
  clickId: string
}): string {
  const vertical = VERTICAL_CODES[vendorCategory] ?? 'saa'
  const vendorSlug = vendorId.replace(/[^a-z0-9]/g, '').substring(0, 12)
  const tradeCode  = TRADE_CODES[trade] ?? 'other'
  const scorePad   = String(Math.min(100, Math.max(0, score))).padStart(3, '0')
  const stateCode  = (state ?? 'XX').substring(0, 2).toUpperCase()
  const clickShort = clickId.replace(/-/g, '').substring(0, 8)

  return `${vertical}_${vendorSlug}_${scorePad}_${stateCode}_${tradeCode}_${sourcePage}_${clickShort}`
}

// ── Tracked URL builder ───────────────────────────────────────────────────────
export function buildTrackedUrl({
  baseUrl,
  trackingParam,
  trackingValue,
  subId,
  utmCampaign,
}: {
  baseUrl: string
  trackingParam: string
  trackingValue: string
  subId: string
  utmCampaign: string
}): string {
  const url = new URL(baseUrl)

  // Only append affiliate tracking param if we have a real code
  if (trackingValue && trackingValue !== 'PENDING') {
    url.searchParams.set(trackingParam, trackingValue)
  }

  // SubID always goes (partner must pass this back in postback)
  url.searchParams.set('subid', subId)

  // UTM attribution
  url.searchParams.set('utm_source', 'subzerometrix')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', utmCampaign)

  return url.toString()
}

// ── Compliance disclosure rules ───────────────────────────────────────────────
export type DisclosureType =
  | 'affiliate-universal'
  | 'not-financial-advice'
  | 'insurance-routing'
  | 'banking-routing'
  | 'formation-not-legal'
  | 'state-insurance'
  | 'state-banking'

export const DISCLOSURE_TEXT: Record<DisclosureType, string> = {
  'affiliate-universal':
    'Affiliate link — SubZeroMetrix may earn a commission if you sign up or purchase through this link, at no additional cost to you.',

  'not-financial-advice':
    'SubZeroMetrix is an education and referral platform. We do not provide financial, insurance, lending, or legal advice. All financial products and services are provided by licensed third-party partners.',

  'insurance-routing':
    'SubZeroMetrix is not an insurance agent, broker, or carrier. We do not quote, sell, bind, or underwrite insurance. Clicking this link takes you to a licensed insurance provider\'s website where you can explore options directly.',

  'banking-routing':
    'SubZeroMetrix is not a bank, lender, or credit provider. We do not open accounts, extend credit, or make lending decisions. Clicking this link takes you to a licensed financial institution\'s website.',

  'formation-not-legal':
    'SubZeroMetrix is not a law firm and does not provide legal advice. Business formation services are provided by licensed third-party companies.',

  'state-insurance':
    'Insurance products shown are offered by licensed carriers. Requirements and availability vary by state.',

  'state-banking':
    'Banking and financial products shown are offered by licensed institutions. Availability and terms vary.',
}

// Which disclosures apply to which vendor category
export const DISCLOSURE_RULES: Record<string, DisclosureType[]> = {
  'field-software':  ['affiliate-universal'],
  'bookkeeping':     ['affiliate-universal'],
  'crm':             ['affiliate-universal'],
  'estimating':      ['affiliate-universal'],
  'payroll':         ['affiliate-universal'],
  'marketing-tools': ['affiliate-universal'],
  'marketing':       ['affiliate-universal'],
  'insurance':       ['affiliate-universal', 'not-financial-advice', 'insurance-routing'],
  'bonding':         ['affiliate-universal', 'not-financial-advice', 'insurance-routing'],
  'banking':         ['affiliate-universal', 'not-financial-advice', 'banking-routing'],
  'funding-credit':  ['affiliate-universal', 'not-financial-advice', 'banking-routing'],
  'formation':       ['affiliate-universal', 'formation-not-legal'],
  'compliance':      ['affiliate-universal', 'formation-not-legal'],
  'directories':     ['affiliate-universal'],
}

export function getDisclosuresForCategory(category: string): string[] {
  const types = DISCLOSURE_RULES[category] ?? ['affiliate-universal']
  return types.map(t => DISCLOSURE_TEXT[t]).filter(Boolean)
}

export function getPrimaryDisclosure(category: string): string {
  return getDisclosuresForCategory(category)[0] ?? DISCLOSURE_TEXT['affiliate-universal']
}

// ── Regulated data sanitizer (used in postback handler) ──────────────────────
const BLOCKED_FIELD_PATTERNS = [
  'ssn', 'social_security', 'social-security', 'dob', 'date_of_birth',
  'bank_account', 'account_number', 'routing_number', 'routing-number',
  'card_number', 'cardnumber', 'cvv', 'license_number', 'ein_full',
  'credit_score', 'income', 'health', 'diagnosis', 'medical',
  'driver_license', 'passport',
]

export function sanitizePostbackPayload(raw: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    const keyLower = key.toLowerCase()
    if (BLOCKED_FIELD_PATTERNS.some(blocked => keyLower.includes(blocked))) {
      sanitized[key] = '[REDACTED-REGULATED-DATA]'
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export function containsRegulatedData(raw: Record<string, string>): boolean {
  return Object.keys(raw).some(k =>
    BLOCKED_FIELD_PATTERNS.some(p => k.toLowerCase().includes(p))
  )
}

// ── State-gating logic ────────────────────────────────────────────────────────
// Insurance and banking vendors should only appear in states where
// the partner has confirmed licensing. Default posture: allow, but
// this should be overridden per-vendor as you onboard partners.
export const VENDOR_STATE_BLOCKS: Record<string, string[]> = {
  // Format: vendorId → blocked states
  // Example: 'simply-business': ['NY', 'WA'] // not licensed there
  // Populated as you confirm partner licensing state by state
}

export function isVendorAllowedInState(vendorId: string, state: string): boolean {
  const blocked = VENDOR_STATE_BLOCKS[vendorId] ?? []
  return !blocked.includes(state.toUpperCase())
}
