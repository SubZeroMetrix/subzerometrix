/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — stops your app being embedded in iframes
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME-type sniffing attacks
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control how much referrer info is sent to external sites
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable browser features your app doesn't use
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          // Force HTTPS for 1 year once deployed (ignored on localhost)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Basic XSS protection layer (belt-and-suspenders with CSP)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets aggressively — speeds up repeat visits
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        // Keep old contractor-builders URL working — redirects to ecosystem page
        source: '/contractor-builders',
        destination: '/platform-ecosystem',
        permanent: true,
      },
    ]
  },
}

// next-pwa is an optional progressive enhancement.
// The build proceeds without it if the package is not installed.
try {
  const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [],
  })
  module.exports = withPWA(nextConfig)
} catch {
  module.exports = nextConfig
}
