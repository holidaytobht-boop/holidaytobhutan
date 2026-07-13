import mongoose from 'mongoose'

const contactMethodSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['phone', 'email', 'whatsapp', 'address'], default: 'phone' },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    sub: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
)

const contactPageSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' },
    },
    info: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      lead: { type: String, default: '' },
    },
    methods: { type: [contactMethodSchema], default: [] },
    whatsappCta: {
      label: { type: String, default: '' },
      url: { type: String, default: '' },
    },
    form: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      submitLabel: { type: String, default: '' },
      successTitle: { type: String, default: '' },
      successMessage: { type: String, default: '' },
      interestOptions: { type: [String], default: [] },
    },
  },
  { timestamps: true }
)

const ContactPage = mongoose.models.ContactPage || mongoose.model('ContactPage', contactPageSchema)

export default ContactPage
