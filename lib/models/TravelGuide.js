import mongoose from 'mongoose'

const factSchema = new mongoose.Schema(
  { label: { type: String, default: '' }, value: { type: String, default: '' } },
  { _id: false }
)

const cardSchema = new mongoose.Schema(
  { title: { type: String, default: '' }, body: { type: String, default: '' } },
  { _id: false }
)

const seasonSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    months: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { _id: false }
)

const faqSchema = new mongoose.Schema(
  { q: { type: String, default: '' }, a: { type: String, default: '' } },
  { _id: false }
)

const travelGuideSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    about: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      paragraphs: { type: [String], default: [] },
      facts: { type: [factSchema], default: [] },
    },
    visaSdf: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      cards: { type: [cardSchema], default: [] },
    },
    seasons: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [seasonSchema], default: [] },
    },
    trekking: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      tips: { type: [String], default: [] },
    },
    packing: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [String], default: [] },
    },
    faqs: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [faqSchema], default: [] },
    },
  },
  { timestamps: true }
)

const TravelGuide = mongoose.models.TravelGuide || mongoose.model('TravelGuide', travelGuideSchema)

export default TravelGuide
