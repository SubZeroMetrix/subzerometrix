'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { trackLandingEvent } from '@/lib/landing-events'

const PAIN_OPTIONS = [
  'Leads are not followed up consistently',
  'Estimates go cold',
  'Customer history is difficult to track',
  'Reviews and referrals are missed',
  'The owner does not know what needs attention first',
  'Too many disconnected tools',
  'The business relies on memory',
  'Other',
]

const TRADE_OPTIONS = ['HVAC', 'Electrical', 'Plumbing', 'Facility Management', 'General Contracting', 'Other']
const SIZE_OPTIONS = ['Just me', '2-5', '6-20', '21-50', '50+']

export function QualificationFlow() {
  const [step, setStep] = useState(0)
  const [tradeType, setTradeType] = useState('')
  const [companySizeRange, setCompanySizeRange] = useState('')
  const [primaryPain, setPrimaryPain] = useState('')
  const [currentMethod, setCurrentMethod] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRenderedAt = useRef(Date.now())

  useEffect(() => {
    trackLandingEvent('qualification_started')
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consentGiven) {
      setErrorMsg('Please acknowledge the Privacy Policy to continue.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/qualification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeType, companySizeRange, primaryPain, currentMethod,
          name, email, phone: phone || null,
          consentGiven,
          referrer: typeof document !== 'undefined' ? document.referrer : null,
          landingPage: typeof window !== 'undefined' ? window.location.pathname : null,
          website: honeypot,
          formRenderedAt: formRenderedAt.current,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      trackLandingEvent('qualification_completed', { trade_type: tradeType })
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
        <p className="text-xl font-bold text-gray-900 mb-2">Thanks — we&apos;ll follow up.</p>
        <p className="text-gray-500 mb-6">Based on what you shared, here&apos;s what we&apos;d suggest:</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://mcc.subzerometrix.com/signup" className="btn-primary inline-block">Start Free Trial</a>
          <Link href="/resources" className="btn-secondary inline-block">Browse Resources</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-6">
      <input
        type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      />

      {step === 0 && (
        <fieldset>
          <legend className="text-base font-bold text-gray-900 mb-4">What trade is your business in?</legend>
          <div className="flex flex-wrap gap-2 mb-6">
            {TRADE_OPTIONS.map((t) => (
              <button key={t} type="button" onClick={() => setTradeType(t)}
                aria-pressed={tradeType === t}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tradeType === t ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(1)} disabled={!tradeType} className="btn-primary disabled:opacity-50">Next</button>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend className="text-base font-bold text-gray-900 mb-4">How many people work in the business?</legend>
          <div className="flex flex-wrap gap-2 mb-6">
            {SIZE_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setCompanySizeRange(s)}
                aria-pressed={companySizeRange === s}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${companySizeRange === s ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(0)} className="btn-secondary">Back</button>
            <button type="button" onClick={() => setStep(2)} disabled={!companySizeRange} className="btn-primary disabled:opacity-50">Next</button>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend className="text-base font-bold text-gray-900 mb-4">What&apos;s the biggest challenge right now?</legend>
          <div className="flex flex-col gap-2 mb-2">
            {PAIN_OPTIONS.map((p) => (
              <label key={p} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="primaryPain" checked={primaryPain === p} onChange={() => setPrimaryPain(p)}
                  className="text-brand-electric focus:ring-brand-electric" />
                {p}
              </label>
            ))}
          </div>
          <label htmlFor="current-method" className="block text-sm text-gray-600 mt-4 mb-1">How do you currently track leads and follow-up? (optional)</label>
          <input id="current-method" type="text" maxLength={200} value={currentMethod} onChange={(e) => setCurrentMethod(e.target.value)}
            placeholder="e.g. spreadsheet, notebook, another CRM"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none mb-6" />
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button type="button" onClick={() => setStep(3)} disabled={!primaryPain} className="btn-primary disabled:opacity-50">Next</button>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="text-base font-bold text-gray-900 mb-4">Almost done — how can we reach you?</legend>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
              className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none" />
            <input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none" />
          </div>
          <input type="tel" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)"
            className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none mb-4" />

          <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer mb-4">
            <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-brand-electric focus:ring-brand-electric" />
            <span>I agree to be contacted about Metrix Command Center. See our <Link href="/privacy" className="text-brand-electric underline">privacy policy</Link>.</span>
          </label>

          {errorMsg && <p className="text-sm text-red-600 mb-4" role="alert">{errorMsg}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button type="submit" disabled={status === 'submitting' || !name || !email} className="btn-primary disabled:opacity-50">
              {status === 'submitting' ? 'Submitting...' : 'Get my recommendation'}
            </button>
          </div>
        </fieldset>
      )}
    </form>
  )
}
