const router = require('express').Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, notes } = req.body;
    const order = await Order.create({ user: req.user._id, items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, notes });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// My orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: all orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.orderStatus = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ orders, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: update order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status, ...(req.body.status === 'Delivered' ? { deliveredAt: new Date() } : {}) }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
