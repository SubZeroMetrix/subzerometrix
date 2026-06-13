// ─────────────────────────────────────────────────────────────────────────────
// metrix/metrixPriority — the single deterministic Metrix Priority policy (SZM-2)
// ─────────────────────────────────────────────────────────────────────────────
// Selects exactly ONE active primary priority — "the most important business outcome to
// work on next, and why" — by ranking triggered critical gates against a fixed tier order:
//   1 legal/licensing/safety/paid-work blockers
//   2 financial survival / severe pricing
//   3 foundation dependencies (before launch/growth)
//   4 capacity / quality / delivery
//   5 customer acquisition / sales
//   6 efficiency / systems
//   7 longer-term growth
// A lower-priority weakness never outranks a more serious gate. When NO gate is triggered,
// the priority is the highest outcome-leverage area (never artificial foundation work).
// Pure + deterministic + versioned + explainable.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RULESET_VERSION,
  type CriticalGate, type GateDomain, type GateSeverity, type MetrixPriority,
  type BlockedRecommendation, type ConstraintCandidate, type ReadinessIndicators,
  type NormalizedAssessment, type ProfileQuality, type EvidenceStatus,
} from './profileTypes'
import { GATE_DOMAIN_CATEGORY } from './gates'
import { CATEGORY_LABELS, type MetrixCategory } from '../metrixEngine'

export const DOMAIN_BASE_TIER: Record<GateDomain, number> = {
  licensing: 1, insurance: 1, entity: 3, banking: 3,
  financial_visibility: 2, pricing: 2, capacity: 4, quality: 4,
  customer_path: 5, owner_dependency: 6, data_quality: 6, growth: 7,
}
const SEVERITY_RANK: Record<GateSeverity, number> = {
  blocking: 0, critical: 1, high: 2, moderate: 3, informational: 4,
}
// Stable tiebreak ordering within an identical tier+severity.
const DOMAIN_ORDER: GateDomain[] = [
  'licensing', 'insurance', 'entity', 'banking', 'financial_visibility', 'pricing',
  'capacity', 'quality', 'customer_path', 'owner_dependency', 'data_quality', 'growth',
]

function effectiveTier(g: CriticalGate): number {
  return g.blocksPaidWork ? 1 : DOMAIN_BASE_TIER[g.domain]
}

const DOMAIN_COPY: Record<GateDomain, { title: string; firstAction: string; completion: string; reassess: string }> = {
  licensing: { title: 'Confirm your trade licensing', firstAction: 'Verify your state trade-license + permit requirements and start your application.', completion: 'License/permits confirmed or application submitted.', reassess: 'Re-check after you confirm or obtain licensing.' },
  entity: { title: 'Register your business entity', firstAction: 'Register an LLC (or appropriate entity) with your state.', completion: 'Entity registered and EIN obtained.', reassess: 'Re-check after the entity is registered.' },
  insurance: { title: 'Put protection in place', firstAction: 'Get a general-liability insurance quote and bind coverage.', completion: 'Active liability insurance in force.', reassess: 'Re-check once insurance is active.' },
  banking: { title: 'Separate your business banking', firstAction: 'Open a dedicated business bank account.', completion: 'Business account open and in use.', reassess: 'Re-check after the account is open.' },
  financial_visibility: { title: 'Get clear on your numbers', firstAction: 'Set up simple bookkeeping and a basic cash-flow view.', completion: 'Bookkeeping in place; monthly cash-flow visible.', reassess: 'Re-check after one month of tracking.' },
  pricing: { title: 'Fix your pricing', firstAction: 'Build a costed price list with a target margin for your core services.', completion: 'Priced services cover costs + target margin.', reassess: 'Re-check after repricing core services.' },
  customer_path: { title: 'Build a reliable customer path', firstAction: 'Claim your Google Business Profile and set up one reliable lead source.', completion: 'At least one dependable lead source producing inquiries.', reassess: 'Re-check after 30 days of the new lead source.' },
  capacity: { title: 'Confirm your capacity', firstAction: 'Map your current capacity vs. demand before adding leads.', completion: 'Capacity vs. demand is documented.', reassess: 'Re-check after measuring utilization.' },
  quality: { title: 'Confirm delivery quality', firstAction: 'Start tracking callbacks and reviews.', completion: 'Callback rate + reviews tracked for 30 days.', reassess: 'Re-check after a month of tracking.' },
  owner_dependency: { title: 'Reduce owner dependency', firstAction: 'Document your top 3 roles/processes.', completion: 'Top roles documented and at least one delegated.', reassess: 'Re-check after delegating a core task.' },
  growth: { title: 'Grow with your strongest lever', firstAction: 'Pick your highest-leverage growth lever and set a 30-day target.', completion: 'Growth target set and first action taken.', reassess: 'Re-check after 30 days.' },
  data_quality: { title: 'Clarify your profile', firstAction: 'Reconcile the conflicting answers in your profile.', completion: 'Conflicting answers reconciled.', reassess: 'Re-check after updating your answers.' },
}

const TIER_REASON: Record<number, string> = {
  1: 'it gates legal or paid work and must be resolved first',
  2: 'financial survival and pricing risk outrank growth work',
  3: 'this foundation step is required before launch or growth',
  4: 'delivery and capacity must hold before adding demand',
  5: 'a reliable customer path is the next binding constraint',
  6: 'systems and efficiency are the next lever',
  7: 'with no critical gate, this is your highest-leverage outcome',
}

// Growth/marketing recommendations suppressed while a blocking gate is unresolved.
const SUPPRESSIBLE_GROWTH_RECS: { id: string; label: string }[] = [
  { id: 'scale_paid_ads', label: 'Scale paid advertising' },
  { id: 'increase_lead_volume', label: 'Increase lead volume' },
  { id: 'expand_service_area', label: 'Expand service area' },
  { id: 'hire_to_grow', label: 'Hire to grow capacity' },
]

function sortTriggered(a: CriticalGate, b: CriticalGate): number {
  return effectiveTier(a) - effectiveTier(b)
    || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
    || DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain)
}

function priorityFromGate(g: CriticalGate, rank: number, dependencies: string[], blockedIds: string[]): MetrixPriority {
  const tier = effectiveTier(g)
  const copy = DOMAIN_COPY[g.domain]
  return {
    priorityId: `priority_${g.domain}`,
    title: copy.title,
    requiredOutcome: g.requiredOutcome,
    rationale: `Selected because ${g.title.toLowerCase()} — ${TIER_REASON[tier]}.`,
    domain: g.domain,
    domainCategory: GATE_DOMAIN_CATEGORY[g.domain],
    severity: g.severity,
    sourceGateIds: [g.id],
    sourceConstraintIds: [],
    reasonCodes: g.reasonCodes,
    dependencies,
    blockedRecommendations: blockedIds,
    firstAction: copy.firstAction,
    completionCriteria: copy.completion,
    reassessmentTrigger: copy.reassess,
    evidenceStatus: g.evidenceStatus,
    rulesetVersion: RULESET_VERSION,
    rank,
  }
}

function evidenceFromQuality(q: ProfileQuality): EvidenceStatus {
  return q.coverage.level === 'substantial' ? 'evidence_backed'
    : q.coverage.level === 'partial' ? 'partial_evidence'
    : 'low_evidence'
}

// Outcome-leverage priority when no critical gate is triggered (never foundation busywork).
function outcomeLeveragePriority(
  constraints: ConstraintCandidate[],
  quality: ProfileQuality,
  rank: number,
): MetrixPriority {
  const top = constraints.find(c => c.category !== 'business_foundation') ?? constraints[0]
  const cat: MetrixCategory = top?.category ?? 'growth_risk'
  const domain: GateDomain = cat === 'sales_marketing' ? 'customer_path' : 'growth'
  const copy = DOMAIN_COPY[domain]
  const label = CATEGORY_LABELS[cat]
  return {
    priorityId: `priority_${domain}`,
    title: domain === 'customer_path' ? copy.title : `Grow with ${label}`,
    requiredOutcome: domain === 'customer_path' ? 'Establish one reliable way to win more customers.' : `Improve ${label} — your highest-leverage area with no critical gate open.`,
    rationale: `No critical gate is triggered, so your highest-leverage next outcome is ${label}.`,
    domain,
    domainCategory: cat,
    severity: 'moderate',
    sourceGateIds: [],
    sourceConstraintIds: top ? [top.category] : [],
    reasonCodes: ['no_critical_gate', 'outcome_leverage'],
    dependencies: [],
    blockedRecommendations: [],
    firstAction: copy.firstAction,
    completionCriteria: copy.completion,
    reassessmentTrigger: copy.reassess,
    evidenceStatus: evidenceFromQuality(quality),
    rulesetVersion: RULESET_VERSION,
    rank,
  }
}

export interface PrioritySelection {
  primary: MetrixPriority
  secondary: MetrixPriority[]
  blockedRecommendations: BlockedRecommendation[]
}

export function selectMetrixPriority(
  gates: CriticalGate[],
  constraints: ConstraintCandidate[],
  quality: ProfileQuality,
): PrioritySelection {
  const triggered = gates.filter(g => g.status === 'triggered').sort(sortTriggered)

  // Blocked growth recs are tied to the top growth-blocking gate (if any).
  const blockingGate = triggered.find(g => g.blocksGrowth) ?? null
  const blockedRecommendations: BlockedRecommendation[] = blockingGate
    ? SUPPRESSIBLE_GROWTH_RECS.map(r => ({
        id: r.id, label: r.label,
        reason: `Blocked until "${blockingGate.title}" is resolved.`,
        blockedByGateId: blockingGate.id,
      }))
    : []
  const blockedIds = blockedRecommendations.map(r => r.id)

  if (triggered.length > 0) {
    const primaryGate = triggered[0]
    // Dependencies: other triggered foundation/financial gates that should resolve alongside.
    const dependencies = triggered.slice(1)
      .filter(g => effectiveTier(g) <= 3)
      .map(g => g.id)
    const primary = priorityFromGate(primaryGate, 1, dependencies, blockedIds)
    const secondary = triggered.slice(1).map((g, i) => priorityFromGate(g, i + 2, [], []))
    return { primary, secondary, blockedRecommendations }
  }

  // No triggered gate → outcome leverage (strong operators land here).
  const primary = outcomeLeveragePriority(constraints, quality, 1)
  const secondary = constraints
    .filter(c => c.category !== primary.domainCategory)
    .slice(0, 2)
    .map((c, i) => outcomeLeveragePriority([c], quality, i + 2))
  return { primary, secondary, blockedRecommendations: [] }
}
