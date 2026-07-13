export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureDb } = await import('./lib/db/ensure.js')
    ensureDb().catch((err) => {
      console.error(`⚠️  Database init failed: ${err.message}`)
    })
  }
}
