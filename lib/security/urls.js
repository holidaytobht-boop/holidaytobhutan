const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'])

/**
 * Sanitize user-supplied URLs for href/src attributes.
 * Allows relative paths (/…, #…) and a small set of safe schemes.
 */
export function sanitizeUrl(url, { allowRelative = true, allowHash = true } = {}) {
  const trimmed = typeof url === 'string' ? url.trim() : ''
  if (!trimmed) return ''

  if (allowHash && trimmed.startsWith('#')) return trimmed

  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed)
    if (!ALLOWED_SCHEMES.has(parsed.protocol)) return ''
    return trimmed
  } catch {
    return ''
  }
}

export function sanitizeImagePath(path) {
  const trimmed = typeof path === 'string' ? path.trim() : ''
  if (!trimmed) return ''
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  if (trimmed.startsWith('https://images.unsplash.com/')) return trimmed
  return ''
}
