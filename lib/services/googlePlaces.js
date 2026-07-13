import { config } from '@/lib/db/env.js'
import { sanitizeUrl } from '@/lib/security/urls.js'
import { fetchGoogleReviewsCached, clearGoogleReviewsCache } from '@/lib/stores/googleReviewsCache.js'

const PLACES_API_URL = 'https://places.googleapis.com/v1/places'

const str = (v) => (typeof v === 'string' ? v.trim() : '')

const normalizeReviewItem = (review) => {
  const name = str(review.authorAttribution?.displayName) || 'Google user'
  const text = str(review.text?.text) || str(review.originalText?.text)
  const avatar = sanitizeUrl(str(review.authorAttribution?.photoUri))

  return {
    text: text.slice(0, 2000),
    name: name.slice(0, 120),
    avatar,
    initial: name.charAt(0).toUpperCase(),
    avatarColor: '',
    timeAgo: str(review.relativePublishTimeDescription).slice(0, 40),
    verified: true,
    rating: Math.min(5, Math.max(1, Math.round(Number(review.rating) || 5))),
  }
}

const normalizePlaceReviews = (place) => {
  const items = (Array.isArray(place.reviews) ? place.reviews : [])
    .map(normalizeReviewItem)
    .filter((item) => item.text && item.name)

  const googleReviewUrl =
    sanitizeUrl(str(place.writeAReviewUri)) ||
    sanitizeUrl(str(place.googleMapsUri)) ||
    ''

  return {
    googleReviewUrl,
    aggregateRating: Math.min(5, Math.max(0, Number(place.rating) || 0)),
    totalReviews: Math.max(0, Number(place.userRatingCount) || 0),
    items,
    source: 'google',
    fetchedAt: new Date().toISOString(),
  }
}

export const isGoogleReviewsConfigured = () =>
  Boolean(config.googlePlaces.apiKey && config.googlePlaces.placeId)

export const fetchGooglePlaceReviews = async () => {
  const { apiKey, placeId } = config.googlePlaces
  if (!apiKey || !placeId) return null

  const url = `${PLACES_API_URL}/${encodeURIComponent(placeId)}`
  const fieldMask = [
    'id',
    'displayName',
    'rating',
    'userRatingCount',
    'googleMapsUri',
    'writeAReviewUri',
    'reviews',
  ].join(',')

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Google Places API error (${res.status}): ${detail.slice(0, 300)}`)
  }

  const place = await res.json()
  const normalized = normalizePlaceReviews(place)

  if (!normalized.items.length) {
    throw new Error('Google Places returned no reviews for this business.')
  }

  return normalized
}

export const getLiveGoogleReviews = async ({ force = false } = {}) => {
  if (!isGoogleReviewsConfigured()) return null

  return fetchGoogleReviewsCached({
    fetcher: fetchGooglePlaceReviews,
    ttlMs: config.googlePlaces.cacheTtlMs,
    force,
  })
}

export const refreshGoogleReviews = async () => {
  clearGoogleReviewsCache()
  return getLiveGoogleReviews({ force: true })
}
