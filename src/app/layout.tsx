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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometrix.com'

export const metadata: Metadata = {
  title: {
    default: 'Metrix Command Center — Governed AI Business Operating System',
    template: '%s | Metrix Command Center',
  },
  description:
    'Metrix Command Center helps service businesses find missed revenue, organize customer operations, and know what to do next — with a governed AI team where every recommendation requires your approval.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Metrix Command Center',
    images: [{ url: '/brand/metrix-command-center-logo.png', width: 600, height: 400, alt: 'Metrix Command Center' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/brand/metrix-command-center-logo.png',
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
        <Analytics />
      </body>
    </html>
  )
}
