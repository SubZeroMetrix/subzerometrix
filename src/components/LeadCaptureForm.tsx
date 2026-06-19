'use client'

import { useState } from 'react'
import Link from 'next/link'

const useCaseOptions = [
  'Start an online business',
  'Build a website',
  'Grow an email list',
  'Launch a newsletter',
  'Sell online',
  'Automate marketing',
  'Improve SEO',
  'Run B2B outreach',
]

export function LeadCaptureForm({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setErrorMsg('Please agree to receive emails.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, use_case: useCase, consent, source }),
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
      <div className="card-panel text-center py-10">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">&#10003;</div>
        <p className="text-xl font-bold text-gray-900 mb-2">You&apos;re on the list.</p>
        <p className="text-gray-500">
          Your submission has been saved. Email delivery is not yet active &mdash; we&apos;ll
          send the guide as soon as our email system is connected.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          The Online Business Software Buying Guide
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          What to Buy Now, Later, or Never
        </p>
      </div>

      <div>
        <label htmlFor="lead-email" className="sr-only">Email address</label>
        <input
          id="lead-email"
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="lead-usecase" className="sr-only">What are you working on?</label>
        <select
          id="lead-usecase"
          required
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors appearance-none"
        >
          <option value="">What are you working on?</option>
          {useCaseOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-brand-electric focus:ring-brand-electric"
        />
        <span>
          I agree to receive emails from SubZero Metrix. Unsubscribe anytime.
          See our{' '}
          <Link href="/privacy" className="text-brand-electric underline">privacy policy</Link>.
        </span>
      </label>

      <p className="text-xs text-gray-400">
        Email delivery is not yet active. Your submission will be saved securely.
      </p>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Get the Free Guide'}
      </button>
    </form>
  )
}
