import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')

export function loadJson(filename, fallback) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (!existsSync(filePath)) return fallback
    const raw = readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJson(filename, data) {
  try {
    mkdirSync(DATA_DIR, { recursive: true })
    writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error(`Failed to persist ${filename}:`, err.message)
  }
}

export function getFileModifiedTime(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (!existsSync(filePath)) return 0
    return statSync(filePath).mtimeMs
  } catch {
    return 0
  }
}
