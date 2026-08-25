import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Content Gaps', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function ContentGapsContent() {
  const repo = getCitationIntelligenceRepository()
  const gaps = await repo.listContentGaps()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Content Gaps" description="Prompts where the portfolio has no resource, the wrong property owns it, or the existing page has a defect." />
        {gaps.length === 0 ? (
          <EmptyState label="content gaps" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Prompt</th>
                  <th className="py-2 pr-4">Gap Type</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g) => (
                  <tr key={g.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{g.promptId}</td>
                    <td className="py-2 pr-4">{g.gapType}</td>
                    <td className="py-2 pr-4">{g.priority}</td>
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

export default async function ContentGapsPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <ContentGapsContent />
    </AdminAuthGate>
  )
}
