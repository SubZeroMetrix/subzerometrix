// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceVerification — Wave 6: public-eligibility gating for the ecosystem
// ─────────────────────────────────────────────────────────────────────────────
// The single authority on whether a master ecosystem record may surface publicly. Pure,
// deterministic, defensive. Encodes two product invariants:
//
//   • PUBLIC GATING — a record is public-eligible ONLY when verificationStatus === 'verified'
//     AND active AND not broken AND not stale. The full internal catalog stays private until
//     a record earns `verified` with evidence.
//   • COMMERCIAL NEUTRALITY — eligibility reads ZERO commercial fields (relationship /
//     affiliate / referral / reseller / sponsorship / integration). A paid relationship can
//     never make an unverified record eligible, and an editorial record is never blocked for
//     lacking one. Enforced by the Wave 6 tests.
//
// Disclosure is computed separately: it MUST be shown when a commercial relationship exists,
// but it never gates eligibility.
// ─────────────────────────────────────────────────────────────────────────────

import type { EcosystemResource } from './resourceEcosystem'

// Reasons a record is blocked from the public surface (null = eligible).
export type VerificationBlockReason =
  | 'not_verified'
  | 'inactive'
  | 'broken'
  | 'stale'

export interface PublicEligibility {
  eligible: boolean
  reason: VerificationBlockReason | null
}

/**
 * Whether a master ecosystem record may appear in public recommendations / directory pages
 * or resolve a tracked redirect. Reads only verification + health — never commercial status.
 */
export function evaluatePublicEligibility(r: EcosystemResource): PublicEligibility {
  if (r.review.verificationStatus !== 'verified') return { eligible: false, reason: 'not_verified' }
  if (!r.active) return { eligible: false, reason: 'inactive' }
  if (r.broken) return { eligible: false, reason: 'broken' }
  if (r.stale) return { eligible: false, reason: 'stale' }
  return { eligible: true, reason: null }
}

/** Convenience boolean wrapper around evaluatePublicEligibility. */
export function isPublicEligible(r: EcosystemResource): boolean {
  return evaluatePublicEligibility(r).eligible
}

/**
 * Whether a record may be linked directly (tracked redirect or official-source link).
 * Public-eligible records qualify. Regulatory / licensing authorities are ALWAYS allowed a
 * direct official-source link (so contractors can reach the real authority) as long as the
 * record is active and not broken — they are reference data, not commercial placements.
 */
export function isDirectLinkEligible(r: EcosystemResource): boolean {
  const hasDestination = !!(r.officialUrl || r.destinationPath)
  if (!hasDestination) return false
  if (isRegulatoryAuthority(r)) return r.active && !r.broken
  return isPublicEligible(r)
}

/** A licensing/permit authority record — reference data, never a commercial placement. */
export function isRegulatoryAuthority(r: EcosystemResource): boolean {
  return r.category === 'licensing_authority' || r.category === 'permit_office'
}

/**
 * Whether a disclosure MUST be shown for this record. Commercial relationship of ANY kind,
 * or a licensing-relevant record, requires disclosure. This NEVER affects eligibility.
 */
export function requiresDisclosure(r: EcosystemResource): boolean {
  if (r.relationshipStatus === 'affiliate' || r.relationshipStatus === 'sponsored' || r.relationshipStatus === 'partner') return true
  if (r.affiliateStatus === 'active') return true
  if (r.sponsorshipStatus === 'sponsored') return true
  if (r.relationship.referralStatus === 'active') return true
  if (r.relationship.resellerStatus === 'reseller') return true
  if (r.relationship.compensationDisclosure) return true
  if (r.licensingRelevant) return true
  return false
}

/** Filter a master catalog down to only the records allowed on the public surface. */
export function publicEligibleResources(catalog: EcosystemResource[]): EcosystemResource[] {
  return (Array.isArray(catalog) ? catalog : []).filter(isPublicEligible)
}

/** The records curated for the first public launch set that are actually verified + eligible. */
export function launchReadyResources(catalog: EcosystemResource[]): EcosystemResource[] {
  return publicEligibleResources(catalog).filter(r => r.launch.launchEligible)
}

/**
 * Whether a record may be marked `verified`. A record requires evidence (a reviewer + notes
 * + a reviewed date) before it can claim verification. Guards against fabricated verification.
 */
export function hasVerificationEvidence(r: EcosystemResource): boolean {
  return !!(r.review.verificationOwner && r.review.verificationNotes && r.review.reviewedDate)
}
