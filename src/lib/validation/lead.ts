export interface LeadFormData {
  email: string
  use_case: string
  consent: boolean
}

export function validateLeadForm(data: unknown): { valid: true; data: LeadFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid form data' }
  }

  const d = data as Record<string, unknown>

  if (typeof d.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 254) {
    return { valid: false, error: 'Valid email address required' }
  }

  if (typeof d.use_case !== 'string' || d.use_case.trim().length === 0) {
    return { valid: false, error: 'Use case is required' }
  }

  if (d.consent !== true) {
    return { valid: false, error: 'Consent is required to subscribe' }
  }

  return {
    valid: true,
    data: {
      email: d.email.trim().toLowerCase(),
      use_case: d.use_case.trim(),
      consent: true,
    },
  }
}
