// ─────────────────────────────────────────────────────────────────────────────
// emailCapture — Growth-8: consent-first marketing/nurture interest capture
// ─────────────────────────────────────────────────────────────────────────────
// Collects an EXPLICITLY-CONSENTED email + optional context from public pages and
// inserts it into the narrowly-scoped public.marketing_subscriptions table (migration
// 003) via the browser ANON client (INSERT-only RLS; consent enforced by CHECK).
//
// HONESTY + SAFETY
//   • Consent is required — a record is never built/sent unless consentToEmail === true.
//   • No service-role key, no admin API. The anon client + INSERT-only policy means the
//     public cannot read/list/update/delete subscribers.
//   • Stores NO passwords, API keys, SSNs, banking details, private notes, assessment
//     answers, MetrixScore™ values, roadmap progress, or Foundation Builder notes.
//   • Returns honest statuses; 'subscribed' ONLY after a confirmed insert. If the table
//     is not applied yet → 'unavailable' (the UI never claims a save that did not happen).
//   • No email is sent here — no delivery provider is configured (documented).
//   • Dependency-free validation (trim/normalize, format, length, allowed trade/state,
//     honeypot). User input is never interpolated into HTML or SQL (parameterized insert).
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase } from './supabaseClient'

const TABLE = 'marketing_subscriptions'

// Versioned consent copy — store the exact text the user agreed to.
export const CONSENT_TEXT_VERSION = 'v1-2026-06'
export const CONSENT_TEXT =
  'I agree to receive educational contractor-business emails and product updates from ' +
  'The Modern Trades Mentor LLC and SubZeroMetrix™. I can unsubscribe at any time.'

export const ALLOWED_TRADES = [
  'hvac', 'electrical', 'plumbing', 'roofing', 'construction',
  'handyman', 'landscaping', 'cleaning', 'painting', 'solar',
] as const
export type AllowedTrade = typeof ALLOWED_TRADES[number]

export const ALLOWED_STATES = [
  'Florida', 'Colorado', 'Texas', 'Arizona', 'Ohio', 'North Carolina',
] as const
export type AllowedState = typeof ALLOWED_STATES[number]

export type MarketingStatus = 'subscribed' | 'unsubscribed' | 'bounced' | 'suppressed'

export interface EmailCaptureInput {
  email: string
  firstName?: string
  selectedTrade?: string
  selectedState?: string
  sourcePage?: string
  sourceIntent?: string
  resourceRequested?: string
  consentToEmail: boolean
  locale?: string
  honeypot?: string   // hidden field; must be empty
}

export type EmailCaptureStatus =
  | 'subscribed'    // confirmed new insert
  | 'already'       // duplicate email (existing record; not modified)
  | 'invalid'       // failed validation (generic, user-safe)
  | 'unavailable'   // table/migration not applied, or Supabase not configured
  | 'error'         // unexpected failure

export interface EmailCaptureResult {
  status: EmailCaptureStatus
  message?: string  // generic, user-safe
}

const MAX = { email: 254, firstName: 80, resource: 120 }

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  if (email.length === 0 || email.length > MAX.email) return false
  // Conservative, dependency-free format check.
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

function cleanOptional(value: string | undefined, max: number): string | null {
  if (!value) return null
  const t = value.trim()
  if (t === '' || t.length > max) return t === '' ? null : t.slice(0, max)
  return t
}

function isMissingTable(err: { code?: string; message?: string } | null): boolean {
  const code = err?.code ?? ''
  const message = err?.message ?? ''
  return code === '42P01' || /does not exist|schema cache|could not find the table|find the table/i.test(message)
}

function isUniqueViolation(err: { code?: string; message?: string } | null): boolean {
  return (err?.code ?? '') === '23505' || /duplicate key|unique constraint/i.test(err?.message ?? '')
}

/**
 * Validate + insert a consented subscription. Never throws. Returns 'subscribed' only on
 * a confirmed insert; 'unavailable' when the table is not applied; 'already' on duplicate.
 */
export async function submitEmailCapture(input: EmailCaptureInput): Promise<EmailCaptureResult> {
  // Honeypot — silently treat bots as a generic failure without storing anything.
  if (input.honeypot && input.honeypot.trim() !== '') {
    return { status: 'invalid', message: 'Please try again.' }
  }
  // Explicit consent is mandatory.
  if (input.consentToEmail !== true) {
    return { status: 'invalid', message: 'Please confirm consent to continue.' }
  }
  const email = normalizeEmail(input.email ?? '')
  if (!isValidEmail(email)) {
    return { status: 'invalid', message: 'Enter a valid email address.' }
  }
  const firstName = cleanOptional(input.firstName, MAX.firstName)
  const selectedTrade = input.selectedTrade && (ALLOWED_TRADES as readonly string[]).includes(input.selectedTrade)
    ? input.selectedTrade : null
  const selectedState = input.selectedState && (ALLOWED_STATES as readonly string[]).includes(input.selectedState)
    ? input.selectedState : null

  const supabase = getBrowserSupabase()
  if (!supabase) return { status: 'unavailable', message: 'Sign-ups are not available right now.' }

  const row = {
    email: input.email.trim().slice(0, MAX.email),
    email_normalized: email,
    first_name: firstName,
    selected_trade: selectedTrade,
    selected_state: selectedState,
    source_page: cleanOptional(input.sourcePage, 120),
    source_intent: cleanOptional(input.sourceIntent, 160),
    resource_requested: cleanOptional(input.resourceRequested, MAX.resource),
    consent_to_email: true,
    consent_text_version: CONSENT_TEXT_VERSION,
    consent_timestamp: new Date().toISOString(),
    locale: cleanOptional(input.locale, 12),
    status: 'subscribed' as MarketingStatus,
  }

  try {
    const { error } = await supabase.from(TABLE).insert(row)
    if (!error) return { status: 'subscribed' }
    if (isUniqueViolation(error)) {
      // Existing record — do NOT modify it (never silently re-subscribe). Neutral message.
      return { status: 'already', message: "Thanks — you're all set." }
    }
    if (isMissingTable(error)) {
      return { status: 'unavailable', message: 'Sign-ups are not available right now.' }
    }
    return { status: 'error', message: 'Something went wrong. Please try again later.' }
  } catch {
    return { status: 'error', message: 'Something went wrong. Please try again later.' }
  }
}
