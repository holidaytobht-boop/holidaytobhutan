'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { login } from '@/lib/auth'

function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await login(email.trim(), password)
      router.replace('/admin')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <Card className="admin-login__card shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <div className="admin-login__brand mb-4">
            <img
              src="/images/black-logo.svg"
              alt="Holiday to Bhutan"
              className="admin-login__logo"
              decoding="async"
            />
            <div className="text-muted small mt-2">Admin Console</div>
          </div>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Form.Group>
            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </Form.Group>
            <Button type="submit" className="w-100 admin-btn" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
