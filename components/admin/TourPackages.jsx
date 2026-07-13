'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Row, Col, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import PackageFormModal from '@/components/admin/PackageFormModal'
import PackageDetailModal from '@/components/admin/PackageDetailModal'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import AdminFilterPanel from '@/components/admin/ui/AdminFilterPanel'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80'

const detailScore = (pkg) => {
  let score = 0
  if (pkg.overview?.trim()) score += 1
  if (pkg.highlights?.length) score += 1
  if (pkg.itinerary?.length) score += 1
  return score
}

function TourPackages() {
  const router = useRouter()
  const pathname = usePathname()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [query, setQuery] = useState('')
  const [tourFilter, setTourFilter] = useState('all')
  const [pkgModal, setPkgModal] = useState({ show: false, tour: null, pkg: null })
  const [showPackageModal, setShowPackageModal] = useState(false)

  const selectedTour = tours.find((t) => t.slug === tourFilter) || null

  const load = () => {
    setLoading(true)
    return api
      .getTours()
      .then((res) => setTours(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const params = new URLSearchParams(window.location.search)
    const tour = params.get('tour')
    if (tour) setTourFilter(tour)
  }, [])

  const updateQueryParam = (slug) => {
    const params = new URLSearchParams(window.location.search)
    if (slug === 'all') params.delete('tour')
    else params.set('tour', slug)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const allPackages = useMemo(
    () =>
      tours.flatMap((tour) =>
        (tour.packages || []).map((pkg) => ({
          ...pkg,
          tourName: tour.name,
          tourSlug: tour.slug,
          tourImage: tour.image,
        }))
      ),
    [tours]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allPackages.filter((pkg) => {
      if (tourFilter !== 'all' && pkg.tourSlug !== tourFilter) return false
      if (!q) return true
      return (
        pkg.name.toLowerCase().includes(q) ||
        pkg.tourName.toLowerCase().includes(q) ||
        (pkg.tagline || '').toLowerCase().includes(q)
      )
    })
  }, [allPackages, tourFilter, query])

  const setFilter = (slug) => {
    setTourFilter(slug)
    updateQueryParam(slug)
  }

  const openEdit = (pkg) => {
    const tour = tours.find((t) => t.slug === pkg.tourSlug)
    setPkgModal({ show: true, tour, pkg })
  }

  const closeModal = () => setPkgModal((s) => ({ ...s, show: false }))

  const handleSave = async (updatedPkg) => {
    const { tour } = pkgModal
    if (!tour) return
    setActionError('')
    const packages = (tour.packages || []).map((p) => (p.slug === updatedPkg.slug ? updatedPkg : p))
    await api.updateTour(tour.slug, { packages })
    load()
  }

  const openAddPackage = () => {
    if (tours.length === 0) {
      setActionError('Create a tour category under Tours first, then add packages here.')
      return
    }
    setShowPackageModal(true)
  }

  const handleAddPackage = async (data) => {
    setActionError('')
    const tour = tours.find((t) => t.slug === data.tourSlug)
    if (!tour) throw new Error('Selected tour not found.')

    const newPkg = {
      name: data.name,
      summary: data.summary,
      image: data.image,
      heroImage: data.heroImage,
      durationDays: data.durationDays,
      fromPriceUsd: data.fromPriceUsd,
    }

    const packages = [...(tour.packages || []), newPkg]
    const res = await api.updateTour(tour.slug, { packages })
    const saved = res?.data?.packages?.find((p) => p.name === data.name)
    const updatedTour = res?.data || tour

    setFilter(tour.slug)
    await load()

    if (saved) {
      setPkgModal({ show: true, tour: updatedTour, pkg: saved })
    }
  }

  return (
    <Layout title="Tour Packages">
      <AdminPageToolbar
        actions={
          <>
            <Badge bg="light" text="dark" className="pkg-toolbar__count">
              {filtered.length} of {allPackages.length} packages
            </Badge>
            <Button variant="outline-secondary" onClick={openAddPackage} disabled={tours.length === 0}>
              + Add package
            </Button>
          </>
        }
      >
        <p className="text-muted mb-0">
          Edit package pages — overview, highlights &amp; itinerary. Tour categories are managed under{' '}
          <Link href="/admin/tours" className="admin-link">
            Tours
          </Link>
          .
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error ? `Could not load packages: ${error}` : actionError} />

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
              placeholder="Search packages or tour categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        }
      >
        <div className="pkg-filter-pills">
          <button
            type="button"
            className={`pkg-pill ${tourFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All tours
          </button>
          {tours.map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`pkg-pill ${tourFilter === t.slug ? 'is-active' : ''}`}
              onClick={() => setFilter(t.slug)}
            >
              {t.name.replace(' Tours', '')}
              <span className="pkg-pill__count">{t.packages?.length || 0}</span>
            </button>
          ))}
        </div>
      </AdminFilterPanel>

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          title="No packages found"
          description={
            allPackages.length === 0
              ? tours.length === 0
                ? 'Create tour categories under Tours, then add packages here.'
                : 'No packages yet. Add your first package to a tour category.'
              : 'Try a different search or filter.'
          }
        >
          {allPackages.length === 0 && tours.length > 0 ? (
            <Button className="admin-btn" onClick={openAddPackage}>
              + Add package
            </Button>
          ) : null}
          {tours.length === 0 ? (
            <Button as={Link} href="/admin/tours" className="admin-btn">
              Go to Tours
            </Button>
          ) : null}
        </AdminEmptyState>
      ) : (
        <Row className="g-4">
          {filtered.map((pkg) => {
            const score = detailScore(pkg)
            const complete = score === 3
            const img = resolveImageUrl(pkg.heroImage || pkg.image || pkg.tourImage || FALLBACK_IMG)

            return (
              <Col xs={12} sm={6} lg={4} key={`${pkg.tourSlug}-${pkg.slug}`}>
                <article className="pkg-card h-100">
                  <div className="pkg-card__img" style={{ backgroundImage: `url(${img})` }}>
                    <Badge
                      bg={complete ? 'success' : score > 0 ? 'warning' : 'secondary'}
                      className="pkg-card__status"
                    >
                      {complete ? 'Complete' : score > 0 ? `${score}/3 sections` : 'Not set up'}
                    </Badge>
                  </div>
                  <div className="pkg-card__body">
                    <Badge bg="light" text="dark" className="pkg-card__tour">
                      {pkg.tourName}
                    </Badge>
                    <h3 className="pkg-card__title">{pkg.name}</h3>
                    <p className="pkg-card__meta">
                      {pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : 'Duration TBD')}
                      {pkg.fromPriceUsd ? ` · From $${Number(pkg.fromPriceUsd).toLocaleString()}` : ''}
                    </p>

                    <ul className="pkg-card__checks">
                      <li className={pkg.overview?.trim() ? 'is-done' : ''}>Overview</li>
                      <li className={pkg.highlights?.length ? 'is-done' : ''}>Highlights</li>
                      <li className={pkg.itinerary?.length ? 'is-done' : ''}>Itinerary</li>
                    </ul>

                    <Button className="admin-btn w-100" onClick={() => openEdit(pkg)}>
                      Edit package details
                    </Button>
                  </div>
                </article>
              </Col>
            )
          })}
        </Row>
      )}

      <PackageDetailModal
        show={pkgModal.show}
        onHide={closeModal}
        onSubmit={handleSave}
        pkg={pkgModal.pkg}
        tourName={pkgModal.tour?.name}
      />

      <PackageFormModal
        show={showPackageModal}
        onHide={() => setShowPackageModal(false)}
        onSubmit={handleAddPackage}
        tours={tours}
        defaultTourSlug={tourFilter !== 'all' ? tourFilter : ''}
      />
    </Layout>
  )
}

export default TourPackages
