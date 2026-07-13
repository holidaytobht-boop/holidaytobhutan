import { loadJson, saveJson } from '@/lib/stores/persist.js'

const FILE = 'admin-credentials.json'
const globalForCreds = globalThis

export const get = () => {
  const fromDisk = loadJson(FILE, null)
  globalForCreds._adminCredentialsCache = fromDisk
  return fromDisk
}

export const save = (next) => {
  globalForCreds._adminCredentialsCache = next
  saveJson(FILE, next)
}
