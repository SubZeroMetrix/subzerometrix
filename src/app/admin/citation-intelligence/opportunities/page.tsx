import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Opportunities', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function OpportunitiesContent() {
  const repo = getCitationIntelligenceRepository()
  const opportunities = await repo.listOpportunities()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Opportunities" description="Prioritized next actions derived from content and technical gaps." />
        {opportunities.length === 0 ? (
          <EmptyState label="opportunities" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((o) => (
                  <tr key={o.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{o.title}</td>
                    <td className="py-2 pr-4">{o.priority}</td>
                    <td className="py-2">{o.status}</td>
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

export default async function OpportunitiesPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <OpportunitiesContent />
    </AdminAuthGate>
  )
}
