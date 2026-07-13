import { Form, Button, Row, Col } from 'react-bootstrap'
import ImageUpload from '@/components/admin/ImageUpload'

const hasText = (value) => Boolean(String(value || '').trim())

export const ABOUT_SECTION_DEFS = [
  { key: 'story', label: 'Our Story' },
  { key: 'missionVision', label: 'Mission & Vision' },
  { key: 'offers', label: 'What We Offer' },
  { key: 'whyChooseUs', label: 'Why Choose Us' },
  { key: 'team', label: 'Team' },
  { key: 'values', label: 'Values' },
  { key: 'cta', label: 'CTA' },
]

export function buildAboutSections(page) {
  return ABOUT_SECTION_DEFS.map(({ key, label }) => {
    switch (key) {
      case 'story':
        return {
          key,
          label,
          image: page.story.image,
          preview: page.story.title || page.story.paragraphs?.[0],
          complete: hasText(page.story.title) && page.story.paragraphs?.some(hasText),
        }
      case 'missionVision':
        return {
          key,
          label,
          preview: page.missionVision.mission.title || page.missionVision.vision.title,
          complete:
            hasText(page.missionVision.mission.title) &&
            hasText(page.missionVision.mission.text) &&
            hasText(page.missionVision.vision.title) &&
            hasText(page.missionVision.vision.text),
        }
      case 'offers':
        return {
          key,
          label,
          preview: page.offers.title || page.offers.items?.[0]?.title,
          complete: hasText(page.offers.title) && page.offers.items?.some((item) => hasText(item.title) && hasText(item.text)),
        }
      case 'whyChooseUs':
        return {
          key,
          label,
          preview: page.whyChooseUs.title || page.whyChooseUs.items?.[0],
          complete: hasText(page.whyChooseUs.title) && page.whyChooseUs.items?.some(hasText),
        }
      case 'team':
        return {
          key,
          label,
          preview: page.team.title || page.team.members?.[0]?.name,
          complete: hasText(page.team.title) && page.team.members?.some((member) => hasText(member.name) && hasText(member.role)),
        }
      case 'values':
        return {
          key,
          label,
          preview: page.values.title || page.values.items?.[0]?.title,
          complete: hasText(page.values.title) && page.values.items?.some((item) => hasText(item.title) && hasText(item.text)),
        }
      case 'cta':
        return {
          key,
          label,
          preview: page.cta.title || page.cta.subtitle,
          complete: hasText(page.cta.title) && hasText(page.cta.whatsappUrl),
        }
      default:
        return { key, label, preview: '', complete: false }
    }
  })
}

export function renderAboutSection(key, page, setSection) {
  switch (key) {
    case 'story':
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Section title</Form.Label>
            <Form.Control value={page.story.title} onChange={(e) => setSection('story', { ...page.story, title: e.target.value })} />
          </Form.Group>
          <ImageUpload label="Story image" value={page.story.image} onChange={(v) => setSection('story', { ...page.story, image: v })} className="mb-3" />
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Paragraphs</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('story', { ...page.story, paragraphs: [...page.story.paragraphs, ''] })}>+ Add paragraph</Button>
          </div>
          {page.story.paragraphs.map((p, i) => (
            <div className="d-flex gap-2 mb-2" key={i}>
              <Form.Control as="textarea" rows={3} value={p} onChange={(e) => {
                const paragraphs = page.story.paragraphs.map((x, idx) => (idx === i ? e.target.value : x))
                setSection('story', { ...page.story, paragraphs })
              }} />
              <Button variant="outline-danger" type="button" onClick={() => setSection('story', { ...page.story, paragraphs: page.story.paragraphs.filter((_, idx) => idx !== i) })} disabled={page.story.paragraphs.length === 1}>×</Button>
            </div>
          ))}
        </>
      )
    case 'missionVision':
      return (
        <Row className="g-3">
          <Col md={6}>
            <Form.Label className="fw-semibold">Mission title</Form.Label>
            <Form.Control className="mb-2" value={page.missionVision.mission.title} onChange={(e) => setSection('missionVision', { ...page.missionVision, mission: { ...page.missionVision.mission, title: e.target.value } })} />
            <Form.Control as="textarea" rows={4} value={page.missionVision.mission.text} onChange={(e) => setSection('missionVision', { ...page.missionVision, mission: { ...page.missionVision.mission, text: e.target.value } })} />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Vision title</Form.Label>
            <Form.Control className="mb-2" value={page.missionVision.vision.title} onChange={(e) => setSection('missionVision', { ...page.missionVision, vision: { ...page.missionVision.vision, title: e.target.value } })} />
            <Form.Control as="textarea" rows={4} value={page.missionVision.vision.text} onChange={(e) => setSection('missionVision', { ...page.missionVision, vision: { ...page.missionVision.vision, text: e.target.value } })} />
          </Col>
        </Row>
      )
    case 'offers':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={page.offers.title} onChange={(e) => setSection('offers', { ...page.offers, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={page.offers.subtitle} onChange={(e) => setSection('offers', { ...page.offers, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Offer cards</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('offers', { ...page.offers, items: [...page.offers.items, { title: '', text: '' }] })}>+ Add offer</Button>
          </div>
          {page.offers.items.map((o, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2">
                <Col md={11}><Form.Control className="mb-2" placeholder="Title" value={o.title} onChange={(e) => {
                  const items = page.offers.items.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x))
                  setSection('offers', { ...page.offers, items })
                }} /></Col>
                <Col md={1}><Button variant="outline-danger" type="button" onClick={() => setSection('offers', { ...page.offers, items: page.offers.items.filter((_, idx) => idx !== i) })} disabled={page.offers.items.length === 1}>×</Button></Col>
                <Col xs={12}><Form.Control as="textarea" rows={2} placeholder="Description" value={o.text} onChange={(e) => {
                  const items = page.offers.items.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x))
                  setSection('offers', { ...page.offers, items })
                }} /></Col>
              </Row>
            </div>
          ))}
        </>
      )
    case 'whyChooseUs':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={page.whyChooseUs.title} onChange={(e) => setSection('whyChooseUs', { ...page.whyChooseUs, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={page.whyChooseUs.subtitle} onChange={(e) => setSection('whyChooseUs', { ...page.whyChooseUs, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Reasons</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('whyChooseUs', { ...page.whyChooseUs, items: [...page.whyChooseUs.items, ''] })}>+ Add reason</Button>
          </div>
          {page.whyChooseUs.items.map((item, i) => (
            <Row className="g-2 mb-2" key={i}>
              <Col xs={11}><Form.Control value={item} onChange={(e) => {
                const items = page.whyChooseUs.items.map((x, idx) => (idx === i ? e.target.value : x))
                setSection('whyChooseUs', { ...page.whyChooseUs, items })
              }} /></Col>
              <Col xs={1}><Button variant="outline-danger" type="button" onClick={() => setSection('whyChooseUs', { ...page.whyChooseUs, items: page.whyChooseUs.items.filter((_, idx) => idx !== i) })} disabled={page.whyChooseUs.items.length === 1}>×</Button></Col>
            </Row>
          ))}
        </>
      )
    case 'team':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={page.team.title} onChange={(e) => setSection('team', { ...page.team, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={page.team.subtitle} onChange={(e) => setSection('team', { ...page.team, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Team members</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('team', { ...page.team, members: [...page.team.members, { name: '', role: '', avatar: '' }] })}>+ Add member</Button>
          </div>
          {page.team.members.map((m, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2">
                <Col md={4}><Form.Control placeholder="Name" value={m.name} onChange={(e) => {
                  const members = page.team.members.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                  setSection('team', { ...page.team, members })
                }} /></Col>
                <Col md={4}><Form.Control placeholder="Role" value={m.role} onChange={(e) => {
                  const members = page.team.members.map((x, idx) => (idx === i ? { ...x, role: e.target.value } : x))
                  setSection('team', { ...page.team, members })
                }} /></Col>
                <Col md={3}>
                  <ImageUpload label="Photo" value={m.avatar} onChange={(v) => {
                    const members = page.team.members.map((x, idx) => (idx === i ? { ...x, avatar: v } : x))
                    setSection('team', { ...page.team, members })
                  }} compact />
                </Col>
                <Col md={1}><Button variant="outline-danger" type="button" onClick={() => setSection('team', { ...page.team, members: page.team.members.filter((_, idx) => idx !== i) })} disabled={page.team.members.length === 1}>×</Button></Col>
              </Row>
            </div>
          ))}
        </>
      )
    case 'values':
      return (
        <>
          <Row className="g-2 mb-3">
            <Col md={6}><Form.Label>Section title</Form.Label><Form.Control value={page.values.title} onChange={(e) => setSection('values', { ...page.values, title: e.target.value })} /></Col>
            <Col md={6}><Form.Label>Section subtitle</Form.Label><Form.Control value={page.values.subtitle} onChange={(e) => setSection('values', { ...page.values, subtitle: e.target.value })} /></Col>
          </Row>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Values</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('values', { ...page.values, items: [...page.values.items, { title: '', text: '' }] })}>+ Add value</Button>
          </div>
          {page.values.items.map((v, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2">
                <Col md={11}><Form.Control className="mb-2" placeholder="Title" value={v.title} onChange={(e) => {
                  const items = page.values.items.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x))
                  setSection('values', { ...page.values, items })
                }} /></Col>
                <Col md={1}><Button variant="outline-danger" type="button" onClick={() => setSection('values', { ...page.values, items: page.values.items.filter((_, idx) => idx !== i) })} disabled={page.values.items.length === 1}>×</Button></Col>
                <Col xs={12}><Form.Control as="textarea" rows={2} placeholder="Description" value={v.text} onChange={(e) => {
                  const items = page.values.items.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x))
                  setSection('values', { ...page.values, items })
                }} /></Col>
              </Row>
            </div>
          ))}
        </>
      )
    case 'cta':
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Eyebrow</Form.Label>
            <Form.Control value={page.cta.eyebrow} onChange={(e) => setSection('cta', { ...page.cta, eyebrow: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={page.cta.title} onChange={(e) => setSection('cta', { ...page.cta, title: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Subtitle</Form.Label>
            <Form.Control as="textarea" rows={2} value={page.cta.subtitle} onChange={(e) => setSection('cta', { ...page.cta, subtitle: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>WhatsApp link</Form.Label>
            <Form.Control value={page.cta.whatsappUrl} onChange={(e) => setSection('cta', { ...page.cta, whatsappUrl: e.target.value })} placeholder="https://wa.me/..." />
          </Form.Group>
        </>
      )
    default:
      return null
  }
}
