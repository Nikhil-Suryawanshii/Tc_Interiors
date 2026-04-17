const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, image: String, price: Number, quantity: Number,
    color: String, customNote: String
  }],
  shippingAddress: {
    name: String, phone: String, line1: String, line2: String,
    city: String, state: String, pincode: String, country: { type: String, default: 'India' }
  },
  paymentMethod: { type: String, enum: ['COD', 'Online', 'UPI', 'Card'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
  itemsPrice: Number, shippingPrice: Number, taxPrice: Number, totalPrice: Number,
  deliveredAt: Date, notes: String,
  trackingNumber: String, courier: String
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-3).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
