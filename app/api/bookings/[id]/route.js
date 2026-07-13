import { route } from '@/lib/route'
import { updateBooking, deleteBooking } from '@/lib/services/bookings.js'

export const PUT = route(updateBooking, { requireAdmin: true, checkOrigin: true })
export const DELETE = route(deleteBooking, { requireAdmin: true, checkOrigin: true })
