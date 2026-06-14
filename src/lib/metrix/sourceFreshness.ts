// ─────────────────────────────────────────────────────────────────────────────
// metrix/sourceFreshness — Wave 4 deterministic source-freshness logic (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Given a source's reviewed date + freshness window and a caller-supplied `now`, decide whether
// the source is fresh, aging, stale, or unknown. Deterministic: same inputs ⇒ same verdict.
// Defensive: malformed/missing dates degrade to `unknown` (verify-needed) rather than throwing,
// and a stale/unknown source must NEVER be presented as confirmed current law — it routes the
// user to verify with the authority. Missing coverage degrades gracefully; it must not block the
// rest of the product.
// ─────────────────────────────────────────────────────────────────────────────

import type { FreshnessStatus, FreshnessVerdict, LicensingSource } from './licensingTypes'

const MS_PER_DAY = 86_400_000

// Parse an ISO date safely; returns null on anything malformed.
function parseDate(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const t = Date.parse(value)
  return Number.isFinite(t) ? t : null
}

// Whole days between two ISO instants (to − from), floored. null if either is unparseable.
export function dayDiff(fromISO: string, toISO: string): number | null {
  const a = parseDate(fromISO)
  const b = parseDate(toISO)
  if (a == null || b == null) return null
  return Math.floor((b - a) / MS_PER_DAY)
}

// reviewedDate + windowDays → ISO date (date-only). Falls back to the reviewedDate on bad input.
export function computeNextReviewDate(reviewedDate: string, windowDays: number): string {
  const base = parseDate(reviewedDate)
  if (base == null) return reviewedDate
  const days = Number.isFinite(windowDays) && windowDays > 0 ? Math.floor(windowDays) : 0
  return new Date(base + days * MS_PER_DAY).toISOString().slice(0, 10)
}

const STALE_MESSAGE = 'This reference is past its review window. Treat it as a starting point only and confirm the current requirement directly with the authority before acting.'
const AGING_MESSAGE = 'This reference is approaching its review window. Double-check the current requirement with the authority before acting.'
const FRESH_MESSAGE = 'This reference was reviewed recently. Requirements can still change — verify with the authority before acting.'
const UNKNOWN_MESSAGE = 'We could not confirm when this reference was last reviewed. Verify the current requirement directly with the authority before acting.'

const MESSAGE: Record<FreshnessStatus, string> = {
  fresh: FRESH_MESSAGE,
  aging: AGING_MESSAGE,
  stale: STALE_MESSAGE,
  unknown: UNKNOWN_MESSAGE,
}

/**
 * Evaluate a source's freshness at `now`. Pure + defensive.
 *   fresh : age ≤ ~⅔ of the window
 *   aging : age ≤ the window
 *   stale : age > the window
 *   unknown : reviewedDate unparseable (never silently treated as current)
 */
export function evaluateFreshness(source: LicensingSource, now: string): FreshnessVerdict {
  const reviewedDate = source?.reviewedDate ?? ''
  const window = Number.isFinite(source?.freshnessWindowDays) && source.freshnessWindowDays > 0
    ? Math.floor(source.freshnessWindowDays) : 0
  const nextReviewDate = source?.nextReviewDate || computeNextReviewDate(reviewedDate, window)

  const age = dayDiff(reviewedDate, now)
  if (age == null || window === 0) {
    return { status: 'unknown', ageDays: age ?? -1, reviewedDate, nextReviewDate, isStale: true, message: MESSAGE.unknown }
  }
  // A reviewedDate in the future (clock skew / bad data) is treated as fresh, not negative-aged.
  const ageDays = Math.max(0, age)
  let status: FreshnessStatus
  if (ageDays > window) status = 'stale'
  else if (ageDays > Math.floor(window * 2 / 3)) status = 'aging'
  else status = 'fresh'

  return {
    status,
    ageDays,
    reviewedDate,
    nextReviewDate,
    isStale: status === 'stale',
    message: MESSAGE[status],
  }
}

// Convenience: is this source stale (or unverifiable) as of `now`?
export function isSourceStale(source: LicensingSource, now: string): boolean {
  return evaluateFreshness(source, now).isStale
}

// Roll a set of source verdicts into one overall status (worst wins, but `unknown` only when
// there is nothing fresher to lean on). Empty input ⇒ `unknown` (we have no confirmed coverage).
export function rollupFreshness(sources: LicensingSource[], now: string): FreshnessStatus {
  if (!Array.isArray(sources) || sources.length === 0) return 'unknown'
  let best: FreshnessStatus = 'unknown'
  const rank: Record<FreshnessStatus, number> = { fresh: 3, aging: 2, stale: 1, unknown: 0 }
  for (const s of sources) {
    const v = evaluateFreshness(s, now).status
    if (rank[v] > rank[best]) best = v
  }
  return best
}
