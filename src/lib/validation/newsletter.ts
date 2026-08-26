export type Publication = 'pinellas-field-notes' | 'growth-systems-brief'

export interface NewsletterSignupData {
  email: string
  publication: Publication
  firstName?: string
  lastName?: string
  trade?: string
  geography?: string
  interests?: string[]
  emailConsent: boolean
  smsConsent: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LEN = 200
const VALID_GEOGRAPHIES = ['st-petersburg', 'clearwater', 'largo', 'palm-harbor', 'other-pinellas', 'tampa-hillsborough']

function clamp(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const c = v.replace(/[<>]/g, '').trim().slice(0, MAX_LEN)
  return c || undefined
}

export function validateNewsletterSignup(data: unknown): { valid: true; data: NewsletterSignupData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid form data' }
  }

  const d = data as Record<string, unknown>

  if (typeof d.email !== 'string' || !EMAIL_RE.test(d.email) || d.email.length > 254) {
    return { valid: false, error: 'Valid email address required' }
  }

  if (d.publication !== 'pinellas-field-notes' && d.publication !== 'growth-systems-brief') {
    return { valid: false, error: 'Invalid publication' }
  }

  const geography = clamp(d.geography)
  if (geography && !VALID_GEOGRAPHIES.includes(geography)) {
    return { valid: false, error: 'Invalid geography' }
  }

  const interests = Array.isArray(d.interests)
    ? d.interests.filter((i): i is string => typeof i === 'string').map((i) => i.slice(0, 60)).slice(0, 20)
    : undefined

  return {
    valid: true,
    data: {
      email: d.email.trim().toLowerCase(),
      publication: d.publication,
      firstName: clamp(d.firstName),
      lastName: clamp(d.lastName),
      trade: clamp(d.trade),
      geography,
      interests,
      // SMS consent is never inferred; server-side default is always false
      // regardless of client payload, per standing instruction.
      emailConsent: d.emailConsent === true,
      smsConsent: false,
    },
  }
}
