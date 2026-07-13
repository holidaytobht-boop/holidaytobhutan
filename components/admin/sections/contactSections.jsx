import { Form, Button, Row, Col } from 'react-bootstrap'

const hasText = (value) => Boolean(String(value || '').trim())

export const CONTACT_SECTION_DEFS = [
  { key: 'info', label: 'Info Panel' },
  { key: 'methods', label: 'Contact Methods' },
  { key: 'whatsappCta', label: 'WhatsApp Button' },
  { key: 'form', label: 'Contact Form' },
]

export function buildContactSections(page) {
  return CONTACT_SECTION_DEFS.map(({ key, label }) => {
    switch (key) {
      case 'info':
        return {
          key,
          label,
          preview: page.info.title || page.info.lead,
          complete: hasText(page.info.title) && hasText(page.info.lead),
        }
      case 'methods':
        return {
          key,
          label,
          preview: page.methods?.[0]?.label || page.methods?.[0]?.value,
          complete: page.methods?.some((method) => hasText(method.label) && hasText(method.value)),
        }
      case 'whatsappCta':
        return {
          key,
          label,
          preview: page.whatsappCta.label,
          complete: hasText(page.whatsappCta.label) && hasText(page.whatsappCta.url),
        }
      case 'form':
        return {
          key,
          label,
          preview: page.form.title || page.form.submitLabel,
          complete: hasText(page.form.title) && hasText(page.form.submitLabel),
        }
      default:
        return { key, label, preview: '', complete: false }
    }
  })
}

export function renderContactSection(key, page, setSection) {
  switch (key) {
    case 'info':
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Eyebrow</Form.Label>
            <Form.Control value={page.info.eyebrow} onChange={(e) => setSection('info', { ...page.info, eyebrow: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={page.info.title} onChange={(e) => setSection('info', { ...page.info, title: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Lead paragraph</Form.Label>
            <Form.Control as="textarea" rows={3} value={page.info.lead} onChange={(e) => setSection('info', { ...page.info, lead: e.target.value })} />
          </Form.Group>
        </>
      )
    case 'methods':
      return (
        <>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">Contact method rows</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('methods', [...page.methods, { type: 'phone', label: '', value: '', sub: '', href: '' }])}>+ Add method</Button>
          </div>
          <p className="text-muted small mb-3">These details also appear in the site footer. The page hero banner is edited under Hero Banners.</p>
          {page.methods.map((m, i) => (
            <div className="border rounded p-2 mb-2" key={i}>
              <Row className="g-2">
                <Col md={3}>
                  <Form.Label className="small">Type</Form.Label>
                  <Form.Select value={m.type} onChange={(e) => {
                    const methods = page.methods.map((x, idx) => (idx === i ? { ...x, type: e.target.value } : x))
                    setSection('methods', methods)
                  }}>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="address">Address</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="small">Label</Form.Label>
                  <Form.Control value={m.label} onChange={(e) => {
                    const methods = page.methods.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x))
                    setSection('methods', methods)
                  }} />
                </Col>
                <Col md={3}>
                  <Form.Label className="small">Value</Form.Label>
                  <Form.Control value={m.value} onChange={(e) => {
                    const methods = page.methods.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x))
                    setSection('methods', methods)
                  }} />
                </Col>
                <Col md={2}>
                  <Form.Label className="small">Subtext</Form.Label>
                  <Form.Control value={m.sub} onChange={(e) => {
                    const methods = page.methods.map((x, idx) => (idx === i ? { ...x, sub: e.target.value } : x))
                    setSection('methods', methods)
                  }} />
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button variant="outline-danger" type="button" onClick={() => setSection('methods', page.methods.filter((_, idx) => idx !== i))} disabled={page.methods.length === 1}>×</Button>
                </Col>
                <Col xs={12}>
                  <Form.Label className="small">Link (tel:, mailto:, https:// — leave empty for address)</Form.Label>
                  <Form.Control value={m.href} onChange={(e) => {
                    const methods = page.methods.map((x, idx) => (idx === i ? { ...x, href: e.target.value } : x))
                    setSection('methods', methods)
                  }} />
                </Col>
              </Row>
            </div>
          ))}
        </>
      )
    case 'whatsappCta':
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Button label</Form.Label>
            <Form.Control value={page.whatsappCta.label} onChange={(e) => setSection('whatsappCta', { ...page.whatsappCta, label: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>WhatsApp URL</Form.Label>
            <Form.Control value={page.whatsappCta.url} onChange={(e) => setSection('whatsappCta', { ...page.whatsappCta, url: e.target.value })} placeholder="https://wa.me/..." />
          </Form.Group>
        </>
      )
    case 'form':
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Eyebrow</Form.Label>
            <Form.Control value={page.form.eyebrow} onChange={(e) => setSection('form', { ...page.form, eyebrow: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Form title</Form.Label>
            <Form.Control value={page.form.title} onChange={(e) => setSection('form', { ...page.form, title: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Submit button label</Form.Label>
            <Form.Control value={page.form.submitLabel} onChange={(e) => setSection('form', { ...page.form, submitLabel: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Success title</Form.Label>
            <Form.Control value={page.form.successTitle} onChange={(e) => setSection('form', { ...page.form, successTitle: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Success message</Form.Label>
            <Form.Control as="textarea" rows={2} value={page.form.successMessage} onChange={(e) => setSection('form', { ...page.form, successMessage: e.target.value })} />
          </Form.Group>
          <div className="d-flex justify-content-between mb-2">
            <Form.Label className="mb-0 fw-semibold">“I’m interested in” dropdown options</Form.Label>
            <Button size="sm" variant="outline-secondary" type="button" onClick={() => setSection('form', { ...page.form, interestOptions: [...page.form.interestOptions, ''] })}>+ Add option</Button>
          </div>
          {page.form.interestOptions.map((opt, i) => (
            <Row className="g-2 mb-2" key={i}>
              <Col xs={11}>
                <Form.Control value={opt} onChange={(e) => {
                  const interestOptions = page.form.interestOptions.map((x, idx) => (idx === i ? e.target.value : x))
                  setSection('form', { ...page.form, interestOptions })
                }} />
              </Col>
              <Col xs={1}>
                <Button variant="outline-danger" type="button" onClick={() => setSection('form', { ...page.form, interestOptions: page.form.interestOptions.filter((_, idx) => idx !== i) })} disabled={page.form.interestOptions.length === 1}>×</Button>
              </Col>
            </Row>
          ))}
        </>
      )
    default:
      return null
  }
}
