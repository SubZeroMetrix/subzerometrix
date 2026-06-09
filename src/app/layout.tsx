import type { Metadata, Viewport } from 'next'
import './globals.css'
import InstallPrompt from '@/components/InstallPrompt'

export const metadata: Metadata = {
  title: 'SubZeroMetrix | MetrixScore™ — Know Your Business Temperature',
  description:
    'Get your MetrixScore™ — personalized business readiness roadmap for trades and service businesses. Know your temperature. Build from there.',
  applicationName: 'SubZeroMetrix',
  keywords: ['MetrixScore', 'trades business', 'contractor readiness', 'HVAC business', 'plumbing business', 'electrical contractor', 'roofing business', 'landscaping', 'cleaning business', 'handyman', 'SubZeroMetrix'],
  authors: [{ name: 'The Modern Trades Mentor' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SubZeroMetrix',
    startupImage: [
      { url: '/icons/splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/icons/splash-1668x2388.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/icons/splash-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/icons/splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/icons/splash-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/icons/splash-750x1334.png',  media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/icons/splash-640x1136.png',  media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
    ],
  },
  openGraph: {
    title: 'SubZeroMetrix | MetrixScore™',
    description: 'Is your business running cold? Take the free MetrixScore™ assessment and get your personalized roadmap.',
    type: 'website',
    siteName: 'SubZeroMetrix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubZeroMetrix | MetrixScore™',
    description: 'Is your business running cold? Free assessment + personalized roadmap for every trade.',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon.svg', color: '#4A90D9' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A1628' },
    { media: '(prefers-color-scheme: dark)',  color: '#0A1628' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA install support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#0A1628" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        {/* Prevent phone number detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="noise">
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}
