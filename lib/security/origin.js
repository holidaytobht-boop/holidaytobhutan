import { config } from '@/lib/db/env.js'
import { matchesClientOrigin } from '@/lib/security/originMatch.js'

function originsFromRequestHost(req) {
  const host = req.headers.get('host')?.trim()
  if (!host) return []

  const hosts = new Set([host])
  const hostname = host.split(':')[0]
  if (hostname && hostname !== host) hosts.add(hostname)

  const origins = []
  for (const value of hosts) {
    origins.push(`https://${value}`, `http://${value}`)
  }
  return origins.map((origin) => origin.replace(/\/+$/, ''))
}

function resolveAllowedOrigins(req) {
  if (config.clientOriginsExplicit) return config.clientOrigins
  if (config.nodeEnv === 'production') return originsFromRequestHost(req)
  return config.clientOrigins
}

/**
 * Validates Origin/Referer for state-changing requests (CSRF mitigation).
 * Uses CLIENT_ORIGIN when set; otherwise matches the incoming Host header in production.
 */
export function isAllowedOrigin(req) {
  return matchesClientOrigin({
    origin: req.headers.get('origin'),
    referer: req.headers.get('referer'),
    allowedOrigins: resolveAllowedOrigins(req),
    nodeEnv: config.nodeEnv,
  })
}

export { matchesClientOrigin } from '@/lib/security/originMatch.js'
