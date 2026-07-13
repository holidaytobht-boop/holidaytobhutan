'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Row, Col, Badge, Button } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import DestinationFormModal from '@/components/admin/DestinationFormModal'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'

function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    return api
      .getDestinations()
      .then((res) => setDestinations(res.data || []))
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

  const openEdit = (dest) => {
    setEditing(dest)
    setShowModal(true)
  }

  const handleSubmit = async (data) => {
    setActionError('')
    if (editing) {
      await api.updateDestination(editing.slug, data)
    } else {
      await api.createDestination(data)
    }
    load()
  }

  const handleDelete = async (dest) => {
    if (!window.confirm(`Delete "${dest.name}" and all its places? This cannot be undone.`)) return
    setActionError('')
    try {
      await api.deleteDestination(dest.slug)
      load()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <Layout title="Destinations">
      <AdminPageToolbar
        actions={
          <Button className="admin-btn" onClick={openAdd}>
            + Add destination
          </Button>
        }
      >
        <p className="text-muted mb-0">
          Manage destination regions shown on the website.{' '}
          <Link href="/admin/destination-places" className="admin-link">
            Edit popular places →
          </Link>
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error ? `Could not load destinations: ${error}` : actionError} />

      {loading ? (
        <AdminLoading />
      ) : destinations.length === 0 ? (
        <AdminEmptyState
          title="No destinations yet"
          description="Create your first destination region for the website."
        >
          <Button className="admin-btn" onClick={openAdd}>+ Add destination</Button>
        </AdminEmptyState>
      ) : (
        <Row className="g-4">
          {destinations.map((dest) => (
            <Col xs={12} sm={6} xl={4} key={dest.slug}>
              <div className="tour-card h-100">
                <div
                  className="tour-card__img"
                  style={{ backgroundImage: `url(${resolveImageUrl(dest.image || dest.heroImage || FALLBACK_IMG)})` }}
                >
                  <Badge bg="dark" className="tour-card__count">
                    {dest.places?.length || 0} places
                  </Badge>
                </div>
                <div className="tour-card__body">
                  <h3 className="tour-card__title">{dest.name}</h3>
                  <p className="tour-card__summary">
                    {dest.summary || <em className="text-muted">No summary</em>}
                  </p>
                  {(dest.altitude || dest.bestTime) && (
                    <p className="text-muted small mb-2">
                      {dest.altitude && <span>{dest.altitude}</span>}
                      {dest.altitude && dest.bestTime && ' · '}
                      {dest.bestTime && <span>{dest.bestTime}</span>}
                    </p>
                  )}
                  {dest.places?.length > 0 && (
                    <ul className="tour-card__pkgs tour-card__pkgs--readonly">
                      {dest.places.slice(0, 3).map((p) => (
                        <li key={p.slug}>
                          <span className="tour-card__pkg-name">{p.name}</span>
                        </li>
                      ))}
                      {dest.places.length > 3 && (
                        <li className="tour-card__pkg-more">+{dest.places.length - 3} more</li>
                      )}
                    </ul>
                  )}
                  <div className="tour-card__actions">
                    <Button size="sm" variant="outline-secondary" onClick={() => openEdit(dest)}>
                      Edit
                    </Button>
                    <Button
                      as={Link}
                      href={`/admin/destination-places?destination=${dest.slug}`}
                      size="sm"
                      variant="outline-primary"
                      className="tour-card__pkg-link"
                    >
                      Places
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(dest)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <DestinationFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </Layout>
  )
}

export default Destinations
