'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-16">
        <div className="section-container max-w-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Message Sent</h1>
          <p className="text-gray-400">
            Thank you for reaching out. We&apos;ll get back to you as soon as
            possible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="section-container max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 mb-8">
          Questions, corrections, feedback, or partnership inquiries — we&apos;d
          like to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm text-gray-300 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none resize-y"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary w-full disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
