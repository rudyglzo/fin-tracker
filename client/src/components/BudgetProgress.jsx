import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BudgetProgress = ({ transactions = [] }) => {
  const { isDark } = useTheme();

  // Calculate spending for a specific category
  const calculateCategorySpending = (categoryName) => {
    return transactions
      .filter(t => {
        // Check if transaction belongs to the category (Plaid categories are arrays)
        return t.amount > 0 && // Positive amounts are expenses in Plaid
          t.category?.some(cat => 
            cat.toLowerCase().includes(categoryName.toLowerCase())
          );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Define budgets with Plaid categories
  const budgets = [
    {
      category: "Food & Dining",
      spent: calculateCategorySpending('food'),
      limit: 500,
      color: "blue",
      matchCategories: ['food', 'restaurants']
    },
    {
      category: "Entertainment",
      spent: calculateCategorySpending('entertainment'),
      limit: 200,
      color: "purple",
      matchCategories: ['entertainment', 'recreation']
    },
    {
      category: "Shopping",
      spent: calculateCategorySpending('shopping'),
      limit: 300,
      color: "red",
      matchCategories: ['shops', 'shopping']
    },
    {
      category: "Transportation",
      spent: calculateCategorySpending('transport'),
      limit: 400,
      color: "green",
      matchCategories: ['transport', 'travel']
    }
  ];

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Budget Progress</h2>
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{budget.category}</span>
                <span>
                  ${budget.spent.toFixed(2)} / ${budget.limit}
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${getProgressColor(budget.spent, budget.limit)} 
                    transition-all duration-500 ease-in-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {percentage >= 80 && (
                <p className="text-xs text-red-500">
                  {percentage >= 100 ? 'Budget exceeded!' : 'Approaching budget limit'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;