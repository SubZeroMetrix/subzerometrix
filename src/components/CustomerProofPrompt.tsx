'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CustomerProofPrompt — low-pressure, consent-first feedback (Growth-4)
// ─────────────────────────────────────────────────────────────────────────────
// Asks "Was this useful?" and routes by band: positive offers an OPTIONAL, consent-
// first testimonial/case-study interest; neutral asks how to improve; negative routes
// privately. NO public review posting, NO incentives, NO positive-only gating, NO use
// of a user's words without explicit permission. Dismissible; shows once per device.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { MessageSquare, X, ThumbsUp, Meh, ThumbsDown, Check } from 'lucide-react'
import {
  getCustomerProofPrompt, getReviewRoutingRecommendation, getTestimonialConsentCopy,
  shouldShowCustomerProofPrompt, type CustomerProofTrigger, type CustomerFeedbackScore,
} from '@/lib/customerProof'
import { trackEvent } from '@/lib/analytics'

const DISMISS_KEY = 'szm_proof_dismissed'

export default function CustomerProofPrompt({ trigger }: { trigger: CustomerProofTrigger }) {
  const [visible, setVisible] = useState(false)
  const [score, setScore] = useState<CustomerFeedbackScore | null>(null)
  const [testimonialChoice, setTestimonialChoice] = useState<'yes' | 'no' | null>(null)

  const prompt = getCustomerProofPrompt(trigger)
  const consent = getTestimonialConsentCopy()

  useEffect(() => {
    let dismissed = false
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1' } catch {}
    if (shouldShowCustomerProofPrompt(trigger, { alreadyDismissed: dismissed })) {
      setVisible(true)
      trackEvent('feedback_prompt_viewed', { trigger })
    }
  }, [trigger])

  function dismiss() {
    setVisible(false)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
  }

  function selectScore(value: CustomerFeedbackScore) {
    setScore(value)
    trackEvent('feedback_score_selected', { trigger, score: value })
    if (value === 'negative') {
      // Negative feedback is product/support signal — private, never public.
      trackEvent('product_feedback_submitted', { trigger, score: value })
    }
  }

  function chooseTestimonial(choice: 'yes' | 'no') {
    setTestimonialChoice(choice)
    if (choice === 'yes') {
      trackEvent('testimonial_interest_selected', { trigger })
      trackEvent('case_study_interest_selected', { trigger })
    }
  }

  if (!visible) return null

  const routing = score ? getReviewRoutingRecommendation(score) : null

  return (
    <section className="rounded-2xl p-5" style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.25)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" style={{ color: '#3FBE93' }} />
          <h3 className="text-[14px] font-semibold text-brand-white">{prompt.question}</h3>
        </div>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-brand-silver/50 hover:text-brand-silver touch-target">
          <X className="w-4 h-4" />
        </button>
      </div>

      {!score && (
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => selectScore('positive')}
            className="flex flex-col items-center gap-1 py-3 rounded-xl glass text-brand-silver hover:text-brand-white transition-colors touch-target">
            <ThumbsUp className="w-4 h-4" /> <span className="text-[11px]">Yes</span>
          </button>
          <button type="button" onClick={() => selectScore('neutral')}
            className="flex flex-col items-center gap-1 py-3 rounded-xl glass text-brand-silver hover:text-brand-white transition-colors touch-target">
            <Meh className="w-4 h-4" /> <span className="text-[11px]">Somewhat</span>
          </button>
          <button type="button" onClick={() => selectScore('negative')}
            className="flex flex-col items-center gap-1 py-3 rounded-xl glass text-brand-silver hover:text-brand-white transition-colors touch-target">
            <ThumbsDown className="w-4 h-4" /> <span className="text-[11px]">Not really</span>
          </button>
        </div>
      )}

      {routing && (
        <div className="mt-1">
          <p className="text-[12px] text-brand-silver leading-relaxed">{routing.message}</p>

          {/* Positive → optional, consent-first testimonial/case-study interest */}
          {score === 'positive' && testimonialChoice === null && (
            <div className="mt-3">
              <p className="text-[12px] text-brand-white leading-relaxed mb-2">{prompt.testimonialQuestion}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => chooseTestimonial('yes')}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
                  Yes, I am open to it
                </button>
                <button type="button" onClick={() => chooseTestimonial('no')}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-medium glass text-brand-silver hover:text-brand-white transition-colors touch-target">
                  {consent.decline}
                </button>
              </div>
              <p className="text-[10px] text-brand-silver/50 leading-relaxed mt-2">{consent.noPublicWithoutPermission}</p>
            </div>
          )}

          {score === 'positive' && testimonialChoice === 'yes' && (
            <p className="inline-flex items-center gap-1 text-[12px] mt-2" style={{ color: '#3FBE93' }}>
              <Check className="w-3.5 h-3.5" /> Thank you — we will only reach out with your permission.
            </p>
          )}
          {score === 'positive' && testimonialChoice === 'no' && (
            <p className="text-[12px] text-brand-silver mt-2">No problem — thank you for the feedback.</p>
          )}

          {/* Neutral / negative → acknowledgement; no public routing */}
          {score !== 'positive' && (
            <p className="text-[10px] text-brand-silver/50 leading-relaxed mt-2">
              Thanks for helping us improve. This is private and is never posted publicly.
            </p>
          )}
        </div>
      )}

      <p className="text-[10px] text-brand-silver/40 leading-relaxed mt-3">{prompt.disclosure}</p>
    </section>
  )
}
