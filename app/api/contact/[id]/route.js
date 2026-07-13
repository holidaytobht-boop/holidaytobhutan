import { route } from '@/lib/route'
import { updateInquiryById, deleteInquiryById } from '@/lib/services/contact.js'

export const PUT = route(updateInquiryById, { requireAdmin: true, checkOrigin: true })
export const DELETE = route(deleteInquiryById, { requireAdmin: true, checkOrigin: true })
