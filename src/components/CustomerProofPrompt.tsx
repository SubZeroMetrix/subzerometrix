'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CustomerProofPrompt — ACTIVE, consent-first feedback (Growth-4)
// ─────────────────────────────────────────────────────────────────────────────
// Active in-app feedback: a usefulness rating, optional private written feedback,
// and an OPTIONAL, consent-first "open to a testimonial/case study later" choice.
// Feedback is saved on THIS DEVICE only (matches the szm_* localStorage pattern).
// It is NEVER sent externally, NEVER posted publicly, and is NEVER a public review.
// Testimonial interest is intent only — explicit consent is required before any use.
// Low pressure and dismissible; shows once per device.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { MessageSquare, X, ThumbsUp, Meh, ThumbsDown, Check } from 'lucide-react'
import {
  getCustomerProofPrompt, getReviewRoutingRecommendation, getTestimonialConsentCopy,
  shouldShowCustomerProofPrompt, createCustomerFeedbackRecord, saveCustomerFeedbackLocal,
  type CustomerProofTrigger, type CustomerFeedbackScore,
} from '@/lib/customerProof'
import { trackEvent } from '@/lib/analytics'

const DISMISS_KEY = 'szm_proof_dismissed'

type Step = 'rate' | 'form' | 'done'

export default function CustomerProofPrompt({ trigger }: { trigger: CustomerProofTrigger }) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<Step>('rate')
  const [score, setScore] = useState<CustomerFeedbackScore | null>(null)
  const [comment, setComment] = useState('')
  const [openToProof, setOpenToProof] = useState(false)

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

  function markDismissed() {
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
  }

  function dismiss() {
    setVisible(false)
    markDismissed()
  }

  function selectScore(value: CustomerFeedbackScore) {
    setScore(value)
    trackEvent('feedback_score_selected', { trigger, score: value })
    setStep('form')
  }

  function handleSave() {
    if (!score) return
    const allowProof = score !== 'negative' && openToProof
    const record = createCustomerFeedbackRecord({
      trigger,
      score,
      comment,
      testimonialInterest: allowProof,
      caseStudyInterest: allowProof,
      contactLaterOk: allowProof,
    })
    saveCustomerFeedbackLocal(record)
    trackEvent('product_feedback_submitted', { trigger, score })
    if (allowProof) {
      trackEvent('testimonial_interest_selected', { trigger })
      trackEvent('case_study_interest_selected', { trigger })
    }
    setStep('done')
    markDismissed()
  }

  if (!visible) return null

  const routing = score ? getReviewRoutingRecommendation(score) : null
  const commentLabel = score === 'positive'
    ? 'Anything you would highlight? (optional)'
    : 'What would make SubZeroMetrix™ more useful for you? (optional)'

  return (
    <section className="rounded-2xl p-5" style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.25)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" style={{ color: '#3FBE93' }} />
          <h3 className="text-[14px] font-semibold text-brand-white">
            {step === 'done' ? 'Thank you' : prompt.question}
          </h3>
        </div>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-brand-silver/50 hover:text-brand-silver touch-target">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step 1 — rating */}
      {step === 'rate' && (
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

      {/* Step 2 — comment + optional consent */}
      {step === 'form' && routing && (
        <div className="space-y-3">
          <p className="text-[12px] text-brand-silver leading-relaxed">{routing.message}</p>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={commentLabel}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl text-[13px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />

          {score !== 'negative' && (
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={openToProof} onChange={e => setOpenToProof(e.target.checked)}
                className="mt-0.5 accent-brand-accent" />
              <span className="text-[12px] text-brand-silver leading-relaxed">{prompt.testimonialQuestion}</span>
            </label>
          )}

          {openToProof && (
            <p className="text-[10px] text-brand-silver/50 leading-relaxed">{consent.noPublicWithoutPermission}</p>
          )}

          <button type="button" onClick={handleSave}
            className="w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
            Save feedback
          </button>
          <p className="text-[10px] text-brand-silver/40 leading-relaxed">{prompt.disclosure}</p>
        </div>
      )}

      {/* Step 3 — confirmation */}
      {step === 'done' && (
        <div>
          <p className="inline-flex items-center gap-1.5 text-[13px] text-brand-white">
            <Check className="w-4 h-4" style={{ color: '#3FBE93' }} /> Thanks — feedback saved on this device.
          </p>
          {openToProof && (
            <p className="text-[11px] text-brand-silver leading-relaxed mt-1.5">
              We will only ever reach out, or use anything publicly, with your explicit permission.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
