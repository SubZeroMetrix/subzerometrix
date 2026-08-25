import { getCitationIntelligenceRepository } from '@/lib/citation-intelligence/repository'

export function EmptyState({ label }: { label: string }) {
  const repo = getCitationIntelligenceRepository()
  const persistenceAvailable = repo.isPersistenceAvailable()

  return (
    <div className="card-panel bg-gray-900/40 border-gray-800 text-center py-12">
      <p className="text-gray-300 font-medium">No {label} yet</p>
      {!persistenceAvailable ? (
        <p className="mt-2 text-sm text-amber-400/80 max-w-md mx-auto">
          Persistence is not yet available -- the Supabase migration for this table hasn&apos;t been applied
          (blocked on a missing database credential, see /admin/citation-intelligence Overview). This is not
          fabricated data; there is genuinely nothing recorded yet.
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Nothing recorded yet.</p>
      )}
    </div>
  )
}

export function ViewHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  )
}
