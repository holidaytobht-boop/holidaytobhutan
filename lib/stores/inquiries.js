import { randomUUID } from 'node:crypto'
import { loadJson, saveJson } from '@/lib/stores/persist.js'

const FILE = 'inquiries.json'

const globalForInquiries = globalThis

if (!globalForInquiries._inquiriesCache) {
  globalForInquiries._inquiriesCache = loadJson(FILE, [])
}

let inquiries = globalForInquiries._inquiriesCache

function persist() {
  saveJson(FILE, inquiries)
  globalForInquiries._inquiriesCache = inquiries
}

export const addInquiry = (data) => {
  const inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new',
    source: 'contact',
    ...data,
  }
  inquiries.push(inquiry)
  persist()
  return inquiry
}

export const getInquiries = () => [...inquiries]

export const updateInquiry = (id, updates) => {
  const index = inquiries.findIndex((item) => item.id === id)
  if (index === -1) return null
  inquiries[index] = { ...inquiries[index], ...updates }
  persist()
  return inquiries[index]
}

export const deleteInquiry = (id, { onlySource = null, excludeSource = null } = {}) => {
  const index = inquiries.findIndex((item) => {
    if (item.id !== id) return false
    if (onlySource && item.source !== onlySource) return false
    if (excludeSource && item.source === excludeSource) return false
    return true
  })
  if (index === -1) return false
  inquiries.splice(index, 1)
  persist()
  return true
}
