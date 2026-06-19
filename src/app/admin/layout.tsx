import { buildMetadata } from '@/lib/seo'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'

export const metadata = buildMetadata({
  title: 'Admin',
  description: 'SubZero Metrix admin dashboard',
  path: '/admin',
  noIndex: true,
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGate>{children}</AdminAuthGate>
}
