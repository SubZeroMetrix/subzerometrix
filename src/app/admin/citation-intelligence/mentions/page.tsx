import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'
import { ViewHeader, EmptyState } from '../ViewShell'

export const metadata: Metadata = { title: 'Mentions', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

async function MentionsContent() {
  const repo = getCitationIntelligenceRepository()
  const mentions = await repo.listMentions()

  return (
    <div className="py-8">
      <div className="section-container">
        <ViewHeader title="Mentions" description="Whether a portfolio entity was mentioned in each observation, and whether the description was accurate." />
        {mentions.length === 0 ? (
          <EmptyState label="mentions" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Entity</th>
                  <th className="py-2 pr-4">Mentioned</th>
                  <th className="py-2 pr-4">Accurate</th>
                  <th className="py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {mentions.map((m) => (
                  <tr key={m.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{m.entityId}</td>
                    <td className="py-2 pr-4">{m.mentioned ? 'Yes' : 'No'}</td>
                    <td className="py-2 pr-4">{m.describedAccurately === null ? 'N/A' : m.describedAccurately ? 'Yes' : 'No'}</td>
                    <td className="py-2">{m.inaccuracyNote ?? '—'}</td>
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

export default async function MentionsPage() {
  const user = await getAdminUser()
  if (!user) return <AdminAuthGate>{null}</AdminAuthGate>
  return (
    <AdminAuthGate>
      <MentionsContent />
    </AdminAuthGate>
  )
}
