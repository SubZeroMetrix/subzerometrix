'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildAttributionPayload, sendAttributionPayload } from '@/lib/attribution'

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  )
}

function ContactForm() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject) setForm((prev) => ({ ...prev, subject }))
  }, [searchParams])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      // Non-blocking: attribution payload has no live endpoint yet (Terminal 1
      // pending), so this only logs in development. Never gates the real
      // submission above, which already succeeded.
      sendAttributionPayload(buildAttributionPayload({ subject: form.subject }))
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-20">
        <div className="section-container max-w-lg text-center">
          <h1 className="text-headline text-gray-900 mb-4">Message Sent</h1>
          <p className="text-body-lg">
            Thank you for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="section-container max-w-lg">
        <p className="text-label text-brand-electric mb-3">Contact</p>
        <h1 className="text-headline text-gray-900 mb-4">Contact Us</h1>
        <p className="text-body-lg mb-10">
          Questions, corrections, feedback, or partnership inquiries.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
            <input
              id="subject"
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none transition-colors resize-y"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-50">
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
