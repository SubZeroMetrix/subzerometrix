// ─────────────────────────────────────────────────────────────────────────────
// metrix/categoryNotices — Wave 7: regulated-category contextual notices (Part 6)
// ─────────────────────────────────────────────────────────────────────────────
// Brief, truthful notices shown near regulated resource categories. They state what
// SubZeroMetrix is NOT (lender/insurer/legal/tax adviser) and point users to the provider or
// authority. Educational only; never used to prop up an otherwise inaccurate claim. Pure data +
// a deterministic selector; no React.
// ─────────────────────────────────────────────────────────────────────────────

import type { EcosystemCategory } from './resourceEcosystem'

export const REGULATED_NOTICES = {
  financing: 'SubZeroMetrix is not a lender, broker, or financial adviser and does not determine eligibility, rates, approval, or suitability. Review terms directly with the provider.',
  insurance: 'SubZeroMetrix does not sell insurance or determine appropriate coverage. Confirm coverage, licensing, exclusions, and terms directly with the provider.',
  legal: 'SubZeroMetrix does not provide legal advice or determine whether a service is appropriate for your circumstances.',
  tax: 'SubZeroMetrix does not provide tax or accounting advice. Consult a qualified professional regarding your circumstances.',
  licensing: 'Requirements may vary by trade, project, city, county, and state. Confirm current requirements with the responsible licensing authority before acting.',
  compliance: 'SubZeroMetrix provides educational information only and does not determine whether a business is legally compliant.',
} as const

export type RegulatedNoticeKey = keyof typeof REGULATED_NOTICES

// Which notice (if any) a given ecosystem category triggers.
const CATEGORY_NOTICE: Partial<Record<EcosystemCategory, RegulatedNoticeKey>> = {
  banking: 'financing',
  lending_sba_finance_working_capital: 'financing',
  payments_merchant: 'financing',
  business_credit_expense: 'financing',
  insurance_bonding: 'insurance',
  legal_formation_licensing_compliance: 'legal',
  accounting_bookkeeping_payroll: 'tax',
}

/**
 * The distinct notices applicable to a set of visible categories, in stable display order.
 * `anyLicensingRelevant` adds the licensing notice (records flagged licensingRelevant).
 */
export function noticesForCategories(
  categories: ReadonlyArray<EcosystemCategory | string>,
  anyLicensingRelevant = false,
): { key: RegulatedNoticeKey; text: string }[] {
  const keys = new Set<RegulatedNoticeKey>()
  for (const c of categories) {
    const k = CATEGORY_NOTICE[c as EcosystemCategory]
    if (k) keys.add(k)
  }
  if (anyLicensingRelevant) keys.add('licensing')
  const ORDER: RegulatedNoticeKey[] = ['financing', 'insurance', 'legal', 'tax', 'licensing', 'compliance']
  return ORDER.filter(k => keys.has(k)).map(k => ({ key: k, text: REGULATED_NOTICES[k] }))
}
