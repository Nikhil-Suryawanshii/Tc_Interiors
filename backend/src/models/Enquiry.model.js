const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 100 },
  email:   { type: String, required: true, trim: true, lowercase: true },
  phone:   { type: String, trim: true, maxlength: 20 },
  message: { type: String, required: true, maxlength: 2000 },
  type:    { type: String, enum: ['product','general','quote','cart'], default: 'general' },

  // For product enquiries
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },

  // For cart enquiries — list of items
  cartItems: [{
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    quantity:    { type: Number, default: 1 },
    priceUnit:   { type: String },
  }],

  status:    { type: String, enum: ['new','read','replied','closed'], default: 'new' },
  notes:     { type: String },
  ipAddress: { type: String },
}, { timestamps: true });

enquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
