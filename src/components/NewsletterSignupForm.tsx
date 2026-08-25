'use client'

import { useState } from 'react'
import { buildAttributionPayload } from '@/lib/attribution'
import type { Publication } from '@/lib/validation/newsletter'

export function NewsletterSignupForm({ publication, compact = false }: { publication: Publication; compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const attribution = buildAttributionPayload({ subject: `Newsletter signup: ${publication}` })
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, publication, attribution }),
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
    return <p className={compact ? 'text-sm text-brand-electric font-medium' : 'text-body-lg text-brand-electric font-medium'}>You&apos;re subscribed. Check your inbox to confirm.</p>
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex gap-2' : 'flex flex-col sm:flex-row gap-3'}>
      <input
        type="email"
        required
        maxLength={254}
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
      />
      <button type="submit" disabled={status === 'submitting'} className="btn-primary whitespace-nowrap disabled:opacity-50">
        {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600 basis-full">{errorMsg}</p>}
    </form>
  )
}
