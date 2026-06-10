// ─────────────────────────────────────────────────────────────────────────────
// Quick Intake — lightweight pre-assessment context
// Captured on /start before the MetrixScore assessment. Stored client-side
// (session + local) only. Does NOT feed scoring or Supabase persistence — it is
// supplementary context the report can read.
// ─────────────────────────────────────────────────────────────────────────────

// Stage IDs intentionally mirror the assessment's Q3 (questions.ts) so the
// pre-screen stage and the in-assessment stage stay consistent.
export type BusinessStage =
  | 'thinking'
  | 'planning'
  | 'launched_u6'
  | 'months_6_12'
  | 'over_1yr'
  | 'reset'

export interface IntakeOption {
  value: string
  label: string
}

export interface QuickIntake {
  stage: BusinessStage | ''
  trade: string
  region: string        // US state / service region
  yearsInBusiness: string
  revenueRange: string
  teamSize: string
  mainGoal: string
  biggestChallenge: string
  confidence: string
  savedAt?: string
}

export const EMPTY_INTAKE: QuickIntake = {
  stage: '',
  trade: '',
  region: '',
  yearsInBusiness: '',
  revenueRange: '',
  teamSize: '',
  mainGoal: '',
  biggestChallenge: '',
  confidence: '',
}

// ─── Stage Selector options (the prominent pre-assessment choice) ──────────────
export const STAGE_OPTIONS: { value: BusinessStage; label: string; hint: string }[] = [
  { value: 'thinking',    label: 'Just thinking about it',        hint: 'Exploring the idea' },
  { value: 'planning',    label: 'Planning to launch',           hint: 'Within ~90 days' },
  { value: 'launched_u6', label: 'Recently launched',            hint: 'Under 6 months in' },
  { value: 'months_6_12', label: '6–12 months in',               hint: 'Finding my footing' },
  { value: 'over_1yr',    label: 'Over a year, growing',         hint: 'Ready to scale' },
  { value: 'reset',       label: 'Need a reset',                 hint: 'Existing business, stuck' },
]

// ─── Quick Intake field options ───────────────────────────────────────────────
export const TRADE_OPTIONS: IntakeOption[] = [
  { value: 'hvac',         label: 'HVAC' },
  { value: 'electrical',   label: 'Electrical' },
  { value: 'plumbing',     label: 'Plumbing' },
  { value: 'roofing',      label: 'Roofing' },
  { value: 'solar',        label: 'Solar' },
  { value: 'construction', label: 'Construction & Remodeling' },
  { value: 'handyman',     label: 'Handyman Services' },
  { value: 'landscaping',  label: 'Landscaping & Lawn Care' },
  { value: 'cleaning',     label: 'Cleaning Services' },
  { value: 'painting',     label: 'Painting' },
  { value: 'other',        label: 'Other local service business' },
]

export const US_STATES: string[] = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','Washington D.C.',
]

export const YEARS_OPTIONS: IntakeOption[] = [
  { value: 'not_started', label: 'Not started yet' },
  { value: 'under_1',     label: 'Less than 1 year' },
  { value: '1_3',         label: '1–3 years' },
  { value: '3_5',         label: '3–5 years' },
  { value: 'over_5',      label: '5+ years' },
]

export const REVENUE_OPTIONS: IntakeOption[] = [
  { value: 'pre_revenue', label: 'Pre-revenue' },
  { value: 'under_50k',   label: 'Under $50k / yr' },
  { value: '50_150k',     label: '$50k–$150k / yr' },
  { value: '150_500k',    label: '$150k–$500k / yr' },
  { value: 'over_500k',   label: '$500k+ / yr' },
]

export const TEAM_OPTIONS: IntakeOption[] = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_3',     label: '2–3 people' },
  { value: '4_10',    label: '4–10 people' },
  { value: 'over_10', label: '10+ people' },
]

export const GOAL_OPTIONS: IntakeOption[] = [
  { value: 'launch',       label: 'Launch the business' },
  { value: 'more_leads',   label: 'Get more leads' },
  { value: 'grow_revenue', label: 'Grow revenue' },
  { value: 'hire_scale',   label: 'Hire & scale a team' },
  { value: 'systematize',  label: 'Systematize operations' },
  { value: 'reset',        label: 'Reset & fix the foundation' },
]

export const CHALLENGE_OPTIONS: IntakeOption[] = [
  { value: 'funding',     label: 'Funding / capital' },
  { value: 'leads',       label: 'Getting customers' },
  { value: 'pricing',     label: 'Pricing the work' },
  { value: 'licensing',   label: 'Licensing / compliance' },
  { value: 'systems',     label: 'Systems / software' },
  { value: 'hiring',      label: 'Hiring & retention' },
  { value: 'confidence',  label: 'Knowing what to do first' },
  { value: 'time',        label: 'Not enough time' },
]

export const CONFIDENCE_OPTIONS: IntakeOption[] = [
  { value: 'low',      label: 'Low — feeling stuck' },
  { value: 'moderate', label: 'Moderate — making progress' },
  { value: 'high',     label: 'High — clear on next steps' },
]

// ─── Label lookups (for read-back on the report) ──────────────────────────────
function labelFrom(options: IntakeOption[], value: string): string {
  return options.find(o => o.value === value)?.label ?? value
}

export function stageLabel(value: string): string {
  return STAGE_OPTIONS.find(o => o.value === value)?.label ?? value
}
export function tradeLabel(value: string): string {
  return labelFrom(TRADE_OPTIONS, value)
}
export function goalLabel(value: string): string {
  return labelFrom(GOAL_OPTIONS, value)
}
export function challengeLabel(value: string): string {
  return labelFrom(CHALLENGE_OPTIONS, value)
}

// ─── Persistence (session + local, mirroring the szm_score pattern) ───────────
export const INTAKE_STORAGE_KEY = 'szm_intake'

export function saveIntake(intake: QuickIntake): void {
  if (typeof window === 'undefined') return
  const payload: QuickIntake = { ...intake, savedAt: new Date().toISOString() }
  const json = JSON.stringify(payload)
  try {
    sessionStorage.setItem(INTAKE_STORAGE_KEY, json)
    localStorage.setItem(INTAKE_STORAGE_KEY, json)
  } catch {
    // storage unavailable (private mode, etc.) — non-fatal
  }
}

export function loadIntake(): QuickIntake | null {
  if (typeof window === 'undefined') return null
  try {
    const raw =
      sessionStorage.getItem(INTAKE_STORAGE_KEY) ??
      localStorage.getItem(INTAKE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuickIntake
  } catch {
    return null
  }
}
