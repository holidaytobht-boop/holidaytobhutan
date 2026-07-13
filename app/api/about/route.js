import { route } from '@/lib/route'
import { getAboutPage, updateAboutPage } from '@/lib/services/about.js'

export const GET = route(getAboutPage)
export const PUT = route(updateAboutPage, { requireAdmin: true })
