// ─────────────────────────────────────────────────────────────────────────────
// CanonicalSummaryPanel — Wave 7 Checkpoint 4: subordinate canonical-state strip
// ─────────────────────────────────────────────────────────────────────────────
// Renders the snapshot's UNIFIED state — coverage confidence, data freshness, sync state, and
// the affiliate-disclosure indicator — from a single, already-built CanonicalPresentation object
// (the page builds it once via buildCanonicalPresentation and passes it down; no second adapter
// call here). This is state that is NOT otherwise surfaced on results/dashboard, so it adds
// distinct value rather than repeating the score.
//
// Guardrails:
//   • The headline score/risk now render in the page's main score card sourced from the SAME
//     presentation object — this panel does NOT repeat the score number.
//   • NOT a next-action CTA — it has no action button and stays subordinate to the dominant CTA.
//   • Gated by `presentation_shell` at the call site; OFF in production by default.
// ─────────────────────────────────────────────────────────────────────────────

import type { CanonicalPresentation } from '@/lib/metrix/canonicalPresentation'
import { Card, Eyebrow, StatePill, Alert } from '@/components/ui'
import { confidencePresentation, freshnessPresentation, syncPresentation } from '@/lib/ui/presentationState'

export default function CanonicalSummaryPanel({
  presentation,
  className = '',
}: {
  presentation: CanonicalPresentation
  className?: string
}) {
  const { confidence, sync, disclosures, support } = presentation

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Snapshot confidence &amp; sync</Eyebrow>
        <span className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50">
          via presentation adapter
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatePill state={confidencePresentation(confidence.coverageLevel)} />
        <StatePill state={freshnessPresentation(confidence.freshnessCategory)} />
        <StatePill state={syncPresentation(sync.status)} />
      </div>

      {disclosures.affiliateDisclosureRequired ? (
        <p className="mt-3 text-[11px] text-brand-silver/70 leading-relaxed">
          Some recommendations below include a disclosed relationship. Disclosures never affect
          your score, priority, or which resources are shown.
        </p>
      ) : null}

      {!support.profileComplete ? (
        <Alert tone="info" className="mt-3">
          Answer a few more questions to sharpen this snapshot.
        </Alert>
      ) : null}
    </Card>
  )
}
