import mongoose from 'mongoose'

const galleryPhotoSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    trip: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { _id: false }
)

const reviewItemSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    initial: { type: String, default: '' },
    avatarColor: { type: String, default: '' },
    timeAgo: { type: String, default: '' },
    verified: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
  },
  { _id: false }
)

const homePageSchema = new mongoose.Schema(
  {
    photoGallery: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      photos: { type: [galleryPhotoSchema], default: [] },
    },
    reviews: {
      googleReviewUrl: { type: String, default: '' },
      aggregateRating: { type: Number, default: 5 },
      totalReviews: { type: Number, default: 0 },
      items: { type: [reviewItemSchema], default: [] },
    },
  },
  { timestamps: true }
)

const HomePage = mongoose.models.HomePage || mongoose.model('HomePage', homePageSchema)

export default HomePage
