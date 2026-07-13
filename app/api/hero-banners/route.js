import { route } from '@/lib/route'
import { getHeroBanners, updateHeroBanners } from '@/lib/services/heroBanners.js'

export const GET = route(getHeroBanners)
export const PUT = route(updateHeroBanners, { requireAdmin: true })
