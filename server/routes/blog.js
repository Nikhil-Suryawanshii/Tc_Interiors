const router = require('express').Router();
const Blog = require('../models/Blog');
const slugify = require('slugify');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, tag, category, page = 1, limit = 9 } = req.query;
    let query = { isPublished: true };
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    if (tag) query.tags = { $in: [tag] };
    if (category) query.category = category;
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ message: 'Post not found' });
    blog.views += 1; await blog.save();
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const blog = await Blog.create({ ...req.body, slug, author: req.user._id, publishedAt: req.body.isPublished ? new Date() : null });
    res.status(201).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

// Admin: get all posts including unpublished
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
