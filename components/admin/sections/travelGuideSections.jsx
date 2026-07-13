import { Form, Button, Row, Col } from 'react-bootstrap'
import ImageUpload from '@/components/admin/ImageUpload'

const hasText = (value) => Boolean(String(value || '').trim())

export const TRAVEL_GUIDE_SECTION_DEFS = [
  { key: 'about', label: 'About' },
  { key: 'visaSdf', label: 'Visa & SDF' },
  { key: 'seasons', label: 'Seasons' },
  { key: 'trekking', label: 'Trekking' },
  { key: 'packing', label: 'Packing' },
  { key: 'faqs', label: 'FAQs' },
]

export function buildTravelGuideSections(guide) {
  return TRAVEL_GUIDE_SECTION_DEFS.map(({ key, label }) => {
    switch (key) {
      case 'about':
        return {
          key,
          label,
          preview: guide.about.title || guide.about.paragraphs?.[0],
          complete: hasText(guide.about.title) && guide.about.paragraphs?.some(hasText),
        }
      case 'visaSdf':
        return {
          key,
          label,
          preview: guide.visaSdf.title || guide.visaSdf.cards?.[0]?.title,
          complete: hasText(guide.visaSdf.title) && guide.visaSdf.cards?.some((card) => hasText(card.title) && hasText(card.body)),
        }
      case 'seasons':
        return {
          key,
          label,
          image: guide.seasons.items?.[0]?.image,
          preview: guide.seasons.title || guide.seasons.items?.[0]?.name,
          complete: hasText(guide.seasons.title) && guide.seasons.items?.some((item) => hasText(item.name) && hasText(item.desc)),
        }
      case 'trekking':
        return {
          key,
          label,
          preview: guide.trekking.title || guide.trekking.tips?.[0],
          complete: hasText(guide.trekking.title) && guide.trekking.tips?.some(hasText),
        }
      case 'packing':
        return {
          key,
          label,
          preview: guide.packing.title || guide.packing.items?.[0],
          complete: hasText(guide.packing.title) && guide.packing.items?.some(hasText),
        }
      case 'faqs':
        return {
          key,
          label,
          preview: guide.faqs.title || guide.faqs.items?.[0]?.q,
          complete: hasText(guide.faqs.title) && guide.faqs.items?.some((item) => hasText(item.q) && hasText(item.a)),
        }
      default:
        return { key, label, preview: '', complete: false }
    }
  })
}

export function renderTravelGuideSection(key, guide, setSection) {
  switch (key) {
    case 'about':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.about.title} onChange={(e) => setSection('about', { ...guide.about, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.about.subtitle} onChange={(e) => setSection('about', { ...guide.about, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0 fw-semibold">Paragraphs</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('about', { ...guide.about, paragraphs: [...guide.about.paragraphs, ''] })}>+ Add paragraph</Button>
          </div>
          {guide.about.paragraphs.map((p, i) => (
            <div key={i} className="mb-2 d-flex gap-2">
              <Form.Control as="textarea" rows={3} value={p} onChange={(e) => {
                const paragraphs = guide.about.paragraphs.map((x, idx) => (idx === i ? e.target.value : x))
                setSection('about', { ...guide.about, paragraphs })
              }} />
              <Button variant="outline-danger" type="button" onClick={() => setSection('about', { ...guide.about, paragraphs: guide.about.paragraphs.filter((_, idx) => idx !== i) })} disabled={guide.about.paragraphs.length === 1}>×</Button>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0 fw-semibold">Quick facts</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('about', { ...guide.about, facts: [...guide.about.facts, { label: '', value: '' }] })}>+ Add fact</Button>
          </div>
          {guide.about.facts.map((f, i) => (
            <Row className="g-2 mb-2" key={i}>
              <Col md={5}><Form.Control placeholder="Label" value={f.label} onChange={(e) => {
                const facts = guide.about.facts.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x))
                setSection('about', { ...guide.about, facts })
              }} /></Col>
              <Col md={6}><Form.Control placeholder="Value" value={f.value} onChange={(e) => {
                const facts = guide.about.facts.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x))
                setSection('about', { ...guide.about, facts })
              }} /></Col>
              <Col md={1}><Button variant="outline-danger" type="button" onClick={() => setSection('about', { ...guide.about, facts: guide.about.facts.filter((_, idx) => idx !== i) })} disabled={guide.about.facts.length === 1}>×</Button></Col>
            </Row>
          ))}
        </>
      )
    case 'visaSdf':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.visaSdf.title} onChange={(e) => setSection('visaSdf', { ...guide.visaSdf, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.visaSdf.subtitle} onChange={(e) => setSection('visaSdf', { ...guide.visaSdf, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Info cards</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('visaSdf', { ...guide.visaSdf, cards: [...guide.visaSdf.cards, { title: '', body: '' }] })}>+ Add card</Button>
          </div>
          {guide.visaSdf.cards.map((c, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2">
                <Col md={11}><Form.Control className="mb-2" placeholder="Card title" value={c.title} onChange={(e) => {
                  const cards = guide.visaSdf.cards.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x))
                  setSection('visaSdf', { ...guide.visaSdf, cards })
                }} /></Col>
                <Col md={1}><Button variant="outline-danger" type="button" onClick={() => setSection('visaSdf', { ...guide.visaSdf, cards: guide.visaSdf.cards.filter((_, idx) => idx !== i) })} disabled={guide.visaSdf.cards.length === 1}>×</Button></Col>
                <Col xs={12}><Form.Control as="textarea" rows={2} placeholder="Card text" value={c.body} onChange={(e) => {
                  const cards = guide.visaSdf.cards.map((x, idx) => (idx === i ? { ...x, body: e.target.value } : x))
                  setSection('visaSdf', { ...guide.visaSdf, cards })
                }} /></Col>
              </Row>
            </div>
          ))}
        </>
      )
    case 'seasons':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.seasons.title} onChange={(e) => setSection('seasons', { ...guide.seasons, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.seasons.subtitle} onChange={(e) => setSection('seasons', { ...guide.seasons, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Season cards</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('seasons', { ...guide.seasons, items: [...guide.seasons.items, { name: '', months: '', desc: '', image: '' }] })}>+ Add season</Button>
          </div>
          {guide.seasons.items.map((s, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2 mb-2">
                <Col md={5}><Form.Control placeholder="Season name" value={s.name} onChange={(e) => {
                  const items = guide.seasons.items.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                  setSection('seasons', { ...guide.seasons, items })
                }} /></Col>
                <Col md={5}><Form.Control placeholder="Months" value={s.months} onChange={(e) => {
                  const items = guide.seasons.items.map((x, idx) => (idx === i ? { ...x, months: e.target.value } : x))
                  setSection('seasons', { ...guide.seasons, items })
                }} /></Col>
                <Col md={2} className="d-flex align-items-start">
                  <Button variant="outline-danger" type="button" className="w-100" onClick={() => setSection('seasons', { ...guide.seasons, items: guide.seasons.items.filter((_, idx) => idx !== i) })} disabled={guide.seasons.items.length === 1}>×</Button>
                </Col>
              </Row>
              <Form.Control as="textarea" rows={2} placeholder="Description" className="mb-2" value={s.desc} onChange={(e) => {
                const items = guide.seasons.items.map((x, idx) => (idx === i ? { ...x, desc: e.target.value } : x))
                setSection('seasons', { ...guide.seasons, items })
              }} />
              <ImageUpload label="Season image" value={s.image} onChange={(v) => {
                const items = guide.seasons.items.map((x, idx) => (idx === i ? { ...x, image: v } : x))
                setSection('seasons', { ...guide.seasons, items })
              }} compact />
            </div>
          ))}
        </>
      )
    case 'trekking':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.trekking.title} onChange={(e) => setSection('trekking', { ...guide.trekking, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.trekking.subtitle} onChange={(e) => setSection('trekking', { ...guide.trekking, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Tips</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('trekking', { ...guide.trekking, tips: [...guide.trekking.tips, ''] })}>+ Add tip</Button>
          </div>
          {guide.trekking.tips.map((t, i) => (
            <Row className="g-2 mb-2" key={i}>
              <Col xs={11}><Form.Control value={t} onChange={(e) => {
                const tips = guide.trekking.tips.map((x, idx) => (idx === i ? e.target.value : x))
                setSection('trekking', { ...guide.trekking, tips })
              }} /></Col>
              <Col xs={1}><Button variant="outline-danger" type="button" onClick={() => setSection('trekking', { ...guide.trekking, tips: guide.trekking.tips.filter((_, idx) => idx !== i) })} disabled={guide.trekking.tips.length === 1}>×</Button></Col>
            </Row>
          ))}
        </>
      )
    case 'packing':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.packing.title} onChange={(e) => setSection('packing', { ...guide.packing, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.packing.subtitle} onChange={(e) => setSection('packing', { ...guide.packing, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Packing items</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('packing', { ...guide.packing, items: [...guide.packing.items, ''] })}>+ Add item</Button>
          </div>
          {guide.packing.items.map((t, i) => (
            <Row className="g-2 mb-2" key={i}>
              <Col xs={11}><Form.Control value={t} onChange={(e) => {
                const items = guide.packing.items.map((x, idx) => (idx === i ? e.target.value : x))
                setSection('packing', { ...guide.packing, items })
              }} /></Col>
              <Col xs={1}><Button variant="outline-danger" type="button" onClick={() => setSection('packing', { ...guide.packing, items: guide.packing.items.filter((_, idx) => idx !== i) })} disabled={guide.packing.items.length === 1}>×</Button></Col>
            </Row>
          ))}
        </>
      )
    case 'faqs':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={guide.faqs.title} onChange={(e) => setSection('faqs', { ...guide.faqs, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={guide.faqs.subtitle} onChange={(e) => setSection('faqs', { ...guide.faqs, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Questions</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('faqs', { ...guide.faqs, items: [...guide.faqs.items, { q: '', a: '' }] })}>+ Add FAQ</Button>
          </div>
          {guide.faqs.items.map((f, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2 mb-2">
                <Col xs={11}><Form.Control placeholder="Question" value={f.q} onChange={(e) => {
                  const items = guide.faqs.items.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x))
                  setSection('faqs', { ...guide.faqs, items })
                }} /></Col>
                <Col xs={1}><Button variant="outline-danger" type="button" onClick={() => setSection('faqs', { ...guide.faqs, items: guide.faqs.items.filter((_, idx) => idx !== i) })} disabled={guide.faqs.items.length === 1}>×</Button></Col>
              </Row>
              <Form.Control as="textarea" rows={2} placeholder="Answer" value={f.a} onChange={(e) => {
                const items = guide.faqs.items.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x))
                setSection('faqs', { ...guide.faqs, items })
              }} />
            </div>
          ))}
        </>
      )
    default:
      return null
  }
}
