import { Form, Button, Row, Col, Badge } from 'react-bootstrap'
import ImageUpload from '@/components/admin/ImageUpload'

const hasText = (value) => Boolean(String(value || '').trim())

export const HERO_BANNER_SECTION_DEFS = [
  { key: 'home', label: 'Homepage Carousel' },
  { key: 'toursPage', label: 'Tours Page' },
  { key: 'destinationsPage', label: 'Destinations Page' },
  { key: 'aboutPage', label: 'About Page' },
  { key: 'contactPage', label: 'Contact Page' },
  { key: 'travelGuidePage', label: 'Travel Guide Page' },
]

function pageHeroComplete(hero) {
  return hasText(hero.title) && hasText(hero.image)
}

function PageHeroFields({ hero, onChange }) {
  return (
    <div className="hero-page-fields">
      <Form.Group className="mb-3">
        <Form.Label>Eyebrow</Form.Label>
        <Form.Control value={hero.eyebrow} onChange={(e) => onChange({ ...hero, eyebrow: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control value={hero.title} onChange={(e) => onChange({ ...hero, title: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Subtitle</Form.Label>
        <Form.Control as="textarea" rows={2} value={hero.subtitle} onChange={(e) => onChange({ ...hero, subtitle: e.target.value })} />
      </Form.Group>
      <ImageUpload label="Hero banner image" value={hero.image} onChange={(v) => onChange({ ...hero, image: v })} className="mb-3" />
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Button text</Form.Label>
            <Form.Control value={hero.ctaText} onChange={(e) => onChange({ ...hero, ctaText: e.target.value })} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Button link</Form.Label>
            <Form.Control value={hero.ctaLink} onChange={(e) => onChange({ ...hero, ctaLink: e.target.value })} placeholder="#all-tours" />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}

export function buildHeroBannerSections(banners) {
  return HERO_BANNER_SECTION_DEFS.map(({ key, label }) => {
    if (key === 'home') {
      const slides = banners.home.slides || []
      const firstSlide = slides[0]
      return {
        key,
        label,
        image: firstSlide?.image,
        preview: firstSlide?.headline || banners.home.eyebrow || `${slides.length} slide${slides.length === 1 ? '' : 's'}`,
        complete: slides.length > 0 && slides.every((slide) => hasText(slide.headline) && hasText(slide.image)),
      }
    }

    const hero = banners[key]
    return {
      key,
      label,
      image: hero?.image,
      preview: hero?.title || hero?.subtitle,
      complete: pageHeroComplete(hero || {}),
    }
  })
}

export function renderHeroBannerSection(key, banners, setSection) {
  if (key === 'home') {
    const addSlide = () =>
      setSection('home', {
        ...banners.home,
        slides: [...banners.home.slides, { headline: '', subheading: '', image: '' }],
      })

    const removeSlide = (index) =>
      setSection('home', {
        ...banners.home,
        slides: banners.home.slides.filter((_, idx) => idx !== index),
      })

    const updateSlide = (index, field, value) => {
      const slides = banners.home.slides.map((slide, idx) =>
        idx === index ? { ...slide, [field]: value } : slide
      )
      setSection('home', { ...banners.home, slides })
    }

    return (
      <>
        <Form.Group className="mb-4">
          <Form.Label>Eyebrow (shown on all slides)</Form.Label>
          <Form.Control
            value={banners.home.eyebrow}
            onChange={(e) => setSection('home', { ...banners.home, eyebrow: e.target.value })}
          />
        </Form.Group>

        <div className="hero-slides-toolbar">
          <div className="hero-slides-toolbar__text">
            <h6 className="mb-1">Carousel slides</h6>
            <p className="text-muted small mb-0">
              Each slide rotates on the homepage hero. Add at least one slide.
            </p>
          </div>
          <Button size="sm" variant="outline-secondary" type="button" onClick={addSlide}>
            + Add slide
          </Button>
        </div>

        <div className="hero-slides-list">
          {banners.home.slides.map((slide, i) => (
            <article className="hero-slide-card" key={i}>
              <div className="hero-slide-card__head">
                <Badge bg="secondary" className="hero-slide-card__badge">
                  Slide {i + 1}
                </Badge>
                <Button
                  variant="outline-danger"
                  size="sm"
                  type="button"
                  className="hero-slide-card__remove"
                  onClick={() => removeSlide(i)}
                  disabled={banners.home.slides.length === 1}
                >
                  Remove
                </Button>
              </div>

              <Row className="g-3 hero-slide-card__grid">
                <Col xs={12} lg={7}>
                  <Form.Group className="mb-3 mb-lg-0">
                    <Form.Label>Headline</Form.Label>
                    <Form.Control value={slide.headline} onChange={(e) => updateSlide(i, 'headline', e.target.value)} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Subheading</Form.Label>
                    <Form.Control as="textarea" rows={3} value={slide.subheading} onChange={(e) => updateSlide(i, 'subheading', e.target.value)} />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={5}>
                  <ImageUpload label="Banner image" value={slide.image} onChange={(v) => updateSlide(i, 'image', v)} />
                </Col>
              </Row>
            </article>
          ))}
        </div>
      </>
    )
  }

  const hero = banners[key]
  return <PageHeroFields hero={hero} onChange={(v) => setSection(key, v)} />
}
