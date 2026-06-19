import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Editorial Policy',
  description: 'How SubZero Metrix evaluates, recommends, and verifies software tools — our editorial methodology.',
  path: '/editorial-policy',
})

export default function EditorialPolicyPage() {
  return (
    <div className="py-20">
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">Editorial</p>
        <h1 className="text-headline text-gray-900 mb-8">Editorial Policy</h1>
        <div className="prose-content">
          <p>SubZero Metrix is committed to providing honest, accurate, and useful software recommendations. This policy explains how we evaluate tools, make recommendations, and maintain editorial integrity.</p>
          <h2>How We Evaluate Tools</h2>
          <p>Every product listed on SubZero Metrix is evaluated based on:</p>
          <ul><li><strong>Use-case fit:</strong> Who is this tool actually built for? Who should avoid it?</li><li><strong>Features and capabilities:</strong> What does it actually do well?</li><li><strong>Limitations:</strong> Where does it fall short?</li><li><strong>Pricing and value:</strong> What does it cost and is the pricing reasonable for the value?</li><li><strong>Setup complexity:</strong> How difficult is it to get started?</li><li><strong>Verification:</strong> Are the claimed features confirmed from vendor-published sources?</li></ul>
          <h2>Affiliate Relationships</h2>
          <p>SubZero Metrix may earn commissions when visitors sign up for tools through our affiliate links. This is how we fund research and keep this resource free.</p>
          <p><strong>Compensation does not determine ranking or recommendations.</strong> We recommend tools based on fit, limitations, price, complexity, value, and verification — not based on commission rates. We include tools without affiliate programs when they are relevant to our audience.</p>
          <h2>Verification Process</h2>
          <p>Product information is verified against vendor-published sources including official websites, documentation, and pricing pages. Each product listing includes a last-reviewed date so you know how current the information is.</p>
          <h2>What We Do Not Do</h2>
          <ul><li>We do not guarantee income or results from any tool</li><li>We do not accept payment for favorable reviews</li><li>We do not fabricate user counts, reviews, or testimonials</li><li>We do not use fake scarcity, urgency, or discounts</li><li>We do not make unsubstantiated &quot;best&quot; claims without context</li></ul>
          <h2>Changes and Corrections</h2>
          <p>Product terms, features, and commissions may change at any time. We update listings periodically and encourage visitors to verify current details with vendors before making decisions.</p>
          <p>If you find an error in our content, please <Link href="/contact">report it</Link> and we will investigate and correct it promptly.</p>
          <h2>Editorial Independence</h2>
          <p>All editorial decisions are made by SubZero Metrix independently. We do not imply partnership, endorsement, or preferred status with any vendor unless such a relationship has been explicitly established and disclosed.</p>
        </div>
      </div>
    </div>
  )
}
