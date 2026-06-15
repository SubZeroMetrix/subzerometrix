// ─────────────────────────────────────────────────────────────────────────────
// Wave 9 CP5 — accessibility / performance / quality (Node runner).
// Locks the shipped a11y/quality foundations: reduced-motion handling, visible focus, 44px touch
// targets, skip-link + main landmark in the shell, and the brightened readability contrast token.
// Source inspection — no DOM/browser needed.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('cp5: reduced-motion is respected (WCAG 2.3.3 / 2.2.2)', () => {
  const css = read('src/app/globals.css')
  assert.ok(/@media \(prefers-reduced-motion: reduce\)/.test(css))
  assert.ok(/animation-duration: 0\.01ms !important/.test(css))
})

test('cp5: visible focus styles exist', () => {
  const css = read('src/app/globals.css')
  assert.ok(/:focus-visible\s*\{[\s\S]*outline:/.test(css))
})

test('cp5: touch targets meet 44px minimum', () => {
  const css = read('src/app/globals.css')
  assert.ok(/\.touch-target\s*\{[\s\S]*min-height: 44px/.test(css))
})

test('cp5: the app shell provides a skip link and a main landmark', () => {
  const shell = read('src/components/shell/AppShell.tsx')
  assert.ok(/Skip to content/.test(shell), 'skip link present')
  assert.ok(/<main id="main"/.test(shell), 'main landmark present')
})

test('cp5: the readability contrast token is the brightened value (silver #C2CEDE)', () => {
  const cfg = read('tailwind.config.ts')
  assert.ok(/silver:\s*'#C2CEDE'/.test(cfg), 'brightened silver token active')
  assert.ok(/white:\s*'#F4F7FB'/.test(cfg), 'heading white preserved (hierarchy)')
  assert.ok(/navy:\s*'#0A1628'/.test(cfg), 'dark-blue brand background preserved')
})

test('cp5: production build artifacts are not committed (build health hygiene)', () => {
  // .next and dist are build outputs; they must be gitignored, never tracked.
  const ignore = read('.gitignore')
  assert.ok(/\.next/.test(ignore))
  assert.ok(/dist/.test(ignore))
})
