import { contactPageSeed } from '@/lib/seeds/contactPage.js'

let page = JSON.parse(JSON.stringify(contactPageSeed))

export const get = () => page

export const update = (next) => {
  page = next
}
