// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingSources — Wave 4 authoritative-source provenance registry (pure)
// ─────────────────────────────────────────────────────────────────────────────
// The ONE provenance registry for licensing/jurisdiction sources. It is built deterministically
// from the repository's EXISTING authoritative licensing data (src/lib/tradeData.ts
// `licenseRequirements`) — the boards, official URLs, and notes that were already curated from
// primary state authorities. This wave does NOT invent new licensing requirements or pull from
// blogs / vendor pages / lead-gen sites; it wraps the existing official references with a
// provenance + freshness envelope (source type, jurisdiction level, reviewed/next-review dates,
// applicability, stale flag, correction status).
//
// One LicensingSource per (launch trade × launch state) = 60 records, mirroring the 60 pathways.
// ─────────────────────────────────────────────────────────────────────────────

import { TRADE_CONFIGS, type LicenseRequirement } from '../tradeData'
import { CANONICAL_TRADE_IDS, type CanonicalTradeId } from './trades'
import { resolveState } from './states'
import {
  LICENSING_REVIEWED_DATE, LICENSING_FRESHNESS_WINDOW_DAYS,
  type CanonicalStateId, type LicensingSource, type SourceType, type JurisdictionLevel,
} from './licensingTypes'
import { computeNextReviewDate } from './sourceFreshness'

// Classify a raw authoritative reference into a provenance source type (deterministic, from the
// existing board/notes text — never fabricated). Order matters: local/none signals win first.
function classifySourceType(board: string, notes: string): SourceType {
  const b = board.toLowerCase()
  const n = notes.toLowerCase()
  const text = `${b} ${n}`
  if (/\bsos\b|secretary of state|division of corporations|corporation commission|sunbiz/.test(text)) {
    return 'secretary_of_state'
  }
  if (/no state|no statewide|no gc|local jurisdiction|local requirement|local level|local electrical/.test(b)
    || (/\bonly\b/.test(b) && /local/.test(b))) {
    return 'local_jurisdiction'
  }
  if (/agriculture|pesticide|pest management/.test(text)) return 'state_agency'
  if (/board|tdlr|roc|registrar|dora|ocilb|nclbgc|lbgc|hvacr|examiners/.test(b)) return 'state_board'
  if (/dbpr|department|division|registrar/.test(b)) return 'state_agency'
  return 'state_agency'
}

function classifyJurisdictionLevel(sourceType: SourceType, notes: string): JurisdictionLevel {
  if (sourceType === 'local_jurisdiction') return 'local'
  if (sourceType === 'secretary_of_state') return 'state'
  // A state-level authority whose notes still defer some scope to local rules → mixed.
  if (/local|county|city|jurisdiction/i.test(notes)) return 'mixed'
  return 'state'
}

function buildSource(
  tradeId: CanonicalTradeId, stateId: CanonicalStateId, req: LicenseRequirement,
): LicensingSource {
  const sourceType = classifySourceType(req.board, req.notes)
  const jurisdictionLevel = classifyJurisdictionLevel(sourceType, req.notes)
  const reviewedDate = LICENSING_REVIEWED_DATE
  const window = LICENSING_FRESHNESS_WINDOW_DAYS
  return {
    id: `src_${tradeId}_${stateId}`,
    authorityName: req.board,
    title: `${TRADE_CONFIGS[tradeId]?.tradeName ?? tradeId} licensing — ${req.state}`,
    url: req.url,
    sourceType,
    jurisdictionLevel,
    reviewedDate,
    freshnessWindowDays: window,
    nextReviewDate: computeNextReviewDate(reviewedDate, window),
    tradeApplicability: [tradeId],
    stateApplicability: [stateId],
    workScopeApplicability: [],
    notes: req.notes,
    stale: false,
    correctionStatus: 'none',
  }
}

// Build the 60-record registry once, keyed `src_<trade>_<state>`. Only launch states are kept
// (all existing licenseRequirements already target the six launch states).
export const LICENSING_SOURCES: Record<string, LicensingSource> = (() => {
  const out: Record<string, LicensingSource> = {}
  for (const tradeId of CANONICAL_TRADE_IDS) {
    const cfg = TRADE_CONFIGS[tradeId]
    if (!cfg) continue
    for (const req of cfg.licenseRequirements) {
      const st = resolveState(req.state)
      if (st.supportStatus !== 'supported' || st.id == null) continue
      const source = buildSource(tradeId, st.id, req)
      out[source.id] = source
    }
  }
  return out
})()

export function sourceId(tradeId: CanonicalTradeId, stateId: CanonicalStateId): string {
  return `src_${tradeId}_${stateId}`
}

// The official source backing a given trade × state pathway (null when not in the launch matrix).
export function getLicensingSource(
  tradeId: CanonicalTradeId | null, stateId: CanonicalStateId | null,
): LicensingSource | null {
  if (tradeId == null || stateId == null) return null
  return LICENSING_SOURCES[sourceId(tradeId, stateId)] ?? null
}

// All official sources for a pathway (currently one per combo; typed as a list for future county/
// city portal additions without changing call sites).
export function getPathwaySources(
  tradeId: CanonicalTradeId | null, stateId: CanonicalStateId | null,
): LicensingSource[] {
  const s = getLicensingSource(tradeId, stateId)
  return s ? [s] : []
}
