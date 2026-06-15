// ─────────────────────────────────────────────────────────────────────────────
// metrix/profileSources — Wave 9 CP2: the SINGLE canonical reader for profile signals
// ─────────────────────────────────────────────────────────────────────────────
// One shared, defensive reader for the trade and state/jurisdiction signal off a profile snapshot,
// so licensing, trade intelligence, routing, and any future consumer resolve the SAME canonical
// value with the SAME precedence. Previously this logic was duplicated (identically) in
// licensingIntelligence and tradeIntelligence; unifying it removes the risk that the two copies
// silently diverge.
//
// PRECEDENCE (deterministic, highest → lowest):
//   trade:  businessContext.trade → normalizedAnswers.trade → rawAnswers.business_type
//   state:  businessContext.region → normalizedAnswers.region → rawAnswers.location.state
//
// An explicit, later trade/state answer (which the snapshot builder writes into businessContext /
// normalizedAnswers) therefore ALWAYS wins over the legacy `business_type` value. When no signal is
// present the reader returns `null` — it never invents or defaults a value (no silent Electrical /
// first-option default). Pure; never throws.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'

function nonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== ''
}

/** The best available raw trade signal off the snapshot, or null. Never defaults. */
export function readTradeSource(s: MetrixProfileSnapshot): string | null {
  const ctx = s?.businessContext?.trade
  if (nonEmpty(ctx)) return ctx
  const norm = s?.normalizedAnswers?.trade
  if (nonEmpty(norm)) return norm
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as { business_type?: unknown }
  if (nonEmpty(raw.business_type)) return raw.business_type
  return null
}

/** The best available raw state/jurisdiction signal off the snapshot, or null. Never defaults. */
export function readStateSource(s: MetrixProfileSnapshot): string | null {
  const ctx = s?.businessContext?.region
  if (nonEmpty(ctx)) return ctx
  const norm = s?.normalizedAnswers?.region
  if (nonEmpty(norm)) return norm
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as { location?: { state?: unknown } }
  const st = raw.location?.state
  if (nonEmpty(st)) return st
  return null
}
