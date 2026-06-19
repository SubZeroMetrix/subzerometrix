import { NextResponse } from 'next/server'

const INDEXNOW_KEY = '3f8a9b2c1d4e5f6a7b8c9d0e1f2a3b4c'

export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
