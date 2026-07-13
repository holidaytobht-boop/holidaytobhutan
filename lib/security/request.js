import { config } from '@/lib/db/env.js'

export function getClientIp(req) {
  if (config.trustProxy) {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()

    const realIp = req.headers.get('x-real-ip')
    if (realIp) return realIp.trim()
  }

  return 'local'
}
