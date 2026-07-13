import { NextResponse } from 'next/server'
import { getClientIp } from '@/lib/security/request.js'
import { rateLimit } from '@/lib/security/rateLimit.js'

export function enforceRateLimit(req, namespace, options) {
  const ip = getClientIp(req)
  const result = rateLimit(`${namespace}:${ip}`, options)

  if (!result.allowed) {
    const retryAfter = Math.max(1, Math.ceil(result.retryAfterMs / 1000))
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    )
  }

  return null
}
