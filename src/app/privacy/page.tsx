import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Privacy Policy | SubZeroMetrix' }

const SECTIONS = [
  {
    title: 'Overview',
    body: `SubZeroMetrix™ ("we," "us," or "our") is owned and operated by The Modern Trades Mentor LLC. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform at subzerometrix.com. It describes our current data practices and is written to remain accurate as the platform develops.

By using the platform, you agree to the practices described in this policy. If you do not agree, please do not use the platform.

SubZeroMetrix™ currently serves users across the United States, with initial operations focused on Florida, Colorado, Texas, Arizona, Ohio, and North Carolina. We follow applicable state privacy laws in the jurisdictions where we operate.`,
  },
  {
    title: 'Information We Collect',
    body: `Depending on how you use the platform, we may collect the following categories of information:

• Account and contact information you provide directly (such as first name and email address)
• Assessment responses you submit
• Business-readiness and MetrixScore™ information generated from your assessment activity
• Roadmap, checklist, milestone, and progress information
• Foundation Builder activity (your selections, stages, and any notes you choose to enter)
• Platform usage and interaction information
• Technical, browser, device, diagnostic, security, and log information needed to operate and protect the service
• Email-consent and communication-preference information
• Customer feedback you submit
• Voluntary testimonial, review, case-study, or research-participation information (only if you choose to provide it)
• Referral, acquisition, activation, and growth-event information collected through privacy-safe analytics
• Business-outcome information you may voluntarily provide in the future

Sources: most information comes directly from you. Technical and log information is generated automatically by your device and by our infrastructure providers as you use the service.

We do not ask you to provide, and you should not enter, passwords, API keys, Social Security numbers, banking or payment-card numbers, government IDs, biometric or health data, or other sensitive personal information into free-form fields such as notes.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We may use your information to:

• Provide and operate SubZeroMetrix™
• Create assessments, MetrixScore™ results, recommendations, roadmaps, checklists, and progress tools
• Save and synchronize your progress (on your device and, when you sign in, to your account)
• Personalize educational guidance based on the business context you provide
• Maintain accounts and provide support
• Improve platform functionality and user experience
• Measure platform performance, reliability, adoption, and effectiveness
• Protect platform security and prevent abuse
• Communicate with you when you have requested or consented to communications
• Develop new tools, features, integrations, services, and educational resources
• Conduct internal analytics, product research, and quality evaluation
• Evaluate whether platform milestones, recommendations, and workflows are associated with improved business outcomes
• Create aggregated or de-identified analytics, benchmarking, research, and industry insights (see "Aggregated & De-Identified Information")
• Comply with applicable legal obligations

We do not sell your personal information for money, and we do not use it for cross-context behavioral or targeted advertising. We do not share your individual assessment results, MetrixScore™, or progress data with third parties except the service providers described below, with your direction, or as required by law.`,
  },
  {
    title: 'Aggregated & De-Identified Information',
    body: `We may create aggregated or de-identified information from platform activity. "De-identified" does not necessarily mean "anonymous" — removing direct identifiers does not guarantee that information can never be associated with an individual or business.

Where we use de-identified information, we will use reasonable measures to prevent it from being associated with a particular individual or business, and we will not intentionally attempt to re-identify it except where permitted or required for security, compliance, testing, or legal purposes.

We may retain and use aggregated or de-identified information for lawful research, analytics, benchmarking, product development, operational improvement, and industry-insight purposes — for example, contractor and service-business benchmarking, business-readiness research, outcome analysis, industry-trend analysis, developing readiness/risk/momentum/growth indicators, comparing milestone completion with voluntarily reported business outcomes, and publishing high-level statistical insights that do not identify individual users or businesses.

We do not currently publish benchmarking or outcome claims (for example, that completing certain milestones makes a particular revenue result more likely). We may develop and publish such evidence-based, high-level statistical insights in the future only when we have sufficient reliable data and a documented, supportable methodology — and such insights will not identify individual users or businesses.`,
  },
  {
    title: 'Local-Device vs. Account / Cloud Storage',
    body: `Much of your activity is stored locally on your device by default. Your latest assessment result and progress data (including roadmap, KPI entries, Foundation Builder progress, and feedback you enter) are saved in your browser on your device. Clearing your browser data can remove information that is only stored on your device.

If a signed-in account and cloud sync are available to you, you may choose to back up certain progress data to your account. When that happens, the data is stored in our database (hosted by Supabase) under access controls that limit each record to its owner. We show an honest storage status, and we do not indicate that data is "synced to your account" unless a backup has actually been confirmed.

You can export or delete the data backed up to your account, and you can separately clear data stored on your device — see "Your Choices."`,
  },
  {
    title: 'Payment Processing & Stripe',
    body: `All payment processing is handled by Stripe, Inc. (stripe.com). SubZeroMetrix™ never sees, stores, or has access to your full credit card number, bank details, or payment credentials of any kind.

When you complete a purchase, Stripe processes the transaction and sends us a confirmation that may include your email address (if provided), the amount paid, and a transaction reference ID. Your payment data is governed by Stripe's Privacy Policy at stripe.com/privacy.

For subscription purchases, Stripe manages your billing cycle. You may cancel at any time — see our Cancellation & Refund Policy.`,
  },
  {
    title: 'Email & Communications',
    body: `We send email only where you have requested it or given consent. Some pages offer an optional email update list; the consent checkbox is unchecked by default, and we record the version of the consent text you agreed to and the time you agreed. We do not enroll you in marketing email merely because you created an account, completed an assessment, downloaded a file, or used a tool.

We do not currently operate an automated marketing-email delivery system. We collect consented interest now and will not send marketing email until a verified delivery provider, double opt-in where appropriate, and a working unsubscribe process are in place. We will identify our email-delivery provider here once it is configured.

Transactional messages (such as a payment receipt or a support response) are part of service delivery. When marketing email is active, you will be able to unsubscribe from non-transactional email at any time, and we will follow the CAN-SPAM Act.`,
  },
  {
    title: 'Cookies & Analytics',
    body: `We use first-party, privacy-safe analytics to understand how the platform is used and to improve it. Our in-app activity analytics are stored on your device and use a limited, non-identifying set of fields (such as the page path, acquisition channel, and milestone reached). We do not put your email, name, assessment answers, MetrixScore™ values, or free-form notes into analytics.

We use limited cookies/browser storage for session management (to maintain your assessment state) and for payment (Stripe uses cookies as part of checkout and fraud detection). We do not currently use third-party advertising cookies or ad-targeting pixels. If we add a third-party analytics or tag-management provider in the future, we will update this policy and obtain consent where required. You can disable cookies in your browser settings, though this may affect platform functionality.`,
  },
  {
    title: 'Your Choices: Access, Export, Deletion & Preferences',
    body: `You can request access to or correction of the personal information we hold about you. For data backed up to a signed-in account, the platform also provides self-service controls to export your own data (as a downloadable file) and to delete your own synced records. These actions are limited to your own data and report partial failures honestly.

Data stored only on your device can be cleared separately and is only removed when you explicitly confirm that action.

Deleting your synced data does not delete the data saved on your device, and it does not delete your sign-in account itself. Deletion of the underlying sign-in account is currently admin-assisted (not automated) — contact us to request it.

You can decline or withdraw consent to marketing communications at any time.`,
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
    title: 'Service Providers & Processors',
    body: `We use the following service providers to operate the platform:

• Stripe (stripe.com) — payment processing
• Supabase (supabase.com) — database, authentication, and data storage
• Vercel (vercel.com) — website hosting and infrastructure

These providers process information on our behalf to deliver the service, and they maintain their own privacy practices. We do not currently use a third-party email-delivery provider or a third-party advertising or ad-tracking provider; if we add one, we will update this policy and identify it.

Affiliate and vendor relationships: our resources reference third-party tools for educational purposes only. We do not currently have active affiliate or paid vendor relationships. If we add affiliate links, sponsored placements, or paid vendor relationships in the future, we will disclose them clearly, and they will not change your MetrixScore™, report content, or recommendations. See our Affiliate Disclosure for details.

When you leave our platform and visit a third-party site, that site's privacy policy governs your data.`,
  },
  {
    title: 'Data Retention',
    body: `We keep personal information only as long as needed for the purposes described in this policy, to provide the service, to support and reassess your account, and to meet legal, tax, security, and recordkeeping obligations.

Information stored only on your device remains until you clear it or your browser removes it. Information backed up to your account remains until you delete it or it reaches the end of our retention schedule. As a general guide, we aim to retain account-linked personal information for up to 3 years after your last activity, after which it is deleted unless a longer period is required by law.

As described above, we may retain aggregated or de-identified information that is not used to identify you for longer periods for research, analytics, and product-improvement purposes.`,
  },
  {
    title: "Children's Privacy",
    body: `SubZeroMetrix is intended for adults (18+) who are starting, operating, or growing a business. We do not knowingly collect personal information from anyone under 18. If you believe a minor has submitted data through our platform, contact us immediately and we will delete it.

We do not target marketing to minors and our assessment is not designed for or directed at individuals under 18.`,
  },
  {
    title: 'Data Security',
    body: `We take reasonable technical and organizational measures to protect your personal data, including:

• HTTPS/TLS encryption in transit
• Row Level Security on user-owned database tables, so each record is limited to its owner; account writes use a public key plus your session, never a privileged service key in the browser
• Payment data handled entirely by Stripe (a PCI-DSS-compliant processor); we do not store payment-card credentials
• Marketing-list sign-ups are insert-only — they cannot be read, listed, or modified by other users

No method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security. We work to protect your information using reasonable safeguards.`,
  },
  {
    title: 'Do Not Track & Global Privacy Control',
    body: `Some browsers and browser extensions transmit "Do Not Track" (DNT) or Global Privacy Control (GPC) signals. SubZeroMetrix does not use tracking for advertising purposes. We do not respond to DNT signals specifically, but our general practice is to minimize data collection and not engage in cross-site tracking.

Texas residents: As of January 1, 2025, the TDPSA requires businesses to recognize Global Privacy Control signals for opt-out of data sale and targeted advertising. We do not sell personal data and do not engage in targeted advertising, so GPC signals are effectively honored by default.`,
  },
  {
    title: 'Future Evolution of Our Services',
    body: `As our services evolve, we may introduce additional features, analytics capabilities, integrations, and services. We may update this Privacy Policy when our data practices materially change. Where required, we will provide notice or obtain consent before applying materially different practices to personal information we previously collected.

This policy is intended to keep pace with legitimate platform development. It is not a blanket authorization to use your information without limits — we use information for the purposes described here and consistent with applicable law.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy periodically. The "Last updated" date at the top reflects the most recent revision and serves as the effective date of that version. Continued use of the platform after updates constitutes acceptance of the revised policy. For significant changes affecting your rights, we will provide notice or obtain consent where required, and we will attempt to notify active account users by email.`,
  },
  {
    title: 'Contact & Data Requests',
    body: `SubZeroMetrix™ is owned and operated by The Modern Trades Mentor LLC. For privacy questions, data access requests, correction requests, deletion requests, or concerns about this policy, contact us by email at info@subzerometrix.com.

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
          Last updated: June 12, 2026
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
