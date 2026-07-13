import { getLockoutEntry, setLockoutEntry } from '@/lib/security/persistentStore.js'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCKOUT_MS = 30 * 60 * 1000

const globalForLockout = globalThis

if (!globalForLockout._loginLockoutState) {
  globalForLockout._loginLockoutState = new Map()
}

const state = globalForLockout._loginLockoutState

function loadEntry(ip) {
  if (state.has(ip)) return state.get(ip)
  const persisted = getLockoutEntry(ip)
  if (persisted) {
    state.set(ip, persisted)
    return persisted
  }
  return null
}

function saveEntry(ip, entry) {
  if (entry === null) {
    state.delete(ip)
    setLockoutEntry(ip, null)
    return
  }
  state.set(ip, entry)
  setLockoutEntry(ip, entry)
}

function getEntry(ip) {
  const existing = loadEntry(ip)
  if (existing) return existing
  const entry = { attempts: [], lockedUntil: 0 }
  saveEntry(ip, entry)
  return entry
}

export function isLoginLocked(ip) {
  const entry = getEntry(ip)
  const now = Date.now()

  if (entry.lockedUntil > now) {
    return { locked: true, retryAfterMs: entry.lockedUntil - now }
  }

  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.attempts = []
    entry.lockedUntil = 0
    saveEntry(ip, entry)
  }

  return { locked: false }
}

export function recordFailedLogin(ip) {
  const entry = getEntry(ip)
  const now = Date.now()

  entry.attempts = entry.attempts.filter((t) => now - t < WINDOW_MS)
  entry.attempts.push(now)

  if (entry.attempts.length >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS
    entry.attempts = []
  }

  saveEntry(ip, entry)
}

export function clearLoginAttempts(ip) {
  saveEntry(ip, null)
}
