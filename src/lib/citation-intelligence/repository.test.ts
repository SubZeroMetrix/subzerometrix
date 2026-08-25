import { describe, it, expect } from 'vitest'
import { UnavailableCitationIntelligenceRepository, getCitationIntelligenceRepository } from './repository'

// Fixture-based tests only -- these verify the repository contract
// (every list method resolves to an array, isPersistenceAvailable is
// honest about state), not real production data. Never treat these
// results as observed data; see repository.ts header.
describe('UnavailableCitationIntelligenceRepository', () => {
  const repo = new UnavailableCitationIntelligenceRepository()

  it('reports persistence as unavailable', () => {
    expect(repo.isPersistenceAvailable()).toBe(false)
  })

  it('resolves every list method to an empty array rather than throwing', async () => {
    await expect(repo.listObservations()).resolves.toEqual([])
    await expect(repo.listMentions()).resolves.toEqual([])
    await expect(repo.listSources()).resolves.toEqual([])
    await expect(repo.listCompetitors()).resolves.toEqual([])
    await expect(repo.listContentGaps()).resolves.toEqual([])
    await expect(repo.listTechnicalGaps()).resolves.toEqual([])
    await expect(repo.listOpportunities()).resolves.toEqual([])
    await expect(repo.listOutcomes()).resolves.toEqual([])
    await expect(repo.listImportJobs()).resolves.toEqual([])
  })
})

describe('getCitationIntelligenceRepository', () => {
  it('returns the unavailable repository until a real backing store exists', () => {
    const repo = getCitationIntelligenceRepository()
    expect(repo.isPersistenceAvailable()).toBe(false)
  })
})
