'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NotFoundContent from '@/components/site/NotFoundContent'
import PageLoading from '@/components/site/PageLoading'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { destinationDetails } from '@/lib/content/destinations'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80'

function mergeDestination(staticDest, apiDest) {
  if (!apiDest) return staticDest || null

  const places = (apiDest.places || []).length
    ? apiDest.places.map((p) => ({
        name: p.name,
        desc: p.desc || '',
        img: p.image || staticDest?.heroImage || DEFAULT_IMG,
      }))
    : staticDest?.places || []

  return {
    name: apiDest.name || staticDest?.name,
    tagline: apiDest.tagline || staticDest?.tagline || '',
    heroImage: apiDest.heroImage || staticDest?.heroImage || DEFAULT_IMG,
    altitude: apiDest.altitude || staticDest?.altitude || '',
    bestTime: apiDest.bestTime || staticDest?.bestTime || '',
    overview: apiDest.overview || staticDest?.overview || '',
    places,
  }
}

function DestinationDetail() {
  const { slug } = useParams()
  const staticDest = destinationDetails[slug]
  const [dest, setDest] = useState(staticDest ? mergeDestination(staticDest, null) : null)
  const [loading, setLoading] = useState(!staticDest)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    setDest(staticDest ? mergeDestination(staticDest, null) : null)
    setLoading(!staticDest)
    setNotFound(false)

    api
      .getDestination(slug)
      .then((res) => {
        if (active && res?.data) setDest(mergeDestination(staticDest, res.data))
      })
      .catch(() => {
        if (active && !staticDest) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, staticDest])

  if (loading) {
    return <PageLoading label="Loading destination…" />
  }

  if (notFound || !dest) {
    return (
      <NotFoundContent
        title="Destination not found"
        message="This destination may have been removed or the link is incorrect."
        backHref="/destinations"
        backLabel="Browse all destinations"
      />
    )
  }

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: `url(${resolveImageUrl(dest.heroImage)})` }}>
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">Destination</p>
          <h1>{dest.name}</h1>
          <p className="page-hero__sub">{dest.tagline}</p>
          <Button className="btn-cta mt-3 px-4 py-2" href="#places">
            Popular Places
          </Button>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <div className="section-title reveal reveal--fade-up">
                <h2>About {dest.name}</h2>
              </div>
              <p className="text-muted">{dest.overview}</p>
              <Row className="g-3 justify-content-center mt-2">
                {dest.altitude && (
                  <Col xs={6} md="auto">
                    <div className="fact-pill">
                      <span className="fact-pill__label">Altitude</span>
                      <span className="fact-pill__value">{dest.altitude}</span>
                    </div>
                  </Col>
                )}
                {dest.bestTime && (
                  <Col xs={6} md="auto">
                    <div className="fact-pill">
                      <span className="fact-pill__label">Best Time</span>
                      <span className="fact-pill__value">{dest.bestTime}</span>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light" id="places">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>Popular Places in {dest.name}</h2>
            <p>The must-see sights and experiences in the valley</p>
          </div>
          {dest.places?.length ? (
            <Row className="g-4 justify-content-center">
              {dest.places.map((place) => (
                <Col md={6} lg={4} key={place.name}>
                  <article className="place-card h-100">
                    <div className="place-card__img" style={{ backgroundImage: `url(${resolveImageUrl(place.img)})` }} />
                    <div className="place-card__body">
                      <h3>{place.name}</h3>
                      <p className="text-muted m-0">{place.desc}</p>
                    </div>
                  </article>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center text-muted">Popular places coming soon.</p>
          )}
        </Container>
      </section>
    </>
  )
}

export default DestinationDetail
