import HeroBanners from '@/lib/models/HeroBanners.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as heroBannersStore from '@/lib/stores/heroBannersStore.js'
import { getFileModifiedTime } from '@/lib/stores/persist.js'
import { sanitizeUrl, sanitizeImagePath } from '@/lib/security/urls.js'

const STORE_FILE = 'heroBanners.json'

const str = (v) => (typeof v === 'string' ? v.trim() : '')

const normalizeSlides = (slides) =>
  (Array.isArray(slides) ? slides : [])
    .filter((s) => s && (str(s.headline) || str(s.image)))
    .map((s) => ({
      headline: str(s.headline),
      subheading: str(s.subheading),
      image: sanitizeImagePath(str(s.image)),
    }))

const normalizePageHero = (hero = {}) => ({
  eyebrow: str(hero.eyebrow),
  title: str(hero.title),
  subtitle: str(hero.subtitle),
  image: sanitizeImagePath(str(hero.image)),
  ctaText: str(hero.ctaText),
  ctaLink: sanitizeUrl(str(hero.ctaLink)),
})

const normalizeHeroBanners = (body = {}) => ({
  home: {
    eyebrow: str(body.home?.eyebrow),
    slides: normalizeSlides(body.home?.slides),
  },
  toursPage: normalizePageHero(body.toursPage),
  destinationsPage: normalizePageHero(body.destinationsPage),
  aboutPage: normalizePageHero(body.aboutPage),
  contactPage: normalizePageHero(body.contactPage),
  travelGuidePage: normalizePageHero(body.travelGuidePage),
})

export const getHeroBanners = async (req, res) => {
  const fileData = normalizeHeroBanners(heroBannersStore.get())
  const fileUpdatedAt = getFileModifiedTime(STORE_FILE)

  if (isDbConnected()) {
    const doc = await HeroBanners.findOne().lean()
    if (doc) {
      const dbData = normalizeHeroBanners(doc)
      const dbUpdatedAt = doc.updatedAt ? new Date(doc.updatedAt).getTime() : 0
      const data = fileUpdatedAt > dbUpdatedAt ? fileData : dbData
      return res.json({ success: true, data })
    }
  }

  return res.json({ success: true, data: fileData })
}

export const updateHeroBanners = async (req, res) => {
  const payload = normalizeHeroBanners(req.body || {})

  if (isDbConnected()) {
    const doc = await HeroBanners.findOneAndUpdate({}, payload, { new: true, upsert: true })
    heroBannersStore.update(normalizeHeroBanners(doc.toObject()))
    return res.json({ success: true, data: normalizeHeroBanners(doc.toObject()) })
  }

  heroBannersStore.update(payload)
  return res.json({ success: true, data: normalizeHeroBanners(heroBannersStore.get()) })
}
