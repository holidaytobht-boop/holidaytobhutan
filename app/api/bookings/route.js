import { route } from '@/lib/route'
import { listBookings } from '@/lib/services/bookings.js'

export const GET = route(listBookings, { requireAdmin: true })
