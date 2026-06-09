import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Cancellation & Refund Policy | SubZeroMetrix' }

export default function CancellationPage() {
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
        <h1 className="font-display text-4xl tracking-wider text-brand-white leading-none mb-1">
          CANCELLATION &<br />REFUND POLICY
        </h1>
        <p className="font-mono text-[10px] text-brand-silver mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>

        {/* Plain English box */}
        <div className="mb-8 p-4 rounded-sm border border-brand-accent/30" style={{ background: 'rgba(74,144,217,0.08)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-2">Plain English</p>
          <p className="text-brand-silver text-xs leading-relaxed">
            One-time purchases are final — no refunds except for verified technical failures. Monthly subscriptions can be cancelled anytime with no penalty and no partial-month refunds. To cancel, email us with "Cancel Subscription" in the subject line.
          </p>
        </div>

        <div className="space-y-8">

          <div>
            <h2 className="font-display text-2xl tracking-wider text-brand-white mb-4">ONE-TIME PURCHASES</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Products covered</h3>
                <p className="text-brand-silver text-xs leading-relaxed">MetrixScore™ Basic ($9.99) and MetrixScore™ Pro ($19.99) are one-time digital purchases.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Refund policy</h3>
                <p className="text-brand-silver text-xs leading-relaxed">All one-time purchases are final and non-refundable. Your report is generated and delivered immediately upon payment confirmation. Because the digital product is provided instantly, we do not offer refunds for change of mind, unused portions, or dissatisfaction with the score result.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Exceptions</h3>
                <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`We will consider a refund only if:
• A verified technical failure prevented report delivery after a confirmed Stripe payment
• A duplicate charge occurred due to a technical error on our end

To request a refund under these circumstances, contact us within 7 days of purchase through The Modern Trades Mentor website. Include your purchase email and a description of the issue. We will review and respond within 5 business days.`}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Chargebacks</h3>
                <p className="text-brand-silver text-xs leading-relaxed">If you initiate a chargeback with your card issuer without first contacting us, we reserve the right to contest the dispute and terminate your platform access. Please contact us first — we want to resolve issues directly.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="font-display text-2xl tracking-wider text-brand-white mb-4">TRADE PLATFORM SUBSCRIPTION</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Product covered</h3>
                <p className="text-brand-silver text-xs leading-relaxed">The Trade Platform subscription ($29.00/month) is a recurring monthly subscription billed automatically through Stripe.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">How to cancel</h3>
                <div className="rounded-sm p-4 border border-brand-accent/25" style={{ background: 'rgba(74,144,217,0.06)' }}>
                  <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`Step 1: Email us at The Modern Trades Mentor website
Step 2: Use subject line: "Cancel Subscription"
Step 3: Include the email address used for your purchase
Step 4: We will confirm your cancellation within 2 business days`}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">When cancellation takes effect</h3>
                <p className="text-brand-silver text-xs leading-relaxed">Your subscription will remain active until the end of your current billing period. You will not be charged for the next month. We do not prorate partial months — you retain access for the full period you paid for.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">No cancellation fees</h3>
                <p className="text-brand-silver text-xs leading-relaxed">There is no cancellation fee, no early termination penalty, and no minimum commitment period. You can cancel after your first month.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-white mb-1.5">Subscription refunds</h3>
                <p className="text-brand-silver text-xs leading-relaxed">Monthly subscription charges are non-refundable once the billing period has begun. To avoid a charge, you must cancel before your next billing date. If you cancel within 48 hours of your very first subscription payment and have not accessed the platform, contact us — we will consider a full refund at our discretion.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="font-display text-2xl tracking-wider text-brand-white mb-4">CONTACT FOR BILLING ISSUES</h2>
            <p className="text-brand-silver text-xs leading-relaxed mb-4">
              For all cancellation requests, billing questions, duplicate charge reports, or refund requests, contact us through The Modern Trades Mentor website.
            </p>
            <div className="rounded-sm p-4 border border-white/10" style={{ background: 'rgba(13,43,92,0.3)' }}>
              <p className="text-brand-silver text-xs leading-relaxed whitespace-pre-line">{`When contacting us, please include:
• The email address used for your purchase
• Your Stripe receipt or order confirmation number (if available)
• A brief description of your issue or request
• For cancellations: use subject line "Cancel Subscription"

We respond to all billing inquiries within 2 business days.`}</p>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">Related policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['Terms of Service', '/terms'],
              ['Privacy Policy', '/privacy'],
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
