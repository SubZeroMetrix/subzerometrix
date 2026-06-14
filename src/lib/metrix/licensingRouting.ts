// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingRouting — Wave 4 neutral trusted-routing catalog (pure)
// ─────────────────────────────────────────────────────────────────────────────
// The ONE catalog of neutral routing CATEGORIES (authority / professional / software / resource).
// It carries NO providers, URLs, affiliate ids, or sponsored placements — exactly like the Wave 3
// resource categories. Commercial relationships must never alter MetrixScore, Metrix Priority,
// licensing applicability, pathway ordering, or recommendation ranking; every entry is marked
// `commercial: 'none'`. Any future affiliate/sponsor status must be disclosed and kept separate
// from regulatory guidance.
// ─────────────────────────────────────────────────────────────────────────────

import type { RoutingCategory, RoutingCategoryId } from './licensingTypes'

const C = (
  id: RoutingCategoryId, label: string, kind: RoutingCategory['kind'], reason: string,
): RoutingCategory => ({ id, label, kind, reason, commercial: 'none' })

export const ROUTING_CATALOG: Record<RoutingCategoryId, RoutingCategory> = {
  licensing_authority: C('licensing_authority', 'State licensing authority', 'authority',
    'Confirm the license, classification, exam, and fees that apply to your scope directly with the issuing authority.'),
  municipal_county_office: C('municipal_county_office', 'City / county office', 'authority',
    'Local rules often add to or replace state rules — confirm requirements with your city or county.'),
  permit_office: C('permit_office', 'Permit office', 'authority',
    'Verify which permits and inspections your work requires before you start.'),
  contractor_attorney: C('contractor_attorney', 'Construction / contractor attorney', 'professional',
    'For contracts, liens, disputes, and entity questions where the stakes justify legal review.'),
  accountant_tax: C('accountant_tax', 'Accountant / tax professional', 'professional',
    'For entity choice, sales/use tax, and bookkeeping appropriate to your state and trade.'),
  insurance_professional: C('insurance_professional', 'Insurance professional', 'professional',
    'For general liability, workers’ comp, and any coverage your state or clients require.'),
  bonding_provider: C('bonding_provider', 'Surety / bonding provider', 'professional',
    'Many license classes and public/commercial jobs require a surety bond — confirm the amount.'),
  field_service_software: C('field_service_software', 'Field-service / scheduling software', 'software',
    'Scheduling, dispatch, estimating, and invoicing tooling appropriate to your trade.'),
  safety_compliance: C('safety_compliance', 'Safety / compliance resources', 'resource',
    'OSHA, EPA, and trade-specific safety requirements that apply to how the work is performed.'),
  trade_association: C('trade_association', 'Trade association', 'resource',
    'State and national associations track licensing changes and offer training and updates.'),
  education_exam_prep: C('education_exam_prep', 'Approved education / exam prep', 'resource',
    'Where a license exam applies, approved prep can shorten the path — verify it is recognized.'),
}

export function getRoutingCategory(id: RoutingCategoryId): RoutingCategory {
  return ROUTING_CATALOG[id]
}

export function getRoutingCategories(ids: RoutingCategoryId[]): RoutingCategory[] {
  const seen = new Set<RoutingCategoryId>()
  const out: RoutingCategory[] = []
  for (const id of Array.isArray(ids) ? ids : []) {
    if (seen.has(id)) continue
    const c = ROUTING_CATALOG[id]
    if (c) { seen.add(id); out.push(c) }
  }
  return out
}

// The "specialist" subset a contractor would consult (professionals + bonding), in catalog order.
const SPECIALIST_IDS: RoutingCategoryId[] = [
  'contractor_attorney', 'accountant_tax', 'insurance_professional', 'bonding_provider',
]
export function getSpecialistCategories(ids: RoutingCategoryId[]): RoutingCategory[] {
  const set = new Set(Array.isArray(ids) ? ids : [])
  return SPECIALIST_IDS.filter(id => set.has(id)).map(id => ROUTING_CATALOG[id])
}
