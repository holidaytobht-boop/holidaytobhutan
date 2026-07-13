import { connectDB, isDbConnected } from '@/lib/db/connect.js'
import {
  seedTours,
  seedDestinations,
  seedTravelGuide,
  seedAboutPage,
  seedContactPage,
  seedHeroBanners,
  seedHomePage,
  seedFooter,
} from '@/lib/db/seed.js'
import { syncInquiriesFromFile } from '@/lib/db/syncInquiries.js'
import { ensureAdminCredentials } from '@/lib/services/adminCredentials.js'

import { validateRequiredEnv } from '@/lib/security/validateEnv.js'

const globalForDb = globalThis

if (!globalForDb._dbInitPromise) {
  globalForDb._dbInitPromise = null
}

async function initDb() {
  validateRequiredEnv()
  await connectDB()
  if (!isDbConnected()) return false

  await Promise.allSettled([
    seedTours(),
    seedDestinations(),
    seedTravelGuide(),
    seedAboutPage(),
    seedContactPage(),
    seedHeroBanners(),
    seedHomePage(),
    seedFooter(),
    syncInquiriesFromFile(),
  ])

  return true
}

export async function ensureDb() {
  if (!globalForDb._dbInitPromise) {
    globalForDb._dbInitPromise = initDb().finally(() => {
      if (!isDbConnected()) {
        globalForDb._dbInitPromise = null
      }
    })
  }

  await globalForDb._dbInitPromise
  await ensureAdminCredentials()
  return isDbConnected()
}
