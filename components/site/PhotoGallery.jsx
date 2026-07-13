'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const emptyGallery = {
  title: 'Photo Gallery',
  subtitle: 'Real moments from our guests across Bhutan',
  photos: [],
}

const mergeGallery = (apiData) => {
  if (!apiData?.photoGallery) return emptyGallery
  const g = apiData.photoGallery
  const photos = (g.photos || [])
    .map((p) => ({
      name: p.name?.trim() || 'Guest',
      trip: p.trip?.trim() || '',
      image: p.image?.trim() || '',
    }))
    .filter((p) => p.image)

  return {
    title: g.title?.trim() || emptyGallery.title,
    subtitle: g.subtitle?.trim() || emptyGallery.subtitle,
    photos,
  }
}

const STEP = 4

function PhotoGallery() {
  const [gallery, setGallery] = useState(emptyGallery)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(8)

  useEffect(() => {
    let active = true
    api
      .getHomePage()
      .then((res) => {
        if (active && res?.data) setGallery(mergeGallery(res.data))
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <section className="section-pad" id="gallery">
        <PageLoading label="Loading gallery…" minHeight="240px" />
      </section>
    )
  }

  const { photos } = gallery
  if (!photos.length) return null

  return (
    <section className="section-pad" id="gallery">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>{gallery.title}</h2>
          <p>{gallery.subtitle}</p>
        </div>
        <Row className="g-4 justify-content-center">
          {photos.slice(0, visible).map((g, i) => (
            <Col sm={6} lg={3} key={`${g.image}-${i}`}>
              <article
                className="gallery-card reveal reveal--scale"
                style={{ '--reveal-delay': `${(i % 4) * 80}ms` }}
              >
                <div
                  className="gallery-card__image"
                  style={{ backgroundImage: `url(${resolveImageUrl(g.image)})` }}
                  role="img"
                  aria-label={`${g.name} — ${g.trip}`}
                />
                <div className="gallery-card__caption">
                  <h3>{g.name}</h3>
                  <p>{g.trip}</p>
                </div>
              </article>
            </Col>
          ))}
        </Row>

        {visible < photos.length && (
          <div className="text-center mt-5 reveal reveal--fade-up">
            <Button className="btn-cta px-4 py-2" onClick={() => setVisible((v) => v + STEP)}>
              Load More
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}

export default PhotoGallery
