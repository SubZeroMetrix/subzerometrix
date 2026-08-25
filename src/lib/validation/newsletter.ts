export type Publication = 'pinellas-field-notes' | 'growth-systems-brief'

export interface NewsletterSignupData {
  email: string
  publication: Publication
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  return {
    valid: true,
    data: {
      email: d.email.trim().toLowerCase(),
      publication: d.publication,
    },
  }
}
