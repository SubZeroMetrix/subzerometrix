// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceEcosystem — Wave 6: master Contractor Business Resource Ecosystem (types)
// ─────────────────────────────────────────────────────────────────────────────
// The master internal catalog record. It EXTENDS the Wave 5 CanonicalResource (it does
// not replace or duplicate it) with the verification, launch-set, relationship, and
// review metadata required to safely operate a resource directory + tracked redirects.
//
// Two hard product rules are encoded in the type system here:
//   1. PUBLIC GATING — only `verified` + `active` records may appear in public
//      recommendations or directory pages, or resolve a tracked redirect. The full master
//      catalog stays internal until a record is verified with evidence.
//   2. COMMERCIAL NEUTRALITY — relationship / affiliate / referral / reseller / sponsorship
//      / integration status live here as DISCLOSURE + OPERATIONS metadata only. They are
//      never a ranking, gating, or eligibility input (enforced by resourceVerification.ts
//      and the Wave 6 tests).
//
// Pure types + constants. No logic, no React/Next/Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleStage } from './lifecycle'
import type { CanonicalResource } from './resourceTypes'

export const RESOURCE_ECOSYSTEM_VERSION = 1

// ── Verification lifecycle ─────────────────────────────────────────────────────
// A record advances draft → pending_verification → verified with evidence. It can later
// regress to needs_review / stale / broken / inactive / archived. ONLY `verified` (and
// `active`) is publicly eligible. No record may be marked `verified` without evidence.
export type EcosystemVerificationStatus =
  | 'draft'
  | 'pending_verification'
  | 'verified'
  | 'live_link_confirmed'   // Wave 7: educational listing whose live link was confirmed (publishable)
  | 'needs_review'
  | 'stale'
  | 'broken'
  | 'inactive'
  | 'archived'

// The statuses that NEVER reach the public surface (directory, recommendations, redirects).
export const NON_PUBLIC_VERIFICATION_STATUSES: ReadonlyArray<EcosystemVerificationStatus> = [
  'draft', 'pending_verification', 'needs_review', 'stale', 'broken', 'inactive', 'archived',
]

// ── Relationship / commercial metadata (disclosure + ops only; never ranking) ───
export type EcosystemReferralStatus = 'none' | 'pending' | 'active'
export type EcosystemResellerStatus = 'none' | 'reseller'
export type EcosystemIntegrationStatus = 'none' | 'software_integration' | 'api' | 'embedded_service'

// ── Master ecosystem category architecture ──────────────────────────────────────
// The full Contractor Business Resource Ecosystem taxonomy. Superset of the Wave 5
// CanonicalResourceCategory (recommendation categories); used for directory browse +
// launch-set curation. Adding a category later is additive and safe.
export const ECOSYSTEM_CATEGORIES = [
  'banking',
  'business_credit_expense',
  'insurance_bonding',
  'pricing_estimating',
  'crm_proposals_sales_financing',
  'hvac_supply',
  'electrical_supply',
  'plumbing_supply',
  'construction_roofing_materials',
  'tools_safety_industrial',
  'fleet_fuel_vehicles_equipment',
  'accounting_bookkeeping_payroll',
  'payments_merchant',
  'lending_sba_finance_working_capital',
  'legal_formation_licensing_compliance',
  'hiring_workforce',
  'training_certifications',
  'marketing_websites_local_search_content',
  'lead_gen_reviews_acquisition',
  'phones_call_handling_communication',
  'scheduling_dispatch_project_document',
  'inventory_warehouse_tools_purchasing',
  'cybersecurity_data_protection',
  'employee_benefits_retention',
  'uniforms_printing_signs_branding',
  'associations_communities',
  'government_free_resources',
  'continuity_disaster_succession',
  'specialty_contractor',
] as const

export type EcosystemCategory = (typeof ECOSYSTEM_CATEGORIES)[number]

// ── Launch-set curation (~50–100 verified, high-value resources for first public launch) ─
export type LaunchCategory =
  | 'government_licensing'
  | 'free_government_nonprofit'
  | 'formation_compliance'
  | 'banking'
  | 'accounting_bookkeeping'
  | 'insurance_bonding'
  | 'field_service_software'
  | 'pricing_estimating'
  | 'trade_suppliers'
  | 'marketing_acquisition'
  | 'hiring_payroll'
  | 'training_certifications'

export interface EcosystemReviewMeta {
  reviewedDate: string | null          // ISO date a human last verified the record (null = never)
  nextReviewDate: string | null        // ISO date the next review is due
  verificationStatus: EcosystemVerificationStatus
  verificationOwner: string | null     // who is accountable for verifying this record
  verificationNotes: string | null     // evidence summary / why a status was assigned
  verificationPriority: number | null  // lower = verify sooner (launch curation ordering)
}

export interface EcosystemLaunchMeta {
  launchEligible: boolean              // candidate for the curated public launch set
  launchCategory: LaunchCategory | null
  launchSequence: number | null        // ordering within the curated launch rollout
}

export interface EcosystemRelationshipMeta {
  referralStatus: EcosystemReferralStatus
  resellerStatus: EcosystemResellerStatus
  integrationStatus: EcosystemIntegrationStatus
  compensationDisclosure: string | null  // human-readable disclosure when compensation exists
}

export interface EcosystemOperationsMeta {
  businessNeed: string                 // the contractor need this resource serves
  eligibility: string | null           // who qualifies (null = no restriction)
  limitations: string | null           // known limitations / caveats
  regionsServed: string[]              // [] = nationwide / all regions
  lifecycleStagesServed: LifecycleStage[]  // [] = all stages
  supportContact: string | null        // escalation contact metadata (no PII of users)
  officialAlternativeUrl: string | null   // free / government / direct-provider alternative
  useAnotherProviderOption: true       // INVARIANT: users may always choose their own provider
}

// The master record: the Wave 5 canonical resource + the Wave 6 ecosystem extension.
export interface EcosystemResource extends CanonicalResource {
  ecosystemCategory: EcosystemCategory
  review: EcosystemReviewMeta
  launch: EcosystemLaunchMeta
  relationship: EcosystemRelationshipMeta
  operations: EcosystemOperationsMeta
}

// A safe ecosystem extension default for a record that has NOT been verified yet. Used to
// lift a Wave 5 CanonicalResource into the ecosystem shape without fabricating verification.
export function defaultEcosystemExtension(
  ecosystemCategory: EcosystemCategory,
  businessNeed: string,
): Omit<EcosystemResource, keyof CanonicalResource> {
  return {
    ecosystemCategory,
    review: {
      reviewedDate: null,
      nextReviewDate: null,
      verificationStatus: 'draft',     // unverified by default — never auto-`verified`
      verificationOwner: null,
      verificationNotes: null,
      verificationPriority: null,
    },
    launch: {
      launchEligible: false,
      launchCategory: null,
      launchSequence: null,
    },
    relationship: {
      referralStatus: 'none',
      resellerStatus: 'none',
      integrationStatus: 'none',
      compensationDisclosure: null,
    },
    operations: {
      businessNeed,
      eligibility: null,
      limitations: null,
      regionsServed: [],
      lifecycleStagesServed: [],
      supportContact: null,
      officialAlternativeUrl: null,
      useAnotherProviderOption: true,
    },
  }
}
