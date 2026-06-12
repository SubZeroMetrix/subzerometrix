// ─────────────────────────────────────────────────────────────────────────────
// Roadmap Focus — biggest_challenge + main_goal → roadmap priority (Phase 1.9D)
// ─────────────────────────────────────────────────────────────────────────────
// Pure, deterministic model/helper layer. It lets the personalized roadmap respond
// to what the contractor TOLD us matters (their stated biggest challenge and main
// goal) without changing any score.
//
// IMPORTANT — what this does NOT do:
//  • It does NOT change the MetrixScore™ or any score math.
//  • It does NOT add, remove, or rewrite roadmap items.
//  • It does NOT change which phases appear or their order.
//  • It does NOT change urgency labels ("Do this now" / "Do this soon" / …).
//
// What it DOES do: it identifies which existing roadmap items relate to the user's
// stated challenge/goal so the engine can (a) surface them earlier WITHIN their
// existing urgency tier and (b) tag them as a "Focus area", and it produces honest
// "why this path" copy. Ordering + explanation only.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuickIntake } from './intake'
import { challengeLabel, goalLabel } from './intake'

// Map the user's stated biggest challenge → the existing roadmap item ids it
// most directly relates to. (Item ids come from ROADMAP_LIBRARY in roadmap.ts.)
const CHALLENGE_TO_ITEMS: Record<string, string[]> = {
  funding:    ['credit', 'pricing', 'bookkeeping'],
  leads:      ['gbp', 'customers'],
  pricing:    ['pricing', 'bookkeeping'],
  licensing:  ['license', 'entity'],
  systems:    ['field-software'],
  hiring:     [], // hiring/scaling items aren't in the starter library yet
  confidence: ['ein', 'entity'],
  time:       ['field-software'],
}

// Map the user's stated main goal → the existing roadmap item ids it points at.
const GOAL_TO_ITEMS: Record<string, string[]> = {
  launch:       ['ein', 'entity', 'license'],
  more_leads:   ['gbp', 'customers'],
  grow_revenue: ['gbp', 'customers', 'pricing'],
  hire_scale:   [],
  systematize:  ['field-software'],
  reset:        ['pricing', 'bookkeeping', 'bank'],
}

export interface RoadmapFocus {
  /** Roadmap item ids the user's stated challenge/goal point at. */
  itemIds: Set<string>
  /** Human-readable label of the stated challenge, if any. */
  challenge: string | null
  /** Human-readable label of the stated goal, if any. */
  goal: string | null
  /** True when at least one of challenge/goal produced a focus signal. */
  hasFocus: boolean
}

/** Derive the roadmap focus (item ids + labels) from the Quick Intake. */
export function roadmapFocus(intake: QuickIntake | null): RoadmapFocus {
  const challenge = intake?.biggestChallenge ?? ''
  const goal = intake?.mainGoal ?? ''

  const itemIds = new Set<string>([
    ...(CHALLENGE_TO_ITEMS[challenge] ?? []),
    ...(GOAL_TO_ITEMS[goal] ?? []),
  ])

  return {
    itemIds,
    challenge: challenge ? challengeLabel(challenge) : null,
    goal: goal ? goalLabel(goal) : null,
    hasFocus: itemIds.size > 0 && Boolean(challenge || goal),
  }
}

/**
 * Honest "why this path" copy. References what the user told us, and is explicit
 * that this changes ordering/emphasis only — not the score. Returns null when
 * there is nothing stated to base it on.
 */
export function pathReason(focus: RoadmapFocus): string | null {
  if (!focus.goal && !focus.challenge) return null

  let basis: string
  if (focus.goal && focus.challenge) {
    basis = `your stated goal (${focus.goal}) and biggest challenge (${focus.challenge})`
  } else if (focus.goal) {
    basis = `your stated goal (${focus.goal})`
  } else {
    basis = `your stated biggest challenge (${focus.challenge})`
  }

  return `Prioritized based on ${basis}. The steps that match are marked as a focus area and surface first within each phase. This changes the order and emphasis of your roadmap — not your score.`
}
