'use client'

// ─────────────────────────────────────────────────────────────────────────────
// resources/ResourceFeedbackControl — Wave 7 CP7: optional, privacy-safe resource feedback
// ─────────────────────────────────────────────────────────────────────────────
// Optional feedback on a directory/recommendation resource. It reuses the EXISTING Wave 5
// device-local feedback store (recordResourceFeedback → szm_resource_feedback, export/delete
// covered) and the EXISTING consent-gated attribution funnel — no new feedback or analytics
// system. Feedback is optional, never pressures positive responses, has NO effect on MetrixScore,
// and creates no testimonial. The persisted entry carries no PII.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  recordResourceFeedback, RESOURCE_FEEDBACK_TYPES, type ResourceFeedbackType,
} from '@/lib/metrix/resourceFeedback'
import { trackFeedbackFields } from '@/lib/metrix/resourceAttribution'

// The neutral, non-leading option set (no positivity bias). Mirrors the canonical feedback types.
const OPTIONS: { type: ResourceFeedbackType; label: string }[] = [
  { type: 'helpful', label: 'Helpful' },
  { type: 'not_helpful', label: 'Not helpful' },
  { type: 'already_completed', label: 'Already completed' },
  { type: 'not_relevant', label: 'Not relevant' },
  { type: 'selected_provider', label: 'Chose this provider' },
  { type: 'broken', label: 'Broken link' },
  { type: 'outdated', label: 'Outdated' },
  { type: 'outcome_achieved', label: 'Got the outcome' },
  { type: 'outcome_not_achieved', label: 'Didn’t get the outcome' },
]

export default function ResourceFeedbackControl({
  resourceId,
  vendorId = null,
  placement = 'resource_directory',
  trackingConsent = false,
}: {
  resourceId: string
  vendorId?: string | null
  placement?: string
  trackingConsent?: boolean
}) {
  const [submitted, setSubmitted] = useState<ResourceFeedbackType | null>(null)

  function submit(type: ResourceFeedbackType) {
    if (!(RESOURCE_FEEDBACK_TYPES as string[]).includes(type)) return
    recordResourceFeedback(resourceId, type)             // device-local; never touches MetrixScore
    trackFeedbackFields(resourceId, vendorId, placement, type, trackingConsent) // consent-gated
    setSubmitted(type)
  }

  if (submitted) {
    return (
      <p className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 mt-1" role="status">
        <Check className="w-3 h-3" aria-hidden="true" /> Thanks — your feedback is saved on this device.
      </p>
    )
  }

  return (
    <div className="mt-2">
      <p className="text-[10px] font-mono tracking-wider uppercase text-brand-silver/60 mb-1.5">Feedback (optional)</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Resource feedback">
        {OPTIONS.map(o => (
          <button
            key={o.type}
            type="button"
            onClick={() => submit(o.type)}
            className="rounded-full border border-brand-silver/20 px-2.5 py-1 text-[11px] text-brand-silver hover:text-brand-white hover:border-brand-accent/50 transition-colors touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
