// server/src/routes/plaid.js
const express = require('express');
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Configure Plaid
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Create link token
router.post('/create-link-token', async (req, res) => {
  try {
    console.log('Creating link token...');
    
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique_user_id' },
      client_name: 'Finance Tracker',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      redirect_uri: process.env.PLAID_REDIRECT_URI
    });
    
    console.log('Link token created successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Detailed Plaid error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Exchange public token
router.post('/exchange-token', async (req, res) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token
    });
    
    const accessToken = response.data.access_token;
    
    // Get transactions
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: oneYearAgo.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0]
    });

    res.json({
      success: true,
      transactions: transactionsResponse.data.transactions
    });
  } catch (error) {
    console.error('Exchange token error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

module.exports = router;