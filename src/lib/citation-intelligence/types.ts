/**
 * Typed models for Citation Intelligence -- shared between the (not yet
 * appliable) Supabase schema in supabase/migrations/0008_citation_intelligence.sql
 * and the data-access layer in repository.ts. Keeping these as plain
 * types (not Supabase's generated types) is deliberate: the UI should
 * depend on this file, not directly on `@supabase/supabase-js` row
 * shapes, so swapping the backing store later doesn't touch views.
 */

export type ImportFormat = 'csv' | 'json'
export type ImportStatus = 'pending' | 'dry_run' | 'applied' | 'failed'

export interface ImportJob {
  id: string
  sourceFormat: ImportFormat
  filename: string | null
  submittedBy: string
  rowCount: number
  successCount: number
  errorCount: number
  errors: ImportRowError[]
  status: ImportStatus
  createdAt: string
  completedAt: string | null
}

export interface ImportRowError {
  row: number
  field?: string
  message: string
}

export interface CitationObservation {
  id: string
  promptId: string
  promptText: string
  platform: string
  platformModel: string | null
  geography: string | null
  observedAt: string
  retrievedAt: string
  successful: boolean
  rawAnswerExcerpt: string | null
  observer: 'manual' | 'browser' | 'csv-import' | 'json-import'
  importJobId: string | null
  limitations: string | null
  createdAt: string
  updatedAt: string
}

export interface CitationMention {
  id: string
  observationId: string
  entityId: string
  mentioned: boolean
  describedAccurately: boolean | null
  inaccuracyNote: string | null
  createdAt: string
}

export interface CitationSource {
  id: string
  observationId: string
  citedUrl: string
  citedDomain: string
  sourceTitle: string | null
  isPortfolioUrl: boolean
  positionInAnswer: number | null
  createdAt: string
}

export interface CitationCompetitor {
  id: string
  observationId: string
  competitorName: string
  competitorDomain: string | null
  note: string | null
  createdAt: string
}

export type ContentGapType =
  | 'NO_RESOURCE' | 'WRONG_PROPERTY' | 'THIN_RESOURCE' | 'UNSOURCED_CLAIM' | 'OUTDATED_SOURCE'
  | 'ENTITY_CONFUSION' | 'OWNERSHIP_ERROR' | 'NOT_INDEXED' | 'CRAWLER_BLOCKED' | 'MISSING_DIRECT_ANSWER'
  | 'MISSING_ORIGINAL_EVIDENCE' | 'BROKEN_CONVERSION_PATH' | 'COMPETITOR_CITED_PORTFOLIO_ABSENT' | 'UNKNOWN'

export type Priority = 'high' | 'medium' | 'low'
export type GapStatus = 'open' | 'in_progress' | 'resolved' | 'wont_fix'

export interface ContentGap {
  id: string
  promptId: string
  gapType: ContentGapType
  affectedUrl: string | null
  recommendedAction: string | null
  priority: Priority
  status: GapStatus
  evidenceObservationIds: string[]
  reviewer: string | null
  reviewStatus: 'unreviewed' | 'reviewed' | 'disputed'
  createdAt: string
  updatedAt: string
}

export type TechnicalIssueType =
  | 'robots_blocked' | 'noindex' | 'not_in_sitemap' | 'not_indexed'
  | 'invalid_schema' | 'canonical_mismatch' | 'crawler_blocked'

export interface TechnicalGap {
  id: string
  url: string
  issueType: TechnicalIssueType
  detail: string | null
  detectedAt: string
  resolvedAt: string | null
  status: 'open' | 'resolved'
  createdAt: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  sourceGapId: string | null
  sourceTechnicalGapId: string | null
  priority: Priority
  status: 'open' | 'in_progress' | 'done' | 'dismissed'
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}

export type OutcomeType =
  | 'ai_referral_session' | 'crm_click' | 'crm_subscriber'
  | 'tmt_click' | 'tmt_inquiry' | 'tmt_booked' | 'tmt_sold'

export interface Outcome {
  id: string
  outcomeType: OutcomeType
  citedLandingPath: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  relatedObservationId: string | null
  occurredAt: string
  notes: string | null
  createdAt: string
}
