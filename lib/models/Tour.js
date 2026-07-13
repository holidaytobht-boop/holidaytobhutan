import mongoose from 'mongoose'

const pricingTierSchema = new mongoose.Schema(
  {
    group: { type: String, trim: true, default: '' },
    price: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: 'per person' },
  },
  { _id: false }
)

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    desc: { type: String, trim: true, default: '' },
  },
  { _id: false }
)

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
  },
  { _id: false }
)

const packageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    durationDays: { type: Number, default: 0 },
    fromPriceUsd: { type: Number, default: 0 },
    // Detail-page fields
    tagline: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    groupSize: { type: String, trim: true, default: '' },
    bestSeason: { type: String, trim: true, default: '' },
    overview: { type: String, trim: true, default: '' },
    pricingNote: { type: String, trim: true, default: '' },
    pricing: { type: [pricingTierSchema], default: [] },
    highlights: { type: [highlightSchema], default: [] },
    itinerary: { type: [itineraryDaySchema], default: [] },
  },
  { _id: false }
)

const tourSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    overview: { type: String, trim: true, default: '' },
    highlights: { type: [highlightSchema], default: [] },
    packages: { type: [packageSchema], default: [] },
  },
  { timestamps: true }
)

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema)

export default Tour
