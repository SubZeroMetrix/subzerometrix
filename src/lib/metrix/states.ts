// ─────────────────────────────────────────────────────────────────────────────
// metrix/states — Wave 4 canonical state registry (pure)
// ─────────────────────────────────────────────────────────────────────────────
// The ONE typed registry for the six launch states (FL, CO, TX, AZ, OH, NC). Resolution is
// deterministic and defensive: it never throws, tolerates abbreviations / full names / common
// variants via explicit aliases, and degrades to a safe fallback (unknown for empty input,
// unsupported for a recognized-but-non-launch state). Outside the six launch states, the product
// must clearly say the state is not yet fully supported and route to official authorities —
// NEVER imply coverage we don't have.
//
// State-level authority references here are NAMES + reviewed dates only; official URLs live on the
// LicensingSource provenance records (licensingSources.ts), so there is one source of URL truth.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LICENSING_REVIEWED_DATE,
  type CanonicalStateId, type StateRegistryEntry, type ResolvedState, type StateSupportStatus,
} from './licensingTypes'

// Stable launch order (used by tests + any registry iteration).
export const CANONICAL_STATE_IDS: CanonicalStateId[] = ['FL', 'CO', 'TX', 'AZ', 'OH', 'NC']

const VERIFY = 'Licensing rules change and often vary by city or county. Confirm the current requirements with the official authority before you act.'

// One typed entry per launch state. Authority references name the primary official bodies a
// contractor interacts with; they are not an exhaustive legal list.
export const STATE_REGISTRY: Record<CanonicalStateId, StateRegistryEntry> = {
  FL: {
    id: 'FL', displayName: 'Florida', coverage: 'covered',
    aliases: ['fl', 'florida', 'fla'],
    authorities: [
      { name: 'Florida Department of Business & Professional Regulation (DBPR)', role: 'Contractor licensing' },
      { name: 'Florida Division of Corporations (Sunbiz)', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'Florida licenses most building trades at the state level through DBPR (certified vs registered) and enforces actively. Local jurisdictions may add permitting.',
  },
  CO: {
    id: 'CO', displayName: 'Colorado', coverage: 'covered',
    aliases: ['co', 'colorado', 'colo'],
    authorities: [
      { name: 'Colorado Department of Regulatory Agencies (DORA)', role: 'Electrical & plumbing licensing' },
      { name: 'Colorado Secretary of State', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'Colorado licenses electrical and plumbing at the state level via DORA; general construction, roofing, and several other trades are governed locally and vary by jurisdiction.',
  },
  TX: {
    id: 'TX', displayName: 'Texas', coverage: 'covered',
    aliases: ['tx', 'texas', 'tex'],
    authorities: [
      { name: 'Texas Department of Licensing & Regulation (TDLR)', role: 'HVAC, electrical, plumbing-adjacent licensing' },
      { name: 'Texas State Board of Plumbing Examiners', role: 'Plumbing licensing' },
      { name: 'Texas Secretary of State', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'Texas licenses HVAC, electrical, and plumbing at the state level, but has no statewide general-contractor, roofing, or painting license — those are governed locally where they exist.',
  },
  AZ: {
    id: 'AZ', displayName: 'Arizona', coverage: 'covered',
    aliases: ['az', 'arizona', 'ariz'],
    authorities: [
      { name: 'Arizona Registrar of Contractors (ROC)', role: 'Contractor licensing' },
      { name: 'Arizona Corporation Commission', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'Arizona licenses most trades through the Registrar of Contractors using CR/C classifications, with a handyman exemption below a job-value threshold. Verify the current threshold and classification.',
  },
  OH: {
    id: 'OH', displayName: 'Ohio', coverage: 'partial',
    aliases: ['oh', 'ohio'],
    authorities: [
      { name: 'Ohio Construction Industry Licensing Board (OCILB)', role: 'HVAC/electrical/plumbing/hydronics specialty licensing' },
      { name: 'Ohio Secretary of State', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'Ohio handles much trade licensing at the local (city/county) level, with OCILB covering certain commercial specialty trades. Coverage is partial by design — local verification is essential for most trades.',
  },
  NC: {
    id: 'NC', displayName: 'North Carolina', coverage: 'covered',
    aliases: ['nc', 'north carolina', 'n carolina', 'ncarolina'],
    authorities: [
      { name: 'North Carolina Licensing Board for General Contractors (NCLBGC)', role: 'General contracting & several trades' },
      { name: 'North Carolina Secretary of State', role: 'Business registration' },
    ],
    reviewedDate: LICENSING_REVIEWED_DATE,
    verifyBeforeAction: VERIFY,
    notes: 'North Carolina licenses general contracting and several trades through dedicated state boards with classification tiers and exams. Some work has dollar-threshold exemptions — verify the current limits.',
  },
}

// Canonicalize free text for matching: lowercase, strip punctuation, collapse spaces.
function canon(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Build the alias → id lookup once (canonicalized keys).
const ALIAS_LOOKUP: Map<string, CanonicalStateId> = (() => {
  const m = new Map<string, CanonicalStateId>()
  for (const id of CANONICAL_STATE_IDS) {
    const entry = STATE_REGISTRY[id]
    m.set(canon(id), id)
    for (const a of entry.aliases) m.set(canon(a), id)
  }
  return m
})()

export function isSupportedState(id: string | null | undefined): id is CanonicalStateId {
  return id != null && CANONICAL_STATE_IDS.includes(id as CanonicalStateId)
}

/**
 * Resolve a raw state value (abbreviation, full name, or free text) to a canonical launch state.
 * Pure + defensive: empty/blank ⇒ `unknown`; recognized-but-non-launch ⇒ `unsupported`.
 */
export function resolveState(input: string | null | undefined): ResolvedState {
  if (input == null) return { id: null, displayName: 'Your state', supportStatus: 'unknown', matchedFrom: null }
  const raw = String(input)
  const key = canon(raw)
  if (key === '') return { id: null, displayName: 'Your state', supportStatus: 'unknown', matchedFrom: null }

  const exact = ALIAS_LOOKUP.get(key)
  if (exact) {
    const e = STATE_REGISTRY[exact]
    return { id: e.id, displayName: e.displayName, supportStatus: 'supported', matchedFrom: raw }
  }

  // A non-empty value we don't recognize as a launch state → unsupported (still safe, no throw).
  const status: StateSupportStatus = 'unsupported'
  return { id: null, displayName: raw.trim() || 'Your state', supportStatus: status, matchedFrom: raw }
}
