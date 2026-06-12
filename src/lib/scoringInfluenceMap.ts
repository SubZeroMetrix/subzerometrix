// ─────────────────────────────────────────────────────────────────────────────
// Scoring Influence Map — audit registry (Phase 1.9C: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Documents, for every input the app collects today, what that input ACTUALLY
// affects right now — and what it should affect next. This keeps the MetrixScore™
// honest: several inputs are shown to users as "profile context" but do not move
// the score they see, and some inputs are collected but never used at all.
//
// NOTHING is wired here. No scoring calculation, roadmap logic, persistence,
// Stripe, Supabase, DEV_UNLOCK, report gating, or UI is touched or imported in a
// behavior-changing way. This file is a read-only reference map + typed helpers.
//
// ── The two-engine reality this map exists to make explicit ──────────────────
// 1. scoring.ts  → calculateScores(RawAnswers): the LIVE engine that runs on
//    assessment submit and is stored as `szm_score`. Its `overall` is now mostly
//    hidden from users, BUT it still drives the paid roadmap (buildPersonalizedRoadmap)
//    and the legacy category breakdown.  → captured here as `legacyScoreImpact`.
// 2. metrixEngine.ts + metrixReport.ts → buildStarterScore(answers, intake): the
//    Starter MetrixScore™ that IS the user-facing headline on /results, /dashboard,
//    and /report. It is produced by a BRIDGE (buildStarterResponse) that infers a
//    partial 21-criterion profile from the raw answers + Quick Intake.
//    → captured here as `starterScoreImpact` (the "honest" displayed-score impact).
//
// An input's `starterScoreImpact` and `legacyScoreImpact` often differ. When they
// do, that is a finding, not a bug in this map — see notes per input.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixCategory } from './metrixEngine'

// ── Magnitudes & dimensions ───────────────────────────────────────────────────
export type InfluenceMagnitude = 'none' | 'low' | 'medium' | 'high'

// The role(s) an input plays today. An input can have several.
export type InfluenceType =
  | 'starter_score'      // moves the displayed Starter MetrixScore™
  | 'legacy_score'       // moves scoring.ts overall (now mostly hidden, still feeds roadmap)
  | 'roadmap'            // shapes roadmap items / urgency / generated actions / path focus
  | 'report_messaging'   // shapes risk language, "why this path", first-action copy
  | 'display_context'    // shown as profile context (pills / greeting / profile line) only
  | 'progress_tracking'  // action / step / phase completion state
  | 'gating'             // tier / payment gating
  | 'unused'             // collected but not meaningfully used today

export type CollectionSource =
  | 'intake'             // Quick Intake on /start (szm_intake, client-only)
  | 'starter_assessment' // 7-question assessment (szm_score.answers)
  | 'derived'            // computed, never asked
  | 'action'             // produced by user action (completion state)
  | 'system'             // set by the platform (tier, timestamps)
  | 'not_collected'      // referenced by the model but not captured yet

export type TierWhereItShouldMatter = 'free' | 'pro' | 'lifetime'

export type LaunchPriority = 'blocker' | 'should_fix' | 'nice_to_have' | 'future'

// ── Entry shape ───────────────────────────────────────────────────────────────
export interface ScoringInfluenceEntry {
  id: string
  label: string
  collectionSource: CollectionSource
  storageLocation: string          // where the value lives today (or 'not stored')

  currentInfluence: InfluenceType[]

  // Score impact is split across the two engines on purpose (see header).
  starterScoreImpact: InfluenceMagnitude   // impact on the DISPLAYED Starter MetrixScore™
  legacyScoreImpact: InfluenceMagnitude    // impact on scoring.ts overall (feeds paid roadmap)
  roadmapImpact: InfluenceMagnitude
  displayImpact: InfluenceMagnitude

  // Which MetrixScore category this input currently feeds (if any).
  feedsCategory: MetrixCategory | null

  futureIntendedInfluence: string
  tierWhereItShouldMatter: TierWhereItShouldMatter
  launchPriority: LaunchPriority
  notes: string
}

// ─────────────────────────────────────────────────────────────────────────────
// THE MAP — one entry per collected input
// ─────────────────────────────────────────────────────────────────────────────
export const SCORING_INFLUENCE_MAP: ScoringInfluenceEntry[] = [

  // ── Identity / lead ─────────────────────────────────────────────────────────
  {
    id: 'first_name',
    label: 'First name',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.leadName (answers.lead.firstName)',
    currentInfluence: ['legacy_score', 'display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'low',
    roadmapImpact: 'none',
    displayImpact: 'high',
    feedsCategory: null,
    futureIntendedInfluence: 'Personalization only. Becomes the saved MetrixProfile™ identity once auth exists.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'nice_to_have',
    notes: 'Half of the scoring.ts lead-completion bonus (firstName + valid email → +10 raw ≈ +9 pts on the LEGACY score). Does NOT move the displayed Starter MetrixScore™. Drives the greeting on results/dashboard/report.',
  },
  {
    id: 'email',
    label: 'Email',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.leadEmail (answers.lead.email)',
    currentInfluence: ['legacy_score'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'low',
    roadmapImpact: 'none',
    displayImpact: 'low',
    feedsCategory: null,
    futureIntendedInfluence: 'Account identity / saved MetrixProfile™ key once auth + Supabase persistence land.',
    tierWhereItShouldMatter: 'pro',
    launchPriority: 'should_fix',
    notes: 'Other half of the legacy lead-completion bonus. Not shown as profile context. Blocked from mattering further until auth/Supabase exist.',
  },

  // ── Trade / location ──────────────────────────────────────────────────────────
  {
    id: 'business_type',
    label: 'Business type / trade (assessment)',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.business_type / result.businessType',
    currentInfluence: ['legacy_score', 'roadmap', 'display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'medium',
    roadmapImpact: 'high',
    displayImpact: 'high',
    feedsCategory: null,
    futureIntendedInfluence: 'Trade-weighted scoring and trade-specific readiness modules (Pro/Lifetime).',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'HONESTY GAP: drives the legacy businessClarity score, the personalized roadmap (license relevance, field-software relevance, builder path), and platform routing — but the bridge never maps trade to a Starter criterion, so it does NOT move the displayed Starter MetrixScore™. Shown as a pill, which can imply it shaped the score.',
  },
  {
    id: 'trade_intake',
    label: 'Trade (Quick Intake)',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.trade',
    currentInfluence: ['display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'medium',
    feedsCategory: null,
    futureIntendedInfluence: 'Reconcile with business_type into one canonical trade field that drives trade-weighted scoring.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'DUPLICATE of business_type collected on /start. Currently powers only the dashboard/results profile line + pill. The roadmap and legacy score read answers.business_type, NOT this field.',
  },
  {
    id: 'region_state',
    label: 'State / region',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.region + szm_score.answers.location.state',
    currentInfluence: ['legacy_score', 'roadmap', 'display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'medium',
    roadmapImpact: 'medium',
    displayImpact: 'high',
    feedsCategory: null,
    futureIntendedInfluence: 'State-specific compliance/licensing weighting; localized roadmap depth.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'Feeds legacy locationClarity and the roadmap (STATE_RESOURCES, state-linked notices) — but NOT the displayed Starter score. Collected twice (intake.region and answers.location.state).',
  },
  {
    id: 'city',
    label: 'City / service area',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.location.city',
    currentInfluence: ['legacy_score', 'display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'low',
    roadmapImpact: 'none',
    displayImpact: 'medium',
    feedsCategory: null,
    futureIntendedInfluence: 'Local market context / benchmarks; not a direct score driver.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'nice_to_have',
    notes: 'Only nudges legacy locationClarity (full 10 pts needs city + state). Not used by the roadmap or the Starter score. Shown in the location pill.',
  },

  // ── Stage ─────────────────────────────────────────────────────────────────────
  {
    id: 'business_stage',
    label: 'Business stage',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.stage || szm_score.answers.stage',
    currentInfluence: ['starter_score', 'legacy_score', 'roadmap', 'report_messaging', 'display_context'],
    starterScoreImpact: 'high',
    legacyScoreImpact: 'medium',
    roadmapImpact: 'high',
    displayImpact: 'high',
    feedsCategory: null,
    futureIntendedInfluence: 'Keep as the core weighting axis; reask each reassessment to track stage progression.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'blocker',
    notes: 'Most influential single input on the Starter score: sets the stageGroup that picks category WEIGHTS and the recommended-path label. Also legacy stageReadiness and roadmap urgency (insurance, operations gating, credit). Already core — verify only.',
  },

  // ── Intake context fields ─────────────────────────────────────────────────────
  {
    id: 'years_in_business',
    label: 'Years in business',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.yearsInBusiness',
    currentInfluence: ['display_context', 'unused'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'medium',
    feedsCategory: null,
    futureIntendedInfluence: 'Could corroborate/adjust stage and credibility; potential benchmark context.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'UNDERUSED: collected on /start and shown as a "Years" pill on results/report, but never scored anywhere and never used by the roadmap. Overlaps with business_stage. Displaying it implies relevance it does not have yet.',
  },
  {
    id: 'revenue_range',
    label: 'Revenue range',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.revenueRange',
    currentInfluence: ['display_context', 'unused'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'medium',
    feedsCategory: null,
    futureIntendedInfluence: 'Financial capacity + benchmark weighting; pairs with financial_readiness for a fuller money picture (Pro depth).',
    tierWhereItShouldMatter: 'pro',
    launchPriority: 'should_fix',
    notes: 'UNDERUSED: shown as a "Revenue" pill but not scored. Note the money input that DOES drive score is answers.financial (financial_readiness); revenueRange is a separate, currently-dead signal.',
  },
  {
    id: 'team_size',
    label: 'Team size',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.teamSize',
    currentInfluence: ['starter_score', 'roadmap', 'display_context'],
    starterScoreImpact: 'medium',
    legacyScoreImpact: 'none',
    roadmapImpact: 'low',
    displayImpact: 'medium',
    feedsCategory: 'people_leadership',
    futureIntendedInfluence: 'Deeper People & Leadership scoring as a team grows (Pro evidence modules).',
    tierWhereItShouldMatter: 'pro',
    launchPriority: 'should_fix',
    notes: 'The ONLY intake field that moves a Starter category directly: maps to hiring_process / training_standards / delegation_roles. Deliberately excluded for solo owners (just_me) unless main_goal = hire_scale, so it does not wrongly dominate risk focus.',
  },
  {
    id: 'main_goal',
    label: 'Main goal',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.mainGoal',
    currentInfluence: ['starter_score', 'roadmap', 'report_messaging', 'display_context'],
    starterScoreImpact: 'low',
    legacyScoreImpact: 'none',
    roadmapImpact: 'low',
    displayImpact: 'high',
    feedsCategory: 'growth_risk',
    futureIntendedInfluence: 'Stronger path-weighting and "why this path" messaging; should bias roadmap ordering before launch.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'Gates the solo-owner People & Leadership exclusion (hire_scale), sets growth_strategy presence, and acts as a path-focus tiebreak (goalCategory). Influences focus/messaging more than the number itself.',
  },
  {
    id: 'biggest_challenge',
    label: 'Biggest challenge',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.biggestChallenge',
    currentInfluence: ['starter_score', 'roadmap', 'report_messaging', 'display_context'],
    starterScoreImpact: 'low',
    legacyScoreImpact: 'none',
    roadmapImpact: 'low',
    displayImpact: 'high',
    feedsCategory: null,
    futureIntendedInfluence: 'Primary driver of roadmap weighting + "why this path" copy (Phase 1.9D candidate).',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'Today near-cosmetic for the score: challengeCategory only re-orders the focus when the lowest risks TIE (applyChallengeTiebreak), and steers generateActions priority. Shown prominently as the "Focus" pill — strong candidate to actually influence roadmap weighting next.',
  },
  {
    id: 'confidence',
    label: 'Confidence level',
    collectionSource: 'intake',
    storageLocation: 'szm_intake.confidence',
    currentInfluence: ['starter_score', 'unused'],
    starterScoreImpact: 'low',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'none',
    feedsCategory: 'growth_risk',
    futureIntendedInfluence: 'Tune score-confidence and messaging tone; not a readiness driver on its own.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'nice_to_have',
    notes: 'UNDERUSED: only nudges growth_strategy quality (high → needs_improvement, else started_inconsistent) and only when main_goal is set. Collected on /start but NOT shown in any profile pill — so it is invisible and nearly inert.',
  },

  // ── Starter assessment answers ────────────────────────────────────────────────
  {
    id: 'setup_steps',
    label: 'Foundation setup steps',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.setup_steps',
    currentInfluence: ['starter_score', 'legacy_score', 'roadmap'],
    starterScoreImpact: 'high',
    legacyScoreImpact: 'high',
    roadmapImpact: 'high',
    displayImpact: 'low',
    feedsCategory: 'business_foundation',
    futureIntendedInfluence: 'Stays a core score + roadmap driver; reask each reassessment to track foundation progress.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'blocker',
    notes: 'Strongest single Starter driver: the bridge maps it to entity_registration, licensing_insurance, banking_separation, online_presence, brand_consistency, risk_contingency. Also legacy setupReadiness (20 pts) and which legal/financial/marketing roadmap items appear.',
  },
  {
    id: 'financial_readiness',
    label: 'Financial readiness',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.financial',
    currentInfluence: ['starter_score', 'legacy_score', 'roadmap'],
    starterScoreImpact: 'high',
    legacyScoreImpact: 'high',
    roadmapImpact: 'high',
    displayImpact: 'none',
    feedsCategory: 'financial_control',
    futureIntendedInfluence: 'Core driver; deepen with real financial-controls evidence (margin, break-even, cash review) in Pro.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'blocker',
    notes: 'Bridge maps it to cash_flow + financial_runway. Also legacy financialReadiness (20 pts) + funding/credit risks, and the roadmap budget tier (mapBudget) + pricing/bookkeeping/credit urgency.',
  },
  {
    id: 'customer_plan',
    label: 'Customer acquisition plan',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.customer_plan',
    currentInfluence: ['starter_score', 'legacy_score', 'roadmap'],
    starterScoreImpact: 'medium',
    legacyScoreImpact: 'medium',
    roadmapImpact: 'medium',
    displayImpact: 'none',
    feedsCategory: 'sales_marketing',
    futureIntendedInfluence: 'Core driver; deepen with lead-source / response-time / close-rate evidence in Pro.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'blocker',
    notes: 'Bridge maps it to lead_generation. Also legacy customerReadiness (15 pts) and the customers/GBP roadmap urgency.',
  },
  {
    id: 'blocker',
    label: 'Biggest blocker',
    collectionSource: 'starter_assessment',
    storageLocation: 'szm_score.answers.blocker',
    currentInfluence: ['starter_score', 'legacy_score', 'roadmap'],
    starterScoreImpact: 'low',
    legacyScoreImpact: 'medium',
    roadmapImpact: 'medium',
    displayImpact: 'medium',
    feedsCategory: null,
    futureIntendedInfluence: 'Keep as a roadmap/urgency signal; consider a small targeted score effect on the named area.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'Rich roadmap signal (software/funding/licensing/pricing triggers) and legacy blockerSeverity, but only a light Starter effect: conditionally sets pricing_strategy / brand_consistency / scheduling_workflow. result.biggestBlocker is available but not shown as a pill.',
  },
  {
    id: 'full_assessment_answers',
    label: 'Full 21-criterion assessment answers',
    collectionSource: 'not_collected',
    storageLocation: 'not collected — inferred by buildStarterResponse()',
    currentInfluence: ['starter_score'],
    starterScoreImpact: 'high',
    legacyScoreImpact: 'none',
    roadmapImpact: 'high',
    displayImpact: 'none',
    feedsCategory: null,
    futureIntendedInfluence: 'The real progressive MetrixProfile™ input: ask the full 21 criteria (free starter subset → Pro depth) instead of inferring them.',
    tierWhereItShouldMatter: 'free',
    launchPriority: 'should_fix',
    notes: 'Today these criteria are INFERRED from the 7 raw answers + intake, which is why profile completion is intentionally partial. Directly collecting them is the highest-leverage way to make the Starter score real rather than bridged.',
  },

  // ── Progress / membership ─────────────────────────────────────────────────────
  {
    id: 'path_action_completion',
    label: 'Path / action / phase completion',
    collectionSource: 'action',
    storageLocation: 'szm_foundation_complete, szm_growth_complete, szm_path_complete (localStorage only)',
    currentInfluence: ['progress_tracking', 'display_context'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'medium',
    futureIntendedInfluence: 'Action evidence should raise the real score (Pro), not just a display-only projection.',
    feedsCategory: null,
    tierWhereItShouldMatter: 'pro',
    launchPriority: 'future',
    notes: 'Completion does NOT change the actual score. Completed growth tabs only render a DISPLAY-ONLY projected number (SCORE_IMPACT_PER_TAB). Local-only and ephemeral — needs auth/Supabase to persist before it can drive scoring.',
  },
  {
    id: 'membership_tier',
    label: 'Membership tier',
    collectionSource: 'system',
    storageLocation: 'not built (no auth; report access is payment-gated, not tier-gated)',
    currentInfluence: ['gating'],
    starterScoreImpact: 'none',
    legacyScoreImpact: 'none',
    roadmapImpact: 'none',
    displayImpact: 'none',
    feedsCategory: null,
    futureIntendedInfluence: 'Unlocks score DEPTH (profile completeness, evidence modules, history) — never a separate engine.',
    tierWhereItShouldMatter: 'pro',
    launchPriority: 'future',
    notes: 'Not wired. MetrixScore™ stays one progressive framework; tier should change how MUCH profile/evidence feeds it, not the math. Blocked on auth/Supabase.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const NONZERO: InfluenceMagnitude[] = ['low', 'medium', 'high']

/** Inputs that move the DISPLAYED Starter MetrixScore™ today. */
export function getScoreInfluencingInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => NONZERO.includes(e.starterScoreImpact))
}

/** Inputs that move the LEGACY scoring.ts overall (which still feeds the paid roadmap). */
export function getLegacyScoreInfluencingInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => NONZERO.includes(e.legacyScoreImpact))
}

/** Inputs that shape the roadmap / generated actions / path focus today. */
export function getRoadmapInfluencingInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => NONZERO.includes(e.roadmapImpact))
}

/** Inputs shown to the user but with no current score or roadmap effect. */
export function getDisplayOnlyInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e =>
    NONZERO.includes(e.displayImpact) &&
    e.starterScoreImpact === 'none' &&
    e.legacyScoreImpact === 'none' &&
    e.roadmapImpact === 'none')
}

/** Inputs collected (or shown) but not meaningfully used anywhere yet. */
export function getUnderusedInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => e.currentInfluence.includes('unused'))
}

/** Inputs whose intended future role is score-driving but which do not move the Starter score yet. */
export function getFutureScoringInputs(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e =>
    e.starterScoreImpact === 'none' &&
    e.feedsCategory !== null)
}

/** Inputs at a given launch priority (or all, grouped, if none passed). */
export function getLaunchPriorityInputs(priority: LaunchPriority): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => e.launchPriority === priority)
}

/** Inputs whose displayed-score impact and legacy-score impact disagree — the honesty gaps. */
export function getScoreHonestyGaps(): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => e.starterScoreImpact !== e.legacyScoreImpact)
}

/** Inputs grouped by the tier where they should start mattering. */
export function getInputsByTier(tier: TierWhereItShouldMatter): ScoringInfluenceEntry[] {
  return SCORING_INFLUENCE_MAP.filter(e => e.tierWhereItShouldMatter === tier)
}
