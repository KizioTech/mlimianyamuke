const dns = require('dns');
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (error) {
  console.error('Failed to set DNS result order:', error);
}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const { User, Farmer, Contact, Resource } = require('./models');
const bcrypt = require('bcryptjs');

const upload = require('./middleware/uploadMiddleware');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/farm', require('./routes/cropRoutes'));

// Generic Upload Endpoint (Images)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    url: `/uploads/images/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Legacy/Other Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message, language } = req.body;
  try {
    await Contact.create({ name, email, phone, message, language });
    res.json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to process message' });
  }
});

app.post('/api/analytics', (req, res) => {
  // Analytics stub
  res.json({ success: true });
});

app.post('/api/register', async (req, res) => {
  const { name, phone, district, crop, alertMethod, language, username, password } = req.body;

  console.log('Registration request received:', {
    name, phone, district, crop, alertMethod, language, username,
    hasPassword: !!password
  });

  try {
    // Validation
    if (!name || !phone || !district || !crop || !alertMethod || !username || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        missingFields: {
          name: !name,
          phone: !phone,
          district: !district,
          crop: !crop,
          alertMethod: !alertMethod,
          username: !username,
          password: !password
        }
      });
    }

    // 1. Check if user already exists
    console.log(`Checking if username '${username}' exists...`);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log(`Username '${username}' already exists`);
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // 2. Create User account
    console.log('Creating user account...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'farmer'
    });
    console.log(`User created with ID: ${user.id}`);

    // 3. Create Farmer profile linked to User
    console.log('Creating farmer profile...');
    await Farmer.create({
      name,
      phone,
      district,
      crop,
      alertMethod,
      language: language || 'en',
      UserId: user.id
    });
    console.log('Farmer profile created successfully');

    res.json({ success: true, message: 'Registration successful! You can now log in.' });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors // Sequelize validation errors
    });
    res.status(500).json({
      success: false,
      message: 'Failed to register',
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Start Server & Sync DB
sequelize.sync().then(async () => {
  console.log('Database synced');
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Mlimi Anyamuke API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});