import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'SubZero Metrix privacy policy — how we collect, use, and protect your information.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">Legal</p>
        <h1 className="text-headline text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose-content">
          <p>SubZeroMetrix LLC (&quot;SubZero Metrix,&quot; &quot;we,&quot; &quot;us&quot;) operates the website at subzerometrix.com. This policy explains how we collect, use, and protect your information.</p>

          <h2>The Revenue Leak Check</h2>
          <p>The Revenue Leak Check runs entirely in your browser. Your answers are not sent to a server, not stored, and not included in analytics unless you explicitly submit contact information through a separate form.</p>

          <h2>Information We Collect</h2>
          <p><strong>Information you provide:</strong></p>
          <ul><li>Name, email, and message content when you use our contact form</li></ul>
          <p><strong>Information collected automatically (with consent):</strong></p>
          <ul><li>Page views and navigation patterns</li><li>Device type and browser information</li></ul>
          <p><strong>Information we do not collect:</strong></p>
          <ul><li>Payment card information</li><li>Passwords</li><li>Fingerprinting data</li><li>Session recordings or screen captures</li><li>Advertising pixels or invasive tracking</li></ul>

          <h2>How We Use Your Information</h2>
          <ul><li>To respond to your contact form submissions</li><li>To improve our website and content (aggregate analytics only)</li></ul>

          <h2>Cookies and Consent</h2>
          <p>We use essential cookies for basic website functionality. Our first-party analytics (page views, navigation patterns used to improve our content) are only used with your explicit consent, given through the consent banner, and you can change that choice at any time.</p>
          <p>We also use Vercel Web Analytics, a cookieless, privacy-focused analytics service that does not use cookies or collect personally identifiable information, and is not gated behind the consent banner (it sets no cookies).</p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party service providers to operate this website: Vercel (hosting and analytics) and, where applicable, an email provider for contact-form responses.</p>
          <p>Modern Trades CRM and The Modern Trades Mentor are separate, affiliated properties with their own account systems, terms, and privacy policies. Leaving this site to visit either one is governed by their policies, not this one.</p>

          <h2>Data Retention</h2>
          <p>Contact form submissions are retained until your inquiry is resolved. Aggregate analytics data is retained in anonymized form.</p>

          <h2>Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at <Link href="/contact">our contact page</Link>.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with an updated effective date.</p>

          <h2>Contact</h2>
          <p>For privacy-related questions, contact SubZeroMetrix LLC through our <Link href="/contact">contact page</Link>.</p>
        </div>
      </div>
    </div>
  )
}
