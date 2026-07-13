'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Row, Col, Badge, Button } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import TourFormModal from '@/components/admin/TourFormModal'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80'

function Tours() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .getTours()
      .then((res) => setTours(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (tour) => {
    setEditing(tour)
    setShowModal(true)
  }

  const handleSubmit = async (data) => {
    setActionError('')
    if (editing) {
      await api.updateTour(editing.slug, data)
    } else {
      await api.createTour(data)
    }
    load()
  }

  const handleDelete = async (tour) => {
    if (!window.confirm(`Delete "${tour.name}"? This cannot be undone.`)) return
    setActionError('')
    try {
      await api.deleteTour(tour.slug)
      load()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <Layout title="Tours">
      <AdminPageToolbar
        actions={
          <Button className="admin-btn" onClick={openAdd}>
            + Add Tour
          </Button>
        }
      >
        <p className="text-muted mb-0">
          Manage tour categories, overview &amp; highlights.{' '}
          <Link href="/admin/tour-packages" className="admin-link">
            Edit package details →
          </Link>
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error ? `Could not load tours: ${error}` : actionError} />

      {loading ? (
        <AdminLoading />
      ) : tours.length === 0 ? (
        <AdminEmptyState
          title="No tours yet"
          description="Create your first tour category to organize packages on the website."
        >
          <Button className="admin-btn" onClick={openAdd}>+ Add Tour</Button>
        </AdminEmptyState>
      ) : (
        <Row className="g-4">
          {tours.map((tour) => (
            <Col xs={12} sm={6} xl={4} key={tour.slug}>
              <div className="tour-card h-100">
                <div
                  className="tour-card__img"
                  style={{ backgroundImage: `url(${resolveImageUrl(tour.image || FALLBACK_IMG)})` }}
                >
                  <Badge bg="dark" className="tour-card__count">
                    {tour.packages?.length || 0} packages
                  </Badge>
                </div>
                <div className="tour-card__body">
                  <h3 className="tour-card__title">{tour.name}</h3>
                  <p className="tour-card__summary">
                    {tour.summary || <em className="text-muted">No summary</em>}
                  </p>
                  {tour.packages?.length > 0 && (
                    <ul className="tour-card__pkgs tour-card__pkgs--readonly">
                      {tour.packages.slice(0, 3).map((p) => (
                        <li key={p.slug}>
                          <span className="tour-card__pkg-name">{p.name}</span>
                          <span className="tour-card__pkg-meta">
                            {p.durationDays ? `${p.durationDays}d` : '—'}
                          </span>
                        </li>
                      ))}
                      {tour.packages.length > 3 && (
                        <li className="tour-card__pkg-more">+{tour.packages.length - 3} more</li>
                      )}
                    </ul>
                  )}
                  <div className="tour-card__actions">
                    <Button size="sm" variant="outline-secondary" onClick={() => openEdit(tour)}>
                      Edit tour
                    </Button>
                    <Button
                      as={Link}
                      href={`/admin/tour-packages?tour=${tour.slug}`}
                      size="sm"
                      variant="outline-primary"
                      className="tour-card__pkg-link"
                    >
                      Packages
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(tour)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <TourFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </Layout>
  )
}

export default Tours
