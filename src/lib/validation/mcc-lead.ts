export interface MccLeadFormData {
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string | null
  consent: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateMccLeadForm(
  data: unknown
): { valid: true; data: MccLeadFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid form data' }
  }

  const d = data as Record<string, unknown>

  if (typeof d.name !== 'string' || d.name.trim().length === 0 || d.name.length > 200) {
    return { valid: false, error: 'Name is required' }
  }

  if (typeof d.email !== 'string' || !EMAIL_RE.test(d.email) || d.email.length > 254) {
    return { valid: false, error: 'Valid email address required' }
  }

  if (d.phone !== undefined && d.phone !== null && d.phone !== '' && typeof d.phone !== 'string') {
    return { valid: false, error: 'Invalid phone' }
  }
  if (typeof d.phone === 'string' && d.phone.length > 40) {
    return { valid: false, error: 'Phone number too long' }
  }

  if (d.company !== undefined && d.company !== null && d.company !== '' && typeof d.company !== 'string') {
    return { valid: false, error: 'Invalid company' }
  }
  if (typeof d.company === 'string' && d.company.length > 200) {
    return { valid: false, error: 'Company name too long' }
  }

  if (d.message !== undefined && d.message !== null && typeof d.message !== 'string') {
    return { valid: false, error: 'Invalid message' }
  }
  if (typeof d.message === 'string' && d.message.length > 2000) {
    return { valid: false, error: 'Message too long' }
  }

  if (d.consent !== true) {
    return { valid: false, error: 'Consent is required to submit this form' }
  }

  return {
    valid: true,
    data: {
      name: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      phone: typeof d.phone === 'string' && d.phone.trim() ? d.phone.trim() : null,
      company: typeof d.company === 'string' && d.company.trim() ? d.company.trim() : null,
      message: typeof d.message === 'string' && d.message.trim() ? d.message.trim() : null,
      consent: true,
    },
  }
}
