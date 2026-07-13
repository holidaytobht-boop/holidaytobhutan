'use client'

import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminTableCard from '@/components/admin/ui/AdminTableCard'
import { api } from '@/lib/api/client'

function StatCard({ label, value, hint }) {
  return (
    <Card className="admin-stat h-100">
      <Card.Body>
        <div className="admin-stat__label">{label}</div>
        <div className="admin-stat__value">{value}</div>
        {hint && <div className="admin-stat__hint">{hint}</div>}
      </Card.Body>
    </Card>
  )
}

function Dashboard() {
  const [tours, setTours] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([api.getTours(), api.getInquiries(), api.getBookings()])
      .then(([toursRes, inqRes, bookingsRes]) => {
        if (!active) return
        setTours(toursRes.data || [])
        setInquiries(inqRes.data || [])
        setBookings(bookingsRes.data || [])
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const totalPackages = tours.reduce((sum, t) => sum + (t.packages?.length || 0), 0)
  const contactInquiries = inquiries.filter((q) => q.source !== 'plan-my-trip')
  const recentInquiries = [...contactInquiries].reverse().slice(0, 5)
  const recentBookings = [...bookings].slice(0, 5)

  return (
    <Layout title="Dashboard">
      {error ? <Alert variant="danger" className="admin-alert mb-0">Could not reach the API: {error}</Alert> : null}
      {loading ? (
        <AdminLoading />
      ) : (
        <>
          <Row className="g-4">
            <Col sm={6} lg={3}>
              <StatCard label="Tour Categories" value={tours.length} hint="Live on the website" />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard label="Total Packages" value={totalPackages} hint="Across all categories" />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard label="Inquiries" value={contactInquiries.length} hint="Contact form submissions" />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard label="Trip Bookings" value={bookings.length} hint="Plan My Trip requests" />
            </Col>
          </Row>

          <AdminTableCard
            title="Recent Trip Bookings"
            emptyMessage="No trip bookings yet. Submissions from Plan My Trip will appear here."
          >
            {recentBookings.length > 0 ? (
              <div className="admin-table-wrap">
                <Table responsive hover className="m-0 align-middle">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Trip</th>
                      <th>Status</th>
                      <th>Booked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="fw-semibold">{b.name}</div>
                          <div className="text-muted small">{b.email}</div>
                        </td>
                        <td>
                          {b.tripTitle ? (
                            <div className="small fw-semibold">{b.tripTitle}</div>
                          ) : b.travelInterest ? (
                            <Badge bg="secondary">{b.travelInterest}</Badge>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td><Badge bg={b.status === 'new' ? 'primary' : b.status === 'contacted' ? 'warning' : 'secondary'}>{b.status}</Badge></td>
                        <td className="text-muted small">{new Date(b.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : null}
          </AdminTableCard>

          <AdminTableCard
            title="Recent Inquiries"
            emptyMessage="No inquiries yet. Submissions from the website contact form will appear here."
          >
            {recentInquiries.length > 0 ? (
              <div className="admin-table-wrap">
                <Table responsive hover className="m-0 align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Interest</th>
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((q) => (
                      <tr key={q.id}>
                        <td className="fw-semibold">{q.name}</td>
                        <td>{q.email}</td>
                        <td>{q.interest ? <Badge bg="secondary">{q.interest}</Badge> : <span className="text-muted">—</span>}</td>
                        <td className="text-muted small">{new Date(q.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : null}
          </AdminTableCard>
        </>
      )}
    </Layout>
  )
}

export default Dashboard
