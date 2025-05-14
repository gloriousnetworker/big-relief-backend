require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const ngoRoutes = require('./src/routes/ngo.routes');
const adminRoutes = require('./src/routes/admin.routes');
const scholarshipRoutes = require('./src/routes/scholarship.routes');
const bannerRoutes = require('./src/routes/banner.routes');
const { handleError } = require('./src/utils/errorHandler');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5000',
    'http://localhost:3000',
    'https://bigrelief.vercel.app',
    'http://bigrelief.com.ng',
    'https://big-relief-backend.vercel.app'
  ],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the NGO Listings API',
    endpoints: {
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        getMe: 'GET /api/v1/auth/me'
      },
      ngos: {
        create: 'POST /api/v1/ngos',
        getAll: 'GET /api/v1/ngos',
        getOne: 'GET /api/v1/ngos/:id',
        verify: 'PATCH /api/v1/ngos/:id/verify'
      },
      admin: {
        getAllUsers: 'GET /api/v1/admin/users',
        pending: 'GET /api/v1/admin/pending-ngos',
        banners: 'POST /api/v1/admin/banners'
      },
      scholarships: {
        create: 'POST /api/v1/scholarships',
        getAll: 'GET /api/v1/scholarships',
        getByNGO: 'GET /api/v1/scholarships/ngo/:ngoId'
      },
      banners: {
        getActive: 'GET /api/v1/banners/active'
      }
    }
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ngos', ngoRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/scholarships', scholarshipRoutes);
app.use('/api/v1/banners', bannerRoutes);

// Global error handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});