const express  = require('express');
const router   = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Enquiry  = require('../models/Enquiry.model');

const ok   = (res,data,code=200) => res.status(code).json({ success:true,data });
const fail = (res,msg,code=400)  => res.status(code).json({ success:false,error:msg });

// Public — submit enquiry
router.post('/', async (req,res) => {
  try {
    const { name, email, phone, message, type, product, productName, cartItems } = req.body;
    if (!name||!email||!message) return fail(res,'name, email, message required');
    const e = await Enquiry.create({
      name:name.trim(), email:email.trim().toLowerCase(),
      phone:phone?.trim(), message:message.trim(),
      type:type||'general', product, productName, cartItems,
      ipAddress: req.ip,
    });
    ok(res,e,201);
  } catch(e) { fail(res,e.message,500); }
});

// Admin
router.get('/', protect, authorize('admin'), async (req,res) => {
  try {
    const { status, type, page=1, limit=30 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;
    const skip = (Number(page)-1)*Number(limit);
    const [items,total] = await Promise.all([
      Enquiry.find(filter).populate('product','name').sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      Enquiry.countDocuments(filter),
    ]);
    res.json({ success:true, data:items, pagination:{ total, page:Number(page), pages:Math.ceil(total/Number(limit)) } });
  } catch(e) { fail(res,e.message,500); }
});

router.put('/:id/status', protect, authorize('admin'), async (req,res) => {
  try {
    const e = await Enquiry.findByIdAndUpdate(req.params.id, { status:req.body.status, notes:req.body.notes }, { new:true });
    if (!e) return fail(res,'Not found',404);
    ok(res,e);
  } catch(e) { fail(res,e.message,500); }
});

router.delete('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    ok(res,{});
  } catch(e) { fail(res,e.message,500); }
});

module.exports = router;
