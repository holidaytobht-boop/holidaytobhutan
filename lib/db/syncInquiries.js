import Inquiry from '@/lib/models/Inquiry.js'
import { loadJson } from '@/lib/stores/persist.js'

const FILE = 'inquiries.json'

export async function syncInquiriesFromFile() {
  const items = loadJson(FILE, [])
  if (!items.length) return { imported: 0, skipped: 0 }

  let imported = 0
  let skipped = 0

  for (const item of items) {
    const createdAt = item.createdAt ? new Date(item.createdAt) : new Date()
    const exists = await Inquiry.findOne({
      email: item.email,
      source: item.source || 'contact',
      createdAt,
    }).lean()

    if (exists) {
      skipped++
      continue
    }

    await Inquiry.create({
      name: item.name,
      email: item.email,
      phone: item.phone ?? null,
      interest: item.interest ?? null,
      message: item.message,
      source: item.source || 'contact',
      booking: item.booking ?? null,
      status: item.status || 'new',
      createdAt,
    })
    imported++
  }

  if (imported > 0) {
    console.log(`📥  Synced ${imported} inquiry/booking record(s) from local file to MongoDB`)
  }

  return { imported, skipped }
}
