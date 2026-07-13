import { route } from '@/lib/route'
import { listDestinations, createDestination } from '@/lib/services/destinations.js'

export const GET = route(listDestinations)
export const POST = route(createDestination, { requireAdmin: true })
