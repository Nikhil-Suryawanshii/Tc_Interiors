const router = require('express').Router();
const Project = require('../models/Project');
const slugify = require('slugify');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 9 } = req.query;
    let query = { isPublished: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('productsUsed', 'name slug images price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isPublished: true }).populate('productsUsed', 'name slug images price category');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const project = await Project.create({ ...req.body, slug });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
