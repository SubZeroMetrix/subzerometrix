// ─────────────────────────────────────────────────────────────────────────────
// metrix/priority — Module 6: priority seed (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Projects the kernel's recommended path (which already applied the stage rule + the
// biggest-challenge / main-goal tiebreak in metrixReport.applyChallengeTiebreak) into
// the canonical priority seed. The rationale string keeps the focus explainable.
// Pure — no new ranking math here.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixScore } from '../metrixEngine'
import type { PrioritySeed } from './profileTypes'

export function derivePrioritySeed(score: MetrixScore): PrioritySeed {
  const p = score.recommendedPath
  return {
    focusCategory: p.focusCategory,
    focusLabel: p.focusLabel,
    rationale: p.rationale,
    path: p,
  }
}
