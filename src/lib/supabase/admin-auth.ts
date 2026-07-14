import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Verifies the request carries a valid session against the MAIN
// Supabase project -- the same project src/components/admin/AdminAuthGate.tsx
// authenticates against. This is the server-side half of that gate: any
// API route returning admin data must call this and reject unauthenticated
// requests itself, since the client-side gate alone only hides UI, it
// does not stop a direct request to the API route.
export async function getAdminUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error('[admin-auth] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY at runtime')
    return null
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op -- route handlers reading an existing session don't
          // need to refresh cookies themselves; middleware already does.
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}
