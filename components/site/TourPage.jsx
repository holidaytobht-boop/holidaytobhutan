'use client'

import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function TourPage({
  eyebrow = 'Tours',
  title,
  subtitle,
  heroImage,
  ctaLabel = 'View Itineraries',
  introTitle,
  introSubtitle,
  introText,
  packagesTitle = 'Tour Packages',
  packagesSubtitle = 'Tailor-made itineraries you can shape to your own pace',
  packages = [],
  packageBase,
  highlightsTitle = 'Highlights',
  highlightsSubtitle,
  highlights = [],
}) {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${resolveImageUrl(heroImage)})` }}
      >
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero__sub">{subtitle}</p>
          {ctaLabel ? (
            <Button className="btn-cta mt-3 px-4 py-2" href="#packages">
              {ctaLabel}
            </Button>
          ) : null}
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <div className="section-title reveal reveal--fade-up">
                <h2>{introTitle}</h2>
                <p>{introSubtitle}</p>
              </div>
              <p className="text-muted reveal reveal--fade-up" style={{ '--reveal-delay': '120ms' }}>{introText}</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light" id="packages">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{packagesTitle}</h2>
            <p>{packagesSubtitle}</p>
          </div>
          <Row className="g-4 justify-content-center">
            {packages.map((p, i) => {
              const to = p.path || (packageBase ? `${packageBase}/${slug(p.title)}` : null)
              return (
                <Col xs={12} sm={6} lg={4} key={p.title}>
                  <article
                    className="package-card package-card--center reveal reveal--fade-up"
                    style={{ '--reveal-delay': `${i * 100}ms` }}
                  >
                    <div
                      className="package-card__image"
                      style={{ backgroundImage: `url(${resolveImageUrl(p.img)})` }}
                    />
                    <div className="package-card__body">
                      <h3>{p.title}</h3>
                      <p className="package-card__days">{p.summary}</p>
                      {to ? (
                        <Button as={Link} href={to} className="btn-cta">
                          Read More
                        </Button>
                      ) : (
                        <Button className="btn-cta">Read More</Button>
                      )}
                    </div>
                  </article>
                </Col>
              )
            })}
          </Row>
        </Container>
      </section>

      {highlights.length > 0 ? (
        <section className="section-pad">
          <Container>
            <div className="section-title reveal reveal--fade-up">
              <h2>{highlightsTitle}</h2>
              <p>{highlightsSubtitle}</p>
            </div>
            <Row className="g-4">
              <Col lg={6}>
                <div className="media-card media-card--featured h-100 reveal reveal--fade-right">
                  <div
                    className="media-card__image"
                    style={{ backgroundImage: `url(${resolveImageUrl(highlights[0].img)})` }}
                  />
                  <div className="media-card__body">
                    <h3 className="fw-bold">{highlights[0].title}</h3>
                    {highlights[0].summary ? (
                      <div className="mb-2">{highlights[0].summary}</div>
                    ) : null}
                    {highlights[0].description ? (
                      <p className="small mb-0 opacity-75">{highlights[0].description}</p>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <Row className="g-4">
                  {highlights.slice(1).map((h, i) => (
                    <Col sm={6} key={h.title}>
                      <div
                        className="media-card media-card--compact reveal reveal--fade-left"
                        style={{ '--reveal-delay': `${i * 80}ms` }}
                      >
                        <div
                          className="media-card__image"
                          style={{ backgroundImage: `url(${resolveImageUrl(h.img)})` }}
                        />
                        <div className="media-card__body">
                          <h5 className="fw-bold">{h.title}</h5>
                          {h.summary ? (
                            <div className="small opacity-75">{h.summary}</div>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      ) : null}
    </>
  )
}

export default TourPage
