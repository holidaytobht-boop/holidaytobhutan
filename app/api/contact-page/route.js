import { route } from '@/lib/route'
import { getContactPage, updateContactPage } from '@/lib/services/contactPage.js'

export const GET = route(getContactPage)
export const PUT = route(updateContactPage, { requireAdmin: true })
