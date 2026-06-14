'use client'

// ─────────────────────────────────────────────────────────────────────────────
// resources/ResourceDirectory — Wave 7 Checkpoint 6: the public directory browse UI
// ─────────────────────────────────────────────────────────────────────────────
// Browses ONLY the canonical published ecosystem catalog through buildDirectoryView (which
// returns public-eligible records only). It NEVER reads the workbook, RESOURCE_LAUNCH_IMPORT,
// the 2,063-item backlog, or any draft/held/pending record. With zero public-eligible records
// today, every filter combination yields a stable, accessible empty state.
//
// This is the DIRECTORY (browse + filter). It makes no profile-specific ranking claim and is
// distinct from the subordinate, profile-aware Recommended Resources surface (Wave 5).
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { buildDirectoryView, type DirectoryFilter } from '@/lib/metrix/resourceDirectory'
import { getPublishedEcosystemCatalog } from '@/lib/metrix/ecosystemCatalog'
import type { EcosystemCategory } from '@/lib/metrix/resourceEcosystem'
import type { LifecycleStage } from '@/lib/metrix/lifecycle'
import type { ResourceRelationshipStatus } from '@/lib/metrix/resourceTypes'
import {
  DIRECTORY_CATEGORY_OPTIONS, DIRECTORY_TRADE_OPTIONS, DIRECTORY_STATE_OPTIONS,
  DIRECTORY_LIFECYCLE_OPTIONS, DIRECTORY_RELATIONSHIP_OPTIONS,
} from '@/lib/metrix/directoryOptions'
import { EmptyState } from '@/components/ui'
import ResourceCard from './ResourceCard'

const SELECT_CLASS =
  'w-full rounded-sm steel-border bg-[rgba(10,22,40,0.6)] text-brand-white text-[13px] px-3 py-2.5 ' +
  'touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent'

export default function ResourceDirectory() {
  const [category, setCategory] = useState('')
  const [trade, setTrade] = useState('')
  const [region, setRegion] = useState('')
  const [lifecycle, setLifecycle] = useState('')
  const [relationship, setRelationship] = useState('')
  const [need, setNeed] = useState('')

  const entries = useMemo(() => {
    const filter: DirectoryFilter = {
      category: (category || null) as EcosystemCategory | null,
      trade: trade || null,
      region: region || null,
      lifecycleStage: (lifecycle || null) as LifecycleStage | null,
      relationshipType: (relationship || null) as ResourceRelationshipStatus | null,
      businessNeed: need.trim() || null,
    }
    // Source of truth: the canonical published catalog (empty until records are verified).
    return buildDirectoryView(getPublishedEcosystemCatalog(), filter)
  }, [category, trade, region, lifecycle, relationship, need])

  function reset() {
    setCategory(''); setTrade(''); setRegion(''); setLifecycle(''); setRelationship(''); setNeed('')
  }

  return (
    <section aria-labelledby="directory-heading">
      <h2 id="directory-heading" className="sr-only">Resource directory</h2>

      {/* Filter form */}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        aria-label="Filter resources"
        onSubmit={e => e.preventDefault()}
      >
        <div className="sm:col-span-2">
          <label htmlFor="f-need" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">Search a business need</label>
          <div className="relative">
            <Search className="w-4 h-4 text-brand-silver/60 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="f-need" type="search" value={need} onChange={e => setNeed(e.target.value)}
              placeholder="e.g. licensing, banking, estimating"
              className={SELECT_CLASS + ' pl-9'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="f-category" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">Category</label>
          <select id="f-category" value={category} onChange={e => setCategory(e.target.value)} className={SELECT_CLASS}>
            <option value="">All categories</option>
            {DIRECTORY_CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="f-trade" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">Trade</label>
          <select id="f-trade" value={trade} onChange={e => setTrade(e.target.value)} className={SELECT_CLASS}>
            <option value="">All trades</option>
            {DIRECTORY_TRADE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="f-region" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">State / region</label>
          <select id="f-region" value={region} onChange={e => setRegion(e.target.value)} className={SELECT_CLASS}>
            <option value="">All regions</option>
            {DIRECTORY_STATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="f-lifecycle" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">Lifecycle stage</label>
          <select id="f-lifecycle" value={lifecycle} onChange={e => setLifecycle(e.target.value)} className={SELECT_CLASS}>
            <option value="">All stages</option>
            {DIRECTORY_LIFECYCLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="f-relationship" className="block text-[11px] font-mono tracking-wider uppercase text-brand-silver mb-1">Relationship type</label>
          <select id="f-relationship" value={relationship} onChange={e => setRelationship(e.target.value)} className={SELECT_CLASS}>
            <option value="">Any relationship</option>
            {DIRECTORY_RELATIONSHIP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button type="button" onClick={reset} className="text-[12px] text-brand-silver hover:text-brand-white underline underline-offset-2 touch-target">
            Reset filters
          </button>
        </div>
      </form>

      {/* Result count (announced) */}
      <p role="status" aria-live="polite" className="text-[11px] font-mono tracking-wider uppercase text-brand-silver/70 mb-3">
        {entries.length} {entries.length === 1 ? 'resource' : 'resources'}
      </p>

      {/* Results / empty state */}
      {entries.length > 0 ? (
        <ul className="space-y-3">
          {entries.map(e => (
            <li key={e.resourceId}><ResourceCard entry={e} /></li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Resources are being reviewed">
          We&apos;re verifying official destinations, link health, eligibility, and disclosures before
          any provider is listed here. Official and free resources will appear as that review is
          completed. In the meantime, you can always use your own provider, and the official
          licensing and government links surfaced through your assessment remain available.
        </EmptyState>
      )}
    </section>
  )
}
