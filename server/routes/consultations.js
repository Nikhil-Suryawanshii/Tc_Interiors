const router = require('express').Router();
const Consultation = require('../models/Consultation');
const { protect, admin } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const consultation = await Consultation.create({ ...req.body, user: req.user?._id });
    res.status(201).json({ message: 'Consultation request received!', consultation });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const consultations = await Consultation.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const c = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
