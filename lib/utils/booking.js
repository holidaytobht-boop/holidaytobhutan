const section = (title, lines) => {
  const body = lines.filter(Boolean).join('\n')
  return body ? `${title}\n${body}` : ''
}

function isLegacyBooking(booking = {}) {
  return Boolean(booking.personal || booking.travel || booking.passport || booking.preferences)
}

function buildLegacyBookingMessage(booking = {}) {
  const personal = booking.personal || {}
  const travel = booking.travel || {}
  const passport = booking.passport || {}
  const preferences = booking.preferences || {}

  const parts = [
    'Plan My Trip — Booking Request',
    section('PERSONAL DETAILS', [
      personal.fullName && `Full Name: ${personal.fullName}`,
      personal.email && `Email: ${personal.email}`,
      personal.phone && `Phone: ${personal.phone}`,
      personal.nationality && `Nationality: ${personal.nationality}`,
      personal.dateOfBirth && `Date of Birth: ${personal.dateOfBirth}`,
    ]),
    section('TRAVEL INFORMATION', [
      travel.tripType && `Trip Type: ${travel.tripType}`,
      travel.travelers && `Travellers: ${travel.travelers}`,
      travel.travelDateStart && `Start Date: ${travel.travelDateStart}`,
      travel.travelDateEnd && `End Date: ${travel.travelDateEnd}`,
      travel.duration && `Duration: ${travel.duration}`,
      travel.budget && `Budget: ${travel.budget}`,
    ]),
    section('PASSPORT & DOCUMENTS', [
      passport.passportNumber && `Passport Number: ${passport.passportNumber}`,
      passport.passportExpiry && `Passport Expiry: ${passport.passportExpiry}`,
      passport.passportCountry && `Issuing Country: ${passport.passportCountry}`,
      passport.emergencyContactName && `Emergency Contact: ${passport.emergencyContactName}`,
      passport.emergencyContactPhone && `Emergency Phone: ${passport.emergencyContactPhone}`,
    ]),
    section('PREFERENCES & SPECIAL REQUESTS', [
      preferences.dietaryRequirements && `Dietary Requirements: ${preferences.dietaryRequirements}`,
      preferences.accessibilityNeeds && `Accessibility Needs: ${preferences.accessibilityNeeds}`,
      preferences.accommodationPreference && `Accommodation: ${preferences.accommodationPreference}`,
      preferences.specialRequests && `Special Requests: ${preferences.specialRequests}`,
    ]),
  ].filter(Boolean)

  return parts.join('\n\n')
}

function formatTravelInterests(booking = {}) {
  if (Array.isArray(booking.travelInterests) && booking.travelInterests.length) {
    return booking.travelInterests.join('; ')
  }
  return booking.travelInterest || ''
}

export function buildBookingMessage(booking = {}) {
  if (isLegacyBooking(booking)) {
    return buildLegacyBookingMessage(booking)
  }

  const parts = [
    'Plan My Trip — Trip Request',
    section('CONTACT DETAILS', [
      booking.name && `Name: ${booking.name}`,
      booking.email && `Email: ${booking.email}`,
      booking.whatsapp && `WhatsApp: ${booking.whatsapp}`,
      booking.nationality && `Nationality: ${booking.nationality}`,
    ]),
    section('TRIP DETAILS', [
      booking.tripTitle && `Trip Title: ${booking.tripTitle}`,
      booking.travelDate && `Travel Date: ${booking.travelDate}`,
      booking.tripDuration && `Trip Duration: ${booking.tripDuration}`,
      booking.adults && `Adults: ${booking.adults}`,
      booking.children && `Children: ${booking.children}`,
      booking.travelers && `Travellers: ${booking.travelers}`,
      booking.travelRoute && `Travel Route: ${booking.travelRoute}`,
      booking.airTicketClass && `Air Ticket Class: ${booking.airTicketClass}`,
      booking.hotelAccommodation && `Hotel & Accommodations: ${booking.hotelAccommodation}`,
      formatTravelInterests(booking) && `Travel Interest: ${formatTravelInterests(booking)}`,
    ]),
    booking.message ? section('MESSAGE', [booking.message]) : '',
  ].filter(Boolean)

  return parts.join('\n\n')
}

export function syncInquiryFieldsFromBooking(booking = {}) {
  if (isLegacyBooking(booking)) {
    const personal = booking.personal || {}
    const travel = booking.travel || {}

    return {
      name: (personal.fullName || '').trim(),
      email: (personal.email || '').trim().toLowerCase(),
      phone: (personal.phone || '').trim() || null,
      interest: (travel.tripType || '').trim() || null,
      message: buildBookingMessage(booking),
      booking,
    }
  }

  return {
    name: (booking.name || '').trim(),
    email: (booking.email || '').trim().toLowerCase(),
    phone: (booking.whatsapp || '').trim() || null,
    interest:
      formatTravelInterests(booking).trim() ||
      (booking.tripTitle || '').trim() ||
      null,
    message: buildBookingMessage(booking),
    booking,
  }
}

export function normalizeBookingPayload(body = {}) {
  if (body.source !== 'plan-my-trip') {
    return {
      name: (body.name || '').trim(),
      email: (body.email || '').trim(),
      phone: (body.phone || '').trim() || null,
      interest: (body.interest || '').trim() || null,
      message: (body.message || '').trim(),
      source: 'contact',
      booking: null,
    }
  }

  const booking = body.booking || {}

  if (isLegacyBooking(booking)) {
    const personal = booking.personal || {}
    const travel = booking.travel || {}

    const name = (personal.fullName || body.name || '').trim()
    const email = (personal.email || body.email || '').trim()
    const phone = (personal.phone || body.phone || '').trim()
    const interest = (travel.tripType || body.interest || '').trim()
    const message = buildBookingMessage(booking) || (body.message || '').trim()

    return {
      name,
      email,
      phone: phone || null,
      interest: interest || null,
      message,
      source: body.source === 'plan-my-trip' ? 'plan-my-trip' : 'contact',
      booking: body.source === 'plan-my-trip' ? booking : null,
    }
  }

  const name = (booking.name || body.name || '').trim()
  const email = (booking.email || body.email || '').trim()
  const phone = (booking.whatsapp || body.phone || '').trim()
  const interest =
    formatTravelInterests(booking).trim() ||
    (booking.tripTitle || body.interest || '').trim()
  const message = buildBookingMessage(booking) || (body.message || '').trim()

  return {
    name,
    email,
    phone: phone || null,
    interest: interest || null,
    message,
    source: body.source === 'plan-my-trip' ? 'plan-my-trip' : 'contact',
    booking: body.source === 'plan-my-trip' ? booking : null,
  }
}
