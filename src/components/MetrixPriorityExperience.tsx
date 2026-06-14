'use client'

// ─────────────────────────────────────────────────────────────────────────────
// MetrixPriorityExperience — interactive priority UX with progress persistence (SZM-2E)
// ─────────────────────────────────────────────────────────────────────────────
// Renders the canonical priority/paths/steps (read-only via buildPriorityView) and adds
// device-local progress: select a path, complete/uncomplete steps, see progress %, resume
// across sessions, and an honest save/sync status. It never scores, derives gates, selects
// priority, or builds paths. Cloud sync for this entity is NOT live (no proven table) — the
// status is truthful. No auto re-scoring; a clear reassessment-ready state is exposed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Target, ChevronDown, ChevronUp, Star, AlertTriangle, Lightbulb, ArrowRight, ListChecks, Check, RefreshCw,
} from 'lucide-react'
import {
  buildPriorityView, getActiveProgress, persistProgress, selectPath, toggleStep, canCompleteStep,
  getPriorityProgressSyncReadiness, adoptPriorityProgressFromAccount, syncPriorityProgressToAccount,
  type MetrixProfileSnapshot, type PersistedPriorityProgress,
} from '@/lib/metrix'
import { getSyncStatusLabel, type SyncStatus } from '@/lib/syncContracts'

const nowIso = () => new Date().toISOString()

export default function MetrixPriorityExperience({ snapshot }: { snapshot: MetrixProfileSnapshot | null }) {
  const view = buildPriorityView(snapshot)
  const [openPaths, setOpenPaths] = useState<Record<string, boolean>>({})
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({})
  const [record, setRecord] = useState<PersistedPriorityProgress | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('saved_on_device')

  const priorityId = snapshot?.metrixPriority?.priorityId
  // Resume device-local progress, then (when signed in) adopt the account copy for
  // cross-device resume. Reconciliation never loses or stale-overwrites local work.
  useEffect(() => {
    if (!snapshot || view.state !== 'ready') return
    let cancelled = false
    let local: PersistedPriorityProgress | null = null
    try { local = getActiveProgress(snapshot, nowIso()); setRecord(local) } catch { /* non-fatal */ }
    ;(async () => {
      try {
        const res = await adoptPriorityProgressFromAccount(local)
        if (cancelled || !res.resolved) return
        if (res.action === 'adopted_account' || res.action === 'merged') {
          persistProgress(res.resolved)
          setRecord(res.resolved)
        }
      } catch { /* keep device-local record */ }
    })()
    return () => { cancelled = true }
  }, [snapshot, view.state, priorityId])

  // Honest save/sync status (cloud wired via migration 004; never a false "synced" pre-write).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await getPriorityProgressSyncReadiness()
        if (!cancelled) setSyncStatus(r.status)
      } catch { /* keep device-local default */ }
    })()
    return () => { cancelled = true }
  }, [])

  // Best-effort cloud backup after a local mutation — never blocks/throws; updates the badge.
  const backUp = (next: PersistedPriorityProgress) => {
    ;(async () => {
      try {
        const res = await syncPriorityProgressToAccount(next)
        setSyncStatus(res.status)
      } catch { /* keep device-local status */ }
    })()
  }

  const togglePath = (id: string) => setOpenPaths(s => ({ ...s, [id]: !s[id] }))
  const toggleStepOpen = (id: string) => setOpenSteps(s => ({ ...s, [id]: !s[id] }))
  const choosePath = (pathId: string) => {
    if (!snapshot || !record) return
    const next = selectPath(record, pathId, snapshot, nowIso()); persistProgress(next); setRecord(next); backUp(next)
  }
  const completeStep = (stepId: string) => {
    if (!snapshot || !record) return
    const next = toggleStep(record, stepId, snapshot, nowIso()); persistProgress(next); setRecord(next); backUp(next)
  }

  if (view.state === 'missing') return null

  if (view.state === 'legacy') {
    return (
      <section className="glass-light rounded-xl px-4 py-3" aria-label="Saved profile">
        <p className="text-[12px] text-brand-silver leading-relaxed">
          This is a saved profile. Re-take the assessment to generate a current priority and step-by-step plan.
        </p>
        <Link href="/start" className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-brand-accent underline underline-offset-2 touch-target">
          Re-take the assessment <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    )
  }

  const p = view.priority!
  const completed = new Set(record?.completedStepIds ?? [])
  const requiredTotal = view.actionSteps.filter(s => !s.optional).length
  const requiredDone = view.actionSteps.filter(s => !s.optional && completed.has(s.stepId)).length
  const pct = record?.completionPercent ?? 0
  const ready = !!record?.reassessmentEligible

  return (
    <section className="space-y-5" aria-labelledby="mpx-heading">
      {/* ── 1 · Primary priority card ──────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-brand-accent flex-shrink-0" />
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-silver">
            {p.isStrongOperator ? 'Your highest-leverage move' : 'What matters most'}
          </p>
        </div>
        <h2 id="mpx-heading" className="font-display text-2xl tracking-wide text-brand-white leading-tight">{p.title}</h2>
        {p.rationale && <p className="text-[12px] text-brand-silver leading-relaxed mt-2">{p.rationale}</p>}

        <div className="mt-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
          <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-accent block mb-0.5">Required outcome</span>
          <span className="text-[13px] text-brand-white leading-snug">{p.requiredOutcome}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[10px] px-2.5 py-1 rounded-sm" style={{ background: 'rgba(168,184,204,0.12)', color: '#C8D4E0' }}>{p.evidenceLabel}</span>
        </div>

        {p.blockedWarning && (
          <div role="note" className="flex items-start gap-2 mt-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.3)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
            <p className="text-[12px] text-brand-silver leading-relaxed">{p.blockedWarning}</p>
          </div>
        )}
      </div>

      {/* ── Progress summary + honest save/sync status ─────────────────────── */}
      {view.actionSteps.length > 0 && (
        <div className="glass-light rounded-xl px-4 py-3" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-brand-white font-medium">{requiredDone} of {requiredTotal} steps · {pct}%</span>
            {ready && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm" style={{ background: 'rgba(29,158,117,0.18)', color: '#3FBE93' }}>
                <Check className="w-2.5 h-2.5" /> Ready to reassess
              </span>
            )}
          </div>
          <div className="progress-track h-1.5 mt-2">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: ready ? '#1D9E75' : '#4A90D9' }} />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <RefreshCw className="w-3 h-3 text-brand-silver/60" />
            <span className="text-[10px] text-brand-silver/70">{getSyncStatusLabel(syncStatus)}</span>
          </div>
          {ready && (
            <p className="text-[11px] text-brand-silver/70 mt-2 leading-relaxed">
              You&apos;ve finished the required steps. You can reassess to update your score and priority when you&apos;re ready.
            </p>
          )}
        </div>
      )}

      {/* ── 2 · Completion path choices ────────────────────────────────────── */}
      {view.paths.length > 0 && (
        <section aria-labelledby="mpx-paths">
          <h3 id="mpx-paths" className="font-display text-base tracking-wide text-brand-white mb-2.5">How to get there</h3>
          <div className="space-y-2.5">
            {view.paths.map(path => {
              const open = !!openPaths[path.pathId]
              const selected = record?.selectedPathId === path.pathId
              return (
                <div key={path.pathId} className="glass rounded-xl overflow-hidden" style={selected ? { border: '1px solid rgba(74,144,217,0.55)' } : undefined}>
                  <button type="button" onClick={() => togglePath(path.pathId)} aria-expanded={open} className="w-full text-left px-4 py-3 flex items-start gap-2.5 touch-target">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {path.recommended && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm" style={{ background: 'rgba(29,158,117,0.18)', color: '#3FBE93' }}>
                            <Star className="w-2.5 h-2.5" /> Recommended
                          </span>
                        )}
                        {selected && <span className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm" style={{ background: 'rgba(74,144,217,0.2)', color: '#9DC2EC' }}>Your choice</span>}
                        <span className="text-[13px] font-semibold text-brand-white leading-snug">{path.title}</span>
                      </div>
                      <span className="text-[11px] text-brand-silver block mt-1">{path.pathTypeLabel} · {path.effortLabel} · {path.costLabel}</span>
                    </div>
                    {open ? <ChevronUp className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-3.5 pt-0 space-y-2 text-[12px] text-brand-silver leading-relaxed">
                      <p>{path.description}</p>
                      <p><span className="text-brand-silver/60">Best for:</span> {path.bestFor}</p>
                      {path.recommended && path.recommendationReason && <p><span className="text-brand-silver/60">Why this one:</span> {path.recommendationReason}</p>}
                      {!path.recommended && path.notRecommendedWhen && <p><span className="text-brand-silver/60">Note:</span> {path.notRecommendedWhen}</p>}
                      <button type="button" onClick={() => choosePath(path.pathId)} disabled={selected || !record}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg touch-target ${selected ? 'opacity-60' : 'bg-brand-accent text-white'}`}>
                        {selected ? 'Selected' : 'Use this path'} {!selected && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 3 · Action steps (interactive checklist) ───────────────────────── */}
      {view.actionSteps.length > 0 && (
        <section aria-labelledby="mpx-steps">
          <div className="flex items-center gap-2 mb-2.5">
            <ListChecks className="w-4 h-4 text-brand-accent" />
            <h3 id="mpx-steps" className="font-display text-base tracking-wide text-brand-white">Your steps</h3>
          </div>
          <ol className="space-y-2">
            {view.actionSteps.map(step => {
              const open = !!openSteps[step.stepId]
              const done = completed.has(step.stepId)
              const blocked = !done && !!snapshot && !!record && !canCompleteStep(record, snapshot, step.stepId)
              return (
                <li key={step.stepId} className="glass rounded-xl overflow-hidden">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <button
                      type="button" role="checkbox" aria-checked={done} aria-disabled={blocked || !record}
                      aria-label={`Mark step ${step.order} complete`}
                      onClick={() => !blocked && completeStep(step.stepId)}
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono mt-0.5 touch-target"
                      style={done ? { background: '#1D9E75', color: '#fff' } : blocked ? { background: 'rgba(136,135,128,0.2)', color: '#888780' } : step.isFirst ? { background: '#4A90D9', color: '#fff' } : { background: 'rgba(168,184,204,0.15)', color: '#A8B8CC' }}
                    >
                      {done ? <Check className="w-3 h-3" /> : step.order}
                    </button>
                    <button type="button" onClick={() => toggleStepOpen(step.stepId)} aria-expanded={open} className="flex-1 min-w-0 text-left touch-target">
                      <span className={`text-[13px] leading-snug ${done ? 'text-brand-silver/60 line-through' : step.isFirst ? 'text-brand-white font-semibold' : 'text-brand-silver'}`}>{step.instruction}</span>
                      {step.isFirst && !done && <span className="ml-2 text-[9px] uppercase tracking-wide text-brand-accent">Start here</span>}
                      {blocked && <span className="ml-2 text-[9px] uppercase tracking-wide text-brand-silver/50">Finish the first step</span>}
                    </button>
                    {open ? <ChevronUp className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" />}
                  </div>
                  {open && (
                    <div className="px-4 pb-3.5 pl-12 space-y-1 text-[12px] text-brand-silver leading-relaxed">
                      <p><span className="text-brand-silver/60">Why:</span> {step.purpose}</p>
                      <p><span className="text-brand-silver/60">Done when:</span> {step.completionCriteria}</p>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
          <p className="text-[10px] text-brand-silver/50 mt-2 leading-relaxed">Your progress is {getSyncStatusLabel(syncStatus).toLowerCase()}.</p>
        </section>
      )}

      {/* ── 4 · Next-up queue (subdued; never competes with the primary) ───── */}
      {view.nextUp.length > 0 && (
        <section aria-labelledby="mpx-nextup">
          <h3 id="mpx-nextup" className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-silver/70 mb-2">Next up</h3>
          <div className="space-y-1.5">
            {view.nextUp.map(n => (
              <div key={n.priorityId} className="glass-light rounded-lg px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-brand-silver/60">{n.rank}</span>
                  <span className="text-[12px] text-brand-silver flex-1">{n.title}</span>
                </div>
                <span className="text-[10px] text-brand-silver/50 block pl-5">
                  {n.blockedBy ? 'Blocked until your current priority is resolved' : n.activationCondition}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5 · Top next-best question (informational; no new flow) ─────────── */}
      {view.topQuestion && (
        <section className="glass-light rounded-xl px-4 py-3" aria-labelledby="mpx-question">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-brand-accent" />
            <h3 id="mpx-question" className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver">One answer could sharpen this</h3>
          </div>
          <p className="text-[12px] text-brand-silver leading-relaxed">{view.topQuestion.reason}</p>
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-sm" style={{ background: 'rgba(74,144,217,0.12)', color: '#9DC2EC' }}>{view.topQuestion.impactLabel}</span>
        </section>
      )}
    </section>
  )
}
