import { route } from '@/lib/route'
import { getTravelGuide, updateTravelGuide } from '@/lib/services/travelGuide.js'

export const GET = route(getTravelGuide)
export const PUT = route(updateTravelGuide, { requireAdmin: true })
