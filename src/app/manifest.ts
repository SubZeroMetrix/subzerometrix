import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Metrix Command Center',
    short_name: 'Metrix',
    description: 'Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/brand/metrix-command-center-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
