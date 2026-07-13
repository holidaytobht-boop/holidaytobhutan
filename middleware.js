import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/middleware-auth.js'

const isProd = process.env.NODE_ENV === 'production'

function buildContentSecurityPolicy() {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://i.pravatar.cc",
    "font-src 'self' data:",
    "connect-src 'self'",
  ]

  if (isProd) {
    directives.push('upgrade-insecure-requests')
  } else {
    directives[5] = "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  }

  return directives.join('; ')
}

function applySecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy())

  if (isProd) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authenticated = await verifyAdminCookie(request)
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('next', pathname)
      return applySecurityHeaders(NextResponse.redirect(loginUrl))
    }
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
}
