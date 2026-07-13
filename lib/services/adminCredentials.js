import AdminCredentials from '@/lib/models/AdminCredentials.js'
import { isDbConnected } from '@/lib/db/connect.js'
import { config } from '@/lib/db/env.js'
import * as adminCredentialsStore from '@/lib/stores/adminCredentialsStore.js'
import { hashPassword, verifyPassword } from '@/lib/utils/password.js'
import { validatePasswordStrength } from '@/lib/security/passwordPolicy.js'

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function getStored() {
  if (isDbConnected()) {
    const doc = await AdminCredentials.findOne().lean()
    if (doc?.email && doc?.salt && doc?.passwordHash) {
      return {
        email: doc.email,
        salt: doc.salt,
        passwordHash: doc.passwordHash,
        tokenVersion: doc.tokenVersion ?? 0,
      }
    }
  }

  const local = adminCredentialsStore.get()
  if (local?.email && local?.salt && local?.passwordHash) {
    return {
      ...local,
      tokenVersion: local.tokenVersion ?? 0,
    }
  }
  return null
}

async function saveCredentials(email, password, { bumpTokenVersion = true } = {}) {
  const { salt, passwordHash } = hashPassword(password)
  const existing = await getStored()
  const tokenVersion = bumpTokenVersion
    ? (existing?.tokenVersion ?? 0) + 1
    : (existing?.tokenVersion ?? 0)

  const payload = { email, salt, passwordHash, tokenVersion }

  if (isDbConnected()) {
    await AdminCredentials.findOneAndUpdate({}, payload, { new: true, upsert: true })
  } else {
    adminCredentialsStore.save(payload)
  }

  return payload
}

/** Bootstrap hashed credentials from env on first run — no plaintext comparison at login. */
export async function ensureAdminCredentials() {
  const stored = await getStored()
  if (stored) return stored

  if (!config.adminEmail || !config.adminPassword) {
    console.warn('⚠️  Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.')
    return null
  }

  console.log('🔐  Bootstrapping admin credentials from environment…')
  return saveCredentials(config.adminEmail.trim().toLowerCase(), config.adminPassword, {
    bumpTokenVersion: false,
  })
}

export async function getCurrentAdminEmail() {
  const stored = await getStored()
  return stored?.email || config.adminEmail
}

export async function getTokenVersion() {
  const stored = await getStored()
  return stored?.tokenVersion ?? 0
}

export async function verifyAdminCredentials(email, password) {
  await ensureAdminCredentials()
  const stored = await getStored()
  if (!stored) return false

  if (email.trim().toLowerCase() !== stored.email.toLowerCase()) return false
  return verifyPassword(password, stored.salt, stored.passwordHash)
}

export const getAdminAccount = async (req, res) => {
  const email = await getCurrentAdminEmail()
  return res.json({ success: true, data: { email } })
}

export const updateAdminAccount = async (req, res) => {
  const sessionEmail = req.sessionEmail
  const { currentPassword, newEmail, newPassword, confirmPassword } = req.body || {}
  const errors = []

  if (!currentPassword) errors.push('Current password is required.')
  if (!newEmail?.trim()) errors.push('New email is required.')
  else if (!isValidEmail(newEmail.trim())) errors.push('Enter a valid email address.')
  if (!newPassword) errors.push('New password is required.')
  else errors.push(...validatePasswordStrength(newPassword))
  if (!confirmPassword) errors.push('Please confirm your new password.')
  else if (newPassword !== confirmPassword) errors.push('New passwords do not match.')

  if (errors.length > 0) {
    res.status(400)
    return res.json({ success: false, message: 'Validation failed', errors })
  }

  const valid = await verifyAdminCredentials(sessionEmail, currentPassword)
  if (!valid) {
    res.status(401)
    return res.json({ success: false, message: 'Current password is incorrect.' })
  }

  const email = newEmail.trim().toLowerCase()
  await saveCredentials(email, newPassword, { bumpTokenVersion: true })

  return res.json({
    success: true,
    message: 'Login credentials updated successfully. Other sessions have been signed out.',
    data: { email },
  })
}
