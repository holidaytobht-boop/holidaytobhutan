'use client'

import { Spinner } from 'react-bootstrap'

export default function PageLoading({ label = 'Loading…', minHeight = '60vh', variant }) {
  return (
    <div className="page-loading text-center py-5" style={{ minHeight }} role="status" aria-live="polite">
      <Spinner animation="border" role="status" variant={variant} className="mt-5" />
      <span className="visually-hidden">{label}</span>
      <p
        className={`page-loading__text mt-3 mb-0 ${variant === 'light' ? 'text-white-50' : 'text-muted'}`}
        aria-hidden="true"
      >
        {label}
      </p>
    </div>
  )
}
