// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingPathways — Wave 4 sixty explicit trade × state pathways (pure data)
// ─────────────────────────────────────────────────────────────────────────────
// One explicit pathway for each of the 10 launch trades in each of the 6 launch states (= 60).
// These are NOT generic templates that merely swap trade/state labels:
//   • the per-TRADE base differs (permit/inspection reality, work-scope splits, residential vs
//     commercial relevance, routing categories) — 10 genuinely different trade profiles;
//   • the per-(trade × state) classification differs (authority level, jurisdiction complexity,
//     coverage, which jurisdiction levels may govern, local-verification need) — sourced from the
//     authoritative per-combo notes already curated in src/lib/tradeData.ts.
// Each pathway points at the official source(s) backing it and carries safe, non-legal,
// verify-before-action language. No score, gate, priority, or path engine is created here.
// ─────────────────────────────────────────────────────────────────────────────

import { TRADE_REGISTRY, CANONICAL_TRADE_IDS, type CanonicalTradeId } from './trades'
import { STATE_REGISTRY, CANONICAL_STATE_IDS } from './states'
import { getLicensingSource, getPathwaySources } from './licensingSources'
import {
  LICENSING_REVIEWED_DATE,
  type CanonicalStateId, type TradeStatePathway, type AuthorityLevel,
  type JurisdictionComplexity, type PathwayCoverage, type JurisdictionLevel,
  type RoutingCategoryId,
} from './licensingTypes'

// ── Per-trade base: the trade-intrinsic, state-independent half of every pathway ─
interface TradePathwayBase {
  residentialRelevant: boolean
  commercialRelevant: boolean
  permitInspection: string
  workScopeDistinctions: string[]
  routingCategories: RoutingCategoryId[]
}

const TRADE_BASE: Record<CanonicalTradeId, TradePathwayBase> = {
  hvac: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Equipment changeouts and new installs typically require a mechanical permit and inspection; refrigerant handling is federally regulated (EPA Section 608).',
    workScopeDistinctions: [
      'Service/repair, equipment replacement, and new-construction installs carry different permit and license expectations.',
      'Light-commercial and refrigerant work can trigger additional certification beyond a residential service license.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'safety_compliance', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association', 'education_exam_prep'],
  },
  electrical: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Most electrical work requires a permit and inspection; service upgrades and new circuits are commonly inspected before energizing.',
    workScopeDistinctions: [
      'Apprentice / journeyman / master tiers gate who may pull permits and supervise work.',
      'Residential, commercial, and industrial scope can change the required license class.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'safety_compliance', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association', 'education_exam_prep'],
  },
  plumbing: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Plumbing work generally requires a permit and inspection, and a master plumber often must pull the permit of record.',
    workScopeDistinctions: [
      'Apprentice / journeyman / master tiers determine permit-pulling and supervision.',
      'Service/repair, new install, gas, and water-treatment scope can each be treated differently.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association', 'education_exam_prep'],
  },
  handyman: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Minor cosmetic repairs are often permit-exempt, but work above a dollar/scope threshold or touching electrical, plumbing, gas, or structural elements typically requires a licensed contractor and permits.',
    workScopeDistinctions: [
      'Licensing usually turns on job-value thresholds and whether the work touches a licensed trade.',
      'Cosmetic and minor repair vs. licensed-trade work (electrical/plumbing/structural) is the key line.',
    ],
    routingCategories: ['licensing_authority', 'municipal_county_office', 'permit_office', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association'],
  },
  landscaping: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Routine maintenance rarely needs a permit, but commercial pesticide/herbicide application is licensed, and irrigation, grading, or hardscape work can trigger permits.',
    workScopeDistinctions: [
      'Maintenance, chemical application, and installation/hardscape carry different licensing.',
      'Applying pesticides or herbicides for hire generally requires an applicator license.',
    ],
    routingCategories: ['licensing_authority', 'municipal_county_office', 'permit_office', 'insurance_professional', 'accountant_tax', 'field_service_software', 'safety_compliance', 'trade_association', 'education_exam_prep'],
  },
  painting: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Painting itself rarely needs a permit, but commercial work and disturbing pre-1978 paint (EPA RRP lead-safe rules) carry federal/contractor requirements.',
    workScopeDistinctions: [
      'Residential repaint, commercial, and new-construction work can be treated differently.',
      'Disturbing pre-1978 paint triggers EPA Renovation, Repair and Painting (RRP) certification.',
    ],
    routingCategories: ['licensing_authority', 'municipal_county_office', 'insurance_professional', 'accountant_tax', 'field_service_software', 'safety_compliance', 'trade_association'],
  },
  roofing: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Re-roofs and tear-offs almost always require a permit and inspection; wind-uplift, underlayment, and code-upgrade requirements are commonly enforced.',
    workScopeDistinctions: [
      'Repair, full re-roof, and new construction can carry different requirements.',
      'Insurance / storm-restoration work adds contracting, contingency, and supplement considerations.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'bonding_provider', 'contractor_attorney', 'insurance_professional', 'accountant_tax', 'safety_compliance', 'trade_association', 'education_exam_prep'],
  },
  solar: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Solar installs require electrical and often structural/building permits, plus utility interconnection approval and inspection before energizing.',
    workScopeDistinctions: [
      'Electrical interconnection and structural mounting can require different licenses.',
      'Battery storage and utility interconnection add separate approvals and timelines.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'bonding_provider', 'insurance_professional', 'accountant_tax', 'safety_compliance', 'trade_association', 'education_exam_prep'],
  },
  construction: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Building permits and staged inspections apply to most structural, addition, and remodel work; each subtrade also carries its own permits.',
    workScopeDistinctions: [
      'Residential vs. commercial classification and project-value tiers can change the license required.',
      'Self-performed vs. subcontracted trades each carry their own licensing.',
    ],
    routingCategories: ['licensing_authority', 'permit_office', 'municipal_county_office', 'bonding_provider', 'contractor_attorney', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association', 'education_exam_prep'],
  },
  cleaning: {
    residentialRelevant: true, commercialRelevant: true,
    permitInspection: 'Cleaning rarely requires a trade license or permit; business registration, liability insurance, and (for some chemical/biohazard work) safety compliance are the main considerations.',
    workScopeDistinctions: [
      'Residential vs. commercial/janitorial work differ in contracting and insurance expectations.',
      'Specialized cleaning (biohazard, post-construction) can add safety and compliance requirements.',
    ],
    routingCategories: ['licensing_authority', 'municipal_county_office', 'insurance_professional', 'accountant_tax', 'field_service_software', 'trade_association', 'safety_compliance'],
  },
}

// ── Per-(trade × state) classification facts (60 explicit entries) ─────────────
// Authoritative authority-structure for each combo, classified from the curated tradeData notes.
// The state-specific NOTE itself lives on the official source (licensingSources), keeping one
// source of truth; these facts capture the structural shape used by the adapter and UI.
interface PathwayFacts {
  authorityLevel: AuthorityLevel
  jurisdictionComplexity: JurisdictionComplexity
  coverage: PathwayCoverage
  ruleScopes: JurisdictionLevel[]
  localVerificationRequired: boolean
  scopeDependent: boolean
}

const F = (
  authorityLevel: AuthorityLevel, jurisdictionComplexity: JurisdictionComplexity,
  coverage: PathwayCoverage, ruleScopes: JurisdictionLevel[],
  localVerificationRequired: boolean, scopeDependent: boolean,
): PathwayFacts => ({ authorityLevel, jurisdictionComplexity, coverage, ruleScopes, localVerificationRequired, scopeDependent })

// Keyed `<trade>_<state>`. Every one of the 60 combos is present and explicit.
const PATHWAY_FACTS: Record<string, PathwayFacts> = {
  // HVAC — state-licensed in FL/CO/TX/AZ/NC; local-governed in OH.
  hvac_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  hvac_CO: F('state_plus_local', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  hvac_TX: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  hvac_AZ: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  hvac_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, false),
  hvac_NC: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),

  // Electrical — state-licensed in FL/CO/TX/AZ/NC; no statewide license in OH (local).
  electrical_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  electrical_CO: F('state_plus_local', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  electrical_TX: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  electrical_AZ: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  electrical_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, false),
  electrical_NC: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),

  // Plumbing — state-licensed in FL/CO/TX/AZ/NC; set locally in OH.
  plumbing_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  plumbing_CO: F('state_plus_local', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  plumbing_TX: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  plumbing_AZ: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  plumbing_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, false),
  plumbing_NC: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),

  // Handyman — scope/threshold-dependent everywhere; OH is local-only.
  handyman_FL: F('scope_dependent', 'moderate', 'verify_local', ['state', 'local'], true, true),
  handyman_CO: F('scope_dependent', 'moderate', 'verify_local', ['local'], true, true),
  handyman_TX: F('scope_dependent', 'moderate', 'verify_local', ['local', 'city'], true, true),
  handyman_AZ: F('scope_dependent', 'moderate', 'verify_local', ['state'], true, true),
  handyman_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, true),
  handyman_NC: F('scope_dependent', 'moderate', 'verify_local', ['state', 'local'], true, true),

  // Landscaping — business registration + pesticide-applicator license (state agency) if chemicals.
  landscaping_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  landscaping_CO: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  landscaping_TX: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  landscaping_AZ: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  landscaping_OH: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  landscaping_NC: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),

  // Painting — mostly business registration only; FL/AZ add scope-dependent commercial licensing.
  painting_FL: F('scope_dependent', 'moderate', 'verify_local', ['state', 'local'], true, true),
  painting_CO: F('business_registration_only', 'low', 'verify_local', ['local'], true, false),
  painting_TX: F('business_registration_only', 'low', 'verify_local', ['local'], true, false),
  painting_AZ: F('scope_dependent', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  painting_OH: F('business_registration_only', 'low', 'verify_local', ['local'], true, false),
  painting_NC: F('business_registration_only', 'low', 'verify_local', ['local'], true, false),

  // Roofing — licensed in FL/AZ/NC; no statewide license (local) in TX/CO/OH.
  roofing_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  roofing_CO: F('local_only', 'moderate', 'verify_local', ['local', 'county', 'city'], true, false),
  roofing_TX: F('local_only', 'moderate', 'verify_local', ['local', 'county', 'city'], true, false),
  roofing_AZ: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),
  roofing_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, false),
  roofing_NC: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, false),

  // Solar — electrical contractor license for interconnection (scope split vs structural); OH local.
  solar_FL: F('state_agency', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  solar_CO: F('state_plus_local', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  solar_TX: F('state_board', 'moderate', 'confirmed_pathway', ['state', 'local'], true, true),
  solar_AZ: F('state_board', 'high', 'confirmed_pathway', ['state', 'local'], true, true),
  solar_OH: F('local_only', 'high', 'partial', ['local', 'county', 'city'], true, true),
  solar_NC: F('state_board', 'high', 'confirmed_pathway', ['state', 'local'], true, true),

  // Construction / GC — state GC license in FL/AZ/NC; no statewide GC in TX/CO (trades licensed); OH mixed.
  construction_FL: F('state_agency', 'high', 'confirmed_pathway', ['state', 'local'], true, true),
  construction_CO: F('local_only', 'high', 'verify_local', ['local', 'county', 'city'], true, true),
  construction_TX: F('local_only', 'high', 'verify_local', ['local', 'county', 'city'], true, true),
  construction_AZ: F('state_board', 'high', 'confirmed_pathway', ['state', 'local'], true, true),
  construction_OH: F('state_plus_local', 'high', 'partial', ['state', 'local', 'county'], true, true),
  construction_NC: F('state_board', 'high', 'confirmed_pathway', ['state', 'local'], true, true),

  // Cleaning — no trade license in any launch state; business registration + insurance.
  cleaning_FL: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], false, false),
  cleaning_CO: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], false, false),
  cleaning_TX: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], false, false),
  cleaning_AZ: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], false, false),
  cleaning_OH: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], false, false),
  cleaning_NC: F('business_registration_only', 'low', 'verify_local', ['state', 'local'], true, false),
}

export function pathwayKey(tradeId: CanonicalTradeId, stateId: CanonicalStateId): string {
  return `${tradeId}_${stateId}`
}

// Safe, non-legal, verify-before-action disclaimer tuned to the authority structure.
function buildDisclaimer(
  facts: PathwayFacts, tradeName: string, stateName: string,
): string {
  const verify = ' Confirm the current requirement with the official authority before you bid, register, or pull permits.'
  switch (facts.authorityLevel) {
    case 'local_only':
      return `${stateName} does not license ${tradeName} at the state level, so requirements vary by city and county.${verify}`
    case 'scope_dependent':
      return `In ${stateName}, whether ${tradeName} needs a license often turns on job value and scope, and exemption thresholds change.${verify}`
    case 'business_registration_only':
      return `${stateName} generally does not require a trade license for ${tradeName}, but business registration, insurance, and local rules still apply.${verify}`
    case 'state_plus_local':
      return `${stateName} licenses ${tradeName} at the state level and local jurisdictions add their own permitting.${verify}`
    case 'state_agency':
    case 'state_board':
    default:
      return `${stateName} licenses ${tradeName} at the state level, and local permitting still applies.${verify}`
  }
}

// Compose one full pathway from the trade base + per-combo facts + official source(s).
function buildPathway(tradeId: CanonicalTradeId, stateId: CanonicalStateId): TradeStatePathway {
  const base = TRADE_BASE[tradeId]
  const facts = PATHWAY_FACTS[pathwayKey(tradeId, stateId)]
  const sources = getPathwaySources(tradeId, stateId)
  const tradeName = TRADE_REGISTRY[tradeId].displayName
  const stateName = STATE_REGISTRY[stateId].displayName
  const src = getLicensingSource(tradeId, stateId)
  return {
    id: `path_${tradeId}_${stateId}`,
    tradeId,
    stateId,
    authorityLevel: facts.authorityLevel,
    jurisdictionComplexity: facts.jurisdictionComplexity,
    ruleScopes: facts.ruleScopes,
    scopeDependent: facts.scopeDependent,
    residentialRelevant: base.residentialRelevant,
    commercialRelevant: base.commercialRelevant,
    permitInspection: base.permitInspection,
    workScopeDistinctions: base.workScopeDistinctions,
    localVerificationRequired: facts.localVerificationRequired,
    sourceIds: sources.map(s => s.id),
    reviewedDate: LICENSING_REVIEWED_DATE,
    coverage: facts.coverage,
    disclaimer: buildDisclaimer(facts, tradeName, stateName),
    routingCategories: base.routingCategories,
    stateNote: src?.notes ?? '',
  }
}

// Build all 60 pathways once, keyed `path_<trade>_<state>`.
export const LICENSING_PATHWAYS: Record<string, TradeStatePathway> = (() => {
  const out: Record<string, TradeStatePathway> = {}
  for (const tradeId of CANONICAL_TRADE_IDS) {
    for (const stateId of CANONICAL_STATE_IDS) {
      const p = buildPathway(tradeId, stateId)
      out[p.id] = p
    }
  }
  return out
})()

export function getPathway(
  tradeId: CanonicalTradeId | null, stateId: CanonicalStateId | null,
): TradeStatePathway | null {
  if (tradeId == null || stateId == null) return null
  return LICENSING_PATHWAYS[`path_${tradeId}_${stateId}`] ?? null
}

export function allPathways(): TradeStatePathway[] {
  return Object.values(LICENSING_PATHWAYS)
}
