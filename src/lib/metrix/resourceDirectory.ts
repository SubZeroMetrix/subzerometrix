// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceDirectory — Wave 6: Directory vs Recommendation interface contracts
// ─────────────────────────────────────────────────────────────────────────────
// Two DISTINCT public surfaces, defined as contracts only. Wave 6 prepares the interface +
// route architecture; the full directory UI is built in Wave 7.
//
//   A. Resource Directory — browse the verified catalog by category / trade / region /
//      lifecycle stage / business need / relationship type. Shows verified status, reviewed
//      date, disclosures, free/official alternatives, and a "use another provider" affordance.
//
//   B. Recommended Resources — bounded, profile-aware suggestions (built by the existing
//      deriveResourceRecommendations adapter — NOT a second ranking engine). One official/free
//      option where relevant, a small set of provider options, plus the user action set:
//      view-more, already-completed, not-relevant, using-another-provider, broken-or-outdated.
//
// Both surfaces consume ONLY public-eligible records (verified + active) and never link-dump.
// Pure types + pure projection helpers. No UI, no I/O, no ranking logic here.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleStage } from './lifecycle'
import type { ResourceRelationshipStatus } from './resourceTypes'
import type {
  EcosystemResource, EcosystemCategory,
} from './resourceEcosystem'
import { isPublicEligible, requiresDisclosure } from './resourceVerification'
import { buildRedirectPath } from './resourceRedirects'

export const RESOURCE_DIRECTORY_VERSION = 1

// ── A. Resource Directory ────────────────────────────────────────────────────────
export interface DirectoryFilter {
  category?: EcosystemCategory | null
  trade?: string | null
  region?: string | null               // state/region code; matches regionsServed ([] = all)
  lifecycleStage?: LifecycleStage | null
  businessNeed?: string | null         // substring match against operations.businessNeed
  relationshipType?: ResourceRelationshipStatus | null
}

// A presentation-safe directory row. Carries no private user data and no ranking score.
// Wave 7 (CP6) extends this with additional PRESENTATION-SAFE card fields. It deliberately
// excludes internal verification notes/owner, raw compensation terms, eligibility internals,
// and support contacts — those stay internal to EcosystemResource.
export interface DirectoryEntry {
  resourceId: string
  vendorId: string | null
  title: string
  category: EcosystemCategory
  description: string
  verified: boolean
  reviewedDate: string | null
  redirectPath: string                 // /resources/go/<resourceId>
  disclosureRequired: boolean
  disclosureText: string | null
  officialAlternativeUrl: string | null
  useAnotherProviderOption: true
  // ── Wave 7 CP6: presentation-safe card fields ──
  businessNeed: string
  tradeApplicability: string[]         // [] = all trades
  lifecycleApplicability: LifecycleStage[] // [] = all stages
  regionApplicability: string[]        // [] = nationwide / all regions
  relationshipStatus: ResourceRelationshipStatus
  isOfficialOrFree: boolean
  limitations: string | null
}

function toDirectoryEntry(r: EcosystemResource): DirectoryEntry {
  const disclose = requiresDisclosure(r)
  return {
    resourceId: r.resourceId,
    vendorId: r.vendorId,
    title: r.title,
    category: r.ecosystemCategory,
    description: r.description,
    verified: r.review.verificationStatus === 'verified',
    reviewedDate: r.review.reviewedDate,
    redirectPath: buildRedirectPath(r.resourceId),
    disclosureRequired: disclose,
    disclosureText: disclose ? r.disclosureText : null,
    officialAlternativeUrl: r.operations.officialAlternativeUrl,
    useAnotherProviderOption: true,
    businessNeed: r.operations.businessNeed,
    tradeApplicability: r.tradeApplicability,
    lifecycleApplicability: r.operations.lifecycleStagesServed,
    regionApplicability: r.operations.regionsServed,
    relationshipStatus: r.relationshipStatus,
    isOfficialOrFree: r.operations.officialAlternativeUrl != null
      || r.ecosystemCategory === 'government_free_resources',
    limitations: r.operations.limitations,
  }
}

function matchesFilter(r: EcosystemResource, f: DirectoryFilter): boolean {
  if (f.category && r.ecosystemCategory !== f.category) return false
  if (f.relationshipType && r.relationshipStatus !== f.relationshipType) return false
  if (f.trade && r.tradeApplicability.length > 0 &&
      !r.tradeApplicability.map(t => t.toLowerCase()).includes(f.trade.toLowerCase())) return false
  if (f.region && r.operations.regionsServed.length > 0 &&
      !r.operations.regionsServed.map(s => s.toLowerCase()).includes(f.region.toLowerCase())) return false
  if (f.lifecycleStage && r.operations.lifecycleStagesServed.length > 0 &&
      !r.operations.lifecycleStagesServed.includes(f.lifecycleStage)) return false
  if (f.businessNeed && !r.operations.businessNeed.toLowerCase().includes(f.businessNeed.toLowerCase())) return false
  return true
}

/**
 * Build the directory view: ONLY public-eligible records, filtered, deterministically ordered
 * (category asc, then title asc). Never throws; an empty/invalid catalog yields [].
 */
export function buildDirectoryView(catalog: EcosystemResource[], filter: DirectoryFilter = {}): DirectoryEntry[] {
  const pool = Array.isArray(catalog) ? catalog : []
  return pool
    .filter(isPublicEligible)
    .filter(r => matchesFilter(r, filter))
    .map(toDirectoryEntry)
    .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
}

// ── B. Recommended Resources ──────────────────────────────────────────────────────
// The user action set on a recommendation card. Mirrors the existing resource-feedback
// values; this is the canonical UI contract for those actions.
export const RECOMMENDATION_ACTIONS = [
  'view_more_options',
  'already_completed',
  'not_relevant',
  'using_another_provider',
  'broken_or_outdated',
] as const
export type RecommendationAction = (typeof RECOMMENDATION_ACTIONS)[number]

// A presentation-safe recommendation card view. Wraps a public-eligible resource with its
// redirect path, disclosure, official/free alternative, and the action set. No score leaks
// to the UI contract; ranking stays inside deriveResourceRecommendations.
export interface RecommendationCardView {
  resourceId: string
  title: string
  description: string
  reason: string                       // why-shown rationale (from the recommendation adapter)
  isOfficialOrFree: boolean            // the "one official/free option where relevant" slot
  redirectPath: string
  disclosureRequired: boolean
  disclosureText: string | null
  officialAlternativeUrl: string | null
  actions: ReadonlyArray<RecommendationAction>
  useAnotherProviderOption: true
}

/**
 * Project a public-eligible ecosystem record + a why-shown reason into a recommendation card
 * view. Returns null for any record that is not public-eligible (so recommendations can never
 * surface an unverified provider). Pure; never throws.
 */
export function toRecommendationCard(r: EcosystemResource, reason: string): RecommendationCardView | null {
  if (!isPublicEligible(r)) return null
  const disclose = requiresDisclosure(r)
  return {
    resourceId: r.resourceId,
    title: r.title,
    description: r.description,
    reason,
    isOfficialOrFree: r.category === 'licensing_authority' || r.category === 'permit_office'
      || !!r.operations.officialAlternativeUrl,
    redirectPath: buildRedirectPath(r.resourceId),
    disclosureRequired: disclose,
    disclosureText: disclose ? r.disclosureText : null,
    officialAlternativeUrl: r.operations.officialAlternativeUrl,
    actions: RECOMMENDATION_ACTIONS,
    useAnotherProviderOption: true,
  }
}
