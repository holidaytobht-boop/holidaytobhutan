'use client'

import { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import ImageUpload from './ImageUpload'

function PlaceDetailModal({ show, onHide, onSubmit, place, destinationName }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show || !place) return
    setName(place.name || '')
    setDesc(place.desc || '')
    setImage(place.image || '')
    setError('')
  }, [show, place])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Place name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({ ...place, name: name.trim(), desc: desc.trim(), image: image.trim() })
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!place) return null

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit place — {place.name}
            {destinationName ? <span className="text-muted fs-6 fw-normal"> · {destinationName}</span> : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Place name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Form.Group>
          <ImageUpload label="Place image" value={image} onChange={setImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} type="button" disabled={saving}>Cancel</Button>
          <Button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save place'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default PlaceDetailModal
