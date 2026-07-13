'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

export function MccLeadCaptureForm({ source = 'landing_page' }: { source?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRenderedAt = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setErrorMsg('Please acknowledge the Privacy Policy and Terms to continue.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/mcc-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: message || null,
          consent,
          source,
          website: honeypot,
          formRenderedAt: formRenderedAt.current,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="card-panel text-center py-10" role="status" aria-live="polite">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">&#10003;</div>
        <p className="text-xl font-bold text-gray-900 mb-2">Thanks — we&apos;ll be in touch.</p>
        <p className="text-gray-500">We received your message and will follow up at the email you provided.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-4">
      {/* Honeypot -- hidden from real users, off tab order and
          screen-reader focus. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mcc-lead-name" className="sr-only">Name</label>
          <input
            id="mcc-lead-name"
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="mcc-lead-email" className="sr-only">Email address</label>
          <input
            id="mcc-lead-email"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mcc-lead-phone" className="sr-only">Phone (optional)</label>
          <input
            id="mcc-lead-phone"
            type="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="mcc-lead-company" className="sr-only">Company (optional)</label>
          <input
            id="mcc-lead-company"
            type="text"
            maxLength={200}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company (optional)"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mcc-lead-message" className="sr-only">What are you hoping to solve?</label>
        <textarea
          id="mcc-lead-message"
          maxLength={2000}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you hoping to solve? (optional)"
          className="w-full px-5 py-3 rounded-2xl bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors resize-vertical"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-brand-electric focus:ring-brand-electric"
        />
        <span>
          I agree to be contacted about Metrix Command Center. See our{' '}
          <Link href="/privacy" className="text-brand-electric underline">privacy policy</Link>.
        </span>
      </label>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-50">
        {status === 'submitting' ? 'Sending...' : 'Tell us about your business'}
      </button>
    </form>
  )
}
