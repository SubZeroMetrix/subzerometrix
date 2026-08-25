import { describe, it, expect } from 'vitest'
import { calculateTransparentMetrics, promptCoverage, type Observation } from './metrics'

describe('calculateTransparentMetrics', () => {
  it('returns null values with an empty set (no fake zero-as-if-measured)', () => {
    const result = calculateTransparentMetrics([])
    expect(result.mentionRate).toEqual({ numerator: 0, denominator: 0, value: null })
    expect(result.citationRate).toEqual({ numerator: 0, denominator: 0, value: null })
    expect(result.entityAccuracyRate).toEqual({ numerator: 0, denominator: 0, value: null })
  })

  it('computes mention rate only over successful observations', () => {
    const observations: Observation[] = [
      { promptId: 'p1', successful: true, entityMentioned: true, citedPortfolioUrl: false, entityDescribedAccurately: null },
      { promptId: 'p2', successful: true, entityMentioned: false, citedPortfolioUrl: false, entityDescribedAccurately: null },
      { promptId: 'p3', successful: false, entityMentioned: true, citedPortfolioUrl: false, entityDescribedAccurately: null },
    ]
    const result = calculateTransparentMetrics(observations)
    // Only 2 successful observations count as the denominator, not 3
    expect(result.mentionRate).toEqual({ numerator: 1, denominator: 2, value: 0.5 })
  })

  it('computes citation rate over successful observations', () => {
    const observations: Observation[] = [
      { promptId: 'p1', successful: true, entityMentioned: true, citedPortfolioUrl: true, entityDescribedAccurately: true },
      { promptId: 'p2', successful: true, entityMentioned: true, citedPortfolioUrl: false, entityDescribedAccurately: true },
    ]
    const result = calculateTransparentMetrics(observations)
    expect(result.citationRate).toEqual({ numerator: 1, denominator: 2, value: 0.5 })
  })

  it('computes entity accuracy only over observations that mentioned the entity', () => {
    const observations: Observation[] = [
      { promptId: 'p1', successful: true, entityMentioned: true, citedPortfolioUrl: false, entityDescribedAccurately: true },
      { promptId: 'p2', successful: true, entityMentioned: true, citedPortfolioUrl: false, entityDescribedAccurately: false },
      { promptId: 'p3', successful: true, entityMentioned: false, citedPortfolioUrl: false, entityDescribedAccurately: null },
    ]
    const result = calculateTransparentMetrics(observations)
    // Denominator is 2 (mentioned), not 3 (all successful)
    expect(result.entityAccuracyRate).toEqual({ numerator: 1, denominator: 2, value: 0.5 })
  })
})

describe('promptCoverage', () => {
  it('returns null for zero total prompts', () => {
    expect(promptCoverage(0, 0)).toBeNull()
  })

  it('computes a plain ratio', () => {
    expect(promptCoverage(5, 20)).toBe(0.25)
  })
})
