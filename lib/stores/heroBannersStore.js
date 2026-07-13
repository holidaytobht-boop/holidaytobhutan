import { heroBannersSeed } from '@/lib/seeds/heroBanners.js'
import { loadJson, saveJson } from '@/lib/stores/persist.js'

const FILE = 'heroBanners.json'

let data = loadJson(FILE, JSON.parse(JSON.stringify(heroBannersSeed)))

export const get = () => data

export const update = (next) => {
  data = next
  saveJson(FILE, data)
}

export const reset = () => {
  data = JSON.parse(JSON.stringify(heroBannersSeed))
  saveJson(FILE, data)
}
