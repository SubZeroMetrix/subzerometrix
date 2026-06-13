'use client'

// ─────────────────────────────────────────────────────────────────────────────
// EmailCaptureForm — Growth-8: consent-first email capture (public pages)
// ─────────────────────────────────────────────────────────────────────────────
// Reusable. Collects an explicitly-consented email + optional context and inserts it
// via emailCapture.submitEmailCapture (anon INSERT-only). Honest by construction:
//   • consent checkbox is UNCHECKED by default; submit is disabled until checked + email.
//   • success is shown ONLY after a confirmed save; honest unavailable/error states.
//   • no email/name is ever sent to analytics; no third-party trackers/pixels/cookies.
//   • reads NO assessment/score/account/Foundation Builder/synced data.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import {
  submitEmailCapture, CONSENT_TEXT, ALLOWED_TRADES, ALLOWED_STATES,
} from '@/lib/emailCapture'
import { trackEvent } from '@/lib/analytics'

const TRADE_LABELS: Record<string, string> = {
  hvac: 'HVAC', electrical: 'Electrical', plumbing: 'Plumbing', roofing: 'Roofing',
  construction: 'General Contractor / Construction', handyman: 'Handyman / Home Repair',
  landscaping: 'Landscaping / Lawn Care', cleaning: 'Cleaning', painting: 'Painting', solar: 'Solar',
}

interface Props {
  sourcePage: string
  sourceIntent: string
  heading?: string
  blurb?: string
  className?: string
}

export default function EmailCaptureForm({ sourcePage, sourceIntent, heading, blurb, className = '' }: Props) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [trade, setTrade] = useState('')
  const [stateVal, setStateVal] = useState('')
  const [consent, setConsent] = useState(false)   // UNCHECKED by default — no dark pattern
  const [honeypot, setHoneypot] = useState('')     // hidden anti-bot field
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)
  const lastSubmitRef = useRef(0)

  useEffect(() => {
    trackEvent('email_capture_viewed', { sourcePage, sourceIntent })
  }, [sourcePage, sourceIntent])

  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('email_capture_started', { sourcePage, sourceIntent })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!consent) { setError('Please confirm consent to continue.'); return }
    const now = Date.now()
    if (now - lastSubmitRef.current < 3000) return  // simple cooldown / dup-submit guard
    lastSubmitRef.current = now

    setSubmitting(true)
    // Non-PII analytics only — never the email or name.
    trackEvent('email_capture_submitted', { sourcePage, sourceIntent, trade: trade || null, state: stateVal || null })
    try {
      const result = await submitEmailCapture({
        email, firstName, selectedTrade: trade || undefined, selectedState: stateVal || undefined,
        sourcePage, sourceIntent, consentToEmail: consent, honeypot,
      })
      if (result.status === 'subscribed' || result.status === 'already') {
        trackEvent('email_capture_success', { sourcePage, sourceIntent, trade: trade || null, state: stateVal || null })
        setDone(true)
      } else {
        trackEvent('email_capture_failed', { sourcePage, sourceIntent, reason: result.status })
        setError(result.message ?? 'Sign-ups are not available right now.')
      }
    } catch {
      trackEvent('email_capture_failed', { sourcePage, sourceIntent, reason: 'error' })
      setError('Something went wrong. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  const input = 'w-full px-3 py-2.5 rounded-xl text-[13px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent'

  if (done) {
    return (
      <section className={`glass rounded-2xl p-5 ${className}`}>
        <p className="inline-flex items-center gap-1.5 text-[13px] text-brand-white">
          <CheckCircle2 className="w-4 h-4" style={{ color: '#3FBE93' }} /> You&apos;re on the update list.
        </p>
        <p className="text-[11px] text-brand-silver/70 leading-relaxed mt-2">
          We&apos;ll email educational contractor-startup tools and guides. You can unsubscribe at any time.
          No emails are sent until our delivery list is live.
        </p>
      </section>
    )
  }

  return (
    <section className={`glass rounded-2xl p-5 ${className}`}>
      <h2 className="font-display text-base tracking-wide text-brand-white mb-1 flex items-center gap-1.5">
        <Mail className="w-4 h-4 text-brand-accent flex-shrink-0" /> {heading ?? 'Join the contractor startup update list'}
      </h2>
      <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-3">
        {blurb ?? 'Join the update list for new contractor-startup tools and guides. Educational only — we route legal, tax, and licensing questions to official sources.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <label htmlFor="ec-email" className="sr-only">Email address</label>
        <input id="ec-email" type="email" inputMode="email" autoComplete="email" required
          value={email} onChange={e => { setEmail(e.target.value); markStarted() }}
          placeholder="Your email" className={input} />

        <label htmlFor="ec-first" className="sr-only">First name (optional)</label>
        <input id="ec-first" type="text" autoComplete="given-name"
          value={firstName} onChange={e => { setFirstName(e.target.value); markStarted() }}
          placeholder="First name (optional)" className={input} />

        <div className="flex gap-2">
          <label htmlFor="ec-trade" className="sr-only">Trade (optional)</label>
          <select id="ec-trade" value={trade} onChange={e => { setTrade(e.target.value); markStarted() }}
            className={`${input} appearance-none cursor-pointer`}>
            <option value="" className="bg-brand-navy">Trade (optional)</option>
            {ALLOWED_TRADES.map(t => (
              <option key={t} value={t} className="bg-brand-navy text-brand-white">{TRADE_LABELS[t]}</option>
            ))}
          </select>
          <label htmlFor="ec-state" className="sr-only">State (optional)</label>
          <select id="ec-state" value={stateVal} onChange={e => { setStateVal(e.target.value); markStarted() }}
            className={`${input} appearance-none cursor-pointer`}>
            <option value="" className="bg-brand-navy">State (optional)</option>
            {ALLOWED_STATES.map(s => (
              <option key={s} value={s} className="bg-brand-navy text-brand-white">{s}</option>
            ))}
          </select>
        </div>

        {/* Honeypot — visually hidden; real users leave it empty */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={honeypot} onChange={e => setHoneypot(e.target.value)}
          className="hidden" name="company_website" />

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); markStarted() }}
            className="mt-0.5 accent-brand-accent" />
          <span className="text-[11px] text-brand-silver leading-relaxed">{CONSENT_TEXT}</span>
        </label>

        {error && <p className="text-[11px] text-red-300">{error}</p>}

        <button type="submit" disabled={submitting || !consent || email.trim() === ''}
          className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target ${(!consent || email.trim() === '') ? 'opacity-50' : ''}`}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Join the update list
        </button>

        <p className="text-[10px] text-brand-silver/50 leading-relaxed">
          Operated by The Modern Trades Mentor LLC. Consent is optional, and you can unsubscribe at any time.
          See our <a href="/privacy" className="underline underline-offset-2">privacy policy</a>. Joining does not
          create a contractor license, legal relationship, financial approval, or guaranteed business outcome —
          verify trade and state requirements with official sources.
        </p>
      </form>
    </section>
  )
}
