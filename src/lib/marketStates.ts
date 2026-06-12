// ─────────────────────────────────────────────────────────────────────────────
// marketStates — six confirmed launch states, source of truth (Growth-1)
// ─────────────────────────────────────────────────────────────────────────────
// Data/model only. Honest framing: NO specific licensing claims. State pages and
// content must direct users to official state/local sources to confirm
// requirements. Used by future state discovery pages and the sitemap/keyword work.
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketState {
  name: string
  abbreviation: string
  slug: string
  generalBusinessStartupKeyword: string
  contractorBusinessStartupKeyword: string
  readinessKeyword: string
  officialResourceNote: string
  disclaimerNote: string
}

const OFFICIAL_RESOURCE_NOTE =
  'Use official state and local sources to confirm licensing, registration, insurance, tax, and permitting requirements.'

const DISCLAIMER_NOTE =
  'Educational only. Not legal, tax, financial, licensing, or compliance advice. Verify all requirements with official agencies and qualified professionals.'

function makeState(name: string, abbreviation: string, slug: string): MarketState {
  return {
    name,
    abbreviation,
    slug,
    generalBusinessStartupKeyword: `how to start a business in ${name}`,
    contractorBusinessStartupKeyword: `how to start a contractor business in ${name}`,
    readinessKeyword: `business readiness assessment ${name}`,
    officialResourceNote: OFFICIAL_RESOURCE_NOTE,
    disclaimerNote: DISCLAIMER_NOTE,
  }
}

export const MARKET_STATES: MarketState[] = [
  makeState('Florida', 'FL', 'florida'),
  makeState('Colorado', 'CO', 'colorado'),
  makeState('Texas', 'TX', 'texas'),
  makeState('Arizona', 'AZ', 'arizona'),
  makeState('Ohio', 'OH', 'ohio'),
  makeState('North Carolina', 'NC', 'north-carolina'),
]

export function getMarketState(slug: string): MarketState | undefined {
  return MARKET_STATES.find(s => s.slug === slug)
}

export function getMarketStateByAbbreviation(abbr: string): MarketState | undefined {
  const upper = abbr.toUpperCase()
  return MARKET_STATES.find(s => s.abbreviation === upper)
}

/** Slugs for future /state/<slug>/... pages (not built yet). */
export function getMarketStateSlugs(): string[] {
  return MARKET_STATES.map(s => s.slug)
}
