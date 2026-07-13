'use client'

import { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Layout from '@/components/admin/Layout'
import AdminPageToolbar from '@/components/admin/ui/AdminPageToolbar'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminAlerts from '@/components/admin/ui/AdminAlerts'
import AdminEditorCard from '@/components/admin/ui/AdminEditorCard'
import { api } from '@/lib/api/client'
import { footerSeed } from '@/lib/seeds/footer.js'

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
]

const emptyFooter = () => JSON.parse(JSON.stringify(footerSeed))

function FooterAdmin() {
  const [footer, setFooter] = useState(emptyFooter())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .getFooter()
      .then((res) => {
        const d = res?.data
        if (!d) return
        const base = emptyFooter()
        setFooter({
          ...base,
          ...d,
          brand: { ...base.brand, ...d.brand },
          socials: d.socials?.length ? d.socials : base.socials,
          columns: d.columns?.length ? d.columns : base.columns,
          bottom: { ...base.bottom, ...d.bottom },
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const setBrand = (next) => setFooter((f) => ({ ...f, brand: next }))
  const setBottom = (next) => setFooter((f) => ({ ...f, bottom: next }))

  const updateSocial = (index, patch) => {
    setFooter((f) => ({
      ...f,
      socials: f.socials.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }))
  }

  const updateColumn = (colIndex, patch) => {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, i) => (i === colIndex ? { ...c, ...patch } : c)),
    }))
  }

  const updateColumnLink = (colIndex, linkIndex, patch) => {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, i) =>
        i === colIndex
          ? {
              ...c,
              links: c.links.map((l, j) => (j === linkIndex ? { ...l, ...patch } : l)),
            }
          : c
      ),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateFooter(footer)
      setSuccess('Footer saved. Changes appear across the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Footer">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Footer">
      <AdminPageToolbar
        actions={
          <Button className="admin-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      >
        <p className="text-muted mb-0">
          Edit brand, social links, link columns, and copyright. Contact details in the footer come from Contact Us → Contact Methods.
        </p>
      </AdminPageToolbar>

      <AdminAlerts error={error} success={success} />

      <AdminEditorCard title="Brand" className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Brand name</Form.Label>
          <Form.Control
            value={footer.brand.name}
            onChange={(e) => setBrand({ ...footer.brand, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label>Tagline</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={footer.brand.tagline}
            onChange={(e) => setBrand({ ...footer.brand, tagline: e.target.value })}
          />
        </Form.Group>
      </AdminEditorCard>

      <AdminEditorCard title="Social links" className="mb-4">
        <div className="d-flex justify-content-between mb-3">
          <Form.Label className="mb-0 fw-semibold">Platforms</Form.Label>
          <Button
            size="sm"
            variant="outline-secondary"
            type="button"
            onClick={() =>
              setFooter((f) => ({
                ...f,
                socials: [...f.socials, { platform: 'facebook', label: '', href: '' }],
              }))
            }
          >
            + Add social link
          </Button>
        </div>
        {footer.socials.map((social, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Social {i + 1}</span>
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() =>
                  setFooter((f) => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }))
                }
                disabled={footer.socials.length === 1}
              >
                Remove
              </Button>
            </div>
            <Row className="g-2">
              <Col md={4}>
                <Form.Label className="small">Platform</Form.Label>
                <Form.Select
                  value={social.platform}
                  onChange={(e) => updateSocial(i, { platform: e.target.value })}
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label className="small">Label</Form.Label>
                <Form.Control
                  value={social.label}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                />
              </Col>
              <Col md={4}>
                <Form.Label className="small">URL</Form.Label>
                <Form.Control
                  value={social.href}
                  onChange={(e) => updateSocial(i, { href: e.target.value })}
                  placeholder="https://"
                />
              </Col>
            </Row>
          </div>
        ))}
      </AdminEditorCard>

      <AdminEditorCard title="Link columns" className="mb-4">
        <div className="d-flex justify-content-between mb-3">
          <Form.Label className="mb-0 fw-semibold">Columns</Form.Label>
          <Button
            size="sm"
            variant="outline-secondary"
            type="button"
            onClick={() =>
              setFooter((f) => ({
                ...f,
                columns: [...f.columns, { title: '', links: [{ label: '', href: '' }] }],
              }))
            }
          >
            + Add column
          </Button>
        </div>
        {footer.columns.map((column, colIndex) => (
          <div className="border rounded p-3 mb-3" key={colIndex}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Column {colIndex + 1}</span>
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() =>
                  setFooter((f) => ({
                    ...f,
                    columns: f.columns.filter((_, idx) => idx !== colIndex),
                  }))
                }
                disabled={footer.columns.length === 1}
              >
                Remove column
              </Button>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Column title</Form.Label>
              <Form.Control
                value={column.title}
                onChange={(e) => updateColumn(colIndex, { title: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-between mb-2">
              <Form.Label className="mb-0 small fw-semibold">Links</Form.Label>
              <Button
                size="sm"
                variant="outline-secondary"
                type="button"
                onClick={() =>
                  updateColumn(colIndex, {
                    links: [...column.links, { label: '', href: '' }],
                  })
                }
              >
                + Add link
              </Button>
            </div>
            {column.links.map((link, linkIndex) => (
              <Row className="g-2 mb-2" key={linkIndex}>
                <Col md={5}>
                  <Form.Control
                    placeholder="Link label"
                    value={link.label}
                    onChange={(e) => updateColumnLink(colIndex, linkIndex, { label: e.target.value })}
                  />
                </Col>
                <Col md={5}>
                  <Form.Control
                    placeholder="/about or https://"
                    value={link.href}
                    onChange={(e) => updateColumnLink(colIndex, linkIndex, { href: e.target.value })}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    className="w-100"
                    onClick={() =>
                      updateColumn(colIndex, {
                        links: column.links.filter((_, idx) => idx !== linkIndex),
                      })
                    }
                    disabled={column.links.length === 1}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        ))}
      </AdminEditorCard>

      <AdminEditorCard title="Bottom bar">
        <Form.Group className="mb-3">
          <Form.Label>Copyright name</Form.Label>
          <Form.Control
            value={footer.bottom.copyrightName}
            onChange={(e) => setBottom({ ...footer.bottom, copyrightName: e.target.value })}
            placeholder="Holiday to Bhutan"
          />
          <Form.Text className="text-muted">Shown as © {new Date().getFullYear()} [name]. All rights reserved.</Form.Text>
        </Form.Group>
        <Form.Check
          type="switch"
          id="footer-admin-link"
          label="Show Admin Login link in footer"
          checked={footer.bottom.showAdminLink}
          onChange={(e) => setBottom({ ...footer.bottom, showAdminLink: e.target.checked })}
        />
      </AdminEditorCard>
    </Layout>
  )
}

export default FooterAdmin
