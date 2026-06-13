// ─────────────────────────────────────────────────────────────────────────────
// metrix/reconcile — anonymous → account canonical reconciliation (pure, bounded)
// ─────────────────────────────────────────────────────────────────────────────
// The minimum SAFE reconciliation primitive so signing in after an anonymous assessment
// never silently loses or wrongly replaces the local canonical profile.
//   • Additive by default — the union of distinct records is always returned; nothing is
//     silently dropped.
//   • Never overwrites a NEWER or MORE-COMPLETE record. Local stays authoritative unless a
//     cloud record is strictly newer AND at least as complete.
//   • Deterministic duplicate detection by stable id (assessmentId, else profileId).
//   • Returns an explicit, explainable result.
// This is NOT a general sync framework. Live cloud persistence of canonical profiles is
// deferred (no canonical cloud table is proven in the schema) — see the implementation note.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'

export type ReconcileAction = 'no_cloud' | 'kept_local' | 'adopted_cloud' | 'kept_local_conflict'

export interface ReconcileConflict {
  key: string
  localCreatedAt: string | null
  cloudCreatedAt: string | null
  reason: string
}

export interface ReconciliationResult {
  resolved: MetrixProfileSnapshot | null
  action: ReconcileAction
  reason: string
  additive: MetrixProfileSnapshot[]   // union of distinct records to retain
  conflicts: ReconcileConflict[]
}

function keyOf(s: MetrixProfileSnapshot): string {
  return s.assessmentId ?? s.profileId
}
function timeOf(s: MetrixProfileSnapshot): number {
  const t = Date.parse(s.createdAt)
  return Number.isNaN(t) ? 0 : t
}
function completenessOf(s: MetrixProfileSnapshot): number {
  return s.profileQuality?.coverage?.answered ?? 0
}

/** Union of distinct records by key, keeping the newer one on collision (additive). */
function additiveUnion(records: MetrixProfileSnapshot[]): MetrixProfileSnapshot[] {
  const byKey = new Map<string, MetrixProfileSnapshot>()
  for (const r of records) {
    const k = keyOf(r)
    const existing = byKey.get(k)
    if (!existing || timeOf(r) > timeOf(existing)) byKey.set(k, r)
  }
  return Array.from(byKey.values())
}

export function reconcileCanonicalProfiles(
  local: MetrixProfileSnapshot | null,
  cloud: MetrixProfileSnapshot[] = [],
): ReconciliationResult {
  const additive = additiveUnion([...(local ? [local] : []), ...cloud])

  // No local profile: adopt the best cloud record (newest, then most complete).
  if (!local) {
    if (cloud.length === 0) {
      return { resolved: null, action: 'no_cloud', reason: 'No local or cloud profile.', additive, conflicts: [] }
    }
    const best = [...cloud].sort((a, b) => timeOf(b) - timeOf(a) || completenessOf(b) - completenessOf(a))[0]
    return { resolved: best, action: 'adopted_cloud', reason: 'No local profile; adopted the newest cloud profile.', additive, conflicts: [] }
  }

  if (cloud.length === 0) {
    return { resolved: local, action: 'kept_local', reason: 'No cloud profile; kept local.', additive, conflicts: [] }
  }

  // Find a cloud record matching the local key (deterministic dedup).
  const lk = keyOf(local)
  const match = cloud.find(c => keyOf(c) === lk) ?? null
  const candidate = match ?? [...cloud].sort((a, b) => timeOf(b) - timeOf(a) || completenessOf(b) - completenessOf(a))[0]

  const cloudNewer = timeOf(candidate) > timeOf(local)
  const cloudAtLeastAsComplete = completenessOf(candidate) >= completenessOf(local)
  const differs = JSON.stringify(candidate.readiness) !== JSON.stringify(local.readiness)
    || keyOf(candidate) !== lk

  const conflicts: ReconcileConflict[] = differs
    ? [{ key: keyOf(candidate), localCreatedAt: local.createdAt, cloudCreatedAt: candidate.createdAt,
         reason: cloudNewer ? 'cloud is newer' : 'cloud differs but is not newer' }]
    : []

  // Only adopt cloud when it is strictly newer AND at least as complete — never overwrite a
  // newer or more-complete local record.
  if (cloudNewer && cloudAtLeastAsComplete) {
    return { resolved: candidate, action: 'adopted_cloud', reason: 'Cloud record is strictly newer and at least as complete.', additive, conflicts }
  }
  if (differs) {
    return { resolved: local, action: 'kept_local_conflict', reason: 'Kept local: it is newer or more complete than the cloud record.', additive, conflicts }
  }
  return { resolved: local, action: 'kept_local', reason: 'Local and cloud agree; kept local.', additive, conflicts }
}
