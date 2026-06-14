// ─────────────────────────────────────────────────────────────────────────────
// ui/presentationState — Wave 7: pure state → display descriptor mappers
// ─────────────────────────────────────────────────────────────────────────────
// Maps the ALREADY-DERIVED canonical state strings exposed by `canonicalPresentation`
// (confidence/coverage level, evidence quality, freshness category, sync status, risk level)
// to honest, consistent display descriptors. It NEVER recomputes a score, priority, or
// confidence value — it only chooses a label + visual tone for a value the canonical layer
// already produced. Pure, deterministic, defensive (unknown input → neutral 'unknown').
// No React; SSR-safe; covered by wave7-presentation-state.test.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { PresentationSyncStatus } from '../metrix/canonicalPresentation'
import { scoreBand } from './tokens'

export const PRESENTATION_STATE_VERSION = 1

/**
 * Map any sync-status vocabulary a surface uses (e.g. the `SyncStatus` union:
 * 'saved_on_device' | 'synced_to_account' | …) to the canonical `PresentationSyncStatus`
 * the presentation adapter consumes. Defensive: unknown values become 'unknown'.
 */
export function toPresentationSyncStatus(raw?: string): PresentationSyncStatus {
  switch ((raw ?? '').trim().toLowerCase()) {
    case 'synced':
    case 'synced_to_account':
      return 'synced'
    case 'pending':
    case 'saving':
    case 'syncing':
      return 'pending'
    case 'offline':
      return 'offline'
    case 'conflict':
      return 'conflict'
    case 'local_only':
    case 'local':
    case 'saved_on_device':
      return 'local_only'
    default:
      return 'unknown'
  }
}

/** Visual tone vocabulary shared by every state pill / alert / badge. */
export type Tone = 'positive' | 'caution' | 'critical' | 'info' | 'neutral'

export interface StateDescriptor {
  /** Short, honest label for the state (e.g. "Verified fresh", "Working offline"). */
  label: string
  /** Visual tone the UI maps to color. */
  tone: Tone
  /** One plain-language sentence; safe to show in a tooltip or helper line. */
  description: string
}

function norm(s: unknown): string {
  return typeof s === 'string' ? s.trim().toLowerCase() : ''
}

// ── Confidence / coverage level ──────────────────────────────────────────────────
// Canonical `confidence.coverageLevel` / evidence quality are categorical: high|medium|low.
// Honest rule (Wave 2): never present inferred-only evidence as high confidence — that honesty
// is enforced upstream; here we only translate the categorical value the engine emitted.
export function confidencePresentation(level: unknown): StateDescriptor {
  switch (norm(level)) {
    case 'high':
      return { label: 'High confidence', tone: 'positive', description: 'Based on answers you confirmed.' }
    case 'medium':
      return { label: 'Medium confidence', tone: 'info', description: 'Partly inferred — confirming a few answers will sharpen this.' }
    case 'low':
      return { label: 'Low confidence', tone: 'caution', description: 'Mostly inferred from limited answers.' }
    default:
      return { label: 'Confidence unknown', tone: 'neutral', description: 'Not enough information yet.' }
  }
}

// ── Source freshness ─────────────────────────────────────────────────────────────
// Canonical `confidence.freshnessCategory` / licensing freshness: fresh|aging|stale|unknown.
export function freshnessPresentation(category: unknown): StateDescriptor {
  switch (norm(category)) {
    case 'fresh':
      return { label: 'Recently reviewed', tone: 'positive', description: 'Reviewed within the freshness window.' }
    case 'aging':
      return { label: 'Review due soon', tone: 'info', description: 'Still current, but due for re-review.' }
    case 'stale':
      return { label: 'Needs re-review', tone: 'caution', description: 'Past its review window — verify before acting.' }
    default:
      return { label: 'Freshness unknown', tone: 'neutral', description: 'No reviewed date on record — verify before acting.' }
  }
}

// ── Sync status ──────────────────────────────────────────────────────────────────
// Canonical PresentationSyncStatus: synced|pending|offline|conflict|local_only|unknown.
export function syncPresentation(status: unknown): StateDescriptor {
  switch (norm(status)) {
    case 'synced':
      return { label: 'Synced', tone: 'positive', description: 'Saved to your account and this device.' }
    case 'pending':
      return { label: 'Saving…', tone: 'info', description: 'Changes are being synced to your account.' }
    case 'offline':
      return { label: 'Working offline', tone: 'caution', description: 'Saved on this device; will sync when you reconnect.' }
    case 'conflict':
      return { label: 'Sync conflict', tone: 'critical', description: 'This device and your account differ — review which to keep.' }
    case 'local_only':
      return { label: 'Saved on this device', tone: 'info', description: 'Not synced to an account yet.' }
    default:
      return { label: 'Sync status unknown', tone: 'neutral', description: 'Sync state is not available.' }
  }
}

// ── Risk level (MetrixScore riskLevel) ───────────────────────────────────────────
// Canonical `score.riskLevel`. Tolerant of the common vocabularies the engine may emit.
export function riskPresentation(riskLevel: unknown): StateDescriptor {
  const r = norm(riskLevel)
  if (['low', 'strong', 'healthy', 'minimal'].includes(r)) {
    return { label: 'Lower risk', tone: 'positive', description: 'Your foundation is comparatively solid here.' }
  }
  if (['medium', 'moderate', 'caution', 'watch'].includes(r)) {
    return { label: 'Moderate risk', tone: 'caution', description: 'Some gaps to close before they compound.' }
  }
  if (['high', 'elevated', 'severe', 'critical'].includes(r)) {
    return { label: 'Higher risk', tone: 'critical', description: 'Address these gaps before they cost you.' }
  }
  return { label: 'Risk unknown', tone: 'neutral', description: 'Not enough information to read risk yet.' }
}

// ── Score band → temperature descriptor ──────────────────────────────────────────
// Translates the canonical overall score into the temperature identity (display only).
export function scorePresentation(overall: number): StateDescriptor & { color: string } {
  const band = scoreBand(overall)
  const toneByBand: Record<string, Tone> = {
    sub_zero: 'critical',
    cold: 'caution',
    warm: 'info',
    hot: 'positive',
    superheated: 'positive',
  }
  return {
    label: band.label,
    tone: toneByBand[band.key] ?? 'neutral',
    description: `MetrixScore band ${band.min}–${band.max}.`,
    color: band.color,
  }
}

/** Tailwind class fragments for a tone — used by StatePill / Alert / Badge. */
export function toneClasses(tone: Tone): { text: string; border: string; bg: string; dot: string } {
  switch (tone) {
    case 'positive':
      return { text: 'text-emerald-300', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' }
    case 'caution':
      return { text: 'text-amber-300', border: 'border-amber-400/30', bg: 'bg-amber-400/10', dot: 'bg-amber-400' }
    case 'critical':
      return { text: 'text-red-300', border: 'border-red-400/30', bg: 'bg-red-400/10', dot: 'bg-red-400' }
    case 'info':
      return { text: 'text-brand-accent', border: 'border-brand-accent/30', bg: 'bg-brand-accent/10', dot: 'bg-brand-accent' }
    default:
      return { text: 'text-brand-silver', border: 'border-brand-silver/20', bg: 'bg-brand-silver/5', dot: 'bg-brand-silver' }
  }
}
