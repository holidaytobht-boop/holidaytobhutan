import { NextResponse } from 'next/server'
import { ensureDb } from '@/lib/db/ensure.js'
import { enforceRateLimit } from '@/lib/security/guard.js'
import { isAllowedOrigin } from '@/lib/security/origin.js'
import {
  clearLoginAttempts,
  isLoginLocked,
  recordFailedLogin,
} from '@/lib/security/loginLockout.js'
import { getClientIp } from '@/lib/security/request.js'
import {
  authCookieOptions,
  createToken,
  validateCredentials,
} from '@/lib/server-auth.js'

export async function POST(req) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json(
      { success: false, message: 'Login blocked. Use HTTPS and open the site from its real domain.' },
      { status: 403 }
    )
  }

  const ip = getClientIp(req)

  const locked = isLoginLocked(ip)
  if (locked.locked) {
    const retryAfter = Math.max(1, Math.ceil(locked.retryAfterMs / 1000))
    return NextResponse.json(
      { success: false, message: 'Too many failed login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const limited = enforceRateLimit(req, 'auth-login', { limit: 10, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  await ensureDb()

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 })
  }

  const { email, password } = body || {}
  if (!email?.trim() || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required.' },
      { status: 400 }
    )
  }

  if (password.length > 256) {
    return NextResponse.json(
      { success: false, message: 'Invalid email or password.' },
      { status: 401 }
    )
  }

  if (!(await validateCredentials(email, password))) {
    recordFailedLogin(ip)
    return NextResponse.json(
      { success: false, message: 'Invalid email or password.' },
      { status: 401 }
    )
  }

  clearLoginAttempts(ip)

  const normalizedEmail = email.trim().toLowerCase()
  const token = await createToken(normalizedEmail)
  const response = NextResponse.json(
    { success: true, data: { email: normalizedEmail } },
    { status: 200 }
  )
  response.cookies.set(authCookieOptions(token, req))
  return response
}
