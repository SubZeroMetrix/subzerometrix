// ─────────────────────────────────────────────────────────────────────────────
// ui/IceCrystal — Wave 7: the shared SubZeroMetrix brand mark (extracted, single source)
// ─────────────────────────────────────────────────────────────────────────────
// The crystal/measurement mark was previously re-inlined on the homepage. Extracted here so
// every shell and surface renders the identical mark. Presentational; SSR-safe; no client JS.
// ─────────────────────────────────────────────────────────────────────────────

export default function IceCrystal({
  size = 56,
  accent = '#C8D4E0',
  title,
}: {
  size?: number
  accent?: string
  title?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <line x1="40" y1="6" x2="40" y2="74" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="40" x2="74" y2="40" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="68" y2="68" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="12" x2="12" y2="68" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="6" x2="33" y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="6" x2="47" y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="74" x2="33" y2="64" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="74" x2="47" y2="64" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="6" y1="40" x2="16" y2="33" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="6" y1="40" x2="16" y2="47" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="74" y1="40" x2="64" y2="33" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="74" y1="40" x2="64" y2="47" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="40" cy="40" r="7" fill="#0A1628" stroke={accent} strokeWidth="2" />
      <circle cx="40" cy="40" r="3.5" fill={accent} />
      <circle cx="40" cy="6" r="3" fill={accent} opacity="0.8" />
      <circle cx="40" cy="74" r="3" fill={accent} opacity="0.8" />
      <circle cx="6" cy="40" r="3" fill={accent} opacity="0.8" />
      <circle cx="74" cy="40" r="3" fill={accent} opacity="0.8" />
      <circle cx="12" cy="12" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="68" cy="68" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="68" cy="12" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="12" cy="68" r="2.5" fill={accent} opacity="0.6" />
    </svg>
  )
}
