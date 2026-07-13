'use client'

import { useEffect, useRef, useState } from 'react'
import { Form, Button, Spinner, Badge } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

function fileLabel(path) {
  if (!path) return ''
  return path.split('/').pop() || path
}

function ImageUpload({
  label,
  value,
  onChange,
  compact = false,
  className = '',
  multiple = false,
  onMultipleUpload,
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const [error, setError] = useState('')
  const [previewError, setPreviewError] = useState(false)

  useEffect(() => {
    setPreviewError(false)
  }, [value])

  const handleFile = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')

    try {
      if (multiple && onMultipleUpload) {
        setUploadProgress({ done: 0, total: files.length })
        const uploaded = []
        for (let i = 0; i < files.length; i++) {
          const res = await api.uploadImage(files[i])
          uploaded.push({ url: res.data.url, name: files[i].name })
          setUploadProgress({ done: i + 1, total: files.length })
        }
        onMultipleUpload(uploaded)
      } else {
        const res = await api.uploadImage(files[0])
        onChange(res.data.url)
      }
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      setUploadProgress({ done: 0, total: 0 })
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const previewStyle = compact
    ? { width: '100%', maxHeight: 80, objectFit: 'cover', borderRadius: 6 }
    : { width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8 }

  const previewUrl = value ? resolveImageUrl(value) : ''
  const hasValue = Boolean(value?.trim())

  return (
    <Form.Group className={className}>
      {label ? <Form.Label>{label}</Form.Label> : null}

      {hasValue && !previewError && previewUrl ? (
        <img
          src={previewUrl}
          alt=""
          style={previewStyle}
          onError={() => setPreviewError(true)}
        />
      ) : null}

      {hasValue && (previewError || !previewUrl) ? (
        <div
          className="border rounded d-flex flex-column align-items-start gap-2 p-3 bg-light"
          style={compact ? { fontSize: '0.85rem' } : undefined}
        >
          <Badge bg="success">Uploaded</Badge>
          <span className="text-muted small mb-0">{fileLabel(value)}</span>
          <span className="text-muted small mb-0">Save changes to keep this image on the site.</span>
        </div>
      ) : null}

      {!hasValue ? (
        <div className="border rounded text-muted small p-3 bg-light">No image uploaded yet</div>
      ) : null}

      <div className={`d-flex flex-column gap-2 ${label || hasValue ? 'mt-2' : ''}`}>
        <Form.Control
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple={multiple}
          onChange={handleFile}
          disabled={uploading}
          size={compact ? 'sm' : undefined}
        />
        {uploading ? (
          <span className="text-muted small d-inline-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            {uploadProgress.total > 1
              ? `Uploading ${uploadProgress.done}/${uploadProgress.total}…`
              : 'Uploading…'}
          </span>
        ) : (
          <span className="text-muted small">
            {multiple ? 'Select one or more images · JPEG/PNG · max 5 MB each' : 'JPEG, JPG, or PNG · max 5 MB'}
          </span>
        )}
        {hasValue && !multiple ? (
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
