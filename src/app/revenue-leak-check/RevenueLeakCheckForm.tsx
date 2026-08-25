'use client'

import { useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { TrackedCta } from '@/components/TrackedCta'
import { QUESTIONS, scoreLeakCheck, type Answer, type LeakCheckResult } from '@/lib/revenueLeakCheck'

const TRADES = ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Landscaping', 'General Contracting', 'Other service business']

export function RevenueLeakCheckForm() {
  const [trade, setTrade] = useState('')
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState<LeakCheckResult | null>(null)

  function setAnswer(id: string, value: Answer) {
    if (!started) { setStarted(true); track('revenue_leak_check_start', {}) }
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.id])

  function handleSubmit() {
    const r = scoreLeakCheck(answers)
    setResult(r)
    track('revenue_leak_check_complete', { trade, primary_signal: r.primaryCategory.id })
    track('primary_signal_viewed', { primary_signal: r.primaryCategory.id })
  }

  if (result) {
    return (
      <div className="space-y-8">
        <div className="card-panel">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Primary signal</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{result.primaryCategory.title}</h2>
          <p className="text-gray-600">{result.primaryCategory.whatItMeans}</p>
        </div>

        <div className="card-panel">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Recommended first action</p>
          <p className="text-gray-700">{result.primaryCategory.firstAction}</p>
        </div>

        {result.verifiedGapQuestions.length > 0 && (
          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Verified gaps (from your answers)</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {result.verifiedGapQuestions.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </div>
        )}

        {result.unknownQuestions.length > 0 && (
          <div className="card-panel border-amber-300 bg-amber-50">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Unknown — worth measuring next</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-800">
              {result.unknownQuestions.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card-panel">
            <p className="font-semibold text-gray-900 mb-2">Fix it yourself</p>
            <p className="text-sm text-gray-500 mb-4">Use the free resources in the Revenue Leak Library.</p>
            <Link href="/resources" className="btn-secondary w-full text-center block" onClick={() => track('resource_download', { source: 'leak-check-result' })}>Browse resources</Link>
          </div>
          <div className="card-panel">
            <p className="font-semibold text-gray-900 mb-2">Software for this workflow</p>
            <p className="text-sm text-gray-500 mb-4">Modern Trades CRM handles this nationally, no consulting required.</p>
            <Link href="/modern-trades-crm" className="btn-secondary w-full text-center block" onClick={() => track('modern_trades_crm_click', { source: 'leak-check-result' })}>See Modern Trades CRM</Link>
          </div>
          <div className="card-panel">
            <p className="font-semibold text-gray-900 mb-2">Hands-on help (Pinellas Co.)</p>
            <p className="text-sm text-gray-500 mb-4">The Modern Trades Mentor implements this directly, locally.</p>
            <TrackedCta href="/contact?subject=Revenue+Leak+Check+follow-up" event="tmt_local_click" source="leak-check-result" className="btn-secondary w-full text-center block">Ask TMT</TrackedCta>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="card-panel">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Your trade (optional)</span>
          <select value={trade} onChange={(e) => setTrade(e.target.value)} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select a trade</option>
            {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      {QUESTIONS.map((q) => (
        <div key={q.id} className="card-panel">
          <p className="text-gray-800 font-medium mb-4">{q.text}</p>
          <div className="flex gap-3">
            {(['yes', 'no', 'unsure'] as Answer[]).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAnswer(q.id, val)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  answers[q.id] === val
                    ? 'bg-brand-electric text-white border-brand-electric'
                    : 'border-gray-300 text-gray-600 hover:border-brand-electric hover:text-brand-electric'
                }`}
              >
                {val === 'yes' ? 'Yes' : val === 'no' ? 'No' : 'Not sure'}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} disabled={!allAnswered} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
        {allAnswered ? 'See my result' : `Answer all ${QUESTIONS.length} questions to continue`}
      </button>
    </div>
  )
}
