import Link from 'next/link'

const adminSections = [
  { href: '/admin/products', label: 'Products', desc: 'Manage product listings, verification dates, strengths, limitations, and active status.' },
  { href: '/admin/affiliate-programs', label: 'Affiliate Programs', desc: 'Manage application status, commission terms, network, restrictions, and approval workflow.' },
  { href: '/admin/affiliate-links', label: 'Affiliate Links', desc: 'Manage destination URLs, active status, and link verification.' },
  { href: '/admin/comparisons', label: 'Comparisons', desc: 'Manage product comparison pairs and editorial content.' },
  { href: '/admin/tool-finder', label: 'Tool Finder Rules', desc: 'Manage recommendation logic, conditions, and reasoning.' },
  { href: '/admin/leads', label: 'Leads', desc: 'View email signups, use cases, and sources.' },
  { href: '/admin/submissions', label: 'Submissions', desc: 'MCC leads, customer-care requests, qualification, referral/partner interest, and written help feedback -- all in one place.' },
  { href: '/admin/buster', label: 'Buster Conversations', desc: 'Questions asked, what matched, unanswered questions, most-asked, and source usage.' },
  { href: '/admin/contacts', label: 'Contact Submissions', desc: 'View and manage contact form submissions.' },
  { href: '/admin/analytics', label: 'Click Analytics', desc: 'View aggregate affiliate click data and attribution.' },
  { href: '/admin/verification', label: 'Verification Records', desc: 'Track product and content verification history.' },
]

export default function AdminDashboard() {
  return (
    <div className="py-12">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        <div className="grid gap-4">
          {adminSections.map((item) => (
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
      </div>
    </div>
  )
}
