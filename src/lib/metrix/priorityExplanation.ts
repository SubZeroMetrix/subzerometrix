// ─────────────────────────────────────────────────────────────────────────────
// metrix/priorityExplanation — rich, explainable priority detail (Wave 2, pure)
// ─────────────────────────────────────────────────────────────────────────────
// A deeper, display-ready explanation of WHY the canonical primary priority was selected —
// composed purely from the snapshot the canonical engine already produced. It never
// re-selects or re-ranks the priority; it explains the existing one. Covers: why selected,
// the inputs + rules that influenced it, critical-gate involvement, missing information,
// confidence + completeness, what could change the recommendation, and (when a reassessment
// diff is supplied) what stayed unchanged. Deterministic and malformed/legacy-safe.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'
import type { PriorityExplanationDetail, ExplainGateInvolvement } from './intelligenceTypes'
import { deriveCompleteness, deriveEvidenceConfidence } from './profileCompleteness'

const TIER_RULE =
  'Ranked by the fixed priority order: legal/paid-work blockers → financial survival → ' +
  'foundation prerequisites → delivery & capacity → customer path → systems → growth.'

export interface ExplainOptions {
  /** "What stayed the same" lines from a reassessment diff (diff.unchanged), if any. */
  unchanged?: string[]
}

export function explainPriorityDetail(
  s: MetrixProfileSnapshot,
  opts: ExplainOptions = {},
): PriorityExplanationDetail {
  const p = s?.metrixPriority
  const gates = Array.isArray(s?.criticalGates) ? s.criticalGates : []
  const gateById = new Map(gates.map(g => [g.id, g]))
  const questions = Array.isArray(s?.nextBestQuestions) ? s.nextBestQuestions : []

  // Defensive default for a malformed/legacy snapshot with no priority.
  if (!p) {
    return {
      title: 'No active priority',
      requiredOutcome: '',
      whySelected: 'This saved profile has no current priority. Re-take the assessment to generate one.',
      inputsAndRules: [], gateInvolvement: [], missingInformation: [],
      evidenceStatus: 'no_evidence',
      evidenceConfidence: deriveEvidenceConfidence(s),
      completeness: deriveCompleteness(s),
      whatCouldChange: [], whatStayedUnchanged: opts.unchanged ?? [],
    }
  }

  // Inputs + rules that influenced the selection.
  const inputsAndRules: string[] = [TIER_RULE]
  const sourceGates = (p.sourceGateIds ?? []).map(id => gateById.get(id)).filter(Boolean)
  if (sourceGates.length > 0) {
    inputsAndRules.push(`Driven by: ${sourceGates.map(g => g!.title).join(', ')}.`)
  } else if ((p.sourceConstraintIds ?? []).length > 0) {
    inputsAndRules.push(`No critical gate is triggered, so it follows your highest-leverage weak area (${p.sourceConstraintIds.join(', ')}).`)
  }
  for (const code of p.reasonCodes ?? []) inputsAndRules.push(`Reason code: ${code}`)

  // Critical-gate involvement (the gates feeding this priority).
  const gateInvolvement: ExplainGateInvolvement[] = sourceGates.map(g => ({
    id: g!.id, domain: g!.domain, title: g!.title, status: g!.status, severity: g!.severity,
  }))

  // Missing information that bears on THIS priority.
  const missingInformation: string[] = []
  const seenMissing = new Set<string>()
  for (const q of questions) {
    const relatesToPriority = q.relatedGateId != null && (p.sourceGateIds ?? []).includes(q.relatedGateId)
    if ((relatesToPriority || q.expectedDecisionImpact === 'changes_priority') && !seenMissing.has(q.reason)) {
      seenMissing.add(q.reason)
      missingInformation.push(q.reason)
    }
  }
  const firstStep = (Array.isArray(s?.primaryActionSteps) ? s.primaryActionSteps : [])[0]
  for (const ev of firstStep?.evidenceRequested ?? []) {
    const line = `Evidence not yet provided: ${ev}.`
    if (!seenMissing.has(line)) { seenMissing.add(line); missingInformation.push(line) }
  }

  // What could change the recommendation.
  const whatCouldChange: string[] = []
  const seenChange = new Set<string>()
  for (const q of questions) {
    if (q.expectedDecisionImpact === 'changes_priority' && !seenChange.has(q.reason)) {
      seenChange.add(q.reason); whatCouldChange.push(q.reason)
    }
  }
  // Unconfirmed gates that, if confirmed, could outrank the current priority.
  for (const g of gates) {
    if ((g.status === 'possible' || g.status === 'unknown') && g.blocksPaidWork) {
      const line = `Confirming "${g.title}" could change your top priority.`
      if (!seenChange.has(line)) { seenChange.add(line); whatCouldChange.push(line) }
    }
  }
  if (whatCouldChange.length === 0) {
    whatCouldChange.push('Updating your answers (re-taking the assessment) is what would change this recommendation.')
  }

  return {
    title: p.title,
    requiredOutcome: p.requiredOutcome,
    whySelected: p.rationale,
    inputsAndRules,
    gateInvolvement,
    missingInformation,
    evidenceStatus: p.evidenceStatus,
    evidenceConfidence: deriveEvidenceConfidence(s),
    completeness: deriveCompleteness(s),
    whatCouldChange,
    whatStayedUnchanged: opts.unchanged ?? [],
  }
}
