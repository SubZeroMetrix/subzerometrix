import type { Metadata } from 'next'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { CitationIntelligenceDashboard } from './CitationIntelligenceDashboard'

export const metadata: Metadata = {
  title: 'Citation Intelligence',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CitationIntelligencePage() {
  // Server-side check first -- this is what actually keeps the entity
  // registry / prompt library out of the HTML sent to an unauthenticated
  // request. AdminAuthGate below is client-side UX (login form,
  // sign-out) on top of this, not the security boundary by itself.
  const user = await getAdminUser()

  if (!user) {
    return <AdminAuthGate>{null}</AdminAuthGate>
  }

  return (
    <AdminAuthGate>
      <CitationIntelligenceDashboard />
    </AdminAuthGate>
  )
}
