import HomePage from '@/lib/models/HomePage.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as homePageStore from '@/lib/stores/homePageStore.js'
import { sanitizeUrl, sanitizeImagePath } from '@/lib/security/urls.js'
import {
  getLiveGoogleReviews,
  isGoogleReviewsConfigured,
  refreshGoogleReviews,
} from '@/lib/services/googlePlaces.js'
import { getCachedGoogleReviews } from '@/lib/stores/googleReviewsCache.js'

const str = (v) => (typeof v === 'string' ? v.trim() : '')

const normalizePhotos = (photos) =>
  (Array.isArray(photos) ? photos : [])
    .filter((p) => p && str(p.image))
    .map((p) => ({
      name: str(p.name),
      trip: str(p.trip),
      image: sanitizeImagePath(str(p.image)),
    }))

const normalizeReviewItems = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && str(item.text) && str(item.name))
    .map((item) => ({
      text: str(item.text).slice(0, 2000),
      name: str(item.name).slice(0, 120),
      avatar: sanitizeUrl(str(item.avatar)) || sanitizeImagePath(str(item.avatar)),
      initial: str(item.initial).slice(0, 2),
      avatarColor: str(item.avatarColor).slice(0, 20),
      timeAgo: str(item.timeAgo).slice(0, 40),
      verified: item.verified !== false,
      rating: Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5))),
    }))

const normalizeHomePage = (body = {}) => ({
  photoGallery: {
    title: str(body.photoGallery?.title),
    subtitle: str(body.photoGallery?.subtitle),
    photos: normalizePhotos(body.photoGallery?.photos),
  },
  reviews: {
    googleReviewUrl: sanitizeUrl(str(body.reviews?.googleReviewUrl)),
    aggregateRating: Math.min(5, Math.max(0, Number(body.reviews?.aggregateRating) || 0)),
    totalReviews: Math.max(0, Number(body.reviews?.totalReviews) || 0),
    items: normalizeReviewItems(body.reviews?.items),
  },
})

const loadStoredHomePage = async () => {
  if (isDbConnected()) {
    const doc = await HomePage.findOne().lean()
    if (!doc) {
      return normalizeHomePage(homePageStore.get())
    }
    return normalizeHomePage(doc)
  }
  return normalizeHomePage(homePageStore.get())
}

const mergeLiveReviews = async (page) => {
  if (!isGoogleReviewsConfigured()) {
    return {
      ...page,
      reviews: {
        ...page.reviews,
        source: 'cms',
      },
    }
  }

  const liveReviews = await getLiveGoogleReviews()
  if (liveReviews?.items?.length) {
    return {
      ...page,
      reviews: {
        googleReviewUrl: liveReviews.googleReviewUrl || page.reviews.googleReviewUrl,
        aggregateRating: liveReviews.aggregateRating || page.reviews.aggregateRating,
        totalReviews: liveReviews.totalReviews || page.reviews.totalReviews,
        items: liveReviews.items,
        source: 'google',
        fetchedAt: liveReviews.fetchedAt,
      },
    }
  }

  const cache = getCachedGoogleReviews()
  return {
    ...page,
    reviews: {
      ...page.reviews,
      source: 'cms',
      liveError: cache.lastError || undefined,
    },
  }
}

export const getHomePage = async (req, res) => {
  const page = await loadStoredHomePage()
  const data = await mergeLiveReviews(page)
  return res.json({ success: true, data })
}

export const updateHomePage = async (req, res) => {
  const payload = normalizeHomePage(req.body || {})

  if (isDbConnected()) {
    const doc = await HomePage.findOneAndUpdate({}, payload, { new: true, upsert: true })
    return res.json({ success: true, data: normalizeHomePage(doc.toObject()) })
  }

  homePageStore.update(payload)
  return res.json({ success: true, data: normalizeHomePage(homePageStore.get()) })
}

export const syncHomePageReviews = async (req, res) => {
  if (!isGoogleReviewsConfigured()) {
    return res.status(400).json({
      success: false,
      message: 'Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in your environment to sync live reviews.',
    })
  }

  const liveReviews = await refreshGoogleReviews()
  if (!liveReviews?.items?.length) {
    const cache = getCachedGoogleReviews()
    return res.status(502).json({
      success: false,
      message: cache.lastError || 'Could not fetch reviews from Google Places.',
    })
  }

  const page = await loadStoredHomePage()
  const payload = normalizeHomePage({
    ...page,
    reviews: {
      googleReviewUrl: liveReviews.googleReviewUrl || page.reviews.googleReviewUrl,
      aggregateRating: liveReviews.aggregateRating,
      totalReviews: liveReviews.totalReviews,
      items: liveReviews.items,
    },
  })

  if (isDbConnected()) {
    await HomePage.findOneAndUpdate({}, payload, { new: true, upsert: true })
  } else {
    homePageStore.update(payload)
  }

  return res.json({
    success: true,
    data: {
      reviews: {
        ...payload.reviews,
        source: 'google',
        fetchedAt: liveReviews.fetchedAt,
      },
    },
    message: `Synced ${liveReviews.items.length} live reviews from Google.`,
  })
}
