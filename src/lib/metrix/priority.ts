// ─────────────────────────────────────────────────────────────────────────────
// metrix/priority — Module 6: priority seed (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Projects the kernel's recommended path (which already applied the stage rule + the
// biggest-challenge / main-goal tiebreak in metrixReport.applyChallengeTiebreak) into
// the canonical priority seed. The rationale string keeps the focus explainable.
// Pure — no new ranking math here.
// ─────────────────────────────────────────────────────────────────────────────

import { CATEGORY_LABELS, type MetrixScore, type RecommendedPath } from '../metrixEngine'
import type { PrioritySeed, MetrixPriority } from './profileTypes'

export function derivePrioritySeed(score: MetrixScore): PrioritySeed {
  const p = score.recommendedPath
  return {
    focusCategory: p.focusCategory,
    focusLabel: p.focusLabel,
    rationale: p.rationale,
    path: p,
  }
}

// SZM-2: align the legacy prioritySeed / recommendedPath with the authoritative Metrix
// Priority so there is ONE priority surfaced through both the rich and legacy shapes. The
// path archetype id/label stays stage-derived (from the kernel); focus + rationale come
// from the selected priority. No competing recomputation.
export function prioritySeedFromPriority(
  priority: MetrixPriority,
  kernelPath: RecommendedPath,
): PrioritySeed {
  const focusCategory = priority.domainCategory
  const focusLabel = CATEGORY_LABELS[focusCategory]
  return {
    focusCategory,
    focusLabel,
    rationale: priority.rationale,
    path: { ...kernelPath, focusCategory, focusLabel, rationale: priority.rationale },
  }
}
