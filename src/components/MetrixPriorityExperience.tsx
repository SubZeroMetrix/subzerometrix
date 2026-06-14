'use client'

// ─────────────────────────────────────────────────────────────────────────────
// MetrixPriorityExperience — interactive priority UX (SZM-2B)
// ─────────────────────────────────────────────────────────────────────────────
// A thin, read-only renderer over the canonical snapshot's priority/paths/steps/next-up.
// It calls buildPriorityView() (read-model only) — it never scores, derives gates, selects
// priority, or builds completion paths. Mobile-first, keyboard accessible, plain language.
// Display only: expanders are local UI state; no persistence or mutation in this phase.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import {
  Target, ChevronDown, ChevronUp, Star, AlertTriangle, Lightbulb, ArrowRight, ListChecks,
} from 'lucide-react'
import { buildPriorityView, type MetrixProfileSnapshot } from '@/lib/metrix'

export default function MetrixPriorityExperience({ snapshot }: { snapshot: MetrixProfileSnapshot | null }) {
  const view = buildPriorityView(snapshot)
  const [openPaths, setOpenPaths] = useState<Record<string, boolean>>({})
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({})
  const togglePath = (id: string) => setOpenPaths(s => ({ ...s, [id]: !s[id] }))
  const toggleStep = (id: string) => setOpenSteps(s => ({ ...s, [id]: !s[id] }))

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
          <span className="text-[10px] px-2.5 py-1 rounded-sm" style={{ background: 'rgba(168,184,204,0.12)', color: '#C8D4E0' }}>
            {p.evidenceLabel}
          </span>
        </div>

        {p.blockedWarning && (
          <div role="note" className="flex items-start gap-2 mt-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.3)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
            <p className="text-[12px] text-brand-silver leading-relaxed">{p.blockedWarning}</p>
          </div>
        )}
      </div>

      {/* ── 2 · Completion path choices ────────────────────────────────────── */}
      {view.paths.length > 0 && (
        <section aria-labelledby="mpx-paths">
          <h3 id="mpx-paths" className="font-display text-base tracking-wide text-brand-white mb-2.5">How to get there</h3>
          <div className="space-y-2.5">
            {view.paths.map(path => {
              const open = !!openPaths[path.pathId]
              return (
                <div key={path.pathId} className="glass rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => togglePath(path.pathId)}
                    aria-expanded={open}
                    className="w-full text-left px-4 py-3 flex items-start gap-2.5 touch-target"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {path.recommended && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm" style={{ background: 'rgba(29,158,117,0.18)', color: '#3FBE93' }}>
                            <Star className="w-2.5 h-2.5" /> Recommended
                          </span>
                        )}
                        <span className="text-[13px] font-semibold text-brand-white leading-snug">{path.title}</span>
                      </div>
                      <span className="text-[11px] text-brand-silver block mt-1">
                        {path.pathTypeLabel} · {path.effortLabel} · {path.costLabel}
                      </span>
                    </div>
                    {open ? <ChevronUp className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-3.5 pt-0 space-y-1.5 text-[12px] text-brand-silver leading-relaxed">
                      <p>{path.description}</p>
                      <p><span className="text-brand-silver/60">Best for:</span> {path.bestFor}</p>
                      {path.recommended && path.recommendationReason && (
                        <p><span className="text-brand-silver/60">Why this one:</span> {path.recommendationReason}</p>
                      )}
                      {!path.recommended && path.notRecommendedWhen && (
                        <p><span className="text-brand-silver/60">Note:</span> {path.notRecommendedWhen}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 3 · Action steps ───────────────────────────────────────────────── */}
      {view.actionSteps.length > 0 && (
        <section aria-labelledby="mpx-steps">
          <div className="flex items-center gap-2 mb-2.5">
            <ListChecks className="w-4 h-4 text-brand-accent" />
            <h3 id="mpx-steps" className="font-display text-base tracking-wide text-brand-white">Your steps</h3>
          </div>
          <ol className="space-y-2">
            {view.actionSteps.map(step => {
              const open = !!openSteps[step.stepId]
              return (
                <li key={step.stepId} className="glass rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.stepId)}
                    aria-expanded={open}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 touch-target"
                  >
                    <span aria-hidden className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono mt-0.5"
                      style={step.isFirst ? { background: '#4A90D9', color: '#fff' } : { background: 'rgba(168,184,204,0.15)', color: '#A8B8CC' }}>
                      {step.order}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`text-[13px] leading-snug ${step.isFirst ? 'text-brand-white font-semibold' : 'text-brand-silver'}`}>{step.instruction}</span>
                      {step.isFirst && <span className="ml-2 text-[9px] uppercase tracking-wide text-brand-accent">Start here</span>}
                    </span>
                    {open ? <ChevronUp className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" />}
                  </button>
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
          <p className="text-[10px] text-brand-silver/50 mt-2 leading-relaxed">
            Steps are shown for guidance. Tracking your progress is coming soon.
          </p>
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
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-sm" style={{ background: 'rgba(74,144,217,0.12)', color: '#9DC2EC' }}>
            {view.topQuestion.impactLabel}
          </span>
        </section>
      )}
    </section>
  )
}
