import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Affiliate Disclosure | SubZeroMetrix' }

export default function AffiliateDisclosurePage() {
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
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-2">Legal</p>
        <h1 className="font-display text-4xl tracking-wider text-brand-white mb-1">AFFILIATE DISCLOSURE</h1>
        <p className="font-mono text-[10px] text-brand-silver mb-8">
          Last updated: June 2026
        </p>

        <div className="rounded-sm px-4 py-3 mb-8"
          style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.25)' }}>
          <p className="text-brand-silver text-xs leading-relaxed">
            Tool recommendations on SubZeroMetrix are provided for educational purposes and as vendor
            research starting points. We do not currently have active affiliate or paid-placement
            agreements with the tools we list. SubZeroMetrix may pursue affiliate or vendor
            relationships in the future, but current recommendations should be evaluated independently
            based on fit, pricing, support, and business needs. This page describes how affiliate links
            would work if and when such relationships are established.
          </p>
        </div>

        <div className="space-y-7">

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              FTC Disclosure Requirement
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed">
              In accordance with the Federal Trade Commission guidelines on endorsements and testimonials (16 CFR Part 255), SubZeroMetrix and The Modern Trades Mentor disclose that some links contained in our reports, resource pages, roadmap, and platform content are affiliate links. This disclosure appears inline, before or adjacent to every affiliate link on the platform — not just in this page.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Our Role — Publisher, Not Advisor
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed">
              SubZeroMetrix™ is a contractor business readiness platform owned and operated by The Modern Trades Mentor LLC, for trades and service business owners. We help you understand your business readiness and connect you with tools and services that may be relevant to your situation. We are not a financial institution, insurance agency, licensed broker, lender, or advisor of any kind.

              When you click an affiliate link and leave our platform, you are visiting a third-party website operated by a separate company. Any application, quote, purchase, account opening, policy, or agreement you complete happens directly on that company&apos;s licensed platform — not ours.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              What Is an Affiliate Link
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`An affiliate link is a tracked URL that identifies SubZeroMetrix as the source when you visit a third-party website. If you click an affiliate link and sign up for, purchase, or subscribe to a product or service, we may receive a commission or referral fee from that company.

This commission is paid by the third-party company. It does not add any cost to you — you pay exactly the same price you would if you visited their website directly.`}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Important: Financial, Insurance, and Banking Partners
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`For partners in financial services, banking, and insurance verticals, you should know:

• SubZeroMetrix is NOT an insurance agent, broker, or carrier. We do not quote, sell, bind, or underwrite insurance policies. Any insurance-related link takes you to a licensed insurance provider's own website where their licensed agents or systems handle all quoting and policy decisions.

• SubZeroMetrix is NOT a bank, lender, credit union, or financial institution. We do not open accounts, extend credit, approve loans, or make any lending or credit decisions. Any banking-related link takes you to a licensed financial institution's website.

• SubZeroMetrix is NOT a law firm and does not provide legal advice. Business formation or compliance links take you to third-party service providers.

We do not collect sensitive financial information such as Social Security numbers, bank account numbers, full dates of birth, driver's license numbers, or insurance application data. Any such information you provide during an application process is provided directly to the licensed partner's platform — not to SubZeroMetrix.`}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Where Affiliate Links Appear
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`Affiliate links appear in:

• Your MetrixScore™ report — resource recommendations matched to your score gaps and trade
• The Resources page — curated tools across all business categories
• Your personalized roadmap — action steps may include links to relevant tools
• Email follow-up sequences — limited emails containing relevant resource recommendations

If and when affiliate relationships are established, affiliate links will be clearly identified with a disclosure adjacent to the link.`}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Tool Categories We May Reference
            </h2>
            <div className="space-y-2">
              {[
                ['Field Service Management Software', 'e.g. Jobber, Housecall Pro'],
                ['Accounting & Bookkeeping Software', 'e.g. QuickBooks, Wave, FreshBooks'],
                ['Business Banking (licensed institutions)', 'e.g. Relay Business Banking'],
                ['Business Insurance (licensed carriers/brokers)', 'e.g. Simply Business, NEXT Insurance'],
                ['Business Formation Services', 'e.g. ZenBusiness'],
                ['Marketing & Lead Generation', 'e.g. Angi Pro'],
                ['Business Credit & Funding', 'e.g. Nav'],
              ].map(([category, examples]) => (
                <div key={category} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="text-[11px] text-brand-white font-medium">{category}</span>
                    <span className="text-[11px] text-brand-silver"> — {examples}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Our Commitment to Objectivity
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`Affiliate relationships do not influence:

• Your MetrixScore™ or any component of your score
• The risk areas or gaps identified in your report
• The action steps in your personalized roadmap
• Which vendors or categories are recommended to you

Resources are recommended based on your assessment results. The gaps your score reveals determine which tools appear — not affiliate availability or commission rates. We do not currently have active affiliate relationships, and if we pursue them in the future, we will only recommend tools that are genuinely useful to trades business owners.`}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Third-Party Responsibility
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed">
              When you click an affiliate link and visit a third-party site, that company&apos;s own Terms of Service, Privacy Policy, and licensed practices govern your relationship with them. SubZeroMetrix is not responsible for the products, services, pricing, availability, licensing status, underwriting decisions, approval decisions, or practices of any third-party partner. Always conduct your own due diligence before signing up for or purchasing any service.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">
              Questions
            </h2>
            <p className="text-brand-silver text-xs leading-relaxed">
              If you have questions about our affiliate relationships, want to know whether a specific link is an affiliate link, or want to report a disclosure that appears missing or unclear, contact us through The Modern Trades Mentor website.
            </p>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">Related policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Cancellation & Refunds', '/cancellation'],
              ['Disclaimer', '/disclaimer'],
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
