// ─────────────────────────────────────────────────────────────────────────────
// metrix/nextBestQuestions — progressive-profiling candidates (SZM-2, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Returns a bounded, ranked list of the questions/evidence that would most improve the
// NEXT decision — derived only from unresolved gates, missing evidence, low-confidence
// priority, conflicts, and stage. NOT random profile-completion. Every candidate explains
// how its answer could change the priority, gate, or roadmap. Deterministic. No UI here.
// ─────────────────────────────────────────────────────────────────────────────

import {
  type CriticalGate, type GateDomain, type MetrixPriority,
  type NextBestQuestion, type QuestionImpact, type QuestionUrgency, type QuestionDataStatus,
} from './profileTypes'
import { DOMAIN_BASE_TIER } from './metrixPriority'

interface Template { questionKey: string; evidenceKey: string; reason: string }

// Only gates whose answer is genuinely unknown/uncertain produce a question.
const TEMPLATES: Partial<Record<GateDomain, Template>> = {
  licensing: { questionKey: 'license_status', evidenceKey: 'license_status_confirmed', reason: 'Confirming your trade license/permit status can gate paid work and may change your top priority.' },
  pricing: { questionKey: 'pricing_confidence', evidenceKey: 'pricing_confidence', reason: 'Whether your prices reliably cover costs + margin decides if pricing outranks adding demand.' },
  financial_visibility: { questionKey: 'financial_tracking', evidenceKey: 'cash_flow_view', reason: 'Whether you track bookkeeping/cash flow sharpens the financial priority and roadmap.' },
  capacity: { questionKey: 'capacity_status', evidenceKey: 'at_capacity', reason: 'If you are at capacity, fixing fulfillment outranks generating more leads.' },
  quality: { questionKey: 'quality_tracking', evidenceKey: 'callback_rate', reason: 'A high callback/low-review rate would outrank growth work.' },
  owner_dependency: { questionKey: 'owner_workload', evidenceKey: 'owner_hours', reason: 'How dependent the business is on you personally caps how safely it can grow.' },
  customer_path: { questionKey: 'lead_source', evidenceKey: 'lead_source_confirmed', reason: 'Confirming a reliable lead source sets the acquisition priority.' },
  data_quality: { questionKey: 'clarify_conflict', evidenceKey: 'conflicting_answers', reason: 'Some answers conflict — confirming your real situation could change the priority.' },
}

function primaryTier(p: MetrixPriority): number {
  return p.severity === 'blocking' ? 1 : DOMAIN_BASE_TIER[p.domain]
}

const IMPACT_RANK: Record<QuestionImpact, number> = {
  changes_priority: 0, confirms_gate: 1, refines_roadmap: 2, improves_confidence: 3,
}

export function deriveNextBestQuestions(
  gates: CriticalGate[],
  primary: MetrixPriority,
): NextBestQuestion[] {
  const pTier = primaryTier(primary)
  const out: NextBestQuestion[] = []

  for (const g of gates) {
    const tpl = TEMPLATES[g.domain]
    if (!tpl) continue

    // Conflicts (data_quality triggered) → clarification candidate.
    const isConflict = g.domain === 'data_quality' && g.status === 'triggered'
    // Otherwise only ask when the gate is genuinely unconfirmed.
    if (!isConflict && g.status !== 'possible' && g.status !== 'unknown') continue
    // Don't re-ask a gate that is already the answered basis of the primary priority.
    if (!isConflict && primary.sourceGateIds.includes(g.id)) continue

    const potentialTier = g.domain === 'licensing' ? 1 : DOMAIN_BASE_TIER[g.domain]
    let impact: QuestionImpact
    let urgency: QuestionUrgency
    let blocking = false
    let dataStatus: QuestionDataStatus

    if (isConflict) {
      impact = 'changes_priority'; urgency = 'now'; blocking = false; dataStatus = 'conflicting'
    } else if (potentialTier < pTier) {
      // Confirming this could outrank the current primary → highest impact.
      impact = 'changes_priority'; urgency = 'now'; blocking = true
      dataStatus = g.status === 'unknown' ? 'missing' : 'uncertain'
    } else if (potentialTier === pTier) {
      impact = 'confirms_gate'; urgency = 'soon'
      dataStatus = g.status === 'unknown' ? 'missing' : 'uncertain'
    } else {
      impact = 'refines_roadmap'; urgency = 'later'
      dataStatus = g.status === 'unknown' ? 'missing' : 'uncertain'
    }

    out.push({
      candidateId: `q_${g.domain}`,
      questionKey: tpl.questionKey,
      evidenceKey: tpl.evidenceKey,
      reason: tpl.reason,
      relatedGateId: g.id,
      expectedDecisionImpact: impact,
      urgency,
      blocking,
      currentDataStatus: dataStatus,
      rank: 0,
    })
  }

  // Low-confidence primary → one "improve confidence" candidate (evidence-driven, not random).
  if (primary.evidenceStatus === 'low_evidence' && !out.some(q => q.expectedDecisionImpact === 'improves_confidence')) {
    out.push({
      candidateId: 'q_confidence',
      questionKey: 'profile_completion',
      evidenceKey: 'profile_coverage',
      reason: 'Your profile is sparse; a few targeted answers would raise confidence in this priority.',
      relatedGateId: null,
      expectedDecisionImpact: 'improves_confidence',
      urgency: 'later',
      blocking: false,
      currentDataStatus: 'low_confidence',
      rank: 0,
    })
  }

  // Rank: highest decision impact first, then potential tier (most serious first).
  out.sort((a, b) =>
    IMPACT_RANK[a.expectedDecisionImpact] - IMPACT_RANK[b.expectedDecisionImpact]
    || (a.relatedGateId ? DOMAIN_BASE_TIER[gateDomainOf(gates, a.relatedGateId)] : 99)
       - (b.relatedGateId ? DOMAIN_BASE_TIER[gateDomainOf(gates, b.relatedGateId)] : 99))
  return out.map((q, i) => ({ ...q, rank: i + 1 }))
}

function gateDomainOf(gates: CriticalGate[], id: string): GateDomain {
  return gates.find(g => g.id === id)?.domain ?? 'growth'
}
