'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface ClickSummary { slug: string; product_name: string; total_clicks: number; tool_finder_clicks: number }

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<ClickSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    const supabase = createClient()
    const { data: clicks } = await supabase
      .from('affiliate_click_events')
      .select('affiliate_link_id, tool_finder_result, affiliate_links(slug, products(name))')

    if (!clicks || clicks.length === 0) {
      setLoading(false)
      return
    }

    const map = new Map<string, ClickSummary>()
    for (const click of clicks) {
      const link = click.affiliate_links as unknown as { slug: string; products: { name: string } | null } | null
      const slug = link?.slug || 'unknown'
      const name = link?.products?.name || 'Unknown'
      const existing = map.get(slug) || { slug, product_name: name, total_clicks: 0, tool_finder_clicks: 0 }
      existing.total_clicks++
      if (click.tool_finder_result) existing.tool_finder_clicks++
      map.set(slug, existing)
    }

    setSummary(Array.from(map.values()).sort((a, b) => b.total_clicks - a.total_clicks))
    setLoading(false)
  }

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Click Analytics</h1>
        <p className="text-sm text-gray-500 mb-6">
          Aggregate affiliate click data. Clicks are not sales or revenue.
        </p>
        {summary.length === 0 ? (
          <p className="text-gray-400">No click data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700 text-left">
                <th className="py-2 px-3 text-gray-500">Product</th>
                <th className="py-2 px-3 text-gray-500">Total Clicks</th>
                <th className="py-2 px-3 text-gray-500">From Tool Finder</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-800">
                {summary.map((s) => (
                  <tr key={s.slug}>
                    <td className="py-2 px-3 text-white">{s.product_name}</td>
                    <td className="py-2 px-3 text-gray-300">{s.total_clicks}</td>
                    <td className="py-2 px-3 text-gray-400">{s.tool_finder_clicks}</td>
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
