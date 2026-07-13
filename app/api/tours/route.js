import { route } from '@/lib/route'
import { listTours, createTour } from '@/lib/services/tours.js'

export const GET = route(listTours)
export const POST = route(createTour, { requireAdmin: true })
