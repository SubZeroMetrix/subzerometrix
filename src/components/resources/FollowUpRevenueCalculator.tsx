'use client'

import { useState, useMemo } from 'react'

// Purely client-side calculation. Nothing entered here is sent to any
// server, stored, or tracked -- all math happens in the browser and is
// discarded on page leave. No external API dependency, no financial
// defaults presented as industry benchmarks (every field starts blank;
// the user supplies every number).

function parseNonNegative(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

function parsePercent(value: string): number | null {
  const n = parseNonNegative(value)
  if (n === null) return null
  if (n > 100) return null
  return n
}

export function FollowUpRevenueCalculator() {
  const [openEstimates, setOpenEstimates] = useState('')
  const [avgEstimateValue, setAvgEstimateValue] = useState('')
  const [closeRate, setCloseRate] = useState('')
  const [overdueFollowups, setOverdueFollowups] = useState('')
  const [recoveryRate, setRecoveryRate] = useState('')

  const inputs = useMemo(
    () => ({
      openEstimates: parseNonNegative(openEstimates),
      avgEstimateValue: parseNonNegative(avgEstimateValue),
      closeRate: parsePercent(closeRate),
      overdueFollowups: parseNonNegative(overdueFollowups),
      recoveryRate: parsePercent(recoveryRate),
    }),
    [openEstimates, avgEstimateValue, closeRate, overdueFollowups, recoveryRate]
  )

  const hasError =
    (openEstimates !== '' && inputs.openEstimates === null) ||
    (avgEstimateValue !== '' && inputs.avgEstimateValue === null) ||
    (closeRate !== '' && inputs.closeRate === null) ||
    (overdueFollowups !== '' && inputs.overdueFollowups === null) ||
    (recoveryRate !== '' && inputs.recoveryRate === null)

  const canCalculate =
    inputs.openEstimates !== null &&
    inputs.avgEstimateValue !== null &&
    inputs.closeRate !== null &&
    inputs.overdueFollowups !== null &&
    inputs.recoveryRate !== null

  const result = useMemo(() => {
    if (!canCalculate) return null
    const pipelineValue = (inputs.openEstimates ?? 0) * (inputs.avgEstimateValue ?? 0)
    const estimatedCloseValue = pipelineValue * ((inputs.closeRate ?? 0) / 100)
    // Overdue follow-ups are valued at the same average estimate value,
    // since a follow-up that converts becomes a job at roughly that
    // average value -- a simplifying assumption, disclosed below.
    const overdueValue = (inputs.overdueFollowups ?? 0) * (inputs.avgEstimateValue ?? 0)
    const recoverableFromFollowups = overdueValue * ((inputs.recoveryRate ?? 0) / 100)
    return {
      pipelineValue,
      estimatedCloseValue,
      overdueValue,
      recoverableFromFollowups,
      totalRecoverable: estimatedCloseValue + recoverableFromFollowups,
    }
  }, [inputs, canCalculate])

  return (
    <div className="card-panel">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="open-estimates" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Number of open estimates
            </label>
            <input
              id="open-estimates"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={openEstimates}
              onChange={(e) => setOpenEstimates(e.target.value)}
              placeholder="e.g. 12"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="avg-estimate-value" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Average estimate value ($)
            </label>
            <input
              id="avg-estimate-value"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={avgEstimateValue}
              onChange={(e) => setAvgEstimateValue(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="close-rate" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Estimated close rate (%)
            </label>
            <input
              id="close-rate"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.1"
              value={closeRate}
              onChange={(e) => setCloseRate(e.target.value)}
              placeholder="e.g. 40"
              aria-describedby="close-rate-hint"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
            <p id="close-rate-hint" className="text-xs text-gray-500 mt-1">Your own historical rate, not an industry average.</p>
          </div>
          <div>
            <label htmlFor="overdue-followups" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Number of overdue follow-ups
            </label>
            <input
              id="overdue-followups"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={overdueFollowups}
              onChange={(e) => setOverdueFollowups(e.target.value)}
              placeholder="e.g. 8"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="recovery-rate" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Expected recovery rate on overdue follow-ups (%)
            </label>
            <input
              id="recovery-rate"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.1"
              value={recoveryRate}
              onChange={(e) => setRecoveryRate(e.target.value)}
              placeholder="e.g. 25"
              className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
            />
          </div>
        </div>

        {hasError && (
          <p role="alert" className="text-sm text-red-600">
            Please enter valid numbers (percentages between 0 and 100, no negative values).
          </p>
        )}
      </form>

      <div className="mt-8 pt-8 border-t border-surface-border" aria-live="polite">
        {!canCalculate ? (
          <p className="text-gray-500 text-sm">Enter all five values above to see your estimate.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Potential Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">${result!.pipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Estimated Recoverable Revenue</p>
                <p className="text-3xl font-bold text-brand-electric">${result!.totalRecoverable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer font-semibold text-gray-700">How this is calculated</summary>
              <ul className="mt-3 space-y-1.5 pl-4 list-disc">
                <li>Pipeline value = open estimates &times; average estimate value = ${result!.pipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                <li>Estimated close value = pipeline value &times; close rate = ${result!.estimatedCloseValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                <li>Overdue follow-up value = overdue follow-ups &times; average estimate value = ${result!.overdueValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                <li>Recoverable from follow-ups = overdue follow-up value &times; recovery rate = ${result!.recoverableFromFollowups.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
              </ul>
            </details>
          </>
        )}
        <p className="text-xs text-gray-600 mt-6">
          This is an estimate based on the numbers you enter, not a guarantee. Actual results depend on your
          business, market, and follow-through. Nothing you enter here is sent to a server, stored, or tracked.
        </p>
      </div>
    </div>
  )
}
