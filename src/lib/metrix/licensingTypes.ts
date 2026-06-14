// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingTypes — Wave 4 state-licensing / jurisdiction / routing types (pure types only)
// ─────────────────────────────────────────────────────────────────────────────
// The shapes for the additive, deterministic LICENSING + JURISDICTION layer derived ON TOP of the
// canonical snapshot (+ optional Wave 2 ProfileIntelligence / Wave 3 TradeIntelligence). No logic
// here. This layer NEVER introduces a new numeric score, gate, priority, completion-path, or
// reassessment engine, and it never overrides the canonical Metrix Priority. It projects the
// resolved trade × state into verify-before-action licensing guidance with official-source
// provenance, reviewed dates, freshness, neutral routing, and safe fallbacks.
//
// Hard rules encoded by these types:
//   • no numeric score / priority field on the output;
//   • every licensing/jurisdiction claim carries an official-source reference + reviewed date;
//   • nothing is presented as guaranteed-complete or guaranteed-current law;
//   • routing categories are commercially NEUTRAL (no providers/URLs/affiliates here).
// ─────────────────────────────────────────────────────────────────────────────

import type { CanonicalTradeId } from './trades'
import type { EvidenceConfidence } from './intelligenceTypes'

export const LICENSING_INTELLIGENCE_VERSION = 1

// The single date this wave's authoritative sources were last reviewed against the issuing
// authorities. Sources are reviewed-as-of this build; freshness logic ages them from here.
export const LICENSING_REVIEWED_DATE = '2026-06-14'
// Default freshness window (days) before a reviewed source should be re-verified.
export const LICENSING_FRESHNESS_WINDOW_DAYS = 180

// ── Canonical six launch states ────────────────────────────────────────────────
export type CanonicalStateId = 'FL' | 'CO' | 'TX' | 'AZ' | 'OH' | 'NC'

export type StateSupportStatus = 'supported' | 'unsupported' | 'unknown'

// State coverage can be complete for the launch matrix, or explicitly partial where a state
// devolves most licensing to local jurisdictions (so we never imply full coverage we don't have).
export type StateCoverageStatus = 'covered' | 'partial' | 'unsupported'

export interface StateRegistryEntry {
  id: CanonicalStateId
  displayName: string
  aliases: string[]                 // canonicalized at match time; abbreviations + full names
  coverage: StateCoverageStatus
  // Official state-level authority references (names only; URLs live on LicensingSource records).
  authorities: StateAuthorityRef[]
  reviewedDate: string
  // A standing, non-legal verify-before-action line surfaced anywhere this state is shown.
  verifyBeforeAction: string
  notes: string
}

export interface StateAuthorityRef {
  name: string                      // e.g. "Arizona Registrar of Contractors"
  role: string                      // e.g. "Contractor licensing"
}

export interface ResolvedState {
  id: CanonicalStateId | null
  displayName: string
  supportStatus: StateSupportStatus
  matchedFrom: string | null
}

// ── Source provenance model (one record per authoritative source) ──────────────
export type SourceType =
  | 'state_board'            // a dedicated trade/contractor licensing board
  | 'state_agency'           // a department/agency (e.g. Dept of Agriculture, DBPR)
  | 'secretary_of_state'     // business registration / corporations
  | 'local_jurisdiction'     // county / city / municipal authority
  | 'statute_admin_code'     // official statute or administrative-code source
  | 'permit_portal'          // official permit / contractor-registration portal

export type JurisdictionLevel = 'state' | 'county' | 'city' | 'municipal' | 'local' | 'mixed'

export type FreshnessStatus = 'fresh' | 'aging' | 'stale' | 'unknown'
export type CorrectionStatus = 'none' | 'reported' | 'under_review'

export interface LicensingSource {
  id: string                        // stable, e.g. `src_hvac_TX`
  authorityName: string             // the issuing authority (from authoritative data)
  title: string                     // human-readable source title
  url: string                       // official URL only
  sourceType: SourceType
  jurisdictionLevel: JurisdictionLevel
  reviewedDate: string              // ISO date this source was last reviewed
  freshnessWindowDays: number       // window before re-verification is advised
  nextReviewDate: string            // reviewedDate + window (computed, stored for transparency)
  tradeApplicability: CanonicalTradeId[]   // [] = all trades
  stateApplicability: CanonicalStateId[]   // [] = all states
  workScopeApplicability: string[]         // [] = all scopes; else specific scope tags
  notes: string
  stale: boolean                    // baseline staleness vs reviewedDate; recomputed against `now`
  correctionStatus: CorrectionStatus
}

// A freshness verdict computed for a source at a given `now` (deterministic).
export interface FreshnessVerdict {
  status: FreshnessStatus
  ageDays: number
  reviewedDate: string
  nextReviewDate: string
  isStale: boolean
  message: string                   // verify-before-action phrasing appropriate to the status
}

// ── Pathway model (one explicit pathway per trade × state) ─────────────────────
export type AuthorityLevel =
  | 'state_board'                   // state board issues a trade/contractor license
  | 'state_agency'                  // a state agency licenses/registers the activity
  | 'state_plus_local'              // state license AND local permits/registration both apply
  | 'local_only'                    // no statewide trade license; local jurisdictions govern
  | 'business_registration_only'    // no trade license; only business registration + insurance
  | 'scope_dependent'               // licensing turns on job value / scope thresholds

export type JurisdictionComplexity = 'low' | 'moderate' | 'high'

// How confident we are that the pathway reflects current authority structure (NOT a score).
export type PathwayCoverage =
  | 'confirmed_pathway'             // authority structure confirmed from an official source
  | 'verify_local'                  // state picture known; local rules must be verified
  | 'partial'                       // material parts devolve to local / scope and need verification

export interface TradeStatePathway {
  id: string                        // `path_<trade>_<state>`
  tradeId: CanonicalTradeId
  stateId: CanonicalStateId
  authorityLevel: AuthorityLevel
  jurisdictionComplexity: JurisdictionComplexity
  // Whether rules may be state / county / city / municipal / scope-dependent (verify locally).
  ruleScopes: JurisdictionLevel[]
  scopeDependent: boolean
  residentialRelevant: boolean
  commercialRelevant: boolean
  permitInspection: string          // permit/inspection considerations for this trade×state
  workScopeDistinctions: string[]   // service vs install vs project / scope splits that matter
  localVerificationRequired: boolean
  sourceIds: string[]               // → LicensingSource.id (official sources backing this pathway)
  reviewedDate: string
  coverage: PathwayCoverage
  disclaimer: string                // safe, non-legal, verify-before-action language
  routingCategories: RoutingCategoryId[]
  stateNote: string                 // the authoritative, state-specific note (differentiated)
}

// ── Trusted routing (NEUTRAL categories only — no providers/URLs/affiliates) ───
export type RoutingCategoryId =
  | 'licensing_authority'
  | 'municipal_county_office'
  | 'permit_office'
  | 'contractor_attorney'
  | 'accountant_tax'
  | 'insurance_professional'
  | 'bonding_provider'
  | 'field_service_software'
  | 'safety_compliance'
  | 'trade_association'
  | 'education_exam_prep'

export interface RoutingCategory {
  id: RoutingCategoryId
  label: string
  kind: 'authority' | 'professional' | 'software' | 'resource'
  reason: string
  // Disclosure stance: this wave wires NO commercial relationships. Any future affiliate/sponsor
  // status must be disclosed and must never alter regulatory guidance or pathway ordering.
  commercial: 'none'
}

// ── Correction reporting (safe payload only — no admin systems, no private user data) ──
export type CorrectionIssueType =
  | 'outdated_source'
  | 'broken_source'
  | 'incorrect_authority'
  | 'incorrect_trade_applicability'
  | 'local_jurisdiction_discrepancy'

export interface CorrectionReportInput {
  tradeId: CanonicalTradeId | null
  stateId: CanonicalStateId | null
  sourceId?: string | null
  issueType: CorrectionIssueType
  details?: string                  // free text from the user (sanitized to a bounded length)
}

export interface CorrectionReport {
  id: string                        // deterministic, content-derived (no PII, no timestamps from user)
  tradeId: CanonicalTradeId | null
  stateId: CanonicalStateId | null
  sourceId: string | null
  issueType: CorrectionIssueType
  details: string
  status: 'received'
  // Where a reporter should also independently verify while the report is reviewed.
  verifyWith: string
}

// ── The composite licensing-intelligence object (one canonical adapter output) ─
// NOTE: deliberately carries NO priority/score/gate field. Licensing intelligence can inform
// next-actions/routing/verification, but can NEVER replace or override the canonical priority.
export type LicensingPathwayStatus =
  | 'supported'                     // trade × launch-state pathway exists
  | 'unsupported_state'             // outside the six launch states (safe fallback)
  | 'unsupported_trade'             // trade not one of the launch trades
  | 'incomplete'                    // recognized but missing trade/state context

export interface LicensingRequirementItem {
  id: string
  label: string
  detail: string
  confirmed: boolean                // true = backed by an official source; false = verify-needed
}

export interface VerificationStep {
  id: string
  label: string
  detail: string
}

export interface LicensingIntelligence {
  status: LicensingPathwayStatus
  trade: { id: CanonicalTradeId | null; displayName: string; supported: boolean }
  state: { id: CanonicalStateId | null; displayName: string; supported: boolean }
  authorityLevel: AuthorityLevel | null
  jurisdictionComplexity: JurisdictionComplexity | null
  knownRequirements: LicensingRequirementItem[]      // clearly marked confirmed vs verify-needed
  importantUnknowns: LicensingRequirementItem[]
  verificationSteps: VerificationStep[]
  officialSources: LicensingSource[]
  permitInspection: string | null
  workScopeDistinctions: string[]
  specialistCategories: RoutingCategory[]
  recommendedNextActions: string[]                   // verify-before-action; never a CTA override
  routingCategories: RoutingCategory[]
  reviewedDate: string | null
  freshness: FreshnessStatus
  staleSources: LicensingSource[]                    // sources past their freshness window
  disclaimer: string                                 // standing non-legal disclaimer
  rationale: string
  confidence: EvidenceConfidence                     // reuses the Wave 2 evidence read (no new score)
  version: number
}
