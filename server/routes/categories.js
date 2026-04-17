const router = require('express').Router();
const Category = require('../models/Category');
const slugify = require('slugify');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    const cat = await Category.create({ ...req.body, slug });
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
