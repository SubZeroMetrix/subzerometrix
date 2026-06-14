'use client'

// ─────────────────────────────────────────────────────────────────────────────
// LicensingIntelligenceCard — display-only Wave 4 licensing/jurisdiction intelligence
// ─────────────────────────────────────────────────────────────────────────────
// Reads the canonical snapshot through deriveLicensingIntelligence (a pure adapter) and renders
// the resolved trade × state pathway: authority level, what's confirmed vs. what needs verifying,
// official-source provenance with reviewed dates + stale warnings, neutral routing, and verify-
// before-action next steps. It NEVER scores, prioritizes, gates, or mutates anything, makes NO
// legal-advice claim, and is SUBORDINATE (no primary action, no competing CTA). Safe on
// null/legacy/malformed/unsupported-state/unsupported-trade data — it renders the safe fallback or
// nothing rather than crashing or implying coverage we don't have.
//   variant="full"    → results page (richer)
//   variant="compact" → dashboard (quiet single-line strip)
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { ScrollText, CheckCircle2, AlertTriangle, MapPin, ExternalLink } from 'lucide-react'
import {
  deriveProfileIntelligence, deriveLicensingIntelligence, type MetrixProfileSnapshot,
} from '@/lib/metrix'

const FRESH_COLOR: Record<string, string> = { fresh: '#1D9E75', aging: '#4A90D9', stale: '#EF9F27', unknown: '#A8B8CC' }

export default function LicensingIntelligenceCard({
  snapshot, variant = 'full',
}: { snapshot: MetrixProfileSnapshot | null; variant?: 'full' | 'compact' }) {
  const li = useMemo(() => {
    if (!snapshot) return null
    try {
      const intel = deriveProfileIntelligence(snapshot, { limit: 1 })
      return deriveLicensingIntelligence(snapshot, { intelligence: intel })
    } catch { return null }
  }, [snapshot])

  // Safe: nothing usable, or no priority (legacy) → render nothing. We DO render the unsupported-
  // state fallback (it routes the user to verify), but stay quiet when there's no trade context.
  if (!li || !snapshot?.metrixPriority) return null
  if (li.status === 'incomplete' || li.status === 'unsupported_trade') return null

  const reviewed = li.reviewedDate
  const freshColor = FRESH_COLOR[li.freshness] ?? '#A8B8CC'

  // ── Unsupported-state fallback (quiet, honest, route-to-authority) ───────────
  if (li.status === 'unsupported_state') {
    if (variant === 'compact') return null
    return (
      <section className="glass rounded-2xl p-5 space-y-2" aria-labelledby="li-heading">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-brand-accent flex-shrink-0" />
          <h3 id="li-heading" className="font-display text-base tracking-wide text-brand-white">
            {li.trade.displayName} licensing — verify locally
          </h3>
        </div>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed">{li.rationale}</p>
        {li.recommendedNextActions.length > 0 && (
          <ul className="space-y-1">
            {li.recommendedNextActions.map((a, i) => (
              <li key={i} className="text-[11px] text-brand-silver/70 leading-relaxed">• {a}</li>
            ))}
          </ul>
        )}
        <p className="text-[10px] text-brand-silver/50 leading-relaxed pt-1 border-t border-brand-blue/20">{li.disclaimer}</p>
      </section>
    )
  }

  // ── Compact: one quiet strip for the dashboard (subordinate to the next-action CTA) ──
  if (variant === 'compact') {
    const verify = li.staleSources.length > 0
      ? 'Sources are due for re-verification — confirm with the authority.'
      : (li.recommendedNextActions[0] ?? li.disclaimer)
    return (
      <section className="glass-light rounded-xl px-4 py-3" aria-label="Licensing context">
        <div className="flex items-center gap-2 mb-1.5">
          <ScrollText className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
          <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver">Licensing</span>
          <span className="ml-auto text-[12px] font-semibold text-brand-white">
            {li.trade.displayName} · {li.state.displayName}
          </span>
        </div>
        <p className="text-[11px] text-brand-silver/70 leading-relaxed">{verify}</p>
      </section>
    )
  }

  // ── Full: richer licensing context for the results page ──────────────────────
  return (
    <section className="glass rounded-2xl p-5 space-y-4" aria-labelledby="li-heading">
      <div className="flex items-center gap-2">
        <ScrollText className="w-4 h-4 text-brand-accent flex-shrink-0" />
        <h3 id="li-heading" className="font-display text-base tracking-wide text-brand-white">
          {li.trade.displayName} licensing — {li.state.displayName}
        </h3>
        {reviewed && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm"
            style={{ background: `${freshColor}22`, color: freshColor }}>
            reviewed {reviewed}
          </span>
        )}
      </div>

      {/* Stale-source warning (never present stale data as current law) */}
      {li.staleSources.length > 0 && (
        <p className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: '#EF9F27' }}>
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          These references are past their review window — confirm the current requirement directly with the authority.
        </p>
      )}

      {/* Confirmed vs. verify-needed — clearly separated */}
      <div className="grid grid-cols-1 gap-3">
        {li.knownRequirements.length > 0 && (
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5">What we found</p>
            <ul className="space-y-1.5">
              {li.knownRequirements.map(r => (
                <li key={r.id} className="text-[11px] text-brand-silver/80 leading-relaxed flex items-start gap-1.5">
                  {r.confirmed
                    ? <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#3FBE93' }} />
                    : <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 text-brand-accent" />}
                  <span><span className="text-brand-white/90">{r.label}:</span> {r.detail}
                    {!r.confirmed && <span className="text-brand-accent/80"> (verify)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {li.importantUnknowns.length > 0 && (
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5">Confirm for your situation</p>
            <ul className="space-y-1">
              {li.importantUnknowns.map(u => (
                <li key={u.id} className="text-[11px] text-brand-silver/70 leading-relaxed">• <span className="text-brand-white/80">{u.label}:</span> {u.detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Verify-before-action next steps (subordinate — never a primary CTA) */}
      {li.recommendedNextActions.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-accent" /> Before you act
          </p>
          <ul className="space-y-1">
            {li.recommendedNextActions.map((a, i) => (
              <li key={i} className="text-[11px] text-brand-silver/80 leading-relaxed">• {a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Official sources (provenance — official URLs only) */}
      {li.officialSources.length > 0 && (
        <div className="border-t border-brand-blue/30 pt-3">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1.5">Official sources</p>
          <ul className="space-y-1">
            {li.officialSources.map(src => (
              <li key={src.id} className="text-[11px] leading-relaxed">
                <a href={src.url} target="_blank" rel="noopener noreferrer"
                  className="text-brand-silver/80 hover:text-brand-white inline-flex items-center gap-1">
                  {src.authorityName} <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                </a>
                {src.stale && <span className="text-brand-accent/80"> · re-verify</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Neutral routing categories (no providers — categories only) */}
      {li.routingCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {li.routingCategories.slice(0, 6).map(r => (
            <span key={r.id} className="text-[10px] px-2 py-1 rounded-sm" style={{ background: 'rgba(74,144,217,0.1)', color: '#9FC0E8' }}>
              {r.label}
            </span>
          ))}
        </div>
      )}

      {/* Non-legal disclaimer */}
      <p className="text-[10px] text-brand-silver/50 leading-relaxed pt-1 border-t border-brand-blue/20">{li.disclaimer}</p>
    </section>
  )
}
