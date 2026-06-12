// ─────────────────────────────────────────────────────────────────────────────
// scoreExplanation — explain the Starter MetrixScore™ (Mega-Phase 4A)
// ─────────────────────────────────────────────────────────────────────────────
// EXPLANATION ONLY. This reads an already-computed MetrixScore (+ Quick Intake)
// and explains it. It does NOT change scoring math, recompute the score, or alter
// any category value. It answers: why is my score here, what helped, what pulled
// it down, what to fix first, which category matters most, and what makes the next
// reassessment stronger.
//
// Honest framing: a readiness snapshot, never a final/benchmarked/predictive score.
// ─────────────────────────────────────────────────────────────────────────────

import { type MetrixCategory, type MetrixScore } from './metrixEngine'
import type { QuickIntake } from './intake'
import { ACTION_CATALOG, challengeCategory, goalCategory } from './pathActions'

export interface ScoreDriver {
  category: MetrixCategory
  label: string
  score: number
  note: string
}

export interface ScoreConstraint {
  category: MetrixCategory
  label: string
  score: number
  severity: 'high' | 'moderate' | 'low'
  note: string
}

export interface ScoreImprovementLever {
  category: MetrixCategory
  label: string
  currentScore: number
  rationale: string
  firstAction: string
  priority: number
}

export type CategoryStatus = 'strong' | 'moderate' | 'needs_work' | 'unanswered'

export interface CategoryExplanation {
  category: MetrixCategory
  label: string
  score: number
  weight: number
  answered: number
  total: number
  status: CategoryStatus
  note: string
}

export interface ScoreExplanation {
  overall: number
  riskLabel: string
  completion: number
  confidenceLabel: string
  headline: string
  summary: string
  drivers: ScoreDriver[]
  constraints: ScoreConstraint[]
  levers: ScoreImprovementLever[]
  categories: CategoryExplanation[]
  reassessmentNote: string
}

function statusFor(answered: number, score: number): CategoryStatus {
  if (answered === 0) return 'unanswered'
  if (score >= 70) return 'strong'
  if (score >= 40) return 'moderate'
  return 'needs_work'
}

/** Per-category, plain-language read on how each area sits in the score. */
export function getCategoryExplanations(score: MetrixScore): CategoryExplanation[] {
  return score.categories.map(c => {
    const status = statusFor(c.answered, c.score)
    const note =
      status === 'unanswered'
        ? 'Not yet part of your Starter profile — answering it sharpens your score.'
        : status === 'strong'
        ? 'A readiness strength that likely influenced your Starter MetrixScore™ positively.'
        : status === 'moderate'
        ? 'Partly in place — tightening this is a solid next lever.'
        : 'A readiness gap that likely held your Starter MetrixScore™ back.'
    return {
      category: c.category,
      label: c.label,
      score: c.score,
      weight: c.weight,
      answered: c.answered,
      total: c.total,
      status,
      note,
    }
  })
}

/** What helped — top readiness strengths. */
export function getTopScoreDrivers(score: MetrixScore, n = 2): ScoreDriver[] {
  return score.strengths
    .filter(s => s.score > 0)
    .slice(0, n)
    .map(s => ({
      category: s.category,
      label: s.label,
      score: s.score,
      note: 'This likely influenced your Starter MetrixScore™ in a positive direction.',
    }))
}

/** What pulled the score down — top readiness risks. */
export function getTopScoreConstraints(score: MetrixScore, n = 2): ScoreConstraint[] {
  return score.risks.slice(0, n).map(r => ({
    category: r.category,
    label: r.label,
    score: r.score,
    severity: r.severity,
    note: 'This is a readiness signal that likely held your Starter MetrixScore™ back.',
  }))
}

/**
 * The highest-leverage areas to improve next. Leverage = how far the area is from
 * full (gap) × its stage weight, so a low score in a category that matters more at
 * this stage ranks higher. Ties favour the owner's stated challenge, then goal —
 * the same intent as the roadmap focus, with no change to scoring.
 */
export function getNextScoreImprovementLevers(
  score: MetrixScore,
  intake: QuickIntake | null = null,
  n = 3,
): ScoreImprovementLever[] {
  const chal = challengeCategory(intake)
  const goal = goalCategory(intake)
  const rank = (cat: MetrixCategory) => (cat === chal ? 0 : cat === goal ? 1 : 2)

  const scored = score.categories
    .filter(c => c.answered > 0)
    .map(c => ({ c, leverage: Math.max(0, 100 - c.score) * c.weight }))
    .sort((a, b) => (b.leverage !== a.leverage ? b.leverage - a.leverage : rank(a.c.category) - rank(b.c.category)))

  return scored.slice(0, n).map((entry, i) => {
    const first = ACTION_CATALOG[entry.c.category][0]
    return {
      category: entry.c.category,
      label: entry.c.label,
      currentScore: entry.c.score,
      rationale: `Strengthening ${entry.c.label} is one of your highest-leverage moves right now.`,
      firstAction: first ? first.title : `Improve ${entry.c.label}`,
      priority: i + 1,
    }
  })
}

/** Full explanation object used by the UI. */
export function getScoreExplanation(
  score: MetrixScore,
  intake: QuickIntake | null = null,
): ScoreExplanation {
  const drivers = getTopScoreDrivers(score, 2)
  const constraints = getTopScoreConstraints(score, 2)
  const levers = getNextScoreImprovementLevers(score, intake, 3)
  const categories = getCategoryExplanations(score)

  const topDriver = drivers[0]
  const topLever = levers[0]
  const headline =
    topDriver && topLever
      ? `Your Starter MetrixScore™ is ${score.overall} — strongest in ${topDriver.label}, with the most upside in ${topLever.label}.`
      : `Your Starter MetrixScore™ is ${score.overall}, based on your current profile depth.`

  const summary =
    'This score reflects the readiness signals in your answers so far — it is not a final, benchmarked, or predictive number, and it becomes more accurate as your MetrixProfile™ grows.'

  return {
    overall: score.overall,
    riskLabel: score.riskLabel,
    completion: score.progress.completion,
    confidenceLabel: score.progress.confidenceLabel,
    headline,
    summary,
    drivers,
    constraints,
    levers,
    categories,
    reassessmentNote: 'Reassess after completing these actions to see your updated MetrixScore™.',
  }
}
