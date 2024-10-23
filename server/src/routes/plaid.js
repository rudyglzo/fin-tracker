const express = require('express');
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

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

router.post('/create-link-token', async (req, res) => {
  try {
    console.log('Creating link token...');
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique_user_id' },
      client_name: 'Finance Tracker',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
    });
    
    console.log('Link token created successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    console.error('Error details:', error.response?.data);
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

router.post('/exchange-token', async (req, res) => {
  try {
    console.log('Exchanging public token:', req.body.public_token);
    
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token
    });
    
    console.log('Access token received');
    const accessToken = exchangeResponse.data.access_token;
    
    console.log('Getting accounts...');
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    });
    console.log('Accounts received:', accountsResponse.data.accounts.length);

    console.log('Getting transactions...');
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';
    
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 500
      }
    });
    
    console.log('Transactions received:', transactionsResponse.data.transactions.length);

    res.json({
      success: true,
      accounts: accountsResponse.data.accounts,
      transactions: transactionsResponse.data.transactions
    });
  } catch (error) {
    console.error('Error in exchange_token:', error);
    console.error('Error details:', error.response?.data);
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

module.exports = router;