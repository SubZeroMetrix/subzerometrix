import Link from 'next/link'
import { ArrowLeft, ExternalLink, Shield } from 'lucide-react'
import { AFFILIATE_PARTNERS, affiliateUrl } from '@/lib/affiliates'
import { DISCLOSURE_TEXT } from '@/lib/tracking'

export const metadata = { title: 'Resources | SubZeroMetrix' }

// ── Non-affiliate government and free resources ───────────────────────────────
const FREE_RESOURCES = [
  {
    category: 'Business Formation',
    items: [
      { name: 'SBA — Start a Business Guide', url: 'https://www.sba.gov/business-guide/10-steps-start-your-business', desc: 'Free step-by-step guide from the U.S. Small Business Administration.' },
      { name: 'IRS — Apply for EIN (Free)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online', desc: 'Get your Employer Identification Number directly from the IRS at no cost.' },
      { name: 'SCORE — Free Business Mentoring', url: 'https://www.score.org', desc: 'Free mentorship from experienced business professionals. All industries.' },
    ]
  },
  {
    category: 'State Official Resources (CO, FL, AZ, TX, NC, OH)',
    items: [
      { name: 'Texas SOS — Business Filing', url: 'https://www.sos.state.tx.us/corp/businessstructure.shtml', desc: 'Official TX business registration.' },
      { name: 'Florida Division of Corporations', url: 'https://dos.fl.gov/sunbiz/start-business/', desc: 'Official FL business registration (Sunbiz).' },
      { name: 'Colorado SOS — Business Filing', url: 'https://www.sos.state.co.us/pubs/business/businessHome.html', desc: 'Official CO business registration.' },
      { name: 'Arizona Corporation Commission', url: 'https://azcc.gov/corporations/forms-fees', desc: 'Official AZ business registration.' },
      { name: 'North Carolina SOS', url: 'https://www.sosnc.gov/online_services/business_registration', desc: 'Official NC business registration.' },
      { name: 'Ohio SOS — Business Filing', url: 'https://www.ohiosos.gov/businesses/information-for-businesses/', desc: 'Official OH business registration.' },
    ]
  },
  {
    category: 'Licensing (by State)',
    items: [
      { name: 'TX TDLR — Trades Licensing', url: 'https://www.tdlr.texas.gov/', desc: 'HVAC, electrical, plumbing, and other trades in Texas.' },
      { name: 'FL DBPR — Contractor Licensing', url: 'https://www.myfloridalicense.com/intentions2.asp?chBoard=true&boardid=42', desc: 'All contractor license types in Florida.' },
      { name: 'CO DORA — Professions & Occupations', url: 'https://dora.colorado.gov/professions-occupations', desc: 'All CO trade and contractor licensing.' },
      { name: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/', desc: 'All contractor licensing in Arizona.' },
      { name: 'NC Licensing Board for Contractors', url: 'https://www.nclbgc.org/', desc: 'General contractor licensing in NC.' },
      { name: 'OH Construction Industry Licensing', url: 'https://com.ohio.gov/divisions-and-programs/industrial-compliance/boards-and-commissions/ohio-construction-industry-licensing-board', desc: 'All OH contractor licensing.' },
    ]
  },
]

// ── Affiliate partner display groups ─────────────────────────────────────────
const PARTNER_GROUPS: { label: string; category: string; description: string }[] = [
  { label: 'Field Service Software', category: 'field-software', description: 'Scheduling, quoting, invoicing, and customer management tools built for trades businesses.' },
  { label: 'Bookkeeping & Finance', category: 'bookkeeping',     description: 'Track income, expenses, and invoices. Know if you are actually profitable.' },
  { label: 'Business Banking',      category: 'banking',         description: 'Separate your personal and business finances. Required for any legitimate business.' },
  { label: 'Business Insurance',    category: 'insurance',       description: 'General liability and trade-specific coverage. Most jobs require proof before you start.' },
  { label: 'Business Formation',    category: 'formation',       description: 'Register your LLC or corporation to protect your personal assets.' },
  { label: 'Marketing & Leads',     category: 'marketing',       description: 'Get found by customers in your area.' },
  { label: 'Credit & Funding',      category: 'funding-credit',  description: 'Build business credit and understand your financing options.' },
]

export default function ResourcesPage() {
  const universalDisclosure = DISCLOSURE_TEXT['affiliate-universal']
  const financialDisclosure = DISCLOSURE_TEXT['not-financial-advice']
  const insuranceDisclosure = DISCLOSURE_TEXT['insurance-routing']
  const bankingDisclosure   = DISCLOSURE_TEXT['banking-routing']

  return (
    <main className="min-h-dvh bg-brand-navy">
      <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors touch-target">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="font-display text-base tracking-widest text-brand-white">
          SUBZERO<span className="text-brand-accent">METRIX</span>
        </span>
      </div>

      <div className="px-5 max-w-md mx-auto pb-16 pt-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-2">Tools & Resources</p>
        <h1 className="font-display text-4xl tracking-wider text-brand-white mb-1">RESOURCES</h1>
        <p className="text-brand-silver text-[13px] leading-relaxed mb-4">
          Tools and services used by trades business owners. We route you to the right
          providers — all decisions, applications, and purchases happen directly on
          their licensed platforms.
        </p>

        {/* Global platform disclosure */}
        <div className="mb-8 p-4 rounded-sm border border-brand-accent/20"
          style={{ background: 'rgba(74,144,217,0.06)' }}>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-1">
                <strong className="text-brand-white">How this works:</strong>{' '}
                SubZeroMetrix is an education and referral platform. We connect you with
                licensed providers — we do not quote, sell, approve, underwrite, bind, or
                process any financial or insurance products ourselves.
              </p>
              <p className="text-[10px] text-brand-silver/60 leading-relaxed">
                {universalDisclosure}
              </p>
            </div>
          </div>
        </div>

        {/* Free & Official Resources */}
        <div className="mb-10">
          <h2 className="font-display text-2xl tracking-wider text-brand-white mb-4">
            FREE OFFICIAL RESOURCES
          </h2>
          <div className="space-y-6">
            {FREE_RESOURCES.map(group => (
              <div key={group.category}>
                <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">
                  {group.category}
                </p>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-sm p-3 group"
                      style={{ background: 'rgba(13,43,92,0.3)', border: '1px solid rgba(168,184,204,0.1)' }}>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] text-brand-accent group-hover:underline underline-offset-2">{item.name}</p>
                        <p className="text-[11px] text-brand-silver leading-relaxed">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate partner sections */}
        <h2 className="font-display text-2xl tracking-wider text-brand-white mb-2">
          TOOL RECOMMENDATIONS
        </h2>
        <p className="text-[12px] text-brand-silver/70 leading-relaxed mb-6">
          Curated tools used by trades businesses at every stage. Recommendations are provided for
          educational purposes. SubZeroMetrix may pursue affiliate or vendor relationships in the
          future, but current recommendations should be evaluated independently based on fit, pricing,
          support, and business needs.
        </p>

        <div className="space-y-8">
          {PARTNER_GROUPS.map(group => {
            const partners = AFFILIATE_PARTNERS.filter(p => p.category === group.category)
            if (partners.length === 0) return null

            const needsFinancialDisclosure = ['banking', 'funding-credit', 'insurance'].includes(group.category)

            return (
              <div key={group.category}>
                <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-1">
                  {group.label}
                </p>
                <p className="text-[12px] text-brand-silver/70 mb-3 leading-relaxed">{group.description}</p>

                {/* Category-specific disclosure for financial/insurance */}
                {needsFinancialDisclosure && (
                  <div className="mb-3 px-3 py-2 rounded-sm text-[10px] text-brand-silver/70 leading-relaxed"
                    style={{ background: 'rgba(239,159,39,0.06)', border: '1px solid rgba(239,159,39,0.2)' }}>
                    {group.category === 'insurance'
                      ? insuranceDisclosure
                      : bankingDisclosure}
                  </div>
                )}

                <div className="space-y-2">
                  {partners.map(p => (
                    <a key={p.id} href={affiliateUrl(p)} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-sm p-4 group"
                      style={{ background: 'rgba(13,43,92,0.35)', border: '1px solid rgba(168,184,204,0.12)' }}>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[13px] text-brand-accent group-hover:underline underline-offset-2 font-medium">
                            {p.name}
                          </span>
                          {p.freeOption && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                              style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
                              Free option
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-silver leading-relaxed">{p.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom compliance footer */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-[10px] text-brand-silver/60 leading-relaxed mb-3">
            <strong className="text-brand-silver">Platform disclaimer:</strong>{' '}
            {financialDisclosure}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              ['Affiliate Disclosure', '/affiliate-disclosure'],
              ['Disclaimer', '/disclaimer'],
              ['Privacy Policy', '/privacy'],
            ].map(([label, href]) => (
              <Link key={href} href={href}
                className="text-[11px] text-brand-accent underline underline-offset-2 hover:text-brand-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
