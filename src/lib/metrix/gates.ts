// ─────────────────────────────────────────────────────────────────────────────
// metrix/gates — Critical-gate model (SZM-2, versioned, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Derives bounded, explainable critical gates from the normalized answers + signals +
// readiness. Truthful by construction: when the current assessment cannot support a
// conclusion, the gate is marked `unknown` or `possible` (never falsely `cleared`, never a
// fabricated legal/licensing determination). Each gate carries triggering + missing evidence
// so the decision is auditable. Deterministic; tagged with RULESET_VERSION.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RULESET_VERSION,
  type NormalizedAssessment, type ProfileSignals, type ReadinessIndicators,
  type CriticalGate, type GateDomain, type GateStatus, type GateSeverity,
  type EvidenceStatus, type GateSourceType, type StageGroup,
} from './profileTypes'
import type { MetrixCategory } from '../metrixEngine'

const REGULATED = new Set(['hvac', 'electrical', 'plumbing', 'roofing', 'solar', 'construction'])
const OPERATING = new Set(['launched_u6', 'months_6_12', 'over_1yr', 'reset'])

export const GATE_DOMAIN_CATEGORY: Record<GateDomain, MetrixCategory> = {
  licensing: 'business_foundation',
  entity: 'business_foundation',
  insurance: 'business_foundation',
  banking: 'business_foundation',
  financial_visibility: 'financial_control',
  pricing: 'financial_control',
  customer_path: 'sales_marketing',
  capacity: 'operations',
  quality: 'customer_experience',
  owner_dependency: 'people_leadership',
  data_quality: 'business_foundation',
  growth: 'growth_risk',
}

function catScore(r: ReadinessIndicators, c: MetrixCategory): number {
  return r.categories.find(x => x.category === c)?.score ?? 0
}

interface GateInput {
  id: string
  domain: GateDomain
  status: GateStatus
  severity: GateSeverity
  title: string
  explanation: string
  reasonCodes: string[]
  triggeringEvidence: string[]
  missingEvidence: string[]
  affectedStage?: StageGroup | 'all'
  blocksGrowth?: boolean
  blocksPaidWork?: boolean
  blocksStageAdvance?: boolean
  requiredOutcome: string
  resolutionPathIds?: string[]
  evidenceStatus: EvidenceStatus
  sourceType?: GateSourceType
}

function gate(g: GateInput): CriticalGate {
  return {
    id: g.id,
    domain: g.domain,
    severity: g.severity,
    status: g.status,
    title: g.title,
    explanation: g.explanation,
    reasonCodes: g.reasonCodes,
    triggeringEvidence: g.triggeringEvidence,
    missingEvidence: g.missingEvidence,
    affectedStage: g.affectedStage ?? 'all',
    blocksGrowth: g.blocksGrowth ?? false,
    blocksPaidWork: g.blocksPaidWork ?? false,
    blocksStageAdvance: g.blocksStageAdvance ?? false,
    requiredOutcome: g.requiredOutcome,
    resolutionPathIds: g.resolutionPathIds ?? [],
    evidenceStatus: g.evidenceStatus,
    sourceType: g.sourceType ?? 'assessment',
    rulesetVersion: RULESET_VERSION,
  }
}

export function deriveCriticalGates(
  n: NormalizedAssessment,
  signals: ProfileSignals,
  readiness: ReadinessIndicators,
  stageGroup: StageGroup,
): CriticalGate[] {
  const a = n.rawAnswers
  const setup = a.setup_steps ?? []
  const isNone = setup.includes('none_yet')
  const has = (id: string) => !isNone && setup.includes(id)
  const trade = a.business_type ?? ''
  const regulated = REGULATED.has(trade)
  const operating = OPERATING.has(a.stage ?? '')
  const fc = catScore(readiness, 'financial_control')
  const sm = catScore(readiness, 'sales_marketing')
  const gates: CriticalGate[] = []

  // 1 — Licensing / regulated-scope uncertainty (NO legal determination; "not confirmed").
  {
    const hasLicense = has('license_res')
    let status: GateStatus = 'not_applicable'
    let severity: GateSeverity = 'informational'
    let blocksPaidWork = false
    const reasonCodes: string[] = []
    if (regulated && !hasLicense && (operating || a.blocker === 'licensing')) {
      status = 'triggered'; severity = 'blocking'; blocksPaidWork = true
      reasonCodes.push('regulated_trade', 'license_not_confirmed', operating ? 'operating' : 'self_reported_blocker')
    } else if (regulated && !hasLicense) {
      status = 'possible'; severity = 'high'; reasonCodes.push('regulated_trade', 'license_not_confirmed')
    } else if (regulated && hasLicense) {
      status = 'cleared'; severity = 'informational'; reasonCodes.push('license_in_progress')
    }
    gates.push(gate({
      id: 'gate_licensing', domain: 'licensing', status, severity,
      title: 'Trade licensing not confirmed',
      explanation: 'Regulated trades typically require a state license and permits to do paid work. We cannot confirm this from your answers — verify with official state sources.',
      reasonCodes, triggeringEvidence: status === 'triggered' || status === 'possible' ? [`trade=${trade}`, 'license_res not selected'] : [],
      missingEvidence: status === 'cleared' || status === 'not_applicable' ? [] : ['license_status_confirmed'],
      blocksGrowth: status === 'triggered', blocksPaidWork,
      requiredOutcome: 'Confirm and secure the trade license + permits your state requires before doing regulated paid work.',
      resolutionPathIds: ['foundation:licensing'],
      evidenceStatus: status === 'possible' ? 'partial_evidence' : 'evidence_backed',
    }))
  }

  // 2 — Entity / formalization gap.
  {
    const hasEntity = has('entity_reg')
    const status: GateStatus = hasEntity ? 'cleared' : 'triggered'
    const severity: GateSeverity = !hasEntity && operating ? 'critical' : !hasEntity ? 'high' : 'informational'
    gates.push(gate({
      id: 'gate_entity', domain: 'entity', status, severity,
      title: hasEntity ? 'Business structure registered' : 'Business structure not confirmed',
      explanation: 'A formal business structure can support contracts, banking, taxes, and liability planning. The appropriate structure and registration requirements depend on your business and jurisdiction.',
      reasonCodes: hasEntity ? ['entity_registered'] : operating ? ['no_entity', 'operating_without_entity'] : ['no_entity'],
      triggeringEvidence: hasEntity ? [] : ['entity_reg not selected'],
      missingEvidence: hasEntity ? [] : ['business_structure_confirmed'],
      blocksGrowth: !hasEntity, blocksStageAdvance: !hasEntity,
      requiredOutcome: 'Confirm the appropriate business structure and complete any required state or local registration.',
      resolutionPathIds: ['foundation:entity'],
      evidenceStatus: 'evidence_backed',
    }))
  }

  // 3 — Insurance / protection gap.
  {
    const hasInsur = has('insurance')
    const status: GateStatus = hasInsur ? 'cleared' : 'triggered'
    const blocksPaidWork = !hasInsur && regulated
    const severity: GateSeverity = !hasInsur && regulated ? 'blocking' : !hasInsur ? 'high' : 'informational'
    gates.push(gate({
      id: 'gate_insurance', domain: 'insurance', status, severity,
      title: hasInsur ? 'Insurance in place' : 'Insurance not started',
      explanation: 'Liability insurance protects you and your customers and is often required to bid or pull permits.',
      reasonCodes: hasInsur ? ['insurance_started'] : regulated ? ['no_insurance', 'regulated_trade'] : ['no_insurance'],
      triggeringEvidence: hasInsur ? [] : ['insurance not selected'],
      missingEvidence: [],
      blocksGrowth: !hasInsur, blocksPaidWork,
      requiredOutcome: 'Put the required liability insurance in place to protect work and qualify to bid.',
      resolutionPathIds: ['foundation:insurance'],
      evidenceStatus: 'evidence_backed',
    }))
  }

  // 4 — Business banking / separation gap.
  {
    const hasBank = has('bank')
    const status: GateStatus = hasBank ? 'cleared' : 'triggered'
    gates.push(gate({
      id: 'gate_banking', domain: 'banking', status, severity: hasBank ? 'informational' : 'moderate',
      title: hasBank ? 'Business banking separated' : 'No separate business banking',
      explanation: 'A dedicated business account improves financial separation, bookkeeping, and tax records, and may help support proper business formalities.',
      reasonCodes: hasBank ? ['banking_separated'] : ['no_business_bank'],
      triggeringEvidence: hasBank ? [] : ['bank not selected'], missingEvidence: [],
      blocksStageAdvance: false,
      requiredOutcome: 'Open a dedicated business bank account.',
      resolutionPathIds: ['foundation:banking'],
      evidenceStatus: 'evidence_backed',
    }))
  }

  // 5 — Severe financial visibility gap.
  {
    const notSure = a.financial === 'not_sure'
    let status: GateStatus; let severity: GateSeverity
    const reasonCodes: string[] = []
    if (notSure || fc < 34) { status = 'triggered'; severity = (notSure || fc < 20) ? 'critical' : 'high'; reasonCodes.push(notSure ? 'cost_unknown' : 'low_financial_readiness') }
    else if (fc < 60) { status = 'possible'; severity = 'moderate'; reasonCodes.push('partial_financial_readiness') }
    else { status = 'cleared'; severity = 'informational'; reasonCodes.push('financial_readiness_ok') }
    gates.push(gate({
      id: 'gate_financial_visibility', domain: 'financial_visibility', status, severity,
      title: status === 'cleared' ? 'Financial visibility adequate' : 'Limited financial visibility',
      explanation: 'Knowing your costs, cash flow, and numbers is required before scaling spend or work.',
      reasonCodes, triggeringEvidence: status === 'triggered' ? [notSure ? 'financial=not_sure' : `financial_control=${fc}`] : [],
      missingEvidence: status === 'cleared' ? [] : ['bookkeeping_in_place', 'cash_flow_view'],
      blocksGrowth: status === 'triggered' && severity === 'critical',
      requiredOutcome: 'Set up simple bookkeeping and a basic cash-flow view.',
      resolutionPathIds: ['financial:bookkeeping'],
      evidenceStatus: 'evidence_backed',
    }))
  }

  // 6 — Pricing / economic viability gap.
  {
    const blockerPricing = a.blocker === 'pricing'
    let status: GateStatus; let severity: GateSeverity; const missing: string[] = []
    if (blockerPricing) { status = 'triggered'; severity = 'high' }
    else if (fc < 34) { status = 'possible'; severity = 'moderate'; missing.push('pricing_confidence') }
    else { status = 'unknown'; severity = 'informational'; missing.push('pricing_confidence', 'margin_known') }
    gates.push(gate({
      id: 'gate_pricing', domain: 'pricing', status, severity,
      title: 'Pricing / margin not confirmed',
      explanation: 'Scaling work at the wrong price scales losses. We can only confirm a pricing problem if you tell us.',
      reasonCodes: blockerPricing ? ['pricing_blocker'] : status === 'possible' ? ['weak_financials'] : ['pricing_unknown'],
      triggeringEvidence: blockerPricing ? ['blocker=pricing'] : [], missingEvidence: missing,
      blocksGrowth: blockerPricing,
      requiredOutcome: 'Set pricing that covers costs and a target margin before scaling work.',
      resolutionPathIds: ['financial:pricing'],
      evidenceStatus: blockerPricing ? 'evidence_backed' : status === 'possible' ? 'partial_evidence' : 'no_evidence',
    }))
  }

  // 7 — No viable customer path.
  {
    const noPlan = a.customer_plan === 'no_plan'
    let status: GateStatus; let severity: GateSeverity
    if (noPlan || sm < 20) { status = 'triggered'; severity = noPlan ? 'high' : 'moderate' }
    else if (sm < 50) { status = 'possible'; severity = 'moderate' }
    else { status = 'cleared'; severity = 'informational' }
    gates.push(gate({
      id: 'gate_customer_path', domain: 'customer_path', status, severity,
      title: status === 'cleared' ? 'Customer path in place' : 'No reliable customer path',
      explanation: 'Without at least one dependable way to win customers, revenue is unpredictable.',
      reasonCodes: noPlan ? ['no_customer_plan'] : sm < 20 ? ['very_low_acquisition'] : sm < 50 ? ['weak_acquisition'] : ['acquisition_ok'],
      triggeringEvidence: status === 'triggered' ? [noPlan ? 'customer_plan=no_plan' : `sales_marketing=${sm}`] : [],
      missingEvidence: status === 'cleared' ? [] : ['lead_source_confirmed'],
      blocksGrowth: false,
      requiredOutcome: 'Establish at least one reliable way to win customers (e.g., GBP + reviews).',
      resolutionPathIds: ['growth:acquisition'],
      evidenceStatus: 'evidence_backed',
    }))
  }

  // 8 — Capacity conflict (no direct signal in the 7Q → unknown/possible only; never invented).
  {
    const hireScale = (n.intake?.mainGoal ?? '') === 'hire_scale'
    const growthStage = stageGroup === 'growth'
    const status: GateStatus = hireScale && growthStage ? 'possible' : 'unknown'
    gates.push(gate({
      id: 'gate_capacity', domain: 'capacity', status, severity: 'moderate',
      title: 'Capacity vs. demand not confirmed',
      explanation: 'If you are already at capacity, adding leads can hurt quality and cash flow. The assessment does not yet measure this.',
      reasonCodes: status === 'possible' ? ['growth_stage', 'scale_goal'] : ['capacity_not_measured'],
      triggeringEvidence: [], missingEvidence: ['at_capacity', 'team_utilization'],
      blocksGrowth: false, sourceType: 'derived',
      requiredOutcome: 'Confirm whether fulfillment capacity can absorb more work before adding demand.',
      resolutionPathIds: ['operations:capacity'],
      evidenceStatus: status === 'possible' ? 'partial_evidence' : 'no_evidence',
    }))
  }

  // 9 — Quality / callback risk (no direct signal → unknown; never invented).
  {
    gates.push(gate({
      id: 'gate_quality', domain: 'quality', status: 'unknown', severity: 'informational',
      title: 'Delivery quality not measured',
      explanation: 'Callback rate and reviews indicate delivery quality. The assessment does not yet measure this.',
      reasonCodes: ['quality_not_measured'], triggeringEvidence: [],
      missingEvidence: ['callback_rate', 'review_volume'], sourceType: 'derived',
      requiredOutcome: 'Track callbacks and reviews to confirm delivery quality before scaling.',
      resolutionPathIds: ['operations:quality'],
      evidenceStatus: 'no_evidence',
    }))
  }

  // 10 — Owner dependency (proxy from team size only → possible/unknown).
  {
    const team = n.intake?.teamSize ?? ''
    let status: GateStatus
    if (team === 'just_me' && operating) status = 'possible'
    else if (team && team !== 'just_me') status = 'cleared'
    else status = 'unknown'
    gates.push(gate({
      id: 'gate_owner_dependency', domain: 'owner_dependency', status, severity: 'moderate',
      title: 'Owner dependency not confirmed',
      explanation: 'A solo operator running an established business may be a single point of failure. We infer this only from team size.',
      reasonCodes: status === 'possible' ? ['solo_operator', 'operating'] : status === 'cleared' ? ['has_team'] : ['team_unknown'],
      triggeringEvidence: [], missingEvidence: status === 'cleared' ? [] : ['owner_hours', 'delegation'],
      sourceType: 'intake',
      requiredOutcome: 'Document key roles/processes to reduce owner dependency before scaling.',
      resolutionPathIds: ['people:delegation'],
      evidenceStatus: status === 'cleared' ? 'evidence_backed' : status === 'possible' ? 'partial_evidence' : 'no_evidence',
    }))
  }

  // 11 — Contradictory / incomplete critical information.
  {
    const contradictions: string[] = []
    if (operating && isNone) contradictions.push('operating_but_nothing_setup')
    if (operating && !has('entity_reg')) contradictions.push('operating_but_no_entity')
    if (n.intake?.stage && a.stage && n.intake.stage !== a.stage) contradictions.push('stage_mismatch')
    const minimalCoverage = signals.answeredCount < 6
    let status: GateStatus
    if (contradictions.length > 0) status = 'triggered'
    else if (minimalCoverage) status = 'possible'
    else status = 'cleared'
    gates.push(gate({
      id: 'gate_data_quality', domain: 'data_quality', status, severity: 'informational',
      title: status === 'cleared' ? 'Profile is internally consistent' : 'Conflicting or incomplete answers',
      explanation: 'Conflicting or sparse answers reduce confidence in the recommendation. Clarifying them sharpens the priority.',
      reasonCodes: contradictions.length > 0 ? contradictions : minimalCoverage ? ['minimal_coverage'] : ['consistent'],
      triggeringEvidence: contradictions, missingEvidence: minimalCoverage ? ['more_answers'] : [],
      sourceType: 'derived',
      requiredOutcome: 'Reconcile the conflicting answers so the recommendation is accurate.',
      resolutionPathIds: ['profile:clarify'],
      evidenceStatus: contradictions.length > 0 ? 'evidence_backed' : 'partial_evidence',
    }))
  }

  return gates
}
