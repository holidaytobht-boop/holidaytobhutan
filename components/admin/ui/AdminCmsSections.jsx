'use client'

import { useMemo } from 'react'
import { Row, Col, Badge, Button, Form, InputGroup, Modal } from 'react-bootstrap'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminFilterPanel from '@/components/admin/ui/AdminFilterPanel'
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState'
import { resolveImageUrl } from '@/lib/utils/imageUrl'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80'

export default function AdminCmsSections({
  pageLabel,
  description,
  sections,
  query,
  setQuery,
  sectionFilter,
  setSectionFilter,
  saving,
  onSave,
  error,
  success,
  editingKey,
  setEditingKey,
  renderEditor,
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sections.filter((section) => {
      if (sectionFilter !== 'all' && section.key !== sectionFilter) return false
      if (!q) return true
      return (
        section.label.toLowerCase().includes(q) ||
        (section.preview || '').toLowerCase().includes(q)
      )
    })
  }, [sections, sectionFilter, query])

  const activeSection = sections.find((section) => section.key === editingKey)

  return (
    <>
      <AdminPageToolbar
        actions={
          <>
            <Badge bg="light" text="dark" className="pkg-toolbar__count">
              {filtered.length} of {sections.length} sections
            </Badge>
            <Button className="admin-btn" onClick={onSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        <p className="text-muted mb-0">{description}</p>
      </AdminPageToolbar>

      <AdminAlerts error={error} success={success} />

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
              placeholder={`Search ${pageLabel} sections…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        }
      >
        <div className="pkg-filter-pills">
          <button
            type="button"
            className={`pkg-pill ${sectionFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setSectionFilter('all')}
          >
            All sections
          </button>
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`pkg-pill ${sectionFilter === section.key ? 'is-active' : ''}`}
              onClick={() => setSectionFilter(section.key)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </AdminFilterPanel>

      {filtered.length === 0 ? (
        <AdminEmptyState title="No sections found" description="Try a different search or filter." />
      ) : (
        <Row className="g-4">
          {filtered.map((section) => {
            const img = resolveImageUrl(section.image || FALLBACK_IMG)

            return (
              <Col xs={12} sm={6} lg={4} key={section.key}>
                <article className="pkg-card h-100">
                  <div className="pkg-card__img" style={{ backgroundImage: `url(${img})` }}>
                    <Badge bg={section.complete ? 'success' : 'secondary'} className="pkg-card__status">
                      {section.complete ? 'Complete' : 'Needs details'}
                    </Badge>
                  </div>
                  <div className="pkg-card__body">
                    <Badge bg="light" text="dark" className="pkg-card__tour">
                      {pageLabel}
                    </Badge>
                    <h3 className="pkg-card__title">{section.label}</h3>
                    <p className="pkg-card__meta text-truncate-2">
                      {section.preview || <em className="text-muted">No preview yet</em>}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <Button
                        className="admin-btn flex-grow-1"
                        size="sm"
                        onClick={() => setEditingKey(section.key)}
                      >
                        Edit section
                      </Button>
                    </div>
                  </div>
                </article>
              </Col>
            )
          })}
        </Row>
      )}

      <Modal
        show={Boolean(editingKey)}
        onHide={() => setEditingKey(null)}
        size="lg"
        scrollable
        className="admin-section-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{activeSection?.label || 'Edit section'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{editingKey ? renderEditor(editingKey) : null}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setEditingKey(null)}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
