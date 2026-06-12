// ─────────────────────────────────────────────────────────────────────────────
// MetrixKpis — manual KPI tracking model (Mega-Phase 1: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL KPI entry only. No live integrations, no third-party APIs, no external
// data sources. A contractor records their own numbers; the product shows the
// trend. Standalone module — imports no other app lib (avoids cycles).
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors RetentionStorageMode in metrixHistory.ts. Kept inline to keep the import
// graph one-directional (history → kpis).
type StorageMode = 'local_device' | 'cloud_account'

export type ManualKpiKey =
  | 'monthly_revenue'
  | 'leads'
  | 'booked_calls'
  | 'close_rate'
  | 'average_ticket'
  | 'reviews'
  | 'cash_reserve'
  | 'maintenance_agreements'
  | 'jobs_completed'
  | 'team_size'

export type KpiUnit = 'currency' | 'count' | 'percent'
export type KpiDirection = 'higher_better' | 'lower_better'

export interface ManualKpiDefinition {
  key: ManualKpiKey
  label: string
  unit: KpiUnit
  direction: KpiDirection
  helper: string
}

export const MANUAL_KPI_DEFINITIONS: ManualKpiDefinition[] = [
  { key: 'monthly_revenue',        label: 'Monthly revenue',         unit: 'currency', direction: 'higher_better', helper: 'Total revenue collected this month.' },
  { key: 'leads',                  label: 'New leads',               unit: 'count',    direction: 'higher_better', helper: 'Number of new inquiries this period.' },
  { key: 'booked_calls',           label: 'Booked calls / jobs',     unit: 'count',    direction: 'higher_better', helper: 'Leads that turned into a scheduled call or job.' },
  { key: 'close_rate',             label: 'Close rate',              unit: 'percent',  direction: 'higher_better', helper: 'Share of quotes that became booked work.' },
  { key: 'average_ticket',         label: 'Average ticket',          unit: 'currency', direction: 'higher_better', helper: 'Average revenue per completed job.' },
  { key: 'reviews',                label: 'New reviews',             unit: 'count',    direction: 'higher_better', helper: 'New customer reviews earned this period.' },
  { key: 'cash_reserve',           label: 'Cash reserve',            unit: 'currency', direction: 'higher_better', helper: 'Operating cash set aside as a buffer.' },
  { key: 'maintenance_agreements', label: 'Maintenance agreements',  unit: 'count',    direction: 'higher_better', helper: 'Active recurring service agreements.' },
  { key: 'jobs_completed',         label: 'Jobs completed',          unit: 'count',    direction: 'higher_better', helper: 'Jobs finished this period.' },
  { key: 'team_size',              label: 'Team size',               unit: 'count',    direction: 'higher_better', helper: 'People on your team, including you.' },
]

export function getKpiDefinition(key: ManualKpiKey): ManualKpiDefinition | undefined {
  return MANUAL_KPI_DEFINITIONS.find(d => d.key === key)
}

// ── Snapshot ──────────────────────────────────────────────────────────────────
export interface ManualKpiSnapshot {
  id: string
  createdAt: string                              // ISO timestamp
  storageMode: StorageMode                       // local_device now, cloud_account later
  periodLabel: string | null                     // e.g. 'June 2026' or '2026-06'
  values: Partial<Record<ManualKpiKey, number>>  // only the KPIs the user entered
  note: string | null
}

export interface ManualKpiSnapshotInput {
  values: Partial<Record<ManualKpiKey, number>>
  periodLabel?: string | null
  note?: string | null
  storageMode?: StorageMode
}

// ── Internal utilities (no external deps) ─────────────────────────────────────
function nowIso(): string {
  return new Date().toISOString()
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function createManualKpiSnapshot(input: ManualKpiSnapshotInput): ManualKpiSnapshot {
  return {
    id: genId('kpi'),
    createdAt: nowIso(),
    storageMode: input.storageMode ?? 'local_device',
    periodLabel: input.periodLabel ?? null,
    values: { ...input.values },
    note: input.note ?? null,
  }
}

// ── Deltas & trends ───────────────────────────────────────────────────────────
export interface KpiDelta {
  key: ManualKpiKey
  previous: number | null
  current: number | null
  delta: number | null
  improved: boolean | null   // null when flat or direction unknown
}

function improvedFor(key: ManualKpiKey, delta: number | null): boolean | null {
  if (delta === null || delta === 0) return null
  const def = getKpiDefinition(key)
  if (!def) return null
  return def.direction === 'higher_better' ? delta > 0 : delta < 0
}

export function calculateKpiDelta(
  previous: ManualKpiSnapshot | null,
  next: ManualKpiSnapshot,
  key: ManualKpiKey,
): KpiDelta {
  const prev = previous?.values[key] ?? null
  const curr = next.values[key] ?? null
  const delta = prev !== null && curr !== null ? curr - prev : null
  return { key, previous: prev, current: curr, delta, improved: improvedFor(key, delta) }
}

export interface KpiTrendSummary {
  key: ManualKpiKey
  points: { createdAt: string; value: number }[]
  first: number | null
  latest: number | null
  delta: number | null
  improved: boolean | null
}

export function getKpiTrendSummary(
  snapshots: ManualKpiSnapshot[],
  key: ManualKpiKey,
): KpiTrendSummary {
  const points = [...snapshots]
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0))
    .filter(s => typeof s.values[key] === 'number')
    .map(s => ({ createdAt: s.createdAt, value: s.values[key] as number }))

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const first = firstPoint ? firstPoint.value : null
  const latest = lastPoint ? lastPoint.value : null
  const delta = first !== null && latest !== null ? latest - first : null
  return { key, points, first, latest, delta, improved: improvedFor(key, delta) }
}
