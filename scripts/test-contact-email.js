const fs = require('fs')
const path = require('path')

function loadEnv() {
  const files = ['.env.local', '.env']
  for (const file of files) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line || line.startsWith('#') || !line.includes('=')) continue
      const index = line.indexOf('=')
      const key = line.slice(0, index).trim()
      const value = line.slice(index + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnv()

const web3forms = process.env.WEB3FORMS_ACCESS_KEY?.trim()
const smtpUser = process.env.SMTP_USER?.trim()
const smtpPass = process.env.SMTP_PASS?.trim()

if (!web3forms && !(smtpUser && smtpPass)) {
  console.error('Email is not configured.')
  console.error('Add WEB3FORMS_ACCESS_KEY to .env (easiest): https://web3forms.com')
  console.error('Or set SMTP_USER + SMTP_PASS for Gmail SMTP.')
  process.exit(1)
}

async function main() {
  const { sendContactInquiryEmail } = await import('../lib/services/email.js')

  try {
    const sent = await sendContactInquiryEmail({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+975 00000000',
      interest: 'Cultural Tours',
      message: 'This is a test message from scripts/test-contact-email.js',
    })

    if (sent) {
      console.log('Test email sent. Check holidaytobht@gmail.com (inbox and spam).')
    } else {
      console.error('Email was not sent — check configuration.')
      process.exit(1)
    }
  } catch (err) {
    console.error('Failed to send test email:', err.message)
    process.exit(1)
  }
}

main()
