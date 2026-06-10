'use client'

import { useState } from 'react'
import { MessageSquare, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import {
  ACCURACY_OPTIONS, saveFeedback,
  type AccuracyRating, type FeedbackContext,
} from '@/lib/feedback'
import { trackEvent } from '@/lib/analytics'

export default function FeedbackBox({ context }: { context: FeedbackContext }) {
  const [rating, setRating] = useState<AccuracyRating | ''>('')
  const [whatMissing, setWhatMissing] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function selectRating(value: AccuracyRating) {
    setRating(value)
    trackEvent('feedback_rating_selected', { rating: value })
  }

  function handleSubmit() {
    if (!rating) return
    saveFeedback({
      ...context,
      rating,
      whatMissing: whatMissing.trim(),
      submittedAt: new Date().toISOString(),
    })
    trackEvent('feedback_submitted', { rating, hasNote: whatMissing.trim().length > 0 })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="glass rounded-2xl p-5 mb-6 mt-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#1D9E75' }} />
        <p className="text-[13px] text-brand-white leading-snug">
          Thanks — your feedback helps us sharpen the MetrixScore.
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-5 mb-6 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-brand-accent flex-shrink-0" />
        <h3 className="text-[14px] font-semibold text-brand-white">Did this result feel accurate?</h3>
      </div>

      {/* Accuracy options */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ACCURACY_OPTIONS.map(opt => {
          const active = rating === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectRating(opt.value)}
              className={clsx(
                'px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all touch-target border text-left',
                active
                  ? 'bg-brand-accent border-brand-accent text-white shadow-glow-blue'
                  : 'glass border-transparent text-brand-silver hover:text-brand-white hover:border-brand-silver/30'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* What felt missing */}
      <label className="block text-[10px] tracking-widest uppercase text-brand-silver font-mono mb-1.5">
        What felt missing?
      </label>
      <textarea
        value={whatMissing}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWhatMissing(e.target.value)}
        placeholder="Anything we got wrong or left out…"
        rows={3}
        className="w-full px-3.5 py-3 rounded-xl text-sm glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent resize-none mb-4"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!rating}
        className={clsx(
          'w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase transition-all touch-target',
          rating
            ? 'bg-brand-accent text-white shadow-glow-blue active:scale-[0.98]'
            : 'bg-brand-blue text-brand-silver/40 cursor-not-allowed'
        )}
      >
        Send Feedback
      </button>
    </div>
  )
}
