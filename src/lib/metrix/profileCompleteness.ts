// ─────────────────────────────────────────────────────────────────────────────
// metrix/profileCompleteness — completeness, evidence confidence, known/unknown,
// and risks/needs/gaps (Wave 2, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Pure PROJECTIONS of the canonical snapshot. Completeness reuses the canonical
// profileQuality.coverage count (no new score). Evidence confidence is categorical and
// honest — it never returns 'high' while data is inferred-only. Known/unknown facts and
// risks/needs/gaps are read straight off the snapshot's intake, gates, constraints, and
// next-best-questions. Deterministic and defensive against malformed/legacy snapshots.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot, NormalizedIntake } from './profileTypes'
import type {
  ProfileCompleteness, EvidenceConfidence, KnownFact, ImportantUnknown,
  ProfileRisk, ProfileNeed, ProfileGap,
} from './intelligenceTypes'

const TOTAL_CRITERIA = 21

// ── Completeness ───────────────────────────────────────────────────────────────
export function deriveCompleteness(s: MetrixProfileSnapshot): ProfileCompleteness {
  const cov = s?.profileQuality?.coverage
  const answered = typeof cov?.answered === 'number' ? cov.answered : 0
  const total = typeof cov?.total === 'number' && cov.total > 0 ? cov.total : TOTAL_CRITERIA
  const level = cov?.level ?? 'minimal'
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0
  return { answered, total, percent, level }
}

// ── Evidence confidence (never 'high' while evidence is inferred-only) ──────────
export function deriveEvidenceConfidence(s: MetrixProfileSnapshot): EvidenceConfidence {
  const eq = s?.profileQuality?.evidenceQuality ?? 'inferred'
  const level = s?.profileQuality?.coverage?.level ?? 'minimal'
  if (eq === 'mixed' && level === 'substantial') return 'high'
  if (level === 'substantial') return 'medium'   // inferred/self-reported only → capped at medium
  if (level === 'minimal') return 'low'
  return 'medium'
}

// ── Known facts (answered intake context) ──────────────────────────────────────
const INTAKE_FIELD_LABELS: { key: keyof NormalizedIntake; label: string }[] = [
  { key: 'stage', label: 'Business stage' },
  { key: 'trade', label: 'Trade' },
  { key: 'region', label: 'Region' },
  { key: 'teamSize', label: 'Team size' },
  { key: 'mainGoal', label: 'Main goal' },
  { key: 'biggestChallenge', label: 'Biggest challenge' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'yearsInBusiness', label: 'Years in business' },
  { key: 'revenueRange', label: 'Revenue range' },
]

export function deriveKnownFacts(s: MetrixProfileSnapshot): KnownFact[] {
  const intake = s?.normalizedAnswers?.intake ?? null
  const out: KnownFact[] = []
  for (const f of INTAKE_FIELD_LABELS) {
    const v = intake ? intake[f.key] : null
    if (typeof v === 'string' && v.trim() !== '') out.push({ key: f.key, label: f.label, value: v })
  }
  return out
}

// ── Important unknowns (from next-best-questions + missing core intake) ─────────
export function deriveImportantUnknowns(s: MetrixProfileSnapshot): ImportantUnknown[] {
  const out: ImportantUnknown[] = []
  const seen = new Set<string>()

  // Curated unknowns first: the engine's next-best-questions (richest, ranked).
  for (const q of Array.isArray(s?.nextBestQuestions) ? s.nextBestQuestions : []) {
    if (seen.has(q.evidenceKey)) continue
    seen.add(q.evidenceKey)
    out.push({ key: q.evidenceKey, label: q.questionKey, reason: q.reason, impact: q.expectedDecisionImpact })
  }

  // Then any missing core intake fields that shape routing/roadmap.
  const intake = s?.normalizedAnswers?.intake ?? null
  const coreRouting: { key: keyof NormalizedIntake; label: string; impact: ImportantUnknown['impact'] }[] = [
    { key: 'trade', label: 'Trade', impact: 'refines_roadmap' },
    { key: 'region', label: 'Region', impact: 'refines_roadmap' },
    { key: 'stage', label: 'Business stage', impact: 'improves_confidence' },
  ]
  for (const f of coreRouting) {
    const v = intake ? intake[f.key] : null
    if ((v == null || v === '') && !seen.has(f.key)) {
      seen.add(f.key)
      out.push({ key: f.key, label: f.label, reason: `Your ${f.label.toLowerCase()} is not set; it personalizes your plan.`, impact: f.impact })
    }
  }
  return out
}

// ── Risks / needs / gaps ────────────────────────────────────────────────────────
export function deriveRisks(s: MetrixProfileSnapshot): ProfileRisk[] {
  const out: ProfileRisk[] = []
  // Triggered critical gates are the highest-confidence risks.
  for (const g of Array.isArray(s?.criticalGates) ? s.criticalGates : []) {
    if (g?.status === 'triggered') out.push({ id: g.id, label: g.title, severity: g.severity, source: 'gate' })
  }
  // Then top scored risk categories from readiness (display risks).
  for (const r of Array.isArray(s?.readiness?.risks) ? s.readiness.risks : []) {
    out.push({ id: `risk_${r.category}`, label: r.label, severity: r.severity, source: 'constraint' })
  }
  return out
}

export function deriveNeeds(s: MetrixProfileSnapshot): ProfileNeed[] {
  const p = s?.metrixPriority
  if (!p) return []
  const out: ProfileNeed[] = [
    { id: `need_${p.priorityId}`, label: p.requiredOutcome, reason: p.rationale },
  ]
  // Dependencies that should resolve alongside the primary priority.
  const gateById = new Map((Array.isArray(s?.criticalGates) ? s.criticalGates : []).map(g => [g.id, g]))
  for (const depId of Array.isArray(p.dependencies) ? p.dependencies : []) {
    const g = gateById.get(depId)
    if (g) out.push({ id: `need_${g.id}`, label: g.requiredOutcome, reason: `Resolve alongside your top priority (${g.title}).` })
  }
  return out
}

export function deriveGaps(s: MetrixProfileSnapshot): ProfileGap[] {
  const out: ProfileGap[] = []
  const seen = new Set<string>()
  // Unconfirmed gates (need evidence) are gaps in what we can assert.
  for (const g of Array.isArray(s?.criticalGates) ? s.criticalGates : []) {
    if ((g?.status === 'possible' || g?.status === 'unknown') && !seen.has(g.id)) {
      seen.add(g.id)
      out.push({ id: `gap_${g.id}`, label: g.title, reason: `Unconfirmed — ${g.missingEvidence?.[0] ?? 'needs confirming evidence'}.` })
    }
  }
  // Missing evidence the primary priority's first step expects.
  const firstStep = (Array.isArray(s?.primaryActionSteps) ? s.primaryActionSteps : [])[0]
  for (const ev of Array.isArray(firstStep?.evidenceRequested) ? firstStep!.evidenceRequested : []) {
    const id = `gap_evidence_${ev}`
    if (!seen.has(id)) { seen.add(id); out.push({ id, label: ev, reason: 'Evidence not yet provided for your first action.' }) }
  }
  return out
}
