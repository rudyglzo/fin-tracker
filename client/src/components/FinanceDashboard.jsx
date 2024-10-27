import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { Building } from 'lucide-react';
import PlaidLinkComponent from './PlaidLink';
import OverviewCards from './OverviewCards';
import SpendingByCategory from './SpendingByCategory';
import BudgetProgress from './BudgetProgress';
import MonthlyTrends from './MonthlyTrends';

const FinanceDashboard = () => {
  const { isDark } = useTheme();
  const { 
    isConnected, 
    transactions, 
    accounts, 
    loading,
    handlePlaidSuccess
  } = usePlaid();

  // Debug logging
  useEffect(() => {
    if (isConnected) {
      console.log('Dashboard data:', {
        transactionsCount: transactions?.length || 0,
        accountsCount: accounts?.length || 0,
        sampleTransaction: transactions?.[0],
        sampleAccount: accounts?.[0]
      });
    }
  }, [isConnected, transactions, accounts]);

  if (loading) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center">
          <Building className={`h-12 w-12 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isConnected ? (
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
        <div className="space-y-6">
          {/* Overview Cards showing total balance, monthly spending, savings, and bills */}
          <OverviewCards 
            transactions={transactions || []} 
            accounts={accounts || []} 
          />
          
          {/* Two-column layout for Spending and Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory transactions={transactions || []} />
            <BudgetProgress transactions={transactions || []} />
          </div>
          
          {/* Monthly trends chart */}
          <MonthlyTrends transactions={transactions || []} />
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;