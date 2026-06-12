// ─────────────────────────────────────────────────────────────────────────────
// actionToolMap — connect recommended actions to existing Tier 2 tools (4B)
// ─────────────────────────────────────────────────────────────────────────────
// Maps the recommended action ids (ACTION_CATALOG in pathActions.ts) and the
// MetrixScore categories to EXISTING Tier 2 tools (ids/names from tier2Tools.ts).
// It creates no new tools and makes no affiliate/vendor/endorsement claims — each
// recommendation is the tool's own honest short description.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixCategory } from './metrixEngine'
import { ACTION_CATALOG } from './pathActions'
import { getTier2Tool } from './tier2Tools'

export interface ActionToolRecommendation {
  toolId: string
  toolName: string
  pillar: string
  reason: string   // the tool's own short description — never an affiliate claim
}

export interface ActionToolMapEntry {
  actionId: string
  toolIds: string[]
}

// Recommended-action id → existing Tier 2 tool ids (in priority order).
const ACTION_TOOL_MAP: Record<string, string[]> = {
  // Business Foundation
  bf_entity:  ['business_setup_checklist'],
  bf_banking: ['business_setup_checklist'],
  // Financial Control
  fc_pricing: ['pricing_readiness_checklist', 'financing_conversation_script'],
  fc_books:   ['weekly_business_review_template'],
  // Sales & Marketing
  sm_gbp:      ['gbp_checklist'],
  sm_referral: ['review_request_script', 'lead_followup_checklist'],
  // Operations
  op_schedule:  ['weekly_business_review_template'],
  op_checklist: ['weekly_business_review_template'],
  // Customer Experience
  cx_reviews:  ['review_request_script'],
  cx_followup: ['lead_followup_checklist', 'review_request_script'],
  // Growth & Risk
  gr_reserve: ['weekly_business_review_template'],
  gr_plan:    ['weekly_business_review_template', 'vendor_setup_tracker'],
  // People & Leadership has no direct Tier 2 tool yet → intentionally unmapped.
}

// MetrixScore category → existing Tier 2 tool ids (for phase-level recommendations).
const CATEGORY_TOOL_MAP: Partial<Record<MetrixCategory, string[]>> = {
  business_foundation: ['business_setup_checklist', 'service_agreement_checklist'],
  financial_control:   ['pricing_readiness_checklist', 'financing_conversation_script', 'weekly_business_review_template'],
  sales_marketing:     ['gbp_checklist', 'lead_followup_checklist', 'sales_call_script'],
  operations:          ['weekly_business_review_template', 'vendor_setup_tracker'],
  customer_experience: ['review_request_script'],
  growth_risk:         ['weekly_business_review_template', 'vendor_setup_tracker'],
  // people_leadership intentionally omitted — no fitting Tier 2 tool yet.
}

function resolveTools(toolIds: string[]): ActionToolRecommendation[] {
  const seen = new Set<string>()
  const out: ActionToolRecommendation[] = []
  for (const id of toolIds) {
    if (seen.has(id)) continue
    seen.add(id)
    const tool = getTier2Tool(id)
    if (tool) {
      out.push({ toolId: tool.id, toolName: tool.title, pillar: tool.pillar, reason: tool.shortDescription })
    }
  }
  return out
}

/** Tools recommended for a specific recommended-action id. */
export function getToolsForAction(actionId: string): ActionToolRecommendation[] {
  return resolveTools(ACTION_TOOL_MAP[actionId] ?? [])
}

/** Tools recommended for a roadmap phase (MetrixScore category). */
export function getToolsForRoadmapPhase(category: MetrixCategory): ActionToolRecommendation[] {
  return resolveTools(CATEGORY_TOOL_MAP[category] ?? [])
}

/** Tools for the next action, falling back to its category if the action is unmapped. */
export function getRecommendedToolsForNextAction(
  actionId: string | null,
  category: MetrixCategory | null = null,
): ActionToolRecommendation[] {
  if (actionId) {
    const byAction = getToolsForAction(actionId)
    if (byAction.length > 0) return byAction
  }
  if (category) return getToolsForRoadmapPhase(category)
  return []
}

export interface ActionToolMapCoverage {
  totalActions: number
  mappedActions: number
  percent: number
  unmappedActionIds: string[]
}

/** How many catalogued actions have at least one mapped Tier 2 tool. */
export function getActionToolMapCoverage(): ActionToolMapCoverage {
  const allActionIds = Object.values(ACTION_CATALOG).flatMap(list => list.map(a => a.id))
  const unmapped = allActionIds.filter(id => getToolsForAction(id).length === 0)
  const mapped = allActionIds.length - unmapped.length
  const percent = allActionIds.length > 0 ? Math.round((mapped / allActionIds.length) * 100) : 0
  return { totalActions: allActionIds.length, mappedActions: mapped, percent, unmappedActionIds: unmapped }
}
