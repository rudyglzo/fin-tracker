// client/src/components/PlaidLink.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Link } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';

const PlaidLinkComponent = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();
  const { handlePlaidSuccess, isConnected } = usePlaid();

  useEffect(() => {
    const generateToken = async () => {
      try {
        setLoading(true);
        console.log('Requesting link token...');
        const response = await axios.post('https://fiscal-compass-backend.vercel.app/api/plaid/create-link-token');
        console.log('Link token received:', response.data);
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error getting link token:', error);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!isConnected) {
      generateToken();
    }
  }, [isConnected]);

  const onPlaidSuccess = useCallback(
    (public_token, metadata) => {
      console.log('Plaid Link success');
      handlePlaidSuccess(public_token);
    },
    [handlePlaidSuccess]
  );

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

  if (isConnected) {
    return null; // Don't show the connect button if already connected
  }

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
        <p className="text-xs italic mt-2">
          Note: This is a sandbox environment. Please do not use real banking credentials.
        </p>
      </div>
    </div>
  );
};

export default PlaidLinkComponent;