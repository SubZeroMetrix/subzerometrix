import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Sources', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function SourcesContent() {
  const repo = getCitationIntelligenceRepository()
  const sources = await repo.listSources()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Sources" description="Every cited URL across all observations, portfolio and non-portfolio." />
        {sources.length === 0 ? (
          <EmptyState label="sources" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Domain</th>
                  <th className="py-2 pr-4">URL</th>
                  <th className="py-2">Portfolio?</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{s.citedDomain}</td>
                    <td className="py-2 pr-4"><a href={s.citedUrl} className="text-brand-electric underline">{s.citedUrl}</a></td>
                    <td className="py-2">{s.isPortfolioUrl ? 'Yes' : 'No'}</td>
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

export default async function SourcesPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <SourcesContent />
    </AdminAuthGate>
  )
}
