'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Lead { id: string; email: string; use_case: string | null; source: string | null; consent_given: boolean; created_at: string }

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('lead_signups').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setLeads(data || []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Leads ({leads.length})</h1>
        {leads.length === 0 ? (
          <p className="text-gray-400">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700 text-left">
                <th className="py-2 px-3 text-gray-500">Email</th>
                <th className="py-2 px-3 text-gray-500">Use Case</th>
                <th className="py-2 px-3 text-gray-500">Source</th>
                <th className="py-2 px-3 text-gray-500">Consent</th>
                <th className="py-2 px-3 text-gray-500">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-800">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2 px-3 text-white">{l.email}</td>
                    <td className="py-2 px-3 text-gray-400">{l.use_case || '—'}</td>
                    <td className="py-2 px-3 text-gray-400">{l.source || '—'}</td>
                    <td className="py-2 px-3 text-gray-400">{l.consent_given ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-3 text-gray-400">{new Date(l.created_at).toLocaleDateString()}</td>
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
