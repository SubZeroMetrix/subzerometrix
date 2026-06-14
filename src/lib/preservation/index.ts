// ─────────────────────────────────────────────────────────────────────────────
// preservation — Wave 6: preservation inventory public API
// ─────────────────────────────────────────────────────────────────────────────
// The machine-readable contract for what Waves 1–5 expose and the full-site rebuild
// must carry forward unchanged. Read-only data + pure validators; no engine, no I/O.
// ─────────────────────────────────────────────────────────────────────────────

export * from './inventoryTypes'
export {
  ROUTE_INVENTORY, CANONICAL_ID_INVENTORY, STORAGE_KEY_INVENTORY, CLOUD_TABLE_INVENTORY,
  ANALYTICS_EVENT_INVENTORY, SEO_SURFACE_INVENTORY, EXPORT_DELETION_INVENTORY,
  PRESERVATION_INVENTORY, validateInventory,
  type InventoryValidation,
} from './inventory'
export {
  MIGRATION_MAP_VERSION, MIGRATION_MAP, validateMigrationMap,
  type MigrationRecord, type DataLossRisk, type MigrationValidation,
} from './migrationMap'
