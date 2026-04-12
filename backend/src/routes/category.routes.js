const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');
const Category   = require('../models/Category.model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5*1024*1024 } });
const uploadBuf = (buf, opts) => new Promise((res,rej) =>
  cloudinary.uploader.upload_stream(opts, (e,r) => e ? rej(e) : res(r)).end(buf)
);
const ok   = (res,data,code=200) => res.status(code).json({ success:true,data });
const fail = (res,msg,code=400)  => res.status(code).json({ success:false,error:msg });

router.get('/', async (req,res) => {
  try {
    const cats = await Category.find({ visible:true }).sort({ order:1, name:1 });
    ok(res,cats);
  } catch(e) { fail(res,e.message,500); }
});

router.get('/admin/all', protect, authorize('admin'), async (req,res) => {
  try {
    const cats = await Category.find().sort({ order:1 });
    ok(res,cats);
  } catch(e) { fail(res,e.message,500); }
});

router.post('/', protect, authorize('admin'), async (req,res) => {
  try { ok(res, await Category.create(req.body), 201); }
  catch(e) { fail(res,e.message,400); }
});

router.put('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!c) return fail(res,'Not found',404);
    ok(res,c);
  } catch(e) { fail(res,e.message,400); }
});

router.delete('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const c = await Category.findByIdAndDelete(req.params.id);
    if (!c) return fail(res,'Not found',404);
    if (c.image?.publicId) await cloudinary.uploader.destroy(c.image.publicId).catch(()=>{});
    ok(res,{});
  } catch(e) { fail(res,e.message,500); }
});

router.post('/:id/image', protect, authorize('admin'), upload.single('image'), async (req,res) => {
  try {
    if (!req.file) return fail(res,'No file');
    const c = await Category.findById(req.params.id);
    if (!c) return fail(res,'Not found',404);
    if (c.image?.publicId) await cloudinary.uploader.destroy(c.image.publicId).catch(()=>{});
    const r = await uploadBuf(req.file.buffer, {
      folder:'tc-interior/categories',
      transformation:[{ width:600, height:400, crop:'fill' },{ quality:'auto' }],
    });
    c.image = { url:r.secure_url, publicId:r.public_id };
    await c.save({ validateBeforeSave:false });
    ok(res,c.image);
  } catch(e) { fail(res,e.message,500); }
});

module.exports = router;
