require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const ngoRoutes = require('./src/routes/ngo.routes');
const { handleError } = require('./src/utils/errorHandler');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5000',                    // Local backend
    'http://localhost:3000',                    // Local frontend
    'https://bigrelief.vercel.app',             // Production frontend
    'http://bigrelief.com.ng',                  // Custom domain frontend
    'https://big-relief-backend.vercel.app'     // Production backend
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
      createNGO: 'POST /api/v1/ngos',
      getAllNGOs: 'GET /api/v1/ngos',
      getNGO: 'GET /api/v1/ngos/:id',
      login: 'POST /api/v1/auth/login',
      signup: 'POST /api/v1/auth/signup'
    }
  });
});

// Routes
app.use('/api/v1', authRoutes);   // Authentication routes
app.use('/api/v1', ngoRoutes);    // NGO resource routes

app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
