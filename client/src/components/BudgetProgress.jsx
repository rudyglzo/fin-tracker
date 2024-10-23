// src/components/BudgetProgress.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BudgetProgress = () => {
  const { isDark } = useTheme();

  const budgets = [
    {
      category: "Food & Dining",
      spent: 420,
      limit: 500,
      color: "blue"
    },
    {
      category: "Entertainment",
      spent: 180,
      limit: 200,
      color: "purple"
    },
    {
      category: "Shopping",
      spent: 350,
      limit: 300,
      color: "red"
    },
    {
      category: "Transportation",
      spent: 240,
      limit: 400,
      color: "green"
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
                <span>${budget.spent} / ${budget.limit}</span>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${getProgressColor(budget.spent, budget.limit)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;