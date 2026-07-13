'use client'

import { useEffect, useState } from 'react'
import { Badge, Alert, Button, Form, InputGroup, Modal, Table } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminTableCard from '@/components/admin/ui/AdminTableCard'
import { api } from '@/lib/api/client'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function InquiryDetailModal({ inquiry, onHide, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  if (!inquiry) return null

  const handleDelete = async () => {
    if (!window.confirm(`Delete inquiry from ${inquiry.name}? This cannot be undone.`)) return
    setDeleting(true)
    setError('')
    try {
      await api.deleteInquiry(inquiry.id)
      onDeleted(inquiry.id)
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={Boolean(inquiry)} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Inquiry — {inquiry.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <p><strong>Email:</strong> {inquiry.email}</p>
        {inquiry.phone ? <p><strong>Phone:</strong> {inquiry.phone}</p> : null}
        {inquiry.interest ? (
          <p>
            <strong>Interest:</strong> <Badge bg="secondary">{inquiry.interest}</Badge>
          </p>
        ) : null}
        <p><strong>Status:</strong> {inquiry.status || 'new'}</p>
        <p><strong>Received:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
        <p className="mb-0"><strong>Message:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [exporting, setExporting] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .getInquiries()
      .then((res) => setInquiries(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (item, status) => {
    if (status === item.status) return
    setUpdatingId(item.id)
    setError('')
    try {
      const res = await api.updateInquiry(item.id, { status })
      setInquiries((prev) => prev.map((entry) => (entry.id === item.id ? res.data : entry)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      const blob = await api.exportInquiries()
      downloadBlob(blob, 'inquiries.csv')
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  const filtered = [...inquiries]
    .reverse()
    .filter((q) => q.source !== 'plan-my-trip')
    .filter((q) => {
      const text = `${q.name} ${q.email} ${q.interest || ''} ${q.message} ${q.status || ''}`.toLowerCase()
      return text.includes(query.toLowerCase())
    })

  return (
    <Layout title="Inquiries">
      <AdminPageToolbar
        actions={
          <>
            <Button variant="outline-secondary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exporting…' : 'Export CSV'}
            </Button>
            <Button variant="outline-secondary" onClick={load}>
              Refresh
            </Button>
          </>
        }
      >
        <p className="text-muted mb-2 mb-md-0">
          View, update status, and manage contact form submissions. Plan My Trip requests are under Trip Bookings.
        </p>
        <InputGroup className="admin-search">
          <Form.Control
            placeholder="Search inquiries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </AdminPageToolbar>

      {error ? <Alert variant="danger" className="admin-alert mb-0">Could not complete action: {error}</Alert> : null}

      {loading ? (
        <AdminLoading />
      ) : (
        <AdminTableCard title="All Inquiries" emptyMessage="No inquiries found.">
          {filtered.length > 0 ? (
            <div className="admin-table-wrap">
              <Table responsive hover className="m-0 align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr key={q.id}>
                      <td className="fw-semibold">{q.name}</td>
                      <td>
                        <div>{q.email}</div>
                        {q.phone && <div className="text-muted small">{q.phone}</div>}
                      </td>
                      <td>
                        {q.interest ? <Badge bg="secondary">{q.interest}</Badge> : <span className="text-muted">—</span>}
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <Form.Select
                          size="sm"
                          value={q.status || 'new'}
                          disabled={updatingId === q.id}
                          onChange={(e) => handleStatusChange(q, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td className="text-muted small">{new Date(q.createdAt).toLocaleString()}</td>
                      <td className="text-end">
                        <Button variant="outline-primary" size="sm" onClick={() => setViewing(q)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : null}
        </AdminTableCard>
      )}

      <InquiryDetailModal
        inquiry={viewing}
        onHide={() => setViewing(null)}
        onDeleted={(id) => setInquiries((prev) => prev.filter((item) => item.id !== id))}
      />
    </Layout>
  )
}

export default Inquiries
