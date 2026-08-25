/**
 * CSV/JSON import validation for Citation Intelligence -- runs
 * independently of any database write. A "dry run" here means
 * validate-and-report only; nothing is ever written from this module
 * (there's nowhere to write to yet -- see repository.ts).
 */

export interface ImportRowInput {
  promptId: string
  platform: string
  observedAt: string
  successful?: string | boolean
  entityId?: string
  mentioned?: string | boolean
  citedUrl?: string
  citedDomain?: string
}

export interface ValidatedRow {
  row: number
  data: ImportRowInput
}

export interface RowError {
  row: number
  field?: string
  message: string
}

export interface ImportValidationResult {
  totalRows: number
  validRows: ValidatedRow[]
  errors: RowError[]
  duplicateRowNumbers: number[]
}

const MAX_ROWS = 5000
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB
const REQUIRED_FIELDS: (keyof ImportRowInput)[] = ['promptId', 'platform', 'observedAt']
const URL_FIELDS: (keyof ImportRowInput)[] = ['citedUrl']
const DATE_FIELDS: (keyof ImportRowInput)[] = ['observedAt']

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidDate(value: string): boolean {
  const d = new Date(value)
  return !isNaN(d.getTime())
}

function rowFingerprint(row: ImportRowInput): string {
  return `${row.promptId}|${row.platform}|${row.observedAt}|${row.entityId ?? ''}`
}

export function checkFileSize(byteLength: number): RowError | null {
  if (byteLength > MAX_FILE_BYTES) {
    return { row: 0, message: `File is ${byteLength} bytes, exceeds the ${MAX_FILE_BYTES}-byte limit.` }
  }
  return null
}

/**
 * Validates a parsed array of row objects (already CSV- or JSON-parsed
 * upstream -- this function doesn't care which format it came from).
 * Never throws; always returns a full report.
 */
export function validateImportRows(rows: unknown[]): ImportValidationResult {
  const errors: RowError[] = []
  const validRows: ValidatedRow[] = []
  const seenFingerprints = new Map<string, number>()
  const duplicateRowNumbers: number[] = []

  if (rows.length > MAX_ROWS) {
    errors.push({ row: 0, message: `${rows.length} rows exceeds the ${MAX_ROWS}-row limit per import.` })
    return { totalRows: rows.length, validRows: [], errors, duplicateRowNumbers: [] }
  }

  rows.forEach((raw, idx) => {
    const rowNum = idx + 1 // 1-indexed for human-readable error reporting
    if (typeof raw !== 'object' || raw === null) {
      errors.push({ row: rowNum, message: 'Row is not a valid object.' })
      return
    }
    const row = raw as Record<string, unknown>
    let rowHasError = false

    for (const field of REQUIRED_FIELDS) {
      const value = row[field]
      if (value === undefined || value === null || value === '') {
        errors.push({ row: rowNum, field, message: `Missing required field "${field}".` })
        rowHasError = true
      }
    }

    for (const field of URL_FIELDS) {
      const value = row[field]
      if (typeof value === 'string' && value !== '' && !isValidUrl(value)) {
        errors.push({ row: rowNum, field, message: `"${field}" is not a valid http(s) URL: ${value}` })
        rowHasError = true
      }
    }

    for (const field of DATE_FIELDS) {
      const value = row[field]
      if (typeof value === 'string' && !isValidDate(value)) {
        errors.push({ row: rowNum, field, message: `"${field}" is not a valid date: ${value}` })
        rowHasError = true
      }
    }

    if (rowHasError) return

    const validated = row as unknown as ImportRowInput
    const fingerprint = rowFingerprint(validated)
    if (seenFingerprints.has(fingerprint)) {
      duplicateRowNumbers.push(rowNum)
      errors.push({ row: rowNum, message: `Duplicate of row ${seenFingerprints.get(fingerprint)} (same prompt, platform, date, entity).` })
      return
    }
    seenFingerprints.set(fingerprint, rowNum)

    validRows.push({ row: rowNum, data: validated })
  })

  return { totalRows: rows.length, validRows, errors, duplicateRowNumbers }
}

/**
 * Parses a raw CSV string into row objects using the header row as keys.
 * Minimal parser -- no quoted-comma support -- sufficient for the simple
 * export format this tool expects (documented in the admin UI).
 */
export function parseCsv(csvText: string): unknown[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = cells[i] ?? '' })
    return row
  })
}

export function parseJson(jsonText: string): unknown[] {
  const parsed = JSON.parse(jsonText)
  if (!Array.isArray(parsed)) throw new Error('JSON import must be an array of row objects.')
  return parsed
}
