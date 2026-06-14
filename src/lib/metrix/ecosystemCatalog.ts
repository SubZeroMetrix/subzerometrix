// ─────────────────────────────────────────────────────────────────────────────
// metrix/ecosystemCatalog — Wave 6: the PUBLISHED master-ecosystem catalog (data)
// ─────────────────────────────────────────────────────────────────────────────
// The single source for records that have been verified WITH EVIDENCE and may surface on
// the public ecosystem (directory / recommendations / tracked redirects).
//
// It is intentionally EMPTY at Wave 6 close. No provider may be published until it is
// verified with evidence (verificationStatus === 'verified' + a reviewer + notes + a
// reviewed date). Curating the first launch set (~50–100 records) is a deliberate Wave 7
// data task, not a Wave 6 code task. This empty default is what keeps the public surface
// off by construction even when the feature flag is flipped on.
// ─────────────────────────────────────────────────────────────────────────────

import type { EcosystemResource } from './resourceEcosystem'
import { PUBLISHED_LAUNCH_CATALOG } from './publishedLaunchCatalog'

// Wave 7: the published catalog is the activated educational launch set — the 88 technically-
// verified ('live_link_confirmed', active, evidence-backed) educational listings generated in
// publishedLaunchCatalog.ts. The 20 held records are excluded. Public surfaces remain flag-gated
// (public_resource_directory / tracked_resource_redirects default OFF) until controlled activation.
export const PUBLISHED_ECOSYSTEM_CATALOG: EcosystemResource[] = PUBLISHED_LAUNCH_CATALOG

/** The records eligible for the public ecosystem (directory / recommendations / tracked redirects). */
export function getPublishedEcosystemCatalog(): EcosystemResource[] {
  return PUBLISHED_ECOSYSTEM_CATALOG
}
