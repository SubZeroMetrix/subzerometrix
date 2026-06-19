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
      <div className="card text-center py-8">
        <p className="text-lg font-semibold text-brand-cyan">You&apos;re in.</p>
        <p className="text-gray-400 mt-2">
          Check your inbox for the Online Business Software Buying Guide.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-bold text-white">
        Get the Free Software Buying Guide
      </h3>
      <p className="text-sm text-gray-400">
        What to buy now, later, or never — so you stop wasting money on tools you
        don&apos;t need yet.
      </p>

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
          className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="lead-usecase" className="sr-only">What are you working on?</label>
        <select
          id="lead-usecase"
          required
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white focus:border-brand-cyan focus:outline-none"
        >
          <option value="">What are you working on?</option>
          {useCaseOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-gray-600 bg-brand-navy text-brand-electric focus:ring-brand-cyan"
        />
        <span>
          I agree to receive emails from SubZero Metrix. Unsubscribe anytime.
          See our{' '}
          <Link href="/privacy" className="text-brand-cyan underline">privacy policy</Link>.
        </span>
      </label>

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

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
