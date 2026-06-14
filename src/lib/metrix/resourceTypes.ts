// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceTypes — Wave 5: canonical Resource / Vendor registry model (types)
// ─────────────────────────────────────────────────────────────────────────────
// ONE typed shape that consolidates the three existing resource sources — the vendor
// catalog (vendorCategories.ts), the affiliate partner registry (affiliates.ts), and
// the educational public resources (publicResources.ts) — into a single CanonicalResource.
//
// It is a read-only consolidation: every original id is preserved verbatim in `sourceId`
// (and `vendorId` where applicable). Commercial fields (relationship/affiliate/sponsorship
// status) are stored SEPARATELY from relevance and MUST NOT influence recommendation
// ranking. No raw answers, emails, notes, or sensitive identifiers ever live here.
//
// Pure types + small constants only — no logic, no React/Next/Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleStage } from './lifecycle'
import type { CanonicalActionCategory } from './actionTypes'

export const RESOURCE_REGISTRY_VERSION = 1
// The date the consolidated registry mapping was last reviewed (vendor/affiliate sources
// carry no per-record date; educational resources keep their own `updatedAt`).
export const RESOURCE_REVIEWED_DATE = '2026-06-14'
export const RESOURCE_FRESHNESS_WINDOW_DAYS = 365

// Which underlying source a resource was consolidated from.
export type ResourceSourceKind = 'vendor' | 'affiliate' | 'guide'

// Neutral, stable resource categories spanning all three sources + the Wave 5 vendor library.
export type CanonicalResourceCategory =
  | 'field_service_software'
  | 'crm'
  | 'estimating'
  | 'scheduling'
  | 'payments_financing'
  | 'banking'
  | 'accounting_bookkeeping'
  | 'payroll'
  | 'insurance'
  | 'bonding'
  | 'legal_formation'
  | 'licensing_authority'
  | 'permit_office'
  | 'customer_communication'
  | 'marketing_growth'
  | 'reviews'
  | 'operations'
  | 'safety_compliance'
  | 'trade_association'
  | 'education_exam_prep'
  | 'guide'
  | 'other'

// Where a resource is allowed to surface (display placement only).
export type ResourcePlacement =
  | 'dashboard'
  | 'results'
  | 'roadmap'
  | 'foundation_builder'
  | 'growth_engine'
  | 'resources_page'
  | 'licensing'

// Commercial relationship — stored separately; never a ranking input.
export type ResourceRelationshipStatus =
  | 'none'        // no relationship at all
  | 'editorial'   // listed on editorial merit only (the default, pre-launch)
  | 'affiliate'   // active affiliate relationship
  | 'sponsored'   // paid placement (disclosed)
  | 'partner'     // formal partner

// Mirrors vendorCategories AffiliateStatus exactly (factual, never fabricated).
export type ResourceAffiliateStatus = 'none' | 'pending' | 'active'
export type ResourceSponsorshipStatus = 'none' | 'sponsored'

export interface CanonicalResourceProvenance {
  source: ResourceSourceKind
  sourceId: string                 // ORIGINAL id (vendor.id / partner.id / resource.slug)
  reviewedDate: string
}

export interface CanonicalResource {
  resourceId: string                       // namespaced stable id: `${source}:${sourceId}`
  sourceId: string                         // original id, preserved verbatim
  vendorId: string | null                  // original vendor/partner id (null for guides)
  kind: ResourceSourceKind
  category: CanonicalResourceCategory
  title: string
  description: string
  destinationPath: string | null           // internal app path (guides) — null for external
  officialUrl: string | null               // external destination / official source url
  tradeApplicability: string[]             // [] = all trades
  stateApplicability: string[]             // [] = all states
  lifecycleApplicability: LifecycleStage[]  // [] = all stages
  priorityApplicability: CanonicalActionCategory[]  // [] = broadly applicable
  licensingRelevant: boolean               // true = touches licensing/regulatory routing
  relationshipStatus: ResourceRelationshipStatus
  affiliateStatus: ResourceAffiliateStatus
  sponsorshipStatus: ResourceSponsorshipStatus
  reviewedDate: string
  provenance: CanonicalResourceProvenance
  placementContexts: ResourcePlacement[]
  analyticsId: string                      // privacy-safe id for analytics (no PII)
  active: boolean
  stale: boolean
  broken: boolean
  disclosureText: string
}
