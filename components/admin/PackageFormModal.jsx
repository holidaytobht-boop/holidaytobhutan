'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

function PackageFormModal({ show, onHide, onSubmit, tours = [], defaultTourSlug = '' }) {
  const [tourSlug, setTourSlug] = useState('')
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [image, setImage] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [durationDays, setDurationDays] = useState('')
  const [fromPriceUsd, setFromPriceUsd] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) return
    setTourSlug(defaultTourSlug || '')
    setName('')
    setSummary('')
    setImage('')
    setHeroImage('')
    setDurationDays('')
    setFromPriceUsd('')
    setError('')
  }, [show, defaultTourSlug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tourSlug) {
      setError('Please select a tour category.')
      return
    }
    if (!name.trim()) {
      setError('Package name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        tourSlug,
        name: name.trim(),
        summary: summary.trim(),
        image: image.trim(),
        heroImage: heroImage.trim(),
        durationDays: Number(durationDays) || 0,
        fromPriceUsd: Number(fromPriceUsd) || 0,
      })
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add tour package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          <Form.Group className="mb-3" controlId="pkgTour">
            <Form.Label>Tour category</Form.Label>
            <Form.Select value={tourSlug} onChange={(e) => setTourSlug(e.target.value)} required>
              <option value="">Choose a tour…</option>
              {tours.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
            {tours.length === 0 && (
              <Form.Text className="text-muted">Create a tour category first using “Add tour”.</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="pkgName">
            <Form.Label>Package name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Glimpses of Bhutan"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pkgSummary">
            <Form.Label>Card summary</Form.Label>
            <Form.Control
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short text shown on the tour category page"
            />
          </Form.Group>

          <ImageUpload label="Card image" value={image} onChange={setImage} className="mb-3" />
          <ImageUpload label="Hero image (detail page banner)" value={heroImage} onChange={setHeroImage} className="mb-3" />

          <Row className="g-2">
            <Col xs={6}>
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="5"
              />
            </Col>
            <Col xs={6}>
              <Form.Label>From price (USD)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={fromPriceUsd}
                onChange={(e) => setFromPriceUsd(e.target.value)}
                placeholder="1050"
              />
            </Col>
          </Row>

          <p className="text-muted small mt-3 mb-0">
            After saving, use “Edit package details” to add overview, highlights &amp; itinerary.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="admin-btn" disabled={saving || tours.length === 0}>
            {saving ? 'Adding…' : 'Add package'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default PackageFormModal
