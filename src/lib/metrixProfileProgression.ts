// ─────────────────────────────────────────────────────────────────────────────
// MetrixProfile™ Progression — architecture registry (Phase 1.9A: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Plans the long-term progressive MetrixScore™ model: which profile fields persist,
// which get re-asked on reassessment, what deepens by tier, and the future score
// evidence variables. NOT wired into UI, scoring, storage, Supabase, or auth.
//
// MetrixScore™ stays ONE progressive framework. Tiers add profile completeness,
// answer depth, action evidence, reassessment history, score history, risk-reduction
// tracking, and operating-system maturity — never a separate engine.
// ─────────────────────────────────────────────────────────────────────────────

import type { TierId } from './membershipTiers'
import { PROGRESSIVE_SCORE_INPUTS, FUTURE_SCORE_VARIABLES } from './educationContentMap'

// ── Taxonomy ──────────────────────────────────────────────────────────────────
export type ProfileFieldGroup =
  | 'identity_contact'
  | 'company_profile'
  | 'trade_state_stage'
  | 'starter_assessment'
  | 'score_snapshot'
  | 'category_scores'
  | 'selected_path'
  | 'action_progress'
  | 'completed_tools'
  | 'reassessment_history'
  | 'membership_tier'
  | 'evidence_maturity'

// How a field behaves across assessments.
export type FieldPersistence =
  | 'persistent'   // captured once; only changes if the user edits their profile
  | 'reask_each'   // re-asked (pre-filled) on each reassessment — it changes over time
  | 'conditional'  // only asked when a trigger fires (weak category, tier, etc.)
  | 'derived'      // computed from answers, never asked
  | 'system'       // set by the platform (timestamps, tier, history)

export type FieldSource =
  | 'intake' | 'starter_assessment' | 'pro_module' | 'lifetime_module'
  | 'derived' | 'action' | 'system'

export type ReassessmentQuestionType =
  | 'ask_once'
  | 'reask_each'
  | 'conditional_weak_category'
  | 'pro_only'
  | 'lifetime_only'
  | 'triggered_incomplete_action'
  | 'triggered_missing_field'
  | 'triggered_time_elapsed'

export interface MetrixProfileField {
  id: string
  label: string
  group: ProfileFieldGroup
  tier: TierId                       // earliest tier that captures/uses it
  persistence: FieldPersistence
  reaskType: ReassessmentQuestionType
  source: FieldSource
  scoreRelated: boolean
  storageHint?: string               // where it lives today (if anywhere)
}

// ─────────────────────────────────────────────────────────────────────────────
// FUTURE MetrixProfile™ FIELDS
// ─────────────────────────────────────────────────────────────────────────────
export const METRIX_PROFILE_FIELDS: MetrixProfileField[] = [

  // ── Identity & contact (persistent) ─────────────────────────────────────────
  { id: 'first_name', label: 'First name', group: 'identity_contact', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'starter_assessment', scoreRelated: false, storageHint: 'szm_score.leadName' },
  { id: 'email', label: 'Email', group: 'identity_contact', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'starter_assessment', scoreRelated: false, storageHint: 'szm_score.leadEmail' },

  // ── Company profile (persistent) ────────────────────────────────────────────
  { id: 'business_name', label: 'Business name', group: 'company_profile', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'intake', scoreRelated: false, storageHint: 'not collected yet' },

  // ── Trade / state / stage ───────────────────────────────────────────────────
  { id: 'trade', label: 'Trade', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.trade / answers.business_type' },
  { id: 'region_state', label: 'State / region', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'intake', scoreRelated: false, storageHint: 'szm_intake.region / answers.location.state' },
  { id: 'city', label: 'City / service area', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'starter_assessment', scoreRelated: false, storageHint: 'answers.location.city' },
  { id: 'years_in_business', label: 'Years in business', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'persistent', reaskType: 'ask_once', source: 'intake', scoreRelated: false, storageHint: 'szm_intake.yearsInBusiness (currently unused)' },
  { id: 'business_stage', label: 'Business stage', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.stage / answers.stage' },
  { id: 'revenue_range', label: 'Revenue range', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: false, storageHint: 'szm_intake.revenueRange (currently unused)' },
  { id: 'team_size', label: 'Team size', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.teamSize' },
  { id: 'main_goal', label: 'Main goal', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.mainGoal' },
  { id: 'biggest_challenge', label: 'Biggest challenge', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.biggestChallenge' },
  { id: 'confidence', label: 'Confidence level', group: 'trade_state_stage', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'intake', scoreRelated: true, storageHint: 'szm_intake.confidence' },

  // ── Starter assessment answers (change over time → reask) ────────────────────
  { id: 'setup_steps', label: 'Foundation setup steps completed', group: 'starter_assessment', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'starter_assessment', scoreRelated: true, storageHint: 'answers.setup_steps' },
  { id: 'financial_readiness', label: 'Financial readiness', group: 'starter_assessment', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'starter_assessment', scoreRelated: true, storageHint: 'answers.financial' },
  { id: 'customer_plan', label: 'Customer acquisition plan', group: 'starter_assessment', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'starter_assessment', scoreRelated: true, storageHint: 'answers.customer_plan' },
  { id: 'biggest_blocker', label: 'Biggest blocker', group: 'starter_assessment', tier: 'free_snapshot', persistence: 'reask_each', reaskType: 'reask_each', source: 'starter_assessment', scoreRelated: true, storageHint: 'answers.blocker' },

  // ── Score snapshot (derived) ─────────────────────────────────────────────────
  { id: 'overall_score', label: 'MetrixScore™ overall', group: 'score_snapshot', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.overall (computed)' },
  { id: 'risk_level', label: 'Risk level', group: 'score_snapshot', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.riskLevel' },
  { id: 'profile_completion', label: 'Profile completion %', group: 'score_snapshot', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.progress.completion' },
  { id: 'score_confidence', label: 'Score confidence', group: 'score_snapshot', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.progress.confidence' },
  { id: 'assessed_at', label: 'Assessed at', group: 'score_snapshot', tier: 'free_snapshot', persistence: 'system', reaskType: 'reask_each', source: 'system', scoreRelated: false, storageHint: 'completedAt' },

  // ── Category scores (derived set) ────────────────────────────────────────────
  { id: 'category_scores', label: 'Category scores (7)', group: 'category_scores', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.categories' },

  // ── Selected path ────────────────────────────────────────────────────────────
  { id: 'recommended_path', label: 'Recommended path', group: 'selected_path', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'starter.recommendedPath' },
  { id: 'chosen_path', label: 'Chosen path', group: 'selected_path', tier: 'pro_roadmap', persistence: 'reask_each', reaskType: 'reask_each', source: 'action', scoreRelated: false, storageHint: 'not persisted (ChoosePathSection state)' },
  { id: 'first_actions', label: 'First actions', group: 'selected_path', tier: 'free_snapshot', persistence: 'derived', reaskType: 'reask_each', source: 'derived', scoreRelated: true, storageHint: 'generateActions()' },

  // ── Action progress (Pro) ────────────────────────────────────────────────────
  { id: 'path_actions_completed', label: 'Path actions completed', group: 'action_progress', tier: 'pro_roadmap', persistence: 'system', reaskType: 'triggered_incomplete_action', source: 'action', scoreRelated: true, storageHint: 'szm_path_complete (local only)' },
  { id: 'foundation_steps_completed', label: 'Foundation steps completed', group: 'action_progress', tier: 'pro_roadmap', persistence: 'system', reaskType: 'triggered_incomplete_action', source: 'action', scoreRelated: true, storageHint: 'szm_foundation_complete (local only)' },
  { id: 'growth_tabs_completed', label: 'Growth phases completed', group: 'action_progress', tier: 'pro_roadmap', persistence: 'system', reaskType: 'triggered_incomplete_action', source: 'action', scoreRelated: true, storageHint: 'szm_growth_complete (local only)' },

  // ── Completed tools (Pro) ────────────────────────────────────────────────────
  { id: 'tools_completed', label: 'Tools / checklists completed', group: 'completed_tools', tier: 'pro_roadmap', persistence: 'system', reaskType: 'triggered_incomplete_action', source: 'action', scoreRelated: true, storageHint: 'not built yet (tier2Tools)' },

  // ── Reassessment / history (Pro → Lifetime) ──────────────────────────────────
  { id: 'reassessment_dates', label: 'Reassessment dates', group: 'reassessment_history', tier: 'pro_roadmap', persistence: 'system', reaskType: 'triggered_time_elapsed', source: 'system', scoreRelated: false, storageHint: 'not built (Supabase rows exist, no user link)' },
  { id: 'score_history', label: 'Score history over time', group: 'reassessment_history', tier: 'lifetime_founder', persistence: 'system', reaskType: 'lifetime_only', source: 'system', scoreRelated: true, storageHint: 'not built' },
  { id: 'change_log', label: 'Profile change log', group: 'reassessment_history', tier: 'lifetime_founder', persistence: 'system', reaskType: 'lifetime_only', source: 'system', scoreRelated: false, storageHint: 'not built' },

  // ── Membership ───────────────────────────────────────────────────────────────
  { id: 'membership_tier', label: 'Membership tier', group: 'membership_tier', tier: 'free_snapshot', persistence: 'system', reaskType: 'ask_once', source: 'system', scoreRelated: false, storageHint: 'not built (no auth)' },

  // ── Evidence / operating-system maturity (Pro) ──────────────────────────────
  { id: 'lead_tracking_maturity', label: 'Lead tracking maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },
  { id: 'sales_process_maturity', label: 'Sales process maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },
  { id: 'financial_controls_maturity', label: 'Financial controls maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },
  { id: 'operations_process_maturity', label: 'Operations process maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },
  { id: 'customer_retention_maturity', label: 'Customer retention maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },
  { id: 'recurring_revenue_maturity', label: 'Recurring revenue maturity', group: 'evidence_maturity', tier: 'pro_roadmap', persistence: 'conditional', reaskType: 'pro_only', source: 'pro_module', scoreRelated: true },

  // ── Evidence / longitudinal (Lifetime) ──────────────────────────────────────
  { id: 'score_history_trend', label: 'Score history trend', group: 'evidence_maturity', tier: 'lifetime_founder', persistence: 'system', reaskType: 'lifetime_only', source: 'lifetime_module', scoreRelated: true },
  { id: 'risk_reduction_trend', label: 'Risk reduction trend', group: 'evidence_maturity', tier: 'lifetime_founder', persistence: 'system', reaskType: 'lifetime_only', source: 'lifetime_module', scoreRelated: true },
  { id: 'team_growth_readiness', label: 'Team growth / readiness', group: 'evidence_maturity', tier: 'lifetime_founder', persistence: 'conditional', reaskType: 'lifetime_only', source: 'lifetime_module', scoreRelated: true },
  { id: 'qbr_data', label: 'Quarterly business review data', group: 'evidence_maturity', tier: 'lifetime_founder', persistence: 'system', reaskType: 'lifetime_only', source: 'lifetime_module', scoreRelated: false },
]

// ─────────────────────────────────────────────────────────────────────────────
// Reassessment rules (Step 3)
// ─────────────────────────────────────────────────────────────────────────────
export interface ReassessmentRule {
  type: ReassessmentQuestionType
  label: string
  trigger: string
}

export const REASSESSMENT_RULES: ReassessmentRule[] = [
  { type: 'ask_once',                     label: 'Stable identity facts',        trigger: 'Ask only on first assessment or profile edit (name, email, business name, trade, state, city, years in business).' },
  { type: 'reask_each',                   label: 'Things that change over time',  trigger: 'Pre-fill prior answer, ask each reassessment (stage, revenue, team size, goal, challenge, setup steps, financial, customer plan, blocker).' },
  { type: 'conditional_weak_category',    label: 'Deepen weak categories',        trigger: 'Ask deeper category questions only when that category scored low.' },
  { type: 'pro_only',                     label: 'Pro operating-system questions',trigger: 'Ask deeper financial/sales/operations/retention/recurring questions only for Pro members.' },
  { type: 'lifetime_only',                label: 'Lifetime longitudinal questions',trigger: 'Ask trend / history / risk-reduction / team / QBR questions only for Lifetime members.' },
  { type: 'triggered_incomplete_action',  label: 'Follow up on incomplete actions',trigger: 'Ask about actions/tools the user started but did not complete.' },
  { type: 'triggered_missing_field',      label: 'Fill missing profile fields',   trigger: 'Ask for fields that are still empty in the MetrixProfile™.' },
  { type: 'triggered_time_elapsed',       label: 'Time-based reassessment',       trigger: 'Prompt a reassessment after a set period since the last assessment.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Progressive input groups (Step 4) — extends educationContentMap registry
// ─────────────────────────────────────────────────────────────────────────────
export interface ProgressiveInputGroup {
  tier: TierId
  label: string
  inputs: string[]
}

export const PROGRESSIVE_INPUT_GROUPS: ProgressiveInputGroup[] = [
  { tier: 'free_snapshot',    label: 'Free Starter inputs',     inputs: PROGRESSIVE_SCORE_INPUTS.free_snapshot },
  { tier: 'pro_roadmap',      label: 'Pro Roadmap inputs',      inputs: PROGRESSIVE_SCORE_INPUTS.pro_roadmap },
  { tier: 'lifetime_founder', label: 'Founding Lifetime inputs',inputs: PROGRESSIVE_SCORE_INPUTS.lifetime_founder },
]

// Re-export the future score-evidence variable ids for convenience (single source
// of truth remains educationContentMap.ts).
export const FUTURE_SCORE_EVIDENCE_VARIABLE_IDS: string[] = FUTURE_SCORE_VARIABLES.map(v => v.id)

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (Step 5)
// ─────────────────────────────────────────────────────────────────────────────
export function getStarterProfileFields(): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.tier === 'free_snapshot')
}
export function getProProfileFields(): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.tier === 'pro_roadmap')
}
export function getLifetimeProfileFields(): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.tier === 'lifetime_founder')
}
export function getFieldsToReask(): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.persistence === 'reask_each')
}
export function getPersistentFields(): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.persistence === 'persistent')
}
export function getProgressiveInputGroups(): ProgressiveInputGroup[] {
  return PROGRESSIVE_INPUT_GROUPS
}
export function getFieldsByGroup(group: ProfileFieldGroup): MetrixProfileField[] {
  return METRIX_PROFILE_FIELDS.filter(f => f.group === group)
}
export function getReassessmentRules(): ReassessmentRule[] {
  return REASSESSMENT_RULES
}
