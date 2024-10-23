// server/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const plaidRoutes = require('./routes/plaid');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
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