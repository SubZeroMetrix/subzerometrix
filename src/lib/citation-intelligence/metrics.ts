/**
 * Transparent measurement formulas -- SubZero Citation Intelligence.
 *
 * No opaque 0-100 score. Every metric here is a plain ratio with a
 * visible numerator and denominator. These are real, tested functions --
 * they just have nothing to compute over yet in production, because
 * observation storage is blocked (see entities.ts header for the exact
 * verified blocker: Supabase CLI/dashboard account banned, no exec_sql
 * RPC available via REST to create tables).
 */

export interface Observation {
  promptId: string
  successful: boolean
  entityMentioned: boolean
  citedPortfolioUrl: boolean
  entityDescribedAccurately: boolean | null // null = entity not mentioned, N/A
}

export interface TransparentMetrics {
  mentionRate: { numerator: number; denominator: number; value: number | null }
  citationRate: { numerator: number; denominator: number; value: number | null }
  entityAccuracyRate: { numerator: number; denominator: number; value: number | null }
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator
}

export function calculateTransparentMetrics(observations: Observation[]): TransparentMetrics {
  const successful = observations.filter((o) => o.successful)
  const mentioned = successful.filter((o) => o.entityMentioned)

  const mentionNum = mentioned.length
  const citationNum = successful.filter((o) => o.citedPortfolioUrl).length
  const accurateNum = mentioned.filter((o) => o.entityDescribedAccurately === true).length

  return {
    mentionRate: { numerator: mentionNum, denominator: successful.length, value: ratio(mentionNum, successful.length) },
    citationRate: { numerator: citationNum, denominator: successful.length, value: ratio(citationNum, successful.length) },
    entityAccuracyRate: { numerator: accurateNum, denominator: mentioned.length, value: ratio(accurateNum, mentioned.length) },
  }
}

export function promptCoverage(promptsWithResource: number, totalPrompts: number): number | null {
  return ratio(promptsWithResource, totalPrompts)
}
