import Tour from '@/lib/models/Tour.js'
import Destination from '@/lib/models/Destination.js'
import TravelGuide from '@/lib/models/TravelGuide.js'
import AboutPage from '@/lib/models/AboutPage.js'
import ContactPage from '@/lib/models/ContactPage.js'
import HeroBanners from '@/lib/models/HeroBanners.js'
import HomePage from '@/lib/models/HomePage.js'
import Footer from '@/lib/models/Footer.js'
import { tours as tourSeed } from '@/lib/seeds/tours.js'
import { destinations as destinationSeed } from '@/lib/seeds/destinations.js'
import { travelGuideSeed } from '@/lib/seeds/travelGuide.js'
import { aboutPageSeed } from '@/lib/seeds/aboutPage.js'
import { contactPageSeed } from '@/lib/seeds/contactPage.js'
import { heroBannersSeed } from '@/lib/seeds/heroBanners.js'
import { homePageSeed } from '@/lib/seeds/homePage.js'
import { footerSeed } from '@/lib/seeds/footer.js'

const QUERY_TIMEOUT_MS = 5000

const countDocs = (model) => model.countDocuments().maxTimeMS(QUERY_TIMEOUT_MS)

export const seedTours = async () => {
  try {
    const count = await countDocs(Tour)
    if (count === 0) {
      await Tour.insertMany(tourSeed)
      console.log(`🌱  Seeded ${tourSeed.length} tours into MongoDB`)
    }
  } catch (err) {
    console.error(`⚠️  Tour seeding skipped: ${err.message}`)
  }
}

export const seedDestinations = async () => {
  try {
    const count = await countDocs(Destination)
    if (count === 0) {
      await Destination.insertMany(destinationSeed)
      console.log(`🌱  Seeded ${destinationSeed.length} destinations into MongoDB`)
    }
  } catch (err) {
    console.error(`⚠️  Destination seeding skipped: ${err.message}`)
  }
}

export const seedTravelGuide = async () => {
  try {
    const count = await countDocs(TravelGuide)
    if (count === 0) {
      await TravelGuide.create(travelGuideSeed)
      console.log('🌱  Seeded travel guide into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  Travel guide seeding skipped: ${err.message}`)
  }
}

export const seedAboutPage = async () => {
  try {
    const count = await countDocs(AboutPage)
    if (count === 0) {
      await AboutPage.create(aboutPageSeed)
      console.log('🌱  Seeded about page into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  About page seeding skipped: ${err.message}`)
  }
}

export const seedContactPage = async () => {
  try {
    const count = await countDocs(ContactPage)
    if (count === 0) {
      await ContactPage.create(contactPageSeed)
      console.log('🌱  Seeded contact page into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  Contact page seeding skipped: ${err.message}`)
  }
}

export const seedHeroBanners = async () => {
  try {
    const count = await countDocs(HeroBanners)
    if (count === 0) {
      await HeroBanners.create(heroBannersSeed)
      console.log('🌱  Seeded hero banners into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  Hero banners seeding skipped: ${err.message}`)
  }
}

export const seedHomePage = async () => {
  try {
    const count = await countDocs(HomePage)
    if (count === 0) {
      await HomePage.create(homePageSeed)
      console.log('🌱  Seeded home page into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  Home page seeding skipped: ${err.message}`)
  }
}

export const seedFooter = async () => {
  try {
    const count = await countDocs(Footer)
    if (count === 0) {
      await Footer.create(footerSeed)
      console.log('🌱  Seeded footer into MongoDB')
    }
  } catch (err) {
    console.error(`⚠️  Footer seeding skipped: ${err.message}`)
  }
}
