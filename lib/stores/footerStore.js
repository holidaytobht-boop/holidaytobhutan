import { footerSeed } from '@/lib/seeds/footer.js'

let footer = JSON.parse(JSON.stringify(footerSeed))

export const get = () => footer

export const update = (next) => {
  footer = next
}
