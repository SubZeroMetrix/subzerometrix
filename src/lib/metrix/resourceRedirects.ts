// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceRedirects — Wave 6: privacy-safe tracked outbound-link architecture
// ─────────────────────────────────────────────────────────────────────────────
// Resolves the stable `/resources/go/[resourceId]` redirect pattern. Pure + deterministic;
// the route handler (src/app/resources/go/[resourceId]) is the thin I/O shell over this.
//
// HARD RULES (enforced + tested):
//   • Resolves ONLY verified + active destinations (via resourceVerification). Stale, broken,
//     inactive, or unverified records fail safely — never a redirect to an unverified provider.
//   • PRIVACY-SAFE PAYLOAD — the outbound event is a strict allow-list: resourceId, vendorId,
//     placement, originating route, trade, lifecycle stage, priority category, relationship +
//     disclosure status. It NEVER carries raw answers, emails, notes, financial data, licensing
//     details, or any profile data, and NONE of that data ever appears in the redirect URL.
//   • Disclosure (affiliate / sponsored / referral / reseller / compensation) is attached when
//     required — but disclosure never gates resolution.
//   • Feature-flag gated: when the redirect surface is disabled, resolution returns `disabled`.
//     Mass public redirects stay off until the underlying records are verified.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleStage } from './lifecycle'
import type { CanonicalActionCategory } from './actionTypes'
import type { ResourcePlacement } from './resourceTypes'
import type { EcosystemResource } from './resourceEcosystem'
import {
  evaluatePublicEligibility, isDirectLinkEligible, isRegulatoryAuthority, requiresDisclosure,
  type VerificationBlockReason,
} from './resourceVerification'

export const RESOURCE_REDIRECT_VERSION = 1
export const RESOURCE_REDIRECT_BASE = '/resources/go'

/** Build the canonical tracked-redirect path for a resource. Only the resourceId is in the URL. */
export function buildRedirectPath(resourceId: string): string {
  return `${RESOURCE_REDIRECT_BASE}/${encodeURIComponent(resourceId)}`
}

// Context the caller may provide. Only the allow-listed, non-PII fields below are ever used.
export interface RedirectContext {
  placement?: ResourcePlacement | null
  originatingRoute?: string | null      // app route only (no query string with answers)
  trade?: string | null
  lifecycleStage?: LifecycleStage | null
  priorityCategory?: CanonicalActionCategory | null
  consentGranted?: boolean              // analytics emitted only when host consent is granted
}

// The privacy-safe outbound analytics payload. Every field here is non-PII by construction.
export interface OutboundEventPayload {
  event: 'recommendation_outbound_click'
  resourceId: string
  vendorId: string | null
  placement: ResourcePlacement | null
  originatingRoute: string | null
  trade: string | null
  lifecycleStage: LifecycleStage | null
  priorityCategory: CanonicalActionCategory | null
  relationshipStatus: string
  disclosureRequired: boolean
}

export type RedirectStatus = 'ok' | 'not_found' | 'blocked' | 'disabled'

export interface RedirectResolution {
  status: RedirectStatus
  destination: string | null            // resolved external/official URL or internal path
  isExternal: boolean
  reason: VerificationBlockReason | 'not_found' | 'disabled' | null
  disclosureRequired: boolean
  disclosureText: string | null
  outboundEvent: OutboundEventPayload | null   // null when consent not granted
}

// Keys that must NEVER appear in a redirect context or payload. Defensive guard for callers
// that might pass a richer object by mistake.
const FORBIDDEN_CONTEXT_KEYS: ReadonlyArray<string> = [
  'email', 'answers', 'rawAnswers', 'notes', 'profile', 'financial', 'income', 'revenue',
  'license', 'licenseNumber', 'ssn', 'phone', 'name', 'firstName', 'lastName', 'address',
]

/** True when a context object accidentally carries a forbidden private key. */
export function contextCarriesPrivateData(ctx: Record<string, unknown>): boolean {
  if (!ctx || typeof ctx !== 'object') return false
  return Object.keys(ctx).some(k => FORBIDDEN_CONTEXT_KEYS.includes(k))
}

function safeStr(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function buildOutboundEvent(r: EcosystemResource, ctx: RedirectContext): OutboundEventPayload {
  return {
    event: 'recommendation_outbound_click',
    resourceId: r.resourceId,
    vendorId: r.vendorId,
    placement: (ctx.placement ?? null),
    // Strip any query string defensively — only the path portion is ever recorded.
    originatingRoute: safeStr(ctx.originatingRoute)?.split('?')[0] ?? null,
    trade: safeStr(ctx.trade),
    lifecycleStage: ctx.lifecycleStage ?? null,
    priorityCategory: ctx.priorityCategory ?? null,
    relationshipStatus: r.relationshipStatus,
    disclosureRequired: requiresDisclosure(r),
  }
}

/**
 * Resolve a tracked redirect for a resourceId against the master catalog.
 * Returns a safe, fully-described resolution; never throws.
 *
 * @param enabled feature-flag state for the redirect surface (default off-safe).
 */
export function resolveRedirect(
  resourceId: string,
  catalog: EcosystemResource[],
  ctx: RedirectContext = {},
  enabled = false,
): RedirectResolution {
  const empty: RedirectResolution = {
    status: 'not_found', destination: null, isExternal: false, reason: 'not_found',
    disclosureRequired: false, disclosureText: null, outboundEvent: null,
  }

  if (!enabled) {
    return { ...empty, status: 'disabled', reason: 'disabled' }
  }
  if (!resourceId || !Array.isArray(catalog)) return empty

  const r = catalog.find(x => x && x.resourceId === resourceId)
  if (!r) return empty

  // Regulatory authorities get a direct official link even outside the commercial gate.
  if (isRegulatoryAuthority(r)) {
    if (!isDirectLinkEligible(r)) return { ...empty, status: 'blocked', reason: r.broken ? 'broken' : 'inactive' }
    const destination = r.officialUrl ?? r.destinationPath
    return {
      status: 'ok',
      destination: destination ?? null,
      isExternal: !!r.officialUrl,
      reason: null,
      disclosureRequired: requiresDisclosure(r),
      disclosureText: requiresDisclosure(r) ? r.disclosureText : null,
      outboundEvent: ctx.consentGranted ? buildOutboundEvent(r, ctx) : null,
    }
  }

  const eligibility = evaluatePublicEligibility(r)
  if (!eligibility.eligible) {
    return { ...empty, status: 'blocked', reason: eligibility.reason }
  }

  const destination = r.officialUrl ?? r.destinationPath
  if (!destination) return { ...empty, status: 'blocked', reason: 'broken' }

  const discloseRequired = requiresDisclosure(r)
  return {
    status: 'ok',
    destination,
    isExternal: !!r.officialUrl,
    reason: null,
    disclosureRequired: discloseRequired,
    disclosureText: discloseRequired ? r.disclosureText : null,
    outboundEvent: ctx.consentGranted ? buildOutboundEvent(r, ctx) : null,
  }
}
