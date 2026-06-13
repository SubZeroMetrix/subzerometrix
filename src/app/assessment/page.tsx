'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { QUESTIONS, TOTAL_QUESTIONS } from '@/lib/questions'
import { type RawAnswers } from '@/lib/scoring'
import { loadIntake } from '@/lib/intake'
import {
  getCanonicalProfile,
  projectCanonicalToLegacyScoreResult,
  projectCanonicalToLegacyAssessmentRow,
} from '@/lib/metrix'
import clsx from 'clsx'

// US States list
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','Washington D.C.',
]

// Total display steps = 7 questions + 1 lead capture screen
const TOTAL_STEPS = TOTAL_QUESTIONS + 1  // 8
const LEAD_STEP   = TOTAL_QUESTIONS      // index 7 (0-based)

// ─── Option button ────────────────────────────────────────────────────────────
function OptionButton({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children?: React.ReactNode; key?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-4 rounded-xl text-sm transition-all active:scale-[0.98] touch-target border',
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
        <span className="leading-snug font-medium">{children}</span>
      </div>
    </button>
  )
}

// ─── Checkbox button ──────────────────────────────────────────────────────────
function CheckboxButton({
  checked, onClick, children,
}: { checked: boolean; onClick: () => void; children?: React.ReactNode; key?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] touch-target border',
        checked
          ? 'bg-brand-accent border-brand-accent text-white shadow-glow-blue'
          : 'glass border-transparent text-brand-silver hover:text-brand-white hover:border-brand-silver/30'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={clsx(
          'w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center',
          checked ? 'border-white bg-white' : 'border-brand-silver/40'
        )}>
          {checked && (
            <svg className="w-3 h-3 text-brand-accent" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="leading-snug">{children}</span>
      </div>
    </button>
  )
}

// ─── Main assessment page ─────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep]   = useState(0)          // 0-indexed; 0-6 = questions, 7 = lead
  const [answers, setAnswers] = useState<RawAnswers>({})

  // Per-question working state
  const [singleSel,   setSingleSel]   = useState<string>('')
  const [checkboxSel, setCheckboxSel] = useState<string[]>([])
  const [locState,    setLocState]    = useState('')
  const [locCity,     setLocCity]     = useState('')
  const [leadName,    setLeadName]    = useState('')
  const [leadEmail,   setLeadEmail]   = useState('')
  const [leadError,   setLeadError]   = useState('')
  const [submitting,  setSubmitting]  = useState(false)

  const isLeadStep = step === LEAD_STEP
  const question   = isLeadStep ? null : QUESTIONS[step]
  const progress   = ((step + 1) / TOTAL_STEPS) * 100

  // Keep a ref to answers so the restoration effect can read latest answers
  // without adding the answers object itself as a dep (would re-fire on every keystroke)
  const answersRef = React.useRef(answers)
  React.useEffect(() => { answersRef.current = answers }, [answers])

  // Restore working state when navigating to a step
  useEffect(() => {
    const currentAnswers = answersRef.current
    const onLeadStep = step === LEAD_STEP
    if (onLeadStep) {
      setLeadName(currentAnswers.lead?.firstName ?? '')
      setLeadEmail(currentAnswers.lead?.email ?? '')
      return
    }
    const q = QUESTIONS[step]
    if (!q) return
    switch (q.variant) {
      case 'single':
        setSingleSel((currentAnswers as Record<string, string>)[q.id] ?? '')
        break
      case 'checkbox':
        setCheckboxSel((currentAnswers as Record<string, string[]>)[q.id] ?? [])
        break
      case 'location':
        setLocState(currentAnswers.location?.state ?? '')
        setLocCity(currentAnswers.location?.city ?? '')
        break
    }
  }, [step])

  // Can the user proceed?
  function canContinue(): boolean {
    if (isLeadStep) return leadName.trim().length > 0 && leadEmail.includes('@')
    const q = question!
    switch (q.variant) {
      case 'single':   return singleSel.length > 0
      case 'checkbox': return checkboxSel.length > 0
      case 'location': return locState.length > 0  // city is optional
      default:         return false
    }
  }

  // Save current step's answer into answers state
  function saveCurrentAnswer(): RawAnswers {
    if (isLeadStep) {
      return { ...answers, lead: { firstName: leadName.trim(), email: leadEmail.trim() } }
    }
    const q = question!
    switch (q.variant) {
      case 'single':
        return { ...answers, [q.id]: singleSel }
      case 'checkbox':
        return { ...answers, [q.id]: checkboxSel }
      case 'location':
        return { ...answers, location: { state: locState, city: locCity } }
      default:
        return answers
    }
  }

  function handleNext() {
    if (!canContinue()) return
    const newAnswers = saveCurrentAnswer()
    setAnswers(newAnswers)

    if (isLeadStep) {
      // Final submit
      handleSubmit(newAnswers)
      return
    }

    // Advance to next step; pre-load its saved answer
    const nextStep = step + 1
    const nextQ    = nextStep < TOTAL_QUESTIONS ? QUESTIONS[nextStep] : null
    if (nextQ) {
      switch (nextQ.variant) {
        case 'single':
          setSingleSel((newAnswers as Record<string, string>)[nextQ.id] ?? '')
          break
        case 'checkbox':
          setCheckboxSel((newAnswers as Record<string, string[]>)[nextQ.id] ?? [])
          break
        case 'location':
          setLocState(newAnswers.location?.state ?? '')
          setLocCity(newAnswers.location?.city ?? '')
          break
      }
    } else {
      // Going to lead step
      setLeadName(newAnswers.lead?.firstName ?? '')
      setLeadEmail(newAnswers.lead?.email ?? '')
    }
    setStep(nextStep)
  }

  function handleBack() {
    if (step === 0) { router.push('/start'); return }

    // Save whatever is in working state before going back
    const savedAnswers = saveCurrentAnswer()
    setAnswers(savedAnswers)

    const prevStep = step - 1
    const prevQ    = QUESTIONS[prevStep]
    if (prevQ) {
      switch (prevQ.variant) {
        case 'single':
          setSingleSel((savedAnswers as Record<string, string>)[prevQ.id] ?? '')
          break
        case 'checkbox':
          setCheckboxSel((savedAnswers as Record<string, string[]>)[prevQ.id] ?? [])
          break
        case 'location':
          setLocState(savedAnswers.location?.state ?? '')
          setLocCity(savedAnswers.location?.city ?? '')
          break
      }
    }
    setStep(prevStep)
  }

  async function handleSubmit(finalAnswers: RawAnswers) {
    setSubmitting(true)
    try {
      // Canonical Metrix Profile — the SINGLE authoritative evaluation (raw answers
      // preserved; persisted to szm_metrix_canonical). Engine 1 is NOT run here.
      const snapshot = getCanonicalProfile(finalAnswers, loadIntake(), { source: 'assessment' })
      const lead = {
        firstName: finalAnswers.lead?.firstName ?? '',
        email: finalAnswers.lead?.email ?? '',
      }

      // Legacy szm_score carrier (read by results/report/dashboard/unlock) — PROJECTED
      // from the canonical snapshot, never an Engine-1 calculation.
      const legacyResult = projectCanonicalToLegacyScoreResult(snapshot, finalAnswers, lead)
      const scoreJson = JSON.stringify(legacyResult)
      sessionStorage.setItem('szm_score', scoreJson)
      localStorage.setItem('szm_score', scoreJson)

      // Save assessment to Supabase and capture the returned id
      if (
        typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          )
          const { data: inserted, error: dbErr } = await supabase
            .from('assessments')
            // Canonical → legacy row projection (no Engine-1 calculation; raw answers preserved).
            .insert(projectCanonicalToLegacyAssessmentRow(snapshot, finalAnswers, lead))
            .select('id')
            .single()

          if (dbErr) {
            console.warn('Supabase save failed (non-fatal):', dbErr)
          } else if (inserted?.id) {
            // Store assessment_id in localStorage for checkout session creation
            localStorage.setItem('szm_assessment_id', inserted.id)
          }
        } catch (dbErr) {
          console.warn('Supabase save failed (non-fatal):', dbErr)
        }
      }

      router.push('/results')
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitting(false)
    }
  }

  // ── Checkbox logic ────────────────────────────────────────────────────────
  function handleCheckbox(optionId: string) {
    const noneId = question?.noneOptionId ?? ''
    setCheckboxSel((prev: string[]) => {
      if (optionId === noneId) {
        // Selecting "none" clears everything else
        return prev.includes(noneId) ? [] : [noneId]
      }
      // Selecting any real option clears "none"
      const withoutNone = prev.filter((id: string) => id !== noneId)
      return withoutNone.includes(optionId)
        ? withoutNone.filter((id: string) => id !== optionId)
        : [...withoutNone, optionId]
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-dvh flex flex-col bg-brand-navy">

      {/* ── Progress header ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 px-5 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.98), rgba(10,22,40,0.85))' }}
      >
        <div className="flex items-center justify-between mb-3 max-w-md mx-auto w-full">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs tracking-wide">Back</span>
          </button>
          <span className="font-mono text-[10px] tracking-[0.2em] text-brand-silver uppercase">
            {isLeadStep ? 'Almost done' : `Question ${step + 1} of ${TOTAL_QUESTIONS}`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto w-full">
          <div className="progress-track h-1.5 w-full">
            <div className="progress-fill h-full" style={{ width: `${progress}%` }} />
          </div>
          {/* Step dots */}
          <div className="flex gap-1 mt-2 justify-center">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '18px' : '5px',
                  background:
                    i < step
                      ? '#4A90D9'
                      : i === step
                      ? '#A8B8CC'
                      : 'rgba(168,184,204,0.18)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Question / Lead content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-4 max-w-md mx-auto w-full">

        {/* Category label */}
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand-accent mb-3">
          {isLeadStep ? 'Your Roadmap' : question!.categoryLabel}
        </p>

        {/* Question text */}
        <h2 className="text-xl font-semibold text-brand-white leading-snug mb-6">
          {isLeadStep
            ? 'Where should we send your roadmap?'
            : question!.question}
        </h2>

        {/* ── Q Variant: Single select ───────────────────────────────────── */}
        {!isLeadStep && question!.variant === 'single' && (
          <div className="space-y-2.5 flex-1">
            {question!.options!.map(opt => (
              <OptionButton
                key={opt.id}
                selected={singleSel === opt.id}
                onClick={() => setSingleSel(opt.id)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
        )}

        {/* ── Q Variant: Checkbox ────────────────────────────────────────── */}
        {!isLeadStep && question!.variant === 'checkbox' && (
          <div className="space-y-2.5 flex-1">
            <p className="text-[11px] text-brand-silver mb-1">Select all that apply</p>
            {question!.options!.map(opt => (
              <CheckboxButton
                key={opt.id}
                checked={checkboxSel.includes(opt.id)}
                onClick={() => handleCheckbox(opt.id)}
              >
                {opt.label}
              </CheckboxButton>
            ))}
          </div>
        )}

        {/* ── Q Variant: Location ────────────────────────────────────────── */}
        {!isLeadStep && question!.variant === 'location' && (
          <div className="space-y-4 flex-1">
            {/* State dropdown */}
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-brand-silver font-mono mb-2">
                State <span className="text-brand-accent">*</span>
              </label>
              <div className="relative">
                <select
                  value={locState}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocState(e.target.value)}
                  className={clsx(
                    'w-full appearance-none px-4 py-4 pr-10 rounded-xl text-sm transition-all touch-target',
                    'glass text-brand-white focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer',
                    !locState && 'text-brand-silver'
                  )}
                >
                  <option value="" className="bg-brand-navy text-brand-silver">Select your state…</option>
                  {US_STATES.map(s => (
                    <option key={s} value={s} className="bg-brand-navy text-brand-white">{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-silver pointer-events-none" />
              </div>
            </div>

            {/* City / service area */}
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-brand-silver font-mono mb-2">
                City or service area <span className="text-brand-silver/50">(optional)</span>
              </label>
              <input
                type="text"
                value={locCity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocCity(e.target.value)}
                placeholder="e.g. Austin, Greater Dallas area"
                className="w-full px-4 py-4 rounded-xl text-sm glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent touch-target"
              />
            </div>

            <p className="text-[11px] text-brand-silver/60 leading-relaxed">
              Your location helps personalise your roadmap. State is required; city or service area is optional and improves your results.
            </p>
          </div>
        )}

        {/* ── Lead capture step ──────────────────────────────────────────── */}
        {isLeadStep && (
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-brand-silver font-mono mb-2">
                First name <span className="text-brand-accent">*</span>
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadName(e.target.value)}
                placeholder="e.g. Marcus"
                autoComplete="given-name"
                className="w-full px-4 py-4 rounded-xl text-sm glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent touch-target"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase text-brand-silver font-mono mb-2">
                Email address <span className="text-brand-accent">*</span>
              </label>
              <input
                type="email"
                value={leadEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setLeadEmail(e.target.value); setLeadError('') }}
                placeholder="you@example.com"
                autoComplete="email"
                className={clsx(
                  'w-full px-4 py-4 rounded-xl text-sm glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 touch-target',
                  leadError ? 'ring-1 ring-red-400 focus:ring-red-400' : 'focus:ring-brand-accent'
                )}
              />
              {leadError && <p className="text-red-400 text-[11px] mt-1">{leadError}</p>}
            </div>

            {/* Reassurance */}
            <div className="glass-light rounded-xl p-4 mt-2">
              <p className="text-[11px] text-brand-silver leading-relaxed">
                Your results are saved in this browser on your device. See our{' '}
                <a href="/privacy" className="underline underline-offset-2">privacy policy</a> for how
                your information is handled.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="pt-1">
              <p className="text-[10px] text-brand-silver/50 leading-relaxed mb-1.5">
                SubZeroMetrix provides educational scoring only. Results do not constitute legal,
                financial, tax, insurance, licensing, or lending advice. No outcomes are guaranteed.
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {[
                  ['Privacy Policy', '/privacy'],
                  ['Terms', '/terms'],
                  ['Disclaimer', '/disclaimer'],
                ].map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-brand-silver/60 hover:text-brand-accent underline underline-offset-2 transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Continue / Submit button ─────────────────────────────────────── */}
      <div className="px-5 pb-8 pt-4 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue() || submitting}
          className={clsx(
            'flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all touch-target',
            canContinue() && !submitting
              ? 'bg-brand-accent text-white shadow-glow-blue active:scale-95'
              : 'bg-brand-blue text-brand-silver/40 cursor-not-allowed'
          )}
        >
          {submitting ? (
            <>
              Calculating…
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            </>
          ) : isLeadStep ? (
            <>
              Get My MetrixScore <CheckCircle2 className="w-4 h-4" />
            </>
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-brand-silver mt-3">
          {isLeadStep
            ? 'Your score is calculated and held — unlock the full report for $9.99'
            : step < TOTAL_QUESTIONS - 1
            ? `${TOTAL_QUESTIONS - step - 1} question${TOTAL_QUESTIONS - step - 1 === 1 ? '' : 's'} remaining`
            : 'Final question — then enter your details'}
        </p>
      </div>
    </main>
  )
}
