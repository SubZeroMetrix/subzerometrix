'use client'

// ─────────────────────────────────────────────────────────────────────────────
// TradeIntelligenceCard — display-only Wave 3 trade intelligence (canonical adapter)
// ─────────────────────────────────────────────────────────────────────────────
// Reads the canonical snapshot through deriveTradeIntelligence (a pure adapter) and renders
// the resolved trade's operating model, dimensions, strengths/risks, recurring-revenue
// opportunities, recommended resource categories, and trade-aware questions. It NEVER scores,
// prioritizes, gates, or mutates anything — it formats trade-specific context. It is
// SUBORDINATE: no primary action, no competing CTA. Safe on null/legacy/malformed/unsupported
// data — it renders nothing rather than crashing or inventing content.
//   variant="full"    → results page (richer)
//   variant="compact" → dashboard (quiet single-line strip)
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { Hammer, AlertTriangle, Repeat, HelpCircle, Wrench } from 'lucide-react'
import {
  deriveProfileIntelligence, deriveTradeIntelligence, type MetrixProfileSnapshot,
} from '@/lib/metrix'

const CONFIDENCE_COLOR: Record<string, string> = { high: '#1D9E75', medium: '#4A90D9', low: '#EF9F27' }

export default function TradeIntelligenceCard({
  snapshot, variant = 'full',
}: { snapshot: MetrixProfileSnapshot | null; variant?: 'full' | 'compact' }) {
  const ti = useMemo(() => {
    if (!snapshot) return null
    try {
      // Reuse the Wave 2 evidence-confidence read (single source) when composing trade intel.
      const intel = deriveProfileIntelligence(snapshot, { limit: 1 })
      return deriveTradeIntelligence(snapshot, { intelligence: intel, limit: variant === 'compact' ? 1 : 3 })
    } catch { return null }
  }, [snapshot, variant])

  // Safe: nothing usable, no priority (legacy), or no supported trade → render nothing.
  if (!ti || !snapshot?.metrixPriority || !ti.supported) return null

  const confColor = CONFIDENCE_COLOR[ti.confidence] ?? '#A8B8CC'

  // ── Compact: one quiet strip for the dashboard (subordinate to the next-action CTA) ──
  if (variant === 'compact') {
    const highlight = ti.recurringRevenueOpportunities[0] ?? ti.risks[0] ?? null
    return (
      <section className="glass-light rounded-xl px-4 py-3" aria-label="Trade context">
        <div className="flex items-center gap-2 mb-1.5">
          <Hammer className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
          <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver">Your trade</span>
          <span className="ml-auto text-[12px] font-semibold text-brand-white">{ti.trade.displayName}</span>
        </div>
        {highlight && (
          <p className="text-[11px] text-brand-silver/70 leading-relaxed">
            <span className="text-brand-silver/50">{highlight.label}: </span>{highlight.detail}
          </p>
        )}
      </section>
    )
  }

  // ── Full: richer trade context for the results page ──────────────────────────
  return (
    <section className="glass rounded-2xl p-5 space-y-4" aria-labelledby="ti-heading">
      <div className="flex items-center gap-2">
        <Hammer className="w-4 h-4 text-brand-accent flex-shrink-0" />
        <h3 id="ti-heading" className="font-display text-base tracking-wide text-brand-white">
          {ti.trade.displayName} — trade context
        </h3>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm"
          style={{ background: `${confColor}22`, color: confColor }}>
          {ti.confidence} confidence
        </span>
      </div>

      <p className="text-[11px] text-brand-silver/80 leading-relaxed">{ti.operatingModel}</p>

      {/* Business-model dimensions */}
      {ti.dimensions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ti.dimensions.slice(0, 6).map(d => (
            <span key={d.id} className="text-[10px] px-2 py-1 rounded-sm" style={{ background: 'rgba(168,184,204,0.1)', color: '#C8D4E0' }}>
              <span className="text-brand-silver/60">{d.label}:</span> {d.intensity}
            </span>
          ))}
        </div>
      )}

      {/* Strengths + risks */}
      <div className="grid grid-cols-1 gap-3">
        {ti.strengths.length > 0 && (
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
              <Wrench className="w-3 h-3" style={{ color: '#3FBE93' }} /> Trade strengths
            </p>
            <ul className="space-y-1">
              {ti.strengths.slice(0, 3).map(x => (
                <li key={x.id} className="text-[11px] text-brand-silver/80 leading-relaxed">• {x.detail}</li>
              ))}
            </ul>
          </div>
        )}
        {ti.risks.length > 0 && (
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-brand-accent" /> Trade risks
            </p>
            <ul className="space-y-1">
              {ti.risks.slice(0, 3).map(x => (
                <li key={x.id} className="text-[11px] text-brand-silver/80 leading-relaxed">• {x.detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recurring-revenue opportunities */}
      {ti.recurringRevenueOpportunities.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
            <Repeat className="w-3 h-3 text-brand-accent" /> Recurring-revenue opportunities
          </p>
          <ul className="space-y-1">
            {ti.recurringRevenueOpportunities.slice(0, 2).map(x => (
              <li key={x.id} className="text-[11px] text-brand-silver/80 leading-relaxed">• {x.detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended resource categories (categories only — no providers) */}
      {ti.recommendedResourceCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ti.recommendedResourceCategories.slice(0, 4).map(r => (
            <span key={r.id} className="text-[10px] px-2 py-1 rounded-sm" style={{ background: 'rgba(74,144,217,0.1)', color: '#9FC0E8' }}>
              {r.label}
            </span>
          ))}
        </div>
      )}

      {/* Trade-aware things worth confirming (subordinate — never a CTA) */}
      {ti.nextBestQuestions.length > 0 && (
        <div className="border-t border-brand-blue/30 pt-3">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-brand-accent" /> Worth confirming for your trade
          </p>
          <ul className="space-y-1">
            {ti.nextBestQuestions.map(qn => (
              <li key={qn.candidateId} className="text-[11px] text-brand-silver/70 leading-relaxed">• {qn.reason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
