// ─────────────────────────────────────────────────────────────────────────────
// metrix/quality — Profile quality (coverage / evidence quality / freshness)
// ─────────────────────────────────────────────────────────────────────────────
// Keeps the three data-quality concepts SEPARATE and exposes NO numeric confidence
// percentage (deliberately). Coverage is an honest answered/total count + a categorical
// level; evidence quality describes how the signal was obtained; freshness is categorical
// off the assessment date. Pure and deterministic (freshness `now` is injectable).
// ─────────────────────────────────────────────────────────────────────────────

import type { ProfileSignals, ProfileQuality, CoverageLevel, FreshnessCategory } from './profileTypes'

const TOTAL_CRITERIA = 21

function coverageLevel(answered: number, total: number): CoverageLevel {
  if (total <= 0) return 'minimal'
  const ratio = answered / total
  if (ratio < 0.34) return 'minimal'
  if (ratio < 0.67) return 'partial'
  return 'substantial'
}

export function freshnessCategory(basisDate: string, now: string): FreshnessCategory {
  const b = Date.parse(basisDate)
  const n = Date.parse(now)
  if (Number.isNaN(b) || Number.isNaN(n)) return 'fresh'
  const days = (n - b) / (1000 * 60 * 60 * 24)
  if (days <= 30) return 'fresh'
  if (days <= 90) return 'recent'
  return 'stale'
}

export function deriveProfileQuality(
  signals: ProfileSignals,
  basisDate: string,
  now: string,
): ProfileQuality {
  const answered = signals.answeredCount
  return {
    coverage: { answered, total: TOTAL_CRITERIA, level: coverageLevel(answered, TOTAL_CRITERIA) },
    // Today every signal is inferred from the startup assessment + intake (not
    // independently verified), so evidence quality is 'inferred'.
    evidenceQuality: 'inferred',
    dataFreshness: { basisDate, category: freshnessCategory(basisDate, now) },
    notSureCount: signals.notSureCount,
  }
}
