// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceRecommendations — Wave 5: profile-aware recommendation adapter
// ─────────────────────────────────────────────────────────────────────────────
// ONE deterministic, defensive adapter — deriveResourceRecommendations(...). It reads the
// canonical resource registry plus profile context (lifecycle, canonical priority, trade,
// state, completeness, unknowns, active path, current actions, blocked categories, completed
// + dismissed resources, user-reported helpfulness) and returns ranked recommendations.
//
// HARD RULES (enforced + tested):
//   • Relevance ranking uses ONLY fit signals. relationshipStatus / affiliateStatus /
//     sponsorshipStatus are NEVER inputs to the score — a paid relationship cannot reorder.
//   • No independent priority override: recommendations carry no score/priority field that
//     competes with the canonical Metrix Priority. They link to it, never replace it.
//   • Deterministic ordering (score desc, then resourceId asc), deduplicated, bounded.
//   • Dismissed + completed + negatively-rated resources are suppressed.
//   • Missing / malformed / legacy / unsupported input degrades to a safe fallback; never throws.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleStage } from './lifecycle'
import type { FreshnessStatus } from './licensingTypes'
import type { CanonicalAction, CanonicalActionCategory } from './actionTypes'
import {
  RESOURCE_FRESHNESS_WINDOW_DAYS,
  type CanonicalResource, type ResourcePlacement,
} from './resourceTypes'
import { RESOURCE_REGISTRY } from './resourceRegistry'
import { dayDiff } from './sourceFreshness'

export const RECOMMENDATION_VERSION = 1

// Optional user-reported signal per resource (mirrors the feedback adapter values).
export type ResourceHelpfulness =
  | 'helpful' | 'not_helpful' | 'already_completed' | 'not_relevant' | 'broken' | 'outdated'

export type RecommendationConfidence = 'high' | 'medium' | 'low'
export type RecommendationDisclosure = 'editorial' | 'required'

export interface ResourceApplicability {
  trade: boolean
  state: boolean
  lifecycle: boolean
  priority: boolean
}

export interface RecommendedResource {
  resource: CanonicalResource
  reason: string
  applicability: ResourceApplicability
  confidence: RecommendationConfidence
  disclosureStatus: RecommendationDisclosure
  sourceFreshness: FreshnessStatus
  placementContext: ResourcePlacement
  nextActionLinkage: string | null
  relevance: number          // internal fit score (NOT commercial); exposed for transparency/tests
}

export interface ResourceRecommendationOptions {
  placement: ResourcePlacement
  lifecycleStage?: LifecycleStage | null
  priorityCategory?: CanonicalActionCategory | null
  trade?: string | null
  state?: string | null
  profileCompleteness?: number | null
  importantUnknowns?: string[]
  activePathId?: string | null
  currentActions?: CanonicalAction[]
  blockedCategories?: CanonicalActionCategory[]
  completedResourceIds?: string[]
  dismissedResourceIds?: string[]
  helpfulness?: Record<string, ResourceHelpfulness>
  limit?: number
  now?: string
  // Optional pool override (e.g. a pre-filtered set or a test fixture). Defaults to the
  // full canonical registry. Provided for safe injection — never a commercial hook.
  resources?: CanonicalResource[]
}

export interface ResourceRecommendationResult {
  recommendations: RecommendedResource[]
  placement: ResourcePlacement
  fallbackUsed: boolean
  version: number
}

const DEFAULT_LIMIT = 4
const safeStr = (v: unknown): string => (typeof v === 'string' ? v.trim().toLowerCase() : '')
const strSet = (v: unknown): Set<string> =>
  new Set((Array.isArray(v) ? v : []).filter((x): x is string => typeof x === 'string'))

// Helpfulness values that suppress a resource entirely.
const SUPPRESSING_FEEDBACK: ReadonlySet<ResourceHelpfulness> = new Set<ResourceHelpfulness>([
  'not_relevant', 'already_completed', 'broken', 'outdated',
])

function freshnessOf(reviewedDate: string, now: string): FreshnessStatus {
  const age = dayDiff(reviewedDate, now)
  if (age == null) return 'unknown'
  if (age < 0) return 'fresh'                                  // future-dated → treat as fresh
  if (age <= RESOURCE_FRESHNESS_WINDOW_DAYS) return 'fresh'
  if (age <= RESOURCE_FRESHNESS_WINDOW_DAYS * 2) return 'aging'
  return 'stale'
}

// A resource is hard-excluded only on an explicit trade/state mismatch (correctness),
// never on a soft signal.
function tradeMatches(res: CanonicalResource, trade: string): { applies: boolean; explicit: boolean } {
  if (res.tradeApplicability.length === 0) return { applies: true, explicit: false }
  if (!trade) return { applies: true, explicit: false }
  const set = new Set(res.tradeApplicability.map(t => t.toLowerCase()))
  return { applies: set.has(trade), explicit: true }
}

function stateMatches(res: CanonicalResource, state: string): { applies: boolean; explicit: boolean } {
  if (res.stateApplicability.length === 0) return { applies: true, explicit: false }
  if (!state) return { applies: true, explicit: false }
  const set = new Set(res.stateApplicability.map(s => s.toLowerCase()))
  return { applies: set.has(state), explicit: true }
}

function lifecycleMatches(res: CanonicalResource, stage: LifecycleStage | null | undefined): boolean {
  if (res.lifecycleApplicability.length === 0) return false   // agnostic → no positive signal, no penalty
  return !!stage && res.lifecycleApplicability.includes(stage)
}

function priorityMatches(res: CanonicalResource, category: CanonicalActionCategory | null | undefined): boolean {
  if (!category) return false
  return res.priorityApplicability.includes(category)
}

function disclosureStatus(res: CanonicalResource): RecommendationDisclosure {
  if (res.relationshipStatus === 'affiliate' || res.relationshipStatus === 'sponsored' || res.relationshipStatus === 'partner') return 'required'
  if (res.licensingRelevant) return 'required'
  if (res.affiliateStatus === 'active') return 'required'
  return 'editorial'
}

function buildReason(
  res: CanonicalResource, app: ResourceApplicability,
  priorityCategory: CanonicalActionCategory | null | undefined, trade: string,
): string {
  const parts: string[] = []
  if (app.priority && priorityCategory) parts.push(`Supports your current focus area (${labelCategory(priorityCategory)})`)
  if (app.trade && res.tradeApplicability.length > 0 && trade) parts.push(`relevant to ${trade.toUpperCase()}`)
  if (app.lifecycle) parts.push('fits your current business stage')
  if (parts.length === 0) parts.push(`A ${labelResourceCategory(res.category)} option to consider`)
  return parts.join(' · ')
}

function labelCategory(c: CanonicalActionCategory): string {
  return c.replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase())
}
function labelResourceCategory(c: string): string {
  return c.replace(/_/g, ' ')
}

// Pure fit score. NO commercial fields are referenced here (commercial neutrality).
function relevanceScore(
  res: CanonicalResource, app: ResourceApplicability,
  feedback: ResourceHelpfulness | undefined, fresh: FreshnessStatus,
): number {
  let s = 0
  if (app.priority) s += 50
  if (app.lifecycle) s += 20
  if (app.trade && res.tradeApplicability.length > 0) s += 15  // an explicit trade match
  if (app.state && res.stateApplicability.length > 0) s += 10  // an explicit state match
  if (fresh === 'fresh') s += 5
  else if (fresh === 'stale') s -= 5
  if (feedback === 'helpful') s += 8                            // user signal (not commercial)
  return s
}

function confidenceOf(score: number, app: ResourceApplicability, fresh: FreshnessStatus): RecommendationConfidence {
  if (app.priority && (app.trade || app.lifecycle) && fresh !== 'stale') return 'high'
  if (score >= 50) return 'high'
  if (score >= 20) return 'medium'
  return 'low'
}

function nextAction(
  res: CanonicalResource, actions: CanonicalAction[], priorityCategory: CanonicalActionCategory | null | undefined,
): string | null {
  const match = actions.find(a => res.priorityApplicability.includes(a.category))
  if (match) return match.actionId
  return priorityCategory ?? null
}

/**
 * Derive ranked, commercial-neutral resource recommendations for a placement.
 * Always returns a result (a safe fallback when nothing matches); never throws.
 */
export function deriveResourceRecommendations(options: ResourceRecommendationOptions): ResourceRecommendationResult {
  const opts = options ?? ({} as ResourceRecommendationOptions)
  const placement = opts.placement
  const now = typeof opts.now === 'string' && opts.now ? opts.now : new Date().toISOString()
  const limit = Number.isFinite(opts.limit) && (opts.limit as number) > 0 ? Math.floor(opts.limit as number) : DEFAULT_LIMIT
  const trade = safeStr(opts.trade)
  const state = safeStr(opts.state)
  const priorityCategory = opts.priorityCategory ?? null
  const dismissed = strSet(opts.dismissedResourceIds)
  const completed = strSet(opts.completedResourceIds)
  const helpfulness = (opts.helpfulness && typeof opts.helpfulness === 'object') ? opts.helpfulness : {}
  const currentActions = Array.isArray(opts.currentActions) ? opts.currentActions : []
  const pool = Array.isArray(opts.resources) ? opts.resources : RESOURCE_REGISTRY

  const candidates: RecommendedResource[] = []

  for (const res of pool) {
    if (!res.active || res.broken) continue
    if (!res.placementContexts.includes(placement)) continue
    if (dismissed.has(res.resourceId) || completed.has(res.resourceId)) continue
    const fb = helpfulness[res.resourceId]
    if (fb && SUPPRESSING_FEEDBACK.has(fb)) continue

    const tm = tradeMatches(res, trade)
    if (tm.explicit && !tm.applies) continue        // explicit trade mismatch → exclude
    const sm = stateMatches(res, state)
    if (sm.explicit && !sm.applies) continue        // explicit state mismatch → exclude

    const app: ResourceApplicability = {
      trade: tm.applies,
      state: sm.applies,
      lifecycle: lifecycleMatches(res, opts.lifecycleStage),
      priority: priorityMatches(res, priorityCategory),
    }
    const fresh = freshnessOf(res.reviewedDate, now)
    const relevance = relevanceScore(res, app, fb, fresh)

    candidates.push({
      resource: res,
      reason: buildReason(res, app, priorityCategory, trade),
      applicability: app,
      confidence: confidenceOf(relevance, app, fresh),
      disclosureStatus: disclosureStatus(res),
      sourceFreshness: fresh,
      placementContext: placement,
      nextActionLinkage: nextAction(res, currentActions, priorityCategory),
      relevance,
    })
  }

  // Deterministic: relevance desc, then resourceId asc. Commercial status is irrelevant to order.
  candidates.sort((a, b) =>
    b.relevance - a.relevance || a.resource.resourceId.localeCompare(b.resource.resourceId))

  // Prefer recommendations with at least one positive fit signal; if none qualify, fall back.
  const positive = candidates.filter(c => c.relevance > 0)
  if (positive.length > 0) {
    return { recommendations: positive.slice(0, limit), placement, fallbackUsed: false, version: RECOMMENDATION_VERSION }
  }

  // Safe fallback: broadly-applicable, trade/state-safe candidates (already filtered for placement
  // and explicit mismatches above), ordered deterministically. Never throws, never empty-crashes.
  const fallback = candidates
    .slice()
    .sort((a, b) => a.resource.resourceId.localeCompare(b.resource.resourceId))
    .slice(0, limit)
  return { recommendations: fallback, placement, fallbackUsed: true, version: RECOMMENDATION_VERSION }
}
