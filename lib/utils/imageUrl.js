import { sanitizeImagePath } from '@/lib/security/urls.js'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export function resolveImageUrl(src) {
  if (!src) return ''
  const safe = sanitizeImagePath(src)
  if (!safe) return ''
  if (safe.startsWith('/')) return `${API_URL}${safe}`
  return safe
}

export { API_URL }
