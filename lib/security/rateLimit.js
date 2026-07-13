import { getPersistentBucket, setPersistentBucket } from '@/lib/security/persistentStore.js'

const globalForRateLimit = globalThis

if (!globalForRateLimit._rateLimitBuckets) {
  globalForRateLimit._rateLimitBuckets = new Map()
}

const buckets = globalForRateLimit._rateLimitBuckets

function loadEntry(key) {
  if (buckets.has(key)) return buckets.get(key)
  const persisted = getPersistentBucket('rate', key)
  if (persisted) {
    buckets.set(key, persisted)
    return persisted
  }
  return null
}

function saveEntry(key, entry) {
  buckets.set(key, entry)
  setPersistentBucket('rate', key, entry)
}

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  let entry = loadEntry(key)

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs }
    saveEntry(key, entry)
  }

  entry.count += 1
  saveEntry(key, entry)

  if (entry.count > limit) {
    return {
      allowed: false,
      retryAfterMs: Math.max(0, entry.resetAt - now),
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.count),
  }
}
