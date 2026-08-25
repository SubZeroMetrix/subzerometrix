import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Resources for Contractors & Facility Operators',
  description:
    'Practical guides for HVAC, facility management, and AI adoption in service businesses -- grounded in real operational experience, not generic advice.',
  path: '/resources',
})

const CATEGORIES = [
  {
    slug: 'hvac',
    name: 'HVAC',
    description: 'Service scheduling, follow-ups, technician coordination, and where AI genuinely helps an HVAC business.',
    populated: true,
  },
  {
    slug: 'facility-management',
    name: 'Facility Management',
    description: 'Preventive maintenance, asset lifecycle planning, recommissioning, and multi-site operational reliability.',
    populated: true,
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    description: 'Lead follow-up, estimate management, scheduling, and service agreements for electrical contracting businesses.',
    populated: true,
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    description: 'Emergency vs. planned work, dispatch, callbacks, and the follow-up gap in plumbing businesses.',
    populated: true,
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    description: 'Storm-lead response, insurance-claim coordination, and estimate follow-up for roofing businesses.',
    populated: true,
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    description: 'Recurring contract renewals, seasonal lead spikes, and upsell follow-up for landscaping and lawn care.',
    populated: true,
  },
  {
    slug: 'general-contracting',
    name: 'General Contracting',
    description: 'Bid follow-up, change-order tracking, and subcontractor coordination for remodelers and GCs.',
    populated: true,
  },
  {
    slug: 'pest-control',
    name: 'Pest Control',
    description: 'Recurring service plans, callback tracking, and renewal follow-up for pest control businesses.',
    populated: true,
  },
  {
    slug: 'painting',
    name: 'Painting',
    description: 'Estimate follow-up in a crowded field, seasonal demand, and repeat-customer retention for painting businesses.',
    populated: true,
  },
  {
    slug: 'cleaning-services',
    name: 'Cleaning Services',
    description: 'Recurring schedule reliability, client retention, and referral follow-up for residential and commercial cleaning.',
    populated: true,
  },
  {
    slug: 'garage-door-repair',
    name: 'Garage Door Repair',
    description: 'Emergency response speed, replacement estimate follow-up, and maintenance plans for garage door businesses.',
    populated: true,
  },
  {
    slug: 'appliance-repair',
    name: 'Appliance Repair',
    description: 'Parts-delay communication, callback and warranty tracking, and recurring commercial maintenance.',
    populated: true,
  },
  {
    slug: 'water-damage-restoration',
    name: 'Water Damage Restoration',
    description: 'Emergency response speed, insurance-claim coordination, and multi-stage job tracking for restoration businesses.',
    populated: true,
  },
  {
    slug: 'security-and-alarm',
    name: 'Security and Alarm',
    description: 'Monitoring-contract renewals, install estimate follow-up, and upgrade opportunities for security businesses.',
    populated: true,
  },
  {
    slug: 'business-operations',
    name: 'Business Operations',
    description: 'Lead response, pipeline discipline, follow-up, scheduling, and the daily operating rhythm for any service business.',
    populated: true,
  },
  {
    slug: 'ai-for-contractors',
    name: 'AI for Contractors',
    description: 'What governed AI actually does today, what it doesn’t, and how to adopt it without losing control.',
    populated: true,
  },
]

const FEATURED_GUIDES = [
  { href: '/resources/hvac', title: 'Where HVAC Businesses Lose Revenue Without Noticing', category: 'HVAC' },
  { href: '/resources/facility-management', title: 'Facility Management: Reliability, Planning, and What AI Can and Can’t Do', category: 'Facility Management' },
  { href: '/resources/electrical', title: 'Running an Electrical Contracting Business: Where Operations Break Down', category: 'Electrical' },
  { href: '/resources/plumbing', title: 'Running a Plumbing Business: Emergency Work, Scheduling, and the Follow-Up Gap', category: 'Plumbing' },
  { href: '/resources/roofing', title: 'Running a Roofing Business: Estimates, Storm Leads, and Follow-Up', category: 'Roofing' },
  { href: '/resources/landscaping', title: 'Running a Landscaping Business: Recurring Contracts and Seasonal Follow-Up', category: 'Landscaping' },
  { href: '/resources/general-contracting', title: 'Running a General Contracting or Remodeling Business: Where Jobs Stall', category: 'General Contracting' },
  { href: '/resources/pest-control', title: 'Running a Pest Control Business: Recurring Service Plans and Callback Follow-Up', category: 'Pest Control' },
  { href: '/resources/painting', title: 'Running a Painting Business: Estimate Follow-Up and Repeat Customers', category: 'Painting' },
  { href: '/resources/cleaning-services', title: 'Running a Cleaning Business: Recurring Schedules and Client Retention', category: 'Cleaning Services' },
  { href: '/resources/garage-door-repair', title: 'Running a Garage Door Business: Emergency Calls and Estimate Follow-Up', category: 'Garage Door Repair' },
  { href: '/resources/appliance-repair', title: 'Running an Appliance Repair Business: Callback Trust and Follow-Up', category: 'Appliance Repair' },
  { href: '/resources/water-damage-restoration', title: 'Running a Water Damage Restoration Business: Speed, Insurance, and Follow-Up', category: 'Water Damage Restoration' },
  { href: '/resources/security-and-alarm', title: 'Running a Security and Alarm Business: Monitoring Renewals and Install Follow-Up', category: 'Security and Alarm' },
  { href: '/resources/hvac/recurring-revenue', title: 'Recurring Revenue for HVAC Contractors: Maintenance Agreements Done Right', category: 'HVAC' },
  { href: '/resources/facility-management/facility-optimization', title: 'Facility Optimization: What It Actually Means and Where Software Helps', category: 'Facility Management' },
  { href: '/resources/business-operations/dispatch-and-scheduling', title: 'Dispatch and Scheduling for Service Businesses: What to Automate, What to Keep Manual', category: 'Business Operations' },
  { href: '/resources/business-operations', title: 'Running a Service Business as an Operating System', category: 'Business Operations' },
  { href: '/resources/ai-for-contractors', title: 'AI for Contractors: What’s Real, What’s Roadmap, and How to Stay in Control', category: 'AI for Contractors' },
]

const FREE_TOOLS = [
  {
    href: '/resources/tools/follow-up-revenue-calculator',
    title: 'Follow-Up Revenue Calculator',
    description: 'Estimate how much revenue is sitting in open estimates and overdue follow-ups right now.',
  },
  {
    href: '/resources/tools/estimate-follow-up-priority-calculator',
    title: 'Estimate Follow-Up Priority Calculator',
    description: 'Score which open estimates need follow-up first based on age, customer response, urgency, and value.',
  },
]

export default function ResourcesHubPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
  ])
  const webPage = webPageSchema({
    name: 'Resources for Contractors & Facility Operators',
    description: 'Practical guides for HVAC, facility management, and AI adoption in service businesses.',
    path: '/resources',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Resources</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Resources</p>
        <h1 className="text-headline text-gray-900 mb-6">Practical Guides for Contractors &amp; Facility Operators</h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-14">
          Written from real operational experience -- 24+ years in HVAC/R, facilities, and mechanical operations
          leadership -- not generic AI-written filler. Every guide is honest about what a tool like Metrix Command
          Center can and can&apos;t do.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {CATEGORIES.map((cat) =>
            cat.populated ? (
              <Link key={cat.slug} href={`/resources/${cat.slug}`} className="card-panel hover:border-brand-electric/30 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
              </Link>
            ) : (
              <div key={cat.slug} className="card-panel opacity-60">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">{cat.description}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Coming soon</p>
              </div>
            )
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {FEATURED_GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="card-panel hover:border-brand-electric/30 transition-colors">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">{g.category}</p>
              <h3 className="text-base font-bold text-gray-900">{g.title}</h3>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Free Tools</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {FREE_TOOLS.map((tool) => (
            <div key={tool.href} className="card-panel">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.description}</p>
              <Link href={tool.href} className="btn-secondary inline-block">
                Try the Calculator
              </Link>
            </div>
          ))}
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Want a real fix, not just the diagnosis?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            The Modern Trades Mentor works directly with St. Petersburg and Pinellas County contractors to close the
            leaks these guides describe -- follow-up systems, CRM setup, and operating discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.themoderntradesmentor.com" className="btn-primary inline-block">Talk to TMT</a>
          </div>
        </div>
      </div>
    </div>
  )
}
