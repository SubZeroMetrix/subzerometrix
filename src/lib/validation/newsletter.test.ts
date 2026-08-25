import { describe, it, expect } from 'vitest'
import { validateNewsletterSignup } from './newsletter'

describe('validateNewsletterSignup', () => {
  it('accepts a valid pinellas-field-notes signup', () => {
    const result = validateNewsletterSignup({ email: 'Owner@Example.com', publication: 'pinellas-field-notes' })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.email).toBe('owner@example.com')
      expect(result.data.publication).toBe('pinellas-field-notes')
    }
  })

  it('accepts a valid growth-systems-brief signup', () => {
    const result = validateNewsletterSignup({ email: 'a@b.com', publication: 'growth-systems-brief' })
    expect(result.valid).toBe(true)
  })

  it('rejects a missing email', () => {
    const result = validateNewsletterSignup({ publication: 'pinellas-field-notes' })
    expect(result.valid).toBe(false)
  })

  it('rejects a malformed email', () => {
    const result = validateNewsletterSignup({ email: 'not-an-email', publication: 'pinellas-field-notes' })
    expect(result.valid).toBe(false)
  })

  it('rejects an unknown publication', () => {
    const result = validateNewsletterSignup({ email: 'a@b.com', publication: 'something-else' })
    expect(result.valid).toBe(false)
  })

  it('rejects a non-object payload', () => {
    const result = validateNewsletterSignup(null)
    expect(result.valid).toBe(false)
  })

  it('rejects an email over 254 characters', () => {
    const longEmail = `${'a'.repeat(250)}@b.com`
    const result = validateNewsletterSignup({ email: longEmail, publication: 'pinellas-field-notes' })
    expect(result.valid).toBe(false)
  })
})
