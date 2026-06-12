'use client'

// ─────────────────────────────────────────────────────────────────────────────
// FoundationBuilderChecklist — Product-5B: in-app Foundation Builder UI
// ─────────────────────────────────────────────────────────────────────────────
// Renders the Product-5A model (sections → categories → steps), lets the user move
// items across stages and add local notes, saves to the local-first storage contract
// (szm_foundation_builder), shows progress + the next recommended item, and surfaces an
// honest SyncStatusBadge via the Account-2I readiness helper. UI only — no migrations,
// no payment/scoring changes. Educational only; no legal/tax/financial/licensing advice.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react'
import { ClipboardList, ArrowRight, ShieldAlert, ExternalLink } from 'lucide-react'
import {
  FOUNDATION_SECTIONS, FOUNDATION_CATEGORIES, FOUNDATION_STEP_DEFINITIONS,
  getFoundationItemsOrDefaults, saveFoundationItems,
  updateFoundationItem, completeFoundationItem, blockFoundationItem, setFoundationItemStage,
  getFoundationProgressSummary, getNextFoundationItem,
  getFoundationStageLabel, getFoundationPriorityLabel,
  type FoundationChecklistItem, type FoundationStage, type FoundationCategoryId,
} from '@/lib/foundationBuilder'
import SyncStatusBadge from '@/components/SyncStatusBadge'
import { getFoundationBuilderSyncReadiness, syncFoundationBuilderToAccount } from '@/lib/foundationBuilderSync'
import type { SyncStatus } from '@/lib/syncContracts'

const STAGES: FoundationStage[] = ['start_here', 'do_this_next', 'later', 'done', 'blocked']

const STAGE_COLOR: Record<FoundationStage, string> = {
  start_here: '#4A90D9',
  do_this_next: '#EFB967',
  later: '#9FB3C8',
  done: '#1D9E75',
  blocked: '#E05A4E',
}

// Step definition lookup for description/why/official-source reminder.
const DEF_BY_ID = new Map(FOUNDATION_STEP_DEFINITIONS.map(d => [d.id, d]))

export default function FoundationBuilderChecklist() {
  const [items, setItems] = useState<FoundationChecklistItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openNote, setOpenNote] = useState<string | null>(null)
  const [fbStatus, setFbStatus] = useState<SyncStatus>('saved_on_device')
  const [fbSyncedAt, setFbSyncedAt] = useState<string | null>(null)

  useEffect(() => {
    setItems(getFoundationItemsOrDefaults())
    setLoaded(true)
  }, [])

  // Resolve foundation backup status (additive; never blocks the page).
  useEffect(() => {
    if (!loaded) return
    let cancelled = false
    ;(async () => {
      try {
        const readiness = await getFoundationBuilderSyncReadiness()
        if (readiness.canSync) {
          const result = await syncFoundationBuilderToAccount()
          if (!cancelled) { setFbStatus(result.status); setFbSyncedAt(result.lastSyncedAt) }
        } else if (!cancelled) {
          setFbStatus(readiness.status)
        }
      } catch {
        // Expected-failure safe: keep the device-local default.
      }
    })()
    return () => { cancelled = true }
  }, [loaded])

  const summary = useMemo(() => getFoundationProgressSummary(items), [items])
  const nextItem = useMemo(() => getNextFoundationItem(items), [items])

  function persist(updated: FoundationChecklistItem[]) {
    setItems(updated)
    saveFoundationItems(updated)
  }

  function updateStage(id: string, stage: FoundationStage) {
    // Route through the model helpers so completedAt/blockedReason stay durable.
    if (stage === 'done') return persist(completeFoundationItem(items, id))
    if (stage === 'blocked') return persist(blockFoundationItem(items, id, items.find(i => i.id === id)?.blockedReason ?? null))
    persist(items.map(it => (it.id === id ? setFoundationItemStage(it, stage) : it)))
  }

  function updateNote(id: string, note: string) {
    persist(updateFoundationItem(items, id, { note: note.trim() === '' ? null : note }))
  }

  function updateBlockedReason(id: string, reason: string) {
    persist(updateFoundationItem(items, id, { blockedReason: reason.trim() === '' ? null : reason }))
  }

  if (!loaded) {
    return <p className="text-brand-silver text-sm">Loading your Foundation Builder…</p>
  }

  const itemsByCategory = (cat: FoundationCategoryId) => items.filter(i => i.category === cat)

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-5 h-5 text-brand-accent" />
          <h2 className="font-display text-lg tracking-wide text-brand-white">Your foundation progress</h2>
        </div>
        <div className="flex justify-between text-[11px] text-brand-silver mb-2">
          <span>{summary.completed} of {summary.total} steps done</span>
          <span>{summary.percent}%</span>
        </div>
        <div className="progress-track h-2">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${summary.percent}%`, background: '#1D9E75' }} />
        </div>
        {summary.blockedCount > 0 && (
          <p className="text-[10px] text-brand-silver/60 mt-2">{summary.blockedCount} step{summary.blockedCount > 1 ? 's' : ''} marked blocked.</p>
        )}
        {nextItem && (
          <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.25)' }}>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-brand-silver mb-1">Next recommended step</p>
            <p className="text-[13px] font-semibold text-brand-white flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4 text-brand-accent flex-shrink-0" /> {nextItem.stepName}
            </p>
          </div>
        )}
        {/* Honest backup status — device-local unless signed in + confirmed write */}
        <SyncStatusBadge status={fbStatus} lastSyncedAt={fbSyncedAt} entityType="foundation_builder_progress" compact className="mt-3" />
      </section>

      {/* Note privacy reminder */}
      <p className="text-[10px] text-brand-silver/60 leading-relaxed flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#EFB967' }} />
        Notes are saved on this device. Do not enter passwords, API keys, bank details, SSNs,
        or private customer information. This is educational only — confirm legal, tax, and
        licensing requirements with official sources.
      </p>

      {/* Sections → categories → steps */}
      {FOUNDATION_SECTIONS.map(section => {
        const cats = FOUNDATION_CATEGORIES.filter(c => c.sectionId === section.id)
        return (
          <section key={section.id} className="space-y-3">
            <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-silver">{section.label}</h3>
            {cats.map(cat => {
              const catItems = itemsByCategory(cat.id)
              if (catItems.length === 0) return null
              return (
                <div key={cat.id} className="glass rounded-2xl p-4 space-y-3">
                  <p className="text-[13px] font-semibold text-brand-white">{cat.label}</p>
                  {catItems.map(item => {
                    const def = DEF_BY_ID.get(item.stepDefId)
                    return (
                      <div key={item.id} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-brand-white">{item.stepName}</p>
                            {def && <p className="text-[11px] text-brand-silver/80 leading-relaxed mt-0.5">{def.description}</p>}
                            <p className="text-[10px] text-brand-silver/50 mt-1">
                              {getFoundationPriorityLabel(item.priority)} priority{def ? ` · ${def.estimatedTime}` : ''}
                              {def?.officialSourceReminder && (
                                <span className="inline-flex items-center gap-0.5 ml-1" style={{ color: '#EFB967' }}>
                                  <ExternalLink className="w-3 h-3" /> verify with official sources
                                </span>
                              )}
                            </p>
                          </div>
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color: STAGE_COLOR[item.stage], background: `${STAGE_COLOR[item.stage]}1A`, border: `1px solid ${STAGE_COLOR[item.stage]}33` }}>
                            {getFoundationStageLabel(item.stage)}
                          </span>
                        </div>

                        {/* Stage controls */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {STAGES.map(stage => (
                            <button key={stage} type="button" onClick={() => updateStage(item.id, stage)}
                              className="text-[10px] px-2 py-1 rounded-lg transition-all touch-target"
                              style={item.stage === stage
                                ? { color: '#fff', background: STAGE_COLOR[stage] }
                                : { color: STAGE_COLOR[stage], background: `${STAGE_COLOR[stage]}14`, border: `1px solid ${STAGE_COLOR[stage]}33` }}>
                              {getFoundationStageLabel(stage)}
                            </button>
                          ))}
                        </div>

                        {/* Blocked reason (only when blocked) */}
                        {item.stage === 'blocked' && (
                          <input type="text" value={item.blockedReason ?? ''} onChange={e => updateBlockedReason(item.id, e.target.value)}
                            placeholder="What's blocking this step? (optional)"
                            className="w-full mt-2 px-3 py-2 rounded-lg text-[12px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent" />
                        )}

                        {/* Completed timestamp */}
                        {item.completed && item.completedAt && (
                          <p className="text-[10px] mt-2" style={{ color: '#1D9E75' }}>
                            Completed {new Date(item.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}

                        {/* Note toggle + editor */}
                        <button type="button" onClick={() => setOpenNote(openNote === item.id ? null : item.id)}
                          className="text-[10px] text-brand-accent mt-2 underline underline-offset-2">
                          {item.note ? 'Edit note' : 'Add note'}
                        </button>
                        {openNote === item.id && (
                          <textarea value={item.note ?? ''} onChange={e => updateNote(item.id, e.target.value)}
                            rows={2} placeholder="Your own notes for this step (no passwords or private info)"
                            className="w-full mt-2 px-3 py-2 rounded-lg text-[12px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
