// ─────────────────────────────────────────────────────────────────────────────
// syncContracts — Cloud Sync Activation Layer contracts (Account-2A)
// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT / MODEL CODE ONLY. This module describes WHAT every syncable progress
// entity is, where it lives locally today, which future Supabase table would own it,
// and how risky it is to sync — so later phases (Account-2B onward) can wire real
// sync against a single source of truth. It performs NO network writes, reads NO
// localStorage, and is SSR/build safe (pure data + pure functions).
//
// HONESTY RULES (enforced by construction):
//   • `cloudWriteWired` is TRUE only for the two assessment/score history entities that
//     Account-2D actively syncs (assessmentHistorySync.ts → cloud_sync_assessment_history,
//     cloud_sync_score_history). Every other entity remains false (contract/model only).
//   • getSyncStatusLabel('synced_to_account') returns the label string, but that
//     label may only be SHOWN after a real, confirmed cloud write exists. Until then
//     the honest status is 'saved_on_device' → "Saved on this device".
//   • These are status/architecture labels, NOT a claim that active sync is live.
// ─────────────────────────────────────────────────────────────────────────────

// ── Status the UI may eventually surface (one per flow) ───────────────────────
export type SyncStatus =
  | 'saved_on_device'      // local only; no confirmed cloud write (today's truth)
  | 'synced_to_account'    // ONLY after a confirmed successful cloud write
  | 'sync_unavailable'     // Supabase not configured, offline, or write failed
  | 'sign_in_to_back_up'   // signed-out with local data present

// ── How a given record is currently persisted ────────────────────────────────
export type SyncStorageMode =
  | 'local_device'   // device-only (every entity today)
  | 'account_cloud'  // a confirmed cloud copy exists (future)
  | 'local_fallback' // cloud configured but this record is still local-first/pending

// ── The syncable progress entities ───────────────────────────────────────────
export type SyncEntityType =
  | 'assessment_history'
  | 'metrix_score_history'
  | 'roadmap_action_progress'
  | 'kpi_entry'
  | 'customer_feedback'
  | 'partner_interest'
  | 'growth_event'
  | 'foundation_builder_progress'
  | 'vendor_tool_tracker'
  | 'launch_readiness_progress'

// ── Sync ordering priority (when each entity should be wired) ─────────────────
export type SyncPriority = 'high' | 'medium' | 'low'

// ── Privacy risk of syncing this entity to the cloud ──────────────────────────
export type SyncPrivacyRisk = 'low' | 'moderate' | 'high'

// ── Per-entity contract ───────────────────────────────────────────────────────
export interface SyncEntityContract {
  entityType: SyncEntityType
  label: string
  owningFeature: string
  /** localStorage key today, or null if the local feature is not built yet. */
  localStorageKey: string | null
  /** The local TypeScript record/interface this entity maps from. */
  recordType: string
  /** The future Supabase table that would own this entity (NOT created yet). */
  futureCloudTable: string
  containsFreeText: boolean
  mayContainPii: boolean
  syncPriority: SyncPriority
  privacyRisk: SyncPrivacyRisk
  /** Local-first behavior that must always hold, even after cloud sync ships. */
  localFallbackRule: string
  /** Whether this flow needs a visible sync-status label in the UI. */
  syncStatusLabelNeeded: boolean
  /** Whether the LOCAL feature exists in the product today. */
  builtLocally: boolean
  /** Whether a REAL cloud write is wired. True for the Account-2D history entities; false otherwise. */
  cloudWriteWired: boolean
  /** Whether a privacy review is required before this entity may sync. */
  privacyReviewRequired: boolean
}

export type SyncEntityMap = Record<SyncEntityType, SyncEntityContract>

// ─────────────────────────────────────────────────────────────────────────────
// The contract map. Mirrors docs/ROADMAP/cloud-sync-architecture-map.md.
// futureCloudTable names match the Account-2B migration
// (supabase/migrations/002_cloud_sync_progress_records.sql), which creates the
// cloud_sync_* tables (schema + RLS only — NOT wired). The Mega-Phase 3C structured
// tables in 001 (metrix_*) are a separate, earlier schema; reconciling the two is a
// later wiring phase. NO table is created by this file.
// ─────────────────────────────────────────────────────────────────────────────
const ENTITY_CONTRACTS: SyncEntityMap = {
  assessment_history: {
    entityType: 'assessment_history',
    label: 'Assessment history',
    owningFeature: 'MetrixProfile™ / assessment (metrixStorage, metrixHistory)',
    localStorageKey: 'szm_metrix_profile',
    recordType: 'MetrixProfileSnapshot',
    futureCloudTable: 'cloud_sync_assessment_history', // created in migration 002 (schema+RLS only)
    containsFreeText: false,
    mayContainPii: false,
    syncPriority: 'high',
    privacyRisk: 'low',
    localFallbackRule: 'Saved on this device first; cloud is an additive backup.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: true, // Account-2D: assessmentHistorySync.ts writes cloud_sync_assessment_history
    privacyReviewRequired: false,
  },
  metrix_score_history: {
    entityType: 'metrix_score_history',
    label: 'MetrixScore™ history',
    owningFeature: 'MetrixScore™ history (metrixHistory, metrixStorage)',
    localStorageKey: 'szm_metrix_history',
    recordType: 'MetrixScoreSnapshot[] (+ ReassessmentEvent[])',
    futureCloudTable: 'cloud_sync_score_history', // created in migration 002 (schema+RLS only)
    containsFreeText: false,
    mayContainPii: false,
    syncPriority: 'high',
    privacyRisk: 'low',
    localFallbackRule: 'Local history stays authoritative until a confirmed cloud write.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: true, // Account-2D: assessmentHistorySync.ts writes cloud_sync_score_history
    privacyReviewRequired: false,
  },
  roadmap_action_progress: {
    entityType: 'roadmap_action_progress',
    label: 'Roadmap action progress',
    owningFeature: 'Roadmap progress (roadmapProgress)',
    localStorageKey: 'szm_path_complete',
    recordType: 'string[] (completed action ids) → ActionProgressSnapshot',
    futureCloudTable: 'cloud_sync_roadmap_action_progress', // created in migration 002 (schema+RLS only)
    containsFreeText: false,
    mayContainPii: false,
    syncPriority: 'high',
    privacyRisk: 'low',
    localFallbackRule: 'Completed ids written locally first; sync upserts by client_id.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: false,
    privacyReviewRequired: false,
  },
  kpi_entry: {
    entityType: 'kpi_entry',
    label: 'KPI entries',
    owningFeature: 'Manual KPI tracking (kpiProgress, metrixKpis)',
    localStorageKey: 'szm_metrix_history',
    recordType: 'ManualKpiSnapshot',
    futureCloudTable: 'cloud_sync_kpi_entries', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // optional `note`
    mayContainPii: false,
    syncPriority: 'high',
    privacyRisk: 'low',
    localFallbackRule: 'Only user-entered numbers + optional note; local-first.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: false,
    privacyReviewRequired: false,
  },
  customer_feedback: {
    entityType: 'customer_feedback',
    label: 'Customer feedback / proof',
    owningFeature: 'Customer proof / feedback (customerProof)',
    localStorageKey: 'szm_customer_feedback',
    recordType: 'CustomerFeedbackRecord',
    futureCloudTable: 'cloud_sync_customer_feedback', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // free-text `comment`
    mayContainPii: true, // comment may contain anything the user types
    syncPriority: 'medium',
    privacyRisk: 'moderate',
    localFallbackRule: 'Local-first; never posted publicly; consent flags travel with it.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: false,
    privacyReviewRequired: true, // free text → privacy review before any sync
  },
  partner_interest: {
    entityType: 'partner_interest',
    label: 'Partner interest',
    owningFeature: 'Partner / vendor distribution (partnerDistribution)',
    localStorageKey: 'szm_partner_interest',
    recordType: 'PartnerInterestSubmission',
    futureCloudTable: 'cloud_sync_partner_interest', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // `collaborationNote`
    mayContainPii: true, // name, company, email, website
    syncPriority: 'low', // defer: highest PII surface
    privacyRisk: 'high',
    localFallbackRule: 'Local-first; explicit consent flag required before any sync.',
    syncStatusLabelNeeded: true,
    builtLocally: true,
    cloudWriteWired: false,
    privacyReviewRequired: true, // PII + free text → privacy review mandatory
  },
  growth_event: {
    entityType: 'growth_event',
    label: 'Growth / activation events',
    owningFeature: 'Acquisition + activation analytics (growthAnalytics)',
    localStorageKey: 'szm_growth_events',
    recordType: 'GrowthActivationRecord',
    futureCloudTable: 'cloud_sync_growth_events', // created in migration 002 (schema+RLS only; non-PII)
    containsFreeText: false, // non-PII metadata only by design
    mayContainPii: false, // must STAY non-PII; no email/name/phone/free text
    syncPriority: 'medium',
    privacyRisk: 'low',
    localFallbackRule: 'Device-local; only privacy-safe, non-PII, aggregate fields may sync.',
    syncStatusLabelNeeded: false, // background analytics, not a user-facing progress flow
    builtLocally: true,
    cloudWriteWired: false,
    privacyReviewRequired: true, // analytics sync must pass a privacy/non-invasive review
  },
  foundation_builder_progress: {
    entityType: 'foundation_builder_progress',
    label: 'Foundation Builder checklist progress',
    owningFeature: 'Guided Business Foundation Builder (Product-5, future)',
    localStorageKey: null, // not built yet — design cloud-ready from day one
    recordType: 'FoundationChecklistItem (future)',
    futureCloudTable: 'cloud_sync_foundation_builder_progress', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // notes per item
    mayContainPii: false,
    syncPriority: 'high', // Product-5 must not be local-only (Quality-1 pillar 2)
    privacyRisk: 'low',
    localFallbackRule: 'Device-local fallback allowed, but NOT the final destination.',
    syncStatusLabelNeeded: true,
    builtLocally: false,
    cloudWriteWired: false,
    privacyReviewRequired: false,
  },
  vendor_tool_tracker: {
    entityType: 'vendor_tool_tracker',
    label: 'Vendor / tool tracker',
    owningFeature: 'Foundation Builder vendor/tool tracker (future)',
    localStorageKey: null, // not built yet
    recordType: 'VendorToolItem (future)',
    futureCloudTable: 'cloud_sync_vendor_tool_tracker', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // notes / account references
    mayContainPii: false, // no credentials/secrets ever stored or synced
    syncPriority: 'medium',
    privacyRisk: 'low',
    localFallbackRule: 'Local-first; never store secrets/credentials, only references.',
    syncStatusLabelNeeded: true,
    builtLocally: false,
    cloudWriteWired: false,
    privacyReviewRequired: false,
  },
  launch_readiness_progress: {
    entityType: 'launch_readiness_progress',
    label: 'Launch readiness progress',
    owningFeature: 'Foundation Builder launch readiness (future)',
    localStorageKey: null, // not built yet
    recordType: 'LaunchReadinessItem (future)',
    futureCloudTable: 'cloud_sync_launch_readiness_progress', // created in migration 002 (schema+RLS only)
    containsFreeText: true, // notes
    mayContainPii: false,
    syncPriority: 'medium',
    privacyRisk: 'low',
    localFallbackRule: 'Local-first; progress should back up to the account when wired.',
    syncStatusLabelNeeded: true,
    builtLocally: false,
    cloudWriteWired: false,
    privacyReviewRequired: false,
  },
}

// Stable display order for docs/UI readiness views.
const ENTITY_ORDER: SyncEntityType[] = [
  'assessment_history',
  'metrix_score_history',
  'roadmap_action_progress',
  'kpi_entry',
  'customer_feedback',
  'partner_interest',
  'growth_event',
  'foundation_builder_progress',
  'vendor_tool_tracker',
  'launch_readiness_progress',
]

// ── Label maps ────────────────────────────────────────────────────────────────
const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  saved_on_device: 'Saved on this device',
  synced_to_account: 'Synced to your account',
  sync_unavailable: 'Sync unavailable',
  sign_in_to_back_up: 'Sign in to back up progress',
}

const SYNC_STORAGE_MODE_LABELS: Record<SyncStorageMode, string> = {
  local_device: 'Saved on this device',
  account_cloud: 'Synced to your account',
  local_fallback: 'Saved on this device (cloud backup pending)',
}

// ── Public accessors (pure; no side effects) ──────────────────────────────────

/** Every sync entity contract, in stable display order. */
export function getSyncEntityContracts(): SyncEntityContract[] {
  return ENTITY_ORDER.map(type => ENTITY_CONTRACTS[type])
}

/**
 * The honest label for a sync status. NOTE: 'synced_to_account' may only be shown
 * after a real confirmed cloud write — this function returning the string is NOT a
 * claim that sync is live.
 */
export function getSyncStatusLabel(status: SyncStatus): string {
  return SYNC_STATUS_LABELS[status]
}

/** The label for a storage mode. */
export function getSyncStorageModeLabel(mode: SyncStorageMode): string {
  return SYNC_STORAGE_MODE_LABELS[mode]
}

// ── Presentational helpers for the Sync Status UI (Account-2C) ─────────────────
// Pure string maps — no network, no localStorage, no Supabase. These describe a
// status that is PASSED IN; they never infer or claim that sync is live.

export type SyncStatusTone = 'neutral' | 'positive' | 'warning' | 'prompt'

const SYNC_STATUS_DESCRIPTIONS: Record<SyncStatus, string> = {
  saved_on_device: 'Stored in this browser on this device. Clearing browser data could remove it.',
  synced_to_account: 'Backed up to your account and available when you sign in.',
  sync_unavailable: 'Cloud backup is not available right now — your progress is still saved on this device.',
  sign_in_to_back_up: 'Saved on this device. Sign in later to back it up to your account.',
}

// Optional, non-actionable helper text. The badge renders this as plain text — it does
// NOT wire a sign-in flow (none is added in this phase).
const SYNC_STATUS_ACTION_LABELS: Record<SyncStatus, string | null> = {
  saved_on_device: null,
  synced_to_account: null,
  sync_unavailable: null,
  sign_in_to_back_up: 'Sign in to back up progress',
}

const SYNC_STATUS_TONES: Record<SyncStatus, SyncStatusTone> = {
  saved_on_device: 'neutral',
  synced_to_account: 'positive',
  sync_unavailable: 'warning',
  sign_in_to_back_up: 'prompt',
}

/** A short, honest description of where progress lives for a given status. */
export function getSyncStatusDescription(status: SyncStatus): string {
  return SYNC_STATUS_DESCRIPTIONS[status]
}

/** Optional helper/CTA text for a status (null when none). Non-actionable in 2C. */
export function getSyncStatusActionLabel(status: SyncStatus): string | null {
  return SYNC_STATUS_ACTION_LABELS[status]
}

/** A visual tone hint for the status (styling only). */
export function getSyncStatusTone(status: SyncStatus): SyncStatusTone {
  return SYNC_STATUS_TONES[status]
}

/** The contract for a single entity type. */
export function getSyncEntityByType(type: SyncEntityType): SyncEntityContract {
  return ENTITY_CONTRACTS[type]
}

export interface SyncReadinessSummary {
  totalEntities: number
  builtLocally: number
  cloudWriteWired: number            // count of entities with a wired cloud write (2 as of Account-2D)
  requiringPrivacyReview: number
  byPriority: Record<SyncPriority, number>
  byPrivacyRisk: Record<SyncPrivacyRisk, number>
  /** True only when at least one entity has a real wired cloud write. */
  anyCloudSyncLive: boolean
  /** Honest one-line state for docs/dev surfaces. */
  statusNote: string
}

/**
 * A readiness snapshot across all entities. Honest by construction: cloudWriteWired
 * is 0 and anyCloudSyncLive is false until a later phase wires real writes.
 */
export function getSyncReadinessSummary(): SyncReadinessSummary {
  const contracts = getSyncEntityContracts()
  const byPriority: Record<SyncPriority, number> = { high: 0, medium: 0, low: 0 }
  const byPrivacyRisk: Record<SyncPrivacyRisk, number> = { low: 0, moderate: 0, high: 0 }

  let builtLocally = 0
  let cloudWriteWired = 0
  let requiringPrivacyReview = 0

  for (const c of contracts) {
    byPriority[c.syncPriority] += 1
    byPrivacyRisk[c.privacyRisk] += 1
    if (c.builtLocally) builtLocally += 1
    if (c.cloudWriteWired) cloudWriteWired += 1
    if (c.privacyReviewRequired) requiringPrivacyReview += 1
  }

  const anyCloudSyncLive = cloudWriteWired > 0
  return {
    totalEntities: contracts.length,
    builtLocally,
    cloudWriteWired,
    requiringPrivacyReview,
    byPriority,
    byPrivacyRisk,
    anyCloudSyncLive,
    statusNote: anyCloudSyncLive
      ? 'Some entities have wired cloud sync.'
      : 'Architecture/contracts only — no cloud sync is wired yet (Account-2A).',
  }
}
