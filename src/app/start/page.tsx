'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import {
  STAGE_OPTIONS, TRADE_OPTIONS, US_STATES, YEARS_OPTIONS, REVENUE_OPTIONS,
  TEAM_OPTIONS, GOAL_OPTIONS, CHALLENGE_OPTIONS, CONFIDENCE_OPTIONS,
  EMPTY_INTAKE, saveIntake, loadIntake,
  type QuickIntake, type BusinessStage, type IntakeOption,
} from '@/lib/intake'

// ─── Compact labelled select ──────────────────────────────────────────────────
function Field({
  label, value, onChange, options, placeholder, states,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options?: IntakeOption[]
  states?: string[]
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-widest uppercase text-brand-silver font-mono mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className={clsx(
            'w-full appearance-none px-3.5 py-3 pr-9 rounded-xl text-sm transition-all touch-target',
            'glass text-brand-white focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer',
            !value && 'text-brand-silver'
          )}
        >
          <option value="" className="bg-brand-navy text-brand-silver">{placeholder}</option>
          {states
            ? states.map(s => (
                <option key={s} value={s} className="bg-brand-navy text-brand-white">{s}</option>
              ))
            : options!.map(o => (
                <option key={o.value} value={o.value} className="bg-brand-navy text-brand-white">{o.label}</option>
              ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-silver pointer-events-none" />
      </div>
    </div>
  )
}

export default function StartPage() {
  const router = useRouter()
  const [intake, setIntake] = useState<QuickIntake>(EMPTY_INTAKE)

  // Restore any previously entered intake (back-navigation friendly)
  useEffect(() => {
    const saved = loadIntake()
    if (saved) setIntake({ ...EMPTY_INTAKE, ...saved })
  }, [])

  function set<K extends keyof QuickIntake>(key: K, value: QuickIntake[K]) {
    setIntake(prev => ({ ...prev, [key]: value }))
  }

  // Stage is the one required choice; the rest are optional quick context.
  const canContinue = intake.stage !== ''

  function handleContinue() {
    if (!canContinue) return
    saveIntake(intake)
    router.push('/assessment')
  }

  return (
    <main className="min-h-dvh flex flex-col bg-brand-navy">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 px-5 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.98), rgba(10,22,40,0.85))' }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs tracking-wide">Home</span>
          </button>
          <span className="font-mono text-[10px] tracking-[0.2em] text-brand-silver uppercase">
            Quick Intake
          </span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-4 max-w-md mx-auto w-full">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-accent mb-3">
          Before we begin
        </p>
        <h2 className="text-xl font-semibold text-brand-white leading-snug mb-2">
          Where does your business stand?
        </h2>
        <p className="text-[13px] text-brand-silver leading-relaxed mb-5">
          Pick your stage, then a few quick details. This shapes your roadmap — it only takes a moment.
        </p>

        {/* ── Stage Selector (the prominent choice) ───────────────────────────── */}
        <div className="space-y-2.5 mb-7">
          {STAGE_OPTIONS.map(opt => {
            const selected = intake.stage === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('stage', opt.value as BusinessStage)}
                className={clsx(
                  'w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] touch-target border',
                  selected
                    ? 'bg-brand-accent border-brand-accent text-white shadow-glow-blue'
                    : 'glass border-transparent text-brand-silver hover:text-brand-white hover:border-brand-silver/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    selected ? 'border-white bg-white' : 'border-brand-silver/40'
                  )}>
                    {selected && <div className="w-2 h-2 rounded-full bg-brand-accent" />}
                  </div>
                  <span className="flex-1">
                    <span className="font-medium leading-snug">{opt.label}</span>
                    <span className={clsx('block text-[11px]', selected ? 'text-white/70' : 'text-brand-silver/60')}>
                      {opt.hint}
                    </span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Quick Intake fields ─────────────────────────────────────────────── */}
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-accent mb-3">
          A few quick details <span className="text-brand-silver/50 normal-case tracking-normal">(optional)</span>
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          <Field label="Trade"        value={intake.trade}            onChange={v => set('trade', v)}            options={TRADE_OPTIONS}      placeholder="Select trade…" />
          <Field label="State / region" value={intake.region}         onChange={v => set('region', v)}           states={US_STATES}           placeholder="Select state…" />
          <Field label="Years in business" value={intake.yearsInBusiness} onChange={v => set('yearsInBusiness', v)} options={YEARS_OPTIONS}      placeholder="Select…" />
          <Field label="Revenue range" value={intake.revenueRange}     onChange={v => set('revenueRange', v)}     options={REVENUE_OPTIONS}    placeholder="Select…" />
          <Field label="Team size"     value={intake.teamSize}         onChange={v => set('teamSize', v)}         options={TEAM_OPTIONS}       placeholder="Select…" />
          <Field label="Confidence"    value={intake.confidence}       onChange={v => set('confidence', v)}       options={CONFIDENCE_OPTIONS} placeholder="Select…" />
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Main goal"        value={intake.mainGoal}         onChange={v => set('mainGoal', v)}         options={GOAL_OPTIONS}      placeholder="What matters most right now?" />
          <Field label="Biggest challenge" value={intake.biggestChallenge} onChange={v => set('biggestChallenge', v)} options={CHALLENGE_OPTIONS} placeholder="What's holding you back?" />
        </div>
      </div>

      {/* ── Continue button ──────────────────────────────────────────────────── */}
      <div className="px-5 pb-8 pt-4 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className={clsx(
            'flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all touch-target',
            canContinue
              ? 'bg-brand-accent text-white shadow-glow-blue active:scale-95'
              : 'bg-brand-blue text-brand-silver/40 cursor-not-allowed'
          )}
        >
          Continue to Assessment <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[10px] text-brand-silver mt-3">
          {canContinue ? '7 quick questions next — free to complete' : 'Select your stage to continue'}
        </p>
      </div>
    </main>
  )
}
