'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { trekkingTours } from '@/lib/content/tours'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=700&q=80'

const staticFallback = (trekkingTours.packages || []).slice(0, 3).map((p) => ({
  title: p.title,
  summary: p.summary,
  img: p.img,
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
}))

function formatTrekSummary(pkg) {
  if (pkg.duration?.trim()) return pkg.duration
  const parts = []
  if (pkg.durationDays) parts.push(`${pkg.durationDays} Days`)
  if (pkg.summary?.trim()) return pkg.summary
  return parts.join(' · ') || 'Trekking package'
}

function PopularTreks() {
  const [treks, setTreks] = useState(staticFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .getTour('trekking-tours')
      .then((res) => {
        if (!active) return
        const tour = res?.data
        const pkgs = tour?.packages
        if (!pkgs?.length) return
        setTreks(
          pkgs.slice(0, 3).map((p) => ({
            title: p.name,
            summary: formatTrekSummary(p),
            img: p.image || p.heroImage || tour.image || DEFAULT_IMG,
            slug: p.slug,
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
    <section className="section-pad" id="trekking-tours">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>Popular Treks</h2>
          <p>From gentle valley walks to legendary high-altitude crossings</p>
        </div>
        {loading ? (
          <PageLoading label="Loading treks…" minHeight="200px" />
        ) : (
          <Row className="g-3 g-md-4 justify-content-center packages-row">
            {treks.map((trek, i) => (
              <Col xs={12} sm={6} lg={4} className="d-flex" key={trek.slug || trek.title}>
                <article
                  className="package-card package-card--center w-100 reveal reveal--fade-up"
                  style={{ '--reveal-delay': `${i * 100}ms` }}
                >
                  <div
                    className="package-card__image"
                    style={{ backgroundImage: `url(${resolveImageUrl(trek.img)})` }}
                  />
                  <div className="package-card__body">
                    <h3>{trek.title}</h3>
                    <p className="package-card__days">{trek.summary}</p>
                    <Button as={Link} href={`/tours/${trek.slug}`} className="btn-cta">
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

export default PopularTreks
