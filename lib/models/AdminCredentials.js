import mongoose from 'mongoose'

const adminCredentialsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    salt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const AdminCredentials =
  mongoose.models.AdminCredentials || mongoose.model('AdminCredentials', adminCredentialsSchema)

export default AdminCredentials
