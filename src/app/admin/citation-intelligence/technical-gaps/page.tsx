import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Technical Gaps', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function TechnicalGapsContent() {
  const repo = getCitationIntelligenceRepository()
  const gaps = await repo.listTechnicalGaps()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Technical Gaps" description="Robots, indexing, canonical, and schema issues affecting AI/search discovery of a URL." />
        {gaps.length === 0 ? (
          <EmptyState label="technical gaps" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">URL</th>
                  <th className="py-2 pr-4">Issue</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g) => (
                  <tr key={g.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{g.url}</td>
                    <td className="py-2 pr-4">{g.issueType}</td>
                    <td className="py-2">{g.status}</td>
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

export default async function TechnicalGapsPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <TechnicalGapsContent />
    </AdminAuthGate>
  )
}
