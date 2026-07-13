'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const galleryImage = (file) => `/images/home/gallery/${file}`

const fallback = {
  title: 'Photo Gallery',
  subtitle: 'Real moments from our guests across Bhutan',
  photos: [
    { name: 'Sarah & Tom', trip: "Paro · Tiger's Nest", image: galleryImage('PXL_20260428_030403263.TS-000.jpg') },
    { name: 'Akiko Tanaka', trip: 'Punakha Valley', image: galleryImage('20250428_053654869_iOS.jpg') },
    { name: 'Daniel Meyer', trip: 'Jomolhari Trek', image: galleryImage('_DSC8545.jpg') },
    { name: 'Maria Lopez', trip: 'Phobjikha Valley', image: galleryImage('_DSC6173.jpg') },
    { name: 'James Carter', trip: 'Dochula Pass', image: galleryImage('_DSC8697.jpg') },
    { name: 'The Nguyen Family', trip: 'Thimphu', image: galleryImage('20250426_110139977_iOS.jpg') },
    { name: 'Elena Rossi', trip: 'Bumthang', image: galleryImage('PXL_20260506_080818203.TS-000.jpg') },
    { name: "Liam O'Brien", trip: 'Druk Path Trek', image: galleryImage('20241103_051606749_iOS.jpg') },
    { name: 'Priya & Arjun', trip: 'Paro Festival', image: galleryImage('20260501_020921767_iOS.jpg') },
    { name: 'Mark Wilson', trip: 'Snowman Trek', image: galleryImage('20260413_053514352_iOS.jpg') },
    { name: 'Sophie Laurent', trip: 'Haa Valley', image: galleryImage('20250925_025236000_iOS.jpg') },
    { name: 'David Kim', trip: 'Gangtey', image: galleryImage('20260503_051358328_iOS.jpg') },
  ],
}

const pick = (apiVal, fallbackVal) => {
  if (typeof apiVal === 'string') return apiVal.trim() ? apiVal : fallbackVal
  return apiVal ?? fallbackVal
}

const mergeGallery = (apiData) => {
  if (!apiData?.photoGallery) return fallback
  const g = apiData.photoGallery
  const photos = (g.photos?.length ? g.photos : fallback.photos).map((p, i) => ({
    name: pick(p.name, fallback.photos[i]?.name || 'Guest'),
    trip: pick(p.trip, fallback.photos[i]?.trip || ''),
    image: pick(p.image, fallback.photos[i]?.image || ''),
  }))
  return {
    title: pick(g.title, fallback.title),
    subtitle: pick(g.subtitle, fallback.subtitle),
    photos: photos.filter((p) => p.image),
  }
}

const STEP = 4

function PhotoGallery() {
  const [gallery, setGallery] = useState(fallback)
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

  return (
    <section className="section-pad" id="gallery">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>{gallery.title}</h2>
          <p>{gallery.subtitle}</p>
        </div>
        <Row className="g-4 justify-content-center">
          {photos.slice(0, visible).map((g, i) => (
            <Col sm={6} lg={3} key={`${g.name}-${i}`}>
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
