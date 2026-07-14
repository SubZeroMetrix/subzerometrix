'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { trackLandingEvent } from '@/lib/landing-events'

interface Article {
  id: string
  slug: string
  title: string
  category: string
  status: string
}

const STATUS_LABEL: Record<string, string> = {
  VERIFIED: 'Verified',
  LIMITED: 'Limited',
  PLANNED: 'Planned',
  UNKNOWN: 'Unknown',
}

export function HelpSearchList({ articles, categories }: { articles: Article[]; categories: string[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    trackLandingEvent('help_center_viewed')
  }, [])

  const filtered = useMemo(() => {
    let list = articles
    if (category) list = list.filter((a) => a.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q))
    }
    return list
  }, [articles, category, query])

  function onSearch(value: string) {
    setQuery(value)
    if (value.trim().length >= 3) {
      trackLandingEvent('help_search', { query_length: value.trim().length })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <label htmlFor="help-search" className="sr-only">Search the Help Center</label>
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full px-5 py-3 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${category === null ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${category === c ? 'bg-brand-electric text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-panel text-center py-12">
          <p className="text-gray-600 mb-4">No matching questions found.</p>
          <Link href="/customer-care" className="text-sm font-semibold text-brand-electric hover:underline">
            Ask us directly in the Customer Care Center &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <Link
              key={a.id}
              href={`/help/${a.slug}`}
              onClick={() => trackLandingEvent('help_article_opened', undefined, a.id)}
              className="card-panel hover:border-brand-electric/30 transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">{a.category}</p>
              <h3 className="text-base font-bold text-gray-900 mb-2">{a.title}</h3>
              {a.status !== 'VERIFIED' && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {STATUS_LABEL[a.status] || a.status}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
