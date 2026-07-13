'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container, Button } from 'react-bootstrap'

export default function SiteError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="error-page text-center py-5" style={{ minHeight: '60vh' }}>
      <p className="eyebrow mb-2">Something went wrong</p>
      <h1 className="mb-3">We hit a snag</h1>
      <p className="text-muted mb-4">
        An unexpected error occurred while loading this page. Please try again, or return to the homepage.
      </p>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <Button className="btn-cta" onClick={() => reset()}>
          Try again
        </Button>
        <Button as={Link} href="/" variant="outline-secondary">
          Back to home
        </Button>
      </div>
    </Container>
  )
}
