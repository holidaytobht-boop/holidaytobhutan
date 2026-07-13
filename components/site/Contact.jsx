'use client'

import { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { mergePageHero } from '@/lib/utils/cmsMerge'
import HoneypotField from '@/components/site/HoneypotField'
import PageLoading from '@/components/site/PageLoading'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGITS_RE = /^\d{6,15}$/

const emptyForm = () => ({ name: '', email: '', phone: '', interest: '', message: '' })

function normalizePhoneDigits(value) {
  return (value || '').replace(/\D/g, '')
}

function ContactField({ id, label, required, error, children }) {
  return (
    <Form.Group controlId={id} className="contact-field">
      <Form.Label>
        {label}
        {required ? <span className="contact-required"> *</span> : null}
      </Form.Label>
      {children}
      {error ? <div className="invalid-feedback d-block">{error}</div> : null}
    </Form.Group>
  )
}

function validateContactForm(form) {
  const fieldErrors = {}

  if (!form.name.trim()) fieldErrors.name = 'Name is required.'
  if (!form.email.trim()) fieldErrors.email = 'Email is required.'
  else if (!EMAIL_RE.test(form.email.trim())) fieldErrors.email = 'Enter a valid email address.'

  const phoneDigits = normalizePhoneDigits(form.phone)
  if (phoneDigits && !PHONE_DIGITS_RE.test(phoneDigits)) {
    fieldErrors.phone = 'Enter a valid phone number.'
  }

  if (!form.message.trim()) fieldErrors.message = 'Message is required.'

  return fieldErrors
}

const fallback = {
  hero: {
    eyebrow: 'Contact',
    title: "Let's Plan Your Bhutan Journey",
    subtitle:
      'Questions, ideas or ready to book? Our local Bhutan specialists are here to help every step of the way.',
    image: '',
    ctaText: 'Send a Message',
    ctaLink: '#contact-form',
  },
  info: {
    eyebrow: 'Contact information',
    title: 'Talk to a Bhutan specialist',
    lead: 'Reach us whichever way suits you best — we love a good travel conversation.',
  },
  methods: [
    { type: 'phone', label: 'Call us', value: '+975 77992233', sub: 'Mon–Sat · 9am–6pm BTT', href: 'tel:+97577992233' },
    { type: 'email', label: 'Email us', value: 'holidaytobht@gmail.com', sub: 'We reply within 24 hours', href: 'mailto:holidaytobht@gmail.com' },
    {
      type: 'whatsapp',
      label: 'WhatsApp',
      value: 'Chat with a specialist',
      sub: 'Fastest way to reach us',
      href: 'https://wa.me/97577992233?text=Hi%20Holiday%20to%20Bhutan%2C%20I%27d%20like%20to%20plan%20a%20trip.',
    },
    { type: 'address', label: 'Location', value: 'Paro, Bhutan', sub: '', href: '' },
  ],
  whatsappCta: {
    label: 'Connect on WhatsApp',
    url: 'https://wa.me/97577992233?text=Hi%20Holiday%20to%20Bhutan%2C%20I%27d%20like%20to%20plan%20a%20trip.',
  },
  form: {
    eyebrow: 'Send us a message',
    title: 'Tell us about your dream trip',
    submitLabel: 'Send Message',
    successTitle: 'Thank you!',
    successMessage:
      'Your message is on its way. A Bhutan specialist will be in touch with you very soon.',
    interestOptions: [
      'Cultural Tours',
      'Trekking Tours',
      'Festival Tours',
      'Adventure Tours',
      'Luxury Tours',
      'Custom Tours',
    ],
  },
}

const pick = (apiVal, fallbackVal) => {
  if (Array.isArray(apiVal)) return apiVal.length ? apiVal : fallbackVal
  if (typeof apiVal === 'string') return apiVal.trim() ? apiVal : fallbackVal
  return apiVal ?? fallbackVal
}

const mergePage = (apiData) => {
  if (!apiData) return fallback
  return {
    hero: {
      eyebrow: pick(apiData.hero?.eyebrow, fallback.hero.eyebrow),
      title: pick(apiData.hero?.title, fallback.hero.title),
      subtitle: pick(apiData.hero?.subtitle, fallback.hero.subtitle),
      image: apiData.hero?.image?.trim() || '',
      ctaText: pick(apiData.hero?.ctaText, fallback.hero.ctaText),
      ctaLink: pick(apiData.hero?.ctaLink, fallback.hero.ctaLink),
    },
    info: {
      eyebrow: pick(apiData.info?.eyebrow, fallback.info.eyebrow),
      title: pick(apiData.info?.title, fallback.info.title),
      lead: pick(apiData.info?.lead, fallback.info.lead),
    },
    methods: pick(apiData.methods, fallback.methods),
    whatsappCta: {
      label: pick(apiData.whatsappCta?.label, fallback.whatsappCta.label),
      url: pick(apiData.whatsappCta?.url, fallback.whatsappCta.url),
    },
    form: {
      eyebrow: pick(apiData.form?.eyebrow, fallback.form.eyebrow),
      title: pick(apiData.form?.title, fallback.form.title),
      submitLabel: pick(apiData.form?.submitLabel, fallback.form.submitLabel),
      successTitle: pick(apiData.form?.successTitle, fallback.form.successTitle),
      successMessage: pick(apiData.form?.successMessage, fallback.form.successMessage),
      interestOptions: pick(apiData.form?.interestOptions, fallback.form.interestOptions),
    },
  }
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const methodIcons = {
  phone: <PhoneIcon />,
  email: <MailIcon />,
  whatsapp: <WhatsAppIcon />,
  address: <PinIcon />,
}

function Contact() {
  const formRef = useRef(null)
  const [page, setPage] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState(emptyForm)
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([api.getContactPage(), api.getHeroBanners()])
      .then(([contactRes, bannersRes]) => {
        if (!active) return
        const merged = contactRes?.data ? mergePage(contactRes.data) : fallback
        const bannerHero = bannersRes?.data?.contactPage
        if (bannerHero) {
          merged.hero = mergePageHero(bannerHero, merged.hero)
        }
        if (active) setPage(merged)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateContactForm(form)
    setFieldErrors(errors)
    setFormError('')

    if (Object.keys(errors).length > 0) {
      const firstInvalid = formRef.current?.querySelector('.is-invalid')
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstInvalid?.focus()
      return
    }

    setSubmitting(true)
    try {
      await api.createInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        interest: form.interest || undefined,
        message: form.message.trim(),
        _hp: honeypot,
      })
      setSubmitted(true)
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendAnother = () => {
    setSubmitted(false)
    setForm(emptyForm())
    setFieldErrors({})
    setFormError('')
    setHoneypot('')
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const fieldClass = (field) => (fieldErrors[field] ? 'is-invalid' : undefined)

  if (loading) {
    return <PageLoading label="Loading contact page…" />
  }

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: `url(${resolveImageUrl(page.hero.image)})` }}>
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">{page.hero.eyebrow}</p>
          <h1>{page.hero.title}</h1>
          <p className="page-hero__sub">{page.hero.subtitle}</p>
        </Container>
      </section>

      <section className="section-pad" id="contact-form">
        <Container>
          <Row className="g-4 g-lg-5 justify-content-center align-items-stretch">
            <Col lg={5}>
              <div className="contact-info-card h-100 reveal reveal--fade-right">
                <p className="eyebrow eyebrow--light mb-2">{page.info.eyebrow}</p>
                <h2 className="fw-bold mb-2">{page.info.title}</h2>
                <p className="contact-info-card__lead mb-4">{page.info.lead}</p>

                <div className="contact-info-list">
                  {page.methods.map((row, i) => {
                    const icon = methodIcons[row.type] || <PhoneIcon />
                    const rowClass = `contact-info-row reveal reveal--fade-up${row.href ? '' : ' contact-info-row--static'}`
                    const rowStyle = { '--reveal-delay': `${i * 70}ms` }
                    const content = (
                      <>
                        <span className="contact-info-row__icon">{icon}</span>
                        <span className="contact-info-row__text">
                          <span className="contact-info-row__label">{row.label}</span>
                          <span className="contact-info-row__value">{row.value}</span>
                          <span className="contact-info-row__sub">{row.sub}</span>
                        </span>
                      </>
                    )

                    return row.href ? (
                      <a
                        key={row.label}
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={rowClass}
                        style={rowStyle}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={row.label} className={rowClass} style={rowStyle}>
                        {content}
                      </div>
                    )
                  })}
                </div>

                {page.whatsappCta.url && (
                  <Button
                    className="btn-whatsapp w-100 mt-4 py-2 d-inline-flex align-items-center justify-content-center gap-2"
                    href={page.whatsappCta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                    {page.whatsappCta.label || 'Connect on WhatsApp'}
                  </Button>
                )}
              </div>
            </Col>

            <Col lg={7}>
              <div className="contact-form-box h-100 reveal reveal--fade-left">
                {submitted ? (
                  <div className="text-center py-5" role="status" aria-live="polite">
                    <h3 className="fw-bold mb-2">{page.form.successTitle}</h3>
                    <p className="text-muted mb-4">{page.form.successMessage}</p>
                    <Button className="btn-cta" onClick={handleSendAnother}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="eyebrow mb-2">{page.form.eyebrow}</p>
                    <h2 className="fw-bold mb-4">{page.form.title}</h2>
                    {formError ? <Alert variant="danger">{formError}</Alert> : null}
                    <Form ref={formRef} onSubmit={handleSubmit} noValidate>
                      <HoneypotField value={honeypot} onChange={setHoneypot} />
                      <Row className="g-3">
                        <Col sm={6}>
                          <ContactField id="contactName" label="Full name" required error={fieldErrors.name}>
                            <Form.Control
                              type="text"
                              placeholder="Your name"
                              value={form.name}
                              className={fieldClass('name')}
                              aria-invalid={Boolean(fieldErrors.name)}
                              aria-describedby={fieldErrors.name ? 'contactName-error' : undefined}
                              onChange={(e) => updateField('name', e.target.value)}
                            />
                          </ContactField>
                        </Col>
                        <Col sm={6}>
                          <ContactField id="contactEmail" label="Email" required error={fieldErrors.email}>
                            <Form.Control
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              className={fieldClass('email')}
                              aria-invalid={Boolean(fieldErrors.email)}
                              onChange={(e) => updateField('email', e.target.value)}
                            />
                          </ContactField>
                        </Col>
                        <Col sm={6}>
                          <ContactField id="contactPhone" label="Phone (optional)" error={fieldErrors.phone}>
                            <Form.Control
                              type="tel"
                              placeholder="+1 234 567 890"
                              value={form.phone}
                              className={fieldClass('phone')}
                              aria-invalid={Boolean(fieldErrors.phone)}
                              onChange={(e) => updateField('phone', e.target.value)}
                            />
                          </ContactField>
                        </Col>
                        <Col sm={6}>
                          <ContactField id="contactInterest" label="I'm interested in">
                            <Form.Select
                              value={form.interest}
                              onChange={(e) => updateField('interest', e.target.value)}
                            >
                              <option value="">Choose a tour type</option>
                              {page.form.interestOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Form.Select>
                          </ContactField>
                        </Col>
                        <Col xs={12}>
                          <ContactField id="contactMessage" label="Your message" required error={fieldErrors.message}>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              placeholder="Tell us about your travel plans, dates and group size…"
                              value={form.message}
                              className={fieldClass('message')}
                              aria-invalid={Boolean(fieldErrors.message)}
                              onChange={(e) => updateField('message', e.target.value)}
                            />
                          </ContactField>
                        </Col>
                        <Col xs={12}>
                          <Button type="submit" className="btn-cta w-100 py-2" disabled={submitting}>
                            {submitting ? 'Sending…' : page.form.submitLabel}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Contact
