'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import CountrySelect from '@/components/site/CountrySelect'
import HoneypotField from '@/components/site/HoneypotField'
import {
  AIR_TICKET_CLASSES,
  HOTEL_OPTIONS,
  TRAVEL_INTEREST_OPTIONS,
  TRAVEL_ROUTES,
} from '@/lib/constants/plannerOptions'
import { buildTourTitles, getStaticTourTitles } from '@/lib/utils/tourOptions'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGITS_RE = /^\d{6,15}$/

const emptyForm = () => ({
  name: '',
  email: '',
  whatsapp: '',
  tripTitle: '',
  travelDate: '',
  tripDuration: '',
  adults: '',
  children: '',
  travelers: '',
  nationality: '',
  travelRoute: '',
  airTicketClass: '',
  hotelAccommodation: '',
  travelInterests: [],
  message: '',
})

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function normalizePhoneDigits(value) {
  return (value || '').replace(/\D/g, '')
}

function Field({ id, label, required, error, children }) {
  return (
    <Form.Group controlId={id} className="planner-field">
      <Form.Label>
        {label}
        {required ? <span className="planner-required"> *</span> : null}
      </Form.Label>
      {children}
      {error ? <div className="invalid-feedback d-block">{error}</div> : null}
    </Form.Group>
  )
}

function validateForm(form) {
  const fieldErrors = {}
  const today = todayIso()

  if (!form.tripTitle.trim()) fieldErrors.tripTitle = 'Please select a tour.'
  if (!form.travelDate) fieldErrors.travelDate = 'Travel date is required.'
  else if (form.travelDate < today) fieldErrors.travelDate = 'Travel date cannot be in the past.'

  if (!form.name.trim()) fieldErrors.name = 'Name is required.'
  if (!form.email.trim()) fieldErrors.email = 'Email is required.'
  else if (!EMAIL_RE.test(form.email.trim())) fieldErrors.email = 'Enter a valid email.'

  const whatsappDigits = normalizePhoneDigits(form.whatsapp)
  if (!whatsappDigits) fieldErrors.whatsapp = 'WhatsApp number is required.'
  else if (!PHONE_DIGITS_RE.test(whatsappDigits)) fieldErrors.whatsapp = 'Enter a valid number.'

  if (!form.nationality) fieldErrors.nationality = 'Nationality is required.'
  if (!form.message.trim()) fieldErrors.message = 'Message is required.'

  return fieldErrors
}

function TripPlanner({ variant = 'section' }) {
  const isPage = variant === 'page'
  const searchParams = useSearchParams()
  const preselectedTour = searchParams.get('tour')?.trim() || ''
  const formRef = useRef(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [tourTitles, setTourTitles] = useState(getStaticTourTitles)
  const [toursLoading, setToursLoading] = useState(true)

  const minTravelDate = useMemo(() => todayIso(), [])

  const displayTourTitles = useMemo(() => {
    if (!preselectedTour) return tourTitles
    if (tourTitles.includes(preselectedTour)) return tourTitles
    return [preselectedTour, ...tourTitles].sort((a, b) => a.localeCompare(b))
  }, [tourTitles, preselectedTour])

  useEffect(() => {
    if (!preselectedTour) return
    setForm((prev) => (prev.tripTitle === preselectedTour ? prev : { ...prev, tripTitle: preselectedTour }))
  }, [preselectedTour])

  useEffect(() => {
    let active = true
    api
      .getTours()
      .then((res) => {
        if (!active) return
        setTourTitles(buildTourTitles(Array.isArray(res?.data) ? res.data : []))
      })
      .catch(() => {
        if (active) setTourTitles(getStaticTourTitles())
      })
      .finally(() => {
        if (active) setToursLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'adults' || field === 'children') {
        const adults = Number(field === 'adults' ? value : prev.adults) || 0
        const children = Number(field === 'children' ? value : prev.children) || 0
        const total = adults + children
        if (total > 0) next.travelers = String(total)
      }
      return next
    })
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const toggleTravelInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      travelInterests: prev.travelInterests.includes(interest)
        ? prev.travelInterests.filter((item) => item !== interest)
        : [...prev.travelInterests, interest],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateForm(form)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await api.createInquiry({
        source: 'plan-my-trip',
        booking: { ...form, whatsapp: form.whatsapp.trim() },
        _hp: honeypot,
      })
      setSubmitted(true)
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const invalid = (key) => (fieldErrors[key] ? 'is-invalid' : '')

  const formCard = (
    <div
      className={`planner-minimal reveal reveal--fade-up${isPage ? ' planner-minimal--page' : ''}`}
      ref={formRef}
      id={isPage ? 'plan-trip-form' : undefined}
    >
          {submitted ? (
            <div className="planner-minimal__done">
              <p className="planner-minimal__done-title">Request sent</p>
              <p>
                Thank you, {form.name}. Our team will contact you soon at {form.email}.
              </p>
              <Button variant="outline-dark" type="button" onClick={() => {
                setForm(emptyForm())
                setFieldErrors({})
                setSubmitted(false)
                setSubmitError('')
              }}>
                Book another trip
              </Button>
            </div>
          ) : (
            <Form className="planner-minimal__form" onSubmit={handleSubmit} noValidate>
              <HoneypotField value={honeypot} onChange={setHoneypot} />

              {(Object.keys(fieldErrors).length > 0 || submitError) && (
                <Alert variant="danger" className="planner-minimal__alert">
                  {submitError || 'Please check the highlighted fields.'}
                </Alert>
              )}

              <Field id="name" label="Name" required error={fieldErrors.name}>
                <Form.Control
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={invalid('name')}
                  autoComplete="name"
                />
              </Field>

              <div className="planner-minimal__row">
                <Field id="email" label="Email" required error={fieldErrors.email}>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={invalid('email')}
                    autoComplete="email"
                  />
                </Field>
                <Field id="whatsapp" label="WhatsApp" required error={fieldErrors.whatsapp}>
                  <Form.Control
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    className={invalid('whatsapp')}
                    placeholder="Your number"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <CountrySelect
                id="nationality"
                label="Nationality"
                required
                error={fieldErrors.nationality}
                value={form.nationality}
                onChange={(value) => updateField('nationality', value)}
                placeholder="Select"
              />

              <Field id="tripTitle" label="Tour" required error={fieldErrors.tripTitle}>
                {toursLoading ? (
                  <div className="planner-minimal__loading">
                    <Spinner animation="border" size="sm" /> Loading tours…
                  </div>
                ) : (
                  <Form.Select
                    value={form.tripTitle}
                    onChange={(e) => updateField('tripTitle', e.target.value)}
                    className={invalid('tripTitle')}
                  >
                    <option value="">Choose a tour</option>
                    {displayTourTitles.map((tour) => (
                      <option key={tour} value={tour}>
                        {tour}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Field>

              <div className="planner-minimal__row">
                <Field id="travelDate" label="Travel date" required error={fieldErrors.travelDate}>
                  <Form.Control
                    type="date"
                    value={form.travelDate}
                    onChange={(e) => updateField('travelDate', e.target.value)}
                    min={minTravelDate}
                    className={invalid('travelDate')}
                  />
                </Field>
                <Field id="tripDuration" label="Duration" error={fieldErrors.tripDuration}>
                  <Form.Control
                    value={form.tripDuration}
                    onChange={(e) => updateField('tripDuration', e.target.value)}
                    placeholder="e.g. 7 days"
                  />
                </Field>
              </div>

              <div className="planner-minimal__row planner-minimal__row--3">
                <Field id="adults" label="Adults" error={fieldErrors.adults}>
                  <Form.Control
                    type="number"
                    min={0}
                    value={form.adults}
                    onChange={(e) => updateField('adults', e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <Field id="children" label="Children" error={fieldErrors.children}>
                  <Form.Control
                    type="number"
                    min={0}
                    value={form.children}
                    onChange={(e) => updateField('children', e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <Field id="travelers" label="Total" error={fieldErrors.travelers}>
                  <Form.Control
                    type="number"
                    min={1}
                    value={form.travelers}
                    onChange={(e) => updateField('travelers', e.target.value)}
                    placeholder="0"
                  />
                </Field>
              </div>

              <details className="planner-minimal__more">
                <summary>More preferences (optional)</summary>
                <div className="planner-minimal__more-body">
                  <Field id="travelRoute" label="Travel route" error={fieldErrors.travelRoute}>
                    <Form.Select
                      value={form.travelRoute}
                      onChange={(e) => updateField('travelRoute', e.target.value)}
                    >
                      <option value="">Select city</option>
                      {TRAVEL_ROUTES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Form.Select>
                  </Field>

                  <div className="planner-minimal__row">
                    <Field id="airTicketClass" label="Air ticket" error={fieldErrors.airTicketClass}>
                      <Form.Select
                        value={form.airTicketClass}
                        onChange={(e) => updateField('airTicketClass', e.target.value)}
                      >
                        <option value="">Select</option>
                        {AIR_TICKET_CLASSES.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Form.Select>
                    </Field>
                    <Field id="hotelAccommodation" label="Hotel" error={fieldErrors.hotelAccommodation}>
                      <Form.Select
                        value={form.hotelAccommodation}
                        onChange={(e) => updateField('hotelAccommodation', e.target.value)}
                      >
                        <option value="">Select</option>
                        {HOTEL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Form.Select>
                    </Field>
                  </div>

                  <Form.Group className="planner-field">
                    <Form.Label>Travel interests</Form.Label>
                    <div className="planner-minimal__checks">
                      {TRAVEL_INTEREST_OPTIONS.map((interest, index) => (
                        <Form.Check
                          key={interest}
                          type="checkbox"
                          id={`interest-${index}`}
                          label={interest}
                          checked={form.travelInterests.includes(interest)}
                          onChange={() => toggleTravelInterest(interest)}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </div>
              </details>

              <Field id="message" label="Message" required error={fieldErrors.message}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Anything else we should know?"
                  className={invalid('message')}
                />
              </Field>

              <Button
                type="submit"
                className="btn-cta planner-minimal__submit"
                disabled={submitting || toursLoading}
              >
                {submitting ? 'Sending…' : 'Book My Trip'}
              </Button>
            </Form>
          )}
    </div>
  )

  if (isPage) {
    return formCard
  }

  return (
    <section className="section-pad planner" id="custom-tours">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <p className="eyebrow mb-2">Tailor-made journeys</p>
          <h2>Plan My Trip</h2>
          <p>
            Tell us about your dream trip to Bhutan. Our local specialists will craft a personalized
            itinerary and get back to you within 24 hours.
          </p>
        </div>
        {formCard}
      </Container>
    </section>
  )
}

export default TripPlanner
