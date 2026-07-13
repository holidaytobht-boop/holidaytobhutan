import { route } from '@/lib/route'
import { getHomePage, updateHomePage } from '@/lib/services/homePage.js'

export const GET = route(getHomePage)
export const PUT = route(updateHomePage, { requireAdmin: true })
