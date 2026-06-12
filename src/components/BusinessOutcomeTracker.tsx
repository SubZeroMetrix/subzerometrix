'use client'

// ─────────────────────────────────────────────────────────────────────────────
// BusinessOutcomeTracker — manual KPI input + trend (Mega-Phase 4C)
// ─────────────────────────────────────────────────────────────────────────────
// Manual entry only. Saves the contractor's own numbers to LOCAL device history
// and shows movement vs the previous entry. No live integrations, no API calls,
// no automatic sync. The 6 highest-impact KPIs are surfaced as inputs; the model
// (metrixKpis) supports all 10.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { BarChart3, Save, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MANUAL_KPI_DEFINITIONS, getKpiDefinition, type ManualKpiKey } from '@/lib/metrixKpis'
import {
  saveManualKpiSnapshotLocal,
  getCurrentKpiSnapshot,
  calculateKpiProgressSummary,
  type KpiProgressSummary,
} from '@/lib/kpiProgress'

const TRACKED_KEYS: ManualKpiKey[] = [
  'monthly_revenue', 'leads', 'booked_calls', 'close_rate', 'average_ticket', 'reviews',
]

function formatValue(value: number, unit: string): string {
  if (unit === 'currency') return `$${value.toLocaleString()}`
  if (unit === 'percent') return `${value}%`
  return `${value}`
}

function DeltaBadge({ delta, unit, improved }: { delta: number | null; unit: string; improved: boolean | null }) {
  if (delta === null) return <span className="text-[10px] text-brand-silver/50">new</span>
  const color = improved === true ? '#3FBE93' : improved === false ? '#E05A4E' : '#A8B8CC'
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const sign = delta > 0 ? '+' : ''
  const shown = unit === 'currency' ? `${sign}$${Math.abs(delta).toLocaleString()}` : `${sign}${delta}${unit === 'percent' ? '%' : ''}`
  return (
    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color }}>
      <Icon className="w-3 h-3" /> {shown}
    </span>
  )
}

export default function BusinessOutcomeTracker() {
  const [inputs, setInputs] = useState<Partial<Record<ManualKpiKey, string>>>({})
  const [summary, setSummary] = useState<KpiProgressSummary | null>(null)
  const [feedback, setFeedback] = useState<string>('')

  function refresh() {
    setSummary(calculateKpiProgressSummary())
  }

  useEffect(() => {
    const current = getCurrentKpiSnapshot()
    if (current) {
      const prefill: Partial<Record<ManualKpiKey, string>> = {}
      for (const key of TRACKED_KEYS) {
        const v = current.values[key]
        if (typeof v === 'number') prefill[key] = String(v)
      }
      setInputs(prefill)
    }
    refresh()
  }, [])

  function handleSave() {
    const values: Partial<Record<ManualKpiKey, number>> = {}
    for (const key of TRACKED_KEYS) {
      const raw = inputs[key]
      if (raw === undefined || raw.trim() === '') continue
      const num = Number(raw)
      if (Number.isFinite(num)) values[key] = num
    }
    if (Object.keys(values).length === 0) {
      setFeedback('Enter at least one number to save.')
      return
    }
    saveManualKpiSnapshotLocal(values)
    setFeedback('Saved on this device.')
    refresh()
  }

  const lastUpdated = summary?.lastUpdated
    ? new Date(summary.lastUpdated).toLocaleDateString('en-US', { dateStyle: 'medium' })
    : null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-brand-accent" />
        <h2 className="font-display text-xl tracking-wider text-brand-white">BUSINESS OUTCOME TRACKER</h2>
      </div>
      <div className="glass rounded-2xl p-5 space-y-4">
        <p className="text-[12px] text-brand-silver leading-relaxed">
          Enter your own numbers to track business movement over time. Manual entry. Saved on this device.
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {TRACKED_KEYS.map(key => {
            const def = getKpiDefinition(key)
            if (!def) return null
            return (
              <div key={key}>
                <label className="block font-mono text-[9px] tracking-[0.14em] uppercase text-brand-silver mb-1">
                  {def.label}
                  {def.unit === 'currency' && <span className="text-brand-silver/50"> ($)</span>}
                  {def.unit === 'percent' && <span className="text-brand-silver/50"> (%)</span>}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs[key] ?? ''}
                  onChange={e => { setInputs(prev => ({ ...prev, [key]: e.target.value })); setFeedback('') }}
                  placeholder="—"
                  className="w-full px-3 py-2.5 rounded-xl text-sm glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent touch-target"
                />
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target"
        >
          <Save className="w-4 h-4" /> Save my numbers
        </button>

        <div className="flex items-center justify-between">
          {lastUpdated && <span className="text-[10px] text-brand-silver/60">Last updated: {lastUpdated}</span>}
          {feedback && <span className="text-[10px]" style={{ color: '#3FBE93' }}>{feedback}</span>}
        </div>

        {/* Previous vs current movement */}
        {summary && summary.deltas.length > 0 && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent">Outcome trend</p>
            {summary.deltas
              .filter(d => TRACKED_KEYS.includes(d.key))
              .map(d => (
                <div key={d.key} className="flex items-center gap-3">
                  <span className="flex-1 text-[12px] text-brand-silver leading-snug">{d.label}</span>
                  <span className="font-mono text-[11px] text-brand-white">
                    {d.current !== null ? formatValue(d.current, d.unit) : '—'}
                  </span>
                  <span className="w-16 text-right">
                    <DeltaBadge delta={d.delta} unit={d.unit} improved={d.improved} />
                  </span>
                </div>
              ))}
            <p className="text-[11px] text-brand-silver/70 leading-relaxed pt-1">{summary.message}</p>
          </div>
        )}
      </div>
    </section>
  )
}
