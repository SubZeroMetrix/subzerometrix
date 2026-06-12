// ─────────────────────────────────────────────────────────────────────────────
// SyncStatusBadge — honest storage-status chip (Account-2C)
// ─────────────────────────────────────────────────────────────────────────────
// PRESENTATIONAL ONLY. Renders where a user's progress is saved, based on a status
// that is PASSED IN. It performs NO network calls, NO localStorage reads, NO Supabase
// writes, and NEVER infers "synced". The label "Synced to your account" only renders
// when the caller explicitly passes status="synced_to_account" — which only happens
// after a real, confirmed cloud write (not in this phase).
//
// Default status is 'saved_on_device' → "Saved on this device", the honest truth today.
// ─────────────────────────────────────────────────────────────────────────────

import { Smartphone, Cloud, CloudOff, LogIn } from 'lucide-react'
import {
  getSyncStatusLabel,
  getSyncStatusDescription,
  getSyncStatusActionLabel,
  getSyncStatusTone,
  getSyncEntityByType,
  type SyncStatus,
  type SyncStatusTone,
  type SyncEntityType,
} from '@/lib/syncContracts'

interface SyncStatusBadgeProps {
  /** Defaults to 'saved_on_device' — never assume synced. */
  status?: SyncStatus
  /** Optional entity this badge describes (for future per-flow status). */
  entityType?: SyncEntityType
  /** ISO timestamp of the last local save, if known. */
  lastSavedAt?: string | null
  /** ISO timestamp of the last confirmed cloud write, if any. */
  lastSyncedAt?: string | null
  /** Compact = single-line pill with no description. */
  compact?: boolean
  className?: string
}

const TONE_COLORS: Record<SyncStatusTone, string> = {
  neutral: '#9FB3C8',  // brand-silver-ish
  positive: '#1D9E75',
  warning: '#EF9F27',
  prompt: '#4A90D9',
}

function iconFor(status: SyncStatus) {
  switch (status) {
    case 'synced_to_account':  return Cloud
    case 'sync_unavailable':   return CloudOff
    case 'sign_in_to_back_up': return LogIn
    case 'saved_on_device':
    default:                   return Smartphone
  }
}

/** Deterministic short date; returns null for missing/invalid input. */
function fmtDate(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SyncStatusBadge({
  status = 'saved_on_device',
  entityType,
  lastSavedAt,
  lastSyncedAt,
  compact = false,
  className = '',
}: SyncStatusBadgeProps) {
  const label = getSyncStatusLabel(status)
  const description = getSyncStatusDescription(status)
  const actionLabel = getSyncStatusActionLabel(status)
  const tone = getSyncStatusTone(status)
  const color = TONE_COLORS[tone]
  const Icon = iconFor(status)

  const savedOn = fmtDate(lastSavedAt)
  // Only show a synced timestamp when the status is actually synced — never imply it.
  const syncedOn = status === 'synced_to_account' ? fmtDate(lastSyncedAt) : null
  // Human label for the flow this badge describes, when provided.
  const entityLabel = entityType ? getSyncEntityByType(entityType).label : null

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${className}`}
        style={{ color, background: `${color}14`, border: `1px solid ${color}33` }}
        data-sync-status={status}
        data-sync-entity={entityType ?? undefined}
        title={entityLabel ? `${entityLabel} — ${description}` : description}
      >
        <Icon className="w-3 h-3" aria-hidden="true" />
        {label}
      </span>
    )
  }

  return (
    <div
      className={`glass-light rounded-xl px-4 py-3 ${className}`}
      data-sync-status={status}
      data-sync-entity={entityType ?? undefined}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} aria-hidden="true" />
        <span className="text-[12px] font-semibold" style={{ color }}>{label}</span>
        {entityLabel && (
          <span className="ml-auto text-[10px] text-brand-silver/50">{entityLabel}</span>
        )}
      </div>
      <p className="text-[11px] text-brand-silver/80 leading-relaxed mt-1.5">{description}</p>
      {(savedOn || syncedOn) && (
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[10px] text-brand-silver/50">
          {savedOn && <span>Last saved: {savedOn}</span>}
          {syncedOn && <span>Last synced: {syncedOn}</span>}
        </div>
      )}
      {actionLabel && (
        <p className="text-[10px] text-brand-silver/60 mt-1.5">{actionLabel}</p>
      )}
    </div>
  )
}
