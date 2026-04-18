const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/interior-studio';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to MongoDB...');
  const exists = await User.findOne({ email: 'admin@luxe.in' });
  if (exists) {
    console.log('✅ Admin already exists — login with admin@luxe.in / Admin@1234');
    process.exit(0);
  }
  await User.create({ name: 'Admin', email: 'admin@luxe.in', password: 'Admin@1234', role: 'admin' });
  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@luxe.in');
  console.log('   Password: Admin@1234');
  process.exit(0);
}).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
