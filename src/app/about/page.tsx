import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = buildMetadata({
  title: 'About',
  description: 'About SubZero Metrix — who we are, what we do, and how we help you choose the right software tools.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="section-container max-w-3xl">
        <Image
          src="/brand/subzero-metrix-logo.png"
          alt="SubZero Metrix"
          width={80}
          height={80}
          className="rounded-xl mb-8"
        />

        <p className="text-label text-brand-electric mb-3">About</p>
        <h1 className="text-headline text-gray-900 mb-8">About SubZero Metrix</h1>

        <div className="prose-content">
          <p>
            SubZero Metrix is an independent software comparison platform that
            helps entrepreneurs, creators, and business owners choose the right
            tools for their online business — before wasting money on the wrong
            ones.
          </p>
          <p>
            We compare software for websites, email marketing, automation,
            ecommerce, newsletters, SEO, and online-business growth. Every
            recommendation is based on use-case fit, verified features, published
            pricing, and honest assessment of strengths and limitations.
          </p>

          <h2>How We Make Money</h2>
          <p>
            SubZero Metrix earns revenue through affiliate partnerships. When you
            sign up for a tool through our links, we may earn a commission at no
            extra cost to you. These partnerships help fund our research and keep
            this resource free.
          </p>
          <p>
            Affiliate relationships do not determine our recommendations. We
            recommend tools based on fit, not commission rates. See our{' '}
            <Link href="/affiliate-disclosure">affiliate disclosure</Link> and{' '}
            <Link href="/editorial-policy">editorial policy</Link> for details.
          </p>

          <h2>Who We Are</h2>
          <p>
            SubZero Metrix is operated by SubZero Metrix LLC. We are a small,
            independent team focused on providing clear, honest, and practical
            software guidance for people building online businesses.
          </p>
          <p>
            <Link href="/about/richard-fritzke">Meet Richard Fritzke</Link>, our founder and editor-in-chief.
          </p>

          <h2>Contact Us</h2>
          <p>
            Have questions, corrections, or feedback?{' '}
            <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
