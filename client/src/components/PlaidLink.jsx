// client/src/components/PlaidLink.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Link } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PlaidLinkComponent = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const generateToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('http://localhost:5001/api/plaid/create-link-token');
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error generating link token:', error);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    generateToken();
  }, []);

  const onPlaidSuccess = useCallback(async (publicToken, metadata) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5001/api/plaid/exchange-token', {
        public_token: publicToken
      });
      
      // Pass the transactions data to the parent component
      onSuccess(response.data.transactions);
    } catch (error) {
      console.error('Error exchanging public token:', error);
      setError('Failed to connect bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err, metadata) => {
      if (err) setError('Connection process interrupted. Please try again.');
    },
  });

  return (
    <div className="text-center">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={() => open()}
        disabled={!ready || loading}
        className={`mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
          flex items-center justify-center mx-auto space-x-2 ${
            (!ready || loading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <Link className="h-5 w-5" />
        <span>{loading ? 'Connecting...' : 'Connect Your Bank'}</span>
      </button>
      
      <p className="mt-2 text-sm text-gray-500">
        For testing, use these credentials:
        <br />
        Username: user_good
        <br />
        Password: pass_good
      </p>
    </div>
  );
};

export default PlaidLinkComponent;