import mongoose from 'mongoose'

const slideSchema = new mongoose.Schema(
  {
    headline: { type: String, default: '' },
    subheading: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { _id: false }
)

const pageHeroSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
  },
  { _id: false }
)

const heroBannersSchema = new mongoose.Schema(
  {
    home: {
      eyebrow: { type: String, default: '' },
      slides: { type: [slideSchema], default: [] },
    },
    toursPage: { type: pageHeroSchema, default: () => ({}) },
    destinationsPage: { type: pageHeroSchema, default: () => ({}) },
    aboutPage: { type: pageHeroSchema, default: () => ({}) },
    contactPage: { type: pageHeroSchema, default: () => ({}) },
    travelGuidePage: { type: pageHeroSchema, default: () => ({}) },
  },
  { timestamps: true }
)

const HeroBanners = mongoose.models.HeroBanners || mongoose.model('HeroBanners', heroBannersSchema)

export default HeroBanners
