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

// EMPTY by design — see the file header. Append only verified, evidence-backed records.
export const PUBLISHED_ECOSYSTEM_CATALOG: EcosystemResource[] = []

/** The records currently eligible for the public ecosystem. Empty until Wave 7 verification. */
export function getPublishedEcosystemCatalog(): EcosystemResource[] {
  return PUBLISHED_ECOSYSTEM_CATALOG
}
