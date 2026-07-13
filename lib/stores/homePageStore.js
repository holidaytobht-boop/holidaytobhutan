import { homePageSeed } from '@/lib/seeds/homePage.js'

let page = JSON.parse(JSON.stringify(homePageSeed))

export const get = () => page

export const update = (next) => {
  page = next
}
