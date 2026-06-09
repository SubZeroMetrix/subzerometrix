// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Affiliate Partner Registry
//
// COMPLIANCE MODEL: SubZeroMetrix is a publisher and education platform.
// We route users to licensed third-party vendors. We do not quote, approve,
// underwrite, bind, or process any regulated financial products ourselves.
//
// HOW TO ADD YOUR TRACKING CODES:
// Replace 'PENDING' in trackingValue with your affiliate code.
// The affiliateUrl() function builds the full tracked URL automatically.
//
// TO ONBOARD A NEW VENDOR:
// 1. Add vendor object to AFFILIATE_PARTNERS
// 2. Get affiliate code and replace PENDING
// 3. Add postback secret to .env as POSTBACK_SECRET_{VENDOR_SLUG_UPPERCASE}
// 4. Add partner IPs to postback/[vendor]/route.ts PARTNER_IPS map
// 5. Confirm vendor state licensing and update VENDOR_STATE_BLOCKS in tracking.ts
// 6. Write vendor disclosure text and add to the compliance checklist
// ─────────────────────────────────────────────────────────────────────────────

export type AffiliateCategory =
  | 'field-software'
  | 'bookkeeping'
  | 'banking'
  | 'insurance'
  | 'formation'
  | 'marketing'
  | 'funding-credit'
  | 'payroll'
  | 'estimating'
  | 'review-management'
  | 'email-sms'
  | 'estimating-software'

// Maps to VerticalCode in tracking.ts:
// field-software/bookkeeping/payroll/estimating → 'saa'
// insurance/bonding → 'ins'
// banking/funding-credit → 'bnk'
// formation → 'frm'
// marketing → 'mkt'

export type GapCategory =
  | 'setup'
  | 'financial'
  | 'software'
  | 'insurance'
  | 'marketing'
  | 'funding'
  | 'customers'
  | 'payroll'
  | 'estimating'

export interface AffiliatePartner {
  id:              string            // unique slug used in SubID + postback URL
  name:            string
  baseUrl:         string
  trackingParam:   string            // URL param name partner uses
  trackingValue:   string            // your code — replace PENDING when you have it
  category:        AffiliateCategory
  vertical:        'saas' | 'insurance' | 'banking' | 'formation' | 'marketing'
  desc:            string            // neutral, factual description (not advice)
  freeOption:      boolean
  tradeRelevance:  string[]
  gapMatch:        GapCategory[]
  isLicensedEntity: boolean          // partner is licensed for regulated activity
  regulatedActivity: string | null   // 'insurance' | 'banking' | 'lending' | null
  requiresDisclosure: boolean        // always true for financial/insurance verticals
}

// ── Build a tracked affiliate URL ─────────────────────────────────────────────
export function affiliateUrl(partner: AffiliatePartner): string {
  if (!partner.trackingValue || partner.trackingValue === 'PENDING') {
    return partner.baseUrl
  }
  try {
    const url = new URL(partner.baseUrl)
    url.searchParams.set(partner.trackingParam, partner.trackingValue)
    return url.toString()
  } catch {
    return partner.baseUrl
  }
}

// ── Partner registry ──────────────────────────────────────────────────────────
export const AFFILIATE_PARTNERS: AffiliatePartner[] = [

  // ── Field Service Software (SaaS) ──────────────────────────────────────────
  {
    id:               'jobber',
    name:             'Jobber',
    baseUrl:          'https://getjobber.com',
    trackingParam:    'affiliate',
    trackingValue:    'PENDING',
    category:         'field-software',
    vertical:         'saas',
    desc:             'Scheduling, quoting, invoicing, and client management for field service businesses.',
    freeOption:       false,
    tradeRelevance:   ['hvac','plumbing','electrical','handyman','cleaning','landscaping','roofing','painting'],
    gapMatch:         ['software','customers'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },
  {
    id:               'housecall-pro',
    name:             'Housecall Pro',
    baseUrl:          'https://www.housecallpro.com',
    trackingParam:    'affiliate',
    trackingValue:    'PENDING',
    category:         'field-software',
    vertical:         'saas',
    desc:             'All-in-one home service software with strong mobile app and automated customer follow-up.',
    freeOption:       false,
    tradeRelevance:   ['hvac','plumbing','electrical','handyman','cleaning'],
    gapMatch:         ['software','customers'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Bookkeeping & Finance (SaaS) ────────────────────────────────────────────
  {
    id:               'quickbooks',
    name:             'QuickBooks',
    baseUrl:          'https://quickbooks.intuit.com/small-business',
    trackingParam:    'cid',
    trackingValue:    'PENDING',
    category:         'bookkeeping',
    vertical:         'saas',
    desc:             'Track income, expenses, and invoices. Most widely used bookkeeping tool for small businesses.',
    freeOption:       false,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['financial','setup'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },
  {
    id:               'freshbooks',
    name:             'FreshBooks',
    baseUrl:          'https://www.freshbooks.com',
    trackingParam:    'ref',
    trackingValue:    'PENDING',
    category:         'bookkeeping',
    vertical:         'saas',
    desc:             'Simple invoicing and expense tracking built for non-accountants.',
    freeOption:       false,
    tradeRelevance:   ['handyman','cleaning','painting','landscaping'],
    gapMatch:         ['financial'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },
  {
    id:               'wave',
    name:             'Wave Accounting',
    baseUrl:          'https://www.waveapps.com',
    trackingParam:    'utm_source',
    trackingValue:    'subzerometrix',
    category:         'bookkeeping',
    vertical:         'saas',
    desc:             'Free invoicing, expense tracking, and basic accounting for early-stage businesses.',
    freeOption:       true,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['financial','setup'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Business Banking ────────────────────────────────────────────────────────
  {
    id:               'relay',
    name:             'Relay Business Banking',
    baseUrl:          'https://relayfi.com',
    trackingParam:    'referral',
    trackingValue:    'PENDING',
    category:         'banking',
    vertical:         'banking',
    desc:             'Business checking with no monthly fees. Built for small businesses and sole proprietors.',
    freeOption:       true,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['setup','financial'],
    isLicensedEntity: true,
    regulatedActivity: 'banking',
    requiresDisclosure: true,
  },

  // ── Business Insurance ──────────────────────────────────────────────────────
  {
    id:               'simply-business',
    name:             'Simply Business',
    baseUrl:          'https://www.simplybusiness.com',
    trackingParam:    'affiliate_id',
    trackingValue:    'PENDING',
    category:         'insurance',
    vertical:         'insurance',
    desc:             'Compare business insurance options from multiple carriers. Specializes in small contractors.',
    freeOption:       false,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['insurance','setup'],
    isLicensedEntity: true,
    regulatedActivity: 'insurance',
    requiresDisclosure: true,
  },
  {
    id:               'next-insurance',
    name:             'NEXT Insurance',
    baseUrl:          'https://www.nextinsurance.com',
    trackingParam:    'partner',
    trackingValue:    'PENDING',
    category:         'insurance',
    vertical:         'insurance',
    desc:             'Digital-first small business insurance with fast online application and instant certificate.',
    freeOption:       false,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['insurance','setup'],
    isLicensedEntity: true,
    regulatedActivity: 'insurance',
    requiresDisclosure: true,
  },

  // ── Business Formation ──────────────────────────────────────────────────────
  {
    id:               'zenbusiness',
    name:             'ZenBusiness',
    baseUrl:          'https://www.zenbusiness.com',
    trackingParam:    'utm_campaign',
    trackingValue:    'PENDING',
    category:         'formation',
    vertical:         'formation',
    desc:             'LLC formation starting at $0 plus state fees, with a dashboard to track compliance deadlines.',
    freeOption:       true,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['setup'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Marketing & Lead Generation ─────────────────────────────────────────────
  {
    id:               'angi',
    name:             'Angi Pro',
    baseUrl:          'https://www.angi.com/pro',
    trackingParam:    'ref',
    trackingValue:    'PENDING',
    category:         'marketing',
    vertical:         'marketing',
    desc:             'Get found by homeowners actively searching for your trade. Strong lead volume in most states.',
    freeOption:       false,
    tradeRelevance:   ['hvac','plumbing','electrical','handyman','cleaning','landscaping','roofing','painting'],
    gapMatch:         ['customers','marketing'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Review Management ───────────────────────────────────────────────────────
  {
    id:               'podium',
    name:             'Podium',
    baseUrl:          'https://www.podium.com',
    trackingParam:    'utm_campaign',
    trackingValue:    'PENDING',
    category:         'review-management',
    vertical:         'saas',
    desc:             'SMS-based review requests, Google review automation, and centralized customer messaging inbox.',
    freeOption:       false,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['customers','marketing'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Email / SMS Marketing ────────────────────────────────────────────────────
  {
    id:               'mailchimp',
    name:             'Mailchimp',
    baseUrl:          'https://mailchimp.com',
    trackingParam:    'utm_source',
    trackingValue:    'subzerometrix',
    category:         'email-sms',
    vertical:         'saas',
    desc:             'Email marketing, automated follow-up sequences, and customer list management. Free up to 500 contacts.',
    freeOption:       true,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['customers','marketing'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Construction Estimating ──────────────────────────────────────────────────
  {
    id:               'buildertrend',
    name:             'BuilderTrend',
    baseUrl:          'https://buildertrend.com',
    trackingParam:    'utm_campaign',
    trackingValue:    'PENDING',
    category:         'estimating-software',
    vertical:         'saas',
    desc:             'Construction estimating, project management, bid tracking, and client communication for contractors and builders.',
    freeOption:       false,
    tradeRelevance:   ['construction','roofing','solar','handyman'],
    gapMatch:         ['software','financial'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Lead Generation ──────────────────────────────────────────────────────────
  {
    id:               'thumbtack',
    name:             'Thumbtack Pro',
    baseUrl:          'https://www.thumbtack.com/pro',
    trackingParam:    'utm_campaign',
    trackingValue:    'PENDING',
    category:         'marketing',
    vertical:         'marketing',
    desc:             'Connect with homeowners actively searching for your trade. Pay only for leads you choose to pursue.',
    freeOption:       false,
    tradeRelevance:   ['hvac','plumbing','electrical','handyman','cleaning','landscaping','roofing','painting'],
    gapMatch:         ['customers','marketing'],
    isLicensedEntity: false,
    regulatedActivity: null,
    requiresDisclosure: false,
  },

  // ── Credit & Funding ────────────────────────────────────────────────────────
  {
    id:               'nav',
    name:             'Nav Business Credit',
    baseUrl:          'https://www.nav.com',
    trackingParam:    'partner',
    trackingValue:    'PENDING',
    category:         'funding-credit',
    vertical:         'banking',
    desc:             'Monitor and build your business credit profile. Free tier available.',
    freeOption:       true,
    tradeRelevance:   ['hvac','electrical','plumbing','roofing','solar','construction','handyman','landscaping','cleaning','painting','other'],
    gapMatch:         ['funding','financial'],
    isLicensedEntity: true,
    regulatedActivity: 'banking',
    requiresDisclosure: true,
  },
]

// ── Helper: get partners matching a user's gaps ───────────────────────────────
export function getPartnersForGaps(gaps: GapCategory[], limit = 4): AffiliatePartner[] {
  return AFFILIATE_PARTNERS
    .map(p => ({ partner: p, score: p.gapMatch.filter(g => gaps.includes(g)).length }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.partner)
}

// ── Helper: get partners for a trade + gaps ───────────────────────────────────
export function getPartnersForTrade(tradeId: string, gaps: GapCategory[], limit = 5): AffiliatePartner[] {
  return AFFILIATE_PARTNERS
    .filter(p => p.tradeRelevance.includes(tradeId) || p.tradeRelevance.includes('other'))
    .map(p => ({
      partner: p,
      score:   p.gapMatch.filter(g => gaps.includes(g)).length +
               (p.tradeRelevance.includes(tradeId) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.partner)
}

// ── Helper: get partners by vertical ─────────────────────────────────────────
export function getPartnersByVertical(vertical: AffiliatePartner['vertical']): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter(p => p.vertical === vertical)
}
