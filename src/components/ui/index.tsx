// ─────────────────────────────────────────────────────────────────────────────
// ui — Wave 7 Checkpoint 2: the shared, presentational design-system primitives
// ─────────────────────────────────────────────────────────────────────────────
// One consistent vocabulary for typography, spacing, containers, cards, buttons, alerts,
// state pills (confidence / freshness / sync), disclosures, and the loading / empty / error /
// offline state blocks. All primitives are PRESENTATIONAL and SSR-safe (no 'use client', no
// event handlers) so they compose into server-rendered shells. Interactive surfaces import
// `buttonClasses` and apply their own handlers in client components.
//
// Identity preserved: industrial navy + silver, measurement/temperature accents, the
// `steel-border` / `glass` / `touch-target` utilities already defined in globals.css.
// Nothing here introduces a generic-SaaS / crypto / AI-hype look.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  AlertTriangle, CheckCircle2, Info, WifiOff, Inbox, RefreshCw, Loader2,
} from 'lucide-react'
import { CONTAINER } from '@/lib/ui/tokens'
import { toneClasses, type Tone, type StateDescriptor } from '@/lib/ui/presentationState'

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

// ── Layout ───────────────────────────────────────────────────────────────────────
type Width = keyof typeof CONTAINER

const WIDTH_CLASS: Record<Width, string> = {
  narrow: 'max-w-md',
  base: 'max-w-2xl',
  wide: 'max-w-5xl',
}

export function Container({
  children, width = 'narrow', className = '',
}: { children: ReactNode; width?: Width; className?: string }) {
  return <div className={cx(WIDTH_CLASS[width], 'mx-auto w-full px-5', className)}>{children}</div>
}

export function Section({
  children, className = '', as: Tag = 'section',
}: { children: ReactNode; className?: string; as?: 'section' | 'div' }) {
  return <Tag className={cx('py-12 sm:py-16', className)}>{children}</Tag>
}

// ── Typography ─────────────────────────────────────────────────────────────────────
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent', className)}>
      {children}
    </p>
  )
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cx('font-display text-brand-white leading-none', className)}
      style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}
    >
      {children}
    </h2>
  )
}

export function PageHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cx('font-display text-brand-white leading-none', className)}
      style={{ fontSize: 'clamp(2.4rem, 11vw, 3.6rem)', letterSpacing: '0.04em' }}
    >
      {children}
    </h1>
  )
}

export function Lead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-brand-silver text-[15px] leading-relaxed', className)}>{children}</p>
}

export function Rule({ className = '' }: { className?: string }) {
  return <div className={cx('w-10 h-px bg-brand-accent my-6', className)} />
}

// ── Buttons ────────────────────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const BASE_BTN =
  'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-[0.1em] uppercase ' +
  'transition-all active:scale-[0.98] touch-target disabled:opacity-50 disabled:pointer-events-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-brand-navy'

const VARIANT_BTN: Record<ButtonVariant, string> = {
  primary: 'bg-brand-accent text-white hover:bg-brand-mid',
  secondary: 'steel-border text-brand-silver hover:text-brand-white hover:border-brand-silver/40',
  ghost: 'text-brand-silver hover:text-brand-white',
}

const SIZE_BTN: Record<ButtonSize, string> = {
  md: 'py-3 px-5 text-[12px]',
  lg: 'py-4 px-6 text-[13px] w-full',
}

/** Shared button class string — usable by server links AND client `<button>` handlers. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = '',
): string {
  return cx(BASE_BTN, VARIANT_BTN[variant], SIZE_BTN[size], className)
}

/** Primary CTA as a Next link (server-safe). For onClick buttons, use `buttonClasses`. */
export function CTALink({
  href, children, variant = 'primary', size = 'lg', className = '', prefetch,
}: {
  href: string; children: ReactNode; variant?: ButtonVariant; size?: ButtonSize
  className?: string; prefetch?: boolean
}) {
  return (
    <Link href={href} prefetch={prefetch} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  )
}

// ── Cards ──────────────────────────────────────────────────────────────────────────
export function Card({
  children, className = '', tone,
}: { children: ReactNode; className?: string; tone?: Tone }) {
  const t = tone ? toneClasses(tone) : null
  return (
    <div
      className={cx(
        'rounded-sm p-5',
        t ? cx(t.bg, 'border', t.border) : 'steel-border bg-[rgba(13,43,92,0.25)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title, eyebrow, icon, className = '',
}: { title: ReactNode; eyebrow?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-start gap-3 mb-3', className)}>
      {icon ? <div className="flex-shrink-0 mt-0.5">{icon}</div> : null}
      <div className="min-w-0">
        {eyebrow ? <Eyebrow className="mb-1">{eyebrow}</Eyebrow> : null}
        <p className="text-sm font-semibold text-brand-white leading-tight">{title}</p>
      </div>
    </div>
  )
}

// ── Alerts / badges / state pills ────────────────────────────────────────────────
const ALERT_ICON: Record<Tone, typeof Info> = {
  positive: CheckCircle2,
  caution: AlertTriangle,
  critical: AlertTriangle,
  info: Info,
  neutral: Info,
}

export function Alert({
  tone = 'info', title, children, className = '',
}: { tone?: Tone; title?: ReactNode; children?: ReactNode; className?: string }) {
  const t = toneClasses(tone)
  const Icon = ALERT_ICON[tone]
  return (
    <div role={tone === 'critical' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-sm p-4 border', t.bg, t.border, className)}>
      <Icon className={cx('w-4 h-4 flex-shrink-0 mt-0.5', t.text)} aria-hidden="true" />
      <div className="text-[13px] leading-relaxed text-brand-silver">
        {title ? <p className={cx('font-semibold mb-0.5', t.text)}>{title}</p> : null}
        {children}
      </div>
    </div>
  )
}

export function Badge({
  tone = 'neutral', children, className = '',
}: { tone?: Tone; children: ReactNode; className?: string }) {
  const t = toneClasses(tone)
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase',
        t.bg, t.border, t.text, className,
      )}
    >
      {children}
    </span>
  )
}

/** A state pill driven by a presentationState descriptor (confidence/freshness/sync/risk). */
export function StatePill({ state, className = '' }: { state: StateDescriptor; className?: string }) {
  const t = toneClasses(state.tone)
  return (
    <span
      title={state.description}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase',
        t.bg, t.border, t.text, className,
      )}
    >
      <span className={cx('w-1.5 h-1.5 rounded-full', t.dot)} aria-hidden="true" />
      {state.label}
    </span>
  )
}

/** Native, no-JS disclosure (verify-before-action details, "why this", etc.). */
export function Disclosure({
  summary, children, className = '',
}: { summary: ReactNode; children: ReactNode; className?: string }) {
  return (
    <details className={cx('group steel-border rounded-sm', className)}>
      <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium text-brand-white flex items-center justify-between touch-target">
        <span>{summary}</span>
        <span className="text-brand-silver transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>
      <div className="px-4 pb-4 text-[13px] text-brand-silver leading-relaxed">{children}</div>
    </details>
  )
}

// ── Status blocks ────────────────────────────────────────────────────────────────
function StateBlock({
  icon, title, children, className = '',
}: { icon: ReactNode; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center text-center gap-3 rounded-sm steel-border p-8', className)}>
      <div className="text-brand-silver" aria-hidden="true">{icon}</div>
      <p className="text-sm font-semibold text-brand-white">{title}</p>
      {children ? <div className="text-[13px] text-brand-silver leading-relaxed max-w-xs">{children}</div> : null}
    </div>
  )
}

export function LoadingState({ label = 'Loading…', className = '' }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cx('flex items-center justify-center gap-3 py-10 text-brand-silver', className)}>
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      <span className="text-[13px]">{label}</span>
    </div>
  )
}

export function EmptyState({
  title = 'Nothing here yet', children, className = '',
}: { title?: ReactNode; children?: ReactNode; className?: string }) {
  return <StateBlock icon={<Inbox className="w-7 h-7" />} title={title} className={className}>{children}</StateBlock>
}

export function ErrorState({
  title = 'Something went wrong', children, className = '',
}: { title?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cx('', className)}>
      <StateBlock icon={<AlertTriangle className="w-7 h-7 text-red-300" />} title={title}>{children}</StateBlock>
    </div>
  )
}

export function OfflineState({
  title = 'Working offline', children, className = '',
}: { title?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <StateBlock icon={<WifiOff className="w-7 h-7" />} title={title} className={className}>
      {children ?? 'Your changes are saved on this device and will sync when you reconnect.'}
    </StateBlock>
  )
}

export function RetryNote({ className = '' }: { className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-1.5 text-[12px] text-brand-silver/70', className)}>
      <RefreshCw className="w-3 h-3" aria-hidden="true" /> Reload to try again.
    </p>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-sm bg-brand-silver/10', className)} aria-hidden="true" />
}
