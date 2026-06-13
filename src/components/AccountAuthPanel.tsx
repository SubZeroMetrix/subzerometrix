'use client'

// ─────────────────────────────────────────────────────────────────────────────
// AccountAuthPanel — Fix-2: honest sign-in / account entry (existing Supabase auth)
// ─────────────────────────────────────────────────────────────────────────────
// Uses the existing magic-link auth (accountAuth.ts) — no new auth architecture. Honest:
//   • shows "unavailable" when Supabase auth is not configured (never fakes sign-in)
//   • requesting a link does NOT sign the user in (they must click the email link)
//   • explains why an account is useful (back up progress across devices) without
//     claiming multi-device backup is active until a confirmed signed-in write exists
//   • lets users use the platform locally without forcing account creation
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { LogIn, LogOut, Loader2, CheckCircle2 } from 'lucide-react'
import {
  getAccountAuthStatus, getCurrentAccountUser, requestMagicLink, signOutAccount,
  type AccountAuthStatus,
} from '@/lib/accountAuth'

export default function AccountAuthPanel() {
  const [status, setStatus] = useState<AccountAuthStatus>('unavailable')
  const [email, setEmail] = useState('')
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await getAccountAuthStatus()
        const user = await getCurrentAccountUser()
        if (!cancelled) { setStatus(s); setSignedInEmail(user?.email ?? null) }
      } catch {
        if (!cancelled) setStatus('unavailable')
      }
    })()
    return () => { cancelled = true }
  }, [])

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setBusy(true)
    try {
      const res = await requestMagicLink(email)
      if (res.ok) setLinkSent(true)
      else setError(res.error ?? 'Sign-in is not available right now.')
    } catch {
      setError('Sign-in is not available right now.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    setBusy(true)
    try { await signOutAccount() } catch {}
    setSignedInEmail(null); setBusy(false)
  }

  const input = 'w-full px-3 py-2.5 rounded-xl text-[13px] glass text-brand-white placeholder:text-brand-silver/40 focus:outline-none focus:ring-1 focus:ring-brand-accent'

  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-base tracking-wide text-brand-white mb-1 flex items-center gap-1.5">
        <LogIn className="w-4 h-4 text-brand-accent flex-shrink-0" /> Account
      </h2>
      <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-3">
        An account lets you back up your progress to the cloud so it is not tied to one browser.
        You can keep using SubZeroMetrix™ on this device without an account — your progress is
        saved locally either way.
      </p>

      {status === 'unavailable' ? (
        <p className="text-[11px] text-brand-silver/70 glass-light rounded-xl px-4 py-3">
          Account sign-in is not available right now. You can continue using the platform on this
          device; your progress is saved locally.
        </p>
      ) : signedInEmail ? (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-1.5 text-[12px] text-brand-white">
            <CheckCircle2 className="w-4 h-4" style={{ color: '#3FBE93' }} /> Signed in as {signedInEmail}
          </p>
          <button type="button" onClick={handleSignOut} disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[12px] font-semibold glass text-brand-white active:scale-[0.98] transition-all touch-target">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign out
          </button>
        </div>
      ) : linkSent ? (
        <p className="text-[11px] text-brand-silver/80 glass-light rounded-xl px-4 py-3 leading-relaxed">
          Check your email for a sign-in link. Clicking it will sign you in and bring you back to your
          dashboard. You are not signed in until you click the link.
        </p>
      ) : (
        <form onSubmit={handleSendLink} className="space-y-2.5">
          <label htmlFor="auth-email" className="sr-only">Email address</label>
          <input id="auth-email" type="email" inputMode="email" autoComplete="email" required
            value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className={input} />
          {error && <p className="text-[11px] text-red-300">{error}</p>}
          <button type="submit" disabled={busy || email.trim() === ''}
            className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target ${email.trim() === '' ? 'opacity-50' : ''}`}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} Email me a sign-in link
          </button>
          <p className="text-[10px] text-brand-silver/50 leading-relaxed">
            We use a passwordless sign-in link (no password to remember). Backing up across devices
            activates only after you sign in and your progress is confirmed saved to your account.
          </p>
        </form>
      )}
    </section>
  )
}
