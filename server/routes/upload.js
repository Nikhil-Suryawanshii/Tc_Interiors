const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.mimetype.startsWith('video') ? 'videos' : file.mimetype === 'image/gif' ? 'gifs' : 'images';
    const dir = path.join(__dirname, '..', 'uploads', type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Invalid file type'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

router.post('/image', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const type = req.file.mimetype === 'image/gif' ? 'gifs' : 'images';
  res.json({ url: `/uploads/${type}/${req.file.filename}` });
});

router.post('/video', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/videos/${req.file.filename}` });
});

router.post('/multiple', protect, admin, upload.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
  const urls = req.files.map(f => {
    const type = f.mimetype.startsWith('video') ? 'videos' : f.mimetype === 'image/gif' ? 'gifs' : 'images';
    return `/uploads/${type}/${f.filename}`;
  });
  res.json({ urls });
});

module.exports = router;
