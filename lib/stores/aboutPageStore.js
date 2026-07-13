import { aboutPageSeed } from '@/lib/seeds/aboutPage.js'

let page = JSON.parse(JSON.stringify(aboutPageSeed))

export const get = () => page

export const update = (changes) => {
  page = changes
  return page
}
