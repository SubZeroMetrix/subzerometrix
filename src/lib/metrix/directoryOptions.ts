// ─────────────────────────────────────────────────────────────────────────────
// metrix/directoryOptions — Wave 7 Checkpoint 6: public directory filter options
// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, canonical option lists for the public Resource Directory filters (category,
// trade, region/state, lifecycle stage, relationship type). Derived from the existing canonical
// enums (ECOSYSTEM_CATEGORIES, CANONICAL_TRADE_IDS, CANONICAL_STATE_IDS, LIFECYCLE_STAGE_ORDER,
// ResourceRelationshipStatus) so the filter UI is stable and complete even while the published
// catalog is empty. Pure data + a small label helper; no React, no I/O.
// ─────────────────────────────────────────────────────────────────────────────

import { ECOSYSTEM_CATEGORIES, type EcosystemCategory } from './resourceEcosystem'
import { CANONICAL_TRADE_IDS } from './trades'
import { CANONICAL_STATE_IDS } from './states'
import { LIFECYCLE_STAGE_ORDER, LIFECYCLE_STAGE_LABELS, type LifecycleStage } from './lifecycle'
import type { ResourceRelationshipStatus } from './resourceTypes'

export const DIRECTORY_OPTIONS_VERSION = 1

export interface FilterOption<T extends string> { value: T; label: string }

/** Title-case a snake_case canonical category id for display. */
export function humanizeCategory(c: string): string {
  return String(c)
    .split('_')
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export const DIRECTORY_CATEGORY_OPTIONS: FilterOption<EcosystemCategory>[] =
  ECOSYSTEM_CATEGORIES.map(c => ({ value: c, label: humanizeCategory(c) }))

const TRADE_LABELS: Record<string, string> = {
  hvac: 'HVAC', electrical: 'Electrical', plumbing: 'Plumbing', handyman: 'Handyman',
  landscaping: 'Landscaping', painting: 'Painting', roofing: 'Roofing', solar: 'Solar',
  construction: 'Construction', cleaning: 'Cleaning',
}
export const DIRECTORY_TRADE_OPTIONS: FilterOption<string>[] =
  CANONICAL_TRADE_IDS.map(t => ({ value: t, label: TRADE_LABELS[t] ?? humanizeCategory(t) }))

const STATE_LABELS: Record<string, string> = {
  FL: 'Florida', CO: 'Colorado', TX: 'Texas', AZ: 'Arizona', OH: 'Ohio', NC: 'North Carolina',
}
export const DIRECTORY_STATE_OPTIONS: FilterOption<string>[] =
  CANONICAL_STATE_IDS.map(s => ({ value: s, label: STATE_LABELS[s] ?? s }))

export const DIRECTORY_LIFECYCLE_OPTIONS: FilterOption<LifecycleStage>[] =
  LIFECYCLE_STAGE_ORDER.map(s => ({ value: s, label: LIFECYCLE_STAGE_LABELS[s] }))

export const DIRECTORY_RELATIONSHIP_OPTIONS: FilterOption<ResourceRelationshipStatus>[] = [
  { value: 'none', label: 'Official / free' },
  { value: 'editorial', label: 'Editorial pick' },
  { value: 'affiliate', label: 'Affiliate (disclosed)' },
  { value: 'sponsored', label: 'Sponsored (disclosed)' },
  { value: 'partner', label: 'Partner' },
]
