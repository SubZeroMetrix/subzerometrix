'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface VerificationRecord { id: string; entity_type: string; entity_id: string; verified_by: string | null; verification_source: string | null; verified_date: string; notes: string | null }

export default function AdminVerificationPage() {
  const [records, setRecords] = useState<VerificationRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('verification_records').select('*').order('verified_date', { ascending: false }).limit(100)
      .then(({ data }) => { setRecords(data || []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Verification Records ({records.length})</h1>
        {records.length === 0 ? (
          <p className="text-gray-400">No verification records yet. Records are created when product data is verified against vendor sources.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="card">
                <div className="flex justify-between">
                  <span className="text-sm text-white capitalize">{r.entity_type}</span>
                  <span className="text-xs text-gray-500">{r.verified_date}</span>
                </div>
                {r.verified_by && <p className="text-xs text-gray-400 mt-1">By: {r.verified_by}</p>}
                {r.verification_source && <p className="text-xs text-brand-cyan mt-1">Source: {r.verification_source}</p>}
                {r.notes && <p className="text-xs text-gray-500 mt-1">{r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
