'use client'

import { useState, useEffect, useCallback } from 'react'

interface SubmissionRow {
  type: string
  id: string
  name: string | null
  email: string | null
  status: string
  created_at: string
  source: string | null
  details: string
}

const TYPE_LABELS: Record<string, string> = {
  lead: 'Lead',
  customer_care: 'Customer Care',
  qualification: 'Qualification',
  referral_partner: 'Referral/Partner',
  help_feedback: 'Help Feedback',
}

const NEW_STATUSES = new Set(['new', 'NEW'])

function isNew(status: string) {
  return NEW_STATUSES.has(status)
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = typeFilter ? `/api/admin/submissions?type=${encodeURIComponent(typeFilter)}` : '/api/admin/submissions'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load submissions')
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [typeFilter])

  useEffect(() => {
    load()
  }, [load])

  async function markReviewed(row: SubmissionRow) {
    const nextStatus = row.type === 'lead' ? 'contacted' : 'REVIEWED'
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: row.type, id: row.id, status: nextStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setSubmissions((prev) => prev.map((s) => (s.id === row.id && s.type === row.type ? { ...s, status: nextStatus } : s)))
    } catch {
      setError('Failed to update status. Please try again.')
    }
  }

  const newCount = submissions.filter((s) => isNew(s.status)).length

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-2">Submissions</h1>
        <p className="text-sm text-gray-400 mb-6">
          {loading ? 'Loading...' : `${submissions.length} shown, ${newCount} new`}
        </p>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by submission type">
          <button
            type="button"
            onClick={() => setTypeFilter(null)}
            aria-pressed={typeFilter === null}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${typeFilter === null ? 'bg-brand-electric text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            All
          </button>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              aria-pressed={typeFilter === key}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${typeFilter === key ? 'bg-brand-electric text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-400 mb-4" role="alert">{error}</p>}

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-400">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((row) => {
              const key = `${row.type}-${row.id}`
              return (
                <div key={key} className={`rounded-lg border p-4 ${isNew(row.status) ? 'border-brand-electric/40 bg-brand-navy-light' : 'border-gray-800 bg-transparent'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">{TYPE_LABELS[row.type] || row.type}</span>
                        {isNew(row.status) && (
                          <span className="text-xs font-semibold text-white bg-brand-electric px-2 py-0.5 rounded-full">New</span>
                        )}
                        {!isNew(row.status) && (
                          <span className="text-xs text-gray-500">{row.status}</span>
                        )}
                      </div>
                      <p className="text-sm text-white font-semibold truncate">{row.name || row.email || 'No name provided'}</p>
                      {row.email && row.name && <p className="text-xs text-gray-400">{row.email}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(row.created_at).toLocaleString()} {row.source ? `· ${row.source}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === key ? null : key)}
                        className="text-xs font-semibold text-gray-300 border border-gray-700 rounded-full px-3 py-1.5 hover:border-brand-electric"
                      >
                        {expanded === key ? 'Hide' : 'Details'}
                      </button>
                      {isNew(row.status) && (
                        <button
                          type="button"
                          onClick={() => markReviewed(row)}
                          className="text-xs font-semibold text-white bg-brand-electric rounded-full px-3 py-1.5 hover:bg-blue-700"
                        >
                          Mark Reviewed
                        </button>
                      )}
                    </div>
                  </div>
                  {expanded === key && (
                    <p className="text-sm text-gray-300 mt-3 pt-3 border-t border-gray-800 whitespace-pre-wrap break-words">{row.details}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
