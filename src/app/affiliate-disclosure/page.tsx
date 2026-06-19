import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Affiliate Disclosure',
  description: 'SubZero Metrix affiliate disclosure — how we earn revenue and how it affects our recommendations.',
  path: '/affiliate-disclosure',
})

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Affiliate Disclosure</h1>

        <div className="prose-content">
          <p>
            SubZero Metrix is an independently operated software comparison
            platform. Some of the links on this website are affiliate links, which
            means SubZero Metrix LLC may earn a commission if you click on a link
            and make a purchase or sign up for a service. This comes at no
            additional cost to you.
          </p>

          <h2>How Affiliate Relationships Work</h2>
          <p>
            When we recommend a product and you sign up through our affiliate
            link, the vendor may pay us a referral commission. These commissions
            help fund the research, verification, and maintenance of this website.
          </p>

          <h2>How This Affects Our Recommendations</h2>
          <p>
            Affiliate compensation does not determine our editorial
            recommendations. We recommend tools based on use-case fit, verified
            features, published pricing, strengths, limitations, and honest
            assessment — not based on which vendor pays the highest commission.
          </p>
          <p>
            Not every product we list has an affiliate program. We include tools
            that we believe are relevant to our audience regardless of whether an
            affiliate relationship exists.
          </p>

          <h2>Accuracy and Changes</h2>
          <p>
            Product features, pricing, and affiliate terms may change at any time.
            We verify product details against vendor-published sources and include
            last-reviewed dates on our listings. However, we cannot guarantee that
            all information is current at the time you read it. We encourage you
            to verify current details directly with the vendor before making a
            purchase decision.
          </p>

          <h2>No Income Guarantee</h2>
          <p>
            SubZero Metrix does not guarantee any specific outcome, income, or
            result from using the tools we recommend. Your results will depend on
            your own efforts, circumstances, and decisions.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about our affiliate relationships or
            recommendations,{' '}
            <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
