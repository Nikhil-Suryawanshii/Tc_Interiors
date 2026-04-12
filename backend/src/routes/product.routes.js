const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');
const Product    = require('../models/Product.model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8*1024*1024 } });
const uploadBuf = (buf, opts) => new Promise((res, rej) =>
  cloudinary.uploader.upload_stream(opts, (e,r) => e ? rej(e) : res(r)).end(buf)
);
const ok   = (res, data, code=200) => res.status(code).json({ success:true, data });
const fail = (res, msg, code=400)  => res.status(code).json({ success:false, error:msg });

// GET all visible products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit=50, page=1, sort='order' } = req.query;
    const filter = { visible: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search)   filter.$or = [
      { name: new RegExp(search,'i') },
      { description: new RegExp(search,'i') },
    ];
    const skip = (Number(page)-1)*Number(limit);
    const sortMap = { order:{ order:-1 }, newest:{ createdAt:-1 }, name:{ name:1 } };
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category','name slug icon').sort(sortMap[sort]||{ order:-1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    ok(res, { products, total, page:Number(page), pages:Math.ceil(total/Number(limit)) });
  } catch(e) { fail(res, e.message, 500); }
});

// GET single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug:req.params.slug, visible:true }).populate('category','name slug icon');
    if (!product) return fail(res,'Product not found',404);
    product.views = (product.views||0)+1;
    await product.save({ validateBeforeSave:false });
    ok(res, product);
  } catch(e) { fail(res,e.message,500); }
});

// ── ADMIN routes ──────────────────────────────────────────
router.get('/admin/all', protect, authorize('admin'), async (req,res) => {
  try {
    const products = await Product.find().populate('category','name slug').sort({ createdAt:-1 });
    ok(res, products);
  } catch(e) { fail(res,e.message,500); }
});

router.post('/', protect, authorize('admin'), async (req,res) => {
  try {
    const product = await Product.create(req.body);
    ok(res, product, 201);
  } catch(e) { fail(res,e.message,400); }
});

router.put('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
    if (!product) return fail(res,'Not found',404);
    ok(res, product);
  } catch(e) { fail(res,e.message,400); }
});

router.delete('/:id', protect, authorize('admin'), async (req,res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return fail(res,'Not found',404);
    // Delete images from cloudinary
    for (const img of (p.images||[])) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId).catch(()=>{});
    }
    ok(res,{});
  } catch(e) { fail(res,e.message,500); }
});

// Upload product image
router.post('/:id/images', protect, authorize('admin'), upload.single('image'), async (req,res) => {
  try {
    if (!req.file) return fail(res,'No file');
    const product = await Product.findById(req.params.id);
    if (!product) return fail(res,'Not found',404);
    const result = await uploadBuf(req.file.buffer, {
      folder:'tc-interior/products',
      transformation:[{ width:1200, height:900, crop:'limit' },{ quality:'auto:good' }],
    });
    const isPrimary = product.images.length === 0;
    product.images.push({ url:result.secure_url, publicId:result.public_id, isPrimary });
    await product.save({ validateBeforeSave:false });
    ok(res, product.images);
  } catch(e) { fail(res,e.message,500); }
});

// Delete product image
router.delete('/:id/images/:publicId', protect, authorize('admin'), async (req,res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return fail(res,'Not found',404);
    const pid = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(pid).catch(()=>{});
    product.images = product.images.filter(i => i.publicId !== pid);
    if (product.images.length > 0 && !product.images.some(i=>i.isPrimary)) {
      product.images[0].isPrimary = true;
    }
    await product.save({ validateBeforeSave:false });
    ok(res, product.images);
  } catch(e) { fail(res,e.message,500); }
});

module.exports = router;
