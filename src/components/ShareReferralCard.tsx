'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ShareReferralCard — manual share / referral CTA (Growth-3)
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL SHARE ONLY. A "copy link" button (with a visible fallback link if the
// clipboard API is unavailable) plus honest disclosure copy. No auto email/SMS,
// no social API, no automatic invites. Lightly records no-op analytics events.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { getShareCopy, buildShareUrl, type ShareContext, type ShareLang } from '@/lib/shareEngine'
import { getReferralDisclosureText } from '@/lib/referralEngine'
import { trackEvent } from '@/lib/analytics'

export default function ShareReferralCard({
  context, lang = 'en',
}: { context: ShareContext; lang?: ShareLang }) {
  const [copied, setCopied] = useState(false)
  const copy = getShareCopy(context, lang)
  const url = buildShareUrl(context, 'copy_link')
  const fullText = `${copy.shareText} ${url}`
  const disclosure = getReferralDisclosureText(lang)
  const copiedLabel = lang === 'es' ? 'Copiado' : 'Copied'

  async function handleCopy() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Clipboard unavailable — the fallback link below is always shown.
    }
    // No-op analytics stubs; never auto-send anything.
    trackEvent('resource_shared', { context, lang })
    trackEvent('referral_created', { context, lang })
    trackEvent('share_link_copied', { context, lang })
  }

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Share2 className="w-4 h-4 text-brand-accent" />
        <h3 className="text-[14px] font-semibold text-brand-white">{copy.ctaLabel}</h3>
      </div>
      <p className="text-[12px] text-brand-silver leading-relaxed mb-3">{copy.shareText}</p>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target"
      >
        {copied
          ? <><Check className="w-4 h-4" /> {copiedLabel}</>
          : <><Copy className="w-4 h-4" /> {lang === 'es' ? 'Copiar enlace' : 'Copy link'}</>}
      </button>

      {/* Fallback display link — always visible so users can copy manually. */}
      <p className="text-[10px] text-brand-silver/60 break-all mt-2 leading-relaxed">{url}</p>

      <p className="text-[10px] text-brand-silver/50 leading-relaxed mt-2">{disclosure}</p>
    </section>
  )
}
