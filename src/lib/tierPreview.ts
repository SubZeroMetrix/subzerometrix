// ─────────────────────────────────────────────────────────────────────────────
// Tier Preview — truthful Free → Pro → Lifetime upgrade-framing data (Phase 1.11B)
// ─────────────────────────────────────────────────────────────────────────────
// Pure data/model only. NO UI, checkout, payment, Stripe, Supabase, auth, scoring,
// roadmap, report-gating, or DEV_UNLOCK is touched or imported in a behavior-
// changing way. This is the single honest source of truth for how each tier may be
// described BEFORE any tier UI is wired.
//
// Three buckets keep upgrade copy honest:
//   • availableNow      — built and usable TODAY (safe to present as a real benefit)
//   • futureFacing      — planned / future modules, described as "coming later" only
//   • notYetAvailable   — named in tier definitions but blocked on auth/persistence
//                         or simply not built; MUST NOT be shown as available today
//
// Built Pro tool data is read from getTier2Tools() (the real packaged artifacts) and
// future modules are read from educationContentMap buildStatus === 'future', so this
// file stays accurate as those sources change. membershipTiers supplies canonical
// names/positioning/CTA only — its `included` bullets are NOT blindly rendered,
// because several of them (saved profile, score history) require auth that does not
// exist yet.
// ─────────────────────────────────────────────────────────────────────────────

import { MEMBERSHIP_TIERS, type TierId } from './membershipTiers'
import { getTier2Tools, type Tier2Tool } from './tier2Tools'
import { EDUCATION_ASSETS } from './educationContentMap'

// ── Shape ───────────────────────────────────────────────────────────────────
export interface TierPreview {
  id: TierId
  label: string                 // canonical tier label (membershipTiers)
  positioning: string           // canonical positioning (membershipTiers)
  pricePositioning: string      // canonical price framing (membershipTiers)
  headline: string              // honest one-line framing for upgrade UI
  availableNow: string[]        // built + usable today
  futureFacing: string[]        // planned, described as future only
  notYetAvailable: string[]     // must NOT be claimed as available today
  trustSafeCopy: string         // honest supporting paragraph
  ctaLabel: string              // canonical CTA (membershipTiers)
}

// ── Words/claims that must never appear in available-now copy ─────────────────
// Used by getTierPreviewWarnings() to guard the availableNow lists.
export const DO_NOT_CLAIM: string[] = [
  'benchmarked',
  'predictive',
  'guaranteed',
  'peer benchmarking',
  'AI coach',
  'phone alerts',
  'approved vendors',
  'preferred vendors',
  'affiliate tools',
  'partner marketplace',
]

// ── Built Pro tools (the real packaged artifacts) ─────────────────────────────
/** The actual built Tier 2 tools — the truthful basis for "practical tools" copy. */
export function getBuiltProToolPreview(): Tier2Tool[] {
  return getTier2Tools()
}

// Future modules come straight from the content map's future-marked assets, so this
// list cannot drift out of sync with what is genuinely unbuilt.
function futureModuleTitles(): string[] {
  return EDUCATION_ASSETS.filter(a => a.buildStatus === 'future').map(a => a.title)
}

// ── Per-tier preview builders ─────────────────────────────────────────────────
function freePreview(): TierPreview {
  const t = MEMBERSHIP_TIERS.free_snapshot
  return {
    id: t.id,
    label: t.label,
    positioning: t.positioning,
    pricePositioning: t.pricePositioning,
    headline: 'See where your contracting business stands today — free.',
    availableNow: [
      'Starter MetrixScore™ (0–100)',
      'MetrixStage',
      'Profile completion %',
      'Top 3 strengths and top 3 risk areas',
      'Recommended path preview',
      'Your first 3 actions',
      'MetrixProfile™ context snapshot',
      'Browser-local snapshot (this device)',
    ],
    futureFacing: [
      'Saved cross-device MetrixProfile™ (with a future account)',
      'MetrixScore™ that grows more useful as your profile grows',
    ],
    notYetAvailable: [
      'Saved cloud profile',
      'Score history',
      'Cross-device profile',
      'Benchmarked score',
    ],
    trustSafeCopy:
      'Your Starter Snapshot is free and saved in this browser. It is a starting point, not a final, benchmarked, or predictive score, and it becomes more useful as your MetrixProfile™ grows.',
    ctaLabel: t.ctaLabel,
  }
}

function proPreview(): TierPreview {
  const t = MEMBERSHIP_TIERS.pro_roadmap
  const toolCount = getBuiltProToolPreview().length
  return {
    id: t.id,
    label: t.label,
    positioning: t.positioning,
    pricePositioning: t.pricePositioning,
    headline: 'Unlock the full roadmap and practical contractor tools.',
    availableNow: [
      'Full personalized roadmap',
      '12 growth phases with 30/60/90 plans',
      'Financial Systems Roadmap',
      'Sales Strategy Playbooks',
      'Social Media Starter Plan',
      `${toolCount} practical contractor tools (checklists, scripts, trackers)`,
      'Tool and vendor research library',
      'Choose-your-path action support (saved on this device)',
      'Risk explanations and category-level score detail',
    ],
    futureFacing: [
      'Saved MetrixProfile™ across devices (with a future account)',
      'MetrixScore™ history and reassessment history',
      'More trade-specific depth as your profile grows',
    ],
    notYetAvailable: [
      'Saved cloud MetrixProfile™',
      'Score history',
      'Cross-device sync',
      'True reassessment history',
      'AI coach',
      'Phone alerts',
      'PDF export',
      'Benchmarking or peer comparison',
      'Affiliate tools presented as an upsell',
    ],
    trustSafeCopy:
      'Unlock the full roadmap and practical contractor tools you can use today. Your score becomes more useful as your MetrixProfile™ grows.',
    ctaLabel: t.ctaLabel,
  }
}

function lifetimePreview(): TierPreview {
  const t = MEMBERSHIP_TIERS.lifetime_founder
  return {
    id: t.id,
    label: t.label,
    positioning: t.positioning,
    pricePositioning: t.pricePositioning,
    headline: 'Founding lifetime access, plus future modules as they are released.',
    availableNow: [
      'Everything available in Pro today',
      'Founding member positioning',
    ],
    // Genuinely future modules, pulled from the content map (buildStatus future).
    futureFacing: [
      ...futureModuleTitles(),
      'Long-term MetrixScore™ history (future)',
      'Long-term risk-reduction tracking (future)',
      'Future toolkit updates released to lifetime members',
    ],
    notYetAvailable: [
      'Current benchmarking',
      'Current predictive scoring',
      'Guaranteed outcomes',
      'Score history until accounts exist',
    ],
    trustSafeCopy:
      'Founding lifetime access to the SubZeroMetrix™ system, plus future modules and long-term history as they are released. Future items are clearly future-facing and are not available today. ' +
      (t.lifetimeDisclaimer ?? ''),
    ctaLabel: t.ctaLabel,
  }
}

// ── Registry ──────────────────────────────────────────────────────────────────
function buildAll(): Record<TierId, TierPreview> {
  return {
    free_snapshot: freePreview(),
    pro_roadmap: proPreview(),
    lifetime_founder: lifetimePreview(),
  }
}

// ── Public helpers ──────────────────────────────────────────────────────────
/** Preview data for a single tier. */
export function getTierPreview(tier: TierId): TierPreview {
  return buildAll()[tier]
}

/** All three tier previews, in display order (free → pro → lifetime). */
export function getTierPreviews(): TierPreview[] {
  const all = buildAll()
  return [all.free_snapshot, all.pro_roadmap, all.lifetime_founder]
}

export function getFreePreview(): TierPreview {
  return freePreview()
}
export function getProPreview(): TierPreview {
  return proPreview()
}
export function getLifetimePreview(): TierPreview {
  return lifetimePreview()
}

/** Items safe to present as real benefits today for a tier. */
export function getAvailableNowItems(tier: TierId): string[] {
  return getTierPreview(tier).availableNow
}

/** Items to describe as "coming later" only. */
export function getFutureFacingItems(tier: TierId): string[] {
  return getTierPreview(tier).futureFacing
}

/** Items that must NOT be shown as available today (auth/persistence-blocked or unbuilt). */
export function getNotYetAvailableItems(tier: TierId): string[] {
  return getTierPreview(tier).notYetAvailable
}

/**
 * Guardrail for future UI: returns a warning for any availableNow item that contains
 * a DO_NOT_CLAIM term. Should be empty for the honest data in this file. (Only the
 * availableNow lists are checked — disclaimer copy may legitimately negate these
 * words, e.g. "not a benchmarked or predictive score".)
 */
export function getTierPreviewWarnings(): string[] {
  const warnings: string[] = []
  for (const preview of getTierPreviews()) {
    for (const item of preview.availableNow) {
      for (const term of DO_NOT_CLAIM) {
        if (item.toLowerCase().includes(term.toLowerCase())) {
          warnings.push(`${preview.id}: availableNow item "${item}" uses disallowed claim "${term}"`)
        }
      }
    }
  }
  return warnings
}
