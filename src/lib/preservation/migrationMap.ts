// ─────────────────────────────────────────────────────────────────────────────
// preservation/migrationMap — Wave 6: legacy compatibility & migration map (data)
// ─────────────────────────────────────────────────────────────────────────────
// Machine-readable catalog of every legacy → canonical compatibility path the rebuild must
// honor. For each legacy data shape it records: source/target version, the compatibility
// adapter, fallback + rollback behavior, data-loss risk, and the validation method.
//
// HARD RULE (Wave 6): NO destructive migration is allowed without a dependency mapping, a
// compatibility adapter, a tested replacement, and a rollback plan. Every row here is
// NON-destructive (`dataLossRisk: 'none'`) and read-forward only; the Wave 6 tests assert it.
//
// Pure data + pure validators. No I/O.
// ─────────────────────────────────────────────────────────────────────────────

export const MIGRATION_MAP_VERSION = 1

export type DataLossRisk = 'none' | 'low' | 'medium' | 'high'

export interface MigrationRecord {
  dataset: string                 // the legacy data shape
  sourceVersion: string           // legacy version / engine label
  targetVersion: string           // canonical target
  adapter: string                 // the compatibility adapter that reads legacy → canonical
  compatibilityBehavior: string   // what happens when legacy data is encountered
  fallbackBehavior: string        // what happens when adaptation is impossible
  rollbackBehavior: string        // how to revert safely
  dataLossRisk: DataLossRisk      // INVARIANT: must be 'none' for Wave 6 (non-destructive)
  validationMethod: string        // how the migration is validated
  destructive: false              // INVARIANT: no destructive migration in Wave 6
}

export const MIGRATION_MAP: MigrationRecord[] = [
  {
    dataset: 'legacy score result / snapshot (engine1/engine2)',
    sourceVersion: 'engine1|engine2 ScoreResult',
    targetVersion: 'MetrixProfileSnapshot',
    adapter: 'metrix/legacyAdapter.adaptLegacyScoreResult + legacyProjection',
    compatibilityBehavior: 'Legacy ScoreResult is adapted into the canonical snapshot shape on read; legacy provenance is preserved in LegacySourceMeta.',
    fallbackBehavior: 'If the shape is unrecognized, the app re-derives from stored raw answers; if none, prompts a fresh assessment.',
    rollbackBehavior: 'Legacy keys are never overwritten; the original szm_score / history rows remain intact for revert.',
    dataLossRisk: 'none',
    validationMethod: 'canonical.test.ts + legacy adapter tests',
    destructive: false,
  },
  {
    dataset: 'legacy local-storage records (szm_*)',
    sourceVersion: 'pre-Wave-1 device-local keys',
    targetVersion: 'current szm_* keys (preserved verbatim)',
    adapter: 'metrixStorage.safeJsonParse + per-module loaders',
    compatibilityBehavior: 'Malformed / missing values parse to null and degrade to safe defaults; keys are never renamed.',
    fallbackBehavior: 'Missing key → default state; module continues without throwing.',
    rollbackBehavior: 'Keys are append-only; no destructive rewrite, so prior state is recoverable.',
    dataLossRisk: 'none',
    validationMethod: 'storage-key preservation test (Wave 6) + per-module unit coverage',
    destructive: false,
  },
  {
    dataset: 'legacy profile versions',
    sourceVersion: 'rulesetVersion < current',
    targetVersion: 'current rulesetVersion snapshot',
    adapter: 'metrix/reconcile.reconcileCanonicalProfiles',
    compatibilityBehavior: 'Older profile versions are reconciled forward; the higher-quality / newer record wins deterministically.',
    fallbackBehavior: 'On conflict it keeps the most complete record and reports a ReconcileConflict for review.',
    rollbackBehavior: 'Reconciliation is non-destructive; both candidates are retained until a clean winner is persisted.',
    dataLossRisk: 'none',
    validationMethod: 'reconcile unit tests',
    destructive: false,
  },
  {
    dataset: 'legacy progress records',
    sourceVersion: 'pre-PROGRESS_SCHEMA_VERSION',
    targetVersion: 'PROGRESS_SCHEMA_VERSION (current)',
    adapter: 'metrix/progressRecord + progressSync.reconcilePriorityProgress',
    compatibilityBehavior: 'Old progress blobs are recomputed against the current priority; completed step ids are preserved by stable stepId.',
    fallbackBehavior: 'If the priority changed, progress resets per resetIfPriorityChanged but the archive is retained.',
    rollbackBehavior: 'Progress archive (getProgressArchive) preserves prior blobs for revert.',
    dataLossRisk: 'none',
    validationMethod: 'priority-progress + priority-progress-cloud tests',
    destructive: false,
  },
  {
    dataset: 'legacy recommendation records',
    sourceVersion: 'pre-Wave-5 vendor/affiliate click records',
    targetVersion: 'canonical resource recommendation + attribution',
    adapter: 'metrix/resourceRegistry (consolidation) + resourceAttribution',
    compatibilityBehavior: 'Original vendor/partner/guide ids are preserved verbatim in sourceId; recommendations re-derive from the canonical registry.',
    fallbackBehavior: 'Unknown ids are ignored safely; the recommendation adapter falls back to broadly-applicable records.',
    rollbackBehavior: 'referral_clicks remains the canonical click sink; nothing is rewritten.',
    dataLossRisk: 'none',
    validationMethod: 'wave5 + wave6 tests',
    destructive: false,
  },
  {
    dataset: 'old routes / legacy aliases',
    sourceVersion: 'prior URL structure',
    targetVersion: 'current route inventory',
    adapter: 'next.config.js redirects + ROUTE_INVENTORY (legacyAlias)',
    compatibilityBehavior: 'Legacy URLs 301/308 to canonical routes; every alias is inventoried and preserved.',
    fallbackBehavior: 'Unmapped legacy URL → standard 404 (no broken redirect loop).',
    rollbackBehavior: 'Redirects are config-only; removing a redirect reverts behavior without data change.',
    dataLossRisk: 'none',
    validationMethod: 'route-inventory preservation test (Wave 6)',
    destructive: false,
  },
  {
    dataset: 'old resource / vendor records',
    sourceVersion: 'vendorCategories / affiliates / publicResources',
    targetVersion: 'CanonicalResource + EcosystemResource',
    adapter: 'metrix/resourceRegistry + resourceEcosystem.defaultEcosystemExtension',
    compatibilityBehavior: 'Existing records are consolidated read-only into the master catalog; ids preserved; ecosystem metadata defaults to unverified (draft).',
    fallbackBehavior: 'A record missing ecosystem metadata is treated as draft → never public-eligible.',
    rollbackBehavior: 'Source registries are unchanged; the ecosystem layer is additive and removable.',
    dataLossRisk: 'none',
    validationMethod: 'wave6 verification-gating tests',
    destructive: false,
  },
  {
    dataset: 'old analytics payloads',
    sourceVersion: 'pre-Wave-5 event payloads',
    targetVersion: 'current AnalyticsEvent union',
    adapter: 'analytics.trackEvent (additive event names; old names preserved)',
    compatibilityBehavior: 'Existing event names are unchanged; new events are additive. No PII added to any payload.',
    fallbackBehavior: 'Unknown event consumers ignore extra fields; trackEvent never throws.',
    rollbackBehavior: 'Removing a new event name reverts cleanly; old names remain.',
    dataLossRisk: 'none',
    validationMethod: 'analytics-event preservation test (Wave 6)',
    destructive: false,
  },
  {
    dataset: 'old consent records',
    sourceVersion: 'prior consent flag shape',
    targetVersion: 'current host-granted consent gate',
    adapter: 'tracking.ts consent gate',
    compatibilityBehavior: 'Absent/legacy consent defaults to NOT granted (privacy-safe); analytics stay suppressed until consent is granted.',
    fallbackBehavior: 'No consent → no consent-gated analytics emitted; product still functions.',
    rollbackBehavior: 'Consent is read-only here; nothing rewritten.',
    dataLossRisk: 'none',
    validationMethod: 'wave6 privacy-safe redirect test (consent gating)',
    destructive: false,
  },
  {
    dataset: 'old exports',
    sourceVersion: 'prior export JSON shape',
    targetVersion: 'AccountDataExport (current)',
    adapter: 'accountDataPrivacy.exportAccountData',
    compatibilityBehavior: 'Export adds new datasets additively; prior fields remain readable.',
    fallbackBehavior: 'Per-table export reports honest status; a failed table does not fail the whole export.',
    rollbackBehavior: 'Export is read-only; no rollback needed.',
    dataLossRisk: 'none',
    validationMethod: 'export/deletion coverage inventory (Wave 6)',
    destructive: false,
  },
]

export interface MigrationValidation {
  ok: boolean
  destructiveMigrations: string[]   // any row marked destructive (must be empty)
  dataLossMigrations: string[]      // any row with dataLossRisk !== 'none' (must be empty)
}

/** Assert the migration map has no destructive / lossy rows. Pure; used by Wave 6 tests + CI. */
export function validateMigrationMap(map: MigrationRecord[] = MIGRATION_MAP): MigrationValidation {
  const destructiveMigrations = map.filter(m => m.destructive).map(m => m.dataset)
  const dataLossMigrations = map.filter(m => m.dataLossRisk !== 'none').map(m => m.dataset)
  return {
    ok: destructiveMigrations.length === 0 && dataLossMigrations.length === 0,
    destructiveMigrations,
    dataLossMigrations,
  }
}
