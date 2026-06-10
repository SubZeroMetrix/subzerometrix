// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Growth Roadmap Config
// Shared temperature system constants used across the report UI.
// ─────────────────────────────────────────────────────────────────────────────

export type TempStatus = 'sub-zero' | 'cold' | 'warming' | 'hot'

export const TEMP_CONFIG: Record<TempStatus, { label: string; color: string; bg: string; barPct: number }> = {
  'sub-zero': { label: 'Sub-Zero', color: '#4A90D9', bg: 'rgba(74,144,217,0.12)',  barPct: 5   },
  'cold':     { label: 'Cold',     color: '#7BB3D9', bg: 'rgba(123,179,217,0.12)', barPct: 25  },
  'warming':  { label: 'Warming',  color: '#EF9F27', bg: 'rgba(239,159,39,0.12)',  barPct: 60  },
  'hot':      { label: 'Hot',      color: '#1D9E75', bg: 'rgba(29,158,117,0.12)',  barPct: 100 },
}

export const SCORE_IMPACT_PER_TAB = 1.5
