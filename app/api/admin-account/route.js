import { NextResponse } from 'next/server'
import { ensureDb } from '@/lib/db/ensure.js'
import { authCookieOptions, createToken, getSession } from '@/lib/server-auth.js'
import { enforceRateLimit } from '@/lib/security/guard.js'
import { isAllowedOrigin } from '@/lib/security/origin.js'
import { getAdminAccount, updateAdminAccount } from '@/lib/services/adminCredentials.js'

export async function GET(req) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  await ensureDb()

  let status = 200
  let payload = null
  const mockReq = { method: 'GET' }
  const mockRes = {
    status(code) {
      status = code
      return mockRes
    },
    json(data) {
      payload = data
      return mockRes
    },
  }

  await getAdminAccount(mockReq, mockRes)
  return NextResponse.json(payload, { status })
}

export async function PUT(req) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const limited = enforceRateLimit(req, 'admin-account', { limit: 5, windowMs: 60 * 60 * 1000 })
  if (limited) return limited

  await ensureDb()

  let body = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 })
  }

  let status = 200
  let payload = null
  const mockReq = { method: 'PUT', body, sessionEmail: session.email }
  const mockRes = {
    status(code) {
      status = code
      return mockRes
    },
    json(data) {
      payload = data
      return mockRes
    },
  }

  await updateAdminAccount(mockReq, mockRes)
  const response = NextResponse.json(payload, { status })

  if (status === 200 && payload?.data?.email) {
    const token = await createToken(payload.data.email)
    response.cookies.set(authCookieOptions(token))
  }

  return response
}
