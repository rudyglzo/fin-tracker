import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { PiggyBank, ArrowUpDown, AlertTriangle } from 'lucide-react';

const Budget = () => {
  const { isDark } = useTheme();
  const { transactions = [] } = usePlaid();

  // Calculate spending for a specific category
  const calculateCategorySpending = (categoryName) => {
    return transactions
      .filter(t => {
        return t.amount > 0 && 
          t.category?.some(cat =>
            cat.toLowerCase().includes(categoryName.toLowerCase())
          );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Extended budgets matching your spending categories
  const budgets = [
    {
      category: "Payment",
      spent: calculateCategorySpending('payment'),
      limit: 2500,
      color: "blue",
      matchCategories: ['payment', 'bills', 'utilities']
    },
    {
      category: "Other",
      spent: calculateCategorySpending('other'),
      limit: 1500,
      color: "purple",
      matchCategories: ['other', 'miscellaneous']
    },
    {
      category: "Transfer",
      spent: calculateCategorySpending('transfer'),
      limit: 1200,
      color: "pink",
      matchCategories: ['transfer', 'withdrawal']
    },
    {
      category: "Food & Dining",
      spent: calculateCategorySpending('food'),
      limit: 500,
      color: "orange",
      matchCategories: ['food', 'restaurants', 'dining']
    },
    {
      category: "Travel",
      spent: calculateCategorySpending('travel'),
      limit: 600,
      color: "green",
      matchCategories: ['travel', 'transportation']
    }
  ];

  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalPercentage = (totalSpent / totalBudget) * 100;

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PiggyBank className={`h-6 w-6 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-xl font-bold">Overall Budget</h2>
          </div>
          <div className={`text-lg font-semibold ${totalPercentage >= 100 ? 'text-red-500' : 'text-green-500'}`}>
            ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
          </div>
        </div>
        
        {/* Overall progress bar */}
        <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
          <div
            className={`h-full rounded-full ${getProgressColor(totalSpent, totalBudget)} transition-all duration-500`}
            style={{ width: `${Math.min(100, totalPercentage)}%` }}
          />
        </div>
      </div>

      {/* Detailed Budget Progress */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Category Budgets</h2>
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <select
              className={`rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } px-3 py-1`}
            >
              <option value="percentage">By Percentage</option>
              <option value="amount">By Amount</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
            const isOverBudget = percentage >= 100;
            const isNearLimit = percentage >= 80;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{budget.category}</span>
                    {isOverBudget && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <span className={`font-semibold ${
                    isOverBudget ? 'text-red-500' : 'text-gray-600'
                  }`}>
                    ${budget.spent.toFixed(2)} / ${budget.limit}
                  </span>
                </div>
                
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full ${getProgressColor(budget.spent, budget.limit)} 
                      transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {isNearLimit && (
                  <p className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`}>
                    {isOverBudget ? 'Budget exceeded!' : 'Approaching budget limit'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;