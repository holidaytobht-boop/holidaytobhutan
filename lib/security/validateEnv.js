export function validateRequiredEnv() {
  const errors = []
  const authSecret = process.env.AUTH_SECRET?.trim()

  if (!authSecret || authSecret.length < 32) {
    errors.push('AUTH_SECRET must be set in .env (at least 32 characters).')
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminPassword.length < 12) {
    errors.push('ADMIN_PASSWORD must be set in .env (at least 12 characters).')
  }

  if (!process.env.ADMIN_EMAIL?.trim()) {
    errors.push('ADMIN_EMAIL must be set in .env.')
  }

  if (errors.length > 0) {
    throw new Error(`Environment misconfiguration:\n- ${errors.join('\n- ')}`)
  }
}
