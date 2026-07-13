'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import NotFoundContent from '@/components/site/NotFoundContent'
import PageLoading from '@/components/site/PageLoading'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { tourPackages } from '@/lib/content/tourPackages'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=80'

const FALLBACK_HIGHLIGHT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
]

const toHighlightItems = (highlights, heroImage) =>
  (highlights || [])
    .map((h, i) => {
      if (typeof h === 'string') {
        const title = h.trim()
        if (!title) return null
        return {
          title,
          summary: '',
          description: '',
          image: FALLBACK_HIGHLIGHT_IMAGES[i % FALLBACK_HIGHLIGHT_IMAGES.length] || heroImage || DEFAULT_IMG,
        }
      }
      const title = (h.title || '').trim()
      if (!title) return null
      return {
        title,
        summary: h.summary || '',
        description: h.description || '',
        image:
          h.image ||
          h.img ||
          FALLBACK_HIGHLIGHT_IMAGES[i % FALLBACK_HIGHLIGHT_IMAGES.length] ||
          heroImage ||
          DEFAULT_IMG,
      }
    })
    .filter(Boolean)

const nonEmpty = (arr) => Array.isArray(arr) && arr.length > 0

const formatDayNumber = (dayLabel, index) => {
  const num = parseInt(String(dayLabel || '').replace(/\D/g, ''), 10)
  const n = Number.isFinite(num) ? num : index + 1
  return String(n).padStart(2, '0')
}

// Merge live (admin-editable) package detail over the curated static content.
function mergePkg(staticPkg, apiPkg) {
  const base = staticPkg || {}
  if (!apiPkg) return staticPkg || null
  return {
    name: apiPkg.name || base.name,
    tour: apiPkg.tour || base.tour || '',
    tourPath: apiPkg.tourPath || base.tourPath || '/tours',
    tagline: apiPkg.tagline || base.tagline || '',
    heroImage: apiPkg.heroImage || base.heroImage || DEFAULT_IMG,
    duration: apiPkg.duration || base.duration || '',
    groupSize: apiPkg.groupSize || base.groupSize || '',
    bestSeason: apiPkg.bestSeason || base.bestSeason || '',
    overview: apiPkg.overview || base.overview || '',
    highlights: nonEmpty(apiPkg.highlights) ? apiPkg.highlights : base.highlights || [],
    itinerary: nonEmpty(apiPkg.itinerary) ? apiPkg.itinerary : base.itinerary || [],
  }
}

function TourDetail() {
  const { slug } = useParams()
  const staticPkg = tourPackages[slug]
  const [pkg, setPkg] = useState(staticPkg || null)
  const [loading, setLoading] = useState(!staticPkg)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    setPkg(staticPkg || null)
    setLoading(!staticPkg)
    setNotFound(false)
    api
      .getPackage(slug)
      .then((res) => {
        if (active && res?.data) setPkg(mergePkg(staticPkg, res.data))
      })
      .catch(() => {
        if (active && !staticPkg) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug, staticPkg])

  if (loading) {
    return <PageLoading label="Loading tour package…" />
  }

  if (notFound || !pkg) {
    return (
      <NotFoundContent
        title="Tour package not found"
        message="This tour package may have been removed or the link is incorrect."
        backHref="/tours"
        backLabel="Browse all tours"
      />
    )
  }

  const highlightItems = toHighlightItems(pkg.highlights, pkg.heroImage)

  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${resolveImageUrl(pkg.heroImage)})` }}
      >
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">{pkg.tour}</p>
          <h1>{pkg.name}</h1>
          <p className="page-hero__sub">{pkg.tagline}</p>
          <Button className="btn-cta mt-3 px-4 py-2" href="#itinerary">
            View Itinerary
          </Button>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <div className="section-title reveal reveal--fade-up">
                <h2>Tour Details</h2>
              </div>
              <p className="text-muted">{pkg.overview}</p>
              <Row className="g-3 justify-content-center mt-2">
                <Col xs={6} md="auto">
                  <div className="fact-pill">
                    <span className="fact-pill__label">Duration</span>
                    <span className="fact-pill__value">{pkg.duration}</span>
                  </div>
                </Col>
                <Col xs={6} md="auto">
                  <div className="fact-pill">
                    <span className="fact-pill__label">Group Size</span>
                    <span className="fact-pill__value">{pkg.groupSize}</span>
                  </div>
                </Col>
                <Col xs={6} md="auto">
                  <div className="fact-pill">
                    <span className="fact-pill__label">Best Season</span>
                    <span className="fact-pill__value">{pkg.bestSeason}</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {highlightItems.length > 0 ? (
        <section className="section-pad">
          <Container>
            <div className="section-title reveal reveal--fade-up">
              <h2>Highlights</h2>
              <p>What makes this journey special</p>
            </div>
            <Row className="g-4">
              <Col lg={6}>
                <div className="media-card media-card--featured h-100 reveal reveal--fade-right">
                  <div
                    className="media-card__image"
                    style={{ backgroundImage: `url(${resolveImageUrl(highlightItems[0].image)})` }}
                  />
                  <div className="media-card__body">
                    <h3 className="fw-bold">{highlightItems[0].title}</h3>
                    {highlightItems[0].summary ? (
                      <div className="mb-2">{highlightItems[0].summary}</div>
                    ) : null}
                    {highlightItems[0].description ? (
                      <p className="small mb-0 opacity-75">{highlightItems[0].description}</p>
                    ) : null}
                  </div>
                </div>
              </Col>
              {highlightItems.length > 1 ? (
                <Col lg={6}>
                  <Row className="g-4">
                    {highlightItems.slice(1).map((h, i) => (
                      <Col sm={6} key={h.title}>
                        <div
                          className="media-card media-card--compact reveal reveal--fade-left"
                          style={{ '--reveal-delay': `${i * 80}ms` }}
                        >
                          <div
                            className="media-card__image"
                            style={{ backgroundImage: `url(${resolveImageUrl(h.image)})` }}
                          />
                          <div className="media-card__body">
                            <h5 className="fw-bold">{h.title}</h5>
                            {h.summary ? <div className="small opacity-75">{h.summary}</div> : null}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              ) : null}
            </Row>
          </Container>
        </section>
      ) : null}

      <section className="section-pad bg-light" id="itinerary">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>Itinerary</h2>
            <p>Day-by-day plan for your journey</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={11}>
              <div className="itinerary-path">
                {pkg.itinerary.map((item, i) => (
                  <article
                    className={`itinerary-path__item ${i % 2 === 0 ? 'itinerary-path__item--left' : 'itinerary-path__item--right'} reveal reveal--fade-up`}
                    key={`${item.day}-${i}`}
                  >
                    <div className="itinerary-path__panel">
                      {item.day ? <span className="itinerary-path__label">{item.day}</span> : null}
                      <h3 className="itinerary-path__title">{item.title}</h3>
                      {item.desc ? <p className="itinerary-path__desc">{item.desc}</p> : null}
                    </div>
                    <div className="itinerary-path__node" aria-hidden="true">
                      <span>{formatDayNumber(item.day, i)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Button
              className="btn-cta px-4 py-2"
              as={Link}
              href={`/plan-my-trip?tour=${encodeURIComponent(pkg.name)}`}
            >
              Book This Tour
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default TourDetail
