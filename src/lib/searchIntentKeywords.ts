// ─────────────────────────────────────────────────────────────────────────────
// searchIntentKeywords — search-intent source of truth (Growth-1 / Growth-1B)
// ─────────────────────────────────────────────────────────────────────────────
// Data/model only. The single place future discovery pages and analytics read
// keyword/intent from. Honest scope: contractor / trade / service-business intent
// is supportedNow=true; broad non-trade intent is supportedNow=false (discovery +
// routing only). No keyword stuffing, no thin/doorway pages, no ranking/lead
// promises — those are guardrails, never tactics.
// ─────────────────────────────────────────────────────────────────────────────

export type SearchIntentType =
  | 'general_business_startup'
  | 'state_business_startup'
  | 'trade_business_startup'
  | 'service_business_startup'
  | 'readiness_assessment'
  | 'pricing_readiness'
  | 'lead_generation'
  | 'first_hire'
  | 'vendor_setup'
  | 'future_vertical_discovery'

export interface SearchIntentKeyword {
  intentType: SearchIntentType
  primaryKeyword: string
  secondaryKeywords: string[]
  audience: string
  supportedNow: boolean   // false/partial → honest routing copy required
  routePlan: string       // future public route (not built yet)
  cta: string
  guardrails: string[]
}

const BASE_GUARDRAILS = [
  'no guaranteed ranking claims',
  'no guaranteed lead claims',
  'no guaranteed business success claims',
  'no legal, tax, or financial advice claims',
  'no thin, duplicate, or doorway pages',
  'no keyword stuffing',
]

const SCOPE_NOTE_GUARDRAIL =
  'honest scope note: strongest for contractors, trades, and service businesses; some recommendations may be less industry-specific'

const ASSESSMENT_CTA = 'Take the free SubZeroMetrix™ business-readiness assessment.'

export const SEARCH_INTENT_KEYWORDS: SearchIntentKeyword[] = [
  // ── General business startup (broad — partial support, honest routing) ──────
  {
    intentType: 'general_business_startup',
    primaryKeyword: 'how to start a business',
    secondaryKeywords: ['how to start a small business', 'steps to start a business', 'what do I need to start a business'],
    audience: 'First-time founders researching business startup generally',
    supportedNow: false,
    routePlan: '/how-to-start-a-business',
    cta: ASSESSMENT_CTA,
    guardrails: [...BASE_GUARDRAILS, SCOPE_NOTE_GUARDRAIL],
  },
  {
    intentType: 'general_business_startup',
    primaryKeyword: 'business startup checklist',
    secondaryKeywords: ['small business startup checklist', 'new business checklist', 'business launch checklist', 'business setup checklist'],
    audience: 'Founders looking for a step-by-step startup checklist',
    supportedNow: false,
    routePlan: '/business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: [...BASE_GUARDRAILS, SCOPE_NOTE_GUARDRAIL],
  },

  // ── Readiness / self-assessment (core — supported) ──────────────────────────
  {
    intentType: 'readiness_assessment',
    primaryKeyword: 'business readiness assessment',
    secondaryKeywords: ['business readiness score', 'am I ready to start a business', 'startup readiness checklist', 'business launch readiness'],
    audience: 'Owners wanting to gauge how ready they are to start or grow',
    supportedNow: true,
    routePlan: '/business-readiness-assessment',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },
  {
    intentType: 'readiness_assessment',
    primaryKeyword: 'contractor business readiness assessment',
    secondaryKeywords: ['contractor business readiness assessment Arizona', 'trade business readiness score'],
    audience: 'Contractors gauging business readiness',
    supportedNow: true,
    routePlan: '/business-readiness-assessment',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── Trade business startup (core — supported) ───────────────────────────────
  {
    intentType: 'trade_business_startup',
    primaryKeyword: 'how to start a contractor business',
    secondaryKeywords: ['contractor startup checklist', 'how to start a trade business'],
    audience: 'Tradespeople starting a contracting business',
    supportedNow: true,
    routePlan: '/contractor-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },
  {
    intentType: 'trade_business_startup',
    primaryKeyword: 'trade business launch roadmap',
    secondaryKeywords: ['contractor business launch roadmap', 'contractor business launch roadmap North Carolina'],
    audience: 'Trade owners wanting a launch roadmap',
    supportedNow: true,
    routePlan: '/trade-business-launch-roadmap',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── State + trade business startup (core — supported) ───────────────────────
  {
    intentType: 'state_business_startup',
    primaryKeyword: 'how to start an HVAC business in Florida',
    secondaryKeywords: ['how to start a plumbing business in Texas', 'electrical contractor startup checklist Colorado'],
    audience: 'Tradespeople starting a business in a specific state',
    supportedNow: true,
    routePlan: '/state/florida/how-to-start-a-business',
    cta: ASSESSMENT_CTA,
    guardrails: [...BASE_GUARDRAILS, 'state pages must direct users to official resources for licensing/registration/insurance/tax/permitting'],
  },

  // ── Service business startup (supported) ────────────────────────────────────
  {
    intentType: 'service_business_startup',
    primaryKeyword: 'how to start a service business',
    secondaryKeywords: ['home service business startup checklist', 'local service business startup checklist', 'field service business startup', 'solo operator business checklist'],
    audience: 'Service-business owners starting out',
    supportedNow: true,
    routePlan: '/service-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── Pricing readiness (supported) ───────────────────────────────────────────
  {
    intentType: 'pricing_readiness',
    primaryKeyword: 'pricing readiness checklist for contractors Ohio',
    secondaryKeywords: ['contractor pricing checklist', 'job costing checklist for contractors'],
    audience: 'Contractors wanting to price jobs with real margins',
    supportedNow: true,
    routePlan: '/contractor-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── Lead generation (supported) ─────────────────────────────────────────────
  {
    intentType: 'lead_generation',
    primaryKeyword: 'contractor lead follow-up checklist',
    secondaryKeywords: ['how contractors get more leads', 'contractor sales follow-up'],
    audience: 'Contractors trying to capture and convert more leads',
    supportedNow: true,
    routePlan: '/contractor-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── First hire (supported) ──────────────────────────────────────────────────
  {
    intentType: 'first_hire',
    primaryKeyword: 'hiring your first employee as a contractor',
    secondaryKeywords: ['contractor first hire checklist', 'when to hire a contractor employee'],
    audience: 'Owners preparing to make a first hire',
    supportedNow: true,
    routePlan: '/contractor-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: BASE_GUARDRAILS,
  },

  // ── Vendor setup (supported) ────────────────────────────────────────────────
  {
    intentType: 'vendor_setup',
    primaryKeyword: 'contractor software and vendor setup checklist',
    secondaryKeywords: ['contractor tools to run a business', 'contractor vendor tracker'],
    audience: 'Contractors choosing and organizing tools/vendors',
    supportedNow: true,
    routePlan: '/contractor-business-startup-checklist',
    cta: ASSESSMENT_CTA,
    guardrails: [...BASE_GUARDRAILS, 'no partner/preferred/approved vendor claims unless verified'],
  },

  // ── Future vertical discovery (broad — tracked only, not supported) ─────────
  {
    intentType: 'future_vertical_discovery',
    primaryKeyword: 'how to start a [industry] business',
    secondaryKeywords: ['how to start a cleaning business', 'how to start a landscaping business', 'how to start a restoration business'],
    audience: 'Researchers in adjacent verticals that may signal future expansion',
    supportedNow: false,
    routePlan: 'track only — surface demand in expansion analytics',
    cta: 'Offer the general readiness framework with an honest scope note.',
    guardrails: [...BASE_GUARDRAILS, SCOPE_NOTE_GUARDRAIL, 'no claim of full support for every business type', 'no fake industry expertise'],
  },
]

export function getKeywordsByIntent(intentType: SearchIntentType): SearchIntentKeyword[] {
  return SEARCH_INTENT_KEYWORDS.filter(k => k.intentType === intentType)
}

export function getSupportedKeywords(): SearchIntentKeyword[] {
  return SEARCH_INTENT_KEYWORDS.filter(k => k.supportedNow)
}

/** Broad / non-trade intent: routed honestly, tracked for future verticals. */
export function getDiscoverySignals(): SearchIntentKeyword[] {
  return SEARCH_INTENT_KEYWORDS.filter(k => !k.supportedNow)
}
