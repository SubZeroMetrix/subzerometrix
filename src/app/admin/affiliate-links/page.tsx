'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface AffiliateLink {
  id: string
  slug: string
  destination_url: string
  is_active: boolean
  products: { name: string } | null
}

export default function AdminAffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadLinks() }, [])

  async function loadLinks() {
    const supabase = createClient()
    const { data } = await supabase
      .from('affiliate_links')
      .select('id, slug, destination_url, is_active, products(name)')
      .order('slug')
    setLinks((data as unknown as AffiliateLink[]) || [])
    setLoading(false)
  }

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Affiliate Links ({links.length})</h1>
        {links.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No affiliate links configured. Links require approved affiliate program status before activation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="py-2 px-3 text-gray-500">Slug</th>
                  <th className="py-2 px-3 text-gray-500">Product</th>
                  <th className="py-2 px-3 text-gray-500">Destination</th>
                  <th className="py-2 px-3 text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {links.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2 px-3 text-brand-cyan">/go/{l.slug}</td>
                    <td className="py-2 px-3 text-white">{l.products?.name || 'Unknown'}</td>
                    <td className="py-2 px-3 text-gray-400 max-w-xs truncate">{l.destination_url}</td>
                    <td className="py-2 px-3">
                      <span className={l.is_active ? 'text-green-400' : 'text-gray-500'}>
                        {l.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
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
