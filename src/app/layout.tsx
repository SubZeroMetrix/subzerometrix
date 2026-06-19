import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometric.com'

export const metadata: Metadata = {
  title: {
    default: 'SubZero Metrix — Compare Software for Online Business Growth',
    template: '%s | SubZero Metrix',
  },
  description:
    'SubZero Metrix compares software for websites, email, automation, ecommerce, newsletters, SEO, and online-business growth. Find the right tools before wasting money on the wrong ones.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'SubZero Metrix',
    images: [{ url: '/brand/subzero-metrix-logo.png', width: 1024, height: 1024, alt: 'SubZero Metrix' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  )
}
