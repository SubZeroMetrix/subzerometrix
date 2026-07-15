'use client'

import { useState, useEffect, useCallback } from 'react'

interface Row {
  id: string
  question: string
  confidence: number
  resolved: boolean
  escalated_to: string | null
  route: string | null
  created_at: string
  help_articles?: { title: string; slug: string } | null
}

interface BusterData {
  summary: { total: number; resolvedCount: number; unresolvedCount: number; escalatedCount: number }
  recent: Row[]
  mostAsked: { question: string; count: number }[]
  topSources: { title: string; count: number }[]
  unanswered: Row[]
}

export default function AdminBusterPage() {
  const [data, setData] = useState<BusterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'recent' | 'unanswered' | 'mostAsked' | 'sources'>('recent')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/buster')
      if (!res.ok) throw new Error('Failed to load')
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>
  if (error) return <div className="py-12 section-container"><p className="text-red-400">{error}</p></div>
  if (!data) return null

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-2">Buster Conversations</h1>
        <p className="text-sm text-gray-400 mb-6">Questions asked, what matched, and what needs Help Center attention.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-gray-800 p-4"><p className="text-2xl font-bold text-white">{data.summary.total}</p><p className="text-xs text-gray-500">Total questions</p></div>
          <div className="rounded-lg border border-gray-800 p-4"><p className="text-2xl font-bold text-emerald-400">{data.summary.resolvedCount}</p><p className="text-xs text-gray-500">Resolved</p></div>
          <div className="rounded-lg border border-gray-800 p-4"><p className="text-2xl font-bold text-amber-400">{data.summary.unresolvedCount}</p><p className="text-xs text-gray-500">Unknown</p></div>
          <div className="rounded-lg border border-gray-800 p-4"><p className="text-2xl font-bold text-brand-cyan">{data.summary.escalatedCount}</p><p className="text-xs text-gray-500">Escalated</p></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['recent', 'unanswered', 'mostAsked', 'sources'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${tab === t ? 'bg-brand-electric text-white' : 'bg-gray-800 text-gray-300'}`}>
              {t === 'recent' ? 'Recent Questions' : t === 'unanswered' ? 'Unknown Questions' : t === 'mostAsked' ? 'Most Asked' : 'Source Usage'}
            </button>
          ))}
        </div>

        {tab === 'recent' && (
          data.recent.length === 0 ? <p className="text-gray-400">No questions asked yet.</p> : (
            <div className="space-y-2">
              {data.recent.map((r) => (
                <div key={r.id} className="rounded-lg border border-gray-800 p-3">
                  <p className="text-sm text-white">{r.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.resolved ? `Matched: ${r.help_articles?.title || 'unknown article'} (${Math.round(r.confidence * 100)}%)` : 'Unresolved'}
                    {r.escalated_to && ` · Escalated: ${r.escalated_to}`}
                    {' · '}{new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'unanswered' && (
          data.unanswered.length === 0 ? <p className="text-gray-400">Nothing unanswered right now.</p> : (
            <div className="space-y-2">
              {data.unanswered.map((r) => (
                <div key={r.id} className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3">
                  <p className="text-sm text-white">{r.question}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.route || 'unknown route'} · {new Date(r.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'mostAsked' && (
          data.mostAsked.length === 0 ? <p className="text-gray-400">Not enough repeat questions yet.</p> : (
            <div className="space-y-2">
              {data.mostAsked.map((m) => (
                <div key={m.question} className="rounded-lg border border-gray-800 p-3 flex justify-between">
                  <p className="text-sm text-white">{m.question}</p>
                  <p className="text-xs text-gray-500">&times;{m.count}</p>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'sources' && (
          data.topSources.length === 0 ? <p className="text-gray-400">No sources matched yet.</p> : (
            <div className="space-y-2">
              {data.topSources.map((s) => (
                <div key={s.title} className="rounded-lg border border-gray-800 p-3 flex justify-between">
                  <p className="text-sm text-white">{s.title}</p>
                  <p className="text-xs text-gray-500">&times;{s.count}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
