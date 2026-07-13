'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80'

const staticFallback = [
  {
    place: 'PARO',
    spot: "Tiger's Nest",
    img: DEFAULT_IMG,
    description: "The Tiger's Nest monastery clings to a cliff 900m above the Paro valley — Bhutan's most iconic sight.",
    slug: 'paro',
  },
  { place: 'THIMPHU', spot: 'Tashichho Dzong', img: DEFAULT_IMG, slug: 'thimphu' },
  { place: 'BUMTHANG', spot: 'Jakar Dzong', img: DEFAULT_IMG, slug: 'bumthang' },
  { place: 'PHOBJIKHA', spot: 'Gangtey Valley', img: DEFAULT_IMG, slug: 'phobjikha' },
  { place: 'PUNAKHA', spot: 'Punakha Dzong', img: DEFAULT_IMG, slug: 'punakha' },
]

function TopDestinations() {
  const [destinations, setDestinations] = useState(staticFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .getDestinations()
      .then((res) => {
        if (!active) return
        const list = Array.isArray(res?.data) ? res.data : []
        if (!list.length) return
        setDestinations(
          list.slice(0, 5).map((d, i) => ({
            place: d.name.toUpperCase(),
            spot: d.summary || d.tagline || '',
            img: d.image || d.heroImage || DEFAULT_IMG,
            description: d.overview || d.summary || '',
            slug: d.slug,
            featured: i === 0,
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

  const featured = destinations[0]
  const rest = destinations.slice(1)

  return (
    <section className="section-pad" id="destinations">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>Top Destinations</h2>
          <p>Experience Bhutan&apos;s most unforgettable places</p>
        </div>
        {loading ? (
          <PageLoading label="Loading destinations…" minHeight="200px" />
        ) : (
          <Row className="g-4">
            <Col lg={6}>
              <Link href={`/destinations/${featured.slug}`} className="text-decoration-none text-white">
                <div className="media-card media-card--featured h-100 reveal reveal--fade-right">
                  <div
                    className="media-card__image"
                    style={{ backgroundImage: `url(${resolveImageUrl(featured.img)})` }}
                  />
                  <div className="media-card__body">
                    <h3 className="fw-bold">{featured.place}</h3>
                    <div className="mb-2">{featured.spot}</div>
                    {featured.description ? (
                      <p className="small mb-0 opacity-75">{featured.description}</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Col>
            <Col lg={6}>
              <Row className="g-4">
                {rest.map((d, i) => (
                  <Col sm={6} key={d.slug}>
                    <Link href={`/destinations/${d.slug}`} className="text-decoration-none text-white">
                      <div
                        className="media-card media-card--compact reveal reveal--fade-left"
                        style={{ '--reveal-delay': `${i * 80}ms` }}
                      >
                        <div
                          className="media-card__image"
                          style={{ backgroundImage: `url(${resolveImageUrl(d.img)})` }}
                        />
                        <div className="media-card__body">
                          <h5 className="fw-bold">{d.place}</h5>
                          <div className="small opacity-75">{d.spot}</div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  )
}

export default TopDestinations
