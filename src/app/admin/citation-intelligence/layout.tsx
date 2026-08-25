/**
 * UI-only layout (tab nav). NOT the security boundary -- Next.js resolves
 * a child page's server component (and its data fetching) before this
 * layout gets a chance to decide whether to render `children`, so gating
 * here does NOT stop protected data from being fetched/serialized for an
 * unauthenticated request (verified empirically: an early version of
 * this file gated only here and still leaked page content to curl).
 * Every page under this layout must independently call getAdminUser()
 * and early-return before fetching any data. See any page.tsx here for
 * the pattern.
 */
const NAV_ITEMS = [
  { href: '/admin/citation-intelligence', label: 'Overview' },
  { href: '/admin/citation-intelligence/mentions', label: 'Mentions' },
  { href: '/admin/citation-intelligence/citations', label: 'Citations' },
  { href: '/admin/citation-intelligence/sources', label: 'Sources' },
  { href: '/admin/citation-intelligence/competitors', label: 'Competitors' },
  { href: '/admin/citation-intelligence/content-gaps', label: 'Content Gaps' },
  { href: '/admin/citation-intelligence/technical-gaps', label: 'Technical Gaps' },
  { href: '/admin/citation-intelligence/opportunities', label: 'Opportunities' },
  { href: '/admin/citation-intelligence/outcomes', label: 'Outcomes' },
]

export default function CitationIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-gray-800">
        <div className="section-container flex gap-1 overflow-x-auto py-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900">
              {item.label}
            </a>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
