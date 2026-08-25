import { describe, it, expect } from 'vitest'
import { validateImportRows, checkFileSize, parseCsv, parseJson } from './import'

describe('validateImportRows', () => {
  it('accepts a well-formed row', () => {
    const result = validateImportRows([
      { promptId: 'p1', platform: 'chatgpt-search', observedAt: '2026-08-25T00:00:00Z' },
    ])
    expect(result.errors).toHaveLength(0)
    expect(result.validRows).toHaveLength(1)
  })

  it('flags missing required fields with the field name and row number', () => {
    const result = validateImportRows([
      { promptId: 'p1', platform: '', observedAt: '2026-08-25T00:00:00Z' },
    ])
    expect(result.errors).toEqual([
      { row: 1, field: 'platform', message: 'Missing required field "platform".' },
    ])
    expect(result.validRows).toHaveLength(0)
  })

  it('flags an invalid cited URL', () => {
    const result = validateImportRows([
      { promptId: 'p1', platform: 'bing', observedAt: '2026-08-25T00:00:00Z', citedUrl: 'not-a-url' },
    ])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('citedUrl')
  })

  it('flags an invalid date', () => {
    const result = validateImportRows([
      { promptId: 'p1', platform: 'bing', observedAt: 'not-a-date' },
    ])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('observedAt')
  })

  it('detects duplicate rows by (promptId, platform, observedAt, entityId)', () => {
    const row = { promptId: 'p1', platform: 'bing', observedAt: '2026-08-25T00:00:00Z' }
    const result = validateImportRows([row, { ...row }])
    expect(result.duplicateRowNumbers).toEqual([2])
    expect(result.validRows).toHaveLength(1)
  })

  it('rejects a row that is not an object', () => {
    const result = validateImportRows(['not an object'])
    expect(result.errors).toEqual([{ row: 1, message: 'Row is not a valid object.' }])
  })

  it('rejects an import exceeding the row limit without processing any rows', () => {
    const rows = Array.from({ length: 5001 }, () => ({ promptId: 'p', platform: 'x', observedAt: '2026-08-25T00:00:00Z' }))
    const result = validateImportRows(rows)
    expect(result.validRows).toHaveLength(0)
    expect(result.errors[0].message).toMatch(/exceeds the 5000-row limit/)
  })

  it('never throws on malformed input', () => {
    expect(() => validateImportRows([null, undefined, 42, {}])).not.toThrow()
  })
})

describe('checkFileSize', () => {
  it('allows a file under the limit', () => {
    expect(checkFileSize(1024)).toBeNull()
  })

  it('rejects a file over the 5MB limit', () => {
    const result = checkFileSize(6 * 1024 * 1024)
    expect(result).not.toBeNull()
    expect(result?.message).toMatch(/exceeds the 5242880-byte limit/)
  })
})

describe('parseCsv', () => {
  it('parses a header row and data rows into objects', () => {
    const csv = 'promptId,platform,observedAt\np1,bing,2026-08-25T00:00:00Z'
    expect(parseCsv(csv)).toEqual([
      { promptId: 'p1', platform: 'bing', observedAt: '2026-08-25T00:00:00Z' },
    ])
  })

  it('returns an empty array for empty input', () => {
    expect(parseCsv('')).toEqual([])
  })
})

describe('parseJson', () => {
  it('parses a valid JSON array', () => {
    expect(parseJson('[{"promptId":"p1"}]')).toEqual([{ promptId: 'p1' }])
  })

  it('throws for a non-array JSON value', () => {
    expect(() => parseJson('{"promptId":"p1"}')).toThrow(/must be an array/)
  })

  it('throws for invalid JSON', () => {
    expect(() => parseJson('not json')).toThrow()
  })
})
