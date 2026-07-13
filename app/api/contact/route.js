import { route } from '@/lib/route'
import { createInquiry, listInquiries } from '@/lib/services/contact.js'

export const GET = route(listInquiries, { requireAdmin: true })
export const POST = route(createInquiry, {
  rateLimit: { namespace: 'contact', limit: 8, windowMs: 15 * 60 * 1000 },
  checkOrigin: true,
})
