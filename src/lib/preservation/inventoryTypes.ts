// ─────────────────────────────────────────────────────────────────────────────
// preservation/inventoryTypes — Wave 6: machine-readable preservation model (types)
// ─────────────────────────────────────────────────────────────────────────────
// Pure types for the Wave 6 preservation inventory. This is a CATALOG of what must be
// carried forward unchanged into the full-site rebuild (Wave 7+): routes, canonical IDs,
// storage keys, cloud tables, analytics events, SEO surfaces, and export/deletion coverage.
//
// It is documentation-as-data: no logic, no React/Next/Supabase imports. The companion
// `inventory.ts` instantiates these shapes; `wave6` tests assert completeness + uniqueness
// so a future rebuild that silently drops a route, ID, key, table, or event fails CI.
// ─────────────────────────────────────────────────────────────────────────────

export const PRESERVATION_INVENTORY_VERSION = 1

// ── Routes ─────────────────────────────────────────────────────────────────────
export type RouteKind =
  | 'public'        // marketing / content, indexable
  | 'authenticated' // requires a signed-in account (gated client-side today)
  | 'results'       // assessment results surface
  | 'dashboard'     // progress / roadmap surface
  | 'content'       // learn / trade / state / SEO content
  | 'api'           // /api/* route handler
  | 'system'        // robots / sitemap / llms.txt / manifest

export type RouteShell =
  | 'public'        // shared public header/footer
  | 'dashboard'     // authenticated dashboard shell
  | 'results'       // results shell
  | 'content'       // content/learn shell
  | 'none'          // API / system (no visual shell)

export interface RouteRecord {
  path: string                 // canonical route path (with [param] placeholders)
  kind: RouteKind
  shell: RouteShell
  dynamicParams: string[]      // dynamic segment names ([] when static)
  legacyAlias: boolean         // true when this is a preserved legacy alias / redirect
  preserve: true               // every inventoried route MUST be preserved
  notes?: string
}

// ── Canonical IDs ──────────────────────────────────────────────────────────────
export type CanonicalIdKind =
  | 'profile' | 'assessment' | 'score' | 'priority' | 'gate' | 'path' | 'action'
  | 'step' | 'question' | 'trade' | 'state' | 'resource' | 'vendor' | 'referral'
  | 'partner' | 'analytics_event' | 'consent_record'

export interface CanonicalIdRecord {
  kind: CanonicalIdKind
  pattern: string              // human-readable id shape, e.g. `mp_<trade>_<state>` or `${source}:${sourceId}`
  source: string               // file that owns / mints the id
  example: string
  stable: true                 // every inventoried id kind MUST remain stable
  notes?: string
}

// ── Storage & persistence ────────────────────────────────────────────────────────
export type StorageScope = 'local' | 'session' | 'cookie'

export interface StorageKeyRecord {
  key: string                  // exact storage key (preserved verbatim)
  scope: StorageScope
  owner: string                // module responsible for read/write
  cloudTable: string | null    // the cloud_sync_* table it reconciles with (null = device-only)
  preserve: true
}

export interface CloudTableRecord {
  table: string                // exact Supabase table name
  migration: string            // migration file/number that created it
  localKey: string | null      // the device-local key it mirrors (null = cloud-only)
  rls: 'owner_only'            // auth.uid() = user_id (the only policy used)
  exportCovered: boolean       // included in account export
  deleteCovered: boolean       // included in account deletion
}

// ── Analytics & consent ──────────────────────────────────────────────────────────
export type AnalyticsCategory =
  | 'acquisition' | 'activation' | 'progress' | 'resource'
  | 'referral' | 'feedback' | 'report'

export interface AnalyticsEventRecord {
  name: string                 // exact event name (matches AnalyticsEvent union)
  category: AnalyticsCategory
  consentGated: boolean        // true = emitted only when host consent is granted
  carriesPii: false            // INVARIANT: no analytics event may carry PII
  preserve: true
}

// ── SEO & discovery ───────────────────────────────────────────────────────────────
export type SeoSurfaceKind =
  | 'metadata' | 'open_graph' | 'structured_data' | 'sitemap' | 'robots'
  | 'llms_txt' | 'canonical' | 'redirect' | 'spanish_discovery'

export interface SeoSurfaceRecord {
  kind: SeoSurfaceKind
  source: string               // file that produces it
  preserve: true
  notes?: string
}

// ── Export / deletion ─────────────────────────────────────────────────────────────
export interface ExportDeletionRecord {
  dataset: string              // human label
  exportSource: string         // where export is produced
  deletionSource: string       // where deletion is performed
  cloudCovered: boolean
  localCovered: boolean
}

// ── The full inventory ─────────────────────────────────────────────────────────────
export interface PreservationInventory {
  version: number
  routes: RouteRecord[]
  canonicalIds: CanonicalIdRecord[]
  storageKeys: StorageKeyRecord[]
  cloudTables: CloudTableRecord[]
  analyticsEvents: AnalyticsEventRecord[]
  seoSurfaces: SeoSurfaceRecord[]
  exportDeletion: ExportDeletionRecord[]
}
