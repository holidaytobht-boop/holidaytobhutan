import { route } from '@/lib/route'
import { exportInquiriesCsv } from '@/lib/services/contact.js'

export const GET = route(exportInquiriesCsv, { requireAdmin: true })
