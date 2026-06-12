// ─────────────────────────────────────────────────────────────────────────────
// syncConflict — Account-2J: shared local↔cloud migration + conflict handling
// ─────────────────────────────────────────────────────────────────────────────
// PURE helpers shared by the wired sync flows (Account-2D..2I). They implement a
// conservative NEWEST-WINS reconciliation by record id using `updatedAt ?? createdAt`,
// and they NEVER write, delete, or overwrite local storage themselves — they return a
// recommendation (`merged` + `hydrateRecommended` + counts) for a caller to act on
// explicitly. This preserves local-first behavior and the rule:
//   • Do not overwrite newer local data with older cloud data.
//   • The cloud write path stays additive/idempotent (upsert on (user_id, local_id)).
//   • Privacy-gated/skipped records were never written to the cloud, so reconcile
//     (a read-side compare) cannot reintroduce them.
// ─────────────────────────────────────────────────────────────────────────────

export type ConflictResolution =
  | 'local_newer'
  | 'cloud_newer'
  | 'equal'
  | 'local_only'
  | 'cloud_only'

export interface TimestampedRecord {
  id?: string
  createdAt?: string | null
  updatedAt?: string | null
}

/** The comparable timestamp for a record: updatedAt, else createdAt, else null. */
export function getRecordTimestamp(rec: TimestampedRecord | null | undefined): string | null {
  if (!rec) return null
  return rec.updatedAt ?? rec.createdAt ?? null
}

/** Compare two ISO timestamps (string compare is valid for ISO-8601). */
export function compareTimestamps(localTs: string | null, cloudTs: string | null): ConflictResolution {
  if (localTs && cloudTs) {
    if (localTs > cloudTs) return 'local_newer'
    if (cloudTs > localTs) return 'cloud_newer'
    return 'equal'
  }
  if (localTs && !cloudTs) return 'local_newer'
  if (cloudTs && !localTs) return 'cloud_newer'
  return 'equal'
}

export interface ReconcileResult<T> {
  /** Newest-wins union by id. A RECOMMENDATION only — not written automatically. */
  merged: T[]
  /** True when the cloud has records the local copy lacks, or newer versions. */
  hydrateRecommended: boolean
  localNewerCount: number
  cloudNewerCount: number
  cloudOnlyCount: number
  localOnlyCount: number
  equalCount: number
}

/**
 * Newest-wins reconciliation of two record lists by `id`. Keeps the newer of each pair
 * (ties and missing-cloud keep local — local-first). Records without an id are kept as
 * local-only (never matched/clobbered). Pure: returns a recommendation; writes nothing.
 */
export function reconcileByIdNewestWins<T extends TimestampedRecord>(local: T[], cloud: T[]): ReconcileResult<T> {
  const slots = new Map<string, { local?: T; cloud?: T }>()
  let noIdSeq = 0
  const keyOf = (r: T, side: 'l' | 'c'): string =>
    typeof r.id === 'string' && r.id ? r.id : `__noid_${side}_${noIdSeq++}`

  for (const r of local) {
    const k = keyOf(r, 'l')
    slots.set(k, { ...(slots.get(k) ?? {}), local: r })
  }
  for (const r of cloud) {
    const k = keyOf(r, 'c')
    slots.set(k, { ...(slots.get(k) ?? {}), cloud: r })
  }

  const merged: T[] = []
  let localNewerCount = 0, cloudNewerCount = 0, cloudOnlyCount = 0, localOnlyCount = 0, equalCount = 0

  for (const { local: l, cloud: c } of Array.from(slots.values())) {
    if (l && !c) { merged.push(l); localOnlyCount += 1; continue }
    if (c && !l) { merged.push(c); cloudOnlyCount += 1; continue }
    if (l && c) {
      const res = compareTimestamps(getRecordTimestamp(l), getRecordTimestamp(c))
      if (res === 'cloud_newer') { merged.push(c); cloudNewerCount += 1 }
      else if (res === 'local_newer') { merged.push(l); localNewerCount += 1 }
      else { merged.push(l); equalCount += 1 } // tie → keep local (local-first)
    }
  }

  return {
    merged,
    hydrateRecommended: cloudOnlyCount > 0 || cloudNewerCount > 0,
    localNewerCount,
    cloudNewerCount,
    cloudOnlyCount,
    localOnlyCount,
    equalCount,
  }
}
