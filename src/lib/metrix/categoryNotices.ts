// ─────────────────────────────────────────────────────────────────────────────
// metrix/categoryNotices — Wave 7: regulated-category contextual notices (Part 6)
// ─────────────────────────────────────────────────────────────────────────────
// Brief, truthful notices shown near regulated resource categories. They state what
// SubZeroMetrix is NOT (lender/insurer/legal/tax adviser) and point users to the provider or
// authority. Educational only; never used to prop up an otherwise inaccurate claim. Pure data +
// a deterministic selector; no React.
// ─────────────────────────────────────────────────────────────────────────────

import type { EcosystemCategory } from './resourceEcosystem'

// Short, brief notices (Wave 7 cleanup). The fuller explanations live on the linked
// /resource-directory-disclosure page; these are the concise nearby reminders.
export const REGULATED_NOTICES = {
  financing: 'SubZeroMetrix is not a lender or broker.',
  insurance: 'SubZeroMetrix does not sell or determine appropriate insurance coverage.',
  advice: 'Educational information only—not legal, tax, or accounting advice.',
  licensing: 'Verify current requirements with the responsible authority.',
  compliance: 'SubZeroMetrix does not determine whether a business is legally compliant.',
} as const

export type RegulatedNoticeKey = keyof typeof REGULATED_NOTICES

// Which notice (if any) a given ecosystem category triggers.
const CATEGORY_NOTICE: Partial<Record<EcosystemCategory, RegulatedNoticeKey>> = {
  banking: 'financing',
  lending_sba_finance_working_capital: 'financing',
  payments_merchant: 'financing',
  business_credit_expense: 'financing',
  insurance_bonding: 'insurance',
  legal_formation_licensing_compliance: 'advice',
  accounting_bookkeeping_payroll: 'advice',
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
  const ORDER: RegulatedNoticeKey[] = ['financing', 'insurance', 'advice', 'licensing', 'compliance']
  return ORDER.filter(k => keys.has(k)).map(k => ({ key: k, text: REGULATED_NOTICES[k] }))
}
