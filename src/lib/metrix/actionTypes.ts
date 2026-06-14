// ─────────────────────────────────────────────────────────────────────────────
// metrix/actionTypes — Wave 5: canonical Action / Evidence / Outcome model (types)
// ─────────────────────────────────────────────────────────────────────────────
// ONE typed, read-only projection shape that unifies the three existing action
// surfaces — the canonical Metrix Priority action steps (Wave 1), the Foundation
// Builder checklist items, and the Customer Growth Engine roadmap actions — into a
// single CanonicalAction for display, recommendation, and outcome linkage.
//
// It is a PROJECTION, not a store. The originating engines remain the source of
// truth for their own persistence (PersistedPriorityProgress, szm_foundation_builder,
// szm_growth_engine). Every original step/item/action id is preserved verbatim in
// `sourceId`. Nothing here recomputes a score, priority, gate, path, or progress engine.
//
// Pure types only — no logic, no React/Next/Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProgressStatus } from './profileTypes'

export const ACTION_MODEL_VERSION = 1

// Which existing engine an action was projected from.
export type CanonicalActionSource =
  | 'metrix_priority'      // Wave 1 canonical primary action steps (the authoritative next-action)
  | 'foundation_builder'   // Foundation Builder checklist item
  | 'growth_engine'        // Customer Growth Engine roadmap action
  | 'licensing'            // Wave 4 verification step (optional projection)

// Neutral, stable action categories spanning Foundation + Growth + Priority work.
export type CanonicalActionCategory =
  | 'business_formation'
  | 'licensing_registration'
  | 'insurance'
  | 'banking_accounting'
  | 'pricing'
  | 'customer_acquisition'
  | 'operations'
  | 'tools_software'
  | 'safety_compliance'
  | 'documentation'
  | 'growth'
  | 'general'

// Completion status reuses the canonical ProgressStatus union (no competing states).
export type ActionCompletionStatus = ProgressStatus

// Relative urgency carried from the source engine (never a new scoring axis).
export type ActionSourcePriority = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

// Who owns the underlying record (device-local vs account-synced vs not yet known).
export type ActionOwner = 'device' | 'account' | 'unknown'

// ── Evidence ────────────────────────────────────────────────────────────────
export type CanonicalEvidenceState = 'not_requested' | 'pending' | 'provided'
export interface CanonicalEvidence {
  key: string
  label: string
  state: CanonicalEvidenceState
}

// ── Outcome + verification ────────────────────────────────────────────────────
export type CanonicalOutcomeType =
  | 'none'           // no outcome recorded
  | 'milestone'      // a discrete completed milestone
  | 'metric'         // a numeric value the user voluntarily reported
  | 'verification'   // an external/official verification step
  | 'self_reported'  // a qualitative self-report

// Bounded — never claim "verified" without backing evidence.
export type VerificationStatus =
  | 'unverified'
  | 'self_reported'
  | 'evidence_backed'
  | 'official_verified'
  | 'not_applicable'

export interface CanonicalOutcome {
  type: CanonicalOutcomeType
  value: string | number | null
  unit: string | null
  verification: VerificationStatus
  reportedAt: string | null
}

// ── Provenance (preserves the original id + source ruleset) ────────────────────
export interface CanonicalActionProvenance {
  source: CanonicalActionSource
  sourceId: string                 // ORIGINAL step/item/action id — preserved verbatim
  rulesetVersion: number | null
  derivedAt: string
}

// Link back into the canonical progress record (only set for Metrix Priority actions).
export interface ActionProgressLinkage {
  priorityId: string
  profileId: string
}

// ── The unified action ─────────────────────────────────────────────────────────
export interface CanonicalAction {
  actionId: string                       // namespaced stable id: `${source}:${sourceId}`
  sourceId: string                       // original id, preserved verbatim
  category: CanonicalActionCategory
  title: string
  detail: string
  sourcePriority: ActionSourcePriority
  pathId: string | null                  // completion-path / phase / bucket linkage (if any)
  tradeApplicability: string[]           // [] = all trades
  stateApplicability: string[]           // [] = all states
  lifecycleApplicability: string[]       // [] = all stages
  prerequisites: string[]                // original prerequisite ids
  blocked: boolean
  blockedReason: string | null
  status: ActionCompletionStatus
  evidence: CanonicalEvidence[]
  notes: string | null
  startedAt: string | null
  updatedAt: string | null
  completedAt: string | null
  owner: ActionOwner
  progressLinkage: ActionProgressLinkage | null
  outcome: CanonicalOutcome
  verificationStatus: VerificationStatus
  provenance: CanonicalActionProvenance
  resourceAssociations: string[]         // associated resource/vendor ids (preserved)
}

// A safe empty outcome — used as the default for actions with no recorded outcome.
export const EMPTY_OUTCOME: CanonicalOutcome = {
  type: 'none',
  value: null,
  unit: null,
  verification: 'not_applicable',
  reportedAt: null,
}
