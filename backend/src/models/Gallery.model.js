const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, maxlength: 500 },
  image:       { url: String, publicId: String },
  category:    { type: String, trim: true }, // Living Room, Bedroom, Kitchen etc
  tags:        [{ type: String, trim: true }],
  featured:    { type: Boolean, default: false },
  visible:     { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

gallerySchema.index({ visible: 1, order: -1 });
gallerySchema.index({ featured: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
