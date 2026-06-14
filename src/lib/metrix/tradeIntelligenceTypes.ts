// ─────────────────────────────────────────────────────────────────────────────
// metrix/tradeIntelligenceTypes — Wave 3 trade-intelligence types (pure types only)
// ─────────────────────────────────────────────────────────────────────────────
// The shapes for the additive, deterministic TRADE intelligence layer derived ON TOP of the
// canonical snapshot + the Wave 2 ProfileIntelligence. No logic here. This layer NEVER
// introduces a new numeric score, gate, priority, path, or reassessment engine — it projects
// the canonical trade into richer, explainable, trade-aware advisory content. Names avoid
// clashing with canonical (profileTypes) and Wave 2 (intelligenceTypes) names.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextBestQuestion } from './profileTypes'
import type { EvidenceConfidence } from './intelligenceTypes'
import type { CanonicalTradeId, TradeSupportStatus } from './trades'

export const TRADE_INTELLIGENCE_VERSION = 1

// ── Shared, reusable contractor-business dimensions ────────────────────────────
// The canonical catalog of business-model dimensions every trade is modelled against.
// Each trade selects a meaningful subset and gives it a trade-specific value + intensity.
export type ContractorDimensionId =
  | 'residential_commercial_mix'
  | 'work_type_mix'            // service vs install vs project work
  | 'emergency_vs_planned'
  | 'recurring_maintenance'
  | 'average_ticket'
  | 'crew_capacity'            // technician / crew capacity
  | 'owner_dependency'
  | 'seasonality'
  | 'callback_rework'
  | 'warranty_exposure'
  | 'equipment_inventory'      // equipment, tool, vehicle, material, inventory exposure
  | 'permit_inspection'
  | 'gross_margin_pressure'
  | 'labor_intensity'
  | 'cash_flow_timing'
  | 'subcontractor_dependency'
  | 'sales_cycle'
  | 'scheduling_complexity'
  | 'safety_risk'

export type DimensionIntensity = 'low' | 'moderate' | 'high' | 'variable'

export interface ContractorDimension {
  id: ContractorDimensionId
  label: string               // shared label pulled from the dimension catalog (reused, not re-typed)
  summary: string             // trade-specific characterization
  intensity: DimensionIntensity
}

// ── A single derived conclusion, always carrying its rationale ─────────────────
export interface TradeInsight {
  id: string
  label: string
  detail: string
  because: string             // why this conclusion was drawn (explainability requirement)
}

// ── Recommended resource / specialist categories (CATEGORIES only — no providers) ─
// Intentionally no URLs / affiliate ids: the canonical layer wires no real providers
// (mirrors the empty externalResourceIds rule). No legal/partner/outcome claims.
export type ResourceCategoryKind = 'specialist' | 'software' | 'resource' | 'authority'
export interface ResourceCategory {
  id: string
  label: string
  kind: ResourceCategoryKind
  reason: string
}

// ── The canonical trade reference for the output ───────────────────────────────
export interface CanonicalTradeRef {
  id: CanonicalTradeId | null
  displayName: string
  supported: boolean
  supportStatus: TradeSupportStatus
  matchedFrom: string | null
}

// ── The composite trade-intelligence object (one canonical adapter output) ─────
// NOTE: deliberately carries NO priority/score/gate fields — trade intelligence informs
// explanations/questions/routing but can never replace or override the canonical priority.
export interface TradeIntelligence {
  trade: CanonicalTradeRef
  supported: boolean
  operatingModel: string
  revenueModel: string
  customerDemand: string
  dimensions: ContractorDimension[]
  strengths: TradeInsight[]
  risks: TradeInsight[]
  importantUnknowns: TradeInsight[]
  evidenceNeeds: TradeInsight[]
  operatingConstraints: TradeInsight[]
  recurringRevenueOpportunities: TradeInsight[]
  ownerDependencyIndicators: TradeInsight[]
  capacityConsiderations: TradeInsight[]
  recommendedResourceCategories: ResourceCategory[]
  nextBestQuestions: NextBestQuestion[]   // trade-aware, filtered through the Wave 2 framework
  confidence: EvidenceConfidence          // honest, evidence-based (reused from Wave 2)
  rationale: string                       // one-line basis for the overall read
  version: number
}
