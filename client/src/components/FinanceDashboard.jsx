import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { Building } from 'lucide-react';
import PlaidLinkComponent from './PlaidLink';
import OverviewCards from './OverviewCards';
import SpendingByCategory from './SpendingByCategory';
import BudgetProgress from './BudgetProgress';
import MonthlyTrends from './MonthlyTrends';

const FinanceDashboard = () => {
  const { isDark } = useTheme();
  const [isLinked, setIsLinked] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const handlePlaidSuccess = async (publicToken) => {
    try {
      console.log('Starting token exchange with public token:', publicToken);
      
      const response = await axios.post('http://localhost:5001/api/plaid/exchange-token', {
        public_token: publicToken
      });
      
      console.log('Full response from server:', response.data);
      console.log('Number of transactions:', response.data.transactions?.length);
      console.log('Number of accounts:', response.data.accounts?.length);

      if (response.data.transactions) {
        setTransactions(response.data.transactions);
        setAccounts(response.data.accounts || []);
        setIsLinked(true);
        console.log('State updated with transactions and accounts');
      } else {
        console.error('No transactions in response');
      }
    } catch (error) {
      console.error('Error in handlePlaidSuccess:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  console.log('Current state:', { isLinked, transactionCount: transactions.length });

  return (
    <div className="space-y-6">
      {!isLinked ? (
        <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <Building className={`h-12 w-12 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="mt-4 text-2xl font-bold">Connect Your Bank Account</h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Securely connect your bank account to get started with automatic transaction tracking
            </p>
            <PlaidLinkComponent onSuccess={handlePlaidSuccess} />
          </div>
        </div>
      ) : (
        <>
          {console.log('Rendering dashboard with transactions:', transactions.length)}
          <OverviewCards transactions={transactions} accounts={accounts} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory transactions={transactions} />
            <BudgetProgress transactions={transactions} />
          </div>
          <MonthlyTrends transactions={transactions} />
        </>
      )}
    </div>
  );
};

export default FinanceDashboard;