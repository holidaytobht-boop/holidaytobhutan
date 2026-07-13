import mongoose from 'mongoose'

const placeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
  },
  { _id: false }
)

const destinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    tagline: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' },
    altitude: { type: String, trim: true, default: '' },
    bestTime: { type: String, trim: true, default: '' },
    overview: { type: String, trim: true, default: '' },
    places: { type: [placeSchema], default: [] },
  },
  { timestamps: true }
)

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema)

export default Destination
