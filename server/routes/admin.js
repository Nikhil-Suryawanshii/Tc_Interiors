const router = require('express').Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Consultation = require('../models/Consultation');
const Review = require('../models/Review');

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [users, products, orders, projects, blogs, consultations, reviews] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Project.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Consultation.countDocuments({ status: 'New' }),
      Review.countDocuments({ isApproved: false }),
    ]);
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);
    const recentConsultations = await Consultation.find().sort({ createdAt: -1 }).limit(5);
    res.json({ users, products, orders, projects, blogs, consultations, reviews, revenue, recentOrders, recentConsultations });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin users list
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
