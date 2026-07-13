// In-memory tours store used when MongoDB is not connected, so the API still works.
import { tours as seed } from '@/lib/seeds/tours.js'
import { slugify } from '@/lib/utils/slug.js'

let tours = seed.map((t) => ({
  slug: t.slug,
  name: t.name,
  summary: t.summary,
  image: t.image || '',
  overview: t.overview || '',
  highlights: (t.highlights || []).map((h) => ({ ...h })),
  packages: (t.packages || []).map((p) => ({ ...p })),
}))

const uniqueSlug = (base) => {
  const root = base || 'tour'
  let slug = root
  let i = 2
  while (tours.some((t) => t.slug === slug)) {
    slug = `${root}-${i}`
    i += 1
  }
  return slug
}

export const getAll = () => tours

export const getBySlug = (slug) => tours.find((t) => t.slug === slug)

export const create = ({ name, summary = '', image = '', overview = '', highlights = [], packages = [] }) => {
  const tour = { slug: uniqueSlug(slugify(name)), name, summary, image, overview, highlights, packages }
  tours.push(tour)
  return tour
}

export const update = (slug, changes) => {
  const tour = getBySlug(slug)
  if (!tour) return null
  Object.assign(tour, changes)
  return tour
}

export const remove = (slug) => {
  const idx = tours.findIndex((t) => t.slug === slug)
  if (idx === -1) return false
  tours.splice(idx, 1)
  return true
}
