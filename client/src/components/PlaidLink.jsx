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
        console.log('Requesting link token...');
        const response = await axios.post('http://localhost:5001/api/plaid/create-link-token');
        console.log('Link token received:', response.data);
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error getting link token:', error);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    generateToken();
  }, []);

  const onPlaidSuccess = useCallback((public_token, metadata) => {
    console.log('Plaid Link success');
    console.log('Public token:', public_token);
    console.log('Metadata:', metadata);
    onSuccess(public_token);
  }, [onSuccess]);

  const config = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err, metadata) => {
      console.log('Plaid Link exit:', err, metadata);
      if (err != null) {
        setError('Connection process interrupted. Please try again.');
      }
    },
  };

  const { open, ready } = usePlaidLink(config);

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
          flex items-center justify-center mx-auto space-x-2 
          ${(!ready || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Link className="h-5 w-5" />
        <span>{loading ? 'Connecting...' : 'Connect Your Bank'}</span>
      </button>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>For testing, use these credentials:</p>
        <p className="font-mono mt-1">Username: user_good</p>
        <p className="font-mono">Password: pass_good</p>
      </div>
    </div>
  );
};

export default PlaidLinkComponent;