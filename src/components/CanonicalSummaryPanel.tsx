// ─────────────────────────────────────────────────────────────────────────────
// CanonicalSummaryPanel — Wave 7 Checkpoint 4: the canonical-adapter read path
// ─────────────────────────────────────────────────────────────────────────────
// A SUBORDINATE, presentation-only strip that sources its values from the one canonical
// presentation adapter (`buildCanonicalPresentation`) instead of reading the engine raw. It
// surfaces the unified score band, coverage confidence, data freshness, sync state, and the
// affiliate-disclosure indicator using the Checkpoint 2 design system.
//
// Guardrails honored:
//   • It recomputes NOTHING — the adapter passes through toMetrixScore / getMetrixPriority
//     (test-enforced: presentation score === toMetrixScore).
//   • It is NOT a second priority CTA — the dominant next-action remains
//     <MetrixPriorityExperience>. This strip only reflects already-derived state.
//   • Gated by the `presentation_shell` flag at the call site; OFF in production by default.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from '@/lib/metrix'
import { buildCanonicalPresentation } from '@/lib/metrix'
import type { PresentationSyncStatus, SyncView } from '@/lib/metrix/canonicalPresentation'
import { Card, Eyebrow, StatePill, Alert } from '@/components/ui'
import {
  confidencePresentation, freshnessPresentation, syncPresentation, scorePresentation,
} from '@/lib/ui/presentationState'

// Map any sync-status vocabulary used by the surrounding page to the presentation enum.
function toPresentationSync(raw?: string): PresentationSyncStatus {
  switch ((raw ?? '').trim().toLowerCase()) {
    case 'synced':
    case 'synced_to_account':
      return 'synced'
    case 'pending':
    case 'saving':
    case 'syncing':
      return 'pending'
    case 'offline':
      return 'offline'
    case 'conflict':
      return 'conflict'
    case 'local_only':
    case 'local':
    case 'saved_on_device':
      return 'local_only'
    default:
      return 'unknown'
  }
}

export default function CanonicalSummaryPanel({
  snapshot,
  syncStatus,
  syncedAt = null,
  cloudWired = false,
  className = '',
}: {
  snapshot: MetrixProfileSnapshot
  syncStatus?: string
  syncedAt?: string | null
  cloudWired?: boolean
  className?: string
}) {
  const sync: SyncView = {
    status: toPresentationSync(syncStatus),
    lastSyncedAt: syncedAt,
    cloudWired,
  }
  const view = buildCanonicalPresentation({ snapshot, sync })
  const band = scorePresentation(view.score.overall)

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Canonical snapshot</Eyebrow>
        <span className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50">
          via presentation adapter
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-display text-3xl leading-none" style={{ color: band.color }}>
          {view.score.overall}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-brand-silver">/ 100</span>
        <span className="ml-auto text-[13px] font-semibold" style={{ color: band.color }}>
          {band.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatePill state={confidencePresentation(view.confidence.coverageLevel)} />
        <StatePill state={freshnessPresentation(view.confidence.freshnessCategory)} />
        <StatePill state={syncPresentation(view.sync.status)} />
      </div>

      {view.disclosures.affiliateDisclosureRequired ? (
        <p className="mt-3 text-[11px] text-brand-silver/70 leading-relaxed">
          Some recommendations below include a disclosed relationship. Disclosures never affect
          your score, priority, or which resources are shown.
        </p>
      ) : null}

      {!view.support.profileComplete ? (
        <Alert tone="info" className="mt-3">
          Answer a few more questions to sharpen this snapshot.
        </Alert>
      ) : null}
    </Card>
  )
}
