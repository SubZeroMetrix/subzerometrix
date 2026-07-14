'use client'

import { useState, useMemo } from 'react'

// Purely client-side. Nothing entered here is sent to any server, stored,
// or tracked -- all math happens in the browser and is discarded on page
// leave. No external API dependency, no fabricated industry defaults; the
// user supplies every input.

function parseNonNegative(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

const URGENCY_OPTIONS = [
  { value: '3', label: 'High -- time-sensitive or seasonal' },
  { value: '2', label: 'Medium -- normal priority' },
  { value: '1', label: 'Low -- no particular urgency' },
]

const RESPONSE_OPTIONS = [
  { value: '3', label: 'Never responded' },
  { value: '2', label: 'Responded once, went quiet' },
  { value: '1', label: 'Actively engaged' },
]

const LIKELIHOOD_OPTIONS = [
  { value: '3', label: 'Low -- unlikely to close' },
  { value: '2', label: 'Medium -- uncertain' },
  { value: '1', label: 'High -- likely to close' },
]

function bandFor(score: number): { label: string; action: string; className: string } {
  if (score >= 11) {
    return {
      label: 'Urgent',
      action: 'Follow up today. This estimate is old, the customer has gone quiet, and the value or urgency is high enough that losing it is costly.',
      className: 'text-red-700 bg-red-50 border-red-200',
    }
  }
  if (score >= 7) {
    return {
      label: 'High Priority',
      action: 'Follow up within 1-2 business days. Enough risk factors are stacking up that this shouldn’t wait for a routine follow-up cycle.',
      className: 'text-amber-700 bg-amber-50 border-amber-200',
    }
  }
  if (score >= 4) {
    return {
      label: 'Standard',
      action: 'Follow up on your normal cadence. Nothing here suggests this estimate needs to jump the queue.',
      className: 'text-blue-700 bg-blue-50 border-blue-200',
    }
  }
  return {
    label: 'Low Priority',
    action: 'Low risk of loss right now. Keep it on the normal follow-up schedule and revisit if circumstances change.',
    className: 'text-gray-700 bg-gray-50 border-gray-200',
  }
}

export function EstimateFollowUpPriorityCalculator() {
  const [estimateValue, setEstimateValue] = useState('')
  const [ageDays, setAgeDays] = useState('')
  const [lastContactDays, setLastContactDays] = useState('')
  const [urgency, setUrgency] = useState('2')
  const [responseStatus, setResponseStatus] = useState('2')
  const [closeLikelihoodRisk, setCloseLikelihoodRisk] = useState('2')

  const inputs = useMemo(
    () => ({
      estimateValue: parseNonNegative(estimateValue),
      ageDays: parseNonNegative(ageDays),
      lastContactDays: parseNonNegative(lastContactDays),
    }),
    [estimateValue, ageDays, lastContactDays]
  )

  const hasError =
    (estimateValue !== '' && inputs.estimateValue === null) ||
    (ageDays !== '' && inputs.ageDays === null) ||
    (lastContactDays !== '' && inputs.lastContactDays === null)

  const canCalculate =
    inputs.estimateValue !== null && inputs.ageDays !== null && inputs.lastContactDays !== null

  const result = useMemo(() => {
    if (!canCalculate) return null

    const age = inputs.ageDays ?? 0
    const lastContact = inputs.lastContactDays ?? 0
    const value = inputs.estimateValue ?? 0

    // Each factor contributes 1-3 points; value is scored in tiers rather
    // than a raw multiplier so a single large estimate doesn't dominate
    // the score independent of how urgent or stale it actually is.
    const ageScore = age >= 14 ? 3 : age >= 7 ? 2 : 1
    const contactScore = lastContact >= 7 ? 3 : lastContact >= 3 ? 2 : 1
    const valueScore = value >= 10000 ? 3 : value >= 2500 ? 2 : 1
    const urgencyScore = Number(urgency)
    const responseScore = Number(responseStatus)
    const likelihoodScore = Number(closeLikelihoodRisk)

    const totalScore = ageScore + contactScore + valueScore + urgencyScore + responseScore + likelihoodScore

    return {
      ageScore,
      contactScore,
      valueScore,
      urgencyScore,
      responseScore,
      likelihoodScore,
      totalScore,
      band: bandFor(totalScore),
    }
  }, [inputs, canCalculate, urgency, responseStatus, closeLikelihoodRisk])

  return (
    <div className="card-panel">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="estimate-value" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Estimate value ($)
            </label>
            <input
              id="estimate-value"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={estimateValue}
              onChange={(e) => setEstimateValue(e.target.value)}
              placeholder="e.g. 4500"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="age-days" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Estimate age (days)
            </label>
            <input
              id="age-days"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={ageDays}
              onChange={(e) => setAgeDays(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="last-contact-days" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Days since last customer contact
            </label>
            <input
              id="last-contact-days"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={lastContactDays}
              onChange={(e) => setLastContactDays(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="urgency" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Job urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            >
              {URGENCY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="response-status" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Customer response status
            </label>
            <select
              id="response-status"
              value={responseStatus}
              onChange={(e) => setResponseStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            >
              {RESPONSE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="close-likelihood" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Expected likelihood of closing
            </label>
            <select
              id="close-likelihood"
              value={closeLikelihoodRisk}
              onChange={(e) => setCloseLikelihoodRisk(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            >
              {LIKELIHOOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {hasError && (
          <p role="alert" className="text-sm text-red-600">
            Please enter valid, non-negative numbers for estimate value, age, and days since contact.
          </p>
        )}
      </form>

      <div className="mt-8 pt-8 border-t border-surface-border" aria-live="polite">
        {!canCalculate ? (
          <p className="text-gray-500 text-sm">Enter estimate value, age, and days since contact to see a priority score.</p>
        ) : (
          <>
            <div className={`rounded-lg border p-5 mb-6 ${result!.band.className}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1">Priority: {result!.band.label}</p>
              <p className="text-sm leading-relaxed">{result!.band.action}</p>
            </div>
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer font-semibold text-gray-700">How this score is calculated</summary>
              <ul className="mt-3 space-y-1.5 pl-4 list-disc">
                <li>Estimate age: {result!.ageScore} of 3 points</li>
                <li>Days since contact: {result!.contactScore} of 3 points</li>
                <li>Estimate value tier: {result!.valueScore} of 3 points</li>
                <li>Job urgency: {result!.urgencyScore} of 3 points</li>
                <li>Customer response status: {result!.responseScore} of 3 points</li>
                <li>Close-likelihood risk: {result!.likelihoodScore} of 3 points</li>
                <li className="font-semibold text-gray-700">Total score: {result!.totalScore} of 18</li>
              </ul>
            </details>
          </>
        )}
        <p className="text-xs text-gray-600 mt-6">
          This score is a prioritization aid based on the inputs you provide, not a guarantee of any outcome.
          Nothing you enter here is sent to a server, stored, or tracked.
        </p>
      </div>
    </div>
  )
}
