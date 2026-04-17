const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  images: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: { type: String },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  seo: { metaTitle: String, metaDescription: String, keywords: [String] }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
