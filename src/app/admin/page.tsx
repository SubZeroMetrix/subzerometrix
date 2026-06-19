import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Admin',
  description: 'SubZero Metrix admin dashboard',
  path: '/admin',
  noIndex: true,
})

export default function AdminPage() {
  return (
    <div className="py-16">
      <div className="section-container max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        <p className="text-gray-400 mb-8">
          Manage products, affiliate links, comparisons, reviews, and content.
          Authentication is required to access admin functions.
        </p>

        <div className="grid gap-4">
          {[
            { href: '/admin/products', label: 'Products', desc: 'Manage product listings, verification dates, and active status.' },
            { href: '/admin/links', label: 'Affiliate Links', desc: 'Manage affiliate URLs, commission notes, and link status.' },
            { href: '/admin/comparisons', label: 'Comparisons', desc: 'Manage product comparison content and pairings.' },
            { href: '/admin/reviews', label: 'Reviews', desc: 'Manage editorial reviews and publication status.' },
            { href: '/admin/tool-finder', label: 'Tool Finder Rules', desc: 'Manage recommendation logic and question flow.' },
            { href: '/admin/leads', label: 'Leads', desc: 'View email signups and lead sources.' },
            { href: '/admin/clicks', label: 'Click Analytics', desc: 'View aggregate affiliate click data.' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card hover:border-brand-electric/40 transition-colors"
            >
              <h2 className="text-lg font-bold text-white">{item.label}</h2>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-8">
          Admin access requires Supabase authentication with an admin role.
          Service-role credentials are never exposed to the browser.
        </p>
      </div>
    </div>
  )
}
