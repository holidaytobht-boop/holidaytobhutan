import { NextResponse } from 'next/server'
import { ensureDb } from '@/lib/db/ensure.js'
import { config } from '@/lib/db/env.js'
import { getSession } from '@/lib/server-auth.js'
import { enforceRateLimit } from '@/lib/security/guard.js'
import { isAllowedOrigin } from '@/lib/security/origin.js'
import { getClientIp } from '@/lib/security/request.js'

const MAX_JSON_BODY = 256 * 1024

/**
 * Wraps a service handler for Next.js Route Handlers.
 * Services use the same (req, res) shape as before — one small adapter, not a separate server.
 */
export function route(handler, options = {}) {
  return async (req, context = {}) => {
    if (options.rateLimit) {
      const limited = enforceRateLimit(req, options.rateLimit.namespace, options.rateLimit)
      if (limited) return limited
    }

    const isMutation = req.method !== 'GET' && req.method !== 'HEAD'
    if (isMutation && (options.requireAdmin || options.checkOrigin)) {
      if (!isAllowedOrigin(req)) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
    }

    if (options.requireAdmin) {
      const session = await getSession(req)
      if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
      }
      context.session = session
    }

    await ensureDb()

    const params = (await context.params) || {}
    let body = null

    if (isMutation) {
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const contentLength = Number(req.headers.get('content-length') || 0)
        if (contentLength > MAX_JSON_BODY) {
          return NextResponse.json({ success: false, message: 'Request body too large.' }, { status: 413 })
        }

        try {
          body = await req.json()
          const serialized = JSON.stringify(body)
          if (serialized.length > MAX_JSON_BODY) {
            return NextResponse.json({ success: false, message: 'Request body too large.' }, { status: 413 })
          }
        } catch {
          body = null
        }
      }
    }

    let status = 200
    let payload = null

    const mockReq = {
      params,
      body,
      method: req.method,
      ip: getClientIp(req),
      sessionEmail: context.session?.email,
    }
    const mockRes = {
      status(code) {
        status = code
        return mockRes
      },
      json(data) {
        payload = data
        return mockRes
      },
      _headers: {},
      setHeader(name, value) {
        mockRes._headers[name] = value
        if (name.toLowerCase() === 'content-type') {
          mockRes._contentType = value
        }
        return mockRes
      },
      send(data) {
        payload = data
        return mockRes
      },
    }

    try {
      await handler(mockReq, mockRes)
      if (typeof payload === 'string' && mockRes._contentType) {
        return new NextResponse(payload, {
          status,
          headers: mockRes._headers,
        })
      }
      return NextResponse.json(payload, { status })
    } catch (err) {
      const code = status !== 200 ? status : 500
      return NextResponse.json(
        {
          success: false,
          message: err.message || 'Internal Server Error',
          ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
        },
        { status: code }
      )
    }
  }
}
