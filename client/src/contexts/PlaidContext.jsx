// contexts/PlaidContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PlaidContext = createContext();

export const PlaidProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from session storage
  useEffect(() => {
    const initializeFromStorage = () => {
      try {
        const storedTransactions = sessionStorage.getItem('plaidTransactions');
        const storedAccounts = sessionStorage.getItem('plaidAccounts');
        const storedIsLinked = sessionStorage.getItem('isPlaidLinked');

        if (storedTransactions && storedAccounts && storedIsLinked) {
          setTransactions(JSON.parse(storedTransactions));
          setAccounts(JSON.parse(storedAccounts));
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error loading stored Plaid data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeFromStorage();
  }, []);

  const handlePlaidSuccess = async (publicToken) => {
    try {
      setLoading(true);
      console.log('Exchanging public token:', publicToken);
      
      const response = await axios.post('http://localhost:5001/api/plaid/exchange-token', {
        public_token: publicToken
      });

      console.log('Plaid exchange response:', response.data);

      if (response.data.transactions && response.data.accounts) {
        // Store in state
        setTransactions(response.data.transactions);
        setAccounts(response.data.accounts);
        setIsConnected(true);

        // Store in session storage
        sessionStorage.setItem('plaidTransactions', JSON.stringify(response.data.transactions));
        sessionStorage.setItem('plaidAccounts', JSON.stringify(response.data.accounts));
        sessionStorage.setItem('isPlaidLinked', 'true');

        console.log('Plaid data stored successfully');
      } else {
        throw new Error('Invalid response data from Plaid');
      }
    } catch (err) {
      console.error('Error in Plaid connection:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearPlaidConnection = () => {
    // Clear session storage
    sessionStorage.removeItem('plaidTransactions');
    sessionStorage.removeItem('plaidAccounts');
    sessionStorage.removeItem('isPlaidLinked');

    // Reset state
    setTransactions([]);
    setAccounts([]);
    setIsConnected(false);
    setError(null);
  };

  return (
    <PlaidContext.Provider
      value={{
        isConnected,
        transactions,
        accounts,
        loading,
        error,
        handlePlaidSuccess,
        clearPlaidConnection
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
};

export const usePlaid = () => {
  const context = useContext(PlaidContext);
  if (!context) {
    throw new Error('usePlaid must be used within a PlaidProvider');
  }
  return context;
};