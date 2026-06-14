// ─────────────────────────────────────────────────────────────────────────────
// shell/AppShell — Wave 7 Checkpoint 2: the route-preserving application shell
// ─────────────────────────────────────────────────────────────────────────────
// One wrapper that gives every surface a consistent header, main landmark, and footer while
// adapting to the surface type. Variants mirror the `shell` field in ROUTE_INVENTORY
// (public · content · dashboard · results · directory). It is a LAYOUT wrapper only — it adds
// no business logic, removes no route, and reads no canonical engine. Server component.
//
// This shell is consumed by the new flag-gated presentation paths (Checkpoints 3–8); existing
// pages are NOT forced through it until parity is verified, so production behavior is unchanged
// while `presentation_shell` is OFF.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'

export type ShellVariant = 'public' | 'content' | 'dashboard' | 'results' | 'directory'

const MAIN_WIDTH: Record<ShellVariant, string> = {
  public: '', // full-bleed marketing sections manage their own width
  content: 'max-w-2xl mx-auto px-5',
  dashboard: 'max-w-5xl mx-auto px-5',
  results: 'max-w-md mx-auto px-5',
  directory: 'max-w-5xl mx-auto px-5',
}

export default function AppShell({
  children,
  variant = 'public',
  header = true,
  footer = true,
  mainClassName = '',
}: {
  children: ReactNode
  variant?: ShellVariant
  header?: boolean
  footer?: boolean
  mainClassName?: string
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-brand-navy overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-brand-accent focus:text-white focus:rounded-sm"
      >
        Skip to content
      </a>
      {header ? <PublicHeader /> : null}
      <main id="main" className={`flex-1 ${MAIN_WIDTH[variant]} ${mainClassName}`.trim()}>
        {children}
      </main>
      {footer ? <PublicFooter /> : null}
    </div>
  )
}
