'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Alert, Nav, Tab } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

const emptyDay = () => ({ day: '', title: '', desc: '' })
const emptyHighlight = () => ({ title: '', summary: '', description: '', image: '' })

const toHighlightState = (h) =>
  typeof h === 'string'
    ? { title: h, summary: '', description: '', image: '' }
    : {
        title: h.title || '',
        summary: h.summary || '',
        description: h.description || '',
        image: h.image || h.img || '',
      }

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'itinerary', label: 'Itinerary' },
]

function PackageDetailModal({ show, onHide, onSubmit, pkg, tourName }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [tagline, setTagline] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [duration, setDuration] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [bestSeason, setBestSeason] = useState('')
  const [overview, setOverview] = useState('')
  const [highlights, setHighlights] = useState([emptyHighlight()])
  const [itinerary, setItinerary] = useState([emptyDay()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show || !pkg) return
    setActiveTab('overview')
    setTagline(pkg.tagline || '')
    setHeroImage(pkg.heroImage || '')
    setDuration(pkg.duration || '')
    setGroupSize(pkg.groupSize || '')
    setBestSeason(pkg.bestSeason || '')
    setOverview(pkg.overview || '')
    setHighlights(pkg.highlights?.length ? pkg.highlights.map(toHighlightState) : [emptyHighlight()])
    setItinerary(pkg.itinerary?.length ? pkg.itinerary.map((d) => ({ ...d })) : [emptyDay()])
    setError('')
  }, [show, pkg])

  const updDay = (i, f, v) => setItinerary((p) => p.map((d, idx) => (idx === i ? { ...d, [f]: v } : d)))
  const updHl = (i, f, v) => setHighlights((p) => p.map((h, idx) => (idx === i ? { ...h, [f]: v } : h)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        ...pkg,
        tagline: tagline.trim(),
        heroImage: heroImage.trim(),
        duration: duration.trim(),
        groupSize: groupSize.trim(),
        bestSeason: bestSeason.trim(),
        overview: overview.trim(),
        highlights: highlights
          .filter((h) => h.title.trim())
          .map((h) => ({
            title: h.title.trim(),
            summary: h.summary.trim(),
            description: h.description.trim(),
            image: h.image.trim(),
          })),
        itinerary: itinerary
          .filter((d) => d.title.trim() || d.desc.trim() || d.day.trim())
          .map((d) => ({ day: d.day.trim(), title: d.title.trim(), desc: d.desc.trim() })),
      })
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!pkg) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" className="pkg-modal">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="pkg-modal__header">
          <div>
            <Modal.Title className="mb-1">{pkg.name}</Modal.Title>
            {tourName ? <p className="text-muted mb-0 small">{tourName}</p> : null}
          </div>
        </Modal.Header>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')}>
          <Nav variant="tabs" className="pkg-modal__tabs px-3">
            {TABS.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Modal.Body className="pkg-modal__body">
            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <Form.Group className="mb-3">
                  <Form.Label>Tagline</Form.Label>
                  <Form.Control
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Short line under the package name on the hero"
                  />
                </Form.Group>

                <ImageUpload label="Hero image" value={heroImage} onChange={setHeroImage} className="mb-3" />

                <Row className="g-2 mb-3">
                  <Col md={4}>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="6 Days / 5 Nights"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Group size</Form.Label>
                    <Form.Control
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      placeholder="2–10 guests"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Best season</Form.Label>
                    <Form.Control
                      value={bestSeason}
                      onChange={(e) => setBestSeason(e.target.value)}
                      placeholder="Apr–Jun & Sep–Nov"
                    />
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label>Tour details (overview)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="Describe what this package includes and why guests will love it"
                  />
                </Form.Group>
              </Tab.Pane>

              <Tab.Pane eventKey="highlights">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-muted mb-0 small">Image cards shown on the package page</p>
                  <Button size="sm" variant="outline-secondary" type="button" onClick={() => setHighlights((p) => [...p, emptyHighlight()])}>
                    + Add highlight
                  </Button>
                </div>
                {highlights.map((h, i) => (
                  <div className="border rounded p-3 mb-3" key={i}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Highlight {i + 1}</span>
                      <Button variant="outline-danger" type="button" onClick={() => setHighlights((p) => p.filter((_, idx) => idx !== i))} disabled={highlights.length === 1} title="Remove highlight">
                        ×
                      </Button>
                    </div>
                    <Row className="g-2">
                      <Col xs={12} md={6}>
                        <Form.Label className="small">Title</Form.Label>
                        <Form.Control placeholder="Highlight title" value={h.title} onChange={(e) => updHl(i, 'title', e.target.value)} />
                      </Col>
                      <Col xs={12} md={6}>
                        <ImageUpload label="Image" value={h.image} onChange={(v) => updHl(i, 'image', v)} compact />
                      </Col>
                      <Col xs={12}>
                        <Form.Label className="small">Summary</Form.Label>
                        <Form.Control
                          placeholder="Short line shown on the card"
                          value={h.summary}
                          onChange={(e) => updHl(i, 'summary', e.target.value)}
                        />
                      </Col>
                      <Col xs={12}>
                        <Form.Label className="small">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Optional longer text for the featured card"
                          value={h.description}
                          onChange={(e) => updHl(i, 'description', e.target.value)}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Tab.Pane>

              <Tab.Pane eventKey="itinerary">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-muted mb-0 small">Day-by-day plan on the package page</p>
                  <Button size="sm" variant="outline-secondary" type="button" onClick={() => setItinerary((p) => [...p, emptyDay()])}>
                    + Add day
                  </Button>
                </div>
                {itinerary.map((d, i) => (
                  <div className="border rounded p-2 mb-2 bg-light" key={i}>
                    <Row className="g-2 align-items-center mb-2">
                      <Col xs={4} md={3}>
                        <Form.Control placeholder="Day 1" value={d.day} onChange={(e) => updDay(i, 'day', e.target.value)} />
                      </Col>
                      <Col xs={8} md={8}>
                        <Form.Control placeholder="Title" value={d.title} onChange={(e) => updDay(i, 'title', e.target.value)} />
                      </Col>
                      <Col xs={12} md={1} className="text-end">
                        <Button variant="outline-danger" type="button" onClick={() => setItinerary((p) => p.filter((_, idx) => idx !== i))} disabled={itinerary.length === 1} title="Remove day">
                          ×
                        </Button>
                      </Col>
                    </Row>
                    <Form.Control as="textarea" rows={2} placeholder="What happens this day" value={d.desc} onChange={(e) => updDay(i, 'desc', e.target.value)} />
                  </div>
                ))}
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>

        <Modal.Footer className="pkg-modal__footer">
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save package'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default PackageDetailModal
