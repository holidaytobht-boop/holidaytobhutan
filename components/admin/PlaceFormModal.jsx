'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

function PlaceFormModal({ show, onHide, onSubmit, destinations = [], defaultDestinationSlug = '' }) {
  const [destinationSlug, setDestinationSlug] = useState('')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) return
    setDestinationSlug(defaultDestinationSlug || '')
    setName('')
    setDesc('')
    setImage('')
    setError('')
  }, [show, defaultDestinationSlug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!destinationSlug) {
      setError('Please select a destination.')
      return
    }
    if (!name.trim()) {
      setError('Place name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        destinationSlug,
        name: name.trim(),
        desc: desc.trim(),
        image: image.trim(),
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
          <Modal.Title>Add popular place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Select value={destinationSlug} onChange={(e) => setDestinationSlug(e.target.value)} required>
              <option value="">Choose a destination…</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Place name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tiger's Nest" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Form.Group>

          <ImageUpload label="Place image" value={image} onChange={setImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>Cancel</Button>
          <Button type="submit" className="admin-btn" disabled={saving || destinations.length === 0}>
            {saving ? 'Adding…' : 'Add place'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default PlaceFormModal
