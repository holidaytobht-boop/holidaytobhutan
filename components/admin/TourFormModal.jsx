'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

const emptyPackage = () => ({ name: '', summary: '', image: '', durationDays: '', fromPriceUsd: '' })
const emptyHighlight = () => ({ title: '', summary: '', description: '', image: '' })

function TourFormModal({ show, onHide, onSubmit, initial }) {
  const isEdit = Boolean(initial)
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [image, setImage] = useState('')
  const [overview, setOverview] = useState('')
  const [packages, setPackages] = useState([emptyPackage()])
  const [highlights, setHighlights] = useState([emptyHighlight()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) return
    setName(initial?.name || '')
    setSummary(initial?.summary || '')
    setImage(initial?.image || '')
    setOverview(initial?.overview || '')
    setPackages(
      initial?.packages?.length
        ? initial.packages.map((p) => ({
            ...p,
            name: p.name || '',
            summary: p.summary || '',
            image: p.image || '',
            durationDays: p.durationDays ?? '',
            fromPriceUsd: p.fromPriceUsd ?? '',
          }))
        : [emptyPackage()]
    )
    setHighlights(
      initial?.highlights?.length
        ? initial.highlights.map((h) => ({
            title: h.title || '',
            summary: h.summary || '',
            description: h.description || '',
            image: h.image || '',
          }))
        : [emptyHighlight()]
    )
    setError('')
  }, [show, initial])

  const updatePackage = (index, field, value) => {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }
  const addPackage = () => setPackages((prev) => [...prev, emptyPackage()])
  const removePackage = (index) => setPackages((prev) => prev.filter((_, i) => i !== index))

  const updateHighlight = (index, field, value) => {
    setHighlights((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }
  const addHighlight = () => setHighlights((prev) => [...prev, emptyHighlight()])
  const removeHighlight = (index) => setHighlights((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tour name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        name: name.trim(),
        summary: summary.trim(),
        image: image.trim(),
        overview: overview.trim(),
        packages: packages
          .filter((p) => p.name.trim())
          .map((p) => ({
            ...p,
            name: p.name.trim(),
            summary: p.summary.trim(),
            image: p.image.trim(),
            durationDays: Number(p.durationDays) || 0,
            fromPriceUsd: Number(p.fromPriceUsd) || 0,
          })),
        highlights: highlights
          .filter((h) => h.title.trim())
          .map((h) => ({
            title: h.title.trim(),
            summary: h.summary.trim(),
            description: h.description.trim(),
            image: h.image.trim(),
          })),
      })
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" scrollable>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Tour' : 'Add Tour'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          <Form.Group className="mb-3" controlId="tourName">
            <Form.Label>Tour name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Trekking Tours" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="tourSummary">
            <Form.Label>Summary <span className="text-muted fw-normal">(short tagline / hero subtitle)</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short description shown on the hero and tour cards"
            />
          </Form.Group>

          <ImageUpload
            label="Hero image"
            value={image}
            onChange={setImage}
            className="mb-3"
          />

          <Form.Group className="mb-4" controlId="tourOverview">
            <Form.Label>Overview <span className="text-muted fw-normal">(intro paragraph on the tour page)</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="A longer description of this type of tour."
            />
          </Form.Group>

          <hr />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0 fw-semibold">Packages</Form.Label>
            <Button size="sm" variant="outline-secondary" onClick={addPackage} type="button">
              + Add package
            </Button>
          </div>

          {packages.map((p, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2 align-items-center mb-2">
                <Col xs={12} md={6}>
                  <Form.Control
                    placeholder="Package name"
                    value={p.name}
                    onChange={(e) => updatePackage(i, 'name', e.target.value)}
                  />
                </Col>
                <Col xs={5} md={3}>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Days"
                    value={p.durationDays}
                    onChange={(e) => updatePackage(i, 'durationDays', e.target.value)}
                  />
                </Col>
                <Col xs={5} md={2}>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="From $"
                    value={p.fromPriceUsd}
                    onChange={(e) => updatePackage(i, 'fromPriceUsd', e.target.value)}
                  />
                </Col>
                <Col xs={2} md={1} className="text-end">
                  <Button
                    variant="outline-danger"
                    type="button"
                    onClick={() => removePackage(i)}
                    disabled={packages.length === 1}
                    title="Remove package"
                  >
                    ×
                  </Button>
                </Col>
              </Row>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <Form.Control
                    placeholder="Card text / summary"
                    value={p.summary}
                    onChange={(e) => updatePackage(i, 'summary', e.target.value)}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <ImageUpload
                    label="Card image"
                    value={p.image}
                    onChange={(v) => updatePackage(i, 'image', v)}
                    compact
                  />
                </Col>
              </Row>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0 fw-semibold">Highlights</Form.Label>
            <Button size="sm" variant="outline-secondary" onClick={addHighlight} type="button">
              + Add highlight
            </Button>
          </div>

          {highlights.map((h, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2 align-items-center mb-2">
                <Col xs={12} md={5}>
                  <Form.Control
                    placeholder="Highlight title"
                    value={h.title}
                    onChange={(e) => updateHighlight(i, 'title', e.target.value)}
                  />
                </Col>
                <Col xs={10} md={6}>
                  <ImageUpload
                    label="Highlight image"
                    value={h.image}
                    onChange={(v) => updateHighlight(i, 'image', v)}
                    compact
                  />
                </Col>
                <Col xs={2} md={1} className="text-end">
                  <Button
                    variant="outline-danger"
                    type="button"
                    onClick={() => removeHighlight(i)}
                    disabled={highlights.length === 1}
                    title="Remove highlight"
                  >
                    ×
                  </Button>
                </Col>
              </Row>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <Form.Control
                    placeholder="Summary (optional)"
                    value={h.summary}
                    onChange={(e) => updateHighlight(i, 'summary', e.target.value)}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Control
                    placeholder="Description (optional)"
                    value={h.description}
                    onChange={(e) => updateHighlight(i, 'description', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create tour'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default TourFormModal
