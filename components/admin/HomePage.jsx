'use client'

import { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import ImageUpload from '@/components/admin/ImageUpload'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEditorCard from '@/components/admin/ui/AdminEditorCard'
import { api } from '@/lib/api/client'
import { homePageSeed } from '@/lib/seeds/homePage.js'

const emptyPage = () => JSON.parse(JSON.stringify(homePageSeed))

function HomePageAdmin() {
  const [page, setPage] = useState(emptyPage())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [reviewsSource, setReviewsSource] = useState('cms')
  const [reviewsFetchedAt, setReviewsFetchedAt] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .getHomePage()
      .then((res) => {
        const d = res?.data
        const base = emptyPage()
        if (!d) {
          setPage(base)
          return
        }
        setPage({
          ...base,
          ...d,
          photoGallery: {
            ...base.photoGallery,
            ...d.photoGallery,
            photos: d.photoGallery?.photos?.length ? d.photoGallery.photos : base.photoGallery.photos,
          },
          reviews: {
            ...base.reviews,
            ...d.reviews,
            items: d.reviews?.items?.length ? d.reviews.items : base.reviews.items,
          },
        })
        setReviewsSource(d.reviews?.source || 'cms')
        setReviewsFetchedAt(d.reviews?.fetchedAt || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const gallery = page.photoGallery
  const setGallery = (next) => setPage((p) => ({ ...p, photoGallery: next }))
  const reviews = page.reviews
  const setReviews = (next) => setPage((p) => ({ ...p, reviews: next }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateHomePage(page)
      setSuccess('Home page saved. Changes appear on the website homepage.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSyncReviews = async () => {
    setSyncing(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.syncHomePageReviews()
      const syncedReviews = res?.data?.reviews
      if (syncedReviews) {
        setReviews((current) => ({
          ...current,
          googleReviewUrl: syncedReviews.googleReviewUrl || current.googleReviewUrl,
          aggregateRating: syncedReviews.aggregateRating ?? current.aggregateRating,
          totalReviews: syncedReviews.totalReviews ?? current.totalReviews,
          items: syncedReviews.items?.length ? syncedReviews.items : current.items,
        }))
        setReviewsSource(syncedReviews.source || 'google')
        setReviewsFetchedAt(syncedReviews.fetchedAt || '')
      }
      setSuccess(res?.message || 'Live Google reviews synced.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Home Page">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Home Page">
      <AdminPageToolbar
        actions={
          <Button className="admin-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      >
        <p className="text-muted mb-0">
          Manage the Photo Gallery and Traveler Reviews on the homepage. Travel packages, treks and destinations load automatically from Tours and Destinations.
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error} success={success} />

      <AdminEditorCard title="Photo Gallery">
          <Form.Group className="mb-3">
            <Form.Label>Section title</Form.Label>
            <Form.Control value={gallery.title} onChange={(e) => setGallery({ ...gallery, title: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Section subtitle</Form.Label>
            <Form.Control value={gallery.subtitle} onChange={(e) => setGallery({ ...gallery, subtitle: e.target.value })} />
          </Form.Group>

          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Gallery photos</Form.Label>
            <Button
              size="sm"
              variant="outline-secondary"
              type="button"
              onClick={() => setGallery({ ...gallery, photos: [...gallery.photos, { name: '', trip: '', image: '' }] })}
            >
              + Add photo
            </Button>
          </div>

          {gallery.photos.map((photo, i) => (
            <div className="border rounded p-3 mb-3" key={i}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Photo {i + 1}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  type="button"
                  onClick={() => setGallery({ ...gallery, photos: gallery.photos.filter((_, idx) => idx !== i) })}
                  disabled={gallery.photos.length === 1}
                >
                  Remove
                </Button>
              </div>
              <Row className="g-2 mb-2">
                <Col md={6}>
                  <Form.Label className="small">Guest / caption name</Form.Label>
                  <Form.Control
                    value={photo.name}
                    onChange={(e) => {
                      const photos = gallery.photos.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                      setGallery({ ...gallery, photos })
                    }}
                    placeholder="Sarah & Tom"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="small">Trip / location</Form.Label>
                  <Form.Control
                    value={photo.trip}
                    onChange={(e) => {
                      const photos = gallery.photos.map((x, idx) => (idx === i ? { ...x, trip: e.target.value } : x))
                      setGallery({ ...gallery, photos })
                    }}
                    placeholder="Paro · Tiger's Nest"
                  />
                </Col>
              </Row>
              <ImageUpload
                label="Photo"
                value={photo.image}
                onChange={(v) => {
                  const photos = gallery.photos.map((x, idx) => (idx === i ? { ...x, image: v } : x))
                  setGallery({ ...gallery, photos })
                }}
              />
            </div>
          ))}
      </AdminEditorCard>

      <AdminEditorCard title="Traveler Reviews" className="mt-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <p className="text-muted mb-0 small">
            {reviewsSource === 'google'
              ? `Showing live Google reviews${reviewsFetchedAt ? ` (last fetched ${new Date(reviewsFetchedAt).toLocaleString()})` : ''}.`
              : 'Showing manual/demo reviews. Add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to your .env file for live Google reviews.'}
          </p>
          <Button
            size="sm"
            variant="outline-primary"
            type="button"
            onClick={handleSyncReviews}
            disabled={syncing}
          >
            {syncing ? 'Syncing…' : 'Sync from Google'}
          </Button>
        </div>

        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Label>Google review URL</Form.Label>
            <Form.Control
              value={reviews.googleReviewUrl}
              onChange={(e) => setReviews({ ...reviews, googleReviewUrl: e.target.value })}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Aggregate rating</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={reviews.aggregateRating}
              onChange={(e) => setReviews({ ...reviews, aggregateRating: Number(e.target.value) })}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Total reviews count</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={reviews.totalReviews}
              onChange={(e) => setReviews({ ...reviews, totalReviews: Number(e.target.value) })}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-between mb-2">
          <Form.Label className="mb-0 fw-semibold">Review cards</Form.Label>
          <Button
            size="sm"
            variant="outline-secondary"
            type="button"
            onClick={() =>
              setReviews({
                ...reviews,
                items: [...reviews.items, { text: '', name: '', timeAgo: '', verified: true }],
              })
            }
          >
            + Add review
          </Button>
        </div>

        {reviews.items.map((review, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Review {i + 1}</span>
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() =>
                  setReviews({
                    ...reviews,
                    items: reviews.items.filter((_, idx) => idx !== i),
                  })
                }
                disabled={reviews.items.length === 1}
              >
                Remove
              </Button>
            </div>
            <Row className="g-2">
              <Col md={6}>
                <Form.Label className="small">Reviewer name</Form.Label>
                <Form.Control
                  value={review.name}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, name: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small">Time ago</Form.Label>
                <Form.Control
                  value={review.timeAgo}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, timeAgo: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                  placeholder="2 months ago"
                />
              </Col>
              <Col xs={12}>
                <Form.Label className="small">Review text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={review.text}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, text: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small">Avatar URL (optional)</Form.Label>
                <Form.Control
                  value={review.avatar || ''}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, avatar: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small">Initial (optional)</Form.Label>
                <Form.Control
                  value={review.initial || ''}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, initial: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small">Avatar color</Form.Label>
                <Form.Control
                  value={review.avatarColor || ''}
                  onChange={(e) => {
                    const items = reviews.items.map((x, idx) =>
                      idx === i ? { ...x, avatarColor: e.target.value } : x
                    )
                    setReviews({ ...reviews, items })
                  }}
                  placeholder="#e8710a"
                />
              </Col>
            </Row>
          </div>
        ))}
      </AdminEditorCard>
    </Layout>
  )
}

export default HomePageAdmin
