'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Rule { id: string; conditions: Record<string, string>; primary_product_id: string; secondary_product_id: string | null; reasoning: string | null; is_active: boolean }

export default function AdminToolFinderPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('tool_finder_rules').select('*').order('is_active', { ascending: false })
      .then(({ data }) => { setRules(data || []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Tool Finder Rules ({rules.length})</h1>
        <p className="text-sm text-gray-500 mb-6">
          The Tool Finder uses deterministic rule logic defined in code (content/tool-finder.ts).
          Database rules extend or override the code-based rules when active.
        </p>
        {rules.length === 0 ? (
          <p className="text-gray-400">No database rules configured. The Tool Finder currently uses code-based deterministic rules.</p>
        ) : (
          <div className="space-y-3">
            {rules.map((r) => (
              <div key={r.id} className="card">
                <div className="flex justify-between items-start">
                  <pre className="text-xs text-gray-400 overflow-x-auto">{JSON.stringify(r.conditions, null, 2)}</pre>
                  <span className={`text-xs ${r.is_active ? 'text-green-400' : 'text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                {r.reasoning && <p className="text-sm text-gray-300 mt-2">{r.reasoning}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
