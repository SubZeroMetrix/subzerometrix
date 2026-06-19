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
          <p>SubZero Metrix LLC (&quot;SubZero Metrix,&quot; &quot;we,&quot; &quot;us&quot;) operates the website at subzerometric.com. This policy explains how we collect, use, and protect your information.</p>
          <h2>Information We Collect</h2>
          <p><strong>Information you provide:</strong></p>
          <ul><li>Email address and use-case information when you sign up for our mailing list</li><li>Name, email, and message content when you use our contact form</li></ul>
          <p><strong>Information collected automatically (with consent):</strong></p>
          <ul><li>Page views and navigation patterns</li><li>Aggregate click data on affiliate links</li><li>Device type and browser information</li></ul>
          <p><strong>Information we do not collect:</strong></p>
          <ul><li>Payment card information (handled by third-party processors)</li><li>Passwords</li><li>Fingerprinting data</li><li>Session recordings or screen captures</li><li>Advertising pixels or invasive tracking</li></ul>
          <h2>How We Use Your Information</h2>
          <ul><li>To send you the content you requested (e.g., buying guides)</li><li>To respond to your contact form submissions</li><li>To improve our website and recommendations (aggregate analytics only)</li><li>To measure affiliate link performance in aggregate</li></ul>
          <h2>Cookies and Consent</h2>
          <p>We use essential cookies for basic website functionality. Optional analytics cookies are only used with your explicit consent. You can change your consent preferences at any time through the consent banner.</p>
          <p>Essential website functionality (including affiliate link redirects) works without optional consent.</p>
          <h2>Third-Party Services</h2>
          <p>When you click an affiliate link, you are redirected to a third-party vendor&apos;s website. That vendor&apos;s privacy policy governs your interaction with their service. We encourage you to review their privacy policy before providing personal information.</p>
          <h2>Data Retention</h2>
          <p>Contact form submissions are retained until your inquiry is resolved. Email list subscriptions are retained until you unsubscribe. Aggregate analytics data is retained in anonymized form.</p>
          <h2>Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at <Link href="/contact">our contact page</Link>.</p>
          <h2>Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with an updated effective date.</p>
          <h2>Contact</h2>
          <p>For privacy-related questions, contact SubZero Metrix LLC through our <Link href="/contact">contact page</Link>.</p>
        </div>
      </div>
    </div>
  )
}
