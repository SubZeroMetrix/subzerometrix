'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface AffiliateProgram {
  id: string
  product_id: string
  affiliate_network: string | null
  commission_type: string
  commission_display_text: string | null
  cookie_duration: string | null
  approval_status: string
  is_active: boolean
  products: { name: string } | null
}

export default function AdminAffiliateProgramsPage() {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadPrograms() }, [])

  async function loadPrograms() {
    const supabase = createClient()
    const { data } = await supabase
      .from('affiliate_programs')
      .select('*, products(name)')
      .order('created_at', { ascending: false })
    setPrograms((data as AffiliateProgram[]) || [])
    setLoading(false)
  }

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Affiliate Programs ({programs.length})</h1>
        {programs.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400 mb-4">No affiliate programs configured yet.</p>
            <p className="text-sm text-gray-500">
              Affiliate programs are created per product after applying to vendor programs.
              Do not activate links without vendor approval.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="py-2 px-3 text-gray-500">Product</th>
                  <th className="py-2 px-3 text-gray-500">Network</th>
                  <th className="py-2 px-3 text-gray-500">Commission</th>
                  <th className="py-2 px-3 text-gray-500">Cookie</th>
                  <th className="py-2 px-3 text-gray-500">Status</th>
                  <th className="py-2 px-3 text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 text-white">{p.products?.name || 'Unknown'}</td>
                    <td className="py-2 px-3 text-gray-400">{p.affiliate_network || '—'}</td>
                    <td className="py-2 px-3 text-gray-400">{p.commission_display_text || '—'}</td>
                    <td className="py-2 px-3 text-gray-400">{p.cookie_duration || '—'}</td>
                    <td className="py-2 px-3 text-gray-400 capitalize">{p.approval_status.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-3">
                      <span className={p.is_active ? 'text-green-400' : 'text-gray-500'}>
                        {p.is_active ? 'Active' : 'Inactive'}
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
