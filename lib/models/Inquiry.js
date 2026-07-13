import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: null },
    interest: { type: String, trim: true, default: null },
    message: { type: String, required: true, trim: true },
    source: { type: String, enum: ['contact', 'plan-my-trip'], default: 'contact' },
    booking: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
)

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)

export default Inquiry
