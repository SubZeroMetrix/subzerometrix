// ─────────────────────────────────────────────────────────────────────────────
// ui/tokens — Wave 7: the single TypeScript source for the industrial brand system
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the existing Tailwind palette (tailwind.config.ts) and globals.css custom
// properties so components AND tests can reference one canonical set of tokens instead of
// re-typing hex values. PRESERVES the established navy / silver / temperature / measurement
// identity — it does not invent a new palette. Pure data; SSR-safe; no React.
// ─────────────────────────────────────────────────────────────────────────────

export const UI_TOKENS_VERSION = 1

/** Industrial navy → silver brand palette (identical to tailwind `brand.*`). */
export const BRAND = {
  navy: '#0A1628',
  blue: '#0D2B5C',
  mid: '#1A4080',
  silver: '#A8B8CC',
  light: '#D4E0EE',
  white: '#F4F7FB',
  accent: '#4A90D9',
  ice: '#E8F0F9',
} as const

/**
 * Temperature scale — the measurement identity that runs Sub-Zero → Superheated.
 * Ordered cold→hot; `stop` is the gradient position used by the `.temp-bar` utility.
 */
export const TEMPERATURE = [
  { key: 'sub_zero', label: 'Sub-Zero', color: '#4A90D9', stop: 0 },
  { key: 'cold', label: 'Cold', color: '#85B7EB', stop: 25 },
  { key: 'warm', label: 'Warm', color: '#EF9F27', stop: 55 },
  { key: 'hot', label: 'Hot', color: '#E8593C', stop: 80 },
  { key: 'superheated', label: 'Superheated', color: '#E24B4A', stop: 100 },
] as const

export type TemperatureKey = (typeof TEMPERATURE)[number]['key']

/** The five canonical MetrixScore bands (0–100), cold→hot, with their temperature color. */
export function scoreBand(overall: number): {
  key: TemperatureKey
  label: string
  color: string
  min: number
  max: number
} {
  const n = Number.isFinite(overall) ? Math.max(0, Math.min(100, overall)) : 0
  if (n < 30) return { key: 'sub_zero', label: 'Sub-Zero', color: '#4A90D9', min: 0, max: 29 }
  if (n < 50) return { key: 'cold', label: 'Cold', color: '#85B7EB', min: 30, max: 49 }
  if (n < 70) return { key: 'warm', label: 'Warm', color: '#EF9F27', min: 50, max: 69 }
  if (n < 85) return { key: 'hot', label: 'Hot', color: '#E8593C', min: 70, max: 84 }
  return { key: 'superheated', label: 'Superheated', color: '#E24B4A', min: 85, max: 100 }
}

/** Spacing scale (rem) — keeps section/container rhythm consistent across shells. */
export const SPACE = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const

/** Shared container max-widths. The app is mobile-first (`narrow` = the current `max-w-md`). */
export const CONTAINER = {
  narrow: '28rem', // max-w-md — matches the existing mobile-first layout
  base: '42rem', // max-w-2xl — content/Learn reading width
  wide: '64rem', // max-w-5xl — dashboard / directory grids
} as const
