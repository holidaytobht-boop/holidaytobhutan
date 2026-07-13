const DEFAULT_TTL_MS = 60 * 60 * 1000

const getCache = () => {
  if (!globalThis._googleReviewsCache) {
    globalThis._googleReviewsCache = {
      data: null,
      fetchedAt: 0,
      promise: null,
      lastError: null,
    }
  }
  return globalThis._googleReviewsCache
}

export const clearGoogleReviewsCache = () => {
  const cache = getCache()
  cache.data = null
  cache.fetchedAt = 0
  cache.promise = null
  cache.lastError = null
}

export const getCachedGoogleReviews = () => {
  const cache = getCache()
  return {
    data: cache.data,
    fetchedAt: cache.fetchedAt,
    lastError: cache.lastError,
  }
}

export const fetchGoogleReviewsCached = async ({ fetcher, ttlMs = DEFAULT_TTL_MS, force = false } = {}) => {
  if (!fetcher) return null

  const cache = getCache()
  const now = Date.now()

  if (!force && cache.data && now - cache.fetchedAt < ttlMs) {
    return cache.data
  }

  if (cache.promise) return cache.promise

  cache.promise = fetcher()
    .then((data) => {
      if (data?.items?.length) {
        cache.data = data
        cache.fetchedAt = Date.now()
        cache.lastError = null
      }
      cache.promise = null
      return data
    })
    .catch((err) => {
      cache.promise = null
      cache.lastError = err.message || 'Google Places fetch failed'
      console.error('[google-reviews]', cache.lastError)
      return cache.data
    })

  return cache.promise
}
