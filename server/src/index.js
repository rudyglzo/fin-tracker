// server/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const plaidRoutes = require('./routes/plaid');

const app = express();


const allowedOrigins = [
  'http://localhost:3000',                     // Local development
  'https://fiscal-compass-beryl.vercel.app',   // Production frontend
  'https://fin-tracker-backend.vercel.app'     // Production backend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

//JSON parsing
app.use(express.json());

// Use routes
app.use('/api/plaid', plaidRoutes);

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    plaidConfigured: {
      clientId: !!process.env.PLAID_CLIENT_ID,
      secret: !!process.env.PLAID_SECRET,
      env: process.env.PLAID_ENV
    }
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Plaid configuration:', {
    clientIdExists: !!process.env.PLAID_CLIENT_ID,
    secretExists: !!process.env.PLAID_SECRET,
    environment: process.env.PLAID_ENV
  });
});