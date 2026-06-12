// ─────────────────────────────────────────────────────────────────────────────
// accountAuth — account identity via Supabase magic-link (Mega-Phase 3B)
// ─────────────────────────────────────────────────────────────────────────────
// Real, honest account-auth helpers built on the existing @supabase/supabase-js
// dependency and the browser anon client (supabaseClient.ts). NO new dependency.
//
// Honesty rules baked in:
//   • Never fakes a signed-in state.
//   • Returns 'unavailable' when Supabase is not configured / not in a browser.
//   • Never claims cloud sync works — this layer only establishes WHO the user is.
//   • SSR/build safe: no throws, no client on the server.
//
// Async functions are the real source of truth. A small synchronous cache lets
// sync consumers (metrixAccountSync) read the last-known account without faking it
// (it stays null/'unavailable' until a real async check runs).
// ─────────────────────────────────────────────────────────────────────────────

import type { Session, User } from '@supabase/supabase-js'
import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'

export type AccountAuthStatus = 'unavailable' | 'signed_out' | 'signed_in' | 'error'

export interface AccountUser {
  id: string
  email: string | null
}

export interface MagicLinkResult {
  ok: boolean
  status: AccountAuthStatus
  error?: string
}

// ── Synchronous last-known cache (never fakes signed-in) ──────────────────────
let cachedUser: AccountUser | null = null
let cachedStatus: AccountAuthStatus = 'unavailable'

function toAccountUser(user: User | null | undefined): AccountUser | null {
  if (!user) return null
  return { id: user.id, email: user.email ?? null }
}

/** Last-known account user without an async call (null until a real check runs). */
export function getCachedAccountUser(): AccountUser | null {
  return cachedUser
}

/** Last-known auth status without an async call. */
export function getCachedAuthStatus(): AccountAuthStatus {
  return cachedStatus
}

// ── Real async checks (source of truth; update the cache) ─────────────────────
export async function getCurrentAccountSession(): Promise<Session | null> {
  const supabase = getBrowserSupabase()
  if (!supabase) {
    cachedUser = null
    cachedStatus = 'unavailable'
    return null
  }
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      cachedStatus = 'error'
      return null
    }
    const session = data.session ?? null
    cachedUser = toAccountUser(session?.user)
    cachedStatus = cachedUser ? 'signed_in' : 'signed_out'
    return session
  } catch {
    cachedStatus = 'error'
    return null
  }
}

export async function getCurrentAccountUser(): Promise<AccountUser | null> {
  const session = await getCurrentAccountSession()
  return toAccountUser(session?.user)
}

export async function isAccountSignedIn(): Promise<boolean> {
  return (await getCurrentAccountUser()) !== null
}

export async function getAccountAuthStatus(): Promise<AccountAuthStatus> {
  if (!isSupabaseConfigured()) {
    cachedUser = null
    cachedStatus = 'unavailable'
    return 'unavailable'
  }
  await getCurrentAccountSession()
  return cachedStatus
}

/**
 * Request a passwordless magic-link / OTP email. A successful return means the
 * email was REQUESTED — the user is NOT signed in until they click the link.
 */
export async function requestMagicLink(email: string): Promise<MagicLinkResult> {
  const supabase = getBrowserSupabase()
  if (!supabase) {
    return { ok: false, status: 'unavailable', error: 'Account sign-in is not available yet.' }
  }
  const trimmed = email.trim()
  if (!trimmed || !trimmed.includes('@')) {
    return { ok: false, status: cachedStatus, error: 'Enter a valid email address.' }
  }
  try {
    const emailRedirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo },
    })
    if (error) {
      return { ok: false, status: 'error', error: error.message }
    }
    // Link sent. Not signed in yet — only after the user clicks it.
    return { ok: true, status: 'signed_out' }
  } catch (e) {
    return { ok: false, status: 'error', error: e instanceof Error ? e.message : 'Sign-in request failed.' }
  }
}

export async function signOutAccount(): Promise<void> {
  const supabase = getBrowserSupabase()
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch {
    // non-fatal
  }
  cachedUser = null
  cachedStatus = isSupabaseConfigured() ? 'signed_out' : 'unavailable'
}
