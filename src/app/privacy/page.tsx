import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Privacy Policy | SubZeroMetrix' }

const SECTIONS = [
  {
    title: 'Overview',
    body: `SubZeroMetrix ("we," "us," or "our") is operated by The Modern Trades Mentor. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform at subzerometrix.com.

By using the platform, you agree to the practices described in this policy. If you do not agree, please do not use the platform.

SubZeroMetrix currently serves users across the United States, with initial operations focused on Colorado, Florida, Arizona, Texas, North Carolina, and Ohio. We comply with applicable state privacy laws in each jurisdiction where we operate.`,
  },
  {
    title: 'Information We Collect',
    body: `We collect information you provide directly when using the platform:

• First name and email address (entered at the end of the assessment)
• Business type, operating state and city, business stage, financial readiness level, customer acquisition plan, and biggest current blocker (your assessment answers)
• Payment confirmation details (tier purchased, transaction ID) — we do NOT store your card number, CVV, or full payment credentials; these are handled entirely by Stripe

We also collect limited technical data automatically:
• Browser type, device type, and operating system
• Pages visited and time spent
• Referring URL (how you found us)
• IP address (used for fraud prevention and analytics, not linked to your identity in reports)

We do NOT collect: Social Security numbers, government IDs, biometric data, health information, financial account numbers, racial or ethnic origin, religious beliefs, or geolocation beyond the state/city you self-report.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We use your information for the following purposes only:

• To calculate and generate your MetrixScore™ report and personalized roadmap
• To process and verify your payment through Stripe
• To send your report confirmation and (if opted in) follow-up educational emails
• To save your assessment record in our database for support and reassessment purposes
• To improve the platform using aggregated, anonymized data
• To comply with applicable legal obligations

We do NOT use your information for targeted advertising.
We do NOT sell your personal data to third parties.
We do NOT share your individual assessment results with anyone outside of our team.`,
  },
  {
    title: 'Payment Processing & Stripe',
    body: `All payment processing is handled by Stripe, Inc. (stripe.com). SubZeroMetrix never sees, stores, or has access to your full credit card number, bank details, or payment credentials of any kind.

When you complete a purchase, Stripe processes the transaction and sends us a confirmation that includes your email address (if provided), the amount paid, and a transaction reference ID. Your payment data is governed by Stripe's Privacy Policy at stripe.com/privacy.

For subscription purchases (Trade Platform at $29/month), Stripe manages your billing cycle. You may cancel at any time — see our Cancellation & Refund Policy.`,
  },
  {
    title: 'Data Storage & Retention',
    body: `Your assessment answers and MetrixScore™ result are temporarily stored in your browser's sessionStorage during your visit. This data stays on your device and is cleared when you close your browser tab.

If you complete a payment, we save a record of your assessment to our secure database (hosted by Supabase at supabase.com) that includes your name, email, business type, state, score, band, and report content. This record is used for:

• Customer support
• Sending your reassessment reminder (90 days after purchase)
• Improving our scoring model using anonymized aggregate data

Retention period: We retain personal data for a maximum of 3 years from the date of your last activity, after which it is deleted unless retention is required by applicable law.`,
  },
  {
    title: 'Email Communications',
    body: `By providing your email address during the assessment, you consent to receiving:

• A one-time report confirmation email
• A limited educational follow-up email sequence related to your MetrixScore and roadmap
• A reassessment reminder approximately 90 days after your purchase

You may opt out of all non-transactional emails at any time by clicking the unsubscribe link in any email. Transactional emails (payment receipts, support responses) cannot be opted out of as they are required for service delivery.

We comply with the CAN-SPAM Act for all email communications.`,
  },
  {
    title: 'Cookies & Analytics',
    body: `We use cookies and similar technologies for:

• Session management — to maintain your assessment state as you move through questions
• Analytics — to understand traffic patterns and improve the platform
• Payment — Stripe uses cookies as part of its fraud detection and checkout flow

We do not use third-party advertising cookies or tracking pixels for ad targeting. You can disable cookies in your browser settings, though this may affect platform functionality.`,
  },
  {
    title: 'State-Specific Privacy Rights',
    body: `We operate in Colorado, Florida, Arizona, Texas, North Carolina, and Ohio. The following state laws may apply to our users and we honor the rights they provide:

TEXAS (Texas Data Privacy and Security Act — TDPSA, effective July 1, 2024):
Texas residents have the right to access, correct, delete, and obtain a copy of their personal data, and to opt out of the sale of personal data or its use for targeted advertising. We do not sell personal data. We do not use data for targeted advertising. Small business exemption applies to SubZeroMetrix under the TDPSA.

COLORADO (Colorado Privacy Act — CPA, effective July 1, 2023):
Colorado residents have the right to access, correct, delete, port, and opt out of the processing of their personal data for targeted advertising or sale. We honor these rights upon request. Threshold applicability: The CPA's full requirements apply to businesses processing data of 100,000+ Colorado consumers per year. SubZeroMetrix is unlikely to meet this threshold in initial operations; however, we apply the same data rights protections to all users regardless.

OHIO (Ohio Consumer Privacy Act — OCPA, effective April 8, 2024):
Ohio residents have similar access, correction, deletion, portability, and opt-out rights. Threshold: 100,000 consumers. We apply these rights to all users.

FLORIDA (Florida Digital Bill of Rights — FDBR, effective July 1, 2023):
Florida's law applies to businesses generating over $1 billion in global annual revenue. SubZeroMetrix does not meet this threshold. However, we apply data rights protections to all Florida users consistent with best practices.

ARIZONA and NORTH CAROLINA:
These states have not enacted comprehensive consumer privacy laws as of the date of this policy. We apply the same data protection standards to users in these states as we do elsewhere.

FOR ALL STATES — your rights include:
• Right to know what data we hold about you
• Right to correct inaccurate data
• Right to request deletion of your data
• Right to opt out of any sale of your data (we do not sell data)
• Right to non-discrimination for exercising privacy rights

To exercise any of these rights, contact us through The Modern Trades Mentor website. We respond within 45 days.`,
  },
  {
    title: 'Sales Tax Notice',
    body: `SubZeroMetrix sells digital reports and subscriptions. Sales tax obligations vary by state based on whether digital products are taxable in that jurisdiction.

Based on current law (as of the date of this policy):

• Colorado — digital products are generally taxable. Sales tax may apply.
• Arizona — digital products are generally taxable. Sales tax may apply.
• North Carolina — digital products are generally taxable. Sales tax may apply.
• Ohio — certain digital products are taxable. Sales tax may apply.
• Texas — digital services are classified as "data processing services" and may be partially taxable (up to 80% of the charge).
• Florida — digital reports and SaaS-style services are generally NOT taxable in Florida.

Stripe, our payment processor, handles sales tax calculation and collection where required based on your billing address. If you have questions about tax charges on your purchase, contact us.

Note: Tax laws change frequently. This notice reflects our understanding as of the effective date of this policy and is not legal or tax advice. Consult a tax professional for guidance specific to your situation.`,
  },
  {
    title: 'Third-Party Services & Affiliate Links',
    body: `We use the following third-party services:

• Stripe (stripe.com) — payment processing
• Supabase (supabase.com) — database and data storage
• Resend or similar — transactional email delivery
• Vercel (vercel.com) — website hosting and infrastructure

Our reports and resources pages contain affiliate links. If you click an affiliate link and make a purchase, we may receive a commission at no additional cost to you. Affiliate relationships do not affect your MetrixScore, report content, or recommendations. See our Affiliate Disclosure for full details.

When you leave our platform and visit a third-party site, that site's privacy policy governs your data.`,
  },
  {
    title: "Children's Privacy",
    body: `SubZeroMetrix is intended for adults (18+) who are starting, operating, or growing a business. We do not knowingly collect personal information from anyone under 18. If you believe a minor has submitted data through our platform, contact us immediately and we will delete it.

We do not target marketing to minors and our assessment is not designed for or directed at individuals under 18.`,
  },
  {
    title: 'Data Security',
    body: `We take reasonable technical and organizational measures to protect your personal data, including:

• HTTPS encryption on all pages (TLS)
• Database access restricted to server-side code only via Row Level Security (Supabase)
• Payment data handled entirely by Stripe with PCI DSS compliance
• No plaintext storage of payment credentials
• Security headers on all web responses (X-Frame-Options, HSTS, CSP)

No method of internet transmission is 100% secure. We cannot guarantee absolute security, but we work continuously to protect your information.`,
  },
  {
    title: 'Do Not Track & Global Privacy Control',
    body: `Some browsers and browser extensions transmit "Do Not Track" (DNT) or Global Privacy Control (GPC) signals. SubZeroMetrix does not use tracking for advertising purposes. We do not respond to DNT signals specifically, but our general practice is to minimize data collection and not engage in cross-site tracking.

Texas residents: As of January 1, 2025, the TDPSA requires businesses to recognize Global Privacy Control signals for opt-out of data sale and targeted advertising. We do not sell personal data and do not engage in targeted advertising, so GPC signals are effectively honored by default.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy periodically. The "Last updated" date at the top reflects the most recent revision. Continued use of the platform after updates constitutes acceptance of the revised policy. For significant changes affecting your rights, we will attempt to notify active users by email.`,
  },
  {
    title: 'Contact & Data Requests',
    body: `For privacy questions, data access requests, correction requests, deletion requests, or concerns about this policy, contact us through The Modern Trades Mentor website.

Please include:
• Your name and email address used on the platform
• The specific right you wish to exercise or question you have
• Your state of residence (to confirm applicable rights)

We will respond within 45 calendar days. For complex requests, we may extend this period by an additional 45 days with notice to you.`,
  },
]

export default function PrivacyPage() {
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
        <h1 className="font-display text-4xl tracking-wider text-brand-white mb-1">PRIVACY POLICY</h1>
        <p className="font-mono text-[10px] text-brand-silver mb-2">
          Last updated: June 2026
        </p>
        <p className="text-brand-silver/70 text-[11px] leading-relaxed mb-8">
          Applies to users in all states, with specific provisions for Colorado, Florida, Arizona, Texas, North Carolina, and Ohio.
        </p>

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
              ['Terms of Service', '/terms'],
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
