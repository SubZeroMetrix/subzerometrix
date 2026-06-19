'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Comparison { id: string; slug: string; title: string; is_active: boolean; last_verified_date: string | null }

export default function AdminComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('product_comparisons').select('id, slug, title, is_active, last_verified_date').order('title')
      .then(({ data }) => { setComparisons(data || []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Comparisons ({comparisons.length})</h1>
        {comparisons.length === 0 ? (
          <p className="text-gray-400">No database-backed comparisons yet. Currently served from static content data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700 text-left">
                <th className="py-2 px-3 text-gray-500">Title</th>
                <th className="py-2 px-3 text-gray-500">Slug</th>
                <th className="py-2 px-3 text-gray-500">Verified</th>
                <th className="py-2 px-3 text-gray-500">Active</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-800">
                {comparisons.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3 text-white">{c.title}</td>
                    <td className="py-2 px-3 text-gray-400">{c.slug}</td>
                    <td className="py-2 px-3 text-gray-400">{c.last_verified_date || '—'}</td>
                    <td className="py-2 px-3"><span className={c.is_active ? 'text-green-400' : 'text-gray-500'}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
