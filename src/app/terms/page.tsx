import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'SubZero Metrix terms of use — the terms and conditions governing use of this website.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">Legal</p>
        <h1 className="text-headline text-gray-900 mb-8">Terms of Use</h1>
        <div className="prose-content">
          <p>By accessing and using subzerometrix.com (the &quot;Site&quot;), operated by SubZeroMetrix LLC, you agree to these terms.</p>

          <h2>Content and Recommendations</h2>
          <p>The information on this Site is provided for general informational purposes — contractor revenue-leak research, a free self-assessment, and related educational content. It is not a guarantee of any specific outcome or result. Your results depend on your own business, decisions, and follow-through.</p>

          <h2>Ownership &amp; Affiliations</h2>
          <p>This Site is owned and published by SubZeroMetrix LLC. Modern Trades CRM and The Modern Trades Mentor are affiliated offerings. Where this Site recommends either one, that is a disclosed affiliation, not an independent third-party endorsement. TMT consulting is optional and is not required to use Modern Trades CRM. See <Link href="/about#ownership">Ownership &amp; Affiliations</Link> for full detail.</p>

          <h2>No Guarantees</h2>
          <p>SubZero Metrix does not guarantee any specific revenue, result, or outcome from using the tools, assessment, or recommendations on this Site.</p>

          <h2>Intellectual Property</h2>
          <p>SubZero Metrix&trade; is a trademark of SubZeroMetrix LLC. Original content on this Site is the property of SubZeroMetrix LLC. Product names, logos, and brands mentioned on this Site are the property of their respective owners.</p>

          <h2>Limitation of Liability</h2>
          <p>SubZeroMetrix LLC provides this Site &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of this Site or reliance on its content.</p>

          <h2>Changes</h2>
          <p>We may update these terms at any time. Continued use of the Site after changes constitutes acceptance of the updated terms.</p>

          <h2>Contact</h2>
          <p>Questions about these terms? <Link href="/contact">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  )
}
