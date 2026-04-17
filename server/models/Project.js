const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  client: { type: String },
  location: { type: String },
  area: { type: String },
  duration: { type: String },
  year: { type: Number },
  style: { type: String },
  images: [{ url: String, caption: String }],
  videos: [{ url: String, type: { type: String, enum: ['mp4', 'gif', 'youtube', 'vimeo'], default: 'mp4' }, caption: String, thumbnail: String }],
  beforeImages: [String],
  afterImages: [String],
  category: { type: String, enum: ['Residential', 'Commercial', 'Hospitality', 'Office', 'Retail'] },
  tags: [String],
  productsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  servicesProvided: [String],
  testimonial: { text: String, author: String, designation: String, avatar: String },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
