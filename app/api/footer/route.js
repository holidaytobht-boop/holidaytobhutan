import { route } from '@/lib/route'
import { getFooter, updateFooter } from '@/lib/services/footer.js'

export const GET = route(getFooter)
export const PUT = route(updateFooter, { requireAdmin: true })
