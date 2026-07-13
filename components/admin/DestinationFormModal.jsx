'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

function DestinationFormModal({ show, onHide, onSubmit, initial }) {
  const isEdit = Boolean(initial)
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [image, setImage] = useState('')
  const [tagline, setTagline] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [altitude, setAltitude] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [overview, setOverview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) return
    setName(initial?.name || '')
    setSummary(initial?.summary || '')
    setImage(initial?.image || '')
    setTagline(initial?.tagline || '')
    setHeroImage(initial?.heroImage || '')
    setAltitude(initial?.altitude || '')
    setBestTime(initial?.bestTime || '')
    setOverview(initial?.overview || '')
    setError('')
  }, [show, initial])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Destination name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        name: name.trim(),
        summary: summary.trim(),
        image: image.trim(),
        tagline: tagline.trim(),
        heroImage: heroImage.trim(),
        altitude: altitude.trim(),
        bestTime: bestTime.trim(),
        overview: overview.trim(),
        places: initial?.places || [],
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
          <Modal.Title>{isEdit ? 'Edit Destination' : 'Add Destination'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Destination name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paro" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Card summary</Form.Label>
            <Form.Control value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short line on the destinations grid" />
          </Form.Group>

          <ImageUpload label="Card image" value={image} onChange={setImage} className="mb-3" />

          <hr />

          <Form.Group className="mb-3">
            <Form.Label>Tagline</Form.Label>
            <Form.Control value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Hero subtitle on the detail page" />
          </Form.Group>

          <ImageUpload label="Hero image" value={heroImage} onChange={setHeroImage} className="mb-3" />

          <Row className="g-2 mb-3">
            <Col md={6}>
              <Form.Label>Altitude</Form.Label>
              <Form.Control value={altitude} onChange={(e) => setAltitude(e.target.value)} placeholder="2,200 m" />
            </Col>
            <Col md={6}>
              <Form.Label>Best time to visit</Form.Label>
              <Form.Control value={bestTime} onChange={(e) => setBestTime(e.target.value)} placeholder="Mar–May & Sep–Nov" />
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Overview</Form.Label>
            <Form.Control as="textarea" rows={4} value={overview} onChange={(e) => setOverview(e.target.value)} />
          </Form.Group>

          <p className="text-muted small mt-3 mb-0">
            Add popular places under <strong>Popular Places</strong> in the sidebar.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>Cancel</Button>
          <Button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create destination'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default DestinationFormModal
