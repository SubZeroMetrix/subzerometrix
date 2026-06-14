// ─────────────────────────────────────────────────────────────────────────────
// metrix/reassessment — lean reassessment & profile-update loop (SZM-2F, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Re-runs the ONE canonical evaluator on updated answers to UPDATE the same Metrix
// Profile — it never scores, gates, prioritizes, or builds paths itself. It only:
//   • decides whether a reassessment is warranted (explicit eligibility OR a
//     meaningful profile change) — never auto-rescores merely because a page loads;
//   • re-evaluates via evaluateMetrixProfile, keeping the SAME profileId;
//   • reconciles progress with the existing resetIfPriorityChanged (preserves
//     completed steps when the priority is unchanged; archives + starts fresh when
//     it changes — completed progress is never lost, old steps never count anew);
//   • diffs the previous vs. new snapshot into "what changed / why / unchanged";
//   • appends to reassessment history ONLY when something materially changed
//     (so repeat reassessment with the same inputs is idempotent).
// Pure + deterministic: no storage, no cloud, no React. Defensive against malformed
// legacy snapshots/progress (it degrades to a safe skip rather than throwing).
// ─────────────────────────────────────────────────────────────────────────────

import type { RawAnswers } from '../scoring'
import type { QuickIntake } from '../intake'
import {
  type MetrixProfileSnapshot, type EvidenceStatus, type GateStatus,
} from './profileTypes'
import { evaluateMetrixProfile } from './snapshot'
import {
  resetIfPriorityChanged,
  type PersistedPriorityProgress, type PriorityChangeResult,
} from './progressRecord'

export const REASSESSMENT_SCHEMA_VERSION = 1

// Why an evaluation ran (or why it was skipped).
export type ReassessmentTrigger = 'eligibility' | 'profile_change' | 'both' | 'none'
export type ReassessmentStatus = 'reassessed' | 'unchanged' | 'skipped'

// One light, persistable record of a completed reassessment (the history entry).
export interface ReassessmentRecord {
  id: string
  reassessedAt: string
  profileId: string
  trigger: ReassessmentTrigger
  previousOverall: number
  newOverall: number
  scoreDelta: number
  previousPriorityId: string
  newPriorityId: string
  priorityChanged: boolean
  newlyTriggeredGateIds: string[]
  newlyClearedGateIds: string[]
  schemaVersion: number
}

interface ScoreDiff { previous: number; next: number; delta: number; changed: boolean }
interface RiskDiff { previous: string; next: string; changed: boolean }
interface PriorityDiff {
  previousId: string; previousTitle: string
  nextId: string; nextTitle: string
  changed: boolean
  nextRationale: string
  nextReasonCodes: string[]
}
interface GateRef { id: string; title: string }
interface GateDiff {
  newlyTriggered: GateRef[]
  newlyCleared: GateRef[]
  stillTriggered: GateRef[]
}
interface EvidenceDiff { previous: EvidenceStatus; next: EvidenceStatus; changed: boolean }
interface CoverageDiff { previous: number; next: number; changed: boolean }

export interface ReassessmentDiff {
  hasChanges: boolean
  score: ScoreDiff
  riskLevel: RiskDiff
  priority: PriorityDiff
  gates: GateDiff
  evidence: EvidenceDiff
  coverage: CoverageDiff
  unchanged: string[]   // human-readable list of what stayed the same
}

export interface ReassessmentResult {
  status: ReassessmentStatus
  trigger: ReassessmentTrigger
  previous: MetrixProfileSnapshot
  next: MetrixProfileSnapshot            // === previous when skipped
  diff: ReassessmentDiff
  progress: PriorityChangeResult         // { active, archived, changed }
  history: ReassessmentRecord[]          // input history, with the new record appended (only when reassessed)
  record: ReassessmentRecord | null      // the appended record, if any
}

export interface ReassessOptions {
  now?: string
  eligibleOverride?: boolean             // defaults to progress.reassessmentEligible
  assessmentId?: string | null
  userId?: string | null
  historyLimit?: number                  // bound the returned history (default 20)
}

// ── Safe accessors (tolerate malformed / legacy snapshots) ─────────────────────
function safeOverall(s: MetrixProfileSnapshot): number {
  const v = s?.readiness?.overall
  return typeof v === 'number' ? v : 0
}
function safeRisk(s: MetrixProfileSnapshot): string {
  return s?.readiness?.riskLevel ?? 'unknown'
}
function safePriorityId(s: MetrixProfileSnapshot): string {
  return s?.metrixPriority?.priorityId ?? ''
}
function safePriorityTitle(s: MetrixProfileSnapshot): string {
  return s?.metrixPriority?.title ?? ''
}
function safeEvidence(s: MetrixProfileSnapshot): EvidenceStatus {
  return s?.metrixPriority?.evidenceStatus ?? 'no_evidence'
}
function safeCoverage(s: MetrixProfileSnapshot): number {
  const v = s?.profileQuality?.coverage?.answered
  return typeof v === 'number' ? v : 0
}
function triggeredGates(s: MetrixProfileSnapshot): GateRef[] {
  const gates = Array.isArray(s?.criticalGates) ? s.criticalGates : []
  return gates
    .filter(g => (g?.status as GateStatus) === 'triggered')
    .map(g => ({ id: g.id, title: g.title }))
}

// A "meaningful profile change" = the captured answers materially differ. Completing
// action steps alone never changes answers, so it alone never forces a re-score here.
function sameAnswers(prev: MetrixProfileSnapshot, nextAnswers: RawAnswers): boolean {
  try {
    return JSON.stringify(prev?.normalizedAnswers?.rawAnswers) === JSON.stringify(nextAnswers)
  } catch {
    return false   // unstringifiable → treat as changed (safer to re-evaluate than to silently skip)
  }
}

function genId(): string {
  const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } }
  if (g.crypto?.randomUUID) return `ra_${g.crypto.randomUUID()}`
  return `ra_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// ── Pure diff of two snapshots ─────────────────────────────────────────────────
export function diffSnapshots(prev: MetrixProfileSnapshot, next: MetrixProfileSnapshot): ReassessmentDiff {
  const prevOverall = safeOverall(prev), nextOverall = safeOverall(next)
  const score: ScoreDiff = {
    previous: prevOverall, next: nextOverall,
    delta: nextOverall - prevOverall, changed: nextOverall !== prevOverall,
  }
  const riskLevel: RiskDiff = {
    previous: safeRisk(prev), next: safeRisk(next), changed: safeRisk(prev) !== safeRisk(next),
  }
  const priority: PriorityDiff = {
    previousId: safePriorityId(prev), previousTitle: safePriorityTitle(prev),
    nextId: safePriorityId(next), nextTitle: safePriorityTitle(next),
    changed: safePriorityId(prev) !== safePriorityId(next),
    nextRationale: next?.metrixPriority?.rationale ?? '',
    nextReasonCodes: Array.isArray(next?.metrixPriority?.reasonCodes) ? next.metrixPriority.reasonCodes : [],
  }

  const prevGates = triggeredGates(prev)
  const nextGates = triggeredGates(next)
  const prevIds = new Set(prevGates.map(g => g.id))
  const nextIds = new Set(nextGates.map(g => g.id))
  const gates: GateDiff = {
    newlyTriggered: nextGates.filter(g => !prevIds.has(g.id)),
    newlyCleared: prevGates.filter(g => !nextIds.has(g.id)),
    stillTriggered: nextGates.filter(g => prevIds.has(g.id)),
  }

  const evidence: EvidenceDiff = {
    previous: safeEvidence(prev), next: safeEvidence(next), changed: safeEvidence(prev) !== safeEvidence(next),
  }
  const coverage: CoverageDiff = {
    previous: safeCoverage(prev), next: safeCoverage(next), changed: safeCoverage(prev) !== safeCoverage(next),
  }

  const hasChanges =
    score.changed || riskLevel.changed || priority.changed ||
    gates.newlyTriggered.length > 0 || gates.newlyCleared.length > 0 ||
    evidence.changed

  // "What remains unchanged" — only list dimensions that actually held steady.
  const unchanged: string[] = []
  if (!score.changed) unchanged.push('Readiness score')
  if (!priority.changed) unchanged.push('Top priority')
  if (gates.newlyTriggered.length === 0 && gates.newlyCleared.length === 0) unchanged.push('Critical gates')
  if (!riskLevel.changed) unchanged.push('Risk level')
  if (!evidence.changed) unchanged.push('Evidence backing')

  return { hasChanges, score, riskLevel, priority, gates, evidence, coverage, unchanged }
}

function recordFromDiff(next: MetrixProfileSnapshot, diff: ReassessmentDiff, trigger: ReassessmentTrigger, now: string): ReassessmentRecord {
  return {
    id: genId(),
    reassessedAt: now,
    profileId: next.profileId,
    trigger,
    previousOverall: diff.score.previous,
    newOverall: diff.score.next,
    scoreDelta: diff.score.delta,
    previousPriorityId: diff.priority.previousId,
    newPriorityId: diff.priority.nextId,
    priorityChanged: diff.priority.changed,
    newlyTriggeredGateIds: diff.gates.newlyTriggered.map(g => g.id),
    newlyClearedGateIds: diff.gates.newlyCleared.map(g => g.id),
    schemaVersion: REASSESSMENT_SCHEMA_VERSION,
  }
}

/**
 * Reassess (update) an existing canonical Metrix Profile from updated answers.
 *
 * Runs the single evaluator ONLY when the user is reassessment-eligible OR the answers
 * meaningfully changed — otherwise it is a safe no-op (status 'skipped'). The new snapshot
 * keeps the SAME profileId. Progress is reconciled with the existing canonical reconciler so
 * completed work is preserved (priority unchanged) or archived and restarted (priority changed).
 * Nothing is persisted here — the caller persists `next`, `progress`, and `history`.
 */
export function reassessProfile(
  previous: MetrixProfileSnapshot,
  progress: PersistedPriorityProgress | null,
  nextAnswers: RawAnswers,
  nextIntake: QuickIntake | null,
  history: ReassessmentRecord[],
  opts: ReassessOptions = {},
): ReassessmentResult {
  const now = opts.now ?? new Date().toISOString()
  const priorHistory = Array.isArray(history) ? history : []
  const limit = opts.historyLimit ?? 20

  const eligible = opts.eligibleOverride ?? (progress?.reassessmentEligible === true)
  const changed = !sameAnswers(previous, nextAnswers)
  const trigger: ReassessmentTrigger =
    eligible && changed ? 'both' : eligible ? 'eligibility' : changed ? 'profile_change' : 'none'

  // Gate: never reassess merely because a page loaded. No eligibility and no change → no-op.
  if (!eligible && !changed) {
    return {
      status: 'skipped',
      trigger: 'none',
      previous,
      next: previous,
      diff: diffSnapshots(previous, previous),
      progress: { active: progress ?? null as unknown as PersistedPriorityProgress, archived: null, changed: false },
      history: priorHistory,
      record: null,
    }
  }

  // The ONE evaluation. Same profileId → the same canonical profile is updated, not replaced.
  const next = evaluateMetrixProfile(nextAnswers, nextIntake, {
    profileId: previous.profileId,
    assessmentId: opts.assessmentId ?? previous.assessmentId ?? null,
    userId: opts.userId ?? previous.userId ?? null,
    source: 'reassessment',
    now,
  })
  next.updatedAt = now

  const diff = diffSnapshots(previous, next)
  // Existing canonical reconciler: preserves completed steps or archives + restarts on change.
  const reconciled = resetIfPriorityChanged(progress ?? null, next, now)

  if (!diff.hasChanges) {
    // Idempotent: re-evaluating identical inputs yields no material change → no history churn.
    return {
      status: 'unchanged',
      trigger,
      previous,
      next,
      diff,
      progress: reconciled,
      history: priorHistory,
      record: null,
    }
  }

  const record = recordFromDiff(next, diff, trigger, now)
  return {
    status: 'reassessed',
    trigger,
    previous,
    next,
    diff,
    progress: reconciled,
    history: [...priorHistory, record].slice(-limit),
    record,
  }
}
