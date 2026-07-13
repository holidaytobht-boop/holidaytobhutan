import AboutPage from '@/lib/models/AboutPage.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as aboutPageStore from '@/lib/stores/aboutPageStore.js'
import { sanitizeUrl, sanitizeImagePath } from '@/lib/security/urls.js'

const str = (v) => (typeof v === 'string' ? v.trim() : '')

const normalizeStrings = (list) =>
  (Array.isArray(list) ? list : [])
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)

const normalizeTextBlocks = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((i) => i && (str(i.title) || str(i.text)))
    .map((i) => ({ title: str(i.title), text: str(i.text) }))

const normalizeMembers = (members) =>
  (Array.isArray(members) ? members : [])
    .filter((m) => m && str(m.name))
    .map((m) => ({
      name: str(m.name),
      role: str(m.role),
      avatar: sanitizeImagePath(str(m.avatar)),
    }))

const normalizeAbout = (body = {}) => ({
  hero: {
    eyebrow: str(body.hero?.eyebrow),
    title: str(body.hero?.title),
    subtitle: str(body.hero?.subtitle),
    image: sanitizeImagePath(str(body.hero?.image)),
  },
  story: {
    title: str(body.story?.title),
    image: sanitizeImagePath(str(body.story?.image)),
    paragraphs: normalizeStrings(body.story?.paragraphs),
  },
  missionVision: {
    mission: {
      title: str(body.missionVision?.mission?.title),
      text: str(body.missionVision?.mission?.text),
    },
    vision: {
      title: str(body.missionVision?.vision?.title),
      text: str(body.missionVision?.vision?.text),
    },
  },
  offers: {
    title: str(body.offers?.title),
    subtitle: str(body.offers?.subtitle),
    items: normalizeTextBlocks(body.offers?.items),
  },
  whyChooseUs: {
    title: str(body.whyChooseUs?.title),
    subtitle: str(body.whyChooseUs?.subtitle),
    items: normalizeStrings(body.whyChooseUs?.items),
  },
  team: {
    title: str(body.team?.title),
    subtitle: str(body.team?.subtitle),
    members: normalizeMembers(body.team?.members),
  },
  values: {
    title: str(body.values?.title),
    subtitle: str(body.values?.subtitle),
    items: normalizeTextBlocks(body.values?.items),
  },
  cta: {
    eyebrow: str(body.cta?.eyebrow),
    title: str(body.cta?.title),
    subtitle: str(body.cta?.subtitle),
    whatsappUrl: sanitizeUrl(str(body.cta?.whatsappUrl)),
  },
})

export const getAboutPage = async (req, res) => {
  if (isDbConnected()) {
    const doc = await AboutPage.findOne().lean()
    if (!doc) {
      return res.json({ success: true, data: normalizeAbout(aboutPageStore.get()) })
    }
    return res.json({ success: true, data: normalizeAbout(doc) })
  }
  return res.json({ success: true, data: normalizeAbout(aboutPageStore.get()) })
}

export const updateAboutPage = async (req, res) => {
  const payload = normalizeAbout(req.body || {})

  if (isDbConnected()) {
    const doc = await AboutPage.findOneAndUpdate({}, payload, { new: true, upsert: true })
    return res.json({ success: true, data: normalizeAbout(doc.toObject()) })
  }

  aboutPageStore.update(payload)
  return res.json({ success: true, data: normalizeAbout(aboutPageStore.get()) })
}
