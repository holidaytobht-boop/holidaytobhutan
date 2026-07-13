import { route } from '@/lib/route'
import { exportBookingsCsv } from '@/lib/services/bookings.js'

export const GET = route(exportBookingsCsv, { requireAdmin: true })
