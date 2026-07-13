import { tourPackages } from '@/lib/content/tourPackages'

function cleanTourName(name = '') {
  return name.replace(/\s+of Bhutan$/i, '').trim()
}

export function getStaticTourTitles() {
  const names = Object.values(tourPackages)
    .map((pkg) => pkg.tour)
    .filter(Boolean)

  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
}

export function buildTourTitles(apiTours = []) {
  if (!Array.isArray(apiTours) || apiTours.length === 0) {
    return getStaticTourTitles()
  }

  const names = apiTours.map((tour) => cleanTourName(tour.name)).filter(Boolean)
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b))

  return unique.length ? unique : getStaticTourTitles()
}
