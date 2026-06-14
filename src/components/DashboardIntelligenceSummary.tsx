'use client'

// ─────────────────────────────────────────────────────────────────────────────
// DashboardIntelligenceSummary — quiet Wave 2 lifecycle/profile strip (display-only)
// ─────────────────────────────────────────────────────────────────────────────
// A concise, SUBORDINATE summary for return routing: lifecycle stage, profile
// completeness, evidence confidence, and the single highest-value thing worth confirming
// — plus a quiet text link back to the results/priority experience. It reads the canonical
// snapshot through deriveProfileIntelligence (a pure adapter) and NEVER evaluates, scores,
// gates, prioritizes, or builds paths. It is intentionally low-emphasis so it never competes
// with the dashboard's dominant next-action CTA. Safe on missing/malformed/legacy snapshots.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import Link from 'next/link'
import { Compass, ArrowRight } from 'lucide-react'
import { deriveProfileIntelligence, type MetrixProfileSnapshot } from '@/lib/metrix'

const CONFIDENCE_COLOR: Record<string, string> = { high: '#1D9E75', medium: '#4A90D9', low: '#EF9F27' }

export default function DashboardIntelligenceSummary({ snapshot }: { snapshot: MetrixProfileSnapshot | null }) {
  const intel = useMemo(() => {
    if (!snapshot) return null
    try { return deriveProfileIntelligence(snapshot, { limit: 1 }) } catch { return null }
  }, [snapshot])

  // No usable snapshot / legacy without a priority → render nothing (safe).
  if (!intel || !snapshot?.metrixPriority) return null

  const { lifecycle, completeness, evidenceConfidence, importantUnknowns, nextBestQuestions } = intel
  const confColor = CONFIDENCE_COLOR[lifecycle.confidence] ?? '#A8B8CC'
  // Single highest-value thing worth confirming (unknown first, else next-best question).
  const worthConfirming = importantUnknowns[0]?.reason ?? nextBestQuestions[0]?.reason ?? null

  return (
    <section className="glass-light rounded-xl px-4 py-3" aria-label="Profile snapshot">
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver">Where you are</span>
        <span className="ml-auto text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm"
          style={{ background: `${confColor}22`, color: confColor }}>
          {lifecycle.confidence}
        </span>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[13px] font-semibold text-brand-white">{lifecycle.stage}</span>
        <span className="text-[11px] text-brand-silver/70">{completeness.percent}% complete · evidence {evidenceConfidence}</span>
      </div>

      {worthConfirming && (
        <p className="text-[11px] text-brand-silver/70 leading-relaxed mt-1.5">
          <span className="text-brand-silver/50">Worth confirming: </span>{worthConfirming}
        </p>
      )}

      {/* Quiet, secondary link — never an equal-weight CTA. */}
      <Link href="/results"
        className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-brand-accent hover:underline underline-offset-2 touch-target">
        See your priority plan <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  )
}
