'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function NewsletterPreferencesPage() {
  return (
    <Suspense fallback={null}>
      <PreferencesContent />
    </Suspense>
  )
}

function PreferencesContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleUnsubscribe() {
    if (!token) return
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
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

  return (
    <div className="py-20">
      <div className="section-container max-w-lg">
        <p className="text-label text-brand-electric mb-3">Newsletter</p>
        <h1 className="text-headline text-gray-900 mb-4">Manage Your Subscription</h1>

        {!token && (
          <p className="text-body-lg">
            This page requires the unsubscribe link from one of our emails. Every email footer includes a link with
            your personal preference token. If you can&apos;t find it, contact us at{' '}
            <Link href="/contact" className="text-brand-electric underline">the contact page</Link>.
          </p>
        )}

        {token && status !== 'success' && (
          <div className="card-panel">
            <p className="text-gray-700 mb-6">
              Unsubscribing removes you from both Pinellas Contractor Field Notes and the Modern Trades CRM Growth
              &amp; Systems Brief. This can&apos;t be undone from this page -- you&apos;d need to re-subscribe at{' '}
              <Link href="/newsletter" className="text-brand-electric underline">/newsletter</Link>.
            </p>
            {errorMsg && <p className="text-sm text-red-600 mb-4">{errorMsg}</p>}
            <button onClick={handleUnsubscribe} disabled={status === 'submitting'} className="btn-primary disabled:opacity-50">
              {status === 'submitting' ? 'Unsubscribing...' : 'Unsubscribe from all'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="card-panel">
            <p className="text-gray-700">You&apos;ve been unsubscribed from all newsletters. Sorry to see you go.</p>
          </div>
        )}
      </div>
    </div>
  )
}
