// ─────────────────────────────────────────────────────────────────────────────
// MetrixReminders — in-app accountability model (Mega-Phase 1: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Pure, deterministic in-app reminder/accountability model. NOTHING here sends
// email or SMS, calls any external service, or wires UI. These are local,
// in-app "nudges" the product can surface to keep a contractor on task.
//
// This module is standalone — it imports no other app lib (avoids circular
// dependencies). metrixHistory re-exports ReminderEvent + createReminderEvent.
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors RetentionStorageMode in metrixHistory.ts. Kept inline here to keep this
// module dependency-free and the import graph one-directional (history → reminders).
type StorageMode = 'local_device' | 'cloud_account'

export type ReminderType =
  | 'next_action'
  | 'reassessment'
  | 'stale_action'
  | 'kpi_update'
  | 'custom'

export type ReminderPriority = 'low' | 'medium' | 'high'

export type ReminderCadence =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'

export interface ReminderPreference {
  type: ReminderType
  enabled: boolean
  cadence: ReminderCadence
  priority: ReminderPriority
}

export interface ReminderRule {
  id: string
  type: ReminderType
  label: string
  description: string
  cadence: ReminderCadence
  priority: ReminderPriority
  triggerAfterDays?: number
}

export interface ReminderEvent {
  id: string
  createdAt: string            // ISO timestamp
  type: ReminderType
  priority: ReminderPriority
  title: string
  detail: string
  dueAt: string | null         // ISO timestamp, or null for no due date
  relatedId: string | null     // related action id / snapshot id, if any
  storageMode: StorageMode     // local_device now, cloud_account later
  acknowledged: boolean
}

// ── Defaults / suggestions ────────────────────────────────────────────────────
export const defaultReminderPreferences: ReminderPreference[] = [
  { type: 'next_action',  enabled: true,  cadence: 'weekly',    priority: 'medium' },
  { type: 'reassessment', enabled: true,  cadence: 'quarterly', priority: 'high'   },
  { type: 'stale_action', enabled: true,  cadence: 'biweekly',  priority: 'low'    },
  { type: 'kpi_update',   enabled: false, cadence: 'monthly',   priority: 'low'    },
]

export const suggestedReminderRules: ReminderRule[] = [
  {
    id: 'rule_next_action', type: 'next_action',
    label: 'Keep momentum on your next action',
    description: 'A weekly nudge to complete your current roadmap action.',
    cadence: 'weekly', priority: 'medium',
  },
  {
    id: 'rule_reassessment', type: 'reassessment',
    label: '90-day reassessment',
    description: 'Reassess your MetrixScore™ each quarter to see how your readiness changes over time.',
    cadence: 'quarterly', priority: 'high', triggerAfterDays: 90,
  },
  {
    id: 'rule_stale_action', type: 'stale_action',
    label: 'Pick an action back up',
    description: 'A gentle nudge when an action has sat unfinished for a while.',
    cadence: 'biweekly', priority: 'low', triggerAfterDays: 14,
  },
  {
    id: 'rule_kpi_update', type: 'kpi_update',
    label: 'Log your monthly numbers',
    description: 'A monthly prompt to record your manual KPIs so you can see your trend.',
    cadence: 'monthly', priority: 'low', triggerAfterDays: 30,
  },
]

// ── Internal utilities (no external deps) ─────────────────────────────────────
function nowIso(): string {
  return new Date().toISOString()
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

// ── Factories ─────────────────────────────────────────────────────────────────
export interface ReminderEventInput {
  type: ReminderType
  title: string
  detail?: string
  priority?: ReminderPriority
  dueAt?: string | null
  relatedId?: string | null
  storageMode?: StorageMode
}

export function createReminderEvent(input: ReminderEventInput): ReminderEvent {
  return {
    id: genId('rem'),
    createdAt: nowIso(),
    type: input.type,
    priority: input.priority ?? 'medium',
    title: input.title,
    detail: input.detail ?? '',
    dueAt: input.dueAt ?? null,
    relatedId: input.relatedId ?? null,
    storageMode: input.storageMode ?? 'local_device',
    acknowledged: false,
  }
}

export function createNextActionReminder(
  actionId: string,
  actionTitle: string,
  dueAt: string | null = null,
): ReminderEvent {
  return createReminderEvent({
    type: 'next_action',
    title: `Next step: ${actionTitle}`,
    detail: 'Keep your momentum going — complete this action when you can.',
    priority: 'medium',
    dueAt,
    relatedId: actionId,
  })
}

export function createReassessmentReminder(
  lastAssessedAtIso: string,
  afterDays = 90,
): ReminderEvent {
  return createReminderEvent({
    type: 'reassessment',
    title: 'Time to reassess your MetrixScore™',
    detail: 'Reassess to see how your readiness has changed over time.',
    priority: 'high',
    dueAt: addDaysIso(lastAssessedAtIso, afterDays),
    relatedId: null,
  })
}

export function createStaleActionReminder(
  actionId: string,
  actionTitle: string,
  lastUpdatedAtIso: string,
  afterDays = 14,
): ReminderEvent {
  return createReminderEvent({
    type: 'stale_action',
    title: `Still on your list: ${actionTitle}`,
    detail: 'This action has been waiting a while. Pick it back up or swap it for one that fits better.',
    priority: 'low',
    dueAt: addDaysIso(lastUpdatedAtIso, afterDays),
    relatedId: actionId,
  })
}

/** Unacknowledged reminders whose due date has arrived (in-app surfacing only). */
export function getDueReminderEvents(
  events: ReminderEvent[],
  nowIsoValue: string = nowIso(),
): ReminderEvent[] {
  return events.filter(e => !e.acknowledged && e.dueAt !== null && e.dueAt <= nowIsoValue)
}
