import { loadJson, saveJson } from '@/lib/stores/persist.js'

const FILE = 'security-state.json'

const globalForStore = globalThis

function loadState() {
  if (!globalForStore._securityState) {
    globalForStore._securityState = loadJson(FILE, { rateLimits: {}, loginLockout: {} })
  }
  return globalForStore._securityState
}

function persistState() {
  saveJson(FILE, loadState())
}

export function getPersistentBucket(namespace, key) {
  const state = loadState()
  const bucketKey = `${namespace}:${key}`
  return state.rateLimits[bucketKey] || null
}

export function setPersistentBucket(namespace, key, entry) {
  const state = loadState()
  const bucketKey = `${namespace}:${key}`
  if (entry === null) {
    delete state.rateLimits[bucketKey]
  } else {
    state.rateLimits[bucketKey] = entry
  }
  persistState()
}

export function getLockoutEntry(ip) {
  const state = loadState()
  return state.loginLockout[ip] || null
}

export function setLockoutEntry(ip, entry) {
  const state = loadState()
  if (entry === null) {
    delete state.loginLockout[ip]
  } else {
    state.loginLockout[ip] = entry
  }
  persistState()
}
