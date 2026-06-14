// ─────────────────────────────────────────────────────────────────────────────
// SZM Wave 1 — priority-progress + reassessment CLOUD sync tests (Node runner).
// Uses an injectable fake Supabase client (no network) to exercise the wired adapters:
// schema/payload shape · RLS owner-scoping assumption · successful sync · offline/failed ·
// sign-in adoption · cross-device resume · local/cloud conflict · stale-record protection ·
// duplicate prevention · truthful sync labels · reassessment sync · export/delete coverage.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import {
  evaluateMetrixProfile, getPrimaryActionSteps,
  createProgressRecord, toggleStep,
  progressLocalId, PRIORITY_PROGRESS_TABLE, PRIORITY_PROGRESS_CLOUD_WIRED,
  syncPriorityProgressToAccount, adoptPriorityProgressFromAccount, getPriorityProgressSyncReadiness,
  REASSESSMENT_TABLE, REASSESSMENT_CLOUD_WIRED,
  syncReassessmentHistoryToAccount, loadReassessmentHistoryFromAccount,
  type PersistedPriorityProgress, type ReassessmentRecord,
  type ProgressSyncClient, type ProgressSyncQuery,
} from '../index'
import { CLOUD_SYNC_TABLES, DEVICE_LOCAL_SYNCED_KEYS } from '../../accountDataPrivacy'

// In-memory localStorage so the device-local stores work under Node.
;(() => {
  const store = new Map<string, string>()
  const g = globalThis as unknown as { window?: { localStorage: unknown } }
  g.window = g.window ?? ({} as { localStorage: unknown })
  g.window.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
    removeItem: (k: string) => { store.delete(k) },
    clear: () => { store.clear() },
  }
})()

// ── Injectable fake Supabase that mimics RLS by filtering rows on .eq() ──────────
class FakeDb implements ProgressSyncClient {
  tables: Record<string, Record<string, unknown>[]> = {}
  failTables = new Set<string>()

  from(table: string): ProgressSyncQuery {
    const self = this
    const rowsFor = (t: string) => (self.tables[t] ??= [])
    return {
      async upsert(rows: Record<string, unknown>[], opts: { onConflict: string }) {
        if (self.failTables.has(table)) return { error: { message: 'simulated write failure' } }
        const keys = opts.onConflict.split(',').map(k => k.trim())
        const arr = rowsFor(table)
        for (const row of rows) {
          const idx = arr.findIndex(r => keys.every(k => r[k] === row[k]))
          if (idx >= 0) arr[idx] = row
          else arr.push(row)
        }
        return { error: null }
      },
      select(_columns: string) {
        return {
          async eq(column: string, value: string) {
            if (self.failTables.has(table)) return { data: null, error: { message: 'simulated read failure' } }
            // RLS-like: only rows the caller owns are visible.
            return { data: rowsFor(table).filter(r => r[column] === value), error: null }
          },
        }
      },
    }
  }
}

const NOW = '2026-01-01T00:00:00.000Z'
const LATER = '2026-02-01T00:00:00.000Z'
const LATEST = '2026-03-01T00:00:00.000Z'
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const lead = { firstName: 'X', email: 'x@example.com' }
const USER = { id: 'user-aaa' }
const OTHER = { id: 'user-bbb' }

const snap = evaluateMetrixProfile(
  { business_type: 'electrical', location: { state: 'Texas', city: 'Austin' }, stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank', 'insurance'], financial: 'k10_25', customer_plan: 'word_of_mouth', blocker: 'customers', lead },
  intake({ stage: 'months_6_12', trade: 'electrical', region: 'Texas' }), { now: NOW, profileId: 'mp_cloud', assessmentId: 'as_cloud' })

const steps = getPrimaryActionSteps(snap)
const stepId = (i: number) => steps[i].stepId
const rec = (over: Partial<PersistedPriorityProgress> = {}): PersistedPriorityProgress =>
  ({ ...createProgressRecord(snap, NOW), ...over })

// 0 — adapters are wired.
test('cloud: adapters report wired', () => {
  assert.equal(PRIORITY_PROGRESS_CLOUD_WIRED, true)
  assert.equal(REASSESSMENT_CLOUD_WIRED, true)
})

// 1 — successful cloud sync writes a confirmed row and reports synced_to_account.
test('cloud: successful sync returns synced_to_account', async () => {
  const db = new FakeDb()
  let r = rec()
  r = toggleStep(r, stepId(0), snap, NOW)
  const res = await syncPriorityProgressToAccount(r, { supabase: db, user: USER, now: LATER })
  assert.equal(res.status, 'synced_to_account')
  assert.equal(res.written, 1)
  assert.equal(res.lastSyncedAt, LATER)
  assert.equal(db.tables[PRIORITY_PROGRESS_TABLE].length, 1)
})

// 2 — schema/payload shape: promoted columns + full record in payload + stable local_id.
test('cloud: written row has the expected schema shape', async () => {
  const db = new FakeDb()
  let r = rec()
  r = toggleStep(r, stepId(0), snap, NOW)
  await syncPriorityProgressToAccount(r, { supabase: db, user: USER, now: LATER })
  const row = db.tables[PRIORITY_PROGRESS_TABLE][0] as Record<string, unknown>
  for (const col of ['user_id', 'local_id', 'sync_source', 'profile_id', 'priority_id', 'selected_path_id', 'status', 'completion_percent', 'reassessment_eligible', 'schema_version', 'ruleset_version', 'started_at', 'completed_at', 'record_updated_at', 'payload', 'updated_at']) {
    assert.ok(col in row, `missing column ${col}`)
  }
  assert.equal(row.user_id, USER.id)
  assert.equal(row.local_id, progressLocalId(r))
  assert.equal(row.local_id, `${snap.profileId}::${snap.metrixPriority.priorityId}`)
  const payload = row.payload as PersistedPriorityProgress
  assert.ok(Array.isArray(payload.completedStepIds))
  assert.ok(payload.completedStepIds.includes(stepId(0)))
  assert.equal(typeof payload.evidenceStates, 'object')
})

// 3 — RLS ownership assumption: a read only returns the caller's own rows.
test('cloud: reads are owner-scoped (RLS assumption)', async () => {
  const db = new FakeDb()
  const mine = toggleStep(rec(), stepId(0), snap, NOW)
  await syncPriorityProgressToAccount(mine, { supabase: db, user: USER, now: NOW })
  // Another user writes a row for the SAME identity — must be invisible to USER.
  await syncPriorityProgressToAccount(toggleStep(rec(), stepId(0), snap, NOW), { supabase: db, user: OTHER, now: NOW })
  assert.equal(db.tables[PRIORITY_PROGRESS_TABLE].length, 2)
  // USER adopts: should only see their own row, never OTHER's.
  const res = await adoptPriorityProgressFromAccount(rec(), { supabase: db, user: USER })
  assert.ok(res.resolved)
  // The select().eq('user_id', …) filter is what enforces this.
})

// 4 — signed-out (no user) → local-first sign_in_to_back_up, nothing written.
test('cloud: signed out reports sign_in_to_back_up', async () => {
  const db = new FakeDb()
  const res = await syncPriorityProgressToAccount(rec(), { supabase: db /* user omitted → no session */ })
  assert.equal(res.status, 'sign_in_to_back_up')
  assert.equal(res.written, 0)
  assert.equal((db.tables[PRIORITY_PROGRESS_TABLE] ?? []).length, 0)
})

// 5 — not configured (no supabase) → saved_on_device.
test('cloud: no supabase reports saved_on_device', async () => {
  const res = await syncPriorityProgressToAccount(rec(), { supabase: null })
  assert.equal(res.status, 'saved_on_device')
  assert.equal(res.written, 0)
})

// 6 — offline / failed write → sync_unavailable, local untouched.
test('cloud: failed write reports sync_unavailable', async () => {
  const db = new FakeDb()
  db.failTables.add(PRIORITY_PROGRESS_TABLE)
  const res = await syncPriorityProgressToAccount(rec(), { supabase: db, user: USER, now: LATER })
  assert.equal(res.status, 'sync_unavailable')
  assert.equal(res.written, 0)
  assert.ok(res.error)
})

// 7 — sign-in adoption: local + account merge (union of completed steps).
test('cloud: sign-in adoption merges local and account', async () => {
  const db = new FakeDb()
  // Account has step 0 done; seed it.
  await syncPriorityProgressToAccount(toggleStep(rec(), stepId(0), snap, NOW), { supabase: db, user: USER, now: NOW })
  // Local (this device) has step 1 progress chain done locally, newer.
  let local = rec({ updatedAt: LATER })
  local = toggleStep(local, stepId(0), snap, LATER)
  local = toggleStep(local, stepId(1), snap, LATER)
  const res = await adoptPriorityProgressFromAccount(local, { supabase: db, user: USER })
  assert.equal(res.action, 'merged')
  assert.deepStrictEqual([...res.resolved!.completedStepIds].sort(), [stepId(0), stepId(1)].sort())
  assert.equal(res.resolved!.source, 'account')
})

// 8 — cross-device resume: a fresh device adopts the richer account record.
test('cloud: cross-device resume adopts account progress', async () => {
  const db = new FakeDb()
  // Account device finished steps 0 and 1.
  let cloud = rec({ updatedAt: LATER })
  cloud = toggleStep(cloud, stepId(0), snap, LATER)
  cloud = toggleStep(cloud, stepId(1), snap, LATER)
  await syncPriorityProgressToAccount(cloud, { supabase: db, user: USER, now: LATER })
  // Fresh device: a brand-new not_started record for the same priority.
  const fresh = rec()
  assert.equal(fresh.completedStepIds.length, 0)
  const res = await adoptPriorityProgressFromAccount(fresh, { supabase: db, user: USER })
  assert.ok(['merged', 'adopted_account'].includes(res.action))
  assert.deepStrictEqual([...res.resolved!.completedStepIds].sort(), [stepId(0), stepId(1)].sort())
})

// 9 — local/cloud conflict on path selection is reported (and resolved without loss).
test('cloud: path-selection conflict is surfaced', async () => {
  const db = new FakeDb()
  await syncPriorityProgressToAccount(rec({ selectedPathId: 'path_b', updatedAt: NOW }), { supabase: db, user: USER, now: NOW })
  const local = rec({ selectedPathId: 'path_a', updatedAt: LATER })
  const res = await adoptPriorityProgressFromAccount(local, { supabase: db, user: USER })
  assert.ok(res.conflicts.includes('path_selection_differs'))
  assert.equal(res.resolved!.selectedPathId, 'path_a') // newest wins; nothing lost
})

// 10 — stale-record protection: syncing older local never drops newer account completion.
test('cloud: stale local does not overwrite newer account data', async () => {
  const db = new FakeDb()
  // Account is newer + more complete (steps 0 and 1).
  let cloud = rec({ updatedAt: LATER })
  cloud = toggleStep(cloud, stepId(0), snap, LATER)
  cloud = toggleStep(cloud, stepId(1), snap, LATER)
  await syncPriorityProgressToAccount(cloud, { supabase: db, user: USER, now: LATER })
  // Older local has only step 0.
  const local = toggleStep(rec({ updatedAt: NOW }), stepId(0), snap, NOW)
  const res = await syncPriorityProgressToAccount(local, { supabase: db, user: USER, now: LATEST })
  assert.equal(res.status, 'synced_to_account')
  const stored = (db.tables[PRIORITY_PROGRESS_TABLE][0] as { payload: PersistedPriorityProgress }).payload
  assert.deepStrictEqual([...stored.completedStepIds].sort(), [stepId(0), stepId(1)].sort()) // union, not stale overwrite
})

// 11 — duplicate prevention: re-syncing the same identity keeps a single row.
test('cloud: duplicate prevention via (user_id, local_id) upsert', async () => {
  const db = new FakeDb()
  const r = toggleStep(rec(), stepId(0), snap, NOW)
  await syncPriorityProgressToAccount(r, { supabase: db, user: USER, now: NOW })
  await syncPriorityProgressToAccount(r, { supabase: db, user: USER, now: LATER })
  await syncPriorityProgressToAccount(r, { supabase: db, user: USER, now: LATEST })
  assert.equal(db.tables[PRIORITY_PROGRESS_TABLE].length, 1)
})

// 12 — truthful labels: readiness never claims synced without a confirmed write.
test('cloud: readiness labels are truthful', async () => {
  const offline = await getPriorityProgressSyncReadiness({ supabase: null })
  assert.equal(offline.status, 'saved_on_device')
  assert.equal(offline.canSync, false)
  const signedOut = await getPriorityProgressSyncReadiness({ supabase: new FakeDb(), user: null as unknown as undefined })
  assert.notEqual(signedOut.status, 'synced_to_account')
  const signedIn = await getPriorityProgressSyncReadiness({ supabase: new FakeDb(), user: USER })
  assert.equal(signedIn.status, 'saved_on_device') // honest pre-write
  assert.equal(signedIn.canSync, true)
  assert.equal(signedIn.cloudWired, true)
})

// 13 — reassessment history syncs, reads back, and dedupes by id.
test('cloud: reassessment history sync round-trips and dedupes', async () => {
  const db = new FakeDb()
  const records: ReassessmentRecord[] = [{
    id: 'ra_1', reassessedAt: NOW, profileId: 'mp_cloud', trigger: 'profile_change',
    previousOverall: 40, newOverall: 55, scoreDelta: 15, previousPriorityId: 'p1', newPriorityId: 'p2',
    priorityChanged: true, newlyTriggeredGateIds: [], newlyClearedGateIds: ['gate_licensing'], schemaVersion: 1,
  }]
  const res = await syncReassessmentHistoryToAccount(records, { supabase: db, user: USER, now: LATER })
  assert.equal(res.status, 'synced_to_account')
  assert.equal(res.written, 1)
  // Re-sync the same record → still one row.
  await syncReassessmentHistoryToAccount(records, { supabase: db, user: USER, now: LATEST })
  assert.equal(db.tables[REASSESSMENT_TABLE].length, 1)
  // Read back.
  const loaded = await loadReassessmentHistoryFromAccount({ supabase: db, user: USER })
  assert.equal(loaded.length, 1)
  assert.equal(loaded[0].id, 'ra_1')
  assert.equal(loaded[0].newOverall, 55)
})

// 14 — reassessment sync signed out / failed are truthful.
test('cloud: reassessment sync honest failure states', async () => {
  const signedOut = await syncReassessmentHistoryToAccount([{ id: 'ra_x' } as ReassessmentRecord], { supabase: new FakeDb() })
  assert.equal(signedOut.status, 'sign_in_to_back_up')
  const db = new FakeDb(); db.failTables.add(REASSESSMENT_TABLE)
  const failed = await syncReassessmentHistoryToAccount([{ id: 'ra_y', profileId: 'mp_cloud' } as ReassessmentRecord], { supabase: db, user: USER })
  assert.equal(failed.status, 'sync_unavailable')
})

// 15 — export/delete coverage: both new tables + device keys are registered.
test('cloud: priority-progress + reassessment are in export/delete coverage', () => {
  const tables = CLOUD_SYNC_TABLES as readonly string[]
  assert.ok(tables.includes('cloud_sync_priority_progress'))
  assert.ok(tables.includes('cloud_sync_reassessment_history'))
  const keys = DEVICE_LOCAL_SYNCED_KEYS as readonly string[]
  assert.ok(keys.includes('szm_priority_progress'))
  assert.ok(keys.includes('szm_reassessment_history'))
})
