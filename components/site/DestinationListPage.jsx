'use client'

import { useEffect, useState } from 'react'
import TourPage from './TourPage'
import { api } from '@/lib/api/client'
import { destinations as fallbackPage } from '@/lib/content/destinations'
import { mergePageHero } from '@/lib/utils/cmsMerge'

const slugify = (s = '') =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function mergeDestinationsPage(fallback, apiList, pageHero) {
  const base = { ...fallback }

  if (pageHero) {
    const hero = mergePageHero(pageHero, {
      eyebrow: fallback.eyebrow,
      title: fallback.title,
      subtitle: fallback.subtitle,
      image: fallback.heroImage,
      ctaText: fallback.ctaLabel,
      ctaLink: '',
    })
    base.eyebrow = hero.eyebrow
    base.title = hero.title
    base.subtitle = hero.subtitle
    base.heroImage = hero.image
    base.ctaLabel = hero.ctaText
  }

  if (!apiList?.length) return base

  const staticBySlug = {}
  ;(fallback.packages || []).forEach((p) => {
    const slug = p.path ? p.path.replace('/destinations/', '') : slugify(p.title)
    staticBySlug[slug] = p
  })

  const packages = apiList.map((d) => {
    const st = staticBySlug[d.slug] || {}
    return {
      title: d.name,
      summary: d.summary || st.summary || '',
      img: d.image || st.img || base.heroImage,
      path: `/destinations/${d.slug}`,
    }
  })

  return { ...base, packages }
}

function DestinationListPage() {
  const [data, setData] = useState(fallbackPage)

  useEffect(() => {
    let active = true
    Promise.all([api.getDestinations(), api.getHeroBanners()])
      .then(([destRes, bannersRes]) => {
        if (active) {
          setData(mergeDestinationsPage(fallbackPage, destRes?.data, bannersRes?.data?.destinationsPage))
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return <TourPage {...data} ctaLabel="" />
}

export default DestinationListPage
