import Tour from '@/lib/models/Tour.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as toursStore from '@/lib/stores/toursStore.js'
import { sanitizeImagePath } from '@/lib/security/urls.js'
import { slugify } from '@/lib/utils/slug.js'

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const str = (v) => (typeof v === 'string' ? v.trim() : '')
const img = (v) => sanitizeImagePath(str(v))

const serializePackage = (p) => ({
  slug: p.slug,
  name: p.name,
  summary: p.summary || '',
  image: p.image || '',
  durationDays: p.durationDays,
  fromPriceUsd: p.fromPriceUsd,
  tagline: p.tagline || '',
  heroImage: p.heroImage || '',
  duration: p.duration || '',
  groupSize: p.groupSize || '',
  bestSeason: p.bestSeason || '',
  overview: p.overview || '',
  pricingNote: p.pricingNote || '',
  pricing: (p.pricing || []).map((t) => ({
    group: t.group || '',
    price: t.price || '',
    unit: t.unit || 'per person',
  })),
  highlights: (p.highlights || []).map((h) => ({
    title: typeof h === 'string' ? h : h.title || '',
    summary: typeof h === 'string' ? '' : h.summary || '',
    description: typeof h === 'string' ? '' : h.description || '',
    image: typeof h === 'string' ? '' : h.image || h.img || '',
  })).filter((h) => h.title),
  itinerary: (p.itinerary || []).map((d) => ({
    day: d.day || '',
    title: d.title || '',
    desc: d.desc || '',
  })),
})

const serialize = (tour) => ({
  slug: tour.slug,
  name: tour.name,
  summary: tour.summary || '',
  image: tour.image || '',
  overview: tour.overview || '',
  highlights: (tour.highlights || []).map((h) => ({
    title: h.title || '',
    summary: h.summary || '',
    description: h.description || '',
    image: h.image || '',
  })),
  packages: (tour.packages || []).map(serializePackage),
})

const normalizePricing = (pricing) =>
  (Array.isArray(pricing) ? pricing : [])
    .filter((t) => t && (isNonEmptyString(t.group) || isNonEmptyString(t.price)))
    .map((t) => ({
      group: str(t.group),
      price: str(t.price),
      unit: isNonEmptyString(t.unit) ? t.unit.trim() : 'per person',
    }))

const normalizeItinerary = (itinerary) =>
  (Array.isArray(itinerary) ? itinerary : [])
    .filter((d) => d && (isNonEmptyString(d.title) || isNonEmptyString(d.desc) || isNonEmptyString(d.day)))
    .map((d) => ({ day: str(d.day), title: str(d.title), desc: str(d.desc) }))

const normalizeStringList = (list) =>
  (Array.isArray(list) ? list : [])
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)

const normalizePackageHighlights = (highlights) =>
  (Array.isArray(highlights) ? highlights : [])
    .map((h) => {
      if (typeof h === 'string') {
        const title = h.trim()
        return title ? { title, image: '' } : null
      }
      if (h && isNonEmptyString(h.title)) {
        return {
          title: h.title.trim(),
          summary: str(h.summary),
          description: str(h.description),
          image: img(h.image) || img(h.img),
        }
      }
      return null
    })
    .filter(Boolean)

const normalizePackages = (packages) =>
  (Array.isArray(packages) ? packages : [])
    .filter((p) => p && isNonEmptyString(p.name))
    .map((p) => ({
      slug: isNonEmptyString(p.slug) ? p.slug.trim() : slugify(p.name),
      name: p.name.trim(),
      summary: str(p.summary),
      image: img(p.image),
      durationDays: Number(p.durationDays) || 0,
      fromPriceUsd: Number(p.fromPriceUsd) || 0,
      tagline: str(p.tagline),
      heroImage: img(p.heroImage),
      duration: str(p.duration),
      groupSize: str(p.groupSize),
      bestSeason: str(p.bestSeason),
      overview: str(p.overview),
      pricingNote: str(p.pricingNote),
      pricing: normalizePricing(p.pricing),
      highlights: normalizePackageHighlights(p.highlights),
      itinerary: normalizeItinerary(p.itinerary),
    }))

const normalizeHighlights = (highlights) =>
  (Array.isArray(highlights) ? highlights : [])
    .filter((h) => h && isNonEmptyString(h.title))
    .map((h) => ({
      title: h.title.trim(),
      summary: str(h.summary),
      description: str(h.description),
      image: img(h.image),
    }))

export const listTours = async (req, res) => {
  if (isDbConnected()) {
    const docs = await Tour.find().sort({ createdAt: 1 }).lean()
    const data = docs.map(serialize)
    return res.json({ success: true, count: data.length, data })
  }
  const data = toursStore.getAll().map(serialize)
  return res.json({ success: true, count: data.length, data })
}

export const getTour = async (req, res) => {
  const { slug } = req.params
  if (isDbConnected()) {
    const doc = await Tour.findOne({ slug }).lean()
    if (!doc) {
      res.status(404)
      throw new Error(`Tour not found: ${slug}`)
    }
    return res.json({ success: true, data: serialize(doc) })
  }
  const tour = toursStore.getBySlug(slug)
  if (!tour) {
    res.status(404)
    throw new Error(`Tour not found: ${slug}`)
  }
  return res.json({ success: true, data: serialize(tour) })
}

export const getPackage = async (req, res) => {
  const { slug } = req.params
  const findIn = (tours) => {
    for (const t of tours) {
      const pkg = (t.packages || []).find((p) => p.slug === slug)
      if (pkg) return { tourName: t.name, tourSlug: t.slug, pkg }
    }
    return null
  }

  let result
  if (isDbConnected()) {
    const docs = await Tour.find().lean()
    result = findIn(docs)
  } else {
    result = findIn(toursStore.getAll())
  }

  if (!result) {
    res.status(404)
    throw new Error(`Package not found: ${slug}`)
  }

  return res.json({
    success: true,
    data: {
      ...serializePackage(result.pkg),
      tour: result.tourName,
      tourSlug: result.tourSlug,
      tourPath: `/${result.tourSlug}`,
    },
  })
}

export const createTour = async (req, res) => {
  const { name, summary, image, overview, highlights, packages } = req.body || {}
  if (!isNonEmptyString(name)) {
    res.status(400)
    return res.json({ success: false, message: 'Tour name is required.' })
  }

  const payload = {
    name: name.trim(),
    summary: isNonEmptyString(summary) ? summary.trim() : '',
    image: img(image),
    overview: isNonEmptyString(overview) ? overview.trim() : '',
    highlights: normalizeHighlights(highlights),
    packages: normalizePackages(packages),
  }

  if (isDbConnected()) {
    let slug = slugify(name)
    if (await Tour.exists({ slug })) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }
    const doc = await Tour.create({ ...payload, slug })
    return res.status(201).json({ success: true, data: serialize(doc.toObject()) })
  }

  const created = toursStore.create(payload)
  return res.status(201).json({ success: true, data: serialize(created) })
}

export const updateTour = async (req, res) => {
  const { slug } = req.params
  const { name, summary, image, overview, highlights, packages } = req.body || {}

  const changes = {}
  if (isNonEmptyString(name)) changes.name = name.trim()
  if (typeof summary === 'string') changes.summary = summary.trim()
  if (typeof image === 'string') changes.image = img(image)
  if (typeof overview === 'string') changes.overview = overview.trim()
  if (highlights !== undefined) changes.highlights = normalizeHighlights(highlights)
  if (packages !== undefined) changes.packages = normalizePackages(packages)

  if (isDbConnected()) {
    const doc = await Tour.findOneAndUpdate({ slug }, changes, { new: true })
    if (!doc) {
      res.status(404)
      throw new Error(`Tour not found: ${slug}`)
    }
    return res.json({ success: true, data: serialize(doc.toObject()) })
  }

  const updated = toursStore.update(slug, changes)
  if (!updated) {
    res.status(404)
    throw new Error(`Tour not found: ${slug}`)
  }
  return res.json({ success: true, data: serialize(updated) })
}

export const deleteTour = async (req, res) => {
  const { slug } = req.params

  if (isDbConnected()) {
    const doc = await Tour.findOneAndDelete({ slug })
    if (!doc) {
      res.status(404)
      throw new Error(`Tour not found: ${slug}`)
    }
    return res.json({ success: true, message: 'Tour deleted.' })
  }

  const ok = toursStore.remove(slug)
  if (!ok) {
    res.status(404)
    throw new Error(`Tour not found: ${slug}`)
  }
  return res.json({ success: true, message: 'Tour deleted.' })
}
