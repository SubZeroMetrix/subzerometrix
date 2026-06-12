'use client'

// ─────────────────────────────────────────────────────────────────────────────
// PartnerInterestForm — local-device partner interest capture (Growth-5)
// ─────────────────────────────────────────────────────────────────────────────
// Saves partner interest on THIS DEVICE only. NO external submit, NO backend/API,
// NO CRM, NO email sending, NO network calls, NO automatic outreach. Formal contact
// is by email (shown). No official-partner / endorsement / affiliate claims.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Handshake, Check } from 'lucide-react'
import {
  getPartnerDistributionChannels, createPartnerInterestSubmission, savePartnerInterestLocal,
  getPartnerDisclosureText, PARTNER_CONTACT_EMAIL, type PartnerChannelType,
} from '@/lib/partnerDistribution'

export default function PartnerInterestForm() {
  const channels = getPartnerDistributionChannels()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [channelType, setChannelType] = useState<PartnerChannelType>(channels[0].type)
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [consent, setConsent] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleSave() {
    if (name.trim() === '' && company.trim() === '') {
      setError('Add your name or company to save.')
      return
    }
    const submission = createPartnerInterestSubmission({
      name, company, channelType, website, email, collaborationNote: note, consentToContact: consent,
    })
    savePartnerInterestLocal(submission)   // device-only; nothing is sent
    setSaved(true)
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl text-[13px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent'

  if (saved) {
    return (
      <section className="glass rounded-2xl p-5">
        <p className="inline-flex items-center gap-1.5 text-[13px] text-brand-white">
          <Check className="w-4 h-4" style={{ color: '#3FBE93' }} /> Partner interest saved on this device.
        </p>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-2">
          To formally contact us, email{' '}
          <a href={`mailto:${PARTNER_CONTACT_EMAIL}`} className="text-brand-accent underline underline-offset-2">{PARTNER_CONTACT_EMAIL}</a>.
        </p>
      </section>
    )
  }

  return (
    <section className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Handshake className="w-4 h-4 text-brand-accent" />
        <h2 className="font-display text-base tracking-wide text-brand-white">Register partner interest</h2>
      </div>

      <input type="text" value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Your name" className={inputClass} />
      <input type="text" value={company} onChange={e => { setCompany(e.target.value); setError('') }} placeholder="Company / organization" className={inputClass} />

      <select value={channelType} onChange={e => setChannelType(e.target.value as PartnerChannelType)}
        className={`${inputClass} appearance-none cursor-pointer`}>
        {channels.map(c => (
          <option key={c.type} value={c.type} className="bg-brand-navy text-brand-white">{c.label}</option>
        ))}
      </select>

      <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website (optional)" className={inputClass} />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" className={inputClass} />
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How would you like to collaborate? (optional)" rows={3} className={inputClass} />

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-brand-accent" />
        <span className="text-[12px] text-brand-silver leading-relaxed">It is okay to contact me later about this.</span>
      </label>

      {error && <p className="text-[11px] text-red-300">{error}</p>}

      <button type="button" onClick={handleSave}
        className="w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
        Save partner interest
      </button>

      <p className="text-[10px] text-brand-silver/50 leading-relaxed">{getPartnerDisclosureText()}</p>
    </section>
  )
}
