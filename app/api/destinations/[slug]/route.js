import { route } from '@/lib/route'
import { getDestination, updateDestination, deleteDestination } from '@/lib/services/destinations.js'

export const GET = route(getDestination)
export const PUT = route(updateDestination, { requireAdmin: true })
export const DELETE = route(deleteDestination, { requireAdmin: true })
