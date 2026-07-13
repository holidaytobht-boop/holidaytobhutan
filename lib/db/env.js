function normalizeOrigin(value) {
  return typeof value === 'string' ? value.trim().replace(/\/+$/, '') : ''
}

const nodeEnv = process.env.NODE_ENV || 'development'
const explicitClientOrigin = process.env.CLIENT_ORIGIN?.trim()

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv,
  clientOrigins: explicitClientOrigin
    ? explicitClientOrigin.split(',').map(normalizeOrigin).filter(Boolean)
    : nodeEnv === 'production'
      ? []
      : [normalizeOrigin('http://localhost:3000')],
  clientOriginsExplicit: Boolean(explicitClientOrigin),
  mongoUri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || 'holidaytobhutan',
  adminEmail: process.env.ADMIN_EMAIL?.trim() || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  authSecret: process.env.AUTH_SECRET || '',
  contactEmail: process.env.CONTACT_EMAIL_TO || 'holidaytobht@gmail.com',
  web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  trustProxy: process.env.TRUST_PROXY === 'true',
  googlePlaces: {
    apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    placeId: process.env.GOOGLE_PLACE_ID || '',
    cacheTtlMs: Number(process.env.GOOGLE_REVIEWS_CACHE_TTL_MS) || 60 * 60 * 1000,
  },
}
