const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  shortDescription: { type: String },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  features: [String],
  process: [{ step: Number, title: String, description: String }],
  pricing: [{ label: String, price: String, description: String }],
  duration: { type: String },
  isFeatured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
