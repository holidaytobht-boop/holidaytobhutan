import { SignJWT, jwtVerify } from 'jose'
import { config } from '@/lib/db/env.js'
import { getTokenVersion, verifyAdminCredentials } from '@/lib/services/adminCredentials.js'

export const AUTH_COOKIE = 'htb_auth_token'
const TOKEN_MAX_AGE = 60 * 60 * 24
const JWT_ISSUER = 'holiday-to-bhutan'
const JWT_AUDIENCE = 'admin'

function getSecret() {
  return new TextEncoder().encode(config.authSecret)
}

export async function createToken(email) {
  const tokenVersion = await getTokenVersion()
  return new SignJWT({ email: email.trim().toLowerCase(), tv: tokenVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('24h')
    .sign(getSecret())
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
    if (!payload.email) return null

    const storedVersion = await getTokenVersion()
    const tokenVersion = payload.tv

    if (tokenVersion !== undefined && tokenVersion !== storedVersion) return null
    if (tokenVersion === undefined && storedVersion > 0) return null

    return { email: payload.email }
  } catch {
    return null
  }
}

/** Lightweight JWT check for middleware — no DB token-version lookup. */
export async function verifyTokenSignature(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
    if (!payload.email) return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]+)`))
  if (match) return decodeURIComponent(match[1])
  return null
}

export async function getSession(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function authCookieOptions(token) {
  return {
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  }
}

export function clearAuthCookieOptions() {
  return {
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: 0,
  }
}

export async function validateCredentials(email, password) {
  return verifyAdminCredentials(email, password)
}
