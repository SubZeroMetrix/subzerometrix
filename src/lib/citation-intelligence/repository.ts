import type {
  CitationObservation, CitationMention, CitationSource, CitationCompetitor,
  ContentGap, TechnicalGap, Opportunity, Outcome, ImportJob,
} from './types'

/**
 * Data-access boundary for Citation Intelligence. Views depend on this
 * interface, never on Supabase calls directly -- swapping the backing
 * store (once the migration in supabase/migrations/0008_citation_intelligence.sql
 * can actually be applied) means implementing this interface again, not
 * rewriting every view.
 */
export interface CitationIntelligenceRepository {
  listObservations(): Promise<CitationObservation[]>
  listMentions(observationId?: string): Promise<CitationMention[]>
  listSources(observationId?: string): Promise<CitationSource[]>
  listCompetitors(observationId?: string): Promise<CitationCompetitor[]>
  listContentGaps(): Promise<ContentGap[]>
  listTechnicalGaps(): Promise<TechnicalGap[]>
  listOpportunities(): Promise<Opportunity[]>
  listOutcomes(): Promise<Outcome[]>
  listImportJobs(): Promise<ImportJob[]>
  /** True once the underlying store is actually reachable and can persist data. */
  isPersistenceAvailable(): boolean
}

/**
 * Honest "not yet persisted" implementation. Every list method resolves
 * to an empty array rather than throwing -- views built against this
 * must already handle the empty state correctly, which is exactly what
 * they'll see in production until the Supabase migration is applied.
 * This is NOT a mock for tests (see repository.test.ts for that); it's
 * the actual repository used in production right now.
 */
export class UnavailableCitationIntelligenceRepository implements CitationIntelligenceRepository {
  async listObservations() { return [] }
  async listMentions() { return [] }
  async listSources() { return [] }
  async listCompetitors() { return [] }
  async listContentGaps() { return [] }
  async listTechnicalGaps() { return [] }
  async listOpportunities() { return [] }
  async listOutcomes() { return [] }
  async listImportJobs() { return [] }
  isPersistenceAvailable() { return false }
}

/**
 * Selects the active repository implementation. Currently always returns
 * the unavailable stub -- there is no Supabase-backed implementation yet
 * because the migration cannot be applied (see 0008_citation_intelligence.sql
 * header). Swap this once that's resolved; nothing else in the app needs
 * to change.
 */
export function getCitationIntelligenceRepository(): CitationIntelligenceRepository {
  return new UnavailableCitationIntelligenceRepository()
}
