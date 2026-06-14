'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ReassessmentPanel — explicit, user-triggered reassessment UI (SZM Wave 1)
// ─────────────────────────────────────────────────────────────────────────────
// Connects the canonical SZM-2F reassessment loop to the results experience. It NEVER
// reassesses on page load — only when the user explicitly clicks. It re-runs the ONE
// canonical evaluator (via reassessProfile) on the current answers, keeps the same
// profileId, preserves history, archives + restarts progress when the priority changes,
// and surfaces every state: eligibility, loading, success (what changed / why / what
// stayed the same), unchanged, conflict, unavailable, and error. Scoring/priority/path
// policy stays display-only here. Best-effort cloud backup; local stays authoritative.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import {
  RefreshCw, Loader2, CheckCircle2, MinusCircle, AlertTriangle, CloudOff, ArrowRight, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import type { RawAnswers } from '@/lib/scoring'
import type { QuickIntake } from '@/lib/intake'
import {
  reassessProfile, persistMetrixProfile, getActiveProgress, persistProgress,
  loadReassessmentHistory, saveReassessmentHistory,
  syncPriorityProgressToAccount, syncReassessmentHistoryToAccount,
  type MetrixProfileSnapshot, type ReassessmentResult, type PersistedPriorityProgress,
} from '@/lib/metrix'
import type { SyncStatus } from '@/lib/syncContracts'

const nowIso = () => new Date().toISOString()

type Phase = 'idle' | 'loading' | 'done' | 'error'

interface DoneState {
  result: ReassessmentResult
  syncStatus: SyncStatus
  conflicts: string[]
}

export default function ReassessmentPanel({
  snapshot, answers, intake,
}: {
  snapshot: MetrixProfileSnapshot | null
  answers: RawAnswers
  intake: QuickIntake | null
}) {
  const [progress, setProgress] = useState<PersistedPriorityProgress | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [done, setDone] = useState<DoneState | null>(null)

  const priorityId = snapshot?.metrixPriority?.priorityId

  // Resume device-local progress (read-only) so we know whether reassessment is eligible.
  // This is NOT a reassessment — it never re-scores.
  useEffect(() => {
    if (!snapshot) return
    try { setProgress(getActiveProgress(snapshot, nowIso())) } catch { /* non-fatal */ }
  }, [snapshot, priorityId])

  if (!snapshot || !snapshot.metrixPriority) return null

  const eligible = !!progress?.reassessmentEligible

  // ── Explicit, user-initiated reassessment ─────────────────────────────────
  const runReassessment = async () => {
    if (!snapshot) return
    setPhase('loading')
    try {
      const now = nowIso()
      const history = loadReassessmentHistory()
      // Explicit click ⇒ run the loop (eligibleOverride). Same profileId; history preserved.
      const result = reassessProfile(snapshot, progress, answers, intake, history, {
        now, eligibleOverride: true,
      })

      // Persist the updated canonical snapshot, then reconcile progress through the proven
      // device-local store (archives + restarts on a priority change; resumes otherwise).
      persistMetrixProfile(result.next)
      const nextProgress = getActiveProgress(result.next, now)
      persistProgress(nextProgress)
      setProgress(nextProgress)
      if (result.status === 'reassessed') saveReassessmentHistory(result.history)

      // Best-effort cloud backup — never blocks or throws into the UI.
      let syncStatus: SyncStatus = 'saved_on_device'
      let conflicts: string[] = []
      try {
        const ps = await syncPriorityProgressToAccount(nextProgress, { now })
        syncStatus = ps.status
        conflicts = ps.conflicts
        if (result.status === 'reassessed') {
          await syncReassessmentHistoryToAccount(result.history, { now })
        }
      } catch { /* keep device-local status */ }

      setDone({ result, syncStatus, conflicts })
      setPhase('done')
    } catch {
      setPhase('error')
    }
  }

  // ── Eligibility (pre-click) ───────────────────────────────────────────────
  if (phase === 'idle' || phase === 'loading') {
    return (
      <section className="glass rounded-2xl p-5" aria-labelledby="reassess-heading" aria-live="polite">
        <div className="flex items-center gap-2 mb-1">
          <RefreshCw className="w-4 h-4 text-brand-accent flex-shrink-0" />
          <h3 id="reassess-heading" className="font-display text-base tracking-wide text-brand-white">Reassess your readiness</h3>
        </div>
        {eligible ? (
          <>
            <p className="text-[12px] text-brand-silver leading-relaxed mt-1">
              You&apos;ve finished the required steps for your current priority. Reassess to update your
              MetrixScore™, priority, and gates from your latest profile. Your history is kept.
            </p>
            <button
              type="button"
              onClick={runReassessment}
              disabled={phase === 'loading'}
              className="inline-flex items-center gap-2 mt-3 text-[12px] font-semibold px-4 py-2 rounded-lg bg-brand-accent text-white active:scale-[0.98] transition-all touch-target disabled:opacity-60"
            >
              {phase === 'loading'
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Reassessing…</>
                : <>Reassess now <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </>
        ) : (
          <p className="text-[12px] text-brand-silver/70 leading-relaxed mt-1">
            Finish the required steps for your current priority to unlock reassessment. Nothing is
            re-scored automatically — you decide when to reassess.
          </p>
        )}
      </section>
    )
  }

  if (phase === 'error') {
    return (
      <section className="glass rounded-2xl p-5" aria-live="assertive">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF9F27' }} />
          <h3 className="font-display text-base tracking-wide text-brand-white">Reassessment didn&apos;t finish</h3>
        </div>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-1">
          Something went wrong while reassessing. Your saved progress and history were not changed.
        </p>
        <button type="button" onClick={() => setPhase('idle')}
          className="inline-flex items-center gap-2 mt-3 text-[12px] font-semibold px-4 py-2 rounded-lg glass text-brand-white touch-target">
          Try again
        </button>
      </section>
    )
  }

  // ── Done: success / unchanged ─────────────────────────────────────────────
  const { result, syncStatus, conflicts } = done!
  const d = result.diff
  const reassessed = result.status === 'reassessed'
  const cloudUnavailable = syncStatus === 'sync_unavailable' || syncStatus === 'sign_in_to_back_up'
  const hasConflict = conflicts.length > 0

  return (
    <section className="glass rounded-2xl p-5 space-y-3" aria-live="polite">
      <div className="flex items-center gap-2">
        {reassessed
          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#1D9E75' }} />
          : <MinusCircle className="w-4 h-4 flex-shrink-0 text-brand-silver" />}
        <h3 className="font-display text-base tracking-wide text-brand-white">
          {reassessed ? 'Reassessed' : 'Nothing changed'}
        </h3>
      </div>

      {!reassessed && (
        <p className="text-[12px] text-brand-silver leading-relaxed">
          We re-ran your assessment and your MetrixScore™, priority, and gates are unchanged.
          Update your answers (retake the assessment) to see a different result.
        </p>
      )}

      {reassessed && (
        <>
          {/* What changed */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent mb-1.5">What changed</p>
            <ul className="space-y-1.5">
              {d.score.changed && (
                <li className="flex items-center gap-2 text-[12px] text-brand-silver">
                  {d.score.delta >= 0
                    ? <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#3FBE93' }} />
                    : <ArrowDownRight className="w-3.5 h-3.5" style={{ color: '#E05A4E' }} />}
                  Readiness score {d.score.previous} → <span className="text-brand-white">{d.score.next}</span>
                  <span style={{ color: d.score.delta >= 0 ? '#3FBE93' : '#E05A4E' }}>
                    ({d.score.delta >= 0 ? '+' : ''}{d.score.delta})
                  </span>
                </li>
              )}
              {d.priority.changed && (
                <li className="flex items-start gap-2 text-[12px] text-brand-silver">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span>New top priority: <span className="text-brand-white">{d.priority.nextTitle}</span></span>
                </li>
              )}
              {d.riskLevel.changed && (
                <li className="flex items-center gap-2 text-[12px] text-brand-silver">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                  Risk level: {d.riskLevel.previous} → <span className="text-brand-white">{d.riskLevel.next}</span>
                </li>
              )}
              {d.gates.newlyCleared.map(g => (
                <li key={`c-${g.id}`} className="flex items-start gap-2 text-[12px] text-brand-silver">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#3FBE93' }} />
                  <span>Cleared: {g.title}</span>
                </li>
              ))}
              {d.gates.newlyTriggered.map(g => (
                <li key={`t-${g.id}`} className="flex items-start gap-2 text-[12px] text-brand-silver">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#EF9F27' }} />
                  <span>New gate: {g.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why */}
          {d.priority.changed && d.priority.nextRationale && (
            <div>
              <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent mb-1">Why</p>
              <p className="text-[12px] text-brand-silver leading-relaxed">{d.priority.nextRationale}</p>
            </div>
          )}

          {result.progress.changed && (
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
              <p className="text-[11px] text-brand-silver leading-relaxed">
                Your previous progress was archived (not deleted) and a fresh plan started for your new priority.
              </p>
              <button type="button" onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-brand-accent underline underline-offset-2 touch-target">
                See your updated priority <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}

      {/* What stayed the same */}
      {d.unchanged.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/60 mb-1">What stayed the same</p>
          <p className="text-[12px] text-brand-silver/70 leading-relaxed">{d.unchanged.join(' · ')}</p>
        </div>
      )}

      {/* Conflict (cross-device reconciliation) */}
      {hasConflict && (
        <div role="note" className="flex items-start gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.3)' }}>
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[11px] text-brand-silver leading-relaxed">
            We merged this with progress from another device, keeping your completed steps and most
            recent choices. Nothing was lost.
          </p>
        </div>
      )}

      {/* Cloud unavailable (still saved locally) */}
      {cloudUnavailable && (
        <div className="flex items-center gap-1.5 text-[10px] text-brand-silver/60">
          <CloudOff className="w-3 h-3" />
          {syncStatus === 'sign_in_to_back_up'
            ? 'Saved on this device. Sign in to back this up to your account.'
            : 'Saved on this device. Account backup is unavailable right now.'}
        </div>
      )}
      {syncStatus === 'synced_to_account' && (
        <p className="text-[10px] text-brand-silver/50">Backed up to your account.</p>
      )}
    </section>
  )
}
