import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Competitors', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function CompetitorsContent() {
  const repo = getCitationIntelligenceRepository()
  const competitors = await repo.listCompetitors()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Competitors" description="Competitor entities cited alongside or instead of the portfolio in observed answers." />
        {competitors.length === 0 ? (
          <EmptyState label="competitors" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Competitor</th>
                  <th className="py-2 pr-4">Domain</th>
                  <th className="py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{c.competitorName}</td>
                    <td className="py-2 pr-4">{c.competitorDomain ?? '—'}</td>
                    <td className="py-2">{c.note ?? '—'}</td>
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

export default async function CompetitorsPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <CompetitorsContent />
    </AdminAuthGate>
  )
}
