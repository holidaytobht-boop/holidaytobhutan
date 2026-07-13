import { destinations as seed } from '@/lib/seeds/destinations.js'
import { slugify } from '@/lib/utils/slug.js'

let destinations = seed.map((d) => ({
  slug: d.slug,
  name: d.name,
  summary: d.summary,
  image: d.image || '',
  tagline: d.tagline || '',
  heroImage: d.heroImage || '',
  altitude: d.altitude || '',
  bestTime: d.bestTime || '',
  overview: d.overview || '',
  places: (d.places || []).map((p) => ({ ...p })),
}))

const uniqueSlug = (base) => {
  const root = base || 'destination'
  let slug = root
  let i = 2
  while (destinations.some((d) => d.slug === slug)) {
    slug = `${root}-${i}`
    i += 1
  }
  return slug
}

export const getAll = () => destinations

export const getBySlug = (slug) => destinations.find((d) => d.slug === slug)

export const create = (payload) => {
  const dest = { slug: uniqueSlug(slugify(payload.name)), ...payload }
  destinations.push(dest)
  return dest
}

export const update = (slug, changes) => {
  const dest = getBySlug(slug)
  if (!dest) return null
  Object.assign(dest, changes)
  return dest
}

export const remove = (slug) => {
  const idx = destinations.findIndex((d) => d.slug === slug)
  if (idx === -1) return false
  destinations.splice(idx, 1)
  return true
}
