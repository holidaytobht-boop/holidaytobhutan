import Destination from '@/lib/models/Destination.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as destinationsStore from '@/lib/stores/destinationsStore.js'
import { sanitizeImagePath } from '@/lib/security/urls.js'
import { slugify } from '@/lib/utils/slug.js'

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const str = (v) => (typeof v === 'string' ? v.trim() : '')
const img = (v) => sanitizeImagePath(str(v))

const serializePlace = (p) => ({
  slug: p.slug,
  name: p.name,
  desc: p.desc || '',
  image: p.image || '',
})

const serialize = (dest) => ({
  slug: dest.slug,
  name: dest.name,
  summary: dest.summary || '',
  image: dest.image || '',
  tagline: dest.tagline || '',
  heroImage: dest.heroImage || '',
  altitude: dest.altitude || '',
  bestTime: dest.bestTime || '',
  overview: dest.overview || '',
  places: (dest.places || []).map(serializePlace),
})

const normalizePlaces = (places) =>
  (Array.isArray(places) ? places : [])
    .filter((p) => p && isNonEmptyString(p.name))
    .map((p) => ({
      slug: isNonEmptyString(p.slug) ? p.slug.trim() : slugify(p.name),
      name: p.name.trim(),
      desc: str(p.desc),
      image: img(p.image),
    }))

export const listDestinations = async (req, res) => {
  if (isDbConnected()) {
    const docs = await Destination.find().sort({ createdAt: 1 }).lean()
    const data = docs.map(serialize)
    return res.json({ success: true, count: data.length, data })
  }
  const data = destinationsStore.getAll().map(serialize)
  return res.json({ success: true, count: data.length, data })
}

export const getDestination = async (req, res) => {
  const { slug } = req.params
  if (isDbConnected()) {
    const doc = await Destination.findOne({ slug }).lean()
    if (!doc) {
      res.status(404)
      throw new Error(`Destination not found: ${slug}`)
    }
    return res.json({ success: true, data: serialize(doc) })
  }
  const dest = destinationsStore.getBySlug(slug)
  if (!dest) {
    res.status(404)
    throw new Error(`Destination not found: ${slug}`)
  }
  return res.json({ success: true, data: serialize(dest) })
}

export const createDestination = async (req, res) => {
  const { name, summary, image, tagline, heroImage, altitude, bestTime, overview, places } = req.body || {}
  if (!isNonEmptyString(name)) {
    res.status(400)
    return res.json({ success: false, message: 'Destination name is required.' })
  }

  const payload = {
    name: name.trim(),
    summary: str(summary),
    image: img(image),
    tagline: str(tagline),
    heroImage: img(heroImage),
    altitude: str(altitude),
    bestTime: str(bestTime),
    overview: str(overview),
    places: normalizePlaces(places),
  }

  if (isDbConnected()) {
    let slug = slugify(name)
    if (await Destination.exists({ slug })) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }
    const doc = await Destination.create({ ...payload, slug })
    return res.status(201).json({ success: true, data: serialize(doc.toObject()) })
  }

  const created = destinationsStore.create(payload)
  return res.status(201).json({ success: true, data: serialize(created) })
}

export const updateDestination = async (req, res) => {
  const { slug } = req.params
  const { name, summary, image, tagline, heroImage, altitude, bestTime, overview, places } = req.body || {}

  const changes = {}
  if (isNonEmptyString(name)) changes.name = name.trim()
  if (typeof summary === 'string') changes.summary = summary.trim()
  if (typeof image === 'string') changes.image = img(image)
  if (typeof tagline === 'string') changes.tagline = tagline.trim()
  if (typeof heroImage === 'string') changes.heroImage = img(heroImage)
  if (typeof altitude === 'string') changes.altitude = altitude.trim()
  if (typeof bestTime === 'string') changes.bestTime = bestTime.trim()
  if (typeof overview === 'string') changes.overview = overview.trim()
  if (places !== undefined) changes.places = normalizePlaces(places)

  if (isDbConnected()) {
    const doc = await Destination.findOneAndUpdate({ slug }, changes, { new: true })
    if (!doc) {
      res.status(404)
      throw new Error(`Destination not found: ${slug}`)
    }
    return res.json({ success: true, data: serialize(doc.toObject()) })
  }

  const updated = destinationsStore.update(slug, changes)
  if (!updated) {
    res.status(404)
    throw new Error(`Destination not found: ${slug}`)
  }
  return res.json({ success: true, data: serialize(updated) })
}

export const deleteDestination = async (req, res) => {
  const { slug } = req.params

  if (isDbConnected()) {
    const doc = await Destination.findOneAndDelete({ slug })
    if (!doc) {
      res.status(404)
      throw new Error(`Destination not found: ${slug}`)
    }
    return res.json({ success: true, message: 'Destination deleted.' })
  }

  const ok = destinationsStore.remove(slug)
  if (!ok) {
    res.status(404)
    throw new Error(`Destination not found: ${slug}`)
  }
  return res.json({ success: true, message: 'Destination deleted.' })
}
