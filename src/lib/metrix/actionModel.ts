// ─────────────────────────────────────────────────────────────────────────────
// metrix/actionModel — Wave 5: deterministic projections into CanonicalAction
// ─────────────────────────────────────────────────────────────────────────────
// Pure, defensive adapters that PROJECT the three existing action surfaces into the
// unified CanonicalAction shape. They read; they never write, never mutate the source
// records, and never recompute a score/priority/gate/path/progress engine. All original
// ids are preserved verbatim in `sourceId`. Every function tolerates null, malformed,
// and legacy input and returns [] rather than throwing.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MetrixProfileSnapshot, ActionStep, GateDomain, GateSeverity,
} from './profileTypes'
import type { PersistedPriorityProgress } from './progressRecord'
import type { FoundationChecklistItem, FoundationCategoryId } from '../foundationBuilder'
import type { GrowthRoadmap, GrowthAction, GrowthPriority } from '../growthEngine'
import {
  ACTION_MODEL_VERSION, EMPTY_OUTCOME,
  type CanonicalAction, type CanonicalActionCategory, type ActionSourcePriority,
  type ActionCompletionStatus, type CanonicalEvidence, type VerificationStatus,
} from './actionTypes'

const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])

const KNOWN_PRIORITIES: ReadonlySet<string> = new Set(['critical', 'high', 'medium', 'low'])
function asSourcePriority(p: unknown): ActionSourcePriority {
  return typeof p === 'string' && KNOWN_PRIORITIES.has(p) ? (p as ActionSourcePriority) : 'unknown'
}

// ── Metrix Priority action steps → CanonicalAction ─────────────────────────────
const DOMAIN_TO_CATEGORY: Record<GateDomain, CanonicalActionCategory> = {
  licensing: 'licensing_registration',
  entity: 'business_formation',
  insurance: 'insurance',
  banking: 'banking_accounting',
  financial_visibility: 'banking_accounting',
  pricing: 'pricing',
  customer_path: 'customer_acquisition',
  capacity: 'operations',
  quality: 'operations',
  owner_dependency: 'operations',
  data_quality: 'documentation',
  growth: 'growth',
}

const SEVERITY_TO_PRIORITY: Record<GateSeverity, ActionSourcePriority> = {
  blocking: 'critical',
  critical: 'critical',
  high: 'high',
  moderate: 'medium',
  informational: 'low',
}

// Map the canonical priority evidenceStatus to a bounded verification status.
function verificationFromEvidence(status: string | undefined): VerificationStatus {
  switch (status) {
    case 'evidence_backed': return 'evidence_backed'
    case 'partial_evidence': return 'self_reported'
    case 'low_evidence':
    case 'no_evidence': return 'unverified'
    default: return 'unverified'
  }
}

/**
 * Project the canonical primary action steps + the user's PersistedPriorityProgress
 * into CanonicalActions. This is the AUTHORITATIVE next-action surface; it is never
 * outranked by Foundation/Growth projections. `progress` may be null (not started).
 */
export function projectPriorityActions(
  snapshot: MetrixProfileSnapshot | null | undefined,
  progress: PersistedPriorityProgress | null | undefined,
  now: string,
): CanonicalAction[] {
  if (!snapshot || !Array.isArray(snapshot.primaryActionSteps)) return []
  const priority = snapshot.metrixPriority
  if (!priority || !isStr(priority.priorityId)) return []

  const category = DOMAIN_TO_CATEGORY[priority.domain] ?? 'general'
  const sourcePriority = SEVERITY_TO_PRIORITY[priority.severity] ?? 'unknown'
  const completed = new Set(arr<string>(progress?.completedStepIds))
  const evidenceStates = (progress?.evidenceStates ?? {}) as Record<string, string>
  const owner = progress?.source === 'account' ? 'account' : progress ? 'device' : 'unknown'
  const verification = verificationFromEvidence(snapshot.priorityProgress?.evidenceStatus)

  const steps = [...snapshot.primaryActionSteps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return steps
    .filter((s): s is ActionStep => !!s && isStr(s.stepId))
    .map(step => {
      const isDone = completed.has(step.stepId)
      // Blocked when an EARLIER blocking step is still incomplete (mirrors progressRecord).
      const earlierBlockersIncomplete = steps.some(
        o => o.blocking && (o.order ?? 0) < (step.order ?? 0) && !completed.has(o.stepId),
      )
      const blocked = !isDone && earlierBlockersIncomplete
      const status: ActionCompletionStatus = isDone ? 'completed' : blocked ? 'blocked' : 'not_started'
      const evidence: CanonicalEvidence[] = arr<string>(step.evidenceRequested).map(key => ({
        key,
        label: key,
        state: evidenceStates[key] === 'provided' ? 'provided' : 'pending',
      }))
      return {
        actionId: `metrix_priority:${step.stepId}`,
        sourceId: step.stepId,
        category,
        title: step.title ?? step.stepId,
        detail: step.instruction ?? step.purpose ?? '',
        sourcePriority,
        pathId: progress?.selectedPathId ?? snapshot.recommendedCompletionPathId ?? null,
        tradeApplicability: [],
        stateApplicability: [],
        lifecycleApplicability: [],
        prerequisites: arr<string>(step.prerequisites),
        blocked,
        blockedReason: blocked ? 'An earlier required step is not complete yet.' : null,
        status,
        evidence,
        notes: null,
        startedAt: progress?.startedAt ?? null,
        updatedAt: progress?.updatedAt ?? null,
        completedAt: isDone ? (progress?.completedAt ?? null) : null,
        owner,
        progressLinkage: { priorityId: priority.priorityId, profileId: snapshot.profileId },
        outcome: EMPTY_OUTCOME,
        verificationStatus: isDone ? verification : 'unverified',
        provenance: {
          source: 'metrix_priority',
          sourceId: step.stepId,
          rulesetVersion: step.rulesetVersion ?? snapshot.rulesetVersion ?? null,
          derivedAt: now,
        },
        resourceAssociations: [],
      }
    })
}

// ── Foundation Builder items → CanonicalAction ─────────────────────────────────
const FOUNDATION_CATEGORY_MAP: Record<FoundationCategoryId, CanonicalActionCategory> = {
  business_identity: 'business_formation',
  domain_website: 'customer_acquisition',
  business_email: 'tools_software',
  legal_entity: 'business_formation',
  tax_ein: 'business_formation',
  banking_bookkeeping: 'banking_accounting',
  licensing_insurance: 'licensing_registration',
  brand_profiles: 'customer_acquisition',
  google_business_profile: 'customer_acquisition',
  operations: 'operations',
  pricing_sales: 'pricing',
  tech_stack: 'tools_software',
  launch_readiness: 'documentation',
  weekly_review: 'documentation',
}

function foundationStatus(item: FoundationChecklistItem): ActionCompletionStatus {
  if (item.completed) return 'completed'
  if (item.stage === 'blocked' || item.status === 'blocked') return 'blocked'
  if (item.status === 'in_progress') return 'in_progress'
  return 'not_started'
}

/** Project Foundation Builder checklist items into CanonicalActions (read-only). */
export function projectFoundationActions(
  items: readonly FoundationChecklistItem[] | null | undefined,
  now: string,
): CanonicalAction[] {
  if (!Array.isArray(items)) return []
  return items
    .filter((i): i is FoundationChecklistItem => !!i && isStr(i.id))
    .map(item => {
      const status = foundationStatus(item)
      const blocked = status === 'blocked'
      const priority = asSourcePriority(item.priority)
      return {
        actionId: `foundation_builder:${item.id}`,
        sourceId: item.id,
        category: FOUNDATION_CATEGORY_MAP[item.category] ?? 'general',
        title: item.stepName ?? item.id,
        detail: '',
        sourcePriority: priority,
        pathId: item.sectionId ?? null,
        tradeApplicability: isStr(item.trade) ? [item.trade] : [],
        stateApplicability: [],
        lifecycleApplicability: [],
        prerequisites: [],
        blocked,
        blockedReason: blocked ? (item.blockedReason ?? null) : null,
        status,
        evidence: [],
        notes: item.note ?? null,
        startedAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
        completedAt: item.completed ? (item.completedAt ?? null) : null,
        owner: 'device' as const,
        progressLinkage: null,
        outcome: item.completed
          ? { type: 'milestone' as const, value: item.stepName ?? null, unit: null, verification: 'self_reported' as const, reportedAt: item.completedAt ?? null }
          : EMPTY_OUTCOME,
        verificationStatus: (item.completed ? 'self_reported' : 'unverified') as VerificationStatus,
        provenance: {
          source: 'foundation_builder' as const,
          sourceId: item.id,
          rulesetVersion: null,
          derivedAt: now,
        },
        resourceAssociations: [],
      }
    })
}

// ── Growth Engine roadmap actions → CanonicalAction ────────────────────────────
function growthPriority(p: GrowthPriority | undefined): ActionSourcePriority {
  return asSourcePriority(p)
}

/**
 * Project the Growth Engine roadmap actions into CanonicalActions. Growth actions are
 * recommendations (no per-action persistence in the engine), so they always project as
 * `not_started` with no false completion. They are subordinate to the Metrix Priority.
 */
export function projectGrowthActions(
  roadmap: GrowthRoadmap | null | undefined,
  now: string,
): CanonicalAction[] {
  const actions = roadmap && Array.isArray(roadmap.actions) ? roadmap.actions : []
  return actions
    .filter((a): a is GrowthAction => !!a && isStr(a.id))
    .map(a => ({
      actionId: `growth_engine:${a.id}`,
      sourceId: a.id,
      category: 'growth' as const,
      title: a.label ?? a.id,
      detail: a.why ?? '',
      sourcePriority: growthPriority(a.priority),
      pathId: isStr(a.bucket) ? a.bucket : null,
      tradeApplicability: [],
      stateApplicability: [],
      lifecycleApplicability: [],
      prerequisites: [],
      blocked: false,
      blockedReason: null,
      status: 'not_started' as ActionCompletionStatus,
      evidence: [],
      notes: null,
      startedAt: null,
      updatedAt: null,
      completedAt: null,
      owner: 'device' as const,
      progressLinkage: null,
      outcome: EMPTY_OUTCOME,
      verificationStatus: 'not_applicable' as VerificationStatus,
      provenance: {
        source: 'growth_engine' as const,
        sourceId: a.id,
        rulesetVersion: null,
        derivedAt: now,
      },
      resourceAssociations: [],
    }))
}

// ── Unified collection ─────────────────────────────────────────────────────────
export interface CollectActionsInput {
  snapshot?: MetrixProfileSnapshot | null
  priorityProgress?: PersistedPriorityProgress | null
  foundationItems?: readonly FoundationChecklistItem[] | null
  growthRoadmap?: GrowthRoadmap | null
  now?: string
}

/**
 * Collect every projected action into one deterministic, de-duplicated list.
 * Ordering is stable: Metrix Priority actions first (the authoritative work), then
 * Foundation, then Growth — preserving each engine's own internal order. De-dup is by
 * `actionId`; the first occurrence (highest-authority source) wins.
 */
export function collectCanonicalActions(input: CollectActionsInput): CanonicalAction[] {
  const now = input.now ?? new Date().toISOString()
  const all = [
    ...projectPriorityActions(input.snapshot, input.priorityProgress, now),
    ...projectFoundationActions(input.foundationItems, now),
    ...projectGrowthActions(input.growthRoadmap, now),
  ]
  const seen = new Set<string>()
  const out: CanonicalAction[] = []
  for (const a of all) {
    if (seen.has(a.actionId)) continue
    seen.add(a.actionId)
    out.push(a)
  }
  return out
}

export { ACTION_MODEL_VERSION }
