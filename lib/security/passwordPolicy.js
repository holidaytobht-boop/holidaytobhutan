import { config } from '@/lib/db/env.js'

const MIN_LEN = config.nodeEnv === 'production' ? 12 : 8

export function validatePasswordStrength(password) {
  const errors = []

  if (!password || password.length < MIN_LEN) {
    errors.push(`Password must be at least ${MIN_LEN} characters.`)
  }
  if (!/[a-z]/.test(password || '')) {
    errors.push('Password must include a lowercase letter.')
  }
  if (!/[A-Z]/.test(password || '')) {
    errors.push('Password must include an uppercase letter.')
  }
  if (!/[0-9]/.test(password || '')) {
    errors.push('Password must include a number.')
  }
  if (!/[^A-Za-z0-9]/.test(password || '')) {
    errors.push('Password must include a symbol.')
  }

  return errors
}
