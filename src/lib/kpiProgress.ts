// ─────────────────────────────────────────────────────────────────────────────
// kpiProgress — manual KPI input + progress over time (Mega-Phase 4C)
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL ENTRY ONLY. Saves the contractor's own numbers as local-device KPI
// snapshots (reusing the metrixKpis model + metrixHistory storage) and computes
// movement over time. NO live integrations, NO API calls, NO third-party tracking,
// NO automatic sync. Device-local until account sync ships (future).
// ─────────────────────────────────────────────────────────────────────────────

import {
  MANUAL_KPI_DEFINITIONS,
  createManualKpiSnapshot,
  calculateKpiDelta,
  type ManualKpiKey,
  type ManualKpiSnapshot,
  type KpiDelta,
} from './metrixKpis'
import { loadLocalMetrixHistory, saveLocalMetrixHistory } from './metrixStorage'
import { addManualKpiSnapshot, createEmptyMetrixHistoryState } from './metrixHistory'

export interface KpiInputValue {
  key: ManualKpiKey
  value: number | null
}

export type KpiProgressDelta = KpiDelta & {
  label: string
  unit: string
}

export interface KpiProgressSummary {
  hasHistory: boolean
  current: ManualKpiSnapshot | null
  previous: ManualKpiSnapshot | null
  lastUpdated: string | null
  deltas: KpiProgressDelta[]
  improvedCount: number
  trackedCount: number
  message: string
}

export interface KpiPriorityRecommendation {
  key: ManualKpiKey
  label: string
  reason: string
}

function sortByCreatedDesc(snaps: ManualKpiSnapshot[]): ManualKpiSnapshot[] {
  return [...snaps].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
}

/** The most recent locally-saved KPI snapshot, or null. */
export function getCurrentKpiSnapshot(): ManualKpiSnapshot | null {
  const state = loadLocalMetrixHistory()
  if (!state) return null
  return sortByCreatedDesc(state.kpiSnapshots)[0] ?? null
}

/** The KPI snapshot before the latest, or null. */
export function getPreviousKpiSnapshot(): ManualKpiSnapshot | null {
  const state = loadLocalMetrixHistory()
  if (!state) return null
  return sortByCreatedDesc(state.kpiSnapshots)[1] ?? null
}

/**
 * Save a manual KPI snapshot to LOCAL device history. Never writes to a server.
 * Only the values the user entered are stored.
 */
export function saveManualKpiSnapshotLocal(
  values: Partial<Record<ManualKpiKey, number>>,
  opts: { periodLabel?: string | null; note?: string | null } = {},
): ManualKpiSnapshot {
  const state = loadLocalMetrixHistory() ?? createEmptyMetrixHistoryState('local_device')
  const snapshot = createManualKpiSnapshot({
    values,
    periodLabel: opts.periodLabel ?? null,
    note: opts.note ?? null,
  })
  saveLocalMetrixHistory(addManualKpiSnapshot(state, snapshot))
  return snapshot
}

/** Honest message about KPI movement. No growth promises. */
export function getKpiProgressMessage(improved: number, tracked: number, hasPrevious: boolean): string {
  if (tracked === 0) return 'Enter your key numbers to start tracking your business movement over time.'
  if (!hasPrevious) return 'First numbers saved. Update them next month to see your outcome trend.'
  if (improved === 0) return 'No upward movement yet — keep working your roadmap and update again next month.'
  if (improved === tracked) return `All ${tracked} tracked numbers moved in the right direction. Strong outcome trend.`
  return `${improved} of ${tracked} tracked numbers moved in the right direction.`
}

/** Compare the latest snapshot to the previous one, per tracked KPI. */
export function calculateKpiProgressSummary(): KpiProgressSummary {
  const current = getCurrentKpiSnapshot()
  const previous = getPreviousKpiSnapshot()

  if (!current) {
    return {
      hasHistory: false,
      current: null,
      previous: null,
      lastUpdated: null,
      deltas: [],
      improvedCount: 0,
      trackedCount: 0,
      message: getKpiProgressMessage(0, 0, false),
    }
  }

  const deltas: KpiProgressDelta[] = []
  for (const def of MANUAL_KPI_DEFINITIONS) {
    if (typeof current.values[def.key] !== 'number') continue
    const delta = calculateKpiDelta(previous, current, def.key)
    deltas.push({ ...delta, label: def.label, unit: def.unit })
  }

  const improvedCount = deltas.filter(d => d.improved === true).length
  const trackedCount = deltas.length

  return {
    hasHistory: true,
    current,
    previous,
    lastUpdated: current.createdAt,
    deltas,
    improvedCount,
    trackedCount,
    message: getKpiProgressMessage(improvedCount, trackedCount, previous !== null),
  }
}

/**
 * Which numbers to focus on next: KPIs trending the wrong way first, then
 * high-value KPIs not yet being tracked.
 */
export function getKpiPriorityRecommendations(n = 3): KpiPriorityRecommendation[] {
  const current = getCurrentKpiSnapshot()
  const previous = getPreviousKpiSnapshot()
  const recs: KpiPriorityRecommendation[] = []
  const used = new Set<ManualKpiKey>()

  if (current) {
    for (const def of MANUAL_KPI_DEFINITIONS) {
      if (typeof current.values[def.key] !== 'number') continue
      if (calculateKpiDelta(previous, current, def.key).improved === false) {
        recs.push({ key: def.key, label: def.label, reason: 'Trending the wrong way — worth your attention this month.' })
        used.add(def.key)
      }
    }
  }

  const tracked = new Set(current ? Object.keys(current.values) : [])
  for (const def of MANUAL_KPI_DEFINITIONS) {
    if (recs.length >= n) break
    if (used.has(def.key) || tracked.has(def.key)) continue
    recs.push({ key: def.key, label: def.label, reason: 'Start tracking this to see your trend over time.' })
  }

  return recs.slice(0, n)
}
