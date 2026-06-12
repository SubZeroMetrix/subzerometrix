// ─────────────────────────────────────────────────────────────────────────────
// supabaseClient — lazy, env-guarded BROWSER client (Mega-Phase 3B)
// ─────────────────────────────────────────────────────────────────────────────
// A single browser Supabase client for ACCOUNT AUTH only (magic-link sessions).
// It uses the PUBLIC anon key — never the service-role key (which stays server-only
// in /api routes). Safe by construction:
//   • returns null on the server (SSR/build) — no client is created during prerender,
//   • returns null when env vars are missing,
//   • never throws at module load.
//
// This does NOT change the existing anonymous assessment logging (assessment page)
// or the server-side webhook/postback/track-click clients — those are untouched.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// undefined = not yet attempted, null = attempted but unavailable.
let cachedClient: SupabaseClient | null | undefined

/** True when the public Supabase env vars needed for auth are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

/**
 * The browser auth client, or null if unavailable (server, missing env, or error).
 * Lazily created once per browser session. Anon key only.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  // No browser client during SSR/build — auth sessions live in the browser only.
  if (typeof window === 'undefined') return null
  if (cachedClient !== undefined) return cachedClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    cachedClient = null
    return null
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch {
    cachedClient = null
  }
  return cachedClient
}
