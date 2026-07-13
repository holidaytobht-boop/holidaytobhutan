import Inquiry from '@/lib/models/Inquiry.js'
import { isDbConnected } from '@/lib/db/connect.js'
import { addInquiry, getInquiries, updateInquiry, deleteInquiry } from '@/lib/stores/inquiries.js'
import { normalizeBookingPayload } from '@/lib/utils/booking.js'
import { honeypotSuccessResponse, isHoneypotTriggered } from '@/lib/security/honeypot.js'
import { trimField, trimOptional } from '@/lib/security/sanitize.js'
import { sendContactInquiryEmail, sendTripBookingEmail } from '@/lib/services/email.js'
import { toCsv } from '@/lib/utils/csv.js'
import mongoose from 'mongoose'

const ALLOWED_STATUSES = ['new', 'contacted', 'closed']

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function sanitizePayload(payload) {
  if (payload.source === 'plan-my-trip') {
    const booking = payload.booking || {}
    if (booking.personal || booking.travel || booking.passport || booking.preferences) {
      const personal = booking.personal || {}
      return {
        ...payload,
        booking: {
          ...booking,
          personal: {
            ...personal,
            fullName: trimField(personal.fullName, 120),
            email: trimField(personal.email, 254).toLowerCase(),
            phone: trimField(personal.phone, 40),
            nationality: trimOptional(personal.nationality, 80),
            dateOfBirth: trimOptional(personal.dateOfBirth, 20),
          },
        },
      }
    }

    return {
      ...payload,
      booking: {
        ...booking,
        name: trimField(booking.name, 120),
        email: trimField(booking.email, 254).toLowerCase(),
        whatsapp: trimField(booking.whatsapp, 40),
        tripTitle: trimField(booking.tripTitle, 200),
        travelDate: trimOptional(booking.travelDate, 20),
        tripDuration: trimOptional(booking.tripDuration, 80),
        adults: trimOptional(booking.adults, 10),
        children: trimOptional(booking.children, 10),
        travelers: trimOptional(booking.travelers, 10),
        nationality: trimOptional(booking.nationality, 80),
        travelRoute: trimOptional(booking.travelRoute, 300),
        airTicketClass: trimOptional(booking.airTicketClass, 80),
        hotelAccommodation: trimOptional(booking.hotelAccommodation, 120),
        travelInterests: Array.isArray(booking.travelInterests)
          ? booking.travelInterests
              .map((item) => trimOptional(item, 200))
              .filter(Boolean)
              .slice(0, 30)
          : [],
        message: trimField(booking.message, 5000),
      },
    }
  }

  return {
    ...payload,
    name: trimField(payload.name, 120),
    email: trimField(payload.email, 254).toLowerCase(),
    phone: trimOptional(payload.phone, 40),
    interest: trimOptional(payload.interest, 80),
    message: trimField(payload.message, 5000),
  }
}

export const createInquiry = async (req, res) => {
  const raw = req.body || {}

  if (isHoneypotTriggered(raw)) {
    return honeypotSuccessResponse(res)
  }

  const payload = sanitizePayload(normalizeBookingPayload(raw))
  const errors = []
  const isTripBooking = payload.source === 'plan-my-trip'

  if (isTripBooking) {
    const booking = payload.booking || {}
    const personal = booking.personal || {}
    if (personal.fullName || booking.travel || booking.passport) {
      if (!isNonEmptyString(personal.fullName)) errors.push('Full name is required.')
      if (!isNonEmptyString(personal.email) || !isValidEmail(personal.email)) {
        errors.push('A valid email is required.')
      }
      if (!isNonEmptyString(personal.phone)) errors.push('Phone number is required.')
    } else {
      if (!isNonEmptyString(booking.name)) errors.push('Name is required.')
      if (!isNonEmptyString(booking.email) || !isValidEmail(booking.email)) {
        errors.push('A valid email is required.')
      }
      if (!isNonEmptyString(booking.whatsapp)) errors.push('WhatsApp number is required.')
      if (!isNonEmptyString(booking.tripTitle)) errors.push('Trip title is required.')
      if (!isNonEmptyString(booking.travelDate)) errors.push('Travel date is required.')
      if (!isNonEmptyString(booking.nationality)) errors.push('Nationality is required.')
      if (!isNonEmptyString(booking.message)) errors.push('Message is required.')
    }
  } else {
    if (!isNonEmptyString(payload.name)) errors.push('Name is required.')
    if (!isNonEmptyString(payload.email) || !isValidEmail(payload.email)) errors.push('A valid email is required.')
    if (!isNonEmptyString(payload.message)) errors.push('Message is required.')
  }

  if (errors.length > 0) {
    res.status(400)
    return res.json({ success: false, message: 'Validation failed', errors })
  }

  let saved
  if (isDbConnected()) {
    const doc = await Inquiry.create(payload)
    saved = { id: doc.id, createdAt: doc.createdAt, storage: 'database' }
  } else {
    console.warn(
      '⚠️  Booking saved to local file only — MongoDB is not connected. Check Atlas Network Access and restart the dev server.'
    )
    const inquiry = addInquiry(payload)
    saved = { id: inquiry.id, createdAt: inquiry.createdAt, storage: 'file' }
  }

  if (!isTripBooking) {
    try {
      await sendContactInquiryEmail(payload)
    } catch (err) {
      console.error('Failed to send contact inquiry email:', err)
    }
  } else {
    try {
      await sendTripBookingEmail(payload)
    } catch (err) {
      console.error('Failed to send trip booking email:', err)
    }
  }

  return res.status(201).json({
    success: true,
    message:
      payload.source === 'plan-my-trip'
        ? 'Thank you! Your trip request has been received. A Bhutan specialist will confirm your booking soon.'
        : 'Thank you! Your message has been received. A Bhutan specialist will be in touch soon.',
    data: saved,
  })
}

export const listInquiries = async (req, res) => {
  if (isDbConnected()) {
    const docs = await Inquiry.find().sort({ createdAt: 1 }).lean()
    const data = docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      email: d.email,
      phone: d.phone,
      interest: d.interest,
      message: d.message,
      source: d.source || 'contact',
      booking: d.booking || null,
      status: d.status,
      createdAt: d.createdAt,
    }))
    return res.json({ success: true, count: data.length, data })
  }

  const data = getInquiries()
  return res.json({ success: true, count: data.length, data })
}

function mapInquiry(doc) {
  return {
    id: String(doc._id || doc.id),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    interest: doc.interest,
    message: doc.message,
    source: doc.source || 'contact',
    booking: doc.booking || null,
    status: doc.status || 'new',
    createdAt: doc.createdAt,
  }
}

export const updateInquiryById = async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  const errors = []

  if (!ALLOWED_STATUSES.includes(status)) {
    errors.push('Invalid status.')
  }

  if (errors.length > 0) {
    res.status(400)
    return res.json({ success: false, message: 'Validation failed', errors })
  }

  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404)
      return res.json({ success: false, message: 'Inquiry not found' })
    }

    const doc = await Inquiry.findOneAndUpdate(
      { _id: id, source: { $ne: 'plan-my-trip' } },
      { $set: { status } },
      { new: true, runValidators: true }
    ).lean()

    if (!doc) {
      res.status(404)
      return res.json({ success: false, message: 'Inquiry not found' })
    }

    return res.json({ success: true, data: mapInquiry(doc) })
  }

  const existing = getInquiries().find((item) => item.id === id && item.source !== 'plan-my-trip')
  if (!existing) {
    res.status(404)
    return res.json({ success: false, message: 'Inquiry not found' })
  }

  const updated = updateInquiry(id, { status })
  return res.json({ success: true, data: mapInquiry(updated) })
}

export const deleteInquiryById = async (req, res) => {
  const { id } = req.params

  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404)
      return res.json({ success: false, message: 'Inquiry not found' })
    }

    const doc = await Inquiry.findOneAndDelete({ _id: id, source: { $ne: 'plan-my-trip' } }).lean()
    if (!doc) {
      res.status(404)
      return res.json({ success: false, message: 'Inquiry not found' })
    }

    return res.json({ success: true, message: 'Inquiry deleted.' })
  }

  const deleted = deleteInquiry(id, { excludeSource: 'plan-my-trip' })
  if (!deleted) {
    res.status(404)
    return res.json({ success: false, message: 'Inquiry not found' })
  }

  return res.json({ success: true, message: 'Inquiry deleted.' })
}

export const exportInquiriesCsv = async (_req, res) => {
  let rows = []

  if (isDbConnected()) {
    const docs = await Inquiry.find({ source: { $ne: 'plan-my-trip' } }).sort({ createdAt: -1 }).lean()
    rows = docs.map(mapInquiry)
  } else {
    rows = getInquiries()
      .filter((item) => item.source !== 'plan-my-trip')
      .map(mapInquiry)
      .reverse()
  }

  const csv = toCsv(rows, [
    { header: 'ID', value: 'id' },
    { header: 'Name', value: 'name' },
    { header: 'Email', value: 'email' },
    { header: 'Phone', value: (row) => row.phone || '' },
    { header: 'Interest', value: (row) => row.interest || '' },
    { header: 'Status', value: 'status' },
    { header: 'Message', value: 'message' },
    { header: 'Received', value: (row) => new Date(row.createdAt).toISOString() },
  ])

  res._contentType = 'text/csv; charset=utf-8'
  res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"')
  return res.status(200).send(csv)
}
