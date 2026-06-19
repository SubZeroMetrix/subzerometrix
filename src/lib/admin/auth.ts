import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL_ALLOWLIST = (process.env.ADMIN_EMAIL_ALLOWLIST || 'info@subzerometrix.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

export async function getAdminUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  if (!ADMIN_EMAIL_ALLOWLIST.includes(user.email?.toLowerCase() || '')) return null

  return user
}

export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function getAdminSupabase() {
  await requireAdmin()
  return createAdminClient()
}
