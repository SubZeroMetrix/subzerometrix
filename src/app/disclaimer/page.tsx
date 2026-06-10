import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Disclaimer | SubZeroMetrix' }

const SECTIONS = [
  {
    title: 'Educational Purpose Only',
    body: `SubZeroMetrix and all content produced by this Platform — including the MetrixScore™ assessment, scoring results, score bands, roadmap recommendations, action steps, resource suggestions, and trade platform guidance — are provided for educational and informational purposes only.

Nothing on this Platform constitutes professional advice of any kind. We are not lawyers, accountants, financial advisors, insurance brokers, lenders, contractors, or licensed consultants of any type.`,
  },
  {
    title: 'Not Legal Advice',
    body: `Nothing on this Platform constitutes legal advice. Information about business formation, licensing, compliance, contracts, or regulatory requirements is provided for general educational awareness only. Laws and regulations vary by state, city, trade, and jurisdiction and change frequently.

Always consult a licensed attorney for legal questions specific to your business, trade, location, or situation.`,
  },
  {
    title: 'Not Financial or Tax Advice',
    body: `Nothing on this Platform constitutes financial, investment, accounting, or tax advice. Information about pricing, margins, cash flow, startup costs, profit targets, or financial planning is general educational content only.

Always consult a licensed CPA, accountant, or financial advisor for decisions involving your business finances, tax obligations, or investment strategy.`,
  },
  {
    title: 'Not Insurance Advice',
    body: `References to insurance, coverage types, or insurance providers on this Platform are for general informational purposes only. Insurance requirements vary by trade, state, license type, and business structure.

Always consult a licensed insurance professional to determine the correct coverage for your specific business situation.`,
  },
  {
    title: 'Not Lending or Credit Advice',
    body: `Any references to funding, loans, credit, SBA programs, or financing options are general educational information only. Approval for funding depends on your individual credit profile, business history, lender requirements, and many other factors we cannot assess or predict.

Always consult a licensed lender or financial institution for credit and lending decisions.`,
  },
  {
    title: 'No Guarantee of Business Outcomes',
    body: `SubZeroMetrix makes no guarantee, warranty, or promise — express or implied — that using this Platform or following any recommendations in your report will result in business success, revenue growth, profitability, licensing approval, funding approval, or any other specific outcome.

Business results depend entirely on your own decisions, effort, market conditions, trade type, geographic area, economic environment, and countless other factors beyond our control or knowledge. Individual results will vary significantly.`,
  },
  {
    title: 'Self-Reported Data',
    body: `Your MetrixScore and report are generated entirely from your self-reported answers. We do not verify, audit, or independently confirm any information you submit. The accuracy and usefulness of your score depends entirely on the honesty and completeness of your responses.

SubZeroMetrix takes no responsibility for outcomes arising from scores or reports generated from inaccurate, incomplete, or misleading information.`,
  },
  {
    title: 'Third-Party Resources & Affiliate Links',
    body: `This Platform may contain links to third-party websites, tools, service providers, and resources. SubZeroMetrix may pursue affiliate or vendor relationships in the future. If affiliate links, sponsored placements, or paid vendor relationships are added, they will be disclosed clearly. Current tool recommendations are provided for educational purposes and should be evaluated independently based on fit, pricing, support, and business needs.

We do not control, endorse, or take responsibility for the content, accuracy, products, services, or privacy practices of any third-party website or provider. References to specific tools, services, or companies are for informational purposes and do not constitute endorsements or recommendations that they are right for your specific situation.

Always conduct your own due diligence before signing up for or purchasing any third-party service.`,
  },
  {
    title: 'Platform Accuracy & Availability',
    body: `While we make every effort to keep the Platform and its content accurate, current, and available, we make no guarantees about the accuracy, completeness, or timeliness of any information on the Platform. Laws, regulations, pricing, tools, and market conditions change. Content may become outdated.

We reserve the right to modify, update, or remove content at any time without notice. We are not liable for any decisions made based on outdated or inaccurate platform content.`,
  },
  {
    title: 'Limitation of Liability',
    body: `To the fullest extent permitted by applicable law, SubZeroMetrix, The Modern Trades Mentor, and any associated individuals shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or reliance on this Platform or its content — including but not limited to business losses, lost revenue, legal costs, or damage to reputation.

Your use of this Platform is at your own risk.`,
  },
]

export default function DisclaimerPage() {
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
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-1">Legal</p>
            <h1 className="font-display text-4xl tracking-wider text-brand-white leading-none">DISCLAIMER</h1>
          </div>
        </div>
        <p className="font-mono text-[10px] text-brand-silver mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>

        {/* Summary callout */}
        <div className="mb-8 p-4 rounded-sm border border-brand-accent/30" style={{ background: 'rgba(74,144,217,0.08)' }}>
          <p className="text-brand-silver text-xs leading-relaxed">
            <strong className="text-brand-white">Plain English summary:</strong> SubZeroMetrix™ is an educational tool owned and operated by The Modern Trades Mentor LLC. Your MetrixScore™ and roadmap are based on your own answers and are meant to help you think, not to replace qualified legal, financial, tax, insurance, or business advice. No outcomes are guaranteed. Always consult licensed professionals for decisions that matter.
          </p>
        </div>

        <div className="space-y-7">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-sm font-semibold text-brand-white mb-2 pb-2 border-b border-white/10">{title}</h2>
              <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">Related policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Cancellation & Refunds', '/cancellation'],
              ['Affiliate Disclosure', '/affiliate-disclosure'],
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
