export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function validateContactForm(data: unknown): { valid: true; data: ContactFormData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid form data' }
  }

  const d = data as Record<string, unknown>

  if (typeof d.name !== 'string' || d.name.trim().length < 2 || d.name.trim().length > 100) {
    return { valid: false, error: 'Name must be 2-100 characters' }
  }

  if (typeof d.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 254) {
    return { valid: false, error: 'Valid email address required' }
  }

  if (typeof d.subject !== 'string' || d.subject.trim().length < 2 || d.subject.trim().length > 200) {
    return { valid: false, error: 'Subject must be 2-200 characters' }
  }

  if (typeof d.message !== 'string' || d.message.trim().length < 10 || d.message.trim().length > 5000) {
    return { valid: false, error: 'Message must be 10-5000 characters' }
  }

  return {
    valid: true,
    data: {
      name: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      subject: d.subject.trim(),
      message: d.message.trim(),
    },
  }
}
