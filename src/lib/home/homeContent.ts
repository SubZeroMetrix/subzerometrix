// ─────────────────────────────────────────────────────────────────────────────
// home/homeContent — Wave 7 Checkpoint 3: canonical homepage content (pure data)
// ─────────────────────────────────────────────────────────────────────────────
// The single source of the homepage's positioning, CTA, connected-system explanation,
// lifecycle, audience routing, and market-clarity copy. Kept as pure data so the conversion
// contract is test-enforced: exactly one primary CTA, canonical positioning, real lifecycle
// stages, the 8 audience entry points, only preserved routes, and NO hype/fake-proof phrasing.
// No React; SSR-safe; covered by wave7-home-content.test.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const HOME_CONTENT_VERSION = 1

/** Canonical positioning. */
export const POSITIONING = {
  tagline: 'Start it. Build it. Grow it.',
  promise: 'Find the next business move that matters most.',
  forWho: 'Strongest for contractors, tradespeople, and service businesses.',
} as const

/** The single dominant call to action. There is exactly one primary CTA on the homepage. */
export const PRIMARY_CTA = { label: 'Find My Next Move — Free', href: '/start' } as const

/** Secondary, clearly subordinate links (never styled as a competing primary button). */
export const SECONDARY_LINKS: { label: string; href: string }[] = [
  { label: 'See the 10 trades', href: '/trades' },
  { label: 'How it works', href: '/business-readiness' },
]

/** The connected product system, in canonical order. */
export const CONNECTED_SYSTEM: { name: string; what: string }[] = [
  { name: 'Metrix Profile', what: 'What you tell us about your business becomes a structured profile of where you actually stand.' },
  { name: 'MetrixScore', what: 'A readiness reading across the areas that decide whether a business holds up — not a grade, a temperature.' },
  { name: 'Metrix Priority', what: 'The single most important move to make next, with the reason it comes first.' },
  { name: 'Metrix Roadmap', what: 'The ordered steps for your trade and stage — what to do now, and what to leave for later.' },
  { name: 'Metrix Progress', what: 'Track what you complete and re-read your score over time as your business changes.' },
]

/** Linear lifecycle (Recover is a separate supported intervention path, not in the line). */
export const LIFECYCLE_STAGES = [
  'Idea / Side Hustle',
  'Startup Readiness',
  'Launch',
  'Stabilize',
  'Grow',
  'Scale',
] as const

export const RECOVER_PATH = {
  label: 'Recover',
  note: 'Already running but stalled or sliding backward? Recovery is a supported path — it is not forced into the linear growth sequence.',
} as const

/** The 8 audience entry points — all route into the one free assessment. */
export const AUDIENCE_ROUTING: { key: string; label: string }[] = [
  { key: 'exploring', label: 'Exploring an idea' },
  { key: 'side_hustle', label: 'Starting a side hustle' },
  { key: 'preparing', label: 'Preparing to launch' },
  { key: 'newly_launched', label: 'Newly launched' },
  { key: 'stabilizing', label: 'Stabilizing' },
  { key: 'growing', label: 'Growing' },
  { key: 'scaling', label: 'Scaling' },
  { key: 'recovering', label: 'Recovering' },
]

/** The 10 first-class launch trades. */
export const LAUNCH_TRADES = [
  'HVAC', 'Electrical', 'Plumbing', 'Roofing', 'Solar',
  'Construction', 'Handyman', 'Landscaping', 'Cleaning Services', 'Painting',
] as const

/** The 6 launch states with licensing/jurisdiction intelligence. */
export const LAUNCH_STATES = [
  { code: 'FL', name: 'Florida' },
  { code: 'CO', name: 'Colorado' },
  { code: 'TX', name: 'Texas' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'OH', name: 'Ohio' },
  { code: 'NC', name: 'North Carolina' },
] as const

/** Truthful market-clarity statements (no over-claiming of universal-industry depth). */
export const MARKET_CLARITY: string[] = [
  'Strongest for contractors, tradespeople, and service businesses.',
  'All 10 launch trades are first-class, supported paths — an HVAC roadmap looks nothing like a cleaning-services one.',
  'Six-state licensing and jurisdiction intelligence (FL, CO, TX, AZ, OH, NC), with reviewed dates on the sources it cites.',
  'You must verify licensing and legal requirements with the official authorities — this is educational, not legal advice.',
  'Broader “how to start a business” guidance is educational and not equally deep for every industry.',
]

/** How the product stays honest (trust without hype). */
export const TRUST_POINTS: { title: string; body: string }[] = [
  { title: 'Verification-based, not advice', body: 'Licensing and compliance guidance points you to official sources with reviewed dates. Always confirm current requirements with the authority that governs your work.' },
  { title: 'Educational only', body: 'Nothing here is legal, financial, tax, insurance, or licensing advice, and no business outcome is guaranteed.' },
  { title: 'No human coaching', body: 'SubZeroMetrix is a structured product, not a coaching service. The guidance is the system — clear, repeatable, and yours to act on.' },
  { title: 'Your data stays your context', body: 'Your answers build your own profile and roadmap. Recommendations are never reordered by any commercial relationship, and disclosures are shown where they apply.' },
]

// ── Test-support: phrasing this homepage must never use ──────────────────────────
// Guards against hype, fake proof/scarcity, and marketing slogans.
export const BANNED_HOMEPAGE_PHRASES: string[] = [
  'never sell your data',
  'we will never sell',
  'join thousands',
  'trusted by thousands',
  'limited time',
  'act now',
  'only a few spots left',
  'guaranteed results',
  'guaranteed to',
  '5-star',
  'rated #1',
]

/** Every internal route this content links to — asserted against the preserved route set. */
export const HOME_LINKED_ROUTES: string[] = [
  PRIMARY_CTA.href,
  ...SECONDARY_LINKS.map(l => l.href),
]
