require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ngoRoutes = require('./src/routes/ngo.routes');
const { handleError } = require('./src/utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome endpoint (should be before other routes)
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the NGO Listings API',
    endpoints: {
      createNGO: 'POST /api/v1/ngos',
      getAllNGOs: 'GET /api/v1/ngos',
      getNGO: 'GET /api/v1/ngos/:id'
    }
  });
});

// Routes
app.use('/api/v1', ngoRoutes);

// Error handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
