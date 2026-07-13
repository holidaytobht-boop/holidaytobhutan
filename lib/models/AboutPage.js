import mongoose from 'mongoose'

const textBlockSchema = new mongoose.Schema(
  { title: { type: String, default: '' }, text: { type: String, default: '' } },
  { _id: false }
)

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { _id: false }
)

const aboutPageSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    story: {
      title: { type: String, default: '' },
      image: { type: String, default: '' },
      paragraphs: { type: [String], default: [] },
    },
    missionVision: {
      mission: { type: textBlockSchema, default: () => ({}) },
      vision: { type: textBlockSchema, default: () => ({}) },
    },
    offers: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [textBlockSchema], default: [] },
    },
    whyChooseUs: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [String], default: [] },
    },
    team: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      members: { type: [teamMemberSchema], default: [] },
    },
    values: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      items: { type: [textBlockSchema], default: [] },
    },
    cta: {
      eyebrow: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      whatsappUrl: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

const AboutPage = mongoose.models.AboutPage || mongoose.model('AboutPage', aboutPageSchema)

export default AboutPage
