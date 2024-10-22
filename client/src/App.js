// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import { useTheme } from './contexts/ThemeContext';
import { Building, Link, CreditCard, AlertCircle } from 'lucide-react';

const FinanceDashboard = () => {
  const { isDark } = useTheme();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLinked, setIsLinked] = useState(false);

  // This will be replaced with actual Plaid Link later
  const handleConnectBank = () => {
    console.log('Connecting bank...');
  };

  return (
    <div className="space-y-6">
      {/* Bank Connection Section */}
      {!isLinked && (
        <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <Building className={`h-12 w-12 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="mt-4 text-2xl font-bold">Connect Your Bank Account</h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Securely connect your bank account to get started with automatic transaction tracking
            </p>
            <button
              onClick={handleConnectBank}
              className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                flex items-center justify-center mx-auto space-x-2"
            >
              <Link className="h-5 w-5" />
              <span>Connect Bank Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Overview */}
      <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>
        {accounts.length === 0 ? (
          <div className="text-center py-6">
            <CreditCard className={`h-8 w-8 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className="mt-2 text-gray-500">No accounts connected yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{account.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.type}
                    </p>
                  </div>
                  <p className="text-lg font-bold">${account.balance}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className={`h-8 w-8 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className="mt-2 text-gray-500">No transactions available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {transaction.date}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${
                    transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    ${Math.abs(transaction.amount)}
                  </p>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {transaction.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <FinanceDashboard />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;