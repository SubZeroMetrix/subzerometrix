// ─────────────────────────────────────────────────────────────────────────────
// metrix/tradeModifiers — Wave 3 explicit per-trade modifiers (pure data)
// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, hand-authored modifiers for every launch trade. Each trade has materially
// different operating/revenue/demand models, dimensions, strengths, risks, unknowns, evidence
// needs, constraints, recurring-revenue opportunities, owner-dependency + capacity notes,
// resource categories, and trade-aware question candidates. These are NOT copy-paste shells —
// the content reflects the real economics of each trade (and draws on src/lib/tradeData.ts).
//
// No score/gate/priority is computed here. Trade questions never claim to CHANGE the canonical
// priority (impact is refines_roadmap / improves_confidence only) — they inform, never override.
// No state/licensing pathways (Wave 4); no legal/benchmark/predictive/partner/outcome claims;
// resource categories carry no providers/URLs/affiliates.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  QuestionImpact, QuestionUrgency, QuestionDataStatus,
} from './profileTypes'
import type {
  ContractorDimension, ContractorDimensionId, DimensionIntensity,
  TradeInsight, ResourceCategory, ResourceCategoryKind,
} from './tradeIntelligenceTypes'
import type { CanonicalTradeId } from './trades'

// ── Shared dimension catalog: ONE label per dimension, reused by every trade ────
export const DIMENSION_LABELS: Record<ContractorDimensionId, string> = {
  residential_commercial_mix: 'Residential vs commercial',
  work_type_mix: 'Service vs install vs project',
  emergency_vs_planned: 'Emergency vs planned',
  recurring_maintenance: 'Recurring maintenance',
  average_ticket: 'Average ticket',
  crew_capacity: 'Crew / technician capacity',
  owner_dependency: 'Owner dependency',
  seasonality: 'Seasonality',
  callback_rework: 'Callback / rework exposure',
  warranty_exposure: 'Warranty exposure',
  equipment_inventory: 'Equipment / material exposure',
  permit_inspection: 'Permit / inspection exposure',
  gross_margin_pressure: 'Gross-margin pressure',
  labor_intensity: 'Labor intensity',
  cash_flow_timing: 'Cash-flow timing',
  subcontractor_dependency: 'Subcontractor dependency',
  sales_cycle: 'Sales-cycle length',
  scheduling_complexity: 'Scheduling complexity',
  safety_risk: 'Safety / operational risk',
}

// ── Trade-aware question candidate template (expanded into a NextBestQuestion later) ─
export interface TradeQuestionTemplate {
  suffix: string                 // → candidateId `tq_<trade>_<suffix>`
  questionKey: string            // stable; distinct from canonical question keys
  evidenceKey: string
  reason: string
  impact: QuestionImpact         // refines_roadmap | improves_confidence only (never changes_priority)
  urgency: QuestionUrgency
  dataStatus: QuestionDataStatus
}

export interface TradeModifier {
  id: CanonicalTradeId
  operatingModel: string
  revenueModel: string
  customerDemand: string
  dimensions: ContractorDimension[]
  strengths: TradeInsight[]
  risks: TradeInsight[]
  importantUnknowns: TradeInsight[]
  evidenceNeeds: TradeInsight[]
  operatingConstraints: TradeInsight[]
  recurringRevenue: TradeInsight[]
  ownerDependency: TradeInsight[]
  capacity: TradeInsight[]
  resourceCategories: ResourceCategory[]
  questionCandidates: TradeQuestionTemplate[]
}

// ── Tiny builders (keep the data terse + the catalog label reused) ─────────────
const dim = (id: ContractorDimensionId, summary: string, intensity: DimensionIntensity): ContractorDimension =>
  ({ id, label: DIMENSION_LABELS[id], summary, intensity })
const ins = (id: string, label: string, detail: string, because: string): TradeInsight =>
  ({ id, label, detail, because })
const rc = (id: string, label: string, kind: ResourceCategoryKind, reason: string): ResourceCategory =>
  ({ id, label, kind, reason })
const q = (
  suffix: string, questionKey: string, evidenceKey: string, reason: string,
  impact: QuestionImpact, urgency: QuestionUrgency, dataStatus: QuestionDataStatus,
): TradeQuestionTemplate => ({ suffix, questionKey, evidenceKey, reason, impact, urgency, dataStatus })

// ─────────────────────────────────────────────────────────────────────────────
// 1. HVAC
// ─────────────────────────────────────────────────────────────────────────────
const HVAC: TradeModifier = {
  id: 'hvac',
  operatingModel: 'Diagnostic service calls plus high-ticket equipment replacement, mostly residential with light commercial.',
  revenueModel: 'Service tickets fund the week; replacement installs drive the year; maintenance agreements flatten both.',
  customerDemand: 'Weather-driven and seasonally concentrated — demand spikes in the first hot and first cold weeks.',
  dimensions: [
    dim('recurring_maintenance', 'Maintenance agreements are the defining recurring-revenue lever in HVAC.', 'high'),
    dim('seasonality', 'Revenue concentrates heavily in peak heating and cooling months.', 'high'),
    dim('average_ticket', 'Low on service calls, very high on equipment replacement.', 'variable'),
    dim('equipment_inventory', 'Refrigerant handling, equipment, and truck stock carry real cost and regulation.', 'high'),
    dim('crew_capacity', 'Technician utilization decides whether added capacity pays for itself.', 'high'),
    dim('warranty_exposure', 'A bad install or voided warranty can erase the margin from many service calls.', 'high'),
  ],
  strengths: [
    ins('hvac_agreements', 'Recurring agreement base', 'Maintenance agreements create predictable revenue and convert to replacements at a much higher rate.', 'Agreement customers replace equipment with you far more often than non-agreement customers.'),
    ins('hvac_replacement', 'High-ticket replacements', 'Equipment replacement produces large tickets that fund growth when close rate is healthy.', 'A single replacement can equal dozens of service calls in revenue.'),
  ],
  risks: [
    ins('hvac_seasonal', 'Seasonal concentration', 'A large share of revenue lands in a few months, straining year-round cash flow.', 'Off-peak months can starve cash if no recurring base smooths them.'),
    ins('hvac_keytech', 'Key-technician dependency', 'Losing one strong tech can drop capacity sharply overnight.', 'Capacity is tied to a few skilled people who are hard to replace.'),
    ins('hvac_warranty', 'Warranty / callback drag', 'Install defects and callbacks quietly erode margin.', 'Rework is unbilled labor that lowers your effective rate.'),
  ],
  importantUnknowns: [
    ins('hvac_u_agreements', 'Agreement count', 'How many active maintenance agreements you carry shapes your recurring floor.', 'It is the single biggest predictor of stability in HVAC.'),
    ins('hvac_u_mix', 'Service vs replacement mix', 'The split between service and replacement revenue changes the growth plan.', 'Service and install have very different margins and staffing needs.'),
  ],
  evidenceNeeds: [
    ins('hvac_e_util', 'Technician utilization', 'Billed vs available technician hours tells you if you need another tech or better dispatch.', 'Low utilization means paying for idle capacity; sustained high means it is time to hire.'),
    ins('hvac_e_close', 'Replacement close rate', 'The share of replacement proposals that close gauges sales effectiveness.', 'A weak close rate leaves large tickets on the table.'),
  ],
  operatingConstraints: [
    ins('hvac_c_refrigerant', 'Refrigerant + equipment cost', 'Refrigerant certification and equipment/truck stock are non-optional costs of doing the work.', 'You cannot legally or practically run calls without them.'),
    ins('hvac_c_dispatch', 'Dispatch is the bottleneck', 'Past solo, scheduling and dispatch cap how many calls you can run cleanly.', 'Admin chaos limits throughput before technician count does.'),
  ],
  recurringRevenue: [
    ins('hvac_r_agreements', 'Maintenance agreement program', 'A structured agreement program is the highest-leverage recurring move in HVAC.', 'It smooths seasonality and feeds replacement demand.'),
  ],
  ownerDependency: [
    ins('hvac_o_calls', 'Owner running every call', 'When the owner runs all service and dispatch, growth stalls at one person.', 'The business cannot run a day without the owner in the field or on the phone.'),
  ],
  capacity: [
    ins('hvac_cap_tech', 'Technician count vs call volume', 'Capacity is technician hours against call demand, especially off-peak.', 'Filling off-peak capacity with agreements is what makes hiring safe.'),
  ],
  resourceCategories: [
    rc('hvac_rc_fsm', 'Field service / dispatch software', 'software', 'Scheduling, dispatch, and agreement tracking are core to HVAC throughput.'),
    rc('hvac_rc_agreement', 'Maintenance-agreement tooling', 'software', 'Tracking renewals and visit reminders sustains the recurring base.'),
    rc('hvac_rc_insurance', 'General liability insurance', 'resource', 'Standard coverage for an equipment- and property-touching trade.'),
  ],
  questionCandidates: [
    q('agreements', 'hvac_maintenance_agreements', 'hvac_agreement_count', 'How many active maintenance agreements you carry sets your recurring-revenue floor.', 'refines_roadmap', 'soon', 'missing'),
    q('mix', 'hvac_service_install_mix', 'hvac_revenue_mix', 'Your service-vs-replacement revenue split shapes staffing and the growth plan.', 'refines_roadmap', 'later', 'uncertain'),
    q('capacity', 'hvac_tech_capacity', 'hvac_tech_utilization', 'Whether you are at technician capacity decides if hiring or dispatch comes first.', 'improves_confidence', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ELECTRICAL
// ─────────────────────────────────────────────────────────────────────────────
const ELECTRICAL: TradeModifier = {
  id: 'electrical',
  operatingModel: 'Residential service plus commercial project work, with a fast-growing EV / panel-upgrade segment.',
  revenueModel: 'Flat-rate service calls and project bids, increasingly supplemented by EV and interconnect work.',
  customerDemand: 'Steady residential service, general-contractor referrals, and commercial projects with longer lead times.',
  dimensions: [
    dim('permit_inspection', 'Most electrical work is permit- and inspection-bound; first-pass pass rate matters.', 'high'),
    dim('residential_commercial_mix', 'Residential service and commercial projects are two distinct operations.', 'variable'),
    dim('work_type_mix', 'Quick service calls and multi-day projects need different systems.', 'variable'),
    dim('callback_rework', 'Callbacks are costly and reputational in a safety-critical trade.', 'moderate'),
    dim('labor_intensity', 'Licensed and apprentice labor is the core input and the scarce one.', 'high'),
    dim('safety_risk', 'Code compliance and safety carry license-level consequences.', 'high'),
  ],
  strengths: [
    ins('elec_barrier', 'High barrier to entry', 'The licensing and skill barrier reduces price competition from unlicensed operators.', 'Fewer low-cost competitors can legally do the work.'),
    ins('elec_growth', 'EV / upgrade growth', 'EV charging and panel upgrades are a fast-growing, often-underserved revenue line.', 'Demand for electrification work is rising in most markets.'),
  ],
  risks: [
    ins('elec_code', 'Code / permit exposure', 'Violations and unpermitted work put the license — and the whole business — at risk.', 'The license is the business; losing it stops everything.'),
    ins('elec_bid', 'Commercial underbidding', 'Underestimating labor hours on commercial jobs destroys project margin.', 'Production rates must be known before bidding fixed scopes.'),
    ins('elec_labor', 'Licensed-labor scarcity', 'Qualified electricians are hard to hire, capping safe growth.', 'You cannot build on unlicensed labor without taking on risk.'),
  ],
  importantUnknowns: [
    ins('elec_u_mix', 'Residential vs commercial', 'The residential/commercial split decides which systems and hires come next.', 'They are effectively two different businesses.'),
    ins('elec_u_permit', 'Permit-required share', 'How much of your work requires permits shapes scheduling and overhead.', 'Permit-bound work has different timing and paperwork costs.'),
  ],
  evidenceNeeds: [
    ins('elec_e_rate', 'Effective billable rate', 'Revenue per billed labor hour after callbacks and drive time reveals true pricing.', 'Many electricians track what they charge, not what they actually earn.'),
    ins('elec_e_callback', 'Callback rate', 'The share of jobs that need a return visit gauges quality and margin leakage.', 'Callbacks are unbilled hours that lower the effective rate.'),
  ],
  operatingConstraints: [
    ins('elec_c_permit', 'Permit dependency', 'Permit and inspection cycles gate when much of the work can proceed.', 'Scheduling is constrained by inspection availability, not just crew time.'),
    ins('elec_c_license', 'Owner-held qualification', 'When only the owner can pull permits, the owner is a hard capacity limit.', 'Jobs requiring the qualifying individual cannot run in parallel.'),
  ],
  recurringRevenue: [
    ins('elec_r_service', 'Service / maintenance agreements', 'A service-agreement program is widely ignored in electrical and adds recurring revenue.', 'Most electrical shops leave this recurring line untapped.'),
    ins('elec_r_commercial', 'Commercial maintenance', 'Scheduled commercial maintenance smooths the project-heavy revenue curve.', 'Recurring commercial work offsets lumpy project timing.'),
  ],
  ownerDependency: [
    ins('elec_o_permit', 'Owner is the qualifier', 'If only the owner can pull permits or run jobs, the business stalls at one job at a time.', 'A second licensed person is required to scale safely.'),
  ],
  capacity: [
    ins('elec_cap_journeyman', 'Licensed staff beyond the owner', 'Adding a licensed journeyman is the first real capacity unlock.', 'Capacity is bounded by licensed hands, not demand.'),
  ],
  resourceCategories: [
    rc('elec_rc_jobcost', 'Job-costing / accounting software', 'software', 'Commercial projects need job-level P&L and progress billing.'),
    rc('elec_rc_fsm', 'Field service software', 'software', 'Flat-rate service quoting and scheduling for residential work.'),
    rc('elec_rc_evse', 'EV / specialty certification path', 'specialist', 'Manufacturer EVSE training opens a growing referral-driven line.'),
  ],
  questionCandidates: [
    q('mix', 'elec_residential_commercial_mix', 'elec_revenue_mix', 'Your residential-vs-commercial split shapes the next hire and systems.', 'refines_roadmap', 'soon', 'uncertain'),
    q('permit', 'elec_permit_dependency', 'elec_permit_share', 'How much of your work is permit-bound affects scheduling and overhead planning.', 'refines_roadmap', 'later', 'missing'),
    q('project', 'elec_service_project_mix', 'elec_project_share', 'Whether projects or service dominate decides which workflow to systemize first.', 'improves_confidence', 'later', 'uncertain'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUMBING
// ─────────────────────────────────────────────────────────────────────────────
const PLUMBING: TradeModifier = {
  id: 'plumbing',
  operatingModel: 'Emergency and scheduled service plus remodel and light commercial work.',
  revenueModel: 'Emergency calls bring urgency-priced cash; flat-rate service, water treatment, and drain agreements build the base.',
  customerDemand: 'Urgency-driven — customers call at their worst moment and value speed over price.',
  dimensions: [
    dim('emergency_vs_planned', 'A large share of demand is unplanned emergency work.', 'high'),
    dim('average_ticket', 'Wide range from small service repairs to large remodel or sewer jobs.', 'variable'),
    dim('recurring_maintenance', 'Drain and water-treatment programs add a recurring layer most plumbers skip.', 'moderate'),
    dim('warranty_exposure', 'Water damage from faulty work is the top liability claim in the trade.', 'high'),
    dim('work_type_mix', 'Service, remodel, and commercial each schedule and price differently.', 'variable'),
    dim('cash_flow_timing', 'Service is fast cash; remodel and commercial stretch payment timing.', 'moderate'),
  ],
  strengths: [
    ins('plumb_emergency', 'Urgency-priced demand', 'Emergency demand supports premium pricing and fast cash conversion.', 'Customers in an emergency prioritize speed over shopping price.'),
    ins('plumb_water', 'High-margin water treatment', 'Water treatment and filtration are among the highest-margin residential products.', 'Each service call is a natural water-quality conversation.'),
  ],
  risks: [
    ins('plumb_damage', 'Water-damage liability', 'Faulty work can cause expensive water damage and claims.', 'It is the most common and costly liability in plumbing.'),
    ins('plumb_emonly', 'Emergency-only fragility', 'Relying purely on emergencies leaves slow periods exposed.', 'Without recurring or maintenance work, demand is unpredictable.'),
    ins('plumb_material', 'Material cost swings', 'Copper and PEX price spikes can erode margins on jobs bid earlier.', 'Long-dated bids absorb material inflation.'),
  ],
  importantUnknowns: [
    ins('plumb_u_mix', 'Emergency vs planned', 'The emergency/planned split shapes staffing and on-call structure.', 'On-call coverage and scheduling depend on this balance.'),
    ins('plumb_u_flat', 'Flat-rate adoption', 'How much work is flat-rate vs time-and-material affects margin and predictability.', 'Flat rate removes price shock and slow-tech incentives.'),
  ],
  evidenceNeeds: [
    ins('plumb_e_water', 'Water-treatment attach rate', 'How often water-quality assessments turn into sales gauges an untapped line.', 'It is the highest-margin add to a normal service call.'),
    ins('plumb_e_drain', 'Drain-agreement count', 'Active drain-maintenance agreements measure recurring revenue.', 'They convert one-time drain calls into repeat revenue.'),
  ],
  operatingConstraints: [
    ins('plumb_c_oncall', '24/7 availability', 'Capturing emergency demand requires reliable after-hours coverage.', 'Missed emergency calls go to whoever answers first.'),
    ins('plumb_c_markup', 'Material markup discipline', 'Healthy material markup is standard and protects margin.', 'Under-marking materials silently lowers job profit.'),
  ],
  recurringRevenue: [
    ins('plumb_r_drain', 'Drain-maintenance agreements', 'Annual drain agreements turn emergency customers into recurring ones.', 'The emergency call is the introduction; the agreement is the business.'),
    ins('plumb_r_water', 'Water-treatment program', 'A structured water-treatment offer adds recurring filter/service revenue.', 'Filtration creates ongoing service and replacement touchpoints.'),
  ],
  ownerDependency: [
    ins('plumb_o_calls', 'Owner takes every emergency', 'When the owner answers all emergencies, time off is impossible and growth caps.', 'On-call burden falls entirely on one person.'),
  ],
  capacity: [
    ins('plumb_cap_licensed', 'Second licensed plumber', 'A license cannot be two places at once; a second licensed plumber unlocks capacity.', 'Demand quickly outgrows a single licensed person.'),
  ],
  resourceCategories: [
    rc('plumb_rc_fsm', 'Field service software', 'software', 'Scheduling, flat-rate quoting, and dispatch for service volume.'),
    rc('plumb_rc_flat', 'Flat-rate pricing tooling', 'software', 'A flat-rate book standardizes pricing across techs.'),
    rc('plumb_rc_insurance', 'General liability insurance', 'resource', 'Water-damage exposure makes solid coverage essential.'),
  ],
  questionCandidates: [
    q('mix', 'plumb_emergency_planned_mix', 'plumb_demand_mix', 'Your emergency-vs-planned split shapes on-call structure and staffing.', 'refines_roadmap', 'soon', 'uncertain'),
    q('agreements', 'plumb_maintenance_agreements', 'plumb_agreement_count', 'Active drain or service agreements measure your recurring-revenue base.', 'refines_roadmap', 'later', 'missing'),
    q('ticket', 'plumb_avg_ticket', 'plumb_ticket_band', 'Your average ticket band tells whether service or larger jobs lead the business.', 'improves_confidence', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HANDYMAN SERVICES
// ─────────────────────────────────────────────────────────────────────────────
const HANDYMAN: TradeModifier = {
  id: 'handyman',
  operatingModel: 'High-volume, low-ticket multi-skill repairs for residential customers and property managers.',
  revenueModel: 'Per-job or hourly small jobs, sustained by repeat customers and property-manager accounts.',
  customerDemand: 'Broad, steady residential demand driven by word-of-mouth and repeat relationships.',
  dimensions: [
    dim('average_ticket', 'Low average ticket means volume and pricing discipline drive revenue.', 'low'),
    dim('scheduling_complexity', 'Many small, scattered jobs make routing and scheduling the real challenge.', 'high'),
    dim('owner_dependency', 'The owner typically performs nearly all the work personally.', 'high'),
    dim('work_type_mix', 'A wide mix of small repair types across many skill areas.', 'variable'),
    dim('labor_intensity', 'Revenue is almost entirely the owner’s billable hours.', 'high'),
    dim('recurring_maintenance', 'Property-manager and repeat accounts add a light recurring layer.', 'moderate'),
  ],
  strengths: [
    ins('handy_startup', 'Low startup cost', 'Minimal equipment and licensing barriers make cash flow fast from day one.', 'You can start earning with tools you likely already own.'),
    ins('handy_repeat', 'Repeat / property-manager pull', 'Repeat customers and property managers create steady, low-acquisition-cost work.', 'A reliable handyman gets called back for everything.'),
  ],
  risks: [
    ins('handy_ticket', 'Low-ticket ceiling', 'Low tickets cap revenue unless volume and pricing are managed deliberately.', 'Without pricing discipline, more hours is the only growth lever.'),
    ins('handy_scope', 'Scope creep', 'Undefined small jobs invite scope creep and unpaid time.', 'Vague jobs expand without matching pay.'),
    ins('handy_outside', 'Out-of-scope work', 'Taking on permit- or license-bound tasks creates liability beyond the trade.', 'Some requested work legally requires a licensed specialist.'),
  ],
  importantUnknowns: [
    ins('handy_u_ticket', 'Average ticket', 'The typical job size determines how many jobs a week the business needs.', 'It sets the volume target for any income goal.'),
    ins('handy_u_repeat', 'Repeat-customer share', 'How much work is repeat vs new shapes marketing vs retention focus.', 'Repeat-heavy businesses scale on service, not ads.'),
  ],
  evidenceNeeds: [
    ins('handy_e_jobs', 'Jobs per week', 'Weekly job throughput reveals whether capacity or demand is the limit.', 'It is the core capacity metric for a solo operator.'),
    ins('handy_e_accounts', 'Recurring accounts', 'Number of property-manager or recurring accounts measures the stable base.', 'These accounts smooth an otherwise lumpy week.'),
  ],
  operatingConstraints: [
    ins('handy_c_owner', 'Owner is the capacity', 'With the owner doing all jobs, total hours is the hard ceiling.', 'There is no revenue when the owner is not working.'),
    ins('handy_c_route', 'Routing many small jobs', 'Drive time between scattered small jobs eats billable hours.', 'Poor routing can halve effective daily capacity.'),
  ],
  recurringRevenue: [
    ins('handy_r_pm', 'Property-manager accounts', 'Recurring punch-list work from property managers is the steadiest revenue.', 'Managers need a dependable go-to for ongoing small repairs.'),
  ],
  ownerDependency: [
    ins('handy_o_all', 'Owner does everything', 'The business is the owner; nothing happens without them on a job.', 'Sales, scheduling, and the work all sit on one person.'),
  ],
  capacity: [
    ins('handy_cap_hours', 'Weekly hour ceiling', 'Capacity is the owner’s billable hours until a first helper is added.', 'A helper for materials and drive time frees billable hours.'),
  ],
  resourceCategories: [
    rc('handy_rc_sched', 'Scheduling / invoicing software', 'software', 'Simple scheduling and invoicing keeps a high-volume, low-ticket book organized.'),
    rc('handy_rc_books', 'Bookkeeping', 'resource', 'Tracking many small jobs keeps margins and taxes clean.'),
    rc('handy_rc_insurance', 'General liability insurance', 'resource', 'Working in customers’ homes makes basic coverage essential.'),
  ],
  questionCandidates: [
    q('ticket', 'handy_avg_ticket', 'handy_ticket_band', 'Your average job size sets the weekly volume needed to hit an income goal.', 'refines_roadmap', 'soon', 'missing'),
    q('repeat', 'handy_repeat_share', 'handy_repeat_customers', 'Your repeat-vs-new mix decides whether to invest in retention or acquisition.', 'improves_confidence', 'later', 'uncertain'),
    q('capacity', 'handy_owner_capacity', 'handy_jobs_per_week', 'Your weekly job count shows whether a first helper is the next move.', 'refines_roadmap', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LANDSCAPING
// ─────────────────────────────────────────────────────────────────────────────
const LANDSCAPING: TradeModifier = {
  id: 'landscaping',
  operatingModel: 'Recurring maintenance routes plus design/install projects, with optional off-season work.',
  revenueModel: 'Recurring maintenance contracts provide the floor; install projects and seasonal work add upside.',
  customerDemand: 'Strongly seasonal, with recurring maintenance demand through the growing season.',
  dimensions: [
    dim('seasonality', 'Demand and revenue swing hard with the growing season.', 'high'),
    dim('recurring_maintenance', 'Weekly/monthly maintenance contracts are the core recurring engine.', 'high'),
    dim('crew_capacity', 'Route density and crew throughput decide profitability.', 'high'),
    dim('equipment_inventory', 'Mowers, trucks, and trailers are significant capital and downtime risk.', 'high'),
    dim('labor_intensity', 'Seasonal crew labor is the main input and the main turnover risk.', 'high'),
    dim('residential_commercial_mix', 'Residential routes and commercial grounds contracts behave differently.', 'variable'),
  ],
  strengths: [
    ins('land_recurring', 'Recurring contract base', 'Maintenance contracts create predictable, renewable revenue.', 'Contracted routes give a dependable revenue floor.'),
    ins('land_density', 'Route-density margin', 'Tight geographic routes raise margin by cutting drive time.', 'More stops per mile means more billable work per crew-day.'),
  ],
  risks: [
    ins('land_season', 'Off-season revenue gap', 'A slow winter can strain cash without an off-season offering.', 'Fixed costs continue when seasonal revenue stops.'),
    ins('land_equipment', 'Equipment downtime', 'Equipment failure directly stops billable crew time.', 'A down mower idles a whole crew.'),
    ins('land_labor', 'Seasonal labor turnover', 'High seasonal turnover raises hiring and training cost each year.', 'Crews must be rebuilt as seasons cycle.'),
  ],
  importantUnknowns: [
    ins('land_u_mix', 'Recurring vs one-off', 'The contract-vs-project split sets how stable the revenue base is.', 'Recurring share is the stability indicator.'),
    ins('land_u_density', 'Route density', 'How clustered accounts are drives crew efficiency.', 'Density is the main margin lever in maintenance.'),
  ],
  evidenceNeeds: [
    ins('land_e_accounts', 'Contracted accounts', 'The number of recurring accounts measures the revenue floor.', 'It is the base everything else builds on.'),
    ins('land_e_crewday', 'Revenue per crew-day', 'Revenue per crew-day gauges routing and pricing health.', 'Low crew-day revenue points to routing or pricing problems.'),
  ],
  operatingConstraints: [
    ins('land_c_weather', 'Weather / season window', 'Work is bounded by weather and the growing-season calendar.', 'Lost days cannot always be recovered.'),
    ins('land_c_crew', 'Crew + equipment pairing', 'Capacity is crews matched with working equipment, not either alone.', 'A crew without equipment, or vice versa, produces nothing.'),
  ],
  recurringRevenue: [
    ins('land_r_contracts', 'Maintenance contracts', 'Weekly/monthly maintenance contracts are the recurring core.', 'They renew and compound season over season.'),
    ins('land_r_offseason', 'Off-season work', 'Snow removal or seasonal cleanups offset the winter gap where applicable.', 'It keeps crews and cash active off-season.'),
  ],
  ownerDependency: [
    ins('land_o_estimate', 'Owner estimating + running crews', 'When the owner estimates and supervises every route, scale stalls.', 'Estimating and crew oversight bottleneck on one person.'),
  ],
  capacity: [
    ins('land_cap_routes', 'Crews and route density', 'Capacity is the number of crews times how densely routed they are.', 'Adding accounts only pays when routes stay tight.'),
  ],
  resourceCategories: [
    rc('land_rc_route', 'Routing / scheduling software', 'software', 'Route optimization is the main efficiency lever in maintenance.'),
    rc('land_rc_equip', 'Equipment financing', 'resource', 'Mowers and trucks are major capital purchases.'),
    rc('land_rc_books', 'Bookkeeping', 'resource', 'Seasonal cash flow needs careful tracking.'),
  ],
  questionCandidates: [
    q('mix', 'land_recurring_mix', 'land_contract_share', 'Your recurring-vs-one-off split sets how stable the revenue base is.', 'refines_roadmap', 'soon', 'uncertain'),
    q('segment', 'land_residential_commercial_mix', 'land_segment_mix', 'Your residential-vs-commercial mix shapes routing and contract strategy.', 'improves_confidence', 'later', 'uncertain'),
    q('capacity', 'land_crew_capacity', 'land_crew_count', 'Your crew count and route density show where the next capacity gain is.', 'refines_roadmap', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PAINTING
// ─────────────────────────────────────────────────────────────────────────────
const PAINTING: TradeModifier = {
  id: 'painting',
  operatingModel: 'Project-based interior and exterior painting for residential and commercial repaint customers.',
  revenueModel: 'Per-project bids with thin recurring revenue; estimating accuracy makes or breaks margin.',
  customerDemand: 'Discretionary and referral-driven, with exterior work concentrated in fair-weather months.',
  dimensions: [
    dim('work_type_mix', 'Almost entirely project work, sized from single rooms to whole buildings.', 'high'),
    dim('seasonality', 'Exterior work concentrates in fair-weather months.', 'moderate'),
    dim('gross_margin_pressure', 'Estimating accuracy and labor productivity drive the whole margin.', 'high'),
    dim('callback_rework', 'Touch-ups and prep failures create unpaid rework.', 'moderate'),
    dim('labor_intensity', 'Crew labor and prep time are the dominant cost.', 'high'),
    dim('cash_flow_timing', 'Deposits and progress billing shape project cash flow.', 'moderate'),
  ],
  strengths: [
    ins('paint_barrier', 'Low equipment barrier', 'Low capital needs make it fast to start and cash-positive early.', 'Minimal equipment is required to take on work.'),
    ins('paint_repeat', 'Referral / repaint cycle', 'Quality work generates referrals and recurring repaint cycles.', 'Satisfied customers repaint and refer reliably.'),
  ],
  risks: [
    ins('paint_estimate', 'Estimate misjudgment', 'Underestimating labor or prep destroys project margin.', 'Margin is set at the estimate, not the job.'),
    ins('paint_weather', 'Weather delays', 'Exterior weather delays compress the productive season.', 'Lost days push schedules and tie up crews.'),
    ins('paint_price', 'Price commoditization', 'Heavy low-price competition pressures margins.', 'Many low-cost entrants compete on price alone.'),
  ],
  importantUnknowns: [
    ins('paint_u_mix', 'Residential vs commercial', 'The residential/commercial split changes bidding and crew structure.', 'Commercial repaint runs on different cycles and terms.'),
    ins('paint_u_estimate', 'Estimate accuracy', 'How close estimates land to actuals reveals margin reliability.', 'Consistent overruns mean the estimating model is off.'),
  ],
  evidenceNeeds: [
    ins('paint_e_size', 'Average project size', 'Typical project value sets throughput and crew planning.', 'It defines how many jobs the calendar needs.'),
    ins('paint_e_rework', 'Rework / touch-up rate', 'How often jobs need rework gauges prep quality and margin leakage.', 'Rework is unpaid labor against a fixed bid.'),
  ],
  operatingConstraints: [
    ins('paint_c_window', 'Crew + weather window', 'Capacity is crew availability inside the usable weather window.', 'Both crew and weather must align to produce.'),
    ins('paint_c_deposit', 'Deposit / progress billing', 'Project cash flow depends on deposit and progress-billing discipline.', 'Material and labor outpace payment without it.'),
  ],
  recurringRevenue: [
    ins('paint_r_commercial', 'Commercial repaint cycles', 'Commercial and property-manager repaint cycles create repeatable work.', 'Buildings repaint on predictable cycles.'),
  ],
  ownerDependency: [
    ins('paint_o_estimate', 'Owner estimating every job', 'When the owner bids every job, throughput caps at their estimating time.', 'Estimating accuracy lives with one person.'),
  ],
  capacity: [
    ins('paint_cap_crew', 'Crew throughput', 'Capacity is how many projects crews can complete per period.', 'Project pace, not demand, usually limits revenue.'),
  ],
  resourceCategories: [
    rc('paint_rc_estimate', 'Estimating software', 'software', 'Accurate estimating is the core margin lever in painting.'),
    rc('paint_rc_jobcost', 'Job-costing / accounting', 'software', 'Comparing estimates to actuals protects margin over time.'),
    rc('paint_rc_insurance', 'General liability insurance', 'resource', 'Property-touching project work needs standard coverage.'),
  ],
  questionCandidates: [
    q('mix', 'paint_residential_commercial_mix', 'paint_segment_mix', 'Your residential-vs-commercial split shapes bidding and crew structure.', 'refines_roadmap', 'soon', 'uncertain'),
    q('size', 'paint_avg_project_size', 'paint_project_band', 'Your average project size sets the throughput the calendar must hit.', 'improves_confidence', 'later', 'missing'),
    q('capacity', 'paint_crew_capacity', 'paint_crew_count', 'Your crew count and project pace show the next capacity move.', 'refines_roadmap', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ROOFING
// ─────────────────────────────────────────────────────────────────────────────
const ROOFING: TradeModifier = {
  id: 'roofing',
  operatingModel: 'Storm-restoration and retail replacement, increasingly with commercial work, run on a weather-driven calendar.',
  revenueModel: 'High-ticket replacement jobs, often insurance-funded with supplements, plus retail and commercial.',
  customerDemand: 'Weather- and storm-event driven, producing sharp demand spikes.',
  dimensions: [
    dim('seasonality', 'Demand spikes around storms and the fair-weather season.', 'high'),
    dim('average_ticket', 'Replacement jobs are high-ticket by nature.', 'high'),
    dim('subcontractor_dependency', 'Installation crews are often subcontracted, making quality control critical.', 'high'),
    dim('warranty_exposure', 'Workmanship warranties and leaks carry real long-tail risk.', 'high'),
    dim('cash_flow_timing', 'Materials are paid upfront while insurance pays slowly.', 'high'),
    dim('safety_risk', 'Steep-roof work is among the higher-risk field activities.', 'high'),
  ],
  strengths: [
    ins('roof_demand', 'Event-driven demand', 'Storm events create concentrated demand spikes.', 'A single storm can fill the pipeline for months.'),
    ins('roof_supplement', 'Supplement upside', 'Skilled insurance supplementing raises realized job value.', 'Most initial insurance scopes miss recoverable line items.'),
  ],
  risks: [
    ins('roof_feast', 'Feast-or-famine cycle', 'Storm dependence creates volatile, hard-to-staff demand.', 'Demand arrives in unpredictable bursts.'),
    ins('roof_supplement_gap', 'Supplement skill gap', 'Weak claim/supplement skills leave money uncollected.', 'Unsupplemented jobs lose recoverable revenue.'),
    ins('roof_sub', 'Subcontractor quality / warranty', 'Subcontracted crews introduce quality and warranty exposure.', 'Callbacks and leaks trace back to install quality.'),
    ins('roof_cash', 'Cash-flow squeeze', 'Paying for materials before insurance pays strains cash.', 'Working capital is consumed between material purchase and payout.'),
  ],
  importantUnknowns: [
    ins('roof_u_mix', 'Insurance vs retail', 'The insurance/retail split changes the sales process and cash cycle.', 'Each path has a different timeline and skill set.'),
    ins('roof_u_supplement', 'Supplement rate', 'How often jobs are supplemented gauges claim sophistication.', 'It directly affects realized revenue per job.'),
  ],
  evidenceNeeds: [
    ins('roof_e_close', 'Insurance close rate', 'The share of inspected claims that become jobs measures sales effectiveness.', 'A weak close rate wastes inspection effort.'),
    ins('roof_e_referral', 'Referral rate', 'Referral share reduces dependence on storm-chasing leads.', 'Referrals convert far better than cold leads.'),
  ],
  operatingConstraints: [
    ins('roof_c_terms', 'Material payment terms', 'Net-30 supplier terms are critical given the insurance cash lag.', 'Terms bridge the gap until payouts arrive.'),
    ins('roof_c_crew', 'Crew / subcontractor scheduling', 'Capturing storm demand requires scalable crew scheduling.', 'Spikes overwhelm fixed crew capacity.'),
  ],
  recurringRevenue: [
    ins('roof_r_commercial', 'Commercial flat-roof maintenance', 'Commercial roof maintenance adds year-round, non-storm revenue.', 'It stabilizes the storm-driven curve.'),
    ins('roof_r_referral', 'Retail referral base', 'A local referral base reduces storm dependence over time.', 'Reputation work is steadier than event work.'),
  ],
  ownerDependency: [
    ins('roof_o_claims', 'Owner handling all claims', 'When the owner runs every adjuster meeting, claim volume caps at their time.', 'Claims expertise sits with one person.'),
  ],
  capacity: [
    ins('roof_cap_crews', 'Concurrent crews', 'Capacity is how many crews can run jobs simultaneously during a spike.', 'Storm revenue is bounded by crews available fast.'),
  ],
  resourceCategories: [
    rc('roof_rc_claims', 'Claims / measurement software', 'software', 'Documentation and estimate-reading drive supplement revenue.'),
    rc('roof_rc_jobmgmt', 'Job-management software', 'software', 'Coordinating crews, materials, and claims across many jobs.'),
    rc('roof_rc_supplier', 'Material supplier terms', 'resource', 'Net-30 terms bridge the insurance cash-flow gap.'),
  ],
  questionCandidates: [
    q('mix', 'roof_insurance_retail_mix', 'roof_revenue_mix', 'Your insurance-vs-retail split shapes the sales process and cash cycle.', 'refines_roadmap', 'soon', 'uncertain'),
    q('ticket', 'roof_avg_ticket', 'roof_ticket_band', 'Your average job value sets working-capital and pipeline planning.', 'improves_confidence', 'later', 'missing'),
    q('crew', 'roof_crew_subcontractor', 'roof_crew_model', 'Whether crews are in-house or subcontracted shapes quality-control priorities.', 'refines_roadmap', 'later', 'uncertain'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SOLAR
// ─────────────────────────────────────────────────────────────────────────────
const SOLAR: TradeModifier = {
  id: 'solar',
  operatingModel: 'Project-based system design and installation with heavy permitting, utility interconnect, and a long sales cycle.',
  revenueModel: 'High-ticket projects, often financing-driven and influenced by incentives, paid across project milestones.',
  customerDemand: 'Driven by energy costs and incentives, with a long consideration and decision cycle.',
  dimensions: [
    dim('sales_cycle', 'Decisions are slow and financing-heavy, stretching the sales cycle.', 'high'),
    dim('permit_inspection', 'Permitting and utility interconnect gate every project.', 'high'),
    dim('average_ticket', 'System installs are high-ticket projects.', 'high'),
    dim('subcontractor_dependency', 'Electrical and roofing scopes are often subcontracted.', 'high'),
    dim('cash_flow_timing', 'Long projects with milestone payments tie up working capital.', 'high'),
    dim('warranty_exposure', 'Production expectations and long warranties create long-tail obligations.', 'high'),
  ],
  strengths: [
    ins('solar_ticket', 'High project value', 'Large per-project tickets generate substantial revenue per close.', 'A single install can equal many smaller jobs.'),
    ins('solar_finance', 'Financing-expanded market', 'Financing widens the pool of customers who can say yes.', 'Monthly-payment framing removes the upfront-cost barrier.'),
  ],
  risks: [
    ins('solar_cycle', 'Long sales cycle', 'Slow decisions tie up cash and sales effort per deal.', 'Pipeline value is locked up for weeks or months.'),
    ins('solar_permit', 'Permit / interconnect delays', 'Permitting and utility interconnect can stall completed installs.', 'Revenue waits on third-party approvals.'),
    ins('solar_incentive', 'Incentive / policy shifts', 'Changes to incentives or net-metering policy can shift demand quickly.', 'Demand is partly policy-dependent and can move fast.'),
    ins('solar_warranty', 'Production-guarantee exposure', 'Production shortfalls against guarantees create long-tail obligations.', 'Warranties extend years past the install.'),
  ],
  importantUnknowns: [
    ins('solar_u_ticket', 'Average system size', 'Typical system size/ticket sets revenue-per-close planning.', 'It anchors the whole revenue model.'),
    ins('solar_u_cycle', 'Sales-cycle length', 'How long deals take shapes pipeline and cash planning.', 'Cycle length drives working-capital needs.'),
  ],
  evidenceNeeds: [
    ins('solar_e_conv', 'Lead-to-install conversion', 'The share of leads that reach installation gauges sales and ops health.', 'Drop-off between sale and install hides real problems.'),
    ins('solar_e_timeline', 'Permit / interconnect timeline', 'Typical approval timelines reveal the true cash cycle.', 'They determine when revenue is actually recognized.'),
  ],
  operatingConstraints: [
    ins('solar_c_ahj', 'Permit + interconnect dependency', 'Local permitting and utility interconnect gate project completion.', 'No install is done until both clear.'),
    ins('solar_c_sub', 'Subcontracted scopes', 'Electrical and roofing subcontractors must be coordinated and reliable.', 'Project timelines depend on subcontractor availability.'),
  ],
  recurringRevenue: [
    ins('solar_r_monitor', 'Monitoring / maintenance plans', 'Monitoring and maintenance plans add recurring revenue after install.', 'Systems need ongoing performance oversight.'),
    ins('solar_r_addon', 'Battery / add-on upsell', 'Battery and add-on sales extend customer value over time.', 'Existing installs are a warm base for upgrades.'),
  ],
  ownerDependency: [
    ins('solar_o_sell', 'Owner selling / designing', 'When the owner sells and designs every system, throughput caps fast.', 'Both sales and design sit with one person.'),
  ],
  capacity: [
    ins('solar_cap_crew', 'Install crews + subs', 'Capacity is install crews plus subcontractor availability.', 'Either constraint can stall the install schedule.'),
  ],
  resourceCategories: [
    rc('solar_rc_design', 'Design / proposal software', 'software', 'System design and proposals are central to the long sales process.'),
    rc('solar_rc_finance', 'Financing partner category', 'resource', 'Financing options expand the addressable market.'),
    rc('solar_rc_pm', 'Project-management software', 'software', 'Coordinating permits, interconnect, and subs across long projects.'),
  ],
  questionCandidates: [
    q('ticket', 'solar_avg_system_ticket', 'solar_ticket_band', 'Your average system value anchors revenue-per-close planning.', 'refines_roadmap', 'soon', 'missing'),
    q('cycle', 'solar_sales_cycle_length', 'solar_cycle_band', 'Your typical sales-cycle length shapes pipeline and cash planning.', 'improves_confidence', 'later', 'uncertain'),
    q('sub', 'solar_subcontractor_dependency', 'solar_sub_model', 'How much electrical/roofing you subcontract shapes coordination priorities.', 'refines_roadmap', 'later', 'uncertain'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CONSTRUCTION / GENERAL CONTRACTING
// ─────────────────────────────────────────────────────────────────────────────
const CONSTRUCTION: TradeModifier = {
  id: 'construction',
  operatingModel: 'Project-based remodels and builds, coordinating multiple trades and subcontractors.',
  revenueModel: 'Large project bids paid through draws and progress billing, with long timelines and retainage.',
  customerDemand: 'Discretionary and referral-driven, often design-build, with long decision and delivery cycles.',
  dimensions: [
    dim('subcontractor_dependency', 'The model orchestrates multiple subcontracted trades.', 'high'),
    dim('cash_flow_timing', 'Draws, progress billing, and retainage shape project cash flow.', 'high'),
    dim('permit_inspection', 'Permits and inspections gate each phase of a project.', 'high'),
    dim('scheduling_complexity', 'Sequencing many trades across a project is the core operational challenge.', 'high'),
    dim('gross_margin_pressure', 'Estimating accuracy on long jobs drives the entire margin.', 'high'),
    dim('sales_cycle', 'Large projects carry long sales and delivery cycles.', 'high'),
  ],
  strengths: [
    ins('con_ticket', 'Large project tickets', 'Big project values produce substantial revenue per job.', 'A single project can anchor months of revenue.'),
    ins('con_orchestrate', 'Orchestration leverage', 'Coordinating subs lets the business scale beyond self-performed labor.', 'Revenue is not capped by the owner’s own hands.'),
  ],
  risks: [
    ins('con_cash', 'Draw / retainage cash flow', 'Draws and retainage can leave the business funding work ahead of payment.', 'Capital is tied up between milestones and final payout.'),
    ins('con_sub', 'Subcontractor reliability', 'Sub delays or quality issues cascade through the schedule.', 'One unreliable sub can stall a whole project.'),
    ins('con_estimate', 'Estimate error on long jobs', 'Misjudged scope on long projects compounds into large losses.', 'Errors set early are paid for at the end.'),
    ins('con_change', 'Change-order disputes', 'Undocumented changes create disputes and unpaid work.', 'Scope drift without paperwork erodes margin.'),
  ],
  importantUnknowns: [
    ins('con_u_size', 'Project size mix', 'The mix of project sizes sets cash and capacity planning.', 'Large and small projects need different systems.'),
    ins('con_u_self', 'Self-perform vs subcontract', 'How much is self-performed vs subbed shapes hiring and risk.', 'It defines where the real operational load sits.'),
  ],
  evidenceNeeds: [
    ins('con_e_margin', 'Gross margin per project', 'Project-level margin reveals whether estimating and execution hold up.', 'It is the true scoreboard for a GC.'),
    ins('con_e_change', 'Change-order process', 'A defined change-order process protects margin on scope changes.', 'Without it, changes become unpaid work.'),
  ],
  operatingConstraints: [
    ins('con_c_permit', 'Permits / inspections', 'Permit and inspection milestones gate when phases can proceed.', 'Progress depends on external approvals.'),
    ins('con_c_sched', 'Subcontractor scheduling', 'Sequencing subs reliably is the central operational constraint.', 'Throughput depends on coordinating others.'),
  ],
  recurringRevenue: [
    ins('con_r_repeat', 'Repeat / developer clients', 'Repeat developer or commercial clients create a steadier pipeline.', 'Relationship clients bring recurring projects.'),
  ],
  ownerDependency: [
    ins('con_o_run', 'Owner estimating + running projects', 'When the owner estimates and runs every project, concurrent capacity is one.', 'Estimating and project management both sit on the owner.'),
  ],
  capacity: [
    ins('con_cap_pm', 'Concurrent projects', 'Capacity is how many projects can run at once with reliable oversight.', 'Adding a project manager unlocks parallel projects.'),
  ],
  resourceCategories: [
    rc('con_rc_pm', 'Project-management / estimating software', 'software', 'Estimating and scheduling are the core GC disciplines.'),
    rc('con_rc_jobcost', 'Job-costing accounting', 'software', 'Project-level P&L and progress billing protect cash and margin.'),
    rc('con_rc_subagreements', 'Subcontractor agreements', 'resource', 'Clear sub agreements manage quality and schedule risk.'),
  ],
  questionCandidates: [
    q('size', 'con_avg_project_size', 'con_project_band', 'Your average project size sets cash and capacity planning.', 'refines_roadmap', 'soon', 'missing'),
    q('self', 'con_self_perform_share', 'con_self_vs_sub', 'Your self-perform-vs-subcontract mix shapes hiring and risk focus.', 'improves_confidence', 'later', 'uncertain'),
    q('change', 'con_change_order_process', 'con_change_orders', 'Whether you have a change-order process protects margin on scope changes.', 'refines_roadmap', 'later', 'missing'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLEANING SERVICES
// ─────────────────────────────────────────────────────────────────────────────
const CLEANING: TradeModifier = {
  id: 'cleaning',
  operatingModel: 'Recurring residential, commercial, and janitorial cleaning delivered by staff teams.',
  revenueModel: 'Recurring contracts are the core; revenue scales with staffed teams at thin per-visit margins.',
  customerDemand: 'Steady and recurring, with commercial contracts providing the most stable base.',
  dimensions: [
    dim('recurring_maintenance', 'Recurring contracts are the defining revenue model.', 'high'),
    dim('labor_intensity', 'The service is almost entirely labor.', 'high'),
    dim('gross_margin_pressure', 'Thin margins make labor cost and scheduling decisive.', 'high'),
    dim('crew_capacity', 'Staffing and turnover are the main capacity constraint.', 'high'),
    dim('residential_commercial_mix', 'Residential and commercial/janitorial contracts behave differently.', 'variable'),
    dim('scheduling_complexity', 'Coordinating many recurring visits across staff is operationally heavy.', 'high'),
  ],
  strengths: [
    ins('clean_recurring', 'Recurring contract base', 'Recurring contracts create highly predictable revenue.', 'Contracted visits renew on a schedule.'),
    ins('clean_startup', 'Low startup cost', 'Low capital needs make the business fast to start and staff-scalable.', 'Minimal equipment is required to begin.'),
  ],
  risks: [
    ins('clean_turnover', 'Labor turnover', 'High staff turnover is the primary growth constraint.', 'The business runs on staff who are hard to retain.'),
    ins('clean_margin', 'Thin margins', 'Tight margins leave little room for wage or supply cost increases.', 'Small cost changes swing profitability.'),
    ins('clean_concentration', 'Client concentration', 'Losing one large contract can sharply cut revenue.', 'Few large clients can dominate the book.'),
  ],
  importantUnknowns: [
    ins('clean_u_mix', 'Recurring vs one-off', 'The recurring/one-off split sets revenue stability.', 'Recurring share is the stability indicator.'),
    ins('clean_u_concentration', 'Client concentration', 'How concentrated revenue is in top clients signals risk.', 'Concentration is the main fragility in cleaning.'),
  ],
  evidenceNeeds: [
    ins('clean_e_recurring', 'Recurring revenue share', 'The percentage of revenue under recurring contract measures the base.', 'It is the core stability metric.'),
    ins('clean_e_turnover', 'Staff turnover', 'Turnover rate gauges the main operational constraint.', 'High turnover quietly caps growth.'),
  ],
  operatingConstraints: [
    ins('clean_c_staff', 'Staffing + scheduling', 'Capacity is reliable staff matched to a recurring schedule.', 'Unfilled shifts directly drop revenue.'),
    ins('clean_c_bonding', 'Bonding + coverage for commercial', 'Commercial contracts typically require bonding and coverage.', 'It is a precondition for many commercial accounts.'),
  ],
  recurringRevenue: [
    ins('clean_r_contracts', 'Recurring cleaning contracts', 'Recurring residential and commercial contracts are the core model.', 'They are the foundation, not an add-on.'),
  ],
  ownerDependency: [
    ins('clean_o_run', 'Owner cleaning + managing', 'When the owner both cleans and manages staff, scale stalls.', 'Delivery and management both sit on one person.'),
  ],
  capacity: [
    ins('clean_cap_teams', 'Teams and turnover', 'Capacity is the number of reliable teams against turnover.', 'Growth depends on hiring faster than attrition.'),
  ],
  resourceCategories: [
    rc('clean_rc_staff', 'Scheduling / staff-management software', 'software', 'Coordinating recurring visits and staff is the core ops need.'),
    rc('clean_rc_payroll', 'Payroll / bookkeeping', 'resource', 'A labor-heavy model needs tight payroll and margin tracking.'),
    rc('clean_rc_bonding', 'Bonding & insurance', 'resource', 'Commercial contracts commonly require bonding and coverage.'),
  ],
  questionCandidates: [
    q('mix', 'clean_recurring_mix', 'clean_recurring_share', 'Your recurring-vs-one-off split sets how stable the revenue base is.', 'refines_roadmap', 'soon', 'missing'),
    q('concentration', 'clean_client_concentration', 'clean_top_client_share', 'How concentrated revenue is in top clients flags fragility.', 'improves_confidence', 'later', 'uncertain'),
    q('capacity', 'clean_staff_capacity', 'clean_team_count', 'Your team count and turnover show where the capacity constraint is.', 'refines_roadmap', 'later', 'missing'),
  ],
}

// ── The one map keyed by canonical trade id ────────────────────────────────────
export const TRADE_MODIFIERS: Record<CanonicalTradeId, TradeModifier> = {
  hvac: HVAC,
  electrical: ELECTRICAL,
  plumbing: PLUMBING,
  handyman: HANDYMAN,
  landscaping: LANDSCAPING,
  painting: PAINTING,
  roofing: ROOFING,
  solar: SOLAR,
  construction: CONSTRUCTION,
  cleaning: CLEANING,
}
