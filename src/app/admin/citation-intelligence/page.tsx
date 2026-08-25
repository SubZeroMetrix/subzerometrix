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
  // Server-side check first, BEFORE any protected data is fetched or
  // constructed -- this is what actually keeps data out of the HTML/RSC
  // payload sent to an unauthenticated request. Every page under this
  // route must repeat this exact pattern; the parent layout is UI-only
  // and does not gate access (see layout.tsx header comment for why).
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
