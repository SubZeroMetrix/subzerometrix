import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Terms of Service | SubZeroMetrix' }

const SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: `By accessing or using SubZeroMetrix ("the Platform"), operated by The Modern Trades Mentor, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Platform.

These Terms apply to all users in the United States, including users in our initial operating states: Colorado (CO), Florida (FL), Arizona (AZ), Texas (TX), North Carolina (NC), and Ohio (OH). State-specific provisions are noted where applicable.`,
  },
  {
    id: 'nature',
    title: 'Nature of the Service — Educational Only',
    body: `SubZeroMetrix provides a self-assessment tool and educational scoring report for informational and planning purposes only. The MetrixScore™, any accompanying report, roadmap, action steps, resource recommendations, or trade platform guidance are educational tools — not professional advice of any kind.

Nothing on this Platform constitutes or should be construed as:
• Legal advice or legal services
• Financial, investment, or accounting advice
• Tax advice or tax preparation services
• Insurance advice or recommendations
• Lending, credit, or funding guidance
• Licensing advice or trade compliance direction
• Business consulting services

Always consult qualified licensed professionals for decisions involving legal, financial, tax, insurance, or regulatory matters.`,
  },
  {
    id: 'results',
    title: 'No Guarantee of Results',
    body: `SubZeroMetrix makes no guarantees, representations, or warranties regarding any business outcome, revenue, growth, profitability, funding approval, licensing success, or any other result from using this Platform.

Your MetrixScore and roadmap are based entirely on your self-reported answers. Results vary based on your own decisions, effort, experience, market conditions, trade type, geographic location, economic climate, and many other factors outside our control.`,
  },
  {
    id: 'pricing',
    title: 'Pricing & Payment',
    body: `SubZeroMetrix offers the following paid products, in US Dollars (USD):

• MetrixScore™ Basic — $9.99 one-time
  Full score reveal, 6-area breakdown, top 3 risks, 5 action steps, resource links.

• MetrixScore™ Pro — $19.99 one-time
  Everything in Basic plus 90-day roadmap, trade-specific action steps, affiliate resource map, and reassessment sequence.

• Trade Platform — $29.00 per month (recurring subscription)
  Trade-specific platform access. Billed monthly until cancelled.

All payments are processed securely through Stripe. By completing a purchase, you authorize the stated charge to your payment method. Prices are subject to change with notice.`,
  },
  {
    id: 'tax',
    title: 'Sales Tax',
    body: `Sales tax may be collected on your purchase depending on your billing state and the taxability of digital products in that state. Tax is calculated and collected by Stripe based on your billing address and applicable state law.

Current taxability guidance for our operating states (subject to change):
• Colorado — digital products are generally taxable
• Arizona — digital products are generally taxable
• North Carolina — digital products are generally taxable
• Ohio — certain digital products are taxable
• Texas — digital services may be partially taxable as "data processing services"
• Florida — digital reports and online services are generally NOT taxable

This is informational only and not tax advice. Consult a tax professional for questions specific to your situation.`,
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    body: `One-Time Purchases (MetrixScore™ Basic and Pro):
One-time purchases are non-refundable. Your report is delivered immediately upon payment confirmation. Cancellation after purchase is not applicable to one-time digital products.

Trade Platform Subscription ($29/month):
You may cancel your Trade Platform subscription at any time with no cancellation fee and no minimum commitment.

To cancel:
  Step 1 — Contact us through The Modern Trades Mentor website
  Step 2 — Use subject line: "Cancel Subscription"
  Step 3 — Include the email address used for your purchase
  Step 4 — We will confirm cancellation within 2 business days

Upon cancellation, your subscription remains active through the end of the current billing period. You will not be charged for the next cycle. We do not prorate partial months.

48-hour exception: If you cancel within 48 hours of your very first subscription payment and have not accessed the platform, contact us — we will consider a full refund at our discretion.`,
  },
  {
    id: 'refunds',
    title: 'Refund Policy',
    body: `One-Time Purchases:
All one-time purchases are final. Refunds are only considered if:
• A verified technical failure prevented report delivery after confirmed payment
• A duplicate charge occurred due to a technical error

To request a refund under these circumstances, contact us within 7 days of purchase. Include your purchase email and description of the issue. We will respond within 5 business days.

Subscriptions:
Monthly charges are non-refundable once the billing period has begun. Cancel before your next billing date to prevent future charges.

Chargebacks:
Initiating a chargeback without contacting us first may result in access termination and our contesting of the chargeback. Please contact us first — we resolve issues directly.`,
  },
  {
    id: 'accuracy',
    title: 'Accuracy of Assessment',
    body: `Your MetrixScore is generated entirely from your self-reported answers. We do not verify or audit your responses. The accuracy and usefulness of your score and report depend entirely on the honesty and completeness of your inputs.

SubZeroMetrix is not responsible for outcomes based on incomplete, inaccurate, or misleading information. By submitting your assessment, you confirm that your answers honestly reflect your current business situation.`,
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    body: `All content on the SubZeroMetrix platform — including the MetrixScore™ name and methodology, platform names (HeatMetrix, VoltMetrix, FlowMetrix, RoofMetrix, SunMetrix, BuildMetrix, FixMetrix, GroundMetrix, CleanMetrix, PaintMetrix), scoring algorithms, report content, text, graphics, roadmap frameworks, and design — is the intellectual property of The Modern Trades Mentor.

You may not reproduce, copy, distribute, resell, scrape, reverse-engineer, or create derivative works from any portion of this Platform without prior written permission. Purchasing a report grants you a personal, non-transferable license for your own business planning purposes only.`,
  },
  {
    id: 'conduct',
    title: 'User Conduct',
    body: `By using the Platform, you agree not to:
• Submit false or misleading information in your assessment
• Attempt to access another user's account, report, or data
• Use automated tools to scrape, crawl, or extract content
• Attempt to reverse-engineer the scoring algorithm
• Use the Platform for any unlawful purpose
• Resell, redistribute, or commercially exploit report content without permission

Violations may result in access termination without refund.`,
  },
  {
    id: 'affiliates',
    title: 'Affiliate Links',
    body: `SubZeroMetrix and The Modern Trades Mentor may pursue affiliate or vendor relationships in the future. If affiliate links, sponsored placements, or paid vendor relationships are added, they will be disclosed clearly. Current tool recommendations are provided for educational purposes and should be evaluated independently based on fit, pricing, support, and business needs. Any future affiliate relationships would not influence your MetrixScore, report content, or recommendations. See our Affiliate Disclosure for details.`,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: `To the maximum extent permitted by applicable law, SubZeroMetrix and The Modern Trades Mentor shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, business, data, or goodwill, arising from your use of or reliance on the Platform.

Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim. Some jurisdictions limit liability exclusions — in those cases, our liability is limited to the maximum extent permitted by law.`,
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    body: `You agree to indemnify, defend, and hold harmless SubZeroMetrix and The Modern Trades Mentor from any claims, damages, losses, liabilities, costs, or expenses (including reasonable attorney fees) arising from your use of the Platform, violation of these Terms, or violation of any third party's rights.`,
  },
  {
    id: 'governing',
    title: 'Governing Law & Disputes',
    body: `These Terms are governed by the laws of the United States. We encourage you to contact us first to resolve any dispute informally.

If a dispute cannot be resolved informally, it shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association. Either party may seek injunctive relief in a court of competent jurisdiction for intellectual property matters.

You waive any right to participate in class action lawsuits or class-wide arbitration against SubZeroMetrix or The Modern Trades Mentor.

State-specific rights: Nothing in these Terms waives any non-waivable rights you may have under applicable state law in Colorado, Florida, Arizona, Texas, North Carolina, or Ohio.`,
  },
  {
    id: 'state-compliance',
    title: 'State-Specific Legal Notices',
    body: `TEXAS: The Texas Data Privacy and Security Act (TDPSA, effective July 1, 2024) grants Texas residents rights over their personal data. SubZeroMetrix honors these rights. As a small business, we may qualify for the TDPSA small business exemption. We do not sell personal data. We do not use personal data for targeted advertising. Texas residents may contact us to exercise data rights.

COLORADO: The Colorado Privacy Act (CPA, effective July 1, 2023) grants Colorado residents data rights including access, correction, deletion, portability, and opt-out of sale/targeted advertising. We honor these rights for all users regardless of volume thresholds. Colorado's consumer protection laws apply — violation of these Terms may constitute a deceptive trade practice under the Colorado Consumer Protection Act.

OHIO: The Ohio Consumer Privacy Act (OCPA, effective April 8, 2024) grants Ohio residents similar data rights. We apply these protections to all Ohio users.

FLORIDA: Florida's Digital Bill of Rights (FDBR) applies to large businesses generating $1 billion+ in annual revenue. SubZeroMetrix does not meet this threshold but voluntarily provides equivalent data rights to Florida users.

ARIZONA: Arizona does not currently have a comprehensive consumer data privacy law. We apply consistent privacy protections to Arizona users.

NORTH CAROLINA: North Carolina does not currently have a comprehensive consumer data privacy law. We apply consistent privacy protections to North Carolina users.

All users have the right to contact us regarding their personal data regardless of state law applicability.`,
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: `We reserve the right to update these Terms at any time. The effective date at the top reflects the most recent revision. Continued use of the Platform after changes constitutes acceptance. For material changes, we will attempt to notify active users by email.`,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: `For questions about these Terms, cancellations, refund requests, or billing issues, contact us through The Modern Trades Mentor website.

For cancellation requests: use subject line "Cancel Subscription" and include your purchase email.
For data rights requests: include your name, email, and state of residence.

We respond within 2 business days for billing/cancellation matters and within 45 days for data rights requests.`,
  },
]

export default function TermsPage() {
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
        <h1 className="font-display text-4xl tracking-wider text-brand-white mb-1">TERMS OF SERVICE</h1>
        <p className="font-mono text-[10px] text-brand-silver mb-2">
          Last updated: June 2026
        </p>
        <p className="text-brand-silver/70 text-[11px] leading-relaxed mb-8">
          Please read carefully before using SubZeroMetrix. By using the platform, you agree to these Terms. Applies to all US users with specific provisions for CO, FL, AZ, TX, NC, and OH.
        </p>

        {/* Jump nav */}
        <div className="mb-8 p-4 rounded-sm border border-white/10" style={{ background: 'rgba(13,43,92,0.3)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">Jump to section</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {SECTIONS.map(({ id, title }) => (
              <a key={id} href={`#${id}`}
                className="text-[11px] text-brand-accent hover:underline underline-offset-2">
                {title}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          {SECTIONS.map(({ id, title, body }) => (
            <div key={id} id={id}>
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
              ['Cancellation & Refunds', '/cancellation'],
              ['Disclaimer', '/disclaimer'],
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
