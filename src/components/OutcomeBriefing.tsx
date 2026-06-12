// ─────────────────────────────────────────────────────────────────────────────
// OutcomeBriefing — score explanation + outcome plan UI (Mega-Phase 4A)
// ─────────────────────────────────────────────────────────────────────────────
// Presentational only: reads getScoreExplanation() + getOutcomePlan() and renders
// honest "why this score / what to do next" sections. No scoring/roadmap changes.
// One component, three variants so each page stays a single-line insertion.
// ─────────────────────────────────────────────────────────────────────────────

import { CheckCircle2, AlertTriangle, Target, Lightbulb, CalendarClock, Wrench, RefreshCw } from 'lucide-react'
import type { MetrixScore } from '@/lib/metrixEngine'
import type { QuickIntake } from '@/lib/intake'
import { getScoreExplanation } from '@/lib/scoreExplanation'
import { getOutcomePlan, type OutcomePlanWindowPlan, type OutcomePlanStep } from '@/lib/outcomePlan'

type Variant = 'results' | 'report' | 'dashboard'

function StepRow({ step, index }: { step: OutcomePlanStep; index: number }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(168,184,204,0.15)' }}>
      <div className="flex items-start gap-2">
        <span className="font-mono text-[10px] text-brand-accent mt-0.5 flex-shrink-0">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-brand-white leading-snug">{step.title}</p>
          <p className="text-[11px] text-brand-silver leading-relaxed mt-0.5">{step.detail}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            {step.estimatedTime && (
              <span className="text-[10px] text-brand-silver/70">{step.estimatedTime}</span>
            )}
            {step.toolName && (
              <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: '#7FB0E8' }}>
                <Wrench className="w-3 h-3" /> {step.toolName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WindowPlan({ plan }: { plan: OutcomePlanWindowPlan }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarClock className="w-4 h-4 text-brand-accent" />
        <h3 className="text-[14px] font-semibold text-brand-white">{plan.label}</h3>
      </div>
      {plan.steps.length > 0 && (
        <div className="space-y-2.5">
          {plan.steps.map((s, i) => <StepRow key={s.id} step={s} index={i} />)}
        </div>
      )}
      <div className="pt-2 border-t border-white/10 space-y-1">
        <p className="text-[11px] text-brand-silver/80 leading-relaxed">
          <span className="text-brand-white font-medium">Expected outcome:</span> {plan.expectedOutcome}
        </p>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed">
          <span className="text-brand-white font-medium">Risk reduced:</span> {plan.riskReduced}
        </p>
      </div>
    </div>
  )
}

function WhyThisScore({ score, intake, full }: { score: MetrixScore; intake: QuickIntake | null; full?: boolean }) {
  const ex = getScoreExplanation(score, intake)
  const driver = ex.drivers[0]
  const constraint = ex.constraints[0]
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-brand-accent" />
        <h3 className="text-[14px] font-semibold text-brand-white">{full ? 'Score explanation' : 'Why this score?'}</h3>
      </div>
      <p className="text-[12px] text-brand-silver leading-relaxed">{ex.headline}</p>
      <div className="space-y-2">
        {driver && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#3FBE93' }} />
            <span className="text-[12px] text-brand-silver leading-snug">
              <span className="text-brand-white">Helped:</span> {driver.label} ({driver.score})
            </span>
          </div>
        )}
        {constraint && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
            <span className="text-[12px] text-brand-silver leading-snug">
              <span className="text-brand-white">Held back:</span> {constraint.label} ({constraint.score})
            </span>
          </div>
        )}
      </div>
      {ex.levers.length > 0 && (
        <div className="pt-1">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent mb-1.5">
            {full ? 'Your next improvement levers' : 'Fix first'}
          </p>
          <div className="space-y-1.5">
            {ex.levers.slice(0, full ? 3 : 1).map(l => (
              <div key={l.category} className="flex items-start gap-2">
                <Target className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-accent" />
                <span className="text-[12px] text-brand-silver leading-snug">
                  <span className="text-brand-white">{l.label}</span> — {l.firstAction}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-[10px] text-brand-silver/50 leading-relaxed">{ex.summary}</p>
    </div>
  )
}

function NextBestAction({ score, intake }: { score: MetrixScore; intake: QuickIntake | null }) {
  const plan = getOutcomePlan(score, intake)
  const action = plan.nextBestAction
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-brand-accent" />
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent">Next best action</span>
      </div>
      {action ? (
        <>
          <p className="text-[14px] font-semibold text-brand-white leading-snug">{action.title}</p>
          <p className="text-[12px] text-brand-silver leading-relaxed mt-1">{action.detail}</p>
          {action.toolName && (
            <p className="inline-flex items-center gap-1 text-[10px] mt-2" style={{ color: '#7FB0E8' }}>
              <Wrench className="w-3 h-3" /> Use: {action.toolName}
            </p>
          )}
        </>
      ) : (
        <p className="text-[13px] text-brand-white">Complete your profile to unlock a precise next action.</p>
      )}
    </div>
  )
}

function ReassessNote({ text }: { text: string }) {
  return (
    <div className="glass-light rounded-xl px-4 py-3 flex items-start gap-2">
      <RefreshCw className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-brand-silver leading-relaxed">{text}</p>
    </div>
  )
}

export default function OutcomeBriefing({
  score, intake, variant,
}: { score: MetrixScore; intake: QuickIntake | null; variant: Variant }) {
  const plan = getOutcomePlan(score, intake)

  if (variant === 'results') {
    return (
      <section className="space-y-4">
        <WhyThisScore score={score} intake={intake} />
      </section>
    )
  }

  if (variant === 'dashboard') {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="w-5 h-5 text-brand-accent" />
          <h2 className="font-display text-xl tracking-wider text-brand-white">WHAT TO WORK ON</h2>
        </div>
        <NextBestAction score={score} intake={intake} />
        <WindowPlan plan={plan.sevenDay} />
        <ReassessNote text={plan.reassessmentRecommendation} />
      </section>
    )
  }

  // report
  return (
    <section className="space-y-4 mt-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-5 h-5 text-brand-accent" />
        <h2 className="font-display text-2xl tracking-wider text-brand-white">SCORE EXPLANATION + PLAN</h2>
      </div>
      <WhyThisScore score={score} intake={intake} full />
      <WindowPlan plan={plan.thirtyDay} />
      <WindowPlan plan={plan.ninetyDay} />
      <ReassessNote text={plan.reassessmentRecommendation} />
    </section>
  )
}
