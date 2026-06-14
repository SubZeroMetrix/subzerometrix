'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ResourceRecommendations — display-only Wave 5 profile-aware resource recommendations
// ─────────────────────────────────────────────────────────────────────────────
// Reads the canonical snapshot (+ optional Foundation/Growth action context) and renders
// deriveResourceRecommendations(...) for a placement. It is SUBORDINATE: it never competes
// with the dominant next-action CTA, never scores/prioritizes/gates/mutates, and shows WHY
// each resource is recommended, its trade/state/stage applicability, freshness, and disclosure
// status. Commercial relationships never affect ordering (enforced in the adapter). Optional
// helpfulness feedback + dismiss persist locally and never touch the MetrixScore. Consent-aware:
// no attribution events fire unless `trackingConsent` is explicitly true. Safe on null/legacy
// data — it renders the safe fallback or nothing rather than crashing.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState, useEffect } from 'react'
import { Compass, ExternalLink, ThumbsUp, ThumbsDown, X, ShieldCheck, Clock } from 'lucide-react'
import {
  assessLifecycle, collectCanonicalActions, deriveResourceRecommendations,
  getResourceFeedback, getHelpfulnessMap, getCompletedResourceIds, recordResourceFeedback,
  trackRecommendationImpression, trackRecommendationOutboundClick, trackRecommendationFeedback,
  type MetrixProfileSnapshot, type ResourcePlacement, type RecommendedResource,
} from '@/lib/metrix'
import type { FoundationChecklistItem } from '@/lib/foundationBuilder'
import type { GrowthRoadmap } from '@/lib/growthEngine'

const CONFIDENCE_COLOR: Record<string, string> = { high: '#1D9E75', medium: '#4A90D9', low: '#A8B8CC' }
const FRESH_LABEL: Record<string, string> = { fresh: 'current', aging: 're-verify soon', stale: 're-verify', unknown: 'verify' }

export default function ResourceRecommendations({
  snapshot,
  placement,
  foundationItems = null,
  growthRoadmap = null,
  limit = 3,
  trackingConsent = false,
  heading = 'Resources that may help',
}: {
  snapshot: MetrixProfileSnapshot | null
  placement: ResourcePlacement
  foundationItems?: readonly FoundationChecklistItem[] | null
  growthRoadmap?: GrowthRoadmap | null
  limit?: number
  trackingConsent?: boolean
  heading?: string
}) {
  // Local feedback signals (device-local). `tick` re-derives after a feedback action.
  const [tick, setTick] = useState(0)
  const [dismissed, setDismissed] = useState<string[]>([])

  const result = useMemo(() => {
    if (!snapshot) return null
    try {
      const actions = collectCanonicalActions({
        snapshot, foundationItems, growthRoadmap, now: new Date().toISOString(),
      })
      const priorityCategory = actions.find(a => a.provenance.source === 'metrix_priority')?.category ?? null
      const stage = (() => { try { return assessLifecycle(snapshot).stage } catch { return null } })()
      const feedback = getResourceFeedback()
      return deriveResourceRecommendations({
        placement,
        priorityCategory,
        lifecycleStage: stage,
        trade: snapshot.businessContext?.trade ?? null,
        state: snapshot.businessContext?.region ?? null,
        currentActions: actions,
        completedResourceIds: getCompletedResourceIds(feedback),
        dismissedResourceIds: dismissed,
        helpfulness: getHelpfulnessMap(feedback),
        limit,
        now: new Date().toISOString(),
      })
    } catch {
      return null
    }
    // tick forces re-derivation after feedback is recorded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, placement, foundationItems, growthRoadmap, limit, dismissed, tick])

  // Consent-aware impressions (fires once per visible set when consent is granted).
  useEffect(() => {
    if (!trackingConsent || !result) return
    for (const rec of result.recommendations) {
      trackRecommendationImpression(rec.resource, {
        placement, trade: snapshot?.businessContext?.trade ?? null,
        state: snapshot?.businessContext?.region ?? null, consentGranted: true,
        disclosureShown: rec.disclosureStatus === 'required',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, trackingConsent])

  if (!snapshot || !result || result.recommendations.length === 0) return null

  function feedback(rec: RecommendedResource, type: 'helpful' | 'not_helpful') {
    try {
      recordResourceFeedback(rec.resource.resourceId, type)
      if (trackingConsent) {
        trackRecommendationFeedback(rec.resource, type, {
          placement, trade: snapshot?.businessContext?.trade ?? null, consentGranted: true,
        })
      }
      setTick(t => t + 1)
    } catch { /* feedback must never break the UI */ }
  }

  function dismiss(rec: RecommendedResource) {
    recordResourceFeedback(rec.resource.resourceId, 'not_relevant')
    setDismissed(d => (d.includes(rec.resource.resourceId) ? d : [...d, rec.resource.resourceId]))
  }

  function outbound(rec: RecommendedResource) {
    if (trackingConsent) {
      trackRecommendationOutboundClick(rec.resource, {
        placement, trade: snapshot?.businessContext?.trade ?? null,
        state: snapshot?.businessContext?.region ?? null, consentGranted: true,
        disclosureShown: rec.disclosureStatus === 'required',
      })
    }
  }

  return (
    <section className="glass rounded-2xl p-5 space-y-3" aria-labelledby="rec-heading">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-brand-accent flex-shrink-0" />
        <h3 id="rec-heading" className="font-display text-base tracking-wide text-brand-white">{heading}</h3>
        <span className="ml-auto font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/50">Optional</span>
      </div>

      <ul className="space-y-2.5">
        {result.recommendations.map(rec => {
          const r = rec.resource
          const href = r.officialUrl ?? r.destinationPath ?? null
          const external = !!r.officialUrl
          const cColor = CONFIDENCE_COLOR[rec.confidence] ?? '#A8B8CC'
          return (
            <li key={r.resourceId} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-brand-white">{r.title}</p>
                  <p className="text-[11px] text-brand-silver/75 leading-relaxed mt-0.5">{rec.reason}</p>
                </div>
                <button type="button" onClick={() => dismiss(rec)} aria-label="Dismiss"
                  className="text-brand-silver/40 hover:text-brand-silver flex-shrink-0 touch-target">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Applicability + confidence + freshness chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wide"
                  style={{ background: `${cColor}22`, color: cColor }}>
                  {rec.confidence} fit
                </span>
                {rec.applicability.priority && <Chip>matches your focus</Chip>}
                {rec.applicability.trade && r.tradeApplicability.length > 0 && <Chip>your trade</Chip>}
                {rec.applicability.lifecycle && <Chip>your stage</Chip>}
                <span className="inline-flex items-center gap-1 text-[9px] text-brand-silver/55">
                  <Clock className="w-2.5 h-2.5" /> {FRESH_LABEL[rec.sourceFreshness] ?? 'verify'}
                </span>
              </div>

              {/* Disclosure (shown whenever required) */}
              {rec.disclosureStatus === 'required' && (
                <p className="text-[9px] text-brand-silver/45 leading-relaxed mt-2 flex items-start gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" /> {r.disclosureText}
                </p>
              )}

              {/* Actions row — subordinate link + optional feedback */}
              <div className="flex items-center gap-2 mt-2.5">
                {href && (
                  <a href={href} onClick={() => outbound(rec)}
                    target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-accent underline underline-offset-2">
                    {external ? 'Visit site' : 'Read guide'} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="ml-auto flex items-center gap-1.5">
                  <button type="button" onClick={() => feedback(rec, 'helpful')} aria-label="Helpful"
                    className="text-brand-silver/40 hover:text-brand-accent touch-target"><ThumbsUp className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => feedback(rec, 'not_helpful')} aria-label="Not helpful"
                    className="text-brand-silver/40 hover:text-brand-silver touch-target"><ThumbsDown className="w-3.5 h-3.5" /></button>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-[10px] text-brand-silver/45 leading-relaxed">
        Suggestions only — they never change your MetrixScore or priority. We have no active paid relationships;
        any future affiliate or sponsor relationships will be disclosed and never affect what we recommend.
      </p>
    </section>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(74,144,217,0.12)', color: '#9FC0E8' }}>
      {children}
    </span>
  )
}
