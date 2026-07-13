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
          <p>SubZero Metrix LLC (&quot;SubZero Metrix,&quot; &quot;we,&quot; &quot;us&quot;) operates the website at subzerometrix.com. This policy explains how we collect, use, and protect your information.</p>
          <h2>Information We Collect</h2>
          <p><strong>Information you provide:</strong></p>
          <ul><li>Email address and use-case information when you sign up for our mailing list</li><li>Name, email, and message content when you use our contact form</li><li>Name, email, phone number (optional), company (optional), and message content when you submit the Metrix Command Center interest form</li></ul>
          <p><strong>Information collected automatically (with consent):</strong></p>
          <ul><li>Page views and navigation patterns</li><li>Aggregate click data on affiliate links</li><li>Device type and browser information</li></ul>
          <p><strong>Information we do not collect:</strong></p>
          <ul><li>Payment card information (handled by third-party processors)</li><li>Passwords</li><li>Fingerprinting data</li><li>Session recordings or screen captures</li><li>Advertising pixels or invasive tracking</li></ul>
          <h2>How We Use Your Information</h2>
          <ul><li>To send you the content you requested (e.g., buying guides)</li><li>To respond to your contact form submissions</li><li>To follow up on interest submitted through the Metrix Command Center form</li><li>To improve our website and recommendations (aggregate analytics only)</li><li>To measure affiliate link performance in aggregate</li></ul>
          <h2>Cookies and Consent</h2>
          <p>We use essential cookies for basic website functionality. Our first-party analytics (page views, navigation patterns used to improve our recommendations) are only used with your explicit consent, given through the consent banner, and you can change that choice at any time.</p>
          <p>Essential website functionality (including affiliate link redirects) works without optional consent.</p>
          <p><em>[DRAFT — ATTORNEY REVIEW REQUIRED]</em> We also use Vercel Web Analytics, a cookieless, privacy-focused analytics service that does not use cookies or collect personally identifiable information, and is not currently gated behind the consent banner above (it operates independently of cookie-based consent because it sets no cookies). We believe this is accurate and common practice for cookieless analytics tools, but have not had this specific characterization confirmed by counsel.</p>
          <h2>Third-Party Services</h2>
          <p>When you click an affiliate link, you are redirected to a third-party vendor&apos;s website. That vendor&apos;s privacy policy governs your interaction with their service. We encourage you to review their privacy policy before providing personal information.</p>
          <p>We use the following third-party service providers to operate this website: Supabase (database hosting, for both this site&apos;s own data and, in an entirely separate and isolated database, Metrix Command Center interest-form submissions), Vercel (hosting and analytics), and Resend (transactional email, where applicable).</p>
          <p><em>[DRAFT — ATTORNEY REVIEW REQUIRED]</em> If you click &quot;Start Free Trial&quot; or otherwise proceed to Metrix Command Center, you leave this website and are taken to mcc.subzerometrix.com, a separate application operated by SubZero Metrix LLC under its own account system, authentication, and billing (via Stripe). Your use of that application is governed by its own terms and privacy policy, not this one.</p>
          <h2>Data Retention</h2>
          <p>Contact form submissions are retained until your inquiry is resolved. Email list subscriptions are retained until you unsubscribe. Metrix Command Center interest-form submissions are retained until you request deletion or the inquiry is resolved. Aggregate analytics data is retained in anonymized form.</p>
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
