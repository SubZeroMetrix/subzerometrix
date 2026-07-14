// Simple in-memory per-IP rate limiter, shared across landing-page API
// routes. Resets on redeploy (known limitation, matches the existing
// mcc-lead route's documented tradeoff) -- adequate for a low-traffic
// public form, not a substitute for a durable rate-limit store.

const RATE_LIMIT_MAPS = new Map<string, Map<string, number[]>>()

export function checkRateLimit(bucket: string, ip: string, maxRequests = 5, windowMs = 60_000): boolean {
  let map = RATE_LIMIT_MAPS.get(bucket)
  if (!map) {
    map = new Map()
    RATE_LIMIT_MAPS.set(bucket, map)
  }
  const now = Date.now()
  const requests = map.get(ip) || []
  const recent = requests.filter((t) => now - t < windowMs)
  if (recent.length >= maxRequests) return false
  recent.push(now)
  map.set(ip, recent)
  return true
}

export function getClientIp(request: Request): string {
  const headers = (request as Request & { headers: Headers }).headers
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
