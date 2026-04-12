const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 200 },
  slug:        { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, maxlength: 2000 },
  shortDesc:   { type: String, maxlength: 300 },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, trim: true },

  // Pricing
  price:       { type: Number, default: 0 },
  priceUnit:   { type: String, default: 'piece', enum: ['piece','sqft','meter','set','pair','unit'] },
  priceOnRequest: { type: Boolean, default: false },

  // Images — multiple Cloudinary images
  images: [{
    url:      { type: String },
    publicId: { type: String },
    alt:      { type: String, default: '' },
    isPrimary:{ type: Boolean, default: false },
  }],

  // Product specs
  materials:   [{ type: String, trim: true }],
  colors:      [{ type: String, trim: true }],
  dimensions:  {
    length: { type: String },
    width:  { type: String },
    height: { type: String },
    unit:   { type: String, default: 'inches' },
  },
  finishes:    [{ type: String, trim: true }],
  features:    [{ type: String, trim: true }],

  // Status
  inStock:     { type: Boolean, default: true },
  featured:    { type: Boolean, default: false },
  visible:     { type: Boolean, default: true },
  isNew:       { type: Boolean, default: false },
  isBestseller:{ type: Boolean, default: false },

  // SEO
  metaTitle:   { type: String, maxlength: 160 },
  metaDesc:    { type: String, maxlength: 320 },

  // Stats
  views:       { type: Number, default: 0 },
  enquiries:   { type: Number, default: 0 },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

productSchema.index({ category: 1, visible: 1, order: -1 });
productSchema.index({ featured: 1, visible: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
