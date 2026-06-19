import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const googleCode = process.env.GOOGLE_SITE_VERIFICATION || ''
  const bingCode = process.env.BING_SITE_VERIFICATION || ''

  const isGoogle = request.nextUrl.searchParams.has('google')
  const isBing = request.nextUrl.searchParams.has('bing')

  const metaTags: string[] = []

  if (isGoogle && googleCode) {
    metaTags.push(`<meta name="google-site-verification" content="${googleCode}" />`)
  }
  if (isBing && bingCode) {
    metaTags.push(`<meta name="msvalidate.01" content="${bingCode}" />`)
  }

  if (metaTags.length === 0) {
    return new NextResponse('No verification codes configured.', { status: 404 })
  }

  const html = `<!DOCTYPE html>
<html>
<head>
${metaTags.join('\n')}
<title>Search Verification — SubZero Metrix</title>
</head>
<body>
<p>Search engine verification page.</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
