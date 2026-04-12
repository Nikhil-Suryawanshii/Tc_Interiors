// TC Interior — backend/src/server.js
const express    = require('express');
const http       = require('http');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const compression= require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan     = require('morgan');
require('dotenv').config();
const logger = require('./utils/logger');

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn:null, promise:null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS:10000, socketTimeoutMS:45000, bufferCommands:false,
    }).catch(err => { cached.promise=null; throw err; });
  }
  cached.conn = await cached.promise;
  logger.info('MongoDB connected ✅');
  return cached.conn;
};

const requiredEnvVars = ['MONGODB_URI','JWT_SECRET','JWT_REFRESH_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ Missing env vars:', missingVars.join(', '));
  process.exit(1);
}

// Routes
const authRoutes      = require('./routes/auth.routes');
const productRoutes   = require('./routes/product.routes');
const categoryRoutes  = require('./routes/category.routes');
const enquiryRoutes   = require('./routes/enquiry.routes');
const galleryRoutes   = require('./routes/gallery.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const serviceRoutes   = require('./routes/service.routes');
const blogRoutes      = require('./routes/blog.routes');
const siteSettingsRoutes = require('./routes/settings.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const contactRoutes   = require('./routes/contact.routes');
const profileRoutes   = require('./routes/profile.routes');
const auditLogRoutes  = require('./routes/auditlog.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter }   = require('./middleware/rateLimiter');

const app    = express();
const server = http.createServer(app);

app.use(helmet());
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGIN||'http://localhost:3000').split(',').map(o=>o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit:'10mb' }));
app.use(express.urlencoded({ extended:true, limit:'10mb' }));
app.use(compression());
app.use(cookieParser());
app.use(mongoSanitize());
if (process.env.NODE_ENV==='development') app.use(morgan('dev'));

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch(err) {
    logger.error('DB connection failed: '+err.message);
    res.status(503).json({ success:false, message:'Database unavailable.' });
  }
});

app.use('/api/', apiLimiter);

app.get('/', (req,res) => res.json({ success:true, message:'🚀 TC Interior API running' }));
app.get('/health', (req,res) => {
  const states = {0:'disconnected',1:'connected',2:'connecting',3:'disconnecting'};
  res.json({ status:'healthy', mongodb:states[mongoose.connection.readyState]||'unknown' });
});

const V = process.env.API_VERSION || 'v1';
app.use(`/api/${V}/auth`,          authRoutes);
app.use(`/api/${V}/products`,      productRoutes);
app.use(`/api/${V}/categories`,    categoryRoutes);
app.use(`/api/${V}/enquiries`,     enquiryRoutes);
app.use(`/api/${V}/gallery`,       galleryRoutes);
app.use(`/api/${V}/testimonials`,  testimonialRoutes);
app.use(`/api/${V}/services`,      serviceRoutes);
app.use(`/api/${V}/blog`,          blogRoutes);
app.use(`/api/${V}/site-settings`, siteSettingsRoutes);
app.use(`/api/${V}/analytics`,     analyticsRoutes);
app.use(`/api/${V}/contact`,       contactRoutes);
app.use(`/api/${V}/profile`,       profileRoutes);
app.use(`/api/${V}/audit-log`,     auditLogRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 TC Interior API → http://localhost:${PORT}`);
    });
  }).catch(err => { console.error('Failed:', err.message); process.exit(1); });
}
module.exports = server;
