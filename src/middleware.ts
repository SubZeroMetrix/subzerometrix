import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const isAdminPath = ADMIN_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))

  if (isAdminPath) {
    return updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
