'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { trackLandingEvent } from '@/lib/landing-events'

const REQUEST_TYPES = [
  { value: 'website_problem', label: 'Report a website problem' },
  { value: 'incorrect_information', label: 'Report incorrect information' },
  { value: 'suggestion', label: 'Suggest an improvement' },
  { value: 'next_step_help', label: 'Help me choose a next step' },
  { value: 'product_interest', label: 'Ask a product question' },
  { value: 'pricing_question', label: 'Ask a pricing question' },
  { value: 'security_concern', label: 'Report a security concern' },
  { value: 'accessibility_feedback', label: 'Share accessibility feedback' },
  { value: 'privacy_request', label: 'Make a privacy/data request' },
  { value: 'mcc_account_support', label: 'I have an existing Metrix account question' },
  { value: 'contact_support', label: 'Something else' },
]

export function CustomerCareForm() {
  const [requestType, setRequestType] = useState('')
  const [name, setName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRenderedAt = useRef(Date.now())

  const isMccAccount = requestType === 'mcc_account_support'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/customer-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          name: name || null,
          contactEmail: contactEmail || null,
          message,
          route: typeof window !== 'undefined' ? window.location.pathname : '/customer-care',
          website: honeypot,
          formRenderedAt: formRenderedAt.current,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      trackLandingEvent('care_request_submitted', { request_type: requestType })
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
        <p className="text-xl font-bold text-gray-900 mb-2">Request received.</p>
        <p className="text-gray-500">We&apos;ll follow up if you provided contact information.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-4">
      <input
        type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      />

      <div>
        <label htmlFor="care-request-type" className="block text-sm font-semibold text-gray-700 mb-1.5">What can we help with?</label>
        <select
          id="care-request-type" required value={requestType} onChange={(e) => setRequestType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
        >
          <option value="" disabled>Choose a category</option>
          {REQUEST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {isMccAccount && (
        <div className="card-panel bg-amber-50 border-amber-200 text-sm text-amber-900">
          This form is for the public website only. For your Metrix Command Center account, log in at{' '}
          <a href="https://mcc.subzerometrix.com/login" className="underline font-semibold">mcc.subzerometrix.com/login</a>{' '}
          and use the support option there. Never share your password here.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="care-name" className="sr-only">Name (optional)</label>
          <input
            id="care-name" type="text" maxLength={200} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="care-email" className="sr-only">Email (optional)</label>
          <input
            id="care-email" type="email" maxLength={254} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Email (optional, for a reply)"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="care-message" className="sr-only">Details</label>
        <textarea
          id="care-message" required maxLength={2000} rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Details"
          className="w-full px-5 py-3 rounded-2xl bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none resize-vertical"
        />
      </div>

      <p className="text-xs text-gray-500">
        See our <Link href="/privacy" className="underline">privacy policy</Link> for how this information is handled.
      </p>

      {errorMsg && <p className="text-sm text-red-600" role="alert">{errorMsg}</p>}

      <button type="submit" disabled={status === 'submitting' || !requestType} className="btn-primary w-full disabled:opacity-50">
        {status === 'submitting' ? 'Sending...' : 'Submit request'}
      </button>
    </form>
  )
}
