import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ConsentBanner } from '@/components/ConsentBanner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'

export const metadata: Metadata = {
  title: {
    default: 'Metrix Command Center | Contractor Lead and Estimate Follow-Up',
    template: '%s | Metrix Command Center',
  },
  description:
    'Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Metrix Command Center',
    title: 'Metrix Command Center | Contractor Lead and Estimate Follow-Up',
    description:
      'Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
    images: [{ url: '/brand/metrix-command-center-logo.png', width: 600, height: 400, alt: 'Metrix Command Center' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/brand/metrix-command-center-logo.png',
  },
  // Populated once real verification codes are issued by Google Search
  // Console / Bing Webmaster Tools (GOOGLE_SITE_VERIFICATION /
  // BING_SITE_VERIFICATION env vars). Next.js injects these into every
  // page's <head> automatically -- this is the mechanism search engines
  // actually check on the homepage itself, unlike a standalone route.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AnnouncementBar />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  )
}
