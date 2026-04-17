const router = require('express').Router();
const Product = require('../models/Product');
const slugify = require('slugify');
const { protect, admin } = require('../middleware/auth');

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, bestSeller, page = 1, limit = 12 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { tags: { $in: [new RegExp(search, 'i')] } }];
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (featured === 'true') query.isFeatured = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { numReviews: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug').populate('usedInProjects', 'title slug images');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create product (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update product (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE product (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
