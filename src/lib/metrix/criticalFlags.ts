// ─────────────────────────────────────────────────────────────────────────────
// metrix/criticalFlags — Module 4: initial critical-flag candidates (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Produces explainable CANDIDATE flags from the normalized answers + signals. This is
// the STRUCTURE that SZM-2 will turn into hard critical-gate policy — it intentionally
// does NOT decide pass/block here. Each candidate carries its basis so the decision is
// explainable. Pure and deterministic.
// ─────────────────────────────────────────────────────────────────────────────

import type { NormalizedAssessment, ProfileSignals, CriticalFlagCandidate } from './profileTypes'

export function deriveCriticalFlagCandidates(
  normalized: NormalizedAssessment,
  signals: ProfileSignals,
): CriticalFlagCandidate[] {
  const out: CriticalFlagCandidate[] = []
  const a = normalized.rawAnswers
  const setup = a.setup_steps ?? []
  const has = (id: string) => setup.includes(id)
  const isNone = has('none_yet')
  const choice = (id: string) => signals.choices[id]

  // Foundation blockers (candidates — SZM-2 decides if these gate).
  if (choice('entity_registration') === 'not_started' || (isNone && !has('entity_reg'))) {
    out.push({ id: 'no_entity', label: 'Business entity not registered', category: 'business_foundation', severity: 'blocker_candidate', basis: 'Setup answers show no registered entity.' })
  }
  if (!has('insurance') && !isNone) {
    out.push({ id: 'no_insurance', label: 'Insurance not started', category: 'business_foundation', severity: 'watch', basis: 'Insurance was not selected in the foundation setup answers.' })
  }
  if (a.blocker === 'licensing' || choice('licensing_insurance') === 'not_started') {
    out.push({ id: 'licensing_uncertain', label: 'Licensing / compliance uncertain', category: 'business_foundation', severity: 'watch', basis: 'Licensing was flagged as a blocker or shows no progress.' })
  }

  // Financial dependency (candidate).
  if (a.financial === 'need_funding' || a.financial === 'not_sure') {
    out.push({ id: 'funding_dependency', label: 'Funding / cost not yet defined', category: 'financial_control', severity: 'watch', basis: 'Financial answer indicates funding dependency or unknown startup cost.' })
  }

  // Acquisition blocker (candidate).
  if (a.customer_plan === 'no_plan' || choice('lead_generation') === 'not_started') {
    out.push({ id: 'no_customer_plan', label: 'No customer-acquisition path', category: 'sales_marketing', severity: 'blocker_candidate', basis: 'No customer plan was selected.' })
  }

  return out
}
