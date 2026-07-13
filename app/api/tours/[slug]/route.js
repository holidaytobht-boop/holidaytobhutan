import { route } from '@/lib/route'
import { getTour, updateTour, deleteTour } from '@/lib/services/tours.js'

export const GET = route(getTour)
export const PUT = route(updateTour, { requireAdmin: true })
export const DELETE = route(deleteTour, { requireAdmin: true })
