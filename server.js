require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ngoRoutes = require('./src/routes/ngo.routes');
const { handleError } = require('./src/utils/errorHandler');

const app = express();

typeof process !== 'undefined';
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/v1', ngoRoutes);

app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
