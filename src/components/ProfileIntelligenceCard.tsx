'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ProfileIntelligenceCard — display-only Wave 2 intelligence (canonical adapter)
// ─────────────────────────────────────────────────────────────────────────────
// Reads the canonical snapshot through deriveProfileIntelligence (a pure adapter) and
// renders lifecycle stage, completeness/confidence, known facts, important unknowns, and
// the explainable "why this priority" detail. It NEVER scores, prioritizes, or mutates
// anything — it formats the one canonical profile. Safe when the snapshot is null/legacy.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { Compass, Gauge, CheckCircle2, HelpCircle, Info, ArrowRight, History } from 'lucide-react'
import {
  deriveProfileIntelligence, loadReassessmentHistory,
  type MetrixProfileSnapshot,
} from '@/lib/metrix'

const CONFIDENCE_COLOR: Record<string, string> = { high: '#1D9E75', medium: '#4A90D9', low: '#EF9F27' }

export default function ProfileIntelligenceCard({ snapshot }: { snapshot: MetrixProfileSnapshot | null }) {
  const intel = useMemo(() => {
    if (!snapshot) return null
    let records: ReturnType<typeof loadReassessmentHistory> = []
    try { records = loadReassessmentHistory() } catch { /* device-local optional */ }
    try { return deriveProfileIntelligence(snapshot, { reassessmentRecords: records, limit: 3 }) }
    catch { return null }
  }, [snapshot])

  if (!intel || !snapshot?.metrixPriority) return null

  const { lifecycle, completeness, evidenceConfidence, knownFacts, importantUnknowns, priorityExplanation: ex } = intel
  const confColor = CONFIDENCE_COLOR[lifecycle.confidence] ?? '#A8B8CC'

  return (
    <section className="glass rounded-2xl p-5 space-y-4" aria-labelledby="pi-heading">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-brand-accent flex-shrink-0" />
        <h3 id="pi-heading" className="font-display text-base tracking-wide text-brand-white">Your profile intelligence</h3>
      </div>

      {/* Lifecycle stage + confidence */}
      <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-accent block mb-0.5">Lifecycle stage</span>
            <span className="text-[14px] text-brand-white font-semibold">{lifecycle.stage}</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm" style={{ background: `${confColor}22`, color: confColor }}>
            {lifecycle.confidence} confidence
          </span>
        </div>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed mt-1.5">{lifecycle.rationale}</p>
      </div>

      {/* Completeness + evidence confidence */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-brand-silver/60" />
          <span className="text-[11px] text-brand-silver">Profile {completeness.percent}% complete <span className="text-brand-silver/50">({completeness.level})</span></span>
        </div>
        <span className="text-[11px] text-brand-silver/70">Evidence: {evidenceConfidence}</span>
      </div>

      {/* Known facts */}
      {knownFacts.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" style={{ color: '#3FBE93' }} /> What we know
          </p>
          <div className="flex flex-wrap gap-1.5">
            {knownFacts.map(f => (
              <span key={f.key} className="text-[10px] px-2 py-1 rounded-sm" style={{ background: 'rgba(168,184,204,0.1)', color: '#C8D4E0' }}>
                <span className="text-brand-silver/60">{f.label}:</span> {f.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Important unknowns */}
      {importantUnknowns.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-brand-accent" /> Worth confirming
          </p>
          <ul className="space-y-1">
            {importantUnknowns.slice(0, 4).map(u => (
              <li key={u.key} className="text-[11px] text-brand-silver/80 leading-relaxed">• {u.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Why this priority */}
      <div className="border-t border-brand-blue/30 pt-3">
        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent mb-1 flex items-center gap-1">
          <Info className="w-3 h-3" /> Why this is your priority
        </p>
        <p className="text-[12px] text-brand-white leading-snug font-medium">{ex.title}</p>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed mt-1">{ex.whySelected}</p>
        {ex.whatCouldChange.length > 0 && (
          <div className="mt-2">
            <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-silver/50 block mb-0.5">What could change it</span>
            <ul className="space-y-0.5">
              {ex.whatCouldChange.slice(0, 3).map((c, i) => (
                <li key={i} className="text-[11px] text-brand-silver/70 leading-relaxed flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-accent mt-0.5 flex-shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {ex.whatStayedUnchanged.length > 0 && (
          <p className="text-[10px] text-brand-silver/50 mt-2 flex items-center gap-1">
            <History className="w-3 h-3" /> Unchanged since last check: {ex.whatStayedUnchanged.join(' · ')}
          </p>
        )}
      </div>
    </section>
  )
}
