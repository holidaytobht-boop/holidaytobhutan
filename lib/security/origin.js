import { config } from '@/lib/db/env.js'
import { matchesClientOrigin } from '@/lib/security/originMatch.js'

/**
 * Validates Origin/Referer for state-changing requests (CSRF mitigation).
 * Allows missing Origin on same-site navigations in development only.
 */
export function isAllowedOrigin(req) {
  return matchesClientOrigin({
    origin: req.headers.get('origin'),
    referer: req.headers.get('referer'),
    allowedOrigins: config.clientOrigins,
    nodeEnv: config.nodeEnv,
  })
}

export { matchesClientOrigin } from '@/lib/security/originMatch.js'
