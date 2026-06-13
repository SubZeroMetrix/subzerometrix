'use client'

// ─────────────────────────────────────────────────────────────────────────────
// GrowthRoadmap — Product-6 UI: Customer Growth Roadmap
// ─────────────────────────────────────────────────────────────────────────────
// Collects a few growth signals (local-first), diagnoses the primary constraint, and
// renders a prioritized, trade-aware growth roadmap (Do now / next / later) + channels +
// cross-sell + social rhythm + KPIs. Honest: no guarantees, "not tracked" is allowed,
// confidence is surfaced. No scoring/payment/cloud changes.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { TrendingUp, ArrowRight, Target, CheckCircle2 } from 'lucide-react'
import {
  buildGrowthRoadmap, loadGrowthInputs, saveGrowthInputs,
  getConstraintLabel, getCrossSell, SOCIAL_RHYTHM, normalizeGrowthTrade,
  type GrowthInputs, type GrowthBucket, type GrowthStage,
} from '@/lib/growthEngine'
import { loadIntake } from '@/lib/intake'

const STAGES: { value: GrowthStage; label: string }[] = [
  { value: 'pre_launch', label: 'Pre-launch' },
  { value: 'newly_launched', label: 'Newly launched' },
  { value: 'owner_operator', label: 'Owner-operator' },
  { value: 'early_team', label: 'Early team' },
  { value: 'established', label: 'Established' },
  { value: 'growth_stage', label: 'Growth stage' },
]
const BUCKET_LABEL: Record<GrowthBucket, string> = { do_now: 'Do now', do_next: 'Do next', later: 'Later' }
const BUCKET_COLOR: Record<GrowthBucket, string> = { do_now: '#E05A4E', do_next: '#EFB967', later: '#9FB3C8' }

export default function GrowthRoadmap() {
  const [inputs, setInputs] = useState<GrowthInputs>({})
  const [loaded, setLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = loadGrowthInputs() ?? {}
    const trade = normalizeGrowthTrade(loadIntake()?.trade) ?? undefined
    const next = { trade: saved.trade ?? trade, ...saved }
    setInputs(next)
    setLoaded(true)
    setShowForm(Object.keys(saved).length === 0)
  }, [])

  const roadmap = useMemo(() => buildGrowthRoadmap(inputs), [inputs])

  function update<K extends keyof GrowthInputs>(key: K, value: GrowthInputs[K]) {
    const next = { ...inputs, [key]: value }
    setInputs(next)
    saveGrowthInputs(next)
  }
  function numOrNull(v: string): number | null { const n = parseFloat(v); return v.trim() === '' || Number.isNaN(n) ? null : n }

  if (!loaded) return <p className="text-brand-silver text-sm">Loading your growth roadmap…</p>

  const input = 'w-full px-3 py-2.5 rounded-xl text-[13px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent'
  const dx = roadmap.diagnosis
  const grouped: Record<GrowthBucket, typeof roadmap.actions> = { do_now: [], do_next: [], later: [] }
  for (const a of roadmap.actions) grouped[a.bucket].push(a)

  return (
    <div className="space-y-6">
      {/* Diagnosis */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-brand-accent" />
          <h2 className="font-display text-lg tracking-wide text-brand-white">Your growth constraint</h2>
        </div>
        {dx.primary ? (
          <>
            <p className="text-[13px] font-semibold text-brand-white">{getConstraintLabel(dx.primary.constraint)}</p>
            <p className="text-[12px] text-brand-silver/85 leading-relaxed mt-1">{dx.summary}</p>
            {dx.secondary.length > 0 && (
              <p className="text-[11px] text-brand-silver/60 mt-2">Also watch: {dx.secondary.map(s => getConstraintLabel(s.constraint)).join(', ')}.</p>
            )}
            {dx.strongest && <p className="text-[11px] mt-2" style={{ color: '#1D9E75' }}>{dx.strongest}</p>}
            {dx.dataConfidenceNote && <p className="text-[10px] text-brand-silver/50 mt-2 leading-relaxed">{dx.dataConfidenceNote}</p>}
          </>
        ) : (
          <p className="text-[12px] text-brand-silver/85 leading-relaxed">{dx.summary}</p>
        )}
        <button type="button" onClick={() => setShowForm(s => !s)}
          className="text-[11px] text-brand-accent underline underline-offset-2 mt-3">
          {showForm ? 'Hide inputs' : 'Update my numbers'}
        </button>
      </section>

      {/* Inputs (collapsible) */}
      {showForm && (
        <section className="glass rounded-2xl p-5 space-y-2.5">
          <p className="text-[10px] text-brand-silver/60 leading-relaxed">
            Enter what you know — leave blank what you don’t track yet. "Not tracked" is itself a useful signal.
          </p>
          <select value={inputs.stage ?? ''} onChange={e => update('stage', (e.target.value || undefined) as GrowthStage)} className={`${input} appearance-none cursor-pointer`}>
            <option value="" className="bg-brand-navy">Business stage…</option>
            {STAGES.map(s => <option key={s.value} value={s.value} className="bg-brand-navy text-brand-white">{s.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" inputMode="numeric" placeholder="Monthly leads" className={input} value={inputs.monthlyLeads ?? ''} onChange={e => update('monthlyLeads', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Response time (min)" className={input} value={inputs.responseMinutes ?? ''} onChange={e => update('responseMinutes', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Missed calls / week" className={input} value={inputs.missedCallsWeekly ?? ''} onChange={e => update('missedCallsWeekly', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Booking rate %" className={input} value={inputs.bookingRatePct ?? ''} onChange={e => update('bookingRatePct', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Close rate %" className={input} value={inputs.closeRatePct ?? ''} onChange={e => update('closeRatePct', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Average ticket $" className={input} value={inputs.avgTicket ?? ''} onChange={e => update('avgTicket', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Repeat customer %" className={input} value={inputs.repeatCustomerPct ?? ''} onChange={e => update('repeatCustomerPct', numOrNull(e.target.value))} />
            <input type="number" inputMode="numeric" placeholder="Reviews (total)" className={input} value={inputs.reviewCount ?? ''} onChange={e => update('reviewCount', numOrNull(e.target.value))} />
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {([['gbpComplete', 'Google Business Profile complete'], ['recurringRevenue', 'Have recurring/agreement revenue'], ['atCapacity', 'At or near capacity'], ['followUpProcess', 'Have estimate follow-up process']] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={inputs[k] === true} onChange={e => update(k, e.target.checked)} className="accent-brand-accent" />
                <span className="text-[11px] text-brand-silver">{label}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {/* Prioritized actions */}
      {(['do_now', 'do_next', 'later'] as GrowthBucket[]).map(bucket => grouped[bucket].length > 0 && (
        <section key={bucket}>
          <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: BUCKET_COLOR[bucket] }}>{BUCKET_LABEL[bucket]}</h3>
          <div className="space-y-2">
            {grouped[bucket].map(a => (
              <div key={a.id} className="glass rounded-xl p-3">
                <p className="text-[12px] font-medium text-brand-white">{a.label}</p>
                <p className="text-[11px] text-brand-silver/75 leading-relaxed mt-0.5">{a.why}</p>
                <p className="text-[9px] text-brand-silver/40 mt-1">{getConstraintLabel(a.constraint)} · {a.priority}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Channels */}
      {roadmap.channels.length > 0 && (
        <section className="glass rounded-2xl p-5">
          <h3 className="font-display text-base tracking-wide text-brand-white mb-2 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-brand-accent" /> Where to find customers next</h3>
          <ul className="space-y-2">
            {roadmap.channels.map(c => (
              <li key={c.id} className="text-[12px]">
                <span className="font-semibold text-brand-white">{c.label}.</span>{' '}
                <span className="text-brand-silver/80">{c.why}</span>{' '}
                <span className="text-brand-silver/50">{c.fitNote}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cross-sell + social */}
      <section className="glass rounded-2xl p-5">
        <h3 className="font-display text-base tracking-wide text-brand-white mb-2">Existing-customer opportunities</h3>
        <ul className="grid grid-cols-2 gap-1.5 mb-4">
          {getCrossSell(inputs.trade ?? null).map((x, i) => (
            <li key={i} className="text-[11px] text-brand-silver/85 flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#1D9E75' }} /> {x}</li>
          ))}
        </ul>
        <p className="text-[10px] text-brand-silver/50 leading-relaxed mb-3">Offer these only when they genuinely help the customer — never as pressure.</p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-silver mb-2">Monthly social rhythm</p>
        <ul className="space-y-1">
          {SOCIAL_RHYTHM.map((s, i) => (
            <li key={i} className="text-[11px] text-brand-silver/85"><span className="font-semibold text-brand-white">{s.week}:</span> {s.pillar}</li>
          ))}
        </ul>
      </section>

      {/* KPIs */}
      <section className="glass rounded-2xl p-5">
        <h3 className="font-display text-base tracking-wide text-brand-white mb-2">Growth numbers to track</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {roadmap.kpis.map(k => <span key={k.key} className="text-[11px] text-brand-silver/80">• {k.label}</span>)}
        </div>
        <p className="text-[10px] text-brand-silver/50 leading-relaxed mt-3">
          Educational only — these are your own numbers to track. SubZeroMetrix™ does not guarantee leads, revenue, or results.
        </p>
      </section>

      <Link href="/foundation-builder" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
        Back to Foundation Builder <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
