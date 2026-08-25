/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Retired-product routes still indexed by Google/Bing (confirmed via GSC page-indexing
  // report 2026-08-25 -- editorial-policy, /help/*, and others were returning bare 404s
  // with no redirect since the affiliate/tool-comparison app was retired). Redirect to the
  // closest real current equivalent so search engines re-crawl and deindex the old URL
  // instead of leaving a dead link indexed indefinitely.
  async redirects() {
    return [
      { source: '/editorial-policy', destination: '/about', permanent: true },
      { source: '/editorial-methodology', destination: '/about', permanent: true },
      { source: '/affiliate-disclosure', destination: '/privacy', permanent: true },
      { source: '/disclaimer', destination: '/privacy', permanent: true },
      { source: '/cancellation', destination: '/contact', permanent: true },
      { source: '/help/estimate-recovery', destination: '/resources/tools/follow-up-revenue-calculator', permanent: true },
      { source: '/help/estimate-calculator', destination: '/resources/tools/estimate-follow-up-priority-calculator', permanent: true },
      { source: '/help/mcc-account-help', destination: '/modern-trades-crm', permanent: true },
      { source: '/help/free-trial-details', destination: '/modern-trades-crm', permanent: true },
      { source: '/help/:slug*', destination: '/resources', permanent: true },
      { source: '/tools/:slug*', destination: '/resources', permanent: true },
      { source: '/tool-finder', destination: '/revenue-leak-check', permanent: true },
      { source: '/compare/:slug*', destination: '/resources', permanent: true },
      { source: '/reviews/:slug*', destination: '/resources', permanent: true },
      { source: '/guides/:slug*', destination: '/resources', permanent: true },
      { source: '/features/:slug*', destination: '/modern-trades-crm', permanent: true },
      { source: '/customer-care/:slug*', destination: '/contact', permanent: true },
      { source: '/buster', destination: '/contact', permanent: true },
      { source: '/assessment', destination: '/revenue-leak-check', permanent: true },
      { source: '/business-readiness', destination: '/revenue-leak-check', permanent: true },
      { source: '/foundation-builder', destination: '/resources', permanent: true },
      { source: '/general-business-starter', destination: '/resources', permanent: true },
      { source: '/contractor-builders', destination: '/resources', permanent: true },
      { source: '/growth', destination: '/resources', permanent: true },
      { source: '/dashboard', destination: '/', permanent: true },
      { source: '/account/:slug*', destination: '/', permanent: true },
      { source: '/es', destination: '/', permanent: true },
      { source: '/es/:slug*', destination: '/', permanent: true },
      { source: '/resources/myappfac/:slug*', destination: '/resources', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      {
        source: '/brand/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
