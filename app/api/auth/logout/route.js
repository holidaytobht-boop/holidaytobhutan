import { NextResponse } from 'next/server'
import { clearAuthCookieOptions } from '@/lib/server-auth.js'
import { isAllowedOrigin } from '@/lib/security/origin.js'

export async function POST(req) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const response = NextResponse.json({ success: true }, { status: 200 })
  response.cookies.set(clearAuthCookieOptions())
  return response
}
