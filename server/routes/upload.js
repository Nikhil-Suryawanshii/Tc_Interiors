const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect, admin } = require('../middleware/auth');

const IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const VIDEO_FORMATS = ['mp4', 'webm', 'mov'];

const buildPublicId = file =>
  `${Date.now()}-${file.originalname
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')}`;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'tc-interiors/images',
    resource_type: 'image',
    public_id: buildPublicId(file),
  }),
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'tc-interiors/videos',
    resource_type: 'video',
    public_id: buildPublicId(file),
  }),
});

const imageFilter = (req, file, cb) => {
  const lowerName = file.originalname.toLowerCase();
  const ok = IMAGE_MIME_TYPES.includes(file.mimetype) || IMAGE_FORMATS.some(ext => lowerName.endsWith(`.${ext}`));
  ok ? cb(null, true) : cb(new Error('Only image files (jpeg/jpg/png/webp/gif/svg) are allowed'));
};

const videoFilter = (req, file, cb) => {
  const lowerName = file.originalname.toLowerCase();
  const ok = VIDEO_FORMATS.some(ext => file.mimetype.includes(ext) || lowerName.endsWith(`.${ext}`));
  ok ? cb(null, true) : cb(new Error('Only video files (mp4/webm/mov) are allowed'));
};

const mixedFilter = (req, file, cb) => {
  const lowerName = file.originalname.toLowerCase();
  const ok =
    IMAGE_MIME_TYPES.includes(file.mimetype) ||
    [...IMAGE_FORMATS, ...VIDEO_FORMATS].some(ext => lowerName.endsWith(`.${ext}`));
  ok ? cb(null, true) : cb(new Error('Invalid file type'));
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const uploadMultiple = multer({
  storage: imageStorage,
  fileFilter: mixedFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/image', protect, admin, uploadImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  return res.json({ url: req.file.path, public_id: req.file.filename });
});

router.post('/video', protect, admin, uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  return res.json({ url: req.file.path, public_id: req.file.filename });
});

router.post('/multiple', protect, admin, uploadMultiple.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
  const files = req.files.map(file => ({ url: file.path, public_id: file.filename }));
  return res.json({ urls: files.map(file => file.url), files });
});

router.post('/delete', protect, admin, async (req, res) => {
  const { public_id, resource_type = 'image' } = req.body;
  if (!public_id) return res.status(400).json({ message: 'public_id is required' });

  try {
    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    return res.json({ message: 'Deleted', result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err?.message) {
    return res.status(400).json({ message: err.message });
  }
  return next(err);
});

module.exports = router;
