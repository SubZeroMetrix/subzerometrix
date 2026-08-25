import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Citations', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function CitationsContent() {
  const repo = getCitationIntelligenceRepository()
  const sources = await repo.listSources()
  const portfolioCitations = sources.filter((s) => s.isPortfolioUrl)

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Citations" description="Observations where a portfolio URL specifically was cited (a subset of Sources)." />
        {portfolioCitations.length === 0 ? (
          <EmptyState label="citations" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Cited URL</th>
                  <th className="py-2 pr-4">Source Title</th>
                  <th className="py-2">Position</th>
                </tr>
              </thead>
              <tbody>
                {portfolioCitations.map((s) => (
                  <tr key={s.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4"><a href={s.citedUrl} className="text-brand-electric underline">{s.citedUrl}</a></td>
                    <td className="py-2 pr-4">{s.sourceTitle ?? '—'}</td>
                    <td className="py-2">{s.positionInAnswer ?? 'not exposed by platform'}</td>
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

export default async function CitationsPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <CitationsContent />
    </AdminAuthGate>
  )
}
