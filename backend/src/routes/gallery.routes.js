const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');
const Gallery    = require('../models/Gallery.model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8*1024*1024 } });
const uploadBuf = (buf,opts) => new Promise((res,rej) =>
  cloudinary.uploader.upload_stream(opts,(e,r) => e ? rej(e) : res(r)).end(buf)
);
const ok   = (res,data,code=200) => res.status(code).json({ success:true,data });
const fail = (res,msg,code=400)  => res.status(code).json({ success:false,error:msg });

router.get('/', async (req,res) => {
  try {
    const { category, featured, limit=50 } = req.query;
    const filter = { visible:true };
    if (category) filter.category = category;
    if (featured==='true') filter.featured = true;
    ok(res, await Gallery.find(filter).sort({ order:-1, createdAt:-1 }).limit(Number(limit)));
  } catch(e) { fail(res,e.message,500); }
});

router.get('/admin/all', protect, authorize('admin'), async (req,res) => {
  try { ok(res, await Gallery.find().sort({ createdAt:-1 })); }
  catch(e) { fail(res,e.message,500); }
});

router.post('/', protect, authorize('admin'), upload.single('image'), async (req,res) => {
  try {
    if (!req.file) return fail(res,'Image required');
    const r = await uploadBuf(req.file.buffer, {
      folder:'tc-interior/gallery',
      transformation:[{ width:1600, height:1200, crop:'limit' },{ quality:'auto:good' }],
    });
    const g = await Gallery.create({
      ...req.body,
      image:{ url:r.secure_url, publicId:r.public_id },
    });
    ok(res,g,201);
  } catch(e) { fail(res,e.message,400); }
});

router.put('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const g = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!g) return fail(res,'Not found',404);
    ok(res,g);
  } catch(e) { fail(res,e.message,400); }
});

router.delete('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const g = await Gallery.findByIdAndDelete(req.params.id);
    if (!g) return fail(res,'Not found',404);
    if (g.image?.publicId) await cloudinary.uploader.destroy(g.image.publicId).catch(()=>{});
    ok(res,{});
  } catch(e) { fail(res,e.message,500); }
});

module.exports = router;
