// ─────────────────────────────────────────────────────────────────────────────
// contractorNeeds — Build 3: canonical contractor-needs taxonomy + direction map
// ─────────────────────────────────────────────────────────────────────────────
// Non-breaking, additive. Defines the full contractor-needs taxonomy, maps each need to
// its MetrixScore™ category, records whether the current free assessment discovers it, and
// points each need to the feature that addresses it (Foundation Builder / Growth Engine /
// resources / re-score). It does NOT change scoring math or assessment IDs — it documents
// and operationalizes the gap-to-action direction for future use and for the UI.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixCategory } from './metrixEngine'

export type NeedLayer =
  | 'foundation' | 'financial' | 'acquisition' | 'sales' | 'brand'
  | 'retention' | 'cross_sell' | 'operations' | 'team' | 'technology'
  | 'capacity' | 'outcome'

// Where a need is currently discovered today.
export type NeedDiscovery =
  | 'assessment'        // the free 8-question Starter assessment probes this
  | 'growth_engine'     // Product-6 growth inputs discover this
  | 'foundation_builder'// surfaced as a Foundation Builder step/category
  | 'not_discovered'    // GAP: nothing currently asks the user about this

// Which feature acts on the need.
export type NeedDirection =
  | 'foundation_builder' | 'growth_engine' | 'resources' | 'report' | 'reassess'

export interface ContractorNeed {
  id: string
  layer: NeedLayer
  label: string
  scoreCategory: MetrixCategory
  discovery: NeedDiscovery
  direction: NeedDirection
}

export const NEED_LAYER_LABELS: Record<NeedLayer, string> = {
  foundation: 'Foundation', financial: 'Financial', acquisition: 'Customer acquisition',
  sales: 'Sales', brand: 'Brand / reputation', retention: 'Retention', cross_sell: 'Cross-sell',
  operations: 'Operations', team: 'Team / leadership', technology: 'Technology / data',
  capacity: 'Capacity / scalability', outcome: 'Outcome intelligence',
}

// ── Canonical needs taxonomy (condensed; one representative need per area) ───────
export const CONTRACTOR_NEEDS: ContractorNeed[] = [
  { id: 'need-entity', layer: 'foundation', label: 'Entity / licensing / insurance setup', scoreCategory: 'business_foundation', discovery: 'assessment', direction: 'foundation_builder' },
  { id: 'need-compliance', layer: 'foundation', label: 'Compliance / documentation', scoreCategory: 'business_foundation', discovery: 'foundation_builder', direction: 'foundation_builder' },
  { id: 'need-pricing', layer: 'financial', label: 'Pricing / margin / job costing', scoreCategory: 'financial_control', discovery: 'assessment', direction: 'growth_engine' },
  { id: 'need-cashflow', layer: 'financial', label: 'Cash flow / overhead / controls', scoreCategory: 'financial_control', discovery: 'assessment', direction: 'foundation_builder' },
  { id: 'need-leads', layer: 'acquisition', label: 'Lead channels / local visibility', scoreCategory: 'sales_marketing', discovery: 'assessment', direction: 'growth_engine' },
  { id: 'need-attribution', layer: 'acquisition', label: 'Marketing attribution', scoreCategory: 'sales_marketing', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-response', layer: 'sales', label: 'Lead response / missed calls', scoreCategory: 'sales_marketing', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-close', layer: 'sales', label: 'Close rate / estimate follow-up', scoreCategory: 'sales_marketing', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-gbp', layer: 'brand', label: 'Google Business Profile / listings', scoreCategory: 'customer_experience', discovery: 'foundation_builder', direction: 'growth_engine' },
  { id: 'need-reviews', layer: 'brand', label: 'Reviews / local reputation', scoreCategory: 'customer_experience', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-repeat', layer: 'retention', label: 'Repeat customers / follow-up', scoreCategory: 'customer_experience', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-referral', layer: 'retention', label: 'Referral / reactivation system', scoreCategory: 'customer_experience', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-recurring', layer: 'cross_sell', label: 'Recurring revenue / agreements', scoreCategory: 'growth_risk', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-crosssell', layer: 'cross_sell', label: 'Cross-sell / service menu', scoreCategory: 'growth_risk', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-ops', layer: 'operations', label: 'Scheduling / dispatch / estimating', scoreCategory: 'operations', discovery: 'foundation_builder', direction: 'foundation_builder' },
  { id: 'need-sops', layer: 'operations', label: 'SOPs / quality / callbacks', scoreCategory: 'operations', discovery: 'not_discovered', direction: 'foundation_builder' },
  { id: 'need-hiring', layer: 'team', label: 'Hiring / onboarding / training', scoreCategory: 'people_leadership', discovery: 'not_discovered', direction: 'resources' },
  { id: 'need-leadership', layer: 'team', label: 'Delegation / management / capacity of owner', scoreCategory: 'people_leadership', discovery: 'not_discovered', direction: 'resources' },
  { id: 'need-tech', layer: 'technology', label: 'CRM / field service / accounting tools', scoreCategory: 'operations', discovery: 'not_discovered', direction: 'resources' },
  { id: 'need-security', layer: 'technology', label: 'Passwords / 2FA / data basics', scoreCategory: 'operations', discovery: 'foundation_builder', direction: 'foundation_builder' },
  { id: 'need-capacity', layer: 'capacity', label: 'Capacity vs. demand / scalability', scoreCategory: 'growth_risk', discovery: 'growth_engine', direction: 'growth_engine' },
  { id: 'need-outcome', layer: 'outcome', label: 'KPI tracking / momentum / re-scoring', scoreCategory: 'growth_risk', discovery: 'growth_engine', direction: 'reassess' },
]

export function getContractorNeeds(): ContractorNeed[] { return CONTRACTOR_NEEDS }

/** Needs NOT currently discovered by any input — the assessment coverage gaps. */
export function getUndiscoveredNeeds(): ContractorNeed[] {
  return CONTRACTOR_NEEDS.filter(n => n.discovery === 'not_discovered')
}

/** Direction (which feature) for a given MetrixScore™ category gap. */
export function getDirectionForCategory(category: MetrixCategory): NeedDirection[] {
  const dirs = new Set<NeedDirection>()
  for (const n of CONTRACTOR_NEEDS) if (n.scoreCategory === category) dirs.add(n.direction)
  return Array.from(dirs)
}
