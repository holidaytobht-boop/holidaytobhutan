'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Row, Col, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import PlaceFormModal from '@/components/admin/PlaceFormModal'
import PlaceDetailModal from '@/components/admin/PlaceDetailModal'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import AdminFilterPanel from '@/components/admin/ui/AdminFilterPanel'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'

function DestinationPlaces() {
  const router = useRouter()
  const pathname = usePathname()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [query, setQuery] = useState('')
  const [destFilter, setDestFilter] = useState('all')
  const [placeModal, setPlaceModal] = useState({ show: false, destination: null, place: null })
  const [showPlaceForm, setShowPlaceForm] = useState(false)

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
    const params = new URLSearchParams(window.location.search)
    const dest = params.get('destination')
    if (dest) setDestFilter(dest)
  }, [])

  const updateQueryParam = (slug) => {
    const params = new URLSearchParams(window.location.search)
    if (slug === 'all') params.delete('destination')
    else params.set('destination', slug)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const allPlaces = useMemo(
    () =>
      destinations.flatMap((dest) =>
        (dest.places || []).map((place) => ({
          ...place,
          destinationName: dest.name,
          destinationSlug: dest.slug,
          destinationImage: dest.image,
        }))
      ),
    [destinations]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allPlaces.filter((place) => {
      if (destFilter !== 'all' && place.destinationSlug !== destFilter) return false
      if (!q) return true
      return (
        place.name.toLowerCase().includes(q) ||
        place.destinationName.toLowerCase().includes(q) ||
        (place.desc || '').toLowerCase().includes(q)
      )
    })
  }, [allPlaces, destFilter, query])

  const setFilter = (slug) => {
    setDestFilter(slug)
    updateQueryParam(slug)
  }

  const openEdit = (place) => {
    const destination = destinations.find((d) => d.slug === place.destinationSlug)
    setPlaceModal({ show: true, destination, place })
  }

  const handleSavePlace = async (updated) => {
    const { destination } = placeModal
    if (!destination) return
    setActionError('')
    const places = (destination.places || []).map((p) => (p.slug === updated.slug ? updated : p))
    await api.updateDestination(destination.slug, { places })
    load()
  }

  const handleDeletePlace = async (place) => {
    const destination = destinations.find((d) => d.slug === place.destinationSlug)
    if (!destination) return
    if (!window.confirm(`Delete "${place.name}"?`)) return
    setActionError('')
    try {
      const places = (destination.places || []).filter((p) => p.slug !== place.slug)
      await api.updateDestination(destination.slug, { places })
      load()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleAddPlace = async (data) => {
    setActionError('')
    const dest = destinations.find((d) => d.slug === data.destinationSlug)
    if (!dest) throw new Error('Selected destination not found.')
    const newPlace = { name: data.name, desc: data.desc, image: data.image }
    const places = [...(dest.places || []), newPlace]
    const res = await api.updateDestination(dest.slug, { places })
    const saved = res?.data?.places?.find((p) => p.name === data.name)
    setFilter(dest.slug)
    await load()
    if (saved) setPlaceModal({ show: true, destination: res.data, place: saved })
  }

  return (
    <Layout title="Popular Places">
      <AdminPageToolbar
        actions={
          <>
            <Badge bg="light" text="dark" className="pkg-toolbar__count">
              {filtered.length} of {allPlaces.length} places
            </Badge>
            <Button
              variant="outline-secondary"
              onClick={() => setShowPlaceForm(true)}
              disabled={destinations.length === 0}
            >
              + Add place
            </Button>
          </>
        }
      >
        <p className="text-muted mb-0">
          Manage popular places on destination detail pages. Destinations are managed under{' '}
          <Link href="/admin/destinations" className="admin-link">
            Destinations
          </Link>
          .
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error ? `Could not load places: ${error}` : actionError} />

      <AdminFilterPanel
        search={
          <InputGroup className="pkg-search">
            <InputGroup.Text>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search places or destinations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        }
      >
        <div className="pkg-filter-pills">
          <button type="button" className={`pkg-pill ${destFilter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
            All destinations
          </button>
          {destinations.map((d) => (
            <button
              key={d.slug}
              type="button"
              className={`pkg-pill ${destFilter === d.slug ? 'is-active' : ''}`}
              onClick={() => setFilter(d.slug)}
            >
              {d.name}
              <span className="pkg-pill__count">{d.places?.length || 0}</span>
            </button>
          ))}
        </div>
      </AdminFilterPanel>

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          title="No places found"
          description={
            allPlaces.length === 0
              ? destinations.length === 0
                ? 'Create destinations under Destinations, then add popular places here.'
                : 'No places yet. Add your first place to a destination.'
              : 'Try a different search or filter.'
          }
        >
          {destinations.length > 0 ? (
            <Button className="admin-btn" onClick={() => setShowPlaceForm(true)}>
              + Add place
            </Button>
          ) : null}
          {destinations.length === 0 ? (
            <Button as={Link} href="/admin/destinations" className="admin-btn">
              Go to Destinations
            </Button>
          ) : null}
        </AdminEmptyState>
      ) : (
        <Row className="g-4">
          {filtered.map((place) => {
            const img = resolveImageUrl(place.image || place.destinationImage || FALLBACK_IMG)
            const hasDetail = Boolean(place.desc?.trim() && place.image?.trim())

            return (
              <Col xs={12} sm={6} lg={4} key={`${place.destinationSlug}-${place.slug}`}>
                <article className="pkg-card h-100">
                  <div className="pkg-card__img" style={{ backgroundImage: `url(${img})` }}>
                    <Badge bg={hasDetail ? 'success' : 'secondary'} className="pkg-card__status">
                      {hasDetail ? 'Complete' : 'Needs details'}
                    </Badge>
                  </div>
                  <div className="pkg-card__body">
                    <Badge bg="light" text="dark" className="pkg-card__tour">
                      {place.destinationName}
                    </Badge>
                    <h3 className="pkg-card__title">{place.name}</h3>
                    <p className="pkg-card__meta text-truncate-2">
                      {place.desc || <em className="text-muted">No description yet</em>}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <Button className="admin-btn flex-grow-1" size="sm" onClick={() => openEdit(place)}>
                        Edit place
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeletePlace(place)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              </Col>
            )
          })}
        </Row>
      )}

      <PlaceDetailModal
        show={placeModal.show}
        onHide={() => setPlaceModal((s) => ({ ...s, show: false }))}
        onSubmit={handleSavePlace}
        place={placeModal.place}
        destinationName={placeModal.destination?.name}
      />

      <PlaceFormModal
        show={showPlaceForm}
        onHide={() => setShowPlaceForm(false)}
        onSubmit={handleAddPlace}
        destinations={destinations}
        defaultDestinationSlug={destFilter !== 'all' ? destFilter : ''}
      />
    </Layout>
  )
}

export default DestinationPlaces
