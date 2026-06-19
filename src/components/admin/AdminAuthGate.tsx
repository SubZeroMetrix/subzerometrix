'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { User } from '@supabase/supabase-js'

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      return
    }
    setUser(data.user)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-16">
        <div className="section-container max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy border border-gray-700 text-white"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>
          <p className="text-xs text-gray-600 mt-4">Admin access is restricted to authorized accounts.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-brand-navy-light border-b border-gray-800 py-2">
        <div className="section-container flex items-center justify-between">
          <span className="text-xs text-gray-400">Admin: {user.email}</span>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-white">
            Sign Out
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
