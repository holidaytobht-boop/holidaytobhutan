import { travelGuideSeed } from '@/lib/seeds/travelGuide.js'

let guide = JSON.parse(JSON.stringify(travelGuideSeed))

export const get = () => guide

export const update = (changes) => {
  guide = changes
  return guide
}
