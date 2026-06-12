'use client'

// ─────────────────────────────────────────────────────────────────────────────
// GrowthEventTracker — fire one device-local activation event on mount (Growth-6)
// ─────────────────────────────────────────────────────────────────────────────
// Renders nothing. Records one non-PII activation milestone on mount (device-local +
// the no-op trackEvent stub). NEVER collects PII, NEVER calls external services.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { trackGrowthEvent, getGrowthSourceContext, type ActivationMilestone } from '@/lib/growthAnalytics'

export default function GrowthEventTracker({
  milestone, language,
}: { milestone: ActivationMilestone; language?: 'en' | 'es' }) {
  useEffect(() => {
    try {
      const ctx = getGrowthSourceContext()
      const lang = language ?? ctx.language
      trackGrowthEvent('activation_milestone_reached', {
        milestone,
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        source: ctx.source,
        channel: ctx.channel,
        language: lang,
        locale: lang === 'es' ? 'es-US' : 'en-US',
      })
    } catch {
      // analytics must never break the page
    }
  }, [milestone, language])

  return null
}
