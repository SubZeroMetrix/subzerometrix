'use client'

import { useState } from 'react'
import { trackLandingEvent } from '@/lib/landing-events'

export function HelpFeedbackWidget({ articleId, route }: { articleId: string; route: string }) {
  const [choice, setChoice] = useState<'helpful' | 'unhelpful' | null>(null)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function submit(rating: 'helpful' | 'unhelpful') {
    setChoice(rating)
    setStatus('submitting')
    try {
      const res = await fetch('/api/help-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: rating === 'helpful' ? 'helpful_answer' : 'unhelpful_answer',
          route,
          helpArticleId: articleId,
          rating,
        }),
      })
      if (!res.ok) throw new Error('failed')
      trackLandingEvent(rating === 'helpful' ? 'help_answer_helpful' : 'help_answer_not_helpful', undefined, articleId)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/help-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'missing_information',
          route,
          helpArticleId: articleId,
          comment,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" aria-live="polite" className="text-sm text-gray-600">
        Thanks for the feedback — this helps us improve the Help Center.
      </p>
    )
  }

  return (
    <div className="border-t border-surface-border pt-6 mt-8">
      <p className="text-sm font-semibold text-gray-700 mb-3">Was this answer helpful?</p>
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => submit('helpful')}
          disabled={status === 'submitting'}
          aria-pressed={choice === 'helpful'}
          className="btn-secondary text-sm disabled:opacity-50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => submit('unhelpful')}
          disabled={status === 'submitting'}
          aria-pressed={choice === 'unhelpful'}
          className="btn-secondary text-sm disabled:opacity-50"
        >
          No
        </button>
      </div>

      {choice === 'unhelpful' && (
        <form onSubmit={submitComment} className="space-y-3">
          <label htmlFor="help-feedback-comment" className="block text-sm text-gray-600">
            What were you looking for? (optional)
          </label>
          <textarea
            id="help-feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
          />
          <button type="submit" disabled={status === 'submitting'} className="btn-secondary text-sm disabled:opacity-50">
            Send feedback
          </button>
        </form>
      )}

      {status === 'error' && <p className="text-sm text-red-600 mt-2">Something went wrong. Please try again.</p>}
    </div>
  )
}
