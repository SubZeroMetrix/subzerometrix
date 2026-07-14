'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { trackLandingEvent } from '@/lib/landing-events'

export function ReferralInterestForm() {
  const [interestType, setInterestType] = useState<'referral' | 'partner'>('referral')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [message, setMessage] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRenderedAt = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consentGiven) {
      setErrorMsg('Please acknowledge the Privacy Policy to continue.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/referral-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interestType, name, email,
          businessName: businessName || null,
          message: message || null,
          consentGiven,
          source: 'customer_care_refer_page',
          website: honeypot,
          formRenderedAt: formRenderedAt.current,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      trackLandingEvent(interestType === 'referral' ? 'referral_interest_submitted' : 'partner_interest_submitted')
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
        <p className="text-xl font-bold text-gray-900 mb-2">Thanks for your interest.</p>
        <p className="text-gray-500">We&apos;ll be in touch. Referral and partner terms are not yet formally available — we&apos;ll let you know when they are.</p>
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

      <div className="flex gap-2 mb-2" role="group" aria-label="Interest type">
        <button type="button" onClick={() => setInterestType('referral')} aria-pressed={interestType === 'referral'}
          className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${interestType === 'referral' ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          I want to refer someone
        </button>
        <button type="button" onClick={() => setInterestType('partner')} aria-pressed={interestType === 'partner'}
          className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${interestType === 'partner' ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          I&apos;m interested in a partnership
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input type="text" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none" />
        <input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none" />
      </div>

      <input type="text" maxLength={200} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name (optional)"
        className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none" />

      <textarea maxLength={1000} rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder={interestType === 'referral' ? 'Who are you referring, and why do you think Metrix is a fit? (optional)' : 'Tell us about the partnership you have in mind (optional)'}
        className="w-full px-5 py-3 rounded-2xl bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none resize-vertical" />

      <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
        <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-brand-electric focus:ring-brand-electric" />
        <span>I agree to be contacted about Metrix Command Center. See our <Link href="/privacy" className="text-brand-electric underline">privacy policy</Link>.</span>
      </label>

      {errorMsg && <p className="text-sm text-red-600" role="alert">{errorMsg}</p>}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-50">
        {status === 'submitting' ? 'Sending...' : 'Submit interest'}
      </button>
    </form>
  )
}
