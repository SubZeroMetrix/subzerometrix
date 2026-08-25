import { ENTITY_REGISTRY } from '@/lib/citation-intelligence/entities'
import { PROMPT_LIBRARY } from '@/lib/citation-intelligence/prompts'
import { calculateTransparentMetrics, promptCoverage } from '@/lib/citation-intelligence/metrics'

export function CitationIntelligenceDashboard() {
  // No observations exist yet -- storage is blocked (see header comment
  // in entities.ts). Metrics below run against an empty set to prove the
  // formulas work; they are not fabricated results.
  const metrics = calculateTransparentMetrics([])
  const coverage = promptCoverage(0, PROMPT_LIBRARY.length)

  return (
    <div className="py-12">
      <div className="section-container max-w-5xl space-y-10">
        <div>
          <p className="text-label text-brand-electric mb-2">Internal — noindex</p>
          <h1 className="text-3xl font-bold text-white mb-2">SubZero Citation Intelligence</h1>
          <p className="text-gray-400 text-sm">Part of SubZero Contractor Revenue Intelligence.</p>
        </div>

        <div className="card-panel bg-amber-950/40 border-amber-700">
          <p className="text-amber-300 font-semibold mb-2">Blocked: observation storage</p>
          <p className="text-sm text-amber-100/80">
            Search observations, citations, competitor records, and content-gap findings require a new database
            table. Table creation is blocked: <code className="text-amber-200">npx supabase projects list</code>{' '}
            returns <code className="text-amber-200">{'{"message":"User is banned"}'}</code>, and no{' '}
            <code className="text-amber-200">exec_sql</code> or equivalent RPC is exposed on this project via REST
            to create tables without CLI/dashboard access. The Entity Registry, Prompt Library, and metric formulas
            below are real and complete; they have nothing to compute over yet.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Entity Registry ({ENTITY_REGISTRY.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Entity</th>
                  <th className="py-2 pr-4">Relationship</th>
                  <th className="py-2 pr-4">Owned Topic</th>
                  <th className="py-2">Last Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {ENTITY_REGISTRY.map((e) => (
                  <tr key={e.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4 font-medium text-white">{e.canonicalName}</td>
                    <td className="py-2 pr-4">{e.relationshipToSubZeroMetrix}</td>
                    <td className="py-2 pr-4">{e.ownedTopic}</td>
                    <td className="py-2">{e.lastReviewed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Prompt Library ({PROMPT_LIBRARY.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="py-2 pr-4">Prompt</th>
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4">Owner</th>
                  <th className="py-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                {PROMPT_LIBRARY.map((p) => (
                  <tr key={p.id} className="border-b border-gray-900">
                    <td className="py-2 pr-4">{p.text}</td>
                    <td className="py-2 pr-4">{p.funnelStage}</td>
                    <td className="py-2 pr-4">{p.correctOwnerEntityId}</td>
                    <td className="py-2">{p.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Transparent Metrics (formulas, no data yet)</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="card-panel">
              <p className="text-gray-400">Mention Rate</p>
              <p className="text-white font-mono">{metrics.mentionRate.numerator} / {metrics.mentionRate.denominator} = {metrics.mentionRate.value ?? 'N/A'}</p>
            </div>
            <div className="card-panel">
              <p className="text-gray-400">Citation Rate</p>
              <p className="text-white font-mono">{metrics.citationRate.numerator} / {metrics.citationRate.denominator} = {metrics.citationRate.value ?? 'N/A'}</p>
            </div>
            <div className="card-panel">
              <p className="text-gray-400">Entity Accuracy Rate</p>
              <p className="text-white font-mono">{metrics.entityAccuracyRate.numerator} / {metrics.entityAccuracyRate.denominator} = {metrics.entityAccuracyRate.value ?? 'N/A'}</p>
            </div>
            <div className="card-panel">
              <p className="text-gray-400">Prompt Coverage</p>
              <p className="text-white font-mono">0 / {PROMPT_LIBRARY.length} = {coverage ?? 'N/A'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
