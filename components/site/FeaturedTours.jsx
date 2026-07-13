'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { tourCategoryPath } from '@/lib/utils/tourPaths'
import { culturalTours, trekkingTours } from '@/lib/content/tours'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=700&q=80'

const staticFallback = [
  { title: 'Cultural Tours', text: culturalTours.introText?.slice(0, 160) + '…', img: culturalTours.heroImage, path: '/cultural-tours' },
  { title: 'Trekking Tours', text: trekkingTours.introText?.slice(0, 160) + '…', img: trekkingTours.heroImage, path: '/trekking-tours' },
]

function FeaturedTours() {
  const [packages, setPackages] = useState(staticFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .getTours()
      .then((res) => {
        if (!active) return
        const tours = Array.isArray(res?.data) ? res.data : []
        if (!tours.length) return
        setPackages(
          tours.slice(0, 3).map((t) => ({
            title: t.name.replace(' of Bhutan', ''),
            text: t.summary || t.overview || '',
            img: t.image || DEFAULT_IMG,
            path: tourCategoryPath(t.slug),
          }))
        )
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section-pad bg-light" id="featured-tours">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>Bhutan Travel Packages</h2>
          <p>Culture, Nature, People, Festivals, Treks and lots of Happiness</p>
        </div>
        {loading ? (
          <PageLoading label="Loading featured tours…" minHeight="200px" />
        ) : (
          <Row className="g-3 g-md-4 justify-content-center packages-row">
            {packages.map((p, i) => (
              <Col xs={12} sm={6} lg={4} className="d-flex" key={p.title}>
                <article
                  className="package-card package-card--center w-100 reveal reveal--fade-up"
                  style={{ '--reveal-delay': `${i * 100}ms` }}
                >
                  <div
                    className="package-card__image"
                    style={{ backgroundImage: `url(${resolveImageUrl(p.img)})` }}
                  />
                  <div className="package-card__body">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <Button as={Link} href={p.path} className="btn-cta">
                      Read More
                    </Button>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  )
}

export default FeaturedTours
