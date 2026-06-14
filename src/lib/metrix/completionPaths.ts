// ─────────────────────────────────────────────────────────────────────────────
// metrix/completionPaths — completion-path + ordered-action-step policy (SZM-2A)
// ─────────────────────────────────────────────────────────────────────────────
// Turns the single active Metrix Priority into a practical completion system: valid
// completion paths (one recommended), ordered action steps, and a meaningful first action.
// Deterministic, canonical-snapshot-derived, versioned. No real providers/affiliates, no
// exact costs/times, no "you don't need a license" declarations, and no claim that
// SubZeroMetrix replaces attorneys/accountants/insurers/licensing authorities. Does NOT
// change scoring, gate ranking, or priority selection.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RULESET_VERSION,
  type MetrixPriority, type CriticalGate, type GateDomain, type NormalizedAssessment,
  type CompletionPath, type ActionStep, type PathType, type CostBand, type EffortBand,
  type PathRiskLevel, type ProviderCategory, type AuthorityType,
} from './profileTypes'

interface PathTemplate {
  pathType: PathType
  title: string
  description: string
  bestFor: string
  cost: CostBand
  effort: EffortBand
  risk: PathRiskLevel
  expectedOutcome: string
  providerCategory: ProviderCategory
  authorityType: AuthorityType
  notRecommendedWhen: string
}

// Conservative path catalog per domain. Licensing intentionally has NO DIY "no license
// needed" path; insurance/entity keep professional + official escalation.
const PATH_CATALOG: Partial<Record<GateDomain, PathTemplate[]>> = {
  licensing: [
    { pathType: 'official_authority', title: 'Verify with your state licensing authority', description: 'Confirm the license and permits your state requires directly from the official authority.', bestFor: 'Confirming exactly what your state requires', cost: 'varies', effort: 'moderate', risk: 'low', expectedOutcome: 'Licensing requirements confirmed from the official source', providerCategory: 'official', authorityType: 'state_licensing', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Consult a licensing specialist or attorney', description: 'Get professional help for complex scope, multi-trade, or multi-jurisdiction situations.', bestFor: 'Complex or unclear scope', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'Professional confirmation of your licensing obligations', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: 'Simple single-trade, single-state scope' },
    { pathType: 'prerequisite_first', title: 'Confirm your trade, location, and scope first', description: 'We need your trade, state, and work scope to point you to the right authority.', bestFor: 'When trade/location/scope is missing', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'Enough detail to identify the right licensing authority', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'Trade and location already known' },
  ],
  entity: [
    { pathType: 'guided_diy', title: 'Prepare your business-structure decision', description: 'Work through a basic structure comparison and the registration steps for a simple situation.', bestFor: 'Simple, single-owner situations', cost: 'low', effort: 'moderate', risk: 'moderate', expectedOutcome: 'A chosen structure and a registration plan', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'Structure choice is uncertain or complex' },
    { pathType: 'specialist_assisted', title: 'Consult an attorney or accountant on structure', description: 'Get professional advice when the right structure is uncertain or the situation is complex.', bestFor: 'Uncertain or complex structure decisions', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'A structure choice fitted to your situation', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: 'Situation is simple and well understood' },
    { pathType: 'official_authority', title: 'Verify registration with your Secretary of State', description: 'Confirm and complete registration through the official state portal.', bestFor: 'Completing/verifying registration', cost: 'varies', effort: 'short', risk: 'low', expectedOutcome: 'Registration confirmed with the state', providerCategory: 'official', authorityType: 'secretary_of_state', notRecommendedWhen: '' },
  ],
  insurance: [
    { pathType: 'specialist_assisted', title: 'Get quotes from a licensed insurance professional', description: 'A licensed agent can identify the coverage your work and jurisdiction call for.', bestFor: 'Confirming appropriate coverage', cost: 'varies', effort: 'short', risk: 'low', expectedOutcome: 'Coverage quoted and bound appropriately', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'official_authority', title: 'Check jurisdictional coverage requirements', description: 'Verify any insurance requirements your state/locality sets for your trade.', bestFor: 'Jurisdiction-specific requirements', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'Required coverage rules confirmed', providerCategory: 'official', authorityType: 'insurance_regulator', notRecommendedWhen: '' },
    { pathType: 'prerequisite_first', title: 'Confirm your trade and location first', description: 'Insurance requirements depend on your trade and jurisdiction.', bestFor: 'When trade/location is missing', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'Enough detail to scope coverage', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'Trade and location already known' },
  ],
  banking: [
    { pathType: 'guided_diy', title: 'Open a dedicated business bank account', description: 'Compare basic business accounts and open one to separate business finances.', bestFor: 'Most businesses', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'A separate business account in use', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Compare business-account options', description: 'Use a comparison checklist to pick an account that fits your needs.', bestFor: 'Choosing between accounts', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'A shortlist of suitable accounts', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
  ],
  financial_visibility: [
    { pathType: 'guided_diy', title: 'Set up simple bookkeeping + cash-flow review', description: 'Stand up a basic income/expense record and a monthly cash-flow habit.', bestFor: 'Getting started fast', cost: 'free', effort: 'moderate', risk: 'low', expectedOutcome: 'Monthly visibility into your numbers', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Use bookkeeping software', description: 'Adopt a bookkeeping tool to track income, expenses, and cash flow.', bestFor: 'Ongoing tracking', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'Automated tracking of your numbers', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Work with a bookkeeper or accountant', description: 'Bring in a professional to set up and maintain your books.', bestFor: 'Limited time or complex finances', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'Professionally maintained books', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
  ],
  pricing: [
    { pathType: 'guided_diy', title: 'Build a costed price list', description: 'Cost your core services and set prices with a target margin.', bestFor: 'Getting pricing under control', cost: 'free', effort: 'moderate', risk: 'low', expectedOutcome: 'Priced services that cover costs + margin', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Use a pricing / estimating tool', description: 'Adopt a tool to standardize estimates and margins.', bestFor: 'Consistent estimating', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'Consistent, costed estimates', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Get a pricing / margin review', description: 'Have an advisor review your costs, pricing, and margins.', bestFor: 'Uncertain margins', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'Validated pricing and margins', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
  ],
  customer_path: [
    { pathType: 'guided_diy', title: 'Set up one reliable lead source', description: 'Claim your Google Business Profile and start a consistent review request habit.', bestFor: 'Building a dependable inbound source', cost: 'free', effort: 'moderate', risk: 'low', expectedOutcome: 'One working, repeatable lead source', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'A higher gate is blocking added demand' },
    { pathType: 'tool_assisted', title: 'Use a CRM / reviews tool', description: 'Adopt a simple tool to capture leads and request reviews.', bestFor: 'Tracking + follow-up', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'Leads captured and followed up', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: 'A higher gate is blocking added demand' },
    { pathType: 'specialist_assisted', title: 'Work with a local-marketing specialist', description: 'Bring in help to build a reliable acquisition channel.', bestFor: 'Faster, hands-off setup', cost: 'moderate', effort: 'short', risk: 'moderate', expectedOutcome: 'A managed acquisition channel', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: 'A higher gate is blocking added demand' },
    { pathType: 'prerequisite_first', title: 'Resolve the higher gate before adding demand', description: 'A licensing, insurance, pricing, capacity, or quality concern should be confirmed before generating more demand.', bestFor: 'When a higher gate is unresolved', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'A clear path once the blocker is resolved', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'No higher gate is in the way' },
  ],
  capacity: [
    { pathType: 'guided_diy', title: 'Review capacity vs. demand', description: 'Map current workload against demand to see where the limit is.', bestFor: 'Understanding the constraint', cost: 'free', effort: 'short', risk: 'low', expectedOutcome: 'A clear read on spare/limited capacity', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Set up scheduling / dispatch', description: 'Use a scheduling tool to see utilization and protect quality.', bestFor: 'Seeing utilization', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'Visible utilization and scheduling', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Operations review with a specialist', description: 'Bring in operations help to expand throughput safely.', bestFor: 'Scaling fulfillment', cost: 'moderate', effort: 'short', risk: 'moderate', expectedOutcome: 'A plan to add capacity', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'not_ready', title: 'Hold additional marketing for now', description: 'Adding more demand before confirming capacity can hurt quality and cash flow.', bestFor: 'Avoiding overload', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'Demand kept in line with capacity', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: 'Capacity is confirmed to have headroom' },
  ],
  quality: [
    { pathType: 'guided_diy', title: 'Start measuring callbacks + reviews', description: 'Track callback rate and reviews to see real delivery quality.', bestFor: 'Establishing a baseline', cost: 'free', effort: 'short', risk: 'low', expectedOutcome: 'A quality baseline to act on', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Use a reviews / CRM tool to track quality', description: 'Adopt a tool to collect reviews and flag callbacks.', bestFor: 'Ongoing tracking', cost: 'low', effort: 'short', risk: 'low', expectedOutcome: 'Tracked quality signals', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Operations / quality review', description: 'Bring in help to diagnose and fix recurring quality issues.', bestFor: 'Persistent quality problems', cost: 'moderate', effort: 'short', risk: 'moderate', expectedOutcome: 'Root-caused quality improvements', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
  ],
  owner_dependency: [
    { pathType: 'guided_diy', title: 'Document your top roles and processes', description: 'Write down the few roles/processes the business most depends on you for.', bestFor: 'Reducing single-point-of-failure risk', cost: 'free', effort: 'short', risk: 'low', expectedOutcome: 'Documented core roles ready to delegate', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Work with an operations/leadership advisor', description: 'Get help building delegation and management structure.', bestFor: 'Preparing to scale a team', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'A delegation plan', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
  ],
  growth: [
    { pathType: 'guided_diy', title: 'Pick your highest-leverage growth lever', description: 'Choose the single best lever and set a 30-day target.', bestFor: 'Operators with no critical gate', cost: 'free', effort: 'short', risk: 'low', expectedOutcome: 'A focused growth target with a first action', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'tool_assisted', title: 'Track the growth lever', description: 'Use a simple tracker to measure progress on the lever.', bestFor: 'Measuring progress', cost: 'low', effort: 'quick', risk: 'low', expectedOutcome: 'Measured progress on the lever', providerCategory: 'tool', authorityType: 'none', notRecommendedWhen: '' },
    { pathType: 'specialist_assisted', title: 'Growth advisor review', description: 'Get an outside read on the highest-leverage move.', bestFor: 'Validating direction', cost: 'moderate', effort: 'short', risk: 'low', expectedOutcome: 'A validated growth direction', providerCategory: 'specialist', authorityType: 'none', notRecommendedWhen: '' },
  ],
  data_quality: [
    { pathType: 'prerequisite_first', title: 'Reconcile your conflicting answers', description: 'Update the answers that conflict so the recommendation is accurate.', bestFor: 'When answers conflict', cost: 'free', effort: 'quick', risk: 'low', expectedOutcome: 'A consistent profile and a sharper priority', providerCategory: 'self', authorityType: 'none', notRecommendedWhen: '' },
  ],
}

// Follow-up steps after the priority's first action (kept meaningful, not filler).
const FOLLOWUPS: Partial<Record<GateDomain, { title: string; instruction: string; purpose: string; effort: EffortBand }[]>> = {
  licensing: [
    { title: 'Identify the official authority', instruction: 'Locate your state licensing board / authority for your trade.', purpose: 'Use the source of truth, not third-party summaries.', effort: 'quick' },
    { title: 'Review requirements + permits', instruction: 'Read the license, exam, and permit requirements for your scope.', purpose: 'Know exactly what applies to you.', effort: 'short' },
    { title: 'Start the application or confirmation', instruction: 'Begin the application or confirm your existing license is current.', purpose: 'Move from "unknown" to confirmed.', effort: 'moderate' },
  ],
  entity: [
    { title: 'Compare structure options', instruction: 'Compare the common structures at a high level for your situation.', purpose: 'Choose a fit, not a default.', effort: 'short' },
    { title: 'Complete required registration', instruction: 'Complete the state/local registration for your chosen structure.', purpose: 'Formalize the structure.', effort: 'short' },
  ],
  insurance: [
    { title: 'Confirm required coverage', instruction: 'Confirm the coverage your trade/jurisdiction calls for with a licensed professional.', purpose: 'Match coverage to obligations.', effort: 'short' },
  ],
  banking: [
    { title: 'Move business activity to the account', instruction: 'Route business income and expenses through the new account.', purpose: 'Make the separation real.', effort: 'quick' },
  ],
  financial_visibility: [
    { title: 'Record income + expenses', instruction: 'Capture income and expenses consistently each week.', purpose: 'Build a reliable record.', effort: 'short' },
    { title: 'Hold a monthly review', instruction: 'Review cash flow once a month and note trends.', purpose: 'Turn data into decisions.', effort: 'quick' },
  ],
  pricing: [
    { title: 'Cost your core services', instruction: 'List your core services and their true costs.', purpose: 'Price from costs, not guesses.', effort: 'short' },
    { title: 'Set prices with target margin', instruction: 'Set prices that cover costs plus your target margin.', purpose: 'Protect profitability.', effort: 'short' },
  ],
  customer_path: [
    { title: 'Set up review requests', instruction: 'Ask every satisfied customer for a review.', purpose: 'Compounding local trust.', effort: 'quick' },
    { title: 'Track where leads come from', instruction: 'Note the source of each inquiry.', purpose: 'Know what is working.', effort: 'quick' },
  ],
  capacity: [
    { title: 'Estimate utilization', instruction: 'Estimate how full your schedule currently is.', purpose: 'See the real limit.', effort: 'quick' },
  ],
  quality: [
    { title: 'Log callbacks', instruction: 'Record callbacks/redo work for one month.', purpose: 'Quantify quality.', effort: 'short' },
  ],
  owner_dependency: [
    { title: 'Pick one task to delegate', instruction: 'Choose one documented task to hand off.', purpose: 'Begin reducing dependency.', effort: 'quick' },
  ],
  growth: [
    { title: 'Set a 30-day target', instruction: 'Define a measurable 30-day target for the lever.', purpose: 'Make growth concrete.', effort: 'quick' },
  ],
  data_quality: [],
}

const EVIDENCE_BY_DOMAIN: Record<GateDomain, string[]> = {
  licensing: ['license_number_or_application_reference'],
  entity: ['registration_confirmation'],
  insurance: ['policy_or_quote_reference'],
  banking: ['account_opened_confirmation'],
  financial_visibility: ['bookkeeping_setup_confirmation'],
  pricing: ['priced_service_list'],
  customer_path: ['lead_source_active'],
  capacity: ['capacity_review_notes'],
  quality: ['callback_review_tracking'],
  owner_dependency: ['delegation_documented'],
  growth: ['growth_target_set'],
  data_quality: ['answers_reconciled'],
}

interface Ctx {
  missingScope: boolean
  operating: boolean
  evidenceWeak: boolean
  higherGateBlocksDemand: boolean
}

const OPERATING = new Set(['launched_u6', 'months_6_12', 'over_1yr', 'reset'])
const DEMAND_BLOCKERS: GateDomain[] = ['licensing', 'insurance', 'pricing', 'capacity', 'quality']

function recommendPathType(domain: GateDomain, ctx: Ctx): PathType {
  switch (domain) {
    case 'licensing': return ctx.missingScope ? 'prerequisite_first' : 'official_authority'
    case 'entity': return (ctx.operating || ctx.evidenceWeak) ? 'specialist_assisted' : 'guided_diy'
    case 'insurance': return ctx.missingScope ? 'prerequisite_first' : 'specialist_assisted'
    case 'customer_path': return ctx.higherGateBlocksDemand ? 'prerequisite_first' : 'guided_diy'
    case 'data_quality': return 'prerequisite_first'
    default: return 'guided_diy'
  }
}

function step(
  domain: GateDomain, order: number, title: string, instruction: string, purpose: string,
  effort: EffortBand, completionCriteria: string, evidence: string[], opts: { optional?: boolean; blocking?: boolean } = {},
): ActionStep {
  return {
    stepId: `step_${domain}_${order}`, order, title, instruction, purpose,
    prerequisites: [], completionCriteria, evidenceRequested: evidence,
    optional: opts.optional ?? false, blocking: opts.blocking ?? (order === 1),
    estimatedEffort: effort, rulesetVersion: RULESET_VERSION,
  }
}

// Ordered steps for the RECOMMENDED path: step 1 IS the priority's firstAction (alignment),
// then domain follow-ups. Other paths get a single concise engage-step (no filler).
function buildSteps(priority: MetrixPriority, isRecommended: boolean, template: PathTemplate): ActionStep[] {
  const domain = priority.domain
  const evidence = EVIDENCE_BY_DOMAIN[domain]
  if (isRecommended) {
    const first = step(domain, 1, 'Start now', priority.firstAction, 'Take the single most important action for this priority.', 'short', priority.completionCriteria, evidence, { blocking: true })
    const rest = (FOLLOWUPS[domain] ?? []).map((s, i) =>
      step(domain, i + 2, s.title, s.instruction, s.purpose, s.effort, priority.completionCriteria, evidence, { blocking: false }))
    return [first, ...rest]
  }
  return [step(domain, 1, template.title, template.description, `Alternative route: ${template.bestFor.toLowerCase()}.`, template.effort, priority.completionCriteria, evidence, { blocking: false })]
}

export interface CompletionPathResult {
  paths: CompletionPath[]
  recommendedId: string | null
  primaryActionSteps: ActionStep[]
}

export function buildCompletionPaths(
  priority: MetrixPriority,
  gates: CriticalGate[],
  normalized: NormalizedAssessment,
): CompletionPathResult {
  const domain = priority.domain
  const templates = PATH_CATALOG[domain] ?? PATH_CATALOG.growth!
  const higherGateBlocksDemand = gates.some(g =>
    DEMAND_BLOCKERS.includes(g.domain) && (g.status === 'triggered' || g.status === 'possible'))
  const ctx: Ctx = {
    missingScope: !normalized.trade || !normalized.region,
    operating: OPERATING.has(normalized.rawAnswers.stage ?? ''),
    evidenceWeak: priority.evidenceStatus !== 'evidence_backed',
    higherGateBlocksDemand,
  }

  let recommendedType = recommendPathType(domain, ctx)
  // Safety: the recommended type must exist in the catalog; fall back to the first template.
  if (!templates.some(t => t.pathType === recommendedType)) recommendedType = templates[0].pathType

  let recommendedAssigned = false
  const paths: CompletionPath[] = templates.map(t => {
    const isRec = !recommendedAssigned && t.pathType === recommendedType
    if (isRec) recommendedAssigned = true
    return {
      pathId: `path_${domain}_${t.pathType}`,
      priorityId: priority.priorityId,
      pathType: t.pathType,
      title: t.title,
      description: t.description,
      bestFor: t.bestFor,
      prerequisites: t.pathType === 'prerequisite_first' ? ['scope_or_blocker_resolved'] : [],
      estimatedEffort: t.effort,
      estimatedCostBand: t.cost,
      riskLevel: t.risk,
      expectedOutcome: t.expectedOutcome,
      actionSteps: buildSteps(priority, isRec, t),
      completionCriteria: priority.completionCriteria,
      evidenceRequested: EVIDENCE_BY_DOMAIN[domain],
      providerCategory: t.providerCategory,
      authorityType: t.authorityType,
      externalResourceIds: [],
      tradeApplicability: [],
      stateApplicability: [],
      stageApplicability: [],
      recommended: isRec,
      recommendationReason: isRec ? recommendationReason(domain, recommendedType, ctx) : '',
      notRecommendedWhen: t.notRecommendedWhen,
      rulesetVersion: RULESET_VERSION,
    }
  })

  const recommended = paths.find(p => p.recommended) ?? null
  return {
    paths,
    recommendedId: recommended?.pathId ?? null,
    primaryActionSteps: recommended?.actionSteps ?? [],
  }
}

function recommendationReason(domain: GateDomain, type: PathType, ctx: Ctx): string {
  if (domain === 'licensing') return ctx.missingScope ? 'We need your trade and location before pointing you to the right authority.' : 'Licensing is confirmed at the official source, not by us — verify directly.'
  if (domain === 'entity') return ctx.operating || ctx.evidenceWeak ? 'Your situation is operating/complex enough that professional structure advice is the safer route.' : 'A simple, single-owner situation can usually be prepared directly, then registered with the state.'
  if (domain === 'insurance') return ctx.missingScope ? 'We need your trade and location before scoping coverage.' : 'A licensed insurance professional can match coverage to your trade and jurisdiction.'
  if (domain === 'customer_path') return ctx.higherGateBlocksDemand ? 'A higher gate should be confirmed before adding demand.' : 'A simple, reliable lead source is the highest-leverage first move here.'
  if (domain === 'data_quality') return 'Reconciling the conflicting answers comes first so the recommendation is accurate.'
  return `The ${type.replace('_', ' ')} route is the most direct way to reach this outcome.`
}
