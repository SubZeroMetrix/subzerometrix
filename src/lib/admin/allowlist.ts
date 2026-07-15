// Single source of truth for which authenticated Supabase users may use
// the admin section. Matches the existing, previously-unused pattern in
// src/lib/admin/auth.ts (same default, same env var name) -- this file
// makes that allowlist actually enforced across both the client gate and
// every /api/admin/* route, rather than duplicating the list in each
// place. Default matches this repo's documented admin contact
// (info@subzerometrix.com, per .env.example / CONTACT_EMAIL).
const ADMIN_EMAIL_ALLOWLIST = (process.env.ADMIN_EMAIL_ALLOWLIST || 'info@subzerometrix.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAIL_ALLOWLIST.includes(email.trim().toLowerCase())
}
