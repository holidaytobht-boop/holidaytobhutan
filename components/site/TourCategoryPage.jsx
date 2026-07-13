'use client'

import { useEffect, useState } from 'react'
import TourPage from './TourPage'
import { api } from '@/lib/api/client'

const slugify = (s = '') =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Merge live (admin-editable) tour data over the curated static defaults so the
// page keeps its designed look while reflecting any edits made in the admin panel.
function mergeTour(fallback, apiTour) {
  if (!apiTour) return fallback

  const staticByPkgSlug = {}
  ;(fallback.packages || []).forEach((p) => {
    staticByPkgSlug[slugify(p.title)] = p
  })

  const packages = (apiTour.packages || []).length
    ? apiTour.packages.map((p) => {
        const st = staticByPkgSlug[p.slug] || {}
        return {
          title: p.name,
          summary: p.summary || st.summary || (p.durationDays ? `${p.durationDays} days` : ''),
          img: p.image || st.img || apiTour.image || fallback.heroImage,
          path: st.path || (p.slug ? `/tours/${p.slug}` : undefined),
        }
      })
    : fallback.packages

  const highlights = (apiTour.highlights || []).length
    ? apiTour.highlights.map((h, i) => {
        const st = fallback.highlights?.[i] || {}
        return {
          title: h.title,
          summary: h.summary || st.summary,
          description: h.description || st.description,
          img: h.image || st.img || fallback.heroImage,
        }
      })
    : fallback.highlights

  return {
    ...fallback,
    title: apiTour.name || fallback.title,
    subtitle: apiTour.summary || fallback.subtitle,
    heroImage: apiTour.image || fallback.heroImage,
    introText: apiTour.overview || fallback.introText,
    packages,
    highlights,
  }
}

function TourCategoryPage({ slug, fallback }) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    let active = true
    setData(fallback)
    api
      .getTour(slug)
      .then((res) => {
        if (active && res?.data) setData(mergeTour(fallback, res.data))
      })
      .catch(() => {
        // API unreachable — keep the static fallback content.
      })
    return () => {
      active = false
    }
  }, [slug, fallback])

  return <TourPage {...data} packageBase="/tours" />
}

export default TourCategoryPage
