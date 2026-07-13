import mongoose from 'mongoose'

const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
)

const footerColumnSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    links: { type: [footerLinkSchema], default: [] },
  },
  { _id: false }
)

const footerSocialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['facebook', 'youtube', 'linkedin', 'instagram'],
      default: 'facebook',
    },
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
)

const footerSchema = new mongoose.Schema(
  {
    brand: {
      name: { type: String, default: '' },
      tagline: { type: String, default: '' },
    },
    socials: { type: [footerSocialSchema], default: [] },
    columns: { type: [footerColumnSchema], default: [] },
    bottom: {
      copyrightName: { type: String, default: '' },
      showAdminLink: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

const Footer = mongoose.models.Footer || mongoose.model('Footer', footerSchema)

export default Footer
