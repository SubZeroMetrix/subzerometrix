const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Strips HTML tags and control characters. All submitted free-text is
// stored as plain text and never rendered as HTML, but sanitizing at
// write time is a cheap second layer of defense against stored-XSS-style
// payloads reaching an admin view later.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g

export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .slice(0, maxLength)
}

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value) && value.length <= 254
}

export interface CustomerCareFormData {
  requestType: string
  message: string
  route: string | null
  name: string | null
  contactEmail: string | null
}

const CARE_REQUEST_TYPES = [
  'website_problem', 'incorrect_information', 'suggestion', 'next_step_help',
  'contact_support', 'privacy_request', 'accessibility_feedback',
  'security_concern', 'product_interest', 'mcc_account_support',
] as const

export function validateCustomerCareForm(
  data: unknown
): { valid: true; data: CustomerCareFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid form data' }
  const d = data as Record<string, unknown>

  if (typeof d.requestType !== 'string' || !CARE_REQUEST_TYPES.includes(d.requestType as (typeof CARE_REQUEST_TYPES)[number])) {
    return { valid: false, error: 'Please choose a request category' }
  }
  if (typeof d.message !== 'string' || d.message.trim().length === 0) {
    return { valid: false, error: 'Please describe your request' }
  }
  if (d.contactEmail !== undefined && d.contactEmail !== null && d.contactEmail !== '' && !isValidEmail(d.contactEmail)) {
    return { valid: false, error: 'Valid email address required' }
  }

  return {
    valid: true,
    data: {
      requestType: d.requestType,
      message: sanitizeText(d.message, 2000),
      route: typeof d.route === 'string' ? sanitizeText(d.route, 300) : null,
      name: typeof d.name === 'string' && d.name.trim() ? sanitizeText(d.name, 200) : null,
      contactEmail: typeof d.contactEmail === 'string' && d.contactEmail.trim() ? d.contactEmail.trim().toLowerCase() : null,
    },
  }
}

export interface QualificationFormData {
  tradeType: string | null
  role: string | null
  companySizeRange: string | null
  currentMethod: string | null
  primaryPain: string | null
  opportunityVolumeRange: string | null
  currentSoftware: string | null
  desiredNextStep: string | null
  name: string
  email: string
  phone: string | null
  howHeard: string | null
  consentGiven: boolean
}

export function validateQualificationForm(
  data: unknown
): { valid: true; data: QualificationFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid form data' }
  const d = data as Record<string, unknown>

  if (typeof d.name !== 'string' || d.name.trim().length === 0 || d.name.length > 200) {
    return { valid: false, error: 'Name is required' }
  }
  if (!isValidEmail(d.email)) {
    return { valid: false, error: 'Valid email address required' }
  }
  if (d.consentGiven !== true) {
    return { valid: false, error: 'Consent is required to submit this form' }
  }

  const optionalText = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? sanitizeText(v, max) : null)

  return {
    valid: true,
    data: {
      tradeType: optionalText(d.tradeType, 100),
      role: optionalText(d.role, 100),
      companySizeRange: optionalText(d.companySizeRange, 50),
      currentMethod: optionalText(d.currentMethod, 200),
      primaryPain: optionalText(d.primaryPain, 200),
      opportunityVolumeRange: optionalText(d.opportunityVolumeRange, 50),
      currentSoftware: optionalText(d.currentSoftware, 200),
      desiredNextStep: optionalText(d.desiredNextStep, 200),
      name: sanitizeText(d.name, 200),
      email: d.email.trim().toLowerCase(),
      phone: typeof d.phone === 'string' && d.phone.trim() ? sanitizeText(d.phone, 40) : null,
      howHeard: optionalText(d.howHeard, 200),
      consentGiven: true,
    },
  }
}

export interface ReferralInterestFormData {
  interestType: 'referral' | 'partner'
  name: string
  email: string
  businessName: string | null
  message: string | null
  consentGiven: boolean
}

export function validateReferralInterestForm(
  data: unknown
): { valid: true; data: ReferralInterestFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid form data' }
  const d = data as Record<string, unknown>

  if (d.interestType !== 'referral' && d.interestType !== 'partner') {
    return { valid: false, error: 'Please choose referral or partner interest' }
  }
  if (typeof d.name !== 'string' || d.name.trim().length === 0 || d.name.length > 200) {
    return { valid: false, error: 'Name is required' }
  }
  if (!isValidEmail(d.email)) {
    return { valid: false, error: 'Valid email address required' }
  }
  if (d.consentGiven !== true) {
    return { valid: false, error: 'Consent is required to submit this form' }
  }

  return {
    valid: true,
    data: {
      interestType: d.interestType,
      name: sanitizeText(d.name, 200),
      email: d.email.trim().toLowerCase(),
      businessName: typeof d.businessName === 'string' && d.businessName.trim() ? sanitizeText(d.businessName, 200) : null,
      message: typeof d.message === 'string' && d.message.trim() ? sanitizeText(d.message, 1000) : null,
      consentGiven: true,
    },
  }
}

export interface HelpFeedbackFormData {
  category: string
  route: string
  helpArticleId: string | null
  rating: 'helpful' | 'unhelpful' | null
  comment: string | null
  contactEmail: string | null
}

const FEEDBACK_CATEGORIES = [
  'helpful_answer', 'unhelpful_answer', 'missing_information', 'incorrect_information',
  'website_bug', 'accessibility_issue', 'product_question', 'pricing_question',
  'trust_security_concern', 'feature_interest', 'content_request', 'other',
] as const

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function validateHelpFeedbackForm(
  data: unknown
): { valid: true; data: HelpFeedbackFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid form data' }
  const d = data as Record<string, unknown>

  if (typeof d.category !== 'string' || !FEEDBACK_CATEGORIES.includes(d.category as (typeof FEEDBACK_CATEGORIES)[number])) {
    return { valid: false, error: 'Invalid feedback category' }
  }
  if (typeof d.route !== 'string' || d.route.trim().length === 0) {
    return { valid: false, error: 'Missing page context' }
  }
  if (d.rating !== undefined && d.rating !== null && d.rating !== 'helpful' && d.rating !== 'unhelpful') {
    return { valid: false, error: 'Invalid rating' }
  }
  if (d.helpArticleId !== undefined && d.helpArticleId !== null && (typeof d.helpArticleId !== 'string' || !UUID_RE.test(d.helpArticleId))) {
    return { valid: false, error: 'Invalid article reference' }
  }
  if (d.contactEmail !== undefined && d.contactEmail !== null && d.contactEmail !== '' && !isValidEmail(d.contactEmail)) {
    return { valid: false, error: 'Valid email address required' }
  }

  return {
    valid: true,
    data: {
      category: d.category,
      route: sanitizeText(d.route, 300),
      helpArticleId: typeof d.helpArticleId === 'string' ? d.helpArticleId : null,
      rating: (d.rating as 'helpful' | 'unhelpful' | undefined) || null,
      comment: typeof d.comment === 'string' && d.comment.trim() ? sanitizeText(d.comment, 2000) : null,
      contactEmail: typeof d.contactEmail === 'string' && d.contactEmail.trim() ? d.contactEmail.trim().toLowerCase() : null,
    },
  }
}
