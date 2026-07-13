import { route } from '@/lib/route'
import { syncHomePageReviews } from '@/lib/services/homePage.js'

export const POST = route(syncHomePageReviews, {
  requireAdmin: true,
  rateLimit: { namespace: 'sync-reviews', limit: 10, windowMs: 60 * 60 * 1000 },
})
