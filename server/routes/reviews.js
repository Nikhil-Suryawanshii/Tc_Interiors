const router = require('express').Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { product, project } = req.query;
    let query = { isApproved: true };
    if (product) query.product = product;
    if (project) query.project = project;
    const reviews = await Review.find(query).populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const existing = await Review.findOne({ user: req.user._id, product: req.body.product });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });
    const review = await Review.create({ ...req.body, user: req.user._id });
    // Update product rating
    if (req.body.product) {
      const reviews = await Review.find({ product: req.body.product, isApproved: true });
      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(req.body.product, { rating: avg.toFixed(1), numReviews: reviews.length });
    }
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
