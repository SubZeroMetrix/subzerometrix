// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingIntelligence — the one Wave 4 licensing/jurisdiction composer (pure adapter)
// ─────────────────────────────────────────────────────────────────────────────
// deriveLicensingIntelligence reads the canonical snapshot (+ optional Wave 2 ProfileIntelligence /
// Wave 3 TradeIntelligence) and projects the resolved trade × state into verify-before-action
// licensing guidance with official-source provenance, freshness, neutral routing, and safe
// fallbacks. It is a CANONICAL ADAPTER:
//   • introduces NO new numeric score, gate, priority, completion path, or reassessment engine;
//   • carries NO priority/score field — it can inform next-actions/routing/verification but can
//     NEVER replace or override the canonical Metrix Priority;
//   • reuses the Wave 2 evidence-confidence read (no parallel score);
//   • is deterministic (same snapshot + same `now` ⇒ same output) and defensive (never throws on
//     missing / malformed / legacy / unsupported-state / unsupported-trade input);
//   • presents nothing as guaranteed-complete or guaranteed-current law; stale/unknown sources
//     route the user to verify with the authority and never degrade the rest of the product.
// No legal conclusions; no non-authoritative sources; no hidden commercial influence.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'
import type { EvidenceConfidence, ProfileIntelligence } from './intelligenceTypes'
import type { TradeIntelligence } from './tradeIntelligenceTypes'
import { deriveEvidenceConfidence } from './profileCompleteness'
import { resolveTrade, type CanonicalTradeId } from './trades'
import { resolveState, STATE_REGISTRY } from './states'
import { readTradeSource, readStateSource } from './profileSources'
import { getPathway } from './licensingPathways'
import { getPathwaySources } from './licensingSources'
import { evaluateFreshness, isSourceStale, rollupFreshness } from './sourceFreshness'
import { getRoutingCategories, getSpecialistCategories, getRoutingCategory } from './licensingRouting'
import {
  LICENSING_INTELLIGENCE_VERSION,
  type LicensingIntelligence, type LicensingRequirementItem, type VerificationStep,
  type LicensingSource, type TradeStatePathway, type AuthorityLevel, type CanonicalStateId,
} from './licensingTypes'

export interface LicensingIntelligenceOptions {
  /** Explicit state override (abbreviation or full name); else read from the snapshot. */
  state?: string | null
  /** Known work scope tags (e.g. ['commercial','install']); informs unknowns/verification only. */
  workScope?: string[]
  /** Residential / commercial context where available (both default to relevant). */
  residential?: boolean
  commercial?: boolean
  /** service | install | project context where relevant. */
  context?: 'service' | 'install' | 'project'
  /** Caller-supplied clock for deterministic freshness; defaults to now(). */
  now?: string
  /** Wave 2 intelligence (reused for evidence confidence — single source). */
  intelligence?: ProfileIntelligence
  /** Wave 3 trade intelligence (read-only; used to enrich rationale, never to override priority). */
  tradeIntelligence?: TradeIntelligence
}

const STANDING_DISCLAIMER = 'This is general, non-legal information to help you verify with the right authority — not legal advice and not a guarantee that requirements are complete or current.'

// Trade/state readers now come from the single canonical source (Wave 9 CP2) so licensing and
// trade intelligence can never diverge.

const req = (id: string, label: string, detail: string, confirmed: boolean): LicensingRequirementItem =>
  ({ id, label, detail, confirmed })
const vstep = (id: string, label: string, detail: string): VerificationStep => ({ id, label, detail })

// Mark a source's `stale` flag against `now` without mutating the registry record.
function withFreshness(source: LicensingSource, now: string): LicensingSource {
  return { ...source, stale: isSourceStale(source, now) }
}

// License/registration requirements implied by the authority structure (clearly confirmed vs verify).
function buildKnownRequirements(p: TradeStatePathway, tradeName: string, source: LicensingSource | null): LicensingRequirementItem[] {
  const confirmedPathway = p.coverage === 'confirmed_pathway'
  const note = source?.notes ?? p.stateNote
  const items: LicensingRequirementItem[] = []
  switch (p.authorityLevel) {
    case 'state_board':
    case 'state_agency':
      items.push(req('license', `${tradeName} state license`, note, confirmedPathway))
      break
    case 'state_plus_local':
      items.push(req('license', `${tradeName} state license`, note, confirmedPathway))
      items.push(req('local_add', 'Local permitting on top of the state license', 'Local jurisdictions add their own permitting and may add registration — confirm with your city/county.', false))
      break
    case 'local_only':
      items.push(req('local_license', 'Licensed locally, not at the state level', note, false))
      break
    case 'scope_dependent':
      items.push(req('scope_threshold', 'Licensing depends on job value and scope', note, false))
      break
    case 'business_registration_only':
      items.push(req('business_reg', 'Business registration & insurance (no state trade license)', note, confirmedPathway))
      break
  }
  // Permits/inspections always apply to how the work is performed, but vary locally → verify-needed.
  items.push(req('permits', 'Permits & inspections', p.permitInspection, false))
  return items
}

function buildImportantUnknowns(p: TradeStatePathway, opts: LicensingIntelligenceOptions): LicensingRequirementItem[] {
  const out: LicensingRequirementItem[] = []
  if (p.localVerificationRequired) {
    out.push(req('local_rules', 'Your city and county rules', 'Local jurisdictions can add licensing, registration, or permit requirements beyond the state picture.', false))
  }
  if (p.scopeDependent) {
    out.push(req('scope', 'Your exact work scope', 'Whether a license is required can depend on job value and whether the work touches a licensed trade — confirm your thresholds.', false))
  }
  // Residential/commercial only surfaced as unknown when the caller has not told us.
  if (p.commercialRelevant && opts.commercial === undefined && opts.residential === undefined) {
    out.push(req('res_comm', 'Residential vs commercial scope', 'Commercial work can require a different license class or additional registration.', false))
  }
  return out
}

function buildVerificationSteps(p: TradeStatePathway, authorityName: string | null, stateName: string): VerificationStep[] {
  const steps: VerificationStep[] = [
    vstep('confirm_authority', 'Confirm with the licensing authority',
      `Check the current license, classification, exam, and fees with ${authorityName ?? 'the issuing authority'} before you act.`),
    vstep('check_local', 'Check your city and county',
      `Local rules in ${stateName} can add to or replace the state requirement — confirm with your local building department.`),
    vstep('verify_permits', 'Verify permit and inspection requirements',
      'Confirm which permits and inspections your specific work needs, and who must pull them.'),
  ]
  if (p.scopeDependent) {
    steps.push(vstep('confirm_scope', 'Confirm the scope threshold',
      'Confirm the job-value or scope point where a license becomes required for your work.'))
  }
  return steps
}

function buildNextActions(p: TradeStatePathway, tradeName: string, stateName: string, authorityName: string | null): string[] {
  const actions = [
    `Confirm ${tradeName} licensing for ${stateName} with ${authorityName ?? 'the official authority'} before you bid or pull permits.`,
    `Check your city and county for added ${tradeName} requirements.`,
  ]
  if (p.scopeDependent) actions.push('Confirm the job-value or scope threshold that triggers a license for your work.')
  return actions
}

// ── Fallbacks (never throw; never imply coverage we don't have) ────────────────
function baseShell(confidence: EvidenceConfidence): Pick<LicensingIntelligence,
  'knownRequirements' | 'importantUnknowns' | 'verificationSteps' | 'officialSources' | 'permitInspection' |
  'workScopeDistinctions' | 'specialistCategories' | 'recommendedNextActions' | 'routingCategories' |
  'reviewedDate' | 'freshness' | 'staleSources' | 'disclaimer' | 'confidence' | 'version'> {
  return {
    knownRequirements: [], importantUnknowns: [], verificationSteps: [], officialSources: [],
    permitInspection: null, workScopeDistinctions: [], specialistCategories: [],
    recommendedNextActions: [], routingCategories: [], reviewedDate: null, freshness: 'unknown',
    staleSources: [], disclaimer: STANDING_DISCLAIMER, confidence, version: LICENSING_INTELLIGENCE_VERSION,
  }
}

// A generic, safe route-to-authority set for unsupported / incomplete cases.
const GENERIC_ROUTES = getRoutingCategories(['licensing_authority', 'municipal_county_office', 'permit_office'])

/**
 * The single composed licensing-intelligence object for a snapshot. Pure adapter — given the same
 * snapshot + options + `now`, the output is identical. Never throws on malformed/legacy/unsupported.
 */
export function deriveLicensingIntelligence(
  s: MetrixProfileSnapshot,
  opts: LicensingIntelligenceOptions = {},
): LicensingIntelligence {
  const now = typeof opts.now === 'string' && opts.now.trim() !== '' ? opts.now : new Date().toISOString()
  const confidence: EvidenceConfidence = opts.intelligence?.evidenceConfidence ?? deriveEvidenceConfidence(s)

  const resolvedTrade = resolveTrade(readTradeSource(s))
  const tradeId: CanonicalTradeId | null = resolvedTrade.supportStatus === 'supported' ? resolvedTrade.id : null
  const tradeRef = { id: tradeId, displayName: resolvedTrade.displayName, supported: tradeId != null }

  const stateInput = opts.state != null && String(opts.state).trim() !== '' ? opts.state : readStateSource(s)
  const resolvedState = resolveState(stateInput)
  const stateId: CanonicalStateId | null = resolvedState.supportStatus === 'supported' ? resolvedState.id : null
  const stateRef = { id: stateId, displayName: resolvedState.displayName, supported: stateId != null }

  // Trade not one of the launch trades → safe unsupported-trade shell.
  if (tradeId == null) {
    const rationale = resolvedTrade.supportStatus === 'unsupported'
      ? `“${resolvedTrade.displayName}” is not one of the supported launch trades yet, so licensing guidance is limited to verifying directly with the authorities.`
      : 'No trade is set yet, so licensing guidance is limited. Add your trade and state to see your pathway.'
    return {
      ...baseShell(confidence),
      status: resolvedTrade.supportStatus === 'unsupported' ? 'unsupported_trade' : 'incomplete',
      trade: tradeRef, state: stateRef,
      authorityLevel: null, jurisdictionComplexity: null,
      routingCategories: GENERIC_ROUTES,
      recommendedNextActions: ['Confirm licensing for your trade and state directly with the official authority before you act.'],
      rationale,
    }
  }

  // Trade supported but state outside the six launch states → unsupported-state fallback.
  if (stateId == null) {
    const isUnsupported = resolvedState.supportStatus === 'unsupported'
    const rationale = isUnsupported
      ? `${resolvedState.displayName} is not one of the six fully supported launch states yet. Verify ${tradeRef.displayName} licensing directly with your state and local authorities.`
      : `Add your state to see the ${tradeRef.displayName} licensing pathway. In the meantime, verify directly with your state and local authorities.`
    return {
      ...baseShell(confidence),
      status: 'unsupported_state',
      trade: tradeRef, state: stateRef,
      authorityLevel: null, jurisdictionComplexity: null,
      routingCategories: GENERIC_ROUTES,
      recommendedNextActions: [
        `Verify ${tradeRef.displayName} licensing with your state licensing authority.`,
        'Check your city and county for local licensing and permit requirements.',
      ],
      rationale,
    }
  }

  // Both supported → compose the full, source-backed pathway.
  const pathway = getPathway(tradeId, stateId)
  if (!pathway) {
    return {
      ...baseShell(confidence),
      status: 'incomplete', trade: tradeRef, state: stateRef,
      authorityLevel: null, jurisdictionComplexity: null, routingCategories: GENERIC_ROUTES,
      rationale: 'This trade and state are supported, but no pathway record was found. Verify directly with the authority.',
    }
  }

  const tradeName = tradeRef.displayName
  const stateName = STATE_REGISTRY[stateId].displayName
  const rawSources = getPathwaySources(tradeId, stateId)
  const officialSources = rawSources.map(src => withFreshness(src, now))
  const primary = officialSources[0] ?? null
  const staleSources = officialSources.filter(src => src.stale)
  const authorityName = primary?.authorityName ?? null

  const authorityLevelLabel: Record<AuthorityLevel, string> = {
    state_board: 'state board license', state_agency: 'state agency license',
    state_plus_local: 'state license plus local permitting', local_only: 'local jurisdiction licensing',
    business_registration_only: 'business registration only', scope_dependent: 'scope-dependent licensing',
  }

  return {
    status: 'supported',
    trade: tradeRef, state: stateRef,
    authorityLevel: pathway.authorityLevel,
    jurisdictionComplexity: pathway.jurisdictionComplexity,
    knownRequirements: buildKnownRequirements(pathway, tradeName, primary),
    importantUnknowns: buildImportantUnknowns(pathway, opts),
    verificationSteps: buildVerificationSteps(pathway, authorityName, stateName),
    officialSources,
    permitInspection: pathway.permitInspection,
    workScopeDistinctions: pathway.workScopeDistinctions,
    specialistCategories: getSpecialistCategories(pathway.routingCategories),
    recommendedNextActions: buildNextActions(pathway, tradeName, stateName, authorityName),
    routingCategories: getRoutingCategories(pathway.routingCategories),
    reviewedDate: pathway.reviewedDate,
    freshness: rollupFreshness(officialSources, now),
    staleSources,
    disclaimer: `${pathway.disclaimer} ${STANDING_DISCLAIMER}`,
    rationale: `Licensing read for ${tradeName} in ${stateName} (${authorityLevelLabel[pathway.authorityLevel]}), based on official sources reviewed ${pathway.reviewedDate}. It points you to verify with the authority; it never changes your Metrix Priority.`,
    confidence,
    version: LICENSING_INTELLIGENCE_VERSION,
  }
}

// Re-export the freshness evaluator at the adapter surface for UI convenience.
export { evaluateFreshness, getRoutingCategory }
