// ─────────────────────────────────────────────────────────────────────────────
// metrix/intelligenceTypes — Wave 2 Profile Intelligence types (pure types only)
// ─────────────────────────────────────────────────────────────────────────────
// The shapes for the additive, deterministic intelligence layer derived ON TOP of the
// canonical snapshot. No logic here. Names are chosen to avoid clashing with existing
// canonical types (e.g. ReassessmentTrigger in reassessment.ts, PriorityExplanation in
// readModel.ts). The intelligence layer NEVER recomputes scoring/gate/priority/path/
// reassessment policy — it only projects the canonical snapshot into richer, explainable form.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleAssessment } from './lifecycle'
import type {
  CoverageLevel, EvidenceStatus, GateDomain, GateSeverity, GateStatus, NextBestQuestion,
} from './profileTypes'

export const INTELLIGENCE_VERSION = 1

// ── Completeness (honest answered/total ratio — NOT a fabricated confidence %) ──
export interface ProfileCompleteness {
  answered: number
  total: number
  percent: number          // round(answered/total*100)
  level: CoverageLevel     // minimal | partial | substantial
}

// ── Evidence confidence (categorical; honest about inferred-only data) ─────────
export type EvidenceConfidence = 'high' | 'medium' | 'low'

// ── Known facts vs. important unknowns ─────────────────────────────────────────
export interface KnownFact {
  key: string
  label: string
  value: string
}
export interface ImportantUnknown {
  key: string
  label: string
  reason: string
  impact: 'changes_priority' | 'confirms_gate' | 'refines_roadmap' | 'improves_confidence'
}

// ── Risks / needs / gaps (projections of gates + constraints; no new scoring) ──
export interface ProfileRisk {
  id: string
  label: string
  severity: GateSeverity | 'low' | 'moderate' | 'high'
  source: 'gate' | 'constraint'
}
export interface ProfileNeed {
  id: string
  label: string
  reason: string
}
export interface ProfileGap {
  id: string
  label: string
  reason: string
}

// ── Versions carried by the intelligence layer ─────────────────────────────────
export interface ProfileVersions {
  profileSchemaVersion: number
  scoringVersion: number
  rulesetVersion: number
  lifecycleVersion: number
  intelligenceVersion: number
}

// ── Profile history (trajectory derived from reassessment records) ─────────────
export interface ProfileHistoryPoint {
  at: string
  overall: number
  priorityId: string
  priorityChanged: boolean
  trigger: string
}

// ── Reassessment triggers (when to revisit; projected, not the loop's own type) ─
export interface ReassessmentSignal {
  id: string
  label: string
  condition: string
}

// ── Outcome definitions (what "done" means for the active + next priorities) ───
export interface OutcomeDefinition {
  id: string
  label: string
  definition: string
  completionCriteria: string
  evidenceRequested: string[]
}

// ── Rich priority explainability ───────────────────────────────────────────────
export interface ExplainGateInvolvement {
  id: string
  domain: GateDomain
  title: string
  status: GateStatus
  severity: GateSeverity
}
export interface PriorityExplanationDetail {
  title: string
  requiredOutcome: string
  whySelected: string
  inputsAndRules: string[]      // reason codes + the tier rule + which inputs fed it
  gateInvolvement: ExplainGateInvolvement[]
  missingInformation: string[]  // what we still don't know that bears on this priority
  evidenceStatus: EvidenceStatus
  evidenceConfidence: EvidenceConfidence
  completeness: ProfileCompleteness
  whatCouldChange: string[]     // answers/events that could change the recommendation
  whatStayedUnchanged: string[] // populated from a reassessment diff when provided; else []
}

// ── The composite intelligence object (one canonical adapter output) ───────────
export interface ProfileIntelligence {
  profileId: string
  lifecycle: LifecycleAssessment
  completeness: ProfileCompleteness
  evidenceConfidence: EvidenceConfidence
  knownFacts: KnownFact[]
  importantUnknowns: ImportantUnknown[]
  risks: ProfileRisk[]
  needs: ProfileNeed[]
  gaps: ProfileGap[]
  nextBestQuestions: NextBestQuestion[]   // progressively selected (deduped, bounded)
  reassessmentTriggers: ReassessmentSignal[]
  outcomeDefinitions: OutcomeDefinition[]
  priorityExplanation: PriorityExplanationDetail
  versions: ProfileVersions
}
