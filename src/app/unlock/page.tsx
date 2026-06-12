'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react'
import type { ScoreResult } from '@/lib/scoring'
import { getProPreview } from '@/lib/tierPreview'

type PriceTier = 'basic' | 'pro' | 'platform'

interface TierConfig {
  id: PriceTier
  name: string
  price: number
  badge?: string
  hook: string
  items: string[]
  accentColor: string
  amount: number // cents for Stripe
}

const TIERS: TierConfig[] = [
  {
    id: 'basic',
    name: 'MetrixScore™',
    price: 9.99,
    hook: 'Your full report + top priorities',
    items: [
      'Your full MetrixScore™ report',
      'Full category breakdown',
      'Top risk areas explained',
      'Your prioritized first actions',
      'Curated official resource links per gap',
    ],
    accentColor: '#4A90D9',
    amount: 999,
  },
  {
    id: 'pro',
    name: 'MetrixScore™ Pro',
    price: 19.99,
    badge: 'Most chosen',
    hook: 'Unlock the full roadmap + practical contractor tools',
    items: ['Everything in MetrixScore™', ...getProPreview().availableNow],
    accentColor: '#EF9F27',
    amount: 1999,
  },
  {
    id: 'platform',
    name: 'Trade Platform',
    price: 29,
    hook: 'Trade-specific tools built for your trade',
    items: [
      'Everything in MetrixScore™ Pro',
      'Trade-specific platform built for your trade (HeatMetrix, VoltMetrix, etc.)',
      'Trade-specific KPIs and guidance',
      'Future-facing: deeper trade-specific modules as they are released',
    ],
    accentColor: '#1D9E75',
    amount: 2900,
  },
]

export default function UnlockPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PriceTier>('pro')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('szm_score')
      if (!raw) { router.push('/assessment'); return }
      setResult(JSON.parse(raw))
    } catch {
      router.push('/assessment')
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('cancelled') === 'true') setCancelled(true)
    }
  }, [router])

  async function handleCheckout() {
    setLoading(true)
    try {
      const assessmentId = localStorage.getItem('szm_assessment_id') ?? undefined
      const tier = TIERS.find(t => t.id === selectedTier)!
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoreData: result,
          assessmentId,
          tierName: tier.name,
          tierAmount: tier.amount,
          tierId: tier.id,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL:', data)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (!result) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-brand-navy">
        <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </main>
    )
  }

  const firstName = result.leadName || null
  const selectedConfig = TIERS.find(t => t.id === selectedTier)!

  // Band-based urgency message
  const bandMessages: Record<string, string> = {
    'High Risk':        'Your score reveals critical gaps that need immediate attention.',
    'Foundation Stage': 'Your foundation has gaps — the roadmap shows exactly where to start.',
    'Launch Ready':     'You\'re close — a few targeted fixes unlock real growth.',
    'Growth Ready':     'Strong foundation. The roadmap shows your next level.',
  }
  const urgencyMsg = result.band ? (bandMessages[result.band] ?? '') : ''

  return (
    <main className="min-h-dvh bg-brand-navy flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 text-center border-b border-brand-blue/40">
        <span className="font-display text-lg tracking-widest text-brand-white">
          SUBZERO<span className="text-brand-accent">METRIX</span>
        </span>
      </div>

      <div className="flex-1 px-5 pb-12 max-w-md mx-auto w-full">

        {cancelled && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30">
            <p className="text-xs text-red-300">Payment was cancelled. Your results are saved — unlock anytime.</p>
          </div>
        )}

        {/* Score reveal tension */}
        <div className="text-center pt-6 mb-5">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-2">
            Assessment Complete
          </p>
          <h1 className="font-display text-4xl tracking-wider text-brand-white leading-none mb-3">
            {firstName ? `${firstName.toUpperCase()},` : 'YOUR'}
            <br />REPORT IS READY
          </h1>
          {urgencyMsg && (
            <p className="text-sm text-brand-silver leading-relaxed max-w-xs mx-auto">
              {urgencyMsg}
            </p>
          )}
        </div>

        {/* Locked gauge */}
        <div className="glass rounded-2xl p-5 mb-4 text-center">
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-silver mb-3">
            Your Full Report
          </p>
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg className="w-full h-full" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(168,184,204,0.08)" strokeWidth="8" />
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(168,184,204,0.12)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray="339" strokeDashoffset="170" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <Lock className="w-5 h-5 text-brand-silver/50" />
              <span className="font-mono text-[9px] tracking-widest text-brand-silver/50 uppercase">Locked</span>
            </div>
          </div>
          {result.band && (
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-medium tracking-wide"
              style={{
                background: result.band === 'High Risk' ? 'rgba(224,90,78,0.15)' :
                            result.band === 'Foundation Stage' ? 'rgba(74,144,217,0.15)' :
                            result.band === 'Launch Ready' ? 'rgba(239,159,39,0.15)' : 'rgba(29,158,117,0.15)',
                color: result.band === 'High Risk' ? '#E05A4E' :
                       result.band === 'Foundation Stage' ? '#4A90D9' :
                       result.band === 'Launch Ready' ? '#EF9F27' : '#1D9E75',
                border: `1px solid currentColor`,
              }}>
              {result.band}
            </div>
          )}
          <p className="text-[11px] text-brand-silver/60 mt-2">
            Your Starter MetrixScore™ is ready — unlock your full report and roadmap.
          </p>
        </div>

        {/* Snapshot teasers */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {result.businessType && (
            <div className="glass-light rounded-xl p-3">
              <p className="text-[9px] uppercase tracking-widest text-brand-silver font-mono mb-1">Trade</p>
              <p className="text-xs text-brand-white font-medium">{result.businessType}</p>
            </div>
          )}
          {result.stage && (
            <div className="glass-light rounded-xl p-3">
              <p className="text-[9px] uppercase tracking-widest text-brand-silver font-mono mb-1">Stage</p>
              <p className="text-xs text-brand-white font-medium leading-snug">{result.stage}</p>
            </div>
          )}
          {result.biggestBlocker && (
            <div className="glass-light rounded-xl p-3 col-span-2">
              <p className="text-[9px] uppercase tracking-widest text-brand-silver font-mono mb-1">Top blocker identified</p>
              <p className="text-xs text-brand-white font-medium">{result.biggestBlocker}</p>
            </div>
          )}
        </div>

        {/* Tier selector */}
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-silver mb-3">
          Choose your report level
        </p>

        <div className="space-y-2 mb-4">
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{
                  background: isSelected ? 'rgba(74,144,217,0.08)' : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? `1.5px solid ${tier.accentColor}`
                    : '1px solid rgba(168,184,204,0.12)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ borderColor: isSelected ? tier.accentColor : 'rgba(168,184,204,0.4)' }}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full" style={{ background: tier.accentColor }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-brand-white">{tier.name}</span>
                        {tier.badge && (
                          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,159,39,0.2)', color: '#EF9F27' }}>
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-silver mt-0.5">{tier.hook}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-xl tracking-wider" style={{ color: tier.accentColor }}>
                      ${tier.price}
                    </span>
                    <span className="text-[9px] text-brand-silver block">
                      {tier.id === 'platform' ? '/mo' : 'one-time'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <ul className="mt-3 space-y-1.5 pl-6">
                    {tier.items.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: tier.accentColor }} />
                        <span className="text-[11px] text-brand-silver leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase text-white transition-all active:scale-95 disabled:opacity-60 touch-target mb-2"
          style={{
            background: selectedConfig.accentColor,
            boxShadow: `0 0 32px ${selectedConfig.accentColor}40`,
          }}
        >
          {loading ? (
            <>Redirecting…<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /></>
          ) : (
            <>Unlock My Report — ${selectedConfig.price}{selectedTier === 'platform' ? '/mo' : ''}<ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <p className="text-center text-[10px] text-brand-silver mb-4">
          Secure checkout via Stripe · Apple Pay, Google Pay & card supported
        </p>

        {/* Legal */}
        <div className="glass-light rounded-xl p-4 mb-4">
          <p className="text-[10px] text-brand-silver/70 leading-relaxed mb-2">
            <strong className="text-brand-silver">Educational use only.</strong> This report does not
            constitute legal, financial, tax, insurance, licensing, or lending advice.
            No business outcomes are guaranteed. Results reflect your self-reported answers.
          </p>
          <p className="text-[10px] text-brand-silver/70 leading-relaxed mb-2">
            All purchases are subject to our{' '}
            <Link href="/terms" className="text-brand-accent underline underline-offset-2">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/cancellation" className="text-brand-accent underline underline-offset-2">Cancellation & Refund Policy</Link>.
            One-time purchases are final. Subscriptions can be cancelled anytime.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms', '/terms'],
              ['Cancellation & Refunds', '/cancellation'],
              ['Affiliate Disclosure', '/affiliate-disclosure'],
              ['Disclaimer', '/disclaimer'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-[10px] text-brand-accent hover:underline underline-offset-2">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-brand-silver">
          Want to retake the assessment?{' '}
          <Link href="/assessment" className="text-brand-accent underline underline-offset-2">
            Start again
          </Link>
        </p>
      </div>
    </main>
  )
}
