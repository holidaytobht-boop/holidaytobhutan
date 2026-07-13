import nodemailer from 'nodemailer'
import { config } from '@/lib/db/env.js'

let transporter

function getTransporter() {
  if (!config.smtp.user || !config.smtp.pass) return null

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })
  }

  return transporter
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sanitizeSubjectPart(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim().slice(0, 120)
}

function buildInquiryContent(inquiry) {
  const { name, email, phone, interest, message } = inquiry
  const lines = [
    'New contact message from Holiday to Bhutan website',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    interest ? `Interest: ${interest}` : null,
    '',
    'Message:',
    message,
  ].filter((line) => line !== null)

  const text = lines.join('\n')
  const html = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
    ${interest ? `<p><strong>Interest:</strong> ${escapeHtml(interest)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `

  return { name, email, text, html }
}

function buildTripBookingContent(inquiry) {
  const booking = inquiry.booking || {}
  const lines = [
    'New Plan My Trip request from Holiday to Bhutan website',
    '',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    booking.whatsapp ? `WhatsApp: ${booking.whatsapp}` : null,
    booking.tripTitle ? `Trip: ${booking.tripTitle}` : null,
    booking.travelDate ? `Travel date: ${booking.travelDate}` : null,
    booking.tripDuration ? `Duration: ${booking.tripDuration}` : null,
    booking.adults ? `Adults: ${booking.adults}` : null,
    booking.children ? `Children: ${booking.children}` : null,
    booking.nationality ? `Nationality: ${booking.nationality}` : null,
    booking.travelRoute ? `Route: ${booking.travelRoute}` : null,
    booking.airTicketClass ? `Flight class: ${booking.airTicketClass}` : null,
    booking.hotelAccommodation ? `Hotel: ${booking.hotelAccommodation}` : null,
    Array.isArray(booking.travelInterests) && booking.travelInterests.length
      ? `Interests: ${booking.travelInterests.join(', ')}`
      : null,
    '',
    'Message:',
    inquiry.message,
  ].filter((line) => line !== null)

  const text = lines.join('\n')
  const html = `
    <h2>New Plan My Trip request</h2>
    <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></p>
    ${booking.whatsapp ? `<p><strong>WhatsApp:</strong> ${escapeHtml(booking.whatsapp)}</p>` : ''}
    ${booking.tripTitle ? `<p><strong>Trip:</strong> ${escapeHtml(booking.tripTitle)}</p>` : ''}
    ${booking.travelDate ? `<p><strong>Travel date:</strong> ${escapeHtml(booking.travelDate)}</p>` : ''}
    ${booking.tripDuration ? `<p><strong>Duration:</strong> ${escapeHtml(booking.tripDuration)}</p>` : ''}
    ${booking.nationality ? `<p><strong>Nationality:</strong> ${escapeHtml(booking.nationality)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
  `

  return { name: inquiry.name, email: inquiry.email, text, html }
}

async function sendViaWeb3Forms({ subject, name, email, phone, message, extra = {} }) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: config.web3formsAccessKey,
      subject,
      from_name: 'Holiday to Bhutan Website',
      name,
      email,
      phone: phone || '',
      message,
      ...extra,
    }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || `Web3Forms request failed (${res.status})`)
  }

  return true
}

async function sendViaSmtp({ subject, replyTo, text, html }) {
  const transport = getTransporter()
  if (!transport) return false

  await transport.sendMail({
    from: `"Holiday to Bhutan" <${config.smtp.user}>`,
    to: config.contactEmail,
    replyTo,
    subject,
    text,
    html,
  })

  return true
}

async function dispatchEmail({ subject, replyTo, text, html, web3formsPayload }) {
  if (config.web3formsAccessKey) {
    await sendViaWeb3Forms({ subject, ...web3formsPayload })
    return true
  }

  if (config.smtp.user && config.smtp.pass) {
    await sendViaSmtp({ subject, replyTo, text, html })
    return true
  }

  console.warn(
    '⚠️  Email not sent — configure WEB3FORMS_ACCESS_KEY (easiest) or SMTP_USER + SMTP_PASS in .env'
  )
  return false
}

export async function sendContactInquiryEmail(inquiry) {
  const { name, email, text, html } = buildInquiryContent(inquiry)
  const subject = `New contact message from ${sanitizeSubjectPart(name)}`

  return dispatchEmail({
    subject,
    replyTo: email,
    text,
    html,
    web3formsPayload: {
      name,
      email,
      phone: inquiry.phone || '',
      message: inquiry.message,
      interest: inquiry.interest || '',
    },
  })
}

export async function sendTripBookingEmail(inquiry) {
  const { name, email, text, html } = buildTripBookingContent(inquiry)
  const booking = inquiry.booking || {}
  const subject = `New trip request from ${sanitizeSubjectPart(name)}`

  return dispatchEmail({
    subject,
    replyTo: email,
    text,
    html,
    web3formsPayload: {
      name,
      email,
      phone: booking.whatsapp || '',
      message: text,
      trip_title: booking.tripTitle || '',
      travel_date: booking.travelDate || '',
    },
  })
}
