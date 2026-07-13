'use client'

import { useEffect, useState } from 'react'
import { Badge, Alert, Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminTableCard from '@/components/admin/ui/AdminTableCard'
import { api } from '@/lib/api/client'
import {
  AIR_TICKET_CLASSES,
  HOTEL_OPTIONS,
  TRAVEL_INTEREST_OPTIONS,
  TRAVEL_ROUTES,
} from '@/lib/constants/plannerOptions'
import { buildTourTitles, getStaticTourTitles } from '@/lib/utils/tourOptions'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

const emptyForm = () => ({
  name: '',
  email: '',
  whatsapp: '',
  tripTitle: '',
  travelDate: '',
  tripDuration: '',
  adults: '',
  children: '',
  travelers: '',
  nationality: '',
  travelRoute: '',
  airTicketClass: '',
  hotelAccommodation: '',
  travelInterests: [],
  message: '',
})

function isLegacyBooking(booking = {}) {
  return Boolean(booking.personal || booking.travel || booking.passport || booking.preferences)
}

function bookingToForm(item) {
  const base = emptyForm()
  const booking = item?.booking || {}

  if (isLegacyBooking(booking)) {
    const personal = booking.personal || {}
    const travel = booking.travel || {}
    return {
      ...base,
      name: personal.fullName || item?.name || '',
      email: personal.email || item?.email || '',
      whatsapp: personal.phone || item?.phone || '',
      nationality: personal.nationality || '',
      tripTitle: travel.tripType || '',
      travelDate: travel.travelDateStart || '',
      tripDuration: travel.duration || '',
      travelers: travel.travelers || '',
    }
  }

  return {
    ...base,
    ...booking,
    name: booking.name || item?.name || '',
    email: booking.email || item?.email || '',
    whatsapp: booking.whatsapp || item?.phone || '',
    travelInterests: Array.isArray(booking.travelInterests)
      ? booking.travelInterests
      : booking.travelInterest
        ? [booking.travelInterest]
        : [],
  }
}

function BookingEditModal({ booking, tourTitles, onHide, onSaved, onDeleted }) {
  const [status, setStatus] = useState('new')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!booking) return
    setStatus(booking.status || 'new')
    setForm(bookingToForm(booking))
    setError('')
  }, [booking])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTravelInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      travelInterests: prev.travelInterests.includes(interest)
        ? prev.travelInterests.filter((item) => item !== interest)
        : [...prev.travelInterests, interest],
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await api.updateBooking(booking.id, { status, booking: form })
      onSaved(res.data)
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete booking for ${booking.name}? This cannot be undone.`)) return
    setDeleting(true)
    setError('')
    try {
      await api.deleteBooking(booking.id)
      onDeleted(booking.id)
      onHide()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (!booking) return null

  return (
    <Modal show={Boolean(booking)} onHide={onHide} size="lg" centered className="booking-modal">
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking — {booking.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="booking-modal__body">
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <h6 className="text-uppercase text-muted small mb-2">Contact Details</h6>
          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Label>Name *</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label>WhatsApp No.</Form.Label>
              <Form.Control
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Nationality</Form.Label>
              <Form.Control
                value={form.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
              />
            </Col>
          </Row>

          <h6 className="text-uppercase text-muted small mb-2">Trip Details</h6>
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <Form.Label>Trip Title</Form.Label>
              <Form.Select
                value={form.tripTitle}
                onChange={(e) => updateField('tripTitle', e.target.value)}
              >
                <option value="">Select a tour</option>
                {tourTitles.map((tour) => (
                  <option key={tour} value={tour}>
                    {tour}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Travel Date</Form.Label>
              <Form.Control
                type="date"
                value={form.travelDate}
                onChange={(e) => updateField('travelDate', e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Trip Duration</Form.Label>
              <Form.Control
                value={form.tripDuration}
                onChange={(e) => updateField('tripDuration', e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Adults</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={form.adults}
                onChange={(e) => updateField('adults', e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Children</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={form.children}
                onChange={(e) => updateField('children', e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Travellers</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.travelers}
                onChange={(e) => updateField('travelers', e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Travel Route</Form.Label>
              <Form.Select
                value={form.travelRoute}
                onChange={(e) => updateField('travelRoute', e.target.value)}
              >
                <option value="">Select</option>
                {TRAVEL_ROUTES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Air Ticket Class</Form.Label>
              <Form.Select
                value={form.airTicketClass}
                onChange={(e) => updateField('airTicketClass', e.target.value)}
              >
                <option value="">Select class</option>
                {AIR_TICKET_CLASSES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Hotel & Accommodations</Form.Label>
              <Form.Select
                value={form.hotelAccommodation}
                onChange={(e) => updateField('hotelAccommodation', e.target.value)}
              >
                <option value="">Select preference</option>
                {HOTEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Label>Travel Interest</Form.Label>
              <div className="planner-interests">
                {TRAVEL_INTEREST_OPTIONS.map((interest, index) => (
                  <Form.Check
                    key={interest}
                    type="checkbox"
                    id={`admin-travel-interest-${index}`}
                    label={interest}
                    checked={form.travelInterests.includes(interest)}
                    onChange={() => toggleTravelInterest(interest)}
                    className="planner-interest-check"
                  />
                ))}
              </div>
            </Col>
            <Col xs={12}>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
              />
            </Col>
          </Row>

          <p className="text-muted small mt-4 mb-0">
            Submitted {new Date(booking.createdAt).toLocaleString()}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleDelete} disabled={saving || deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
          <Button variant="secondary" onClick={onHide} disabled={saving || deleting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || deleting}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

function TripBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [tourTitles, setTourTitles] = useState(getStaticTourTitles)

  const load = () => {
    setLoading(true)
    api
      .getBookings()
      .then((res) => setBookings(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    let active = true
    api
      .getTours()
      .then((res) => {
        if (!active) return
        const tours = Array.isArray(res?.data) ? res.data : []
        setTourTitles(buildTourTitles(tours))
      })
      .catch(() => {
        if (active) setTourTitles(getStaticTourTitles())
      })

    return () => {
      active = false
    }
  }, [])

  const replaceBooking = (updated) => {
    setBookings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }

  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((item) => item.id !== id))
  }

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      const blob = await api.exportBookings()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'trip-bookings.csv'
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  const handleStatusChange = async (item, status) => {
    if (status === item.status) return
    setUpdatingId(item.id)
    setError('')
    try {
      const res = await api.updateBooking(item.id, { status })
      replaceBooking(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = bookings.filter((item) => {
    const text = [
      item.name,
      item.email,
      item.phone,
      item.tripTitle,
      ...(Array.isArray(item.travelInterests) ? item.travelInterests : []),
      item.travelInterest,
      item.travelers,
      item.nationality,
      item.travelDate,
      item.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return text.includes(query.toLowerCase())
  })

  return (
    <Layout title="Trip Bookings">
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
          View, edit, and update the status of clients who booked through Plan My Trip.
        </p>
        <InputGroup className="admin-search">
          <Form.Control
            placeholder="Search by name, email, trip title, status…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </AdminPageToolbar>

      {error ? (
        <Alert variant="danger" className="admin-alert mb-0">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <AdminLoading />
      ) : (
        <AdminTableCard title="All Trip Bookings" emptyMessage="No trip bookings yet.">
          {filtered.length > 0 ? (
            <div className="admin-table-wrap">
              <Table responsive hover className="m-0 align-middle">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Trip</th>
                    <th>Travel Date</th>
                    <th>Status</th>
                    <th>Booked</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">{item.email}</div>
                        {item.phone ? <div className="text-muted small">{item.phone}</div> : null}
                      </td>
                      <td>
                        {item.tripTitle ? (
                          <div className="fw-semibold small">{item.tripTitle}</div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                        {item.travelInterests?.length ? (
                          <div className="text-muted small mt-1">
                            {item.travelInterests.length} interest(s) selected
                          </div>
                        ) : item.travelInterest ? (
                          <Badge bg="secondary" className="mt-1">
                            {item.travelInterest}
                          </Badge>
                        ) : null}
                        {item.travelers ? (
                          <div className="text-muted small mt-1">{item.travelers} traveller(s)</div>
                        ) : null}
                      </td>
                      <td className="small">{item.travelDate || '—'}</td>
                      <td style={{ minWidth: '140px' }}>
                        <Form.Select
                          size="sm"
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusChange(item, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td className="text-muted small">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="text-end">
                        <Button variant="outline-primary" size="sm" onClick={() => setEditing(item)}>
                          Edit
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

      <BookingEditModal
        booking={editing}
        tourTitles={tourTitles}
        onHide={() => setEditing(null)}
        onSaved={replaceBooking}
        onDeleted={removeBooking}
      />
    </Layout>
  )
}

export default TripBookings
