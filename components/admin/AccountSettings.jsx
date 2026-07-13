'use client'

import { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEditorCard from '@/components/admin/ui/AdminEditorCard'
import { api } from '@/lib/api/client'
import { setCachedUser } from '@/lib/auth'

function AccountSettings() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .getAdminAccount()
      .then((res) => {
        const email = res?.data?.email || ''
        setCurrentEmail(email)
        setNewEmail(email)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.updateAdminAccount({
        currentPassword,
        newEmail: newEmail.trim(),
        newPassword,
        confirmPassword,
      })
      const email = res?.data?.email || newEmail.trim()
      setCurrentEmail(email)
      setNewEmail(email)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setCachedUser({ email })
      setSuccess(res?.message || 'Login credentials updated successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Account">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Account">
      <AdminPageToolbar
        actions={
          <Button className="admin-btn" type="submit" form="account-settings-form" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      >
        <p className="text-muted mb-0">
          Update the email and password used to sign in to the admin dashboard.
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error} success={success} />

      <AdminEditorCard title="Login credentials">
        <Form id="account-settings-form" onSubmit={handleSubmit}>
          <p className="text-muted small mb-4">
            Signed in as <strong>{currentEmail}</strong>. Enter your current password to confirm any changes.
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Current password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <hr className="my-4" />

          <Form.Group className="mb-3">
            <Form.Label>New email</Form.Label>
            <Form.Control
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="12+ chars with upper, lower, number, symbol"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <Form.Text className="text-muted">
              Use at least 8 characters in development and 12 in production, including upper and lower case letters, a number, and a symbol.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Form.Group>
        </Form>
      </AdminEditorCard>
    </Layout>
  )
}

export default AccountSettings
