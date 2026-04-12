const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, maxlength: 500 },
  image:       { url: String, publicId: String },
  icon:        { type: String, default: '🪑' },
  visible:     { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
