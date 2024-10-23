// src/components/FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import PlaidLinkComponent from './PlaidLink';
import OverviewCards from './OverviewCards';
import SpendingByCategory from './SpendingByCategory';
import SpendingTrends from './SpendingTrends';
import BudgetProgress from './BudgetProgress';
import { Building, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FinanceDashboard = () => {
  const { isDark } = useTheme();
  const [isLinked, setIsLinked] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlySpending: 0,
    monthlySavings: 0,
    upcomingBills: 0,
    categories: {},
    trends: []
  });

  // Process transactions and update dashboard data
  const processTransactions = (transactions) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate monthly spending and categorize transactions
    const categories = {};
    let monthlySpending = 0;
    let monthlyIncome = 0;

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() === thisMonth && 
          transactionDate.getFullYear() === thisYear) {
        
        // Categorize transaction
        const category = transaction.category[0] || 'Other';
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category] += Math.abs(transaction.amount);

        // Calculate monthly totals
        if (transaction.amount < 0) {
          monthlySpending += Math.abs(transaction.amount);
        } else {
          monthlyIncome += transaction.amount;
        }
      }
    });

    // Calculate savings (income - spending)
    const monthlySavings = monthlyIncome - monthlySpending;

    // Update dashboard data
    setDashboardData({
      totalBalance: transactions.reduce((sum, t) => sum + t.amount, 0),
      monthlySpending,
      monthlySavings,
      upcomingBills: 495.00, // This would normally be calculated from recurring transactions
      categories,
      trends: processTrends(transactions)
    });
  };

  // Process transactions for trends
  const processTrends = (transactions) => {
    const trends = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!trends[monthKey]) {
        trends[monthKey] = {
          spending: 0,
          income: 0
        };
      }

      if (transaction.amount < 0) {
        trends[monthKey].spending += Math.abs(transaction.amount);
      } else {
        trends[monthKey].income += transaction.amount;
      }
    });

    return Object.entries(trends).map(([month, data]) => ({
      month: new Date(month).toLocaleString('default', { month: 'short' }),
      ...data
    }));
  };

  const handlePlaidSuccess = async (newTransactions) => {
    setIsLinked(true);
    setTransactions(newTransactions);
    processTransactions(newTransactions);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

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
          <OverviewCards 
            totalBalance={dashboardData.totalBalance}
            monthlySpending={dashboardData.monthlySpending}
            monthlySavings={dashboardData.monthlySavings}
            upcomingBills={dashboardData.upcomingBills}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory categories={dashboardData.categories} />
            <BudgetProgress />
          </div>
          
          <SpendingTrends trends={dashboardData.trends} />

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
                {transactions.slice(0, 10).map((transaction, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{transaction.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`text-lg font-bold ${
                        transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {transaction.category[0]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceDashboard;