// ─────────────────────────────────────────────────────────────────────────────
// metrix/lifecycle — canonical business lifecycle stages (Wave 2, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Derives ONE canonical lifecycle stage (+ confidence) from the existing canonical
// snapshot. It is a pure PROJECTION — it never scores, gates, prioritizes, or builds
// paths, and it changes nothing about the canonical engine. Deterministic and defensive
// against malformed/legacy snapshots (degrades to a safe default rather than throwing).
//
// The 8 canonical lifecycle stages map the coarse intake BusinessStage + already-derived
// signals (setup progress, revenue/customer signal, readiness, gates) onto a single
// business lifecycle. No new score is computed.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot, BusinessStage } from './profileTypes'

export const LIFECYCLE_VERSION = 1

export type LifecycleStage =
  | 'Explore'
  | 'Side Hustle'
  | 'Prepare'
  | 'Launch'
  | 'Stabilize'
  | 'Grow'
  | 'Scale'
  | 'Recover'

// Stable forward order for transition direction (Recover is a separate reset track).
export const LIFECYCLE_STAGE_ORDER: LifecycleStage[] = [
  'Explore', 'Side Hustle', 'Prepare', 'Launch', 'Stabilize', 'Grow', 'Scale', 'Recover',
]

export const LIFECYCLE_STAGE_LABELS: Record<LifecycleStage, string> = {
  Explore: 'Exploring the idea',
  'Side Hustle': 'Running it on the side',
  Prepare: 'Preparing to launch',
  Launch: 'Launching the business',
  Stabilize: 'Stabilizing operations',
  Grow: 'Growing the business',
  Scale: 'Scaling the business',
  Recover: 'Resetting and recovering',
}

export type StageConfidence = 'high' | 'medium' | 'low'

export interface LifecycleAssessment {
  stage: LifecycleStage
  confidence: StageConfidence
  rationale: string
  basisStage: BusinessStage | ''
  version: number
}

// ── Safe accessors (tolerate malformed / legacy snapshots) ─────────────────────
function safeStage(s: MetrixProfileSnapshot): BusinessStage | '' {
  return s?.businessContext?.stage ?? ''
}
function safeOverall(s: MetrixProfileSnapshot): number {
  const v = s?.readiness?.overall
  return typeof v === 'number' ? v : 0
}
function setupStepCount(s: MetrixProfileSnapshot): number {
  const raw = s?.normalizedAnswers?.rawAnswers as { setup_steps?: unknown } | undefined
  return Array.isArray(raw?.setup_steps) ? raw!.setup_steps!.length : 0
}
// A revenue/customer signal indicates the person is already operating (not purely planning).
function operatingSignal(s: MetrixProfileSnapshot): boolean {
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as { financial?: unknown; customer_plan?: unknown }
  const financial = typeof raw.financial === 'string' ? raw.financial : ''
  const customerPlan = typeof raw.customer_plan === 'string' ? raw.customer_plan : ''
  const hasRevenue = /^k\d/.test(financial)            // revenue bands look like k10_25, k25_50, …
  const hasExistingBase = customerPlan === 'existing_base'
  return hasRevenue || hasExistingBase || setupStepCount(s) >= 3
}
function triggeredGates(s: MetrixProfileSnapshot) {
  return Array.isArray(s?.criticalGates) ? s.criticalGates.filter(g => g?.status === 'triggered') : []
}
function hasConflict(s: MetrixProfileSnapshot): boolean {
  return (Array.isArray(s?.criticalGates) ? s.criticalGates : [])
    .some(g => g?.domain === 'data_quality' && g?.status === 'triggered')
}

/** The single canonical lifecycle stage for a snapshot (pure projection). */
export function deriveLifecycleStage(s: MetrixProfileSnapshot): LifecycleStage {
  const stage = safeStage(s)
  const operating = operatingSignal(s)
  const overall = safeOverall(s)
  const triggered = triggeredGates(s)
  const blocksPaidWork = triggered.some(g => g.blocksPaidWork)
  const coverageLevel = s?.profileQuality?.coverage?.level

  switch (stage) {
    case 'reset':
      return 'Recover'
    case 'thinking':
      return operating ? 'Side Hustle' : 'Explore'
    case 'planning':
      // Planning to launch; if already operating on the side, that's the truer stage.
      return operating ? 'Side Hustle' : 'Prepare'
    case 'launched_u6':
      return 'Launch'
    case 'months_6_12':
      return 'Stabilize'
    case 'over_1yr':
      // Established: Scale only when strong, unblocked, and well-evidenced; else Grow.
      return overall >= 75 && !blocksPaidWork && triggered.length === 0 && coverageLevel === 'substantial'
        ? 'Scale'
        : 'Grow'
    default:
      // Unknown/blank stage → infer conservatively from readiness.
      if (operating) return overall >= 60 ? 'Grow' : 'Stabilize'
      return 'Explore'
  }
}

/** Confidence in the derived lifecycle stage (categorical; no fabricated percentage). */
export function deriveStageConfidence(s: MetrixProfileSnapshot): StageConfidence {
  if (hasConflict(s)) return 'low'
  const level = s?.profileQuality?.coverage?.level
  const notSure = s?.profileQuality?.notSureCount ?? 0
  if (level === 'substantial' && notSure <= 2) return 'high'
  if (level === 'minimal') return 'low'
  return 'medium'
}

function rationaleFor(stage: LifecycleStage, s: MetrixProfileSnapshot): string {
  const triggered = triggeredGates(s).length
  const base: Record<LifecycleStage, string> = {
    Explore: 'You are exploring the idea and have not started operating yet.',
    'Side Hustle': 'You are already operating on the side while building toward a full launch.',
    Prepare: 'You are committed to launching and working through pre-launch setup.',
    Launch: 'You recently launched and are getting the business off the ground.',
    Stabilize: 'You are past the first months and working to make operations dependable.',
    Grow: 'Your foundation is in place and growth is the next lever.',
    Scale: 'You are established, unblocked, and ready to scale deliberately.',
    Recover: 'You are resetting an existing business that needs to get back on track.',
  }
  const gateNote = triggered > 0 ? ` ${triggered} critical gate${triggered === 1 ? '' : 's'} still shape your next move.` : ''
  return base[stage] + gateNote
}

/** Full lifecycle assessment: stage + confidence + rationale (pure, deterministic). */
export function assessLifecycle(s: MetrixProfileSnapshot): LifecycleAssessment {
  const stage = deriveLifecycleStage(s)
  return {
    stage,
    confidence: deriveStageConfidence(s),
    rationale: rationaleFor(stage, s),
    basisStage: safeStage(s),
    version: LIFECYCLE_VERSION,
  }
}

export type StageDirection = 'advanced' | 'regressed' | 'reset' | 'unchanged'

export interface StageTransition {
  from: LifecycleStage
  to: LifecycleStage
  changed: boolean
  direction: StageDirection
}

/** Deterministic transition between two snapshots' lifecycle stages. */
export function detectStageTransition(prev: MetrixProfileSnapshot, next: MetrixProfileSnapshot): StageTransition {
  const from = deriveLifecycleStage(prev)
  const to = deriveLifecycleStage(next)
  const changed = from !== to
  let direction: StageDirection = 'unchanged'
  if (changed) {
    if (to === 'Recover') direction = 'reset'
    else if (from === 'Recover') direction = 'advanced'   // leaving recovery is forward progress
    else {
      const fi = LIFECYCLE_STAGE_ORDER.indexOf(from)
      const ti = LIFECYCLE_STAGE_ORDER.indexOf(to)
      direction = ti > fi ? 'advanced' : 'regressed'
    }
  }
  return { from, to, changed, direction }
}
