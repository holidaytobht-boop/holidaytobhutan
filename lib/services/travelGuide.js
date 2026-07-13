import TravelGuide from '@/lib/models/TravelGuide.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as travelGuideStore from '@/lib/stores/travelGuideStore.js'
import { sanitizeImagePath } from '@/lib/security/urls.js'

const str = (v) => (typeof v === 'string' ? v.trim() : '')
const img = (v) => sanitizeImagePath(str(v))

const normalizeGuide = (body = {}) => ({
  hero: {
    title: str(body.hero?.title),
    subtitle: str(body.hero?.subtitle),
    image: img(body.hero?.image),
  },
  about: {
    title: str(body.about?.title),
    subtitle: str(body.about?.subtitle),
    paragraphs: (body.about?.paragraphs || [])
      .map((p) => (typeof p === 'string' ? p.trim() : ''))
      .filter(Boolean),
    facts: (body.about?.facts || [])
      .filter((f) => f && (str(f.label) || str(f.value)))
      .map((f) => ({ label: str(f.label), value: str(f.value) })),
  },
  visaSdf: {
    title: str(body.visaSdf?.title),
    subtitle: str(body.visaSdf?.subtitle),
    cards: (body.visaSdf?.cards || [])
      .filter((c) => c && (str(c.title) || str(c.body)))
      .map((c) => ({ title: str(c.title), body: str(c.body) })),
  },
  seasons: {
    title: str(body.seasons?.title),
    subtitle: str(body.seasons?.subtitle),
    items: (body.seasons?.items || [])
      .filter((s) => s && str(s.name))
      .map((s) => ({
        name: str(s.name),
        months: str(s.months),
        desc: str(s.desc),
        image: img(s.image),
      })),
  },
  trekking: {
    title: str(body.trekking?.title),
    subtitle: str(body.trekking?.subtitle),
    tips: (body.trekking?.tips || [])
      .map((t) => (typeof t === 'string' ? t.trim() : ''))
      .filter(Boolean),
  },
  packing: {
    title: str(body.packing?.title),
    subtitle: str(body.packing?.subtitle),
    items: (body.packing?.items || [])
      .map((t) => (typeof t === 'string' ? t.trim() : ''))
      .filter(Boolean),
  },
  faqs: {
    title: str(body.faqs?.title),
    subtitle: str(body.faqs?.subtitle),
    items: (body.faqs?.items || [])
      .filter((f) => f && (str(f.q) || str(f.a)))
      .map((f) => ({ q: str(f.q), a: str(f.a) })),
  },
})

const serialize = (doc) => normalizeGuide(doc)

export const getTravelGuide = async (req, res) => {
  if (isDbConnected()) {
    const doc = await TravelGuide.findOne().lean()
    if (!doc) {
      return res.json({ success: true, data: serialize(travelGuideStore.get()) })
    }
    return res.json({ success: true, data: serialize(doc) })
  }
  return res.json({ success: true, data: serialize(travelGuideStore.get()) })
}

export const updateTravelGuide = async (req, res) => {
  const payload = normalizeGuide(req.body || {})

  if (isDbConnected()) {
    const doc = await TravelGuide.findOneAndUpdate({}, payload, { new: true, upsert: true })
    return res.json({ success: true, data: serialize(doc.toObject()) })
  }

  travelGuideStore.update(payload)
  return res.json({ success: true, data: serialize(travelGuideStore.get()) })
}
