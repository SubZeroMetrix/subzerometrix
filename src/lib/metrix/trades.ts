// ─────────────────────────────────────────────────────────────────────────────
// metrix/trades — Wave 3 canonical trade registry (pure)
// ─────────────────────────────────────────────────────────────────────────────
// The ONE typed registry for the 10 supported launch trades. It reuses the trade IDs
// already fixed in src/lib/intake.ts (TRADE_OPTIONS) and src/lib/tradeData.ts — it does NOT
// invent new canonical IDs. "General Contracting / Construction" maps to the existing
// `construction` ID. Resolution is deterministic and defensive: it never throws, tolerates
// labels / slugs / common variants via explicit aliases, and degrades to a safe fallback
// (unknown for empty input, unsupported for a recognized-but-non-launch trade).
//
// Guardrail: aliases are SPECIFIC. Generic words ("services", "contractor", "maintenance",
// "other") are intentionally NOT used as substitutes for any launch trade.
// ─────────────────────────────────────────────────────────────────────────────

export type CanonicalTradeId =
  | 'hvac'
  | 'electrical'
  | 'plumbing'
  | 'handyman'
  | 'landscaping'
  | 'painting'
  | 'roofing'
  | 'solar'
  | 'construction'
  | 'cleaning'

// Stable launch order (used by tests + any registry iteration).
export const CANONICAL_TRADE_IDS: CanonicalTradeId[] = [
  'hvac', 'electrical', 'plumbing', 'handyman', 'landscaping',
  'painting', 'roofing', 'solar', 'construction', 'cleaning',
]

export type TradeSupportStatus = 'supported' | 'unsupported' | 'unknown'

export interface TradeRegistryEntry {
  id: CanonicalTradeId
  displayName: string
  aliases: string[]      // canonicalized at match time; specific terms only
  supported: true
}

export interface ResolvedTrade {
  id: CanonicalTradeId | null
  displayName: string
  supportStatus: TradeSupportStatus
  matchedFrom: string | null   // the raw input that produced the match (null when unresolved)
}

// One typed entry per launch trade. Aliases cover the intake value, the tradeData slug,
// and common real-world variants — all specific, never generic.
export const TRADE_REGISTRY: Record<CanonicalTradeId, TradeRegistryEntry> = {
  hvac: {
    id: 'hvac', displayName: 'HVAC', supported: true,
    aliases: ['hvac', 'hvacr', 'heat', 'heating', 'cooling', 'air conditioning', 'heating and cooling', 'heating and air', 'ac repair', 'mechanical'],
  },
  electrical: {
    id: 'electrical', displayName: 'Electrical', supported: true,
    aliases: ['electrical', 'electrician', 'electric', 'volt', 'electrical contractor'],
  },
  plumbing: {
    id: 'plumbing', displayName: 'Plumbing', supported: true,
    aliases: ['plumbing', 'plumber', 'flow', 'plumbing contractor', 'pipefitting'],
  },
  handyman: {
    id: 'handyman', displayName: 'Handyman Services', supported: true,
    aliases: ['handyman', 'handyman services', 'handyperson', 'home repair', 'home repairs', 'odd jobs'],
  },
  landscaping: {
    id: 'landscaping', displayName: 'Landscaping', supported: true,
    aliases: ['landscaping', 'landscaper', 'landscaping and lawn care', 'lawn care', 'lawn and landscape', 'lawn', 'grounds', 'hardscaping'],
  },
  painting: {
    id: 'painting', displayName: 'Painting', supported: true,
    aliases: ['painting', 'painter', 'painters', 'paint contractor'],
  },
  roofing: {
    id: 'roofing', displayName: 'Roofing', supported: true,
    aliases: ['roofing', 'roofer', 'roof', 'roofing contractor'],
  },
  solar: {
    id: 'solar', displayName: 'Solar', supported: true,
    aliases: ['solar', 'solar installer', 'solar pv', 'photovoltaic', 'pv', 'solar panel installation'],
  },
  construction: {
    id: 'construction', displayName: 'General Contracting / Construction', supported: true,
    aliases: [
      'construction', 'general contracting', 'general contractor', 'gc', 'general construction',
      'remodeling', 'remodel', 'remodeler', 'builder', 'home builder', 'construction and remodeling',
    ],
  },
  cleaning: {
    id: 'cleaning', displayName: 'Cleaning Services', supported: true,
    aliases: ['cleaning', 'cleaning services', 'janitorial', 'house cleaning', 'maid service', 'commercial cleaning'],
  },
}

// Canonicalize free text for matching: lowercase, '&'→'and', strip punctuation, collapse spaces.
function canon(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Build the alias → id lookup once (canonicalized keys).
const ALIAS_LOOKUP: Map<string, CanonicalTradeId> = (() => {
  const m = new Map<string, CanonicalTradeId>()
  for (const id of CANONICAL_TRADE_IDS) {
    const entry = TRADE_REGISTRY[id]
    m.set(canon(id), id)
    for (const a of entry.aliases) m.set(canon(a), id)
  }
  return m
})()

export function isSupportedTrade(id: string | null | undefined): id is CanonicalTradeId {
  return id != null && CANONICAL_TRADE_IDS.includes(id as CanonicalTradeId)
}

/**
 * Resolve a raw trade value (intake value, label, slug, or free text) to a canonical trade.
 * Pure + defensive: empty/blank ⇒ `unknown`; recognized-but-non-launch ⇒ `unsupported`.
 */
export function resolveTrade(input: string | null | undefined): ResolvedTrade {
  if (input == null) return { id: null, displayName: 'Your trade', supportStatus: 'unknown', matchedFrom: null }
  const key = canon(String(input))
  if (key === '') return { id: null, displayName: 'Your trade', supportStatus: 'unknown', matchedFrom: null }

  const exact = ALIAS_LOOKUP.get(key)
  if (exact) {
    const e = TRADE_REGISTRY[exact]
    return { id: e.id, displayName: e.displayName, supportStatus: 'supported', matchedFrom: String(input) }
  }

  // A non-empty value we don't recognize as a launch trade → unsupported (still safe, no throw).
  return { id: null, displayName: String(input).trim() || 'Your trade', supportStatus: 'unsupported', matchedFrom: String(input) }
}
