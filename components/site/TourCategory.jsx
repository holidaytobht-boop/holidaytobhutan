'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import { tourCategoryPath } from '@/lib/utils/tourPaths'
import NotFoundContent from '@/components/site/NotFoundContent'
import PageLoading from '@/components/site/PageLoading'
import TourPage from '@/components/site/TourPage'

const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
const DEFAULT_IMG = img('photo-1570366583862-f91883984fde')

function mergeTour(apiTour) {
  if (!apiTour) return null
  return {
    eyebrow: 'Tour Category',
    title: apiTour.name,
    subtitle: apiTour.summary || '',
    heroImage: apiTour.image || DEFAULT_IMG,
    introTitle: apiTour.name,
    introSubtitle: '',
    introText: apiTour.overview || apiTour.summary || '',
    packages: (apiTour.packages || []).map((p) => ({
      ...p,
      title: p.name || p.title,
      img: p.heroImage || p.image || apiTour.image || DEFAULT_IMG,
      slug: p.slug,
    })),
  }
}

function TourCategory() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const preferred = tourCategoryPath(slug)
    if (preferred !== `/tours/c/${slug}`) {
      router.replace(preferred)
    }
  }, [slug, router])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api
      .getTour(slug)
      .then((res) => {
        if (active) setData(mergeTour(res?.data))
      })
      .catch((err) => {
        if (active) setError(err.message || 'Tour not found')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return <PageLoading label="Loading tour category…" />
  }

  if (error || !data) {
    return (
      <NotFoundContent
        title="Tour not found"
        message="This tour may have been removed or the link is incorrect."
        backHref="/tours"
        backLabel="Back to all tours"
      />
    )
  }

  return <TourPage {...data} packageBase="/tours" />
}

export default TourCategory
