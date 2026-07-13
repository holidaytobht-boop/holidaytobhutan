import { jwtVerify } from 'jose'

export const AUTH_COOKIE = 'htb_auth_token'
const JWT_ISSUER = 'holiday-to-bhutan'
const JWT_AUDIENCE = 'admin'

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim()
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

export function getAuthTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]+)`))
  if (match) return decodeURIComponent(match[1])
  return null
}

/** Edge-safe JWT verification for middleware (signature only, no DB revocation check). */
export async function verifyAdminCookie(request) {
  const token = getAuthTokenFromRequest(request)
  if (!token) return false

  const secret = getSecret()
  if (!secret) return false

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
    return Boolean(payload.email)
  } catch {
    return false
  }
}
