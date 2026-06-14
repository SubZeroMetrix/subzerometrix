// ─────────────────────────────────────────────────────────────────────────────
// Wave 7 CP12 — accessibility / performance / responsive quality (code-level, Node runner).
// Deterministic source-level assertions that protect the presentation layer:
//   • reduced-motion support, touch targets, visible focus, skip-link + main landmark
//   • shared presentational primitives stay SERVER components (no needless client JS)
//   • the pricing surface keeps a valid heading structure and ships no client bundle
// These are automated checks only; assistive-technology + real-device review remain Wave 10A.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

// ── 1. Global accessibility primitives ───────────────────────────────────────────
test('a11y: globals provide reduced-motion, touch targets, and visible focus', () => {
  const css = read('src/app/globals.css')
  assert.ok(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css), 'reduced-motion media query present')
  assert.ok(/min-height:\s*44px/.test(css), 'touch-target min size present')
  assert.ok(/:focus-visible/.test(css), 'visible focus style present')
  // Reduced-motion must un-hide reveal/fade content so nothing stays invisible.
  const rm = css.slice(css.indexOf('prefers-reduced-motion'))
  assert.ok(/opacity:\s*1\s*!important/.test(rm), 'reveal/fade content forced visible under reduced motion')
})

// ── 2. App shell landmarks + skip navigation ─────────────────────────────────────
test('a11y: app shell exposes a skip link and a main landmark', () => {
  const shell = read('src/components/shell/AppShell.tsx')
  assert.ok(/Skip to content/.test(shell), 'skip link present')
  assert.ok(/<main\b/.test(shell) && /id="main"/.test(shell), 'main landmark present and targeted by skip link')
})

// ── 3. Shared presentational primitives stay server components (perf) ─────────────
test('perf: shared presentation primitives are server components (no client JS)', () => {
  for (const f of [
    'src/components/ui/index.tsx',
    'src/components/shell/AppShell.tsx',
    'src/components/shell/PublicFooter.tsx',
    'src/components/pricing/PricingTiers.tsx',
    'src/app/pricing/page.tsx',
  ]) {
    const src = read(f)
    assert.ok(!/^\s*['"]use client['"]/m.test(src), `${f} should not be a client component`)
  }
})

// ── 4. Pricing surface heading structure + decorative icons ──────────────────────
test('a11y: pricing presentation has a grouped heading structure', () => {
  const tiers = read('src/components/pricing/PricingTiers.tsx')
  assert.ok(/<h2[^>]*>Plans<\/h2>|<h2[^>]*className="sr-only"[^>]*>Plans/.test(tiers), 'plans group heading present')
  assert.ok(/<h3\b/.test(tiers), 'per-plan headings present')
  // Lucide icons used for decoration must be hidden from assistive tech.
  assert.ok(/aria-hidden="true"/.test(tiers), 'decorative icons hidden from screen readers')
})
