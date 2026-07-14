// Public-facing display copy for Metrix Command Center pricing, shown on
// the SubZero Metrix landing page. This is a deliberate, manually-synced
// duplicate of the display fields in command-center/admin's
// lib/billing/plans.ts -- NOT a cross-repo import (these are two separate
// repos/deployments). If MCC pricing changes, this file must be updated
// by hand to match.
export const MCC_PLANS = {
  command_center: {
    id: 'command_center',
    name: 'Command Center',
    priceDisplay: '$99/month',
    trialDays: 7,
    featureSummary: [
      'Everything in Founder CRM',
      'Buster, Scout, Pulse, Forge, Quill, and Echo — your governed AI team',
      'Approval-gated recommendations and full audit trail',
      'Full Command Center reporting and runtime visibility',
    ],
  },
  founder_crm: {
    id: 'founder_crm',
    name: 'Founder CRM',
    priceDisplay: '$39/month',
    trialDays: 7,
    featureSummary: [
      'Contacts, leads, and follow-ups',
      'Customer & property records',
      'Estimates and jobs',
      'Governed email communications',
    ],
    requiresFounderCode: true,
  },
} as const

export const MCC_FOUNDER_PRICING_NOTICE =
  'Founder pricing requires an approved founder code and eligibility. Standard pricing for future customers may change as new capability is added.'

export const MCC_BILLING_TERMS = {
  interval: 'Monthly only — no annual plans.',
  cancellation: 'Cancel anytime. Access continues through the end of your current billing period.',
  refunds:
    'No prorated or discretionary refunds. Refunds are issued only where legally required or to correct a genuine billing error.',
}

export const MCC_SIGNUP_URL = 'https://mcc.subzerometrix.com/signup'
export const MCC_LOGIN_URL = 'https://mcc.subzerometrix.com/login'
