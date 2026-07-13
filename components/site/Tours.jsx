'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { mergePageHero } from '@/lib/utils/cmsMerge'
import { tourCategoryPath } from '@/lib/utils/tourPaths'
import {
  trekkingTours,
  culturalTours,
  pilgrimageTours,
  birdingTours,
  flyFishingTours,
  natureTours,
  meditationTours,
  yogaTours,
  foodTours,
  bikingTours,
  motorcycleTours,
} from '@/lib/content/tours'

const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const DEFAULT_IMG = img('photo-1570366583862-f91883984fde')

const toursHeroFallback = {
  eyebrow: 'Our Tours',
  title: 'Explore Every Way to Experience Bhutan',
  subtitle:
    'From high Himalayan treks to sacred pilgrimages, fiery food trails and epic motorcycle rides — find the journey that’s calling you.',
  image: '/images/tours/dochula.jpg',
  ctaText: 'Browse All Tours',
  ctaLink: '#all-tours',
}

// Static catalogue keyed by slug
const staticList = [
  { ...trekkingTours, path: '/trekking-tours', slug: 'trekking-tours' },
  { ...culturalTours, path: '/cultural-tours', slug: 'cultural-tours' },
  { ...pilgrimageTours, path: '/pilgrimage-tours', slug: 'pilgrimage-tours' },
  { ...birdingTours, path: '/birding-tours', slug: 'birding-tours' },
  { ...flyFishingTours, path: '/fly-fishing-tours', slug: 'fly-fishing-tours' },
  { ...natureTours, path: '/nature-tours', slug: 'nature-tours' },
  { ...meditationTours, path: '/meditation-tours', slug: 'meditation-tours' },
  { ...yogaTours, path: '/yoga-tours', slug: 'yoga-tours' },
  { ...foodTours, path: '/food-tours', slug: 'food-tours' },
  { ...bikingTours, path: '/biking-tours', slug: 'biking-tours' },
  { ...motorcycleTours, path: '/motorcycle-tours', slug: 'motorcycle-tours' },
]

const staticBySlug = staticList.reduce((acc, t) => {
  acc[t.slug] = t
  return acc
}, {})

const cleanTitle = (title = '') => title.replace(' of Bhutan', '')

// Build the card model from a live API tour, enriching with static data.
const fromApi = (tour) => {
  const fallback = staticBySlug[tour.slug]
  return {
    slug: tour.slug,
    title: cleanTitle(tour.name),
    subtitle: tour.summary || fallback?.subtitle || '',
    image: tour.image || fallback?.heroImage || DEFAULT_IMG,
    // Known categories keep their rich curated page; new tours get a dynamic page.
    path: tourCategoryPath(tour.slug),
  }
}

const fromStatic = (t) => ({
  slug: t.slug,
  title: cleanTitle(t.title),
  subtitle: t.subtitle,
  image: t.heroImage,
  path: t.path,
})

function Tours() {
  const [items, setItems] = useState([])
  const [hero, setHero] = useState(toursHeroFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([api.getTours(), api.getHeroBanners()])
      .then(([toursRes, bannersRes]) => {
        if (!active) return
        const data = Array.isArray(toursRes?.data) ? toursRes.data : []
        setItems(data.length ? data.map(fromApi) : staticList.map(fromStatic))
        const h = bannersRes?.data?.toursPage
        if (h) setHero(mergePageHero(h, toursHeroFallback))
      })
      .catch(() => {
        if (active) setItems(staticList.map(fromStatic))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${resolveImageUrl(hero.image)})` }}
      >
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="page-hero__sub">{hero.subtitle}</p>
        </Container>
      </section>

      <section className="section-pad" id="all-tours">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>All Tours</h2>
            <p>Curated ways to discover the Thunder Dragon Kingdom</p>
          </div>

          {loading ? (
            <PageLoading label="Loading tours…" minHeight="240px" />
          ) : (
            <Row className="g-4 justify-content-center">
              {items.map((tour, i) => (
                <Col md={6} lg={4} key={tour.slug}>
                  <article
                    className="place-card h-100 reveal reveal--fade-up"
                    style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}
                  >
                    <Link
                      href={tour.path}
                      className="place-card__img d-block"
                      style={{ backgroundImage: `url(${resolveImageUrl(tour.image)})` }}
                      aria-label={tour.title}
                    />
                    <div className="place-card__body d-flex flex-column">
                      <h3>{tour.title}</h3>
                      <p className="text-muted flex-grow-1">{tour.subtitle}</p>
                      <Button as={Link} href={tour.path} className="btn-cta mt-2">
                        View Tours
                      </Button>
                    </div>
                  </article>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  )
}

export default Tours
