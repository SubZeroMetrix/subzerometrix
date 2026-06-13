// ─────────────────────────────────────────────────────────────────────────────
// growthEngine — Product-6: Contractor Customer Growth Engine (MVP)
// ─────────────────────────────────────────────────────────────────────────────
// An OUTCOME engine (not a tips library) that diagnoses a contractor's primary growth
// CONSTRAINT and produces a prioritized, trade- and stage-aware customer-growth roadmap:
//   Growth inputs → Constraint → Prioritized roadmap (Do now/next/later) → KPIs.
//
// It distinguishes lead vs. conversion vs. capacity vs. retention vs. brand vs. pricing vs.
// sales-process problems — it does NOT diagnose everyone as needing more leads. Pure, typed,
// SSR-safe model + helpers. No guarantees, no fabricated ROI, no automation, no scoring/
// payment changes. Trade values mirror the 10 supported trades.
// ─────────────────────────────────────────────────────────────────────────────

export type GrowthTrade =
  | 'hvac' | 'electrical' | 'plumbing' | 'roofing' | 'construction'
  | 'handyman' | 'landscaping' | 'cleaning' | 'painting' | 'solar'

export type GrowthStage =
  | 'pre_launch' | 'newly_launched' | 'owner_operator' | 'early_team'
  | 'established' | 'growth_stage'

export type GrowthConstraint =
  | 'lead' | 'conversion' | 'capacity' | 'retention' | 'brand' | 'pricing' | 'sales_process'

export type GrowthPriority = 'critical' | 'high' | 'medium' | 'low'
export type GrowthBucket = 'do_now' | 'do_next' | 'later'
// "Tracked?" confidence — "not tracked" is itself a useful signal.
export type DataConfidence = 'known' | 'estimated' | 'not_tracked' | 'na'

// ── Growth inputs (all optional; the form supplies what the user knows) ─────────
export interface GrowthInputs {
  trade?: GrowthTrade
  stage?: GrowthStage
  monthlyLeads?: number | null          // visibility / lead volume
  responseMinutes?: number | null       // speed-to-lead
  missedCallsWeekly?: number | null
  bookingRatePct?: number | null        // leads → booked appointments
  closeRatePct?: number | null          // estimates → won
  avgTicket?: number | null
  followUpProcess?: boolean | null       // has a systematic estimate follow-up?
  repeatCustomerPct?: number | null
  referralsMonthly?: number | null
  reviewCount?: number | null
  gbpComplete?: boolean | null           // Google Business Profile claimed/complete?
  recurringRevenue?: boolean | null      // any memberships/agreements?
  atCapacity?: boolean | null            // can the team take more work now?
  marketingTracked?: boolean | null      // knows where leads come from?
  confidence?: Record<string, DataConfidence>
}

export interface GrowthAction {
  id: string
  label: string
  why: string
  constraint: GrowthConstraint
  priority: GrowthPriority
  bucket: GrowthBucket
}

export interface ChannelRecommendation {
  id: string
  label: string
  why: string
  fitNote: string
}

export interface GrowthKpi {
  key: string
  label: string
  unit: 'count' | 'percent' | 'currency' | 'minutes'
}

export interface ConstraintFinding {
  constraint: GrowthConstraint
  severity: GrowthPriority
  evidence: string
}

export interface GrowthDiagnosis {
  primary: ConstraintFinding | null
  secondary: ConstraintFinding[]
  strongest: string | null          // strongest existing capability
  summary: string                   // plain-language, cautious
  dataConfidenceNote: string | null
}

export interface GrowthRoadmap {
  diagnosis: GrowthDiagnosis
  actions: GrowthAction[]            // sorted by bucket then priority
  channels: ChannelRecommendation[]
  kpis: GrowthKpi[]
}

// ── Labels ──────────────────────────────────────────────────────────────────────
const CONSTRAINT_LABELS: Record<GrowthConstraint, string> = {
  lead: 'Lead / visibility', conversion: 'Lead conversion', capacity: 'Capacity',
  retention: 'Customer retention', brand: 'Local brand recognition', pricing: 'Pricing / margin',
  sales_process: 'Sales process & follow-up',
}
export function getConstraintLabel(c: GrowthConstraint): string { return CONSTRAINT_LABELS[c] }

export const GROWTH_TRADES: GrowthTrade[] = [
  'hvac', 'electrical', 'plumbing', 'roofing', 'construction',
  'handyman', 'landscaping', 'cleaning', 'painting', 'solar',
]
export function normalizeGrowthTrade(v: string | null | undefined): GrowthTrade | null {
  return v && (GROWTH_TRADES as string[]).includes(v) ? (v as GrowthTrade) : null
}

// ── Cross-sell opportunities (trade-aware; customer-beneficial, never pressure) ─
export const CROSS_SELL: Record<GrowthTrade, string[]> = {
  hvac: ['Maintenance plans', 'Filtration / indoor air quality', 'Smart thermostats', 'Duct improvements', 'Surge protection', 'Replacement planning'],
  electrical: ['Panel upgrades', 'Surge protection', 'EV chargers', 'Generators', 'Lighting', 'Safety inspections'],
  plumbing: ['Water heaters', 'Water treatment', 'Leak detection', 'Drain maintenance', 'Fixture upgrades', 'Service agreements'],
  roofing: ['Roof inspections', 'Maintenance', 'Gutters', 'Ventilation', 'Storm-readiness', 'Commercial maintenance'],
  construction: ['Phased projects', 'Maintenance', 'Remodeling follow-ups', 'Exterior/interior improvements', 'Project follow-up'],
  handyman: ['Maintenance bundles', 'Seasonal repairs', 'Punch lists', 'Safety / accessibility improvements'],
  landscaping: ['Recurring maintenance', 'Irrigation', 'Fertilization', 'Seasonal cleanup', 'Landscape lighting', 'Hardscape'],
  cleaning: ['Recurring service', 'Deep cleaning', 'Move-in / move-out', 'Commercial cleaning', 'Floor / add-on services'],
  painting: ['Maintenance painting', 'Cabinet refinishing', 'Deck / fence work', 'Interior/exterior follow-up', 'Commercial recurring'],
  solar: ['Monitoring', 'Maintenance', 'Battery / storage education', 'Electrical upgrades', 'Efficiency referrals'],
}
export function getCrossSell(trade: GrowthTrade | null): string[] {
  return trade ? CROSS_SELL[trade] : ['Service agreements', 'Maintenance plans', 'Seasonal offers', 'Bundled add-on services']
}

// ── Social content monthly rhythm (practical, not influencer) ───────────────────
export const SOCIAL_RHYTHM: { week: string; pillar: string }[] = [
  { week: 'Week 1', pillar: 'Educational answer to a common customer question' },
  { week: 'Week 2', pillar: 'Before-and-after of recent work' },
  { week: 'Week 3', pillar: 'Team / company credibility (who you are)' },
  { week: 'Week 4', pillar: 'Seasonal service reminder' },
]

// ── Growth KPIs ─────────────────────────────────────────────────────────────────
export const GROWTH_KPIS: GrowthKpi[] = [
  { key: 'leads', label: 'Monthly leads', unit: 'count' },
  { key: 'response_minutes', label: 'Avg lead response time', unit: 'minutes' },
  { key: 'booking_rate', label: 'Booking rate', unit: 'percent' },
  { key: 'close_rate', label: 'Close rate', unit: 'percent' },
  { key: 'avg_ticket', label: 'Average ticket', unit: 'currency' },
  { key: 'follow_up_rate', label: 'Estimate follow-up completion', unit: 'percent' },
  { key: 'repeat_rate', label: 'Repeat-customer rate', unit: 'percent' },
  { key: 'referrals', label: 'Referrals per month', unit: 'count' },
  { key: 'reviews', label: 'New reviews per month', unit: 'count' },
  { key: 'recurring', label: 'Customers on a plan/agreement', unit: 'count' },
]

// ── Constraint diagnosis ────────────────────────────────────────────────────────
function sev(score: number): GrowthPriority {
  return score >= 3 ? 'critical' : score >= 2 ? 'high' : score >= 1 ? 'medium' : 'low'
}

/** Diagnose growth constraints from inputs. Distinguishes 7 constraint types. */
export function diagnoseGrowth(inputs: GrowthInputs): GrowthDiagnosis {
  const findings: ConstraintFinding[] = []
  const num = (v: number | null | undefined) => (typeof v === 'number' ? v : null)

  // Capacity first — never tell a full-capacity contractor to just buy more leads.
  if (inputs.atCapacity === true) {
    findings.push({ constraint: 'capacity', severity: 'high', evidence: 'You indicated you are at or near capacity — growth is limited by fulfillment, not lead volume.' })
  }

  // Conversion / sales-process signals.
  const close = num(inputs.closeRatePct)
  const booking = num(inputs.bookingRatePct)
  const response = num(inputs.responseMinutes)
  const missed = num(inputs.missedCallsWeekly)
  let convScore = 0
  const convEvidence: string[] = []
  if (response !== null && response > 30) { convScore += 1; convEvidence.push('slow lead response (>30 min)') }
  if (missed !== null && missed >= 3) { convScore += 1; convEvidence.push('several missed calls per week') }
  if (booking !== null && booking < 50) { convScore += 1; convEvidence.push('low booking rate') }
  if (inputs.followUpProcess === false) { convScore += 1; convEvidence.push('no systematic estimate follow-up') }
  if (convScore > 0) findings.push({ constraint: 'sales_process', severity: sev(convScore), evidence: `Conversion is leaking before the sale: ${convEvidence.join(', ')}.` })
  if (close !== null && close < 35) findings.push({ constraint: 'conversion', severity: sev(close < 20 ? 3 : 2), evidence: 'Low close rate — estimates are not converting to won work.' })

  // Lead / visibility.
  const leads = num(inputs.monthlyLeads)
  if (leads !== null && leads < 10 && inputs.atCapacity !== true) {
    findings.push({ constraint: 'lead', severity: sev(leads < 5 ? 3 : 2), evidence: 'Low monthly lead volume with spare capacity — visibility is a real constraint.' })
  }

  // Brand.
  const reviews = num(inputs.reviewCount)
  let brandScore = 0
  const brandEvidence: string[] = []
  if (inputs.gbpComplete === false) { brandScore += 1; brandEvidence.push('Google Business Profile incomplete') }
  if (reviews !== null && reviews < 10) { brandScore += 1; brandEvidence.push('few reviews') }
  if (brandScore > 0) findings.push({ constraint: 'brand', severity: sev(brandScore), evidence: `Local recognition is thin: ${brandEvidence.join(', ')}.` })

  // Retention.
  const repeat = num(inputs.repeatCustomerPct)
  const referrals = num(inputs.referralsMonthly)
  let retScore = 0
  const retEvidence: string[] = []
  if (repeat !== null && repeat < 20) { retScore += 1; retEvidence.push('low repeat-customer rate') }
  if (referrals !== null && referrals < 2) { retScore += 1; retEvidence.push('few referrals') }
  if (inputs.recurringRevenue === false) { retScore += 1; retEvidence.push('no recurring/agreement revenue') }
  if (retScore > 0) findings.push({ constraint: 'retention', severity: sev(retScore), evidence: `Existing customers are under-monetized: ${retEvidence.join(', ')}.` })

  // Pricing / margin.
  const ticket = num(inputs.avgTicket)
  if (ticket !== null && ticket > 0 && ticket < 250) {
    findings.push({ constraint: 'pricing', severity: 'medium', evidence: 'Low average ticket — pricing, options, or job mix may be leaving margin on the table.' })
  }

  // Rank: severity then a stable constraint order.
  const order: GrowthConstraint[] = ['capacity', 'sales_process', 'conversion', 'lead', 'retention', 'brand', 'pricing']
  const sevRank: Record<GrowthPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  findings.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || order.indexOf(a.constraint) - order.indexOf(b.constraint))

  const primary = findings[0] ?? null
  const secondary = findings.slice(1, 4)

  // Strongest existing capability (a positive).
  let strongest: string | null = null
  if (close !== null && close >= 50) strongest = 'Your close rate is strong — your sales conversation works.'
  else if (leads !== null && leads >= 20) strongest = 'You have solid lead volume to build on.'
  else if (reviews !== null && reviews >= 25) strongest = 'Your review base is a real local-trust asset.'
  else if (repeat !== null && repeat >= 30) strongest = 'You have a loyal repeat-customer base to grow from.'

  // Data confidence.
  const conf = inputs.confidence ?? {}
  const untracked = Object.values(conf).filter(c => c === 'not_tracked').length
  const dataConfidenceNote = untracked >= 3
    ? 'Some recommendations have lower confidence because several key sales metrics are not yet tracked. Start tracking them to sharpen your direction.'
    : null

  const summary = primary
    ? `Your primary growth constraint looks like ${CONSTRAINT_LABELS[primary.constraint].toLowerCase()} — ${primary.evidence}`
    : 'Not enough signals to pinpoint a single constraint yet. Add a few numbers (leads, response time, close rate) for a sharper read.'

  return { primary, secondary, strongest, summary, dataConfidenceNote }
}

// ── Action library (constraint → actions), trade/stage-aware where it matters ───
function actionsForConstraint(c: GrowthConstraint, trade: GrowthTrade | null): GrowthAction[] {
  const A = (id: string, label: string, why: string, priority: GrowthPriority, bucket: GrowthBucket): GrowthAction =>
    ({ id, label, why, constraint: c, priority, bucket })
  switch (c) {
    case 'capacity': return [
      A('cap-triage', 'Protect capacity before adding leads', 'More leads you can’t serve damages reviews and cash flow.', 'critical', 'do_now'),
      A('cap-price', 'Use pricing/scheduling to manage demand', 'Raising price or tightening scheduling grows revenue without more crews.', 'high', 'do_next'),
      A('cap-hire', 'Plan your next hire or subcontractor', 'Capacity is the real lever — build the team to take more work.', 'medium', 'later'),
    ]
    case 'sales_process': return [
      A('sp-missed', 'Recover missed calls and slow responses first', 'Most lost jobs leak here, before any ad spend.', 'critical', 'do_now'),
      A('sp-followup', 'Build a same-day + multi-touch estimate follow-up', 'Most jobs are won in the follow-up, not the first call.', 'high', 'do_now'),
      A('sp-options', 'Present good/better/best options', 'Options raise average ticket and close rate.', 'medium', 'do_next'),
    ]
    case 'conversion': return [
      A('cv-script', 'Tighten your booking + sales conversation', 'A clear discovery → options → next step lifts close rate.', 'high', 'do_now'),
      A('cv-lostreason', 'Track lost reasons on every quote', 'You can’t fix conversion you don’t measure.', 'medium', 'do_next'),
    ]
    case 'lead': return [
      A('ld-gbp', 'Complete + optimize your Google Business Profile', 'It’s how most local customers find and choose you.', 'high', 'do_now'),
      A('ld-reviews', 'Turn on a consent-first review request process', 'Reviews drive both visibility and trust.', 'high', 'do_next'),
      A('ld-paid', 'Only then test paid/local-service ads', 'Paid leads amplify a working funnel — not a leaky one.', 'medium', 'later'),
    ]
    case 'retention': return [
      A('rt-followup', 'Add post-job follow-up + review/referral asks', 'Your existing customers are your cheapest growth.', 'high', 'do_now'),
      A('rt-reactivate', 'Reactivate lapsed customers and unsold estimates', 'Warm lists convert far better than cold leads.', 'high', 'do_next'),
      A('rt-recurring', `Offer ${trade ? 'a' : 'a'} maintenance plan or service agreement`, 'Recurring revenue smooths cash flow and lifts lifetime value.', 'medium', 'later'),
    ]
    case 'brand': return [
      A('br-gbp', 'Complete your Google Business Profile + listings', 'Consistent, complete listings build local trust.', 'high', 'do_now'),
      A('br-reviews', 'Build review count + respond to reviews', 'Rating and recency drive local choice.', 'high', 'do_next'),
      A('br-visibility', 'Add neighborhood visibility (signage, wraps)', 'Repeated local presence compounds recognition.', 'low', 'later'),
    ]
    case 'pricing': return [
      A('pr-costing', 'Confirm job costing + overhead before scaling', 'Scaling unprofitable jobs scales losses.', 'high', 'do_now'),
      A('pr-options', 'Introduce options + value framing', 'Good/better/best raises average ticket ethically.', 'medium', 'do_next'),
    ]
  }
}

/** Build the full prioritized growth roadmap from inputs. Pure. */
export function buildGrowthRoadmap(inputs: GrowthInputs): GrowthRoadmap {
  const diagnosis = diagnoseGrowth(inputs)
  const trade = inputs.trade ?? null
  const constraints = [diagnosis.primary, ...diagnosis.secondary].filter(Boolean) as ConstraintFinding[]
  const seen = new Set<string>()
  const actions: GrowthAction[] = []
  for (const f of constraints) {
    for (const a of actionsForConstraint(f.constraint, trade)) {
      if (!seen.has(a.id)) { seen.add(a.id); actions.push(a) }
    }
  }
  const bucketRank: Record<GrowthBucket, number> = { do_now: 0, do_next: 1, later: 2 }
  const prioRank: Record<GrowthPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  actions.sort((a, b) => bucketRank[a.bucket] - bucketRank[b.bucket] || prioRank[a.priority] - prioRank[b.priority])

  return { diagnosis, actions, channels: recommendChannels(inputs, diagnosis), kpis: GROWTH_KPIS }
}

// ── Channel recommendations (constraint + capacity aware; not every channel) ────
function recommendChannels(inputs: GrowthInputs, dx: GrowthDiagnosis): ChannelRecommendation[] {
  const out: ChannelRecommendation[] = []
  const primary = dx.primary?.constraint
  // If the constraint is conversion/sales/capacity, fix the funnel before new channels.
  if (primary === 'sales_process' || primary === 'conversion' || primary === 'capacity') {
    out.push({ id: 'fix-funnel', label: 'Fix the funnel before adding channels', why: 'New channels amplify whatever your funnel already does.', fitNote: 'Highest ROI right now is conversion/capacity, not more spend.' })
  }
  // Always-relevant local foundation.
  out.push({ id: 'gbp', label: 'Google Business Profile + local SEO', why: 'The default way local customers find and choose contractors.', fitNote: 'Low cost; foundational for every trade.' })
  out.push({ id: 'reviews-referrals', label: 'Reviews + referral system', why: 'Compounding, low-cost, trust-driven growth.', fitNote: 'Best fit when you have happy past customers.' })
  if (primary === 'lead' || primary === 'brand') {
    out.push({ id: 'lsa', label: 'Google Local Services Ads', why: 'Pay-per-lead, local intent, trust badge.', fitNote: 'Fit once your response + booking process is ready.' })
    out.push({ id: 'directories', label: 'Local directories / map presence', why: 'Consistent listings improve discovery.', fitNote: 'Low effort; supports brand recognition.' })
  }
  if (primary === 'retention') {
    out.push({ id: 'reactivation', label: 'Existing-customer reactivation', why: 'Warm customers convert far cheaper than cold leads.', fitNote: 'Best fit when you have a customer database.' })
  }
  return out
}

// ── Safe local-storage contract (local-first; cloud optional/future) ────────────
export const GROWTH_ENGINE_KEY = 'szm_growth_engine'

export function loadGrowthInputs(): GrowthInputs | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(GROWTH_ENGINE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as GrowthInputs) : null
  } catch { return null }
}

export function saveGrowthInputs(inputs: GrowthInputs): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(GROWTH_ENGINE_KEY, JSON.stringify(inputs)) } catch { /* non-fatal */ }
}
