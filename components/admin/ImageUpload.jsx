'use client'

import { useRef, useState } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

function ImageUpload({ label, value, onChange, compact = false, className = '' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await api.uploadImage(file)
      onChange(res.data.url)
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const previewStyle = compact
    ? { width: '100%', maxHeight: 80, objectFit: 'cover', borderRadius: 6 }
    : { width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, marginTop: 8 }

  return (
    <Form.Group className={className}>
      {label ? <Form.Label>{label}</Form.Label> : null}
      {value ? (
        <img
          src={resolveImageUrl(value)}
          alt=""
          style={previewStyle}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
      <div className={`d-flex ${compact ? 'flex-column gap-1' : 'flex-column gap-2'} ${label || value ? 'mt-2' : ''}`}>
        <Form.Control
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleFile}
          disabled={uploading}
          size={compact ? 'sm' : undefined}
        />
        {uploading ? (
          <span className="text-muted small d-inline-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" /> Uploading…
          </span>
        ) : (
          <span className="text-muted small">JPEG, JPG, or PNG · max 5 MB</span>
        )}
        {value ? (
          <Button
            size="sm"
            variant="outline-danger"
            type="button"
            onClick={() => onChange('')}
            disabled={uploading}
            style={compact ? { alignSelf: 'flex-start' } : undefined}
          >
            Remove image
          </Button>
        ) : null}
      </div>
      {error ? <div className="text-danger small mt-1">{error}</div> : null}
    </Form.Group>
  )
}

export default ImageUpload
