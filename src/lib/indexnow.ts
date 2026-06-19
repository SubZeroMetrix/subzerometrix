export const INDEXNOW_KEY = '3f8a9b2c1d4e5f6a7b8c9d0e1f2a3b4c'

export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) return

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometric.com'
  let host: string
  try {
    host = new URL(siteUrl).host
  } catch {
    console.error('[IndexNow] Invalid NEXT_PUBLIC_SITE_URL')
    return
  }

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/.well-known/indexnow`,
        urlList: urls.map((u) => (u.startsWith('http') ? u : `${siteUrl}${u}`)),
      }),
    })

    if (!response.ok) {
      console.error(`[IndexNow] Submission failed: ${response.status} ${response.statusText}`)
    }
  } catch (err) {
    console.error('[IndexNow] Submission error:', err instanceof Error ? err.message : err)
  }
}
