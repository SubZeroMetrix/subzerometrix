// ─────────────────────────────────────────────────────────────────────────────
// metrix/licensingCorrections — Wave 4 safe correction-reporting adapter (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Turns a user-reported issue (outdated/broken source, wrong authority, wrong trade applicability,
// local-jurisdiction discrepancy) into a safe, structured report payload. It exposes NO internal
// admin systems and stores NO raw private user data: free-text details are sanitized (emails,
// phone-like and long digit runs, and URLs stripped) and bounded, and the report id is derived
// deterministically from the sanitized content (no PII, no user timestamps). Pure + defensive —
// it never throws on malformed input.
// ─────────────────────────────────────────────────────────────────────────────

import { isSupportedTrade } from './trades'
import { isSupportedState } from './states'
import type {
  CorrectionReport, CorrectionReportInput, CorrectionIssueType,
} from './licensingTypes'

const VALID_ISSUE_TYPES: CorrectionIssueType[] = [
  'outdated_source', 'broken_source', 'incorrect_authority',
  'incorrect_trade_applicability', 'local_jurisdiction_discrepancy',
]

const MAX_DETAILS = 280

// Strip likely private data and noise from free text, then bound the length.
function sanitizeDetails(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  let s = value
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[removed]')      // emails
    .replace(/https?:\/\/\S+/gi, '[link]')                        // urls
    .replace(/\b(?:\+?\d[\s().-]?){7,}\b/g, '[removed]')          // phone-like / long digit runs
    .replace(/\s+/g, ' ')
    .trim()
  if (s.length > MAX_DETAILS) s = s.slice(0, MAX_DETAILS).trimEnd() + '…'
  return s
}

// Deterministic, content-derived id (djb2) — same sanitized report ⇒ same id; no PII, no clock.
function reportId(parts: string[]): string {
  let h = 5381
  const str = parts.join('|')
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return `corr_${h.toString(36)}`
}

const VERIFY_WITH = 'While this is reviewed, confirm the current requirement directly with the official state or local authority.'

/**
 * Build a safe correction report. Pure + defensive: unknown trade/state ⇒ null fields (not thrown);
 * unknown issue types fall back to `outdated_source`; details are sanitized + bounded.
 */
export function buildCorrectionReport(input: CorrectionReportInput): CorrectionReport {
  const tradeId = input?.tradeId != null && isSupportedTrade(input.tradeId) ? input.tradeId : null
  const stateId = input?.stateId != null && isSupportedState(input.stateId) ? input.stateId : null
  const issueType: CorrectionIssueType = VALID_ISSUE_TYPES.includes(input?.issueType)
    ? input.issueType : 'outdated_source'
  const sourceId = typeof input?.sourceId === 'string' && input.sourceId.trim() !== ''
    ? input.sourceId.trim().slice(0, 64) : null
  const details = sanitizeDetails(input?.details)

  return {
    id: reportId([tradeId ?? '', stateId ?? '', sourceId ?? '', issueType, details]),
    tradeId,
    stateId,
    sourceId,
    issueType,
    details,
    status: 'received',
    verifyWith: VERIFY_WITH,
  }
}
