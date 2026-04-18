const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/categories',    require('./routes/categories'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/services',      require('./routes/services'));
app.use('/api/blog',          require('./routes/blog'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/reviews',       require('./routes/reviews'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/upload',        require('./routes/upload'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/settings',      require('./routes/settings'));

app.get('/', (req, res) => res.json({ message: 'Interior Studio API ✓' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interior-studio')
  .then(() => { console.log('✅ MongoDB connected'); app.listen(PORT, () => console.log(`✅ Server: http://localhost:${PORT}`)); })
  .catch(err => { console.error('❌', err.message); process.exit(1); });
