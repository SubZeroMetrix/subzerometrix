import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Pinellas County Contractor Revenue Recovery',
  description: 'Where St. Petersburg, Clearwater, Largo, and Palm Harbor contractors lose revenue, and how to fix it -- with local business resources and a path to hands-on implementation.',
  path: '/pinellas-contractor-revenue-recovery',
})

const LOCAL_AREAS = [
  {
    name: 'St. Petersburg',
    note: 'The largest local market covered here -- dense residential and commercial mix means missed-call volume and stalled-estimate exposure both run higher than smaller surrounding markets.',
    resources: [
      { label: 'St. Petersburg business assistance', url: 'https://www.stpete.org/business/small_business_assistance/index.php' },
      { label: 'St. Petersburg Chamber event calendar', url: 'https://business.stpete.com/eventcalendar' },
    ],
  },
  {
    name: 'Clearwater',
    note: 'Seasonal tourism traffic changes call volume patterns through the year -- a follow-up gap that\'s minor in the off-season can become a real revenue leak during peak months.',
    resources: [
      { label: 'Clearwater Economic Development', url: 'https://www.myclearwater.com/My-Government/0-City-Departments/Economic-Development' },
      { label: 'Amplify Clearwater (chamber)', url: 'https://amplifyclearwater.com/' },
    ],
  },
  {
    name: 'Largo',
    note: 'Central Pinellas positioning means Largo contractors often serve a wider radius -- dispatch and scheduling discipline matters more here than in a single-city market.',
    resources: [
      { label: 'Largo business resources', url: 'https://www.largo.com/services/business/index.php' },
      { label: 'Central Pinellas Chamber', url: 'https://www.centralchamber.biz/home' },
    ],
  },
  {
    name: 'Palm Harbor',
    note: 'Palm Harbor is unincorporated Pinellas County -- covered here through the county and the Greater Palm Harbor business community, not a separate municipal program.',
    resources: [
      { label: 'Palm Harbor Chamber', url: 'https://palmharborchamber.com/' },
    ],
  },
]

const COUNTYWIDE_RESOURCES = [
  { label: 'Pinellas County business resources', url: 'https://pinellas.gov/topic/business-industry/' },
  { label: 'Pinellas Small Business Development Center', url: 'https://pinellas.gov/florida-small-business-development-center/' },
  { label: 'SCORE Pinellas', url: 'https://www.score.org/fl/pinellas-county/' },
  { label: 'Florida DBPR license search', url: 'https://www.myfloridalicense.com/wl11.asp' },
  { label: 'Pinellas building permit review times', url: 'https://pinellas.gov/building-permit-review-times-activity/' },
]

export default function PinellasPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Pinellas Contractor Revenue Recovery', url: '/pinellas-contractor-revenue-recovery' },
  ])

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">Local -- Pinellas County &amp; Tampa Bay</p>
        <h1 className="text-headline text-gray-900 mb-6">Pinellas County Contractor Revenue Recovery</h1>
        <p className="text-lg text-gray-500 mb-4">
          The same revenue leaks covered across this site -- missed calls, stalled estimates, dormant customers,
          callback cost, follow-up gaps -- show up differently depending on where you operate in Pinellas County.
          Here&apos;s what&apos;s different locally, and where to find real local resources.
        </p>
        <p className="text-sm text-gray-400 mb-14">
          Priority coverage: St. Petersburg, Clearwater, Largo, Palm Harbor, and Pinellas County generally, with
          Greater Tampa Bay and Tampa/Hillsborough County as secondary markets.
        </p>

        <div className="space-y-8 mb-16">
          {LOCAL_AREAS.map((area) => (
            <div key={area.name} className="card-panel">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{area.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{area.note}</p>
              <div className="flex flex-wrap gap-3">
                {area.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-electric underline underline-offset-2">
                    {r.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Countywide resources</h2>
          <ul className="space-y-2">
            {COUNTYWIDE_RESOURCES.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-electric underline underline-offset-2">{r.label}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Start with the free check</h2>
          <p className="text-gray-500 mb-6">Whether you&apos;re in St. Petersburg, Clearwater, Largo, or Palm Harbor, the same Revenue Leak Check applies -- nine questions, no email required.</p>
          <Link href="/revenue-leak-check" className="btn-primary">Run the Revenue Leak Check</Link>
        </section>

        <div className="card-panel text-center">
          <p className="text-gray-700 mb-4">Need help implementing the fix in Pinellas County?</p>
          <a href="https://www.themoderntradesmentor.com" className="btn-primary">Work with The Modern Trades Mentor</a>
          <p className="mt-3 text-xs text-gray-400">TMT is a SubZeroMetrix affiliate, not an independent third party -- optional, not required.</p>
        </div>
      </div>
    </div>
  )
}
