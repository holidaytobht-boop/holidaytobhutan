'use client'

import Link from 'next/link'
import { Container, Button } from 'react-bootstrap'

export default function NotFoundContent({
  title = 'Page not found',
  message = 'The page you are looking for may have moved or no longer exists.',
  backHref = '/',
  backLabel = 'Back to home',
}) {
  return (
    <Container className="not-found-page text-center py-5 reveal reveal--fade-up" style={{ minHeight: '60vh' }}>
      <p className="not-found-page__code eyebrow mb-2">404</p>
      <h1 className="mb-3">{title}</h1>
      <p className="text-muted mb-4">{message}</p>
      <Button as={Link} href={backHref} className="btn-cta">
        {backLabel}
      </Button>
    </Container>
  )
}
