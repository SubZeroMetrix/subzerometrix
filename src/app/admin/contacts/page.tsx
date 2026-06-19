'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Contact { id: string; name: string; email: string; subject: string | null; message: string; created_at: string }

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setContacts(data || []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Contact Submissions ({contacts.length})</h1>
        {contacts.length === 0 ? (
          <p className="text-gray-400">No contact submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div key={c.id} className="card">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{c.name}</span>
                  <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-400">{c.email}</p>
                {c.subject && <p className="text-sm text-brand-cyan mt-1">{c.subject}</p>}
                <p className="text-sm text-gray-300 mt-2">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
