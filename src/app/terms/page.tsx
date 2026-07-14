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
          <p>By accessing and using subzerometrix.com (the &quot;Site&quot;), operated by SubZero Metrix LLC, you agree to these terms.</p>
          <h2>Content and Recommendations</h2>
          <p>The information on this Site is provided for general informational purposes. Software recommendations, reviews, and comparisons are based on our editorial evaluation process and are not guarantees of any specific outcome or result.</p>
          <p>Product features, pricing, and availability may change at any time. We encourage you to verify current details directly with vendors before making purchase decisions.</p>
          <h2>Affiliate Links</h2>
          <p>This Site contains affiliate links. When you click on these links and make a purchase, SubZero Metrix LLC may earn a commission at no additional cost to you. See our <Link href="/affiliate-disclosure">affiliate disclosure</Link> for details.</p>
          <h2>Metrix Command Center</h2>
          <p>This Site also markets Metrix Command Center, a separate software application operated by SubZero Metrix LLC at mcc.subzerometrix.com, governed by its own separate terms of service upon signup. The following pricing facts are accurate as displayed on this Site as of the date of this policy and are provided here for reference; the authoritative, binding terms are those presented during signup and checkout on mcc.subzerometrix.com:</p>
          <ul>
            <li>Command Center: $99/month; Founder CRM: $39/month (requires an approved founder code, limited availability)</li>
            <li>Both plans include a 7-day free trial</li>
            <li>Billing is monthly only — no annual plans</li>
            <li>You may cancel at any time; access continues through the end of your current billing period</li>
            <li>No prorated or discretionary refunds are issued; refunds are provided only where legally required or to correct a genuine billing error</li>
          </ul>
          <h2>No Guarantees</h2>
          <p>SubZero Metrix does not guarantee any specific income, result, or outcome from using the tools or following the recommendations on this Site. Your results depend on your own efforts, decisions, and circumstances.</p>
          <h2>Intellectual Property</h2>
          <p>SubZero Metrix&trade; is a trademark of SubZero Metrix LLC. All original content on this Site is the property of SubZero Metrix LLC. Product names, logos, and brands mentioned on this Site are the property of their respective owners.</p>
          <h2>Limitation of Liability</h2>
          <p>SubZero Metrix LLC provides this Site &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of this Site or reliance on its content.</p>
          <h2>Changes</h2>
          <p>We may update these terms at any time. Continued use of the Site after changes constitutes acceptance of the updated terms.</p>
          <h2>Contact</h2>
          <p>Questions about these terms? <Link href="/contact">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  )
}
