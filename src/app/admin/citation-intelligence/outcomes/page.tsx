import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Outcomes', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function OutcomesContent() {
  const repo = getCitationIntelligenceRepository()
  const outcomes = await repo.listOutcomes()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Outcomes" description="Business results attributed back to AI/search citation activity -- never labeled as revenue unless confirmed." />
        {outcomes.length === 0 ? (
          <EmptyState label="outcomes" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Landing Path</th>
                  <th className="py-2">Occurred</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((o) => (
                  <tr key={o.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{o.outcomeType}</td>
                    <td className="py-2 pr-4">{o.citedLandingPath ?? '—'}</td>
                    <td className="py-2">{o.occurredAt}</td>
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

export default async function OutcomesPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <OutcomesContent />
    </AdminAuthGate>
  )
}
