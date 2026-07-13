/**
 * Security regression tests.
 * Logic mirrors lib/security/urls.js and lib/security/originMatch.js — keep in sync.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'])

function sanitizeUrl(url, { allowRelative = true, allowHash = true } = {}) {
  const trimmed = typeof url === 'string' ? url.trim() : ''
  if (!trimmed) return ''
  if (allowHash && trimmed.startsWith('#')) return trimmed
  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  try {
    const parsed = new URL(trimmed)
    if (!ALLOWED_SCHEMES.has(parsed.protocol)) return ''
    return trimmed
  } catch {
    return ''
  }
}

function sanitizeImagePath(path) {
  const trimmed = typeof path === 'string' ? path.trim() : ''
  if (!trimmed) return ''
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  if (trimmed.startsWith('https://images.unsplash.com/')) return trimmed
  return ''
}

function refererMatchesOrigin(referer, allowedOrigins) {
  let refererOrigin
  try {
    refererOrigin = new URL(referer).origin
  } catch {
    return false
  }

  return allowedOrigins.some((entry) => {
    try {
      return new URL(entry).origin === refererOrigin
    } catch {
      return false
    }
  })
}

function matchesClientOrigin({ origin, referer, allowedOrigins, nodeEnv }) {
  if (origin) {
    return allowedOrigins.some((entry) => origin === entry)
  }
  if (referer) {
    return refererMatchesOrigin(referer, allowedOrigins)
  }
  return nodeEnv !== 'production'
}

test('sanitizeUrl allows safe relative and absolute links', () => {
  assert.equal(sanitizeUrl('/tours'), '/tours')
  assert.equal(sanitizeUrl('https://example.com/path'), 'https://example.com/path')
  assert.equal(sanitizeUrl('mailto:hello@example.com'), 'mailto:hello@example.com')
})

test('sanitizeUrl blocks dangerous schemes', () => {
  assert.equal(sanitizeUrl('javascript:alert(1)'), '')
  assert.equal(sanitizeUrl('data:text/html,hello'), '')
  assert.equal(sanitizeUrl('//evil.example.com'), '')
})

test('sanitizeImagePath allows local and approved remote images', () => {
  assert.equal(sanitizeImagePath('/images/home/hero.jpg'), '/images/home/hero.jpg')
  assert.equal(
    sanitizeImagePath('https://images.unsplash.com/photo-123'),
    'https://images.unsplash.com/photo-123'
  )
  assert.equal(sanitizeImagePath('https://evil.example.com/x.jpg'), '')
  assert.equal(sanitizeImagePath('data:image/png;base64,abc'), '')
})

test('matchesClientOrigin accepts configured client origins', () => {
  assert.equal(
    matchesClientOrigin({
      origin: 'http://localhost:3000',
      referer: null,
      allowedOrigins: ['http://localhost:3000'],
      nodeEnv: 'development',
    }),
    true
  )
})

test('matchesClientOrigin rejects unknown origins in production', () => {
  assert.equal(
    matchesClientOrigin({
      origin: 'https://evil.example.com',
      referer: null,
      allowedOrigins: ['http://localhost:3000'],
      nodeEnv: 'production',
    }),
    false
  )
})

test('matchesClientOrigin rejects referer domain prefix bypass', () => {
  assert.equal(
    matchesClientOrigin({
      origin: null,
      referer: 'https://yourdomain.com.evil.com/admin',
      allowedOrigins: ['https://yourdomain.com'],
      nodeEnv: 'production',
    }),
    false
  )
  assert.equal(
    matchesClientOrigin({
      origin: null,
      referer: 'https://yourdomain.com/admin',
      allowedOrigins: ['https://yourdomain.com'],
      nodeEnv: 'production',
    }),
    true
  )
})
