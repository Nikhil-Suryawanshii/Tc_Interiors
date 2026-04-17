const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: { type: String },
  projectType: { type: String },
  budget: { type: String },
  location: { type: String },
  message: { type: String },
  preferredDate: { type: Date },
  status: { type: String, enum: ['New', 'Contacted', 'Scheduled', 'Completed', 'Cancelled'], default: 'New' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
