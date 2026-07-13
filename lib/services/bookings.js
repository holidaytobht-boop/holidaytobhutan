import mongoose from 'mongoose'
import Inquiry from '@/lib/models/Inquiry.js'
import { isDbConnected } from '@/lib/db/connect.js'
import { getInquiries, updateInquiry, deleteInquiry } from '@/lib/stores/inquiries.js'
import { syncInquiryFieldsFromBooking } from '@/lib/utils/booking.js'
import { toCsv } from '@/lib/utils/csv.js'

const ALLOWED_STATUSES = ['new', 'contacted', 'closed']
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function isLegacyBooking(booking = {}) {
  return Boolean(booking.personal || booking.travel || booking.passport || booking.preferences)
}

export function mapBooking(doc) {
  const booking = doc.booking || {}

  if (isLegacyBooking(booking)) {
    const personal = booking.personal || {}
    const travel = booking.travel || {}

    return {
      id: String(doc._id || doc.id),
      name: doc.name || personal.fullName || '',
      email: doc.email || personal.email || '',
      phone: doc.phone || personal.phone || null,
      tripTitle: travel.tripType || null,
      travelInterest: travel.tripType || doc.interest || null,
      travelers: travel.travelers || null,
      travelDate: travel.travelDateStart || null,
      tripDuration: travel.duration || null,
      nationality: personal.nationality || null,
      status: doc.status || 'new',
      booking,
      createdAt: doc.createdAt,
    }
  }

  return {
    id: String(doc._id || doc.id),
    name: doc.name || booking.name || '',
    email: doc.email || booking.email || '',
    phone: doc.phone || booking.whatsapp || null,
    tripTitle: booking.tripTitle || null,
    travelInterest: booking.travelInterest || null,
    travelInterests: Array.isArray(booking.travelInterests) ? booking.travelInterests : [],
    travelers: booking.travelers || null,
    travelDate: booking.travelDate || null,
    tripDuration: booking.tripDuration || null,
    adults: booking.adults || null,
    children: booking.children || null,
    nationality: booking.nationality || null,
    travelRoute: booking.travelRoute || null,
    airTicketClass: booking.airTicketClass || null,
    hotelAccommodation: booking.hotelAccommodation || null,
    message: booking.message || null,
    status: doc.status || 'new',
    booking,
    createdAt: doc.createdAt,
  }
}

export const listBookings = async (_req, res) => {
  if (isDbConnected()) {
    const docs = await Inquiry.find({ source: 'plan-my-trip' }).sort({ createdAt: -1 }).lean()
    const data = docs.map(mapBooking)
    return res.json({ success: true, count: data.length, data })
  }

  const data = getInquiries()
    .filter((item) => item.source === 'plan-my-trip')
    .map(mapBooking)
    .reverse()

  return res.json({ success: true, count: data.length, data })
}

function buildUpdates(body = {}) {
  const updates = {}
  const errors = []

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      errors.push('Invalid status.')
    } else {
      updates.status = body.status
    }
  }

  if (body.booking !== undefined) {
    const booking = body.booking || {}

    if (isLegacyBooking(booking)) {
      const personal = booking.personal || {}
      const fullName = (personal.fullName || '').trim()
      const email = (personal.email || '').trim()

      if (!fullName) errors.push('Full name is required.')
      if (!email || !isValidEmail(email)) errors.push('A valid email is required.')
    } else {
      const name = (booking.name || '').trim()
      const email = (booking.email || '').trim()

      if (!name) errors.push('Name is required.')
      if (!email || !isValidEmail(email)) errors.push('A valid email is required.')
    }

    if (errors.length === 0) {
      Object.assign(updates, syncInquiryFieldsFromBooking(booking))
    }
  }

  return { updates, errors }
}

export const updateBooking = async (req, res) => {
  const { id } = req.params
  const { updates, errors } = buildUpdates(req.body || {})

  if (Object.keys(updates).length === 0 && errors.length === 0) {
    res.status(400)
    return res.json({ success: false, message: 'No valid fields to update.' })
  }

  if (errors.length > 0) {
    res.status(400)
    return res.json({ success: false, message: 'Validation failed', errors })
  }

  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404)
      return res.json({ success: false, message: 'Booking not found' })
    }

    const doc = await Inquiry.findOneAndUpdate(
      { _id: id, source: 'plan-my-trip' },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean()

    if (!doc) {
      res.status(404)
      return res.json({ success: false, message: 'Booking not found' })
    }

    return res.json({ success: true, data: mapBooking(doc) })
  }

  const existing = getInquiries().find((item) => item.id === id && item.source === 'plan-my-trip')
  if (!existing) {
    res.status(404)
    return res.json({ success: false, message: 'Booking not found' })
  }

  const updated = updateInquiry(id, updates)
  return res.json({ success: true, data: mapBooking(updated) })
}

export const deleteBooking = async (req, res) => {
  const { id } = req.params

  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404)
      return res.json({ success: false, message: 'Booking not found' })
    }

    const doc = await Inquiry.findOneAndDelete({ _id: id, source: 'plan-my-trip' }).lean()
    if (!doc) {
      res.status(404)
      return res.json({ success: false, message: 'Booking not found' })
    }

    return res.json({ success: true, message: 'Booking deleted.' })
  }

  const deleted = deleteInquiry(id, { onlySource: 'plan-my-trip' })
  if (!deleted) {
    res.status(404)
    return res.json({ success: false, message: 'Booking not found' })
  }

  return res.json({ success: true, message: 'Booking deleted.' })
}

export const exportBookingsCsv = async (_req, res) => {
  let rows = []

  if (isDbConnected()) {
    const docs = await Inquiry.find({ source: 'plan-my-trip' }).sort({ createdAt: -1 }).lean()
    rows = docs.map(mapBooking)
  } else {
    rows = getInquiries()
      .filter((item) => item.source === 'plan-my-trip')
      .map(mapBooking)
      .reverse()
  }

  const csv = toCsv(rows, [
    { header: 'ID', value: 'id' },
    { header: 'Name', value: 'name' },
    { header: 'Email', value: 'email' },
    { header: 'Phone', value: (row) => row.phone || '' },
    { header: 'Trip', value: (row) => row.tripTitle || '' },
    { header: 'Travel Date', value: (row) => row.travelDate || '' },
    { header: 'Duration', value: (row) => row.tripDuration || '' },
    { header: 'Nationality', value: (row) => row.nationality || '' },
    { header: 'Status', value: 'status' },
    { header: 'Message', value: (row) => row.message || '' },
    { header: 'Received', value: (row) => new Date(row.createdAt).toISOString() },
  ])

  res._contentType = 'text/csv; charset=utf-8'
  res.setHeader('Content-Disposition', 'attachment; filename="trip-bookings.csv"')
  return res.status(200).send(csv)
}
