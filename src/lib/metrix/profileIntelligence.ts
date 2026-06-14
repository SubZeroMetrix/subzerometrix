// ─────────────────────────────────────────────────────────────────────────────
// metrix/profileIntelligence — the one Wave 2 intelligence composer (pure adapter)
// ─────────────────────────────────────────────────────────────────────────────
// Composes the additive intelligence layer from the canonical snapshot via the other
// pure Wave 2 modules (lifecycle, completeness, progressive questions, explanation). This
// is a CANONICAL ADAPTER: it never recomputes scoring/gate/priority/path/reassessment
// policy — it reads the one snapshot and projects it into richer, explainable form. Also
// derives reassessment triggers, outcome definitions, and profile history (trajectory).
// Deterministic; defensive against malformed/legacy snapshots.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SCORING_VERSION, type MetrixProfileSnapshot,
} from './profileTypes'
import { LIFECYCLE_VERSION, assessLifecycle } from './lifecycle'
import {
  INTELLIGENCE_VERSION,
  type ProfileIntelligence, type ReassessmentSignal, type OutcomeDefinition,
  type ProfileHistoryPoint, type ProfileVersions,
} from './intelligenceTypes'
import {
  deriveCompleteness, deriveEvidenceConfidence, deriveKnownFacts,
  deriveImportantUnknowns, deriveRisks, deriveNeeds, deriveGaps,
} from './profileCompleteness'
import { selectProgressiveQuestions, type ProgressiveQuestionOptions } from './progressiveQuestions'
import { explainPriorityDetail } from './priorityExplanation'
import type { ReassessmentRecord } from './reassessment'

// ── Reassessment triggers (when to revisit — projected, not the loop's own type) ─
export function deriveReassessmentTriggers(s: MetrixProfileSnapshot): ReassessmentSignal[] {
  const out: ReassessmentSignal[] = []
  const p = s?.metrixPriority
  if (p?.reassessmentTrigger) {
    out.push({ id: 'priority_resolved', label: 'When you finish your current priority', condition: p.reassessmentTrigger })
  }
  out.push({
    id: 'situation_changed',
    label: 'When your situation changes',
    condition: 'Re-take the assessment if your trade, stage, licensing, finances, team, or customer path change.',
  })
  // Unconfirmed gates that could change the priority once confirmed.
  for (const g of Array.isArray(s?.criticalGates) ? s.criticalGates : []) {
    if ((g.status === 'possible' || g.status === 'unknown') && g.blocksPaidWork) {
      out.push({ id: `confirm_${g.domain}`, label: `When you can confirm ${g.title.toLowerCase()}`, condition: `Confirming this may change your top priority.` })
    }
  }
  return out
}

// ── Outcome definitions (what "done" means for the active + queued priorities) ──
export function deriveOutcomeDefinitions(s: MetrixProfileSnapshot, limit = 3): OutcomeDefinition[] {
  const out: OutcomeDefinition[] = []
  const p = s?.metrixPriority
  const firstStep = (Array.isArray(s?.primaryActionSteps) ? s.primaryActionSteps : [])[0]
  if (p) {
    out.push({
      id: p.priorityId,
      label: p.title,
      definition: p.requiredOutcome,
      completionCriteria: p.completionCriteria,
      evidenceRequested: Array.isArray(firstStep?.evidenceRequested) ? firstStep!.evidenceRequested : [],
    })
  }
  for (const sp of Array.isArray(s?.secondaryPriorities) ? s.secondaryPriorities : []) {
    if (out.length >= limit) break
    out.push({
      id: sp.priorityId, label: sp.title, definition: sp.requiredOutcome,
      completionCriteria: sp.completionCriteria, evidenceRequested: [],
    })
  }
  return out
}

// ── Profile history (trajectory derived from reassessment records) ─────────────
export function deriveProfileHistory(
  records: ReassessmentRecord[],
  s: MetrixProfileSnapshot,
): ProfileHistoryPoint[] {
  const recs = Array.isArray(records) ? records : []
  if (recs.length === 0) {
    return [{
      at: s?.createdAt ?? '',
      overall: typeof s?.readiness?.overall === 'number' ? s.readiness.overall : 0,
      priorityId: s?.metrixPriority?.priorityId ?? '',
      priorityChanged: false,
      trigger: 'initial',
    }]
  }
  return recs.map(r => ({
    at: r.reassessedAt,
    overall: r.newOverall,
    priorityId: r.newPriorityId,
    priorityChanged: r.priorityChanged,
    trigger: r.trigger,
  }))
}

function versions(s: MetrixProfileSnapshot): ProfileVersions {
  return {
    profileSchemaVersion: typeof s?.profileSchemaVersion === 'number' ? s.profileSchemaVersion : 0,
    scoringVersion: typeof s?.scoringVersion === 'number' ? s.scoringVersion : SCORING_VERSION,
    rulesetVersion: typeof s?.rulesetVersion === 'number' ? s.rulesetVersion : 0,
    lifecycleVersion: LIFECYCLE_VERSION,
    intelligenceVersion: INTELLIGENCE_VERSION,
  }
}

export interface ProfileIntelligenceOptions extends ProgressiveQuestionOptions {
  /** Reassessment history records (for profile-history trajectory). */
  reassessmentRecords?: ReassessmentRecord[]
  /** "What stayed the same" lines from a reassessment diff (diff.unchanged). */
  unchanged?: string[]
}

/**
 * The single composed intelligence object for a snapshot. Pure adapter — given the same
 * snapshot + options, the output is identical. Never throws on malformed/legacy input.
 */
export function deriveProfileIntelligence(
  s: MetrixProfileSnapshot,
  opts: ProfileIntelligenceOptions = {},
): ProfileIntelligence {
  return {
    profileId: s?.profileId ?? '',
    lifecycle: assessLifecycle(s),
    completeness: deriveCompleteness(s),
    evidenceConfidence: deriveEvidenceConfidence(s),
    knownFacts: deriveKnownFacts(s),
    importantUnknowns: deriveImportantUnknowns(s),
    risks: deriveRisks(s),
    needs: deriveNeeds(s),
    gaps: deriveGaps(s),
    nextBestQuestions: selectProgressiveQuestions(s, opts),
    reassessmentTriggers: deriveReassessmentTriggers(s),
    outcomeDefinitions: deriveOutcomeDefinitions(s),
    priorityExplanation: explainPriorityDetail(s, { unchanged: opts.unchanged }),
    versions: versions(s),
  }
}
