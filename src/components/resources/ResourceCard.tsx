// ─────────────────────────────────────────────────────────────────────────────
// resources/ResourceCard — Wave 7 Checkpoint 6: the canonical directory resource card
// ─────────────────────────────────────────────────────────────────────────────
// Renders ONE public-eligible DirectoryEntry (from buildDirectoryView — verified + active only).
// Presentational; SSR-safe. Surfaces only presentation-safe fields. Status is communicated with
// an icon + text label (never color alone). The outbound action uses the tracked redirect path
// (/resources/go/<id>), which itself re-gates eligibility server-side and fails safe.
//
// It never exposes internal verification notes/owner, raw compensation terms, eligibility
// internals, or support contacts.
// ─────────────────────────────────────────────────────────────────────────────

import { ShieldCheck, CalendarCheck, Info } from 'lucide-react'
import type { DirectoryEntry } from '@/lib/metrix/resourceDirectory'
import { humanizeCategory } from '@/lib/metrix/directoryOptions'
import { Card, Badge } from '@/components/ui'
import ResourceOutboundLink from './ResourceOutboundLink'
import ResourceFeedbackControl from './ResourceFeedbackControl'

const TRADE_LABEL: Record<string, string> = {
  hvac: 'HVAC', electrical: 'Electrical', plumbing: 'Plumbing', handyman: 'Handyman',
  landscaping: 'Landscaping', painting: 'Painting', roofing: 'Roofing', solar: 'Solar',
  construction: 'Construction', cleaning: 'Cleaning',
}

function relationshipLabel(e: DirectoryEntry): string {
  if (e.isOfficialOrFree) return 'Official / free'
  switch (e.relationshipStatus) {
    case 'affiliate': return 'Affiliate (disclosed)'
    case 'sponsored': return 'Sponsored (disclosed)'
    case 'partner': return 'Partner'
    case 'editorial': return 'Editorial pick'
    default: return 'Listed resource'
  }
}

export default function ResourceCard({
  entry, placement = 'resource_directory', trackingConsent = false,
}: {
  entry: DirectoryEntry
  placement?: string
  trackingConsent?: boolean
}) {
  return (
    <Card>
      <article aria-labelledby={`res-${entry.resourceId}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 id={`res-${entry.resourceId}`} className="text-sm font-semibold text-brand-white leading-tight">
            {entry.title}
          </h3>
          {entry.verified ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Verified
            </span>
          ) : null}
        </div>

        <p className="text-[13px] text-brand-silver leading-relaxed mt-1.5">{entry.description}</p>

        {/* Category + business need + relationship status (icon/text, not colour-only) */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge tone="neutral">{humanizeCategory(entry.category)}</Badge>
          <Badge tone={entry.isOfficialOrFree ? 'positive' : 'info'}>{relationshipLabel(entry)}</Badge>
          {entry.reviewedDate ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase text-brand-silver/70">
              <CalendarCheck className="w-3 h-3" aria-hidden="true" /> Reviewed {entry.reviewedDate}
            </span>
          ) : null}
        </div>

        {entry.businessNeed ? (
          <p className="text-[12px] text-brand-silver/80 leading-relaxed mt-2">
            <span className="text-brand-silver/60">Helps with:</span> {entry.businessNeed}
          </p>
        ) : null}

        {/* Applicability chips */}
        {(entry.tradeApplicability.length > 0 || entry.lifecycleApplicability.length > 0 || entry.regionApplicability.length > 0) ? (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {entry.tradeApplicability.map(t => (
              <span key={`t-${t}`} className="rounded-full border border-brand-silver/20 px-2 py-0.5 text-[10px] text-brand-silver">{TRADE_LABEL[t] ?? t}</span>
            ))}
            {entry.lifecycleApplicability.map(s => (
              <span key={`l-${s}`} className="rounded-full border border-brand-silver/20 px-2 py-0.5 text-[10px] text-brand-silver">{s}</span>
            ))}
            {entry.regionApplicability.map(r => (
              <span key={`r-${r}`} className="rounded-full border border-brand-silver/20 px-2 py-0.5 text-[10px] text-brand-silver">{r}</span>
            ))}
          </div>
        ) : null}

        {/* Limitations */}
        {entry.limitations ? (
          <p className="flex items-start gap-1.5 text-[11px] text-brand-silver/70 leading-relaxed mt-2">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" /> {entry.limitations}
          </p>
        ) : null}

        {/* Affiliate / sponsorship disclosure where required */}
        {entry.disclosureRequired && entry.disclosureText ? (
          <p className="text-[11px] text-amber-200/80 leading-relaxed mt-2 border-l-2 border-amber-400/40 pl-2">
            {entry.disclosureText}
          </p>
        ) : null}

        {/* Outbound action (tracked redirect — re-gated server-side) + always-available alternatives */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
          <ResourceOutboundLink entry={entry} placement={placement} trackingConsent={trackingConsent} />
          {entry.officialAlternativeUrl ? (
            <a
              href={entry.officialAlternativeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-brand-silver/80 hover:text-brand-white underline underline-offset-2"
            >
              Official / free option
            </a>
          ) : null}
          {entry.useAnotherProviderOption ? (
            <span className="text-[11px] text-brand-silver/60">You can always use your own provider.</span>
          ) : null}
        </div>

        {/* Optional, privacy-safe feedback (device-local; no MetrixScore impact) */}
        <ResourceFeedbackControl
          resourceId={entry.resourceId}
          vendorId={entry.vendorId}
          placement={placement}
          trackingConsent={trackingConsent}
        />
      </article>
    </Card>
  )
}
