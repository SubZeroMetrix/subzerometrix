import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SubZero Metrix',
    short_name: 'SubZero Metrix',
    description: 'SubZero Contractor Revenue Intelligence -- find where contractor revenue is leaking and what to fix first.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [],
  }
}
