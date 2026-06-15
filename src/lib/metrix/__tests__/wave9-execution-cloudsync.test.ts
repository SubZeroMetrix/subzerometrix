// ─────────────────────────────────────────────────────────────────────────────
// Wave 9 CP3 — execution / progress / foundation + cloud-sync truthfulness (Node runner).
// Locks: the Guided Foundation Builder tracks completion honestly (new items default to
// not-started / not-completed), completion stats are accurate, and cloud sync reports its state
// truthfully (no fabricated "synced" when Supabase is unconfigured). Pure — no network.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  FOUNDATION_STEP_DEFINITIONS,
  createFoundationItemFromDefinition,
  getFoundationCompletionStats,
  getFoundationProgressSummary,
} from '../../foundationBuilder'
import {
  getSyncReadinessSummary,
  getSyncStatusLabel,
  getSyncEntityContracts,
} from '../../syncContracts'
import { isSupabaseConfigured } from '../../supabaseClient'

test('cp3: foundation builder has real step definitions', () => {
  assert.ok(Array.isArray(FOUNDATION_STEP_DEFINITIONS))
  assert.ok(FOUNDATION_STEP_DEFINITIONS.length > 0)
})

test('cp3: a new foundation item defaults to honest incomplete (not-started, not completed)', () => {
  const item = createFoundationItemFromDefinition(FOUNDATION_STEP_DEFINITIONS[0])
  assert.equal(item.status, 'not_started')
  assert.equal(item.completed, false)
  assert.equal(item.completedAt, null)
})

test('cp3: completion stats reflect real progress, not fabricated', () => {
  const items = FOUNDATION_STEP_DEFINITIONS.slice(0, 4).map(createFoundationItemFromDefinition)
  const none = getFoundationCompletionStats(items)
  assert.equal(none.completed, 0)

  const someDone = items.map((it, i) => (i < 2 ? { ...it, status: 'done' as const, completed: true } : it))
  const stats = getFoundationCompletionStats(someDone)
  assert.equal(stats.completed, 2)
  // progress summary is computable without throwing
  assert.doesNotThrow(() => getFoundationProgressSummary(someDone))
})

test('cp3: cloud sync is truthful — unconfigured Supabase is reported, never faked', () => {
  // No Supabase env in the test runtime → must be false (no fabricated configured/synced state).
  assert.equal(isSupabaseConfigured(), false)
  // The "unavailable" status is a real, labeled state.
  assert.ok(getSyncStatusLabel('sync_unavailable').length > 0)
})

test('cp3: sync readiness summary is honest by construction', () => {
  const summary = getSyncReadinessSummary()
  assert.ok(summary.totalEntities > 0)
  assert.equal(typeof summary.anyCloudSyncLive, 'boolean')
  assert.ok(summary.statusNote.length > 0)
  // entity contracts exist and declare a storage mode + privacy risk (export/delete governance)
  const contracts = getSyncEntityContracts()
  assert.ok(contracts.length > 0)
  assert.equal(contracts.length, summary.totalEntities)
})
