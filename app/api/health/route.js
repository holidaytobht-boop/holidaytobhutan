import { config } from '@/lib/db/env.js'
import { ensureDb } from '@/lib/db/ensure.js'

export async function GET() {
  if (config.nodeEnv === 'production') {
    return Response.json({ status: 'ok' })
  }

  const connected = await ensureDb()
  return Response.json({
    status: 'ok',
    database: connected ? 'connected' : 'disconnected',
    storage: connected ? 'mongodb' : 'local-file',
  })
}
