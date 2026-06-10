// ─────────────────────────────────────────────────────────────────────────────
// Path Actions — "Choose Your Path" roadmap options + first-action generator
// ─────────────────────────────────────────────────────────────────────────────
// Pure logic for the report's Choose Your Path section. Generates 3–5 concrete
// first actions from the user's stage, lowest categories, biggest challenge, and
// main goal. No persistence here — the component stores completed actions
// locally (MVP). No scoring / Stripe / Supabase logic is touched.
// ─────────────────────────────────────────────────────────────────────────────

import { CATEGORY_LABELS, type MetrixCategory, type MetrixScore } from './metrixEngine'
import type { QuickIntake } from './intake'

// ── Action shape ──────────────────────────────────────────────────────────────
export type Difficulty = 'Easy' | 'Moderate' | 'Challenging'
export type ImpactLevel = 'Low' | 'Medium' | 'High'

export interface PathAction {
  id: string
  title: string
  whyItMatters: string
  estimatedTime: string
  difficulty: Difficulty
  impact: ImpactLevel
  category: MetrixCategory
}

// ── Core roadmap options (Owner's Choice) ─────────────────────────────────────
export type RoadmapGoalId = 'stabilize' | 'customers' | 'systems' | 'team' | 'scale'

export interface RoadmapGoal {
  id: RoadmapGoalId
  label: string
  category: MetrixCategory
  blurb: string
}

export const ROADMAP_OPTIONS: RoadmapGoal[] = [
  { id: 'stabilize', label: 'Stabilize My Business', category: 'financial_control', blurb: 'Steady cash flow, real pricing, and the basics locked in.' },
  { id: 'customers', label: 'Get More Customers',    category: 'sales_marketing',   blurb: 'A reliable, repeatable flow of leads and referrals.' },
  { id: 'systems',   label: 'Build Better Systems',  category: 'operations',        blurb: 'Repeatable scheduling, job tracking, and workflow.' },
  { id: 'team',      label: 'Grow My Team',          category: 'people_leadership', blurb: 'Hire, train, and delegate without losing quality.' },
  { id: 'scale',     label: 'Scale Smarter',         category: 'growth_risk',       blurb: 'Cash reserves, risk cover, and a real growth plan.' },
]

// ── Action catalog (2 per category) ───────────────────────────────────────────
export const ACTION_CATALOG: Record<MetrixCategory, PathAction[]> = {
  business_foundation: [
    { id: 'bf_entity',  category: 'business_foundation', title: 'Register your business entity',
      whyItMatters: 'An LLC separates your personal assets from business risk and makes you look legitimate to customers and lenders.',
      estimatedTime: '1–2 hours', difficulty: 'Easy', impact: 'High' },
    { id: 'bf_banking', category: 'business_foundation', title: 'Open a separate business bank account',
      whyItMatters: 'Mixing personal and business money creates tax headaches and hides whether you are actually making a profit.',
      estimatedTime: '1 hour', difficulty: 'Easy', impact: 'High' },
  ],
  financial_control: [
    { id: 'fc_pricing', category: 'financial_control', title: 'Set your pricing with real margins',
      whyItMatters: 'Pricing by gut is the fastest way to stay busy and broke. Knowing your true costs protects every job you take.',
      estimatedTime: '2–3 hours', difficulty: 'Moderate', impact: 'High' },
    { id: 'fc_books',   category: 'financial_control', title: 'Start simple bookkeeping',
      whyItMatters: 'You cannot fix what you cannot see. Basic books show where the money actually goes each month.',
      estimatedTime: '2 hours to set up', difficulty: 'Easy', impact: 'Medium' },
  ],
  sales_marketing: [
    { id: 'sm_gbp',      category: 'sales_marketing', title: 'Claim and complete your Google Business Profile',
      whyItMatters: 'It is the #1 free way local customers find and trust trade businesses — and most competitors do it poorly.',
      estimatedTime: '1 hour', difficulty: 'Easy', impact: 'High' },
    { id: 'sm_referral', category: 'sales_marketing', title: 'Set up a simple referral ask',
      whyItMatters: 'Past customers are your cheapest, highest-trust leads. Most are happy to refer — they just need to be asked.',
      estimatedTime: '30 minutes', difficulty: 'Easy', impact: 'Medium' },
  ],
  operations: [
    { id: 'op_schedule',  category: 'operations', title: 'Put one scheduling system in place',
      whyItMatters: 'A single source for jobs and appointments stops double-bookings and dropped work as you get busier.',
      estimatedTime: '2–3 hours', difficulty: 'Moderate', impact: 'Medium' },
    { id: 'op_checklist', category: 'operations', title: 'Create a standard job checklist',
      whyItMatters: 'A repeatable checklist keeps quality consistent no matter who is on the job site.',
      estimatedTime: '1–2 hours', difficulty: 'Easy', impact: 'Medium' },
  ],
  customer_experience: [
    { id: 'cx_reviews',  category: 'customer_experience', title: 'Ask every happy customer for a review',
      whyItMatters: 'Reviews are the social proof that wins your next job before you even send a quote.',
      estimatedTime: '5 min per job', difficulty: 'Easy', impact: 'High' },
    { id: 'cx_followup', category: 'customer_experience', title: 'Add an after-job follow-up message',
      whyItMatters: 'A quick check-in turns one job into reviews, referrals, and repeat work down the road.',
      estimatedTime: '30 minutes', difficulty: 'Easy', impact: 'Medium' },
  ],
  people_leadership: [
    { id: 'pl_roles',   category: 'people_leadership', title: 'Write down clear roles and responsibilities',
      whyItMatters: 'When everyone knows their lane, fewer things fall through the cracks as the team grows.',
      estimatedTime: '1–2 hours', difficulty: 'Moderate', impact: 'Medium' },
    { id: 'pl_onboard', category: 'people_leadership', title: 'Build a basic onboarding checklist',
      whyItMatters: 'Simple onboarding gets new hires productive faster and protects the standards you have built.',
      estimatedTime: '2 hours', difficulty: 'Moderate', impact: 'Medium' },
  ],
  growth_risk: [
    { id: 'gr_reserve', category: 'growth_risk', title: 'Start a cash reserve buffer',
      whyItMatters: 'Even one slow month can sink a busy business. A buffer keeps you out of panic decisions.',
      estimatedTime: '1 hour to set up', difficulty: 'Moderate', impact: 'High' },
    { id: 'gr_plan',    category: 'growth_risk', title: 'Document your next growth milestone',
      whyItMatters: 'A written target turns "grow someday" into a concrete plan you can actually steer toward.',
      estimatedTime: '1 hour', difficulty: 'Easy', impact: 'Medium' },
  ],
}

// ── Signal → category mappings ────────────────────────────────────────────────
const CHALLENGE_TO_CATEGORY: Record<string, MetrixCategory> = {
  funding:    'financial_control',
  leads:      'sales_marketing',
  pricing:    'financial_control',
  licensing:  'business_foundation',
  systems:    'operations',
  hiring:     'people_leadership',
  confidence: 'business_foundation',
  time:       'operations',
}

const GOAL_TO_CATEGORY: Record<string, MetrixCategory> = {
  launch:       'business_foundation',
  more_leads:   'sales_marketing',
  grow_revenue: 'sales_marketing',
  hire_scale:   'people_leadership',
  systematize:  'operations',
  reset:        'financial_control',
}

export function challengeCategory(intake: QuickIntake | null): MetrixCategory | undefined {
  return intake?.biggestChallenge ? CHALLENGE_TO_CATEGORY[intake.biggestChallenge] : undefined
}
export function goalCategory(intake: QuickIntake | null): MetrixCategory | undefined {
  return intake?.mainGoal ? GOAL_TO_CATEGORY[intake.mainGoal] : undefined
}

// ── Quick-win scoring (for Fastest Win) ───────────────────────────────────────
const EASE_SCORE: Record<Difficulty, number> = { Easy: 3, Moderate: 2, Challenging: 1 }
const IMPACT_SCORE: Record<ImpactLevel, number> = { High: 3, Medium: 2, Low: 1 }
function quickWinScore(a: PathAction): number {
  return EASE_SCORE[a.difficulty] + IMPACT_SCORE[a.impact]
}

// ── Path modes ────────────────────────────────────────────────────────────────
export type PathMode = 'recommended' | 'fastest' | 'owner'

function riskCategories(score: MetrixScore): MetrixCategory[] {
  return score.risks.map(r => r.category)
}

export function focusCategoryForMode(
  mode: PathMode,
  score: MetrixScore,
  goalId: RoadmapGoalId,
): MetrixCategory {
  if (mode === 'owner') {
    const goal = ROADMAP_OPTIONS.find(g => g.id === goalId)
    return goal ? goal.category : 'business_foundation'
  }
  if (mode === 'fastest') {
    // Among the user's risk areas, the category whose best action is the quickest win.
    const cats = riskCategories(score)
    let best: { cat: MetrixCategory; score: number } | null = null
    for (const cat of cats) {
      const top = Math.max(...ACTION_CATALOG[cat].map(quickWinScore))
      if (!best || top > best.score) best = { cat, score: top }
    }
    return best ? best.cat : 'sales_marketing'
  }
  // recommended
  return score.recommendedPath.focusCategory
    ?? score.risks[0]?.category
    ?? 'business_foundation'
}

// ── First-action generator (3–5 actions) ──────────────────────────────────────
export function generateActions(
  mode: PathMode,
  score: MetrixScore,
  intake: QuickIntake | null,
  goalId: RoadmapGoalId,
): PathAction[] {
  const focus = focusCategoryForMode(mode, score, goalId)
  const lowest = riskCategories(score)

  if (mode === 'fastest') {
    // Pull from the focus + risk areas, then sort by quick-win score; take 3.
    const cats = unique([focus, ...lowest])
    const pool = cats.flatMap(c => ACTION_CATALOG[c])
    const seen = new Set<string>()
    const sorted = pool
      .filter(a => (seen.has(a.id) ? false : (seen.add(a.id), true)))
      .sort((a, b) => quickWinScore(b) - quickWinScore(a))
    return sorted.slice(0, 3)
  }

  // recommended / owner: depth on the focus area, then breadth across the
  // user's other priority categories (challenge, goal, lowest scores).
  const priority = unique([
    focus,
    challengeCategory(intake),
    goalCategory(intake),
    ...lowest,
  ].filter(Boolean) as MetrixCategory[])

  const seen = new Set<string>()
  const out: PathAction[] = []
  const add = (a: PathAction | undefined) => {
    if (a && !seen.has(a.id) && out.length < 5) { seen.add(a.id); out.push(a) }
  }

  // Depth: both focus actions first.
  ACTION_CATALOG[focus].forEach(add)
  // Breadth: one action from each subsequent priority category.
  for (const c of priority) add(ACTION_CATALOG[c][0])

  return out.slice(0, 5)
}

// ── Path summary copy (for the section header) ────────────────────────────────
export function pathSummary(
  mode: PathMode,
  score: MetrixScore,
  goalId: RoadmapGoalId,
): { label: string; description: string } {
  if (mode === 'fastest') {
    const focus = focusCategoryForMode('fastest', score, goalId)
    return {
      label: 'Fastest Win',
      description: `Quick, high-impact moves — starting with ${CATEGORY_LABELS[focus]}.`,
    }
  }
  if (mode === 'owner') {
    const goal = ROADMAP_OPTIONS.find(g => g.id === goalId)
    return {
      label: goal ? goal.label : "Owner's Choice",
      description: goal ? goal.blurb : 'Pick the direction that matters most to you right now.',
    }
  }
  return {
    label: score.recommendedPath.label,
    description: 'Built from your stage and your biggest risk areas.',
  }
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
