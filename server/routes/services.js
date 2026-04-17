const router = require('express').Router();
const Service = require('../models/Service');
const slugify = require('slugify');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    const service = await Service.create({ ...req.body, slug });
    res.status(201).json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
