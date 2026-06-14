// ─────────────────────────────────────────────────────────────────────────────
// metrix/tradeIntelligence — the one Wave 3 trade-intelligence composer (pure adapter)
// ─────────────────────────────────────────────────────────────────────────────
// deriveTradeIntelligence reads the canonical snapshot (+ optional Wave 2 ProfileIntelligence)
// and projects the resolved trade's modifier into richer, explainable, trade-aware advisory
// content. It is a CANONICAL ADAPTER:
//   • introduces NO new numeric score, gate, priority, completion path, or reassessment engine;
//   • carries NO priority/score field — it can inform explanations/questions/routing but can
//     never replace or override the canonical priority;
//   • reuses the Wave 2 progressive-question filter for trade questions (one filter, no dupe);
//   • reuses the Wave 2 evidence-confidence read (honest, evidence-based);
//   • is deterministic (same snapshot ⇒ same output) and defensive (never throws on
//     missing / malformed / legacy / unsupported-trade input).
// No Wave 4 state/licensing logic; no legal/benchmark/predictive/partner/outcome claims.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MetrixProfileSnapshot, NextBestQuestion, RawAnswers,
} from './profileTypes'
import type { EvidenceConfidence, ProfileIntelligence } from './intelligenceTypes'
import { deriveEvidenceConfidence } from './profileCompleteness'
import { filterQuestionCandidates } from './progressiveQuestions'
import { resolveTrade, type ResolvedTrade } from './trades'
import { TRADE_MODIFIERS, type TradeModifier, type TradeQuestionTemplate } from './tradeModifiers'
import {
  TRADE_INTELLIGENCE_VERSION,
  type TradeIntelligence, type CanonicalTradeRef,
} from './tradeIntelligenceTypes'

export interface TradeIntelligenceOptions {
  /** Bound trade-aware questions (default 3). */
  limit?: number
  /** Question/evidence/candidate ids the user has dismissed (UI state). */
  dismissed?: string[]
  /** Wave 2 intelligence (reused for evidence confidence where provided — single source). */
  intelligence?: ProfileIntelligence
}

// Pick the best available trade source off the snapshot (defensive about shape).
function readTradeSource(s: MetrixProfileSnapshot): string | null {
  const ctx = s?.businessContext?.trade
  if (typeof ctx === 'string' && ctx.trim() !== '') return ctx
  const norm = s?.normalizedAnswers?.trade
  if (typeof norm === 'string' && norm.trim() !== '') return norm
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as { business_type?: unknown }
  if (typeof raw.business_type === 'string' && raw.business_type.trim() !== '') return raw.business_type
  return null
}

function toRef(r: ResolvedTrade): CanonicalTradeRef {
  return {
    id: r.id,
    displayName: r.displayName,
    supported: r.supportStatus === 'supported',
    supportStatus: r.supportStatus,
    matchedFrom: r.matchedFrom,
  }
}

// Expand a trade question template into a canonical NextBestQuestion (stable ids; never claims
// to change the priority). Ranked by declaration order within the trade.
function toQuestion(modId: string, t: TradeQuestionTemplate, rank: number): NextBestQuestion {
  return {
    candidateId: `tq_${modId}_${t.suffix}`,
    questionKey: t.questionKey,
    evidenceKey: t.evidenceKey,
    reason: t.reason,
    relatedGateId: null,
    expectedDecisionImpact: t.impact,
    urgency: t.urgency,
    blocking: false,
    currentDataStatus: t.dataStatus,
    rank,
  }
}

function buildTradeQuestions(
  s: MetrixProfileSnapshot,
  mod: TradeModifier,
  opts: TradeIntelligenceOptions,
): NextBestQuestion[] {
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as RawAnswers
  // Don't repeat a question the canonical engine already surfaces elsewhere.
  const canonicalKeys = new Set(
    (Array.isArray(s?.nextBestQuestions) ? s.nextBestQuestions : []).map(q => q?.questionKey),
  )
  const candidates = mod.questionCandidates
    .map((t, i) => toQuestion(mod.id, t, i + 1))
    .filter(q => !canonicalKeys.has(q.questionKey))
  // Reuse the ONE progressive filter (dedupe / answered-suppression / dismissed / bounded).
  return filterQuestionCandidates(candidates, raw, { limit: opts.limit ?? 3, dismissed: opts.dismissed })
}

// Safe output for missing / unsupported / malformed trade — never throws, no fabricated content.
function fallback(ref: CanonicalTradeRef, confidence: EvidenceConfidence): TradeIntelligence {
  const rationale = ref.supportStatus === 'unsupported'
    ? `“${ref.displayName}” is not one of the supported launch trades yet, so trade-specific guidance is limited.`
    : 'No trade is set yet, so trade-specific guidance is limited. Add your trade to personalize this.'
  return {
    trade: ref,
    supported: false,
    operatingModel: '',
    revenueModel: '',
    customerDemand: '',
    dimensions: [],
    strengths: [],
    risks: [],
    importantUnknowns: [],
    evidenceNeeds: [],
    operatingConstraints: [],
    recurringRevenueOpportunities: [],
    ownerDependencyIndicators: [],
    capacityConsiderations: [],
    recommendedResourceCategories: [],
    nextBestQuestions: [],
    confidence: 'low',
    rationale,
    version: TRADE_INTELLIGENCE_VERSION,
  }
}

/**
 * The single composed trade-intelligence object for a snapshot. Pure adapter — given the same
 * snapshot + options, the output is identical. Never throws on malformed/legacy/unsupported input.
 */
export function deriveTradeIntelligence(
  s: MetrixProfileSnapshot,
  opts: TradeIntelligenceOptions = {},
): TradeIntelligence {
  const resolved = resolveTrade(readTradeSource(s))
  const ref = toRef(resolved)
  // Evidence confidence: reuse the supplied Wave 2 read, else derive it (single source).
  const confidence: EvidenceConfidence = opts.intelligence?.evidenceConfidence ?? deriveEvidenceConfidence(s)

  if (!ref.supported || ref.id == null) return fallback(ref, confidence)
  const mod = TRADE_MODIFIERS[ref.id]
  if (!mod) return fallback(ref, confidence)

  return {
    trade: ref,
    supported: true,
    operatingModel: mod.operatingModel,
    revenueModel: mod.revenueModel,
    customerDemand: mod.customerDemand,
    dimensions: mod.dimensions,
    strengths: mod.strengths,
    risks: mod.risks,
    importantUnknowns: mod.importantUnknowns,
    evidenceNeeds: mod.evidenceNeeds,
    operatingConstraints: mod.operatingConstraints,
    recurringRevenueOpportunities: mod.recurringRevenue,
    ownerDependencyIndicators: mod.ownerDependency,
    capacityConsiderations: mod.capacity,
    recommendedResourceCategories: mod.resourceCategories,
    nextBestQuestions: buildTradeQuestions(s, mod, opts),
    confidence,
    rationale: `Trade-specific read for ${ref.displayName}, based on your profile evidence (confidence: ${confidence}). It refines your plan; it never changes your canonical priority.`,
    version: TRADE_INTELLIGENCE_VERSION,
  }
}
