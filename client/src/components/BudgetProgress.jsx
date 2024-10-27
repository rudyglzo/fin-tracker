import React, { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBudget } from '../contexts/BudgetContext';
import { Pencil, Check, X } from 'lucide-react';

const BudgetProgress = ({ transactions = [], allowEdit = false }) => {
  const { isDark } = useTheme();
  const { budgetLimits, updateBudgetLimit } = useBudget();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const categoryTotals = useMemo(() => {
    const expenses = transactions.filter(t => t.amount > 0);
    const totals = {};
    expenses.forEach(transaction => {
      const category = transaction.category ? transaction.category[0] : 'Other';
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += transaction.amount;
    });
    return totals;
  }, [transactions]);

  const budgets = useMemo(() => {
    return Object.entries(categoryTotals)
      .map(([category, spent]) => ({
        category,
        spent,
        limit: budgetLimits[category] || 1000
      }))
      .sort((a, b) => b.spent - a.spent);
  }, [categoryTotals, budgetLimits]);

  const handleEditClick = (category, currentLimit) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const handleSave = (category) => {
    const newLimit = Number(editValue);
    if (!isNaN(newLimit) && newLimit > 0) {
      updateBudgetLimit(category, newLimit);
    }
    setEditingCategory(null);
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >=50) return 'bg-blue-500';
    if (percentage >=25) return 'bg-purple-500';
    if (percentage >=5) return 'bg-grey-500';
    return 'bg-green-500';
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Budget Progress</h2>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span>{budget.category}</span>
                <div className="flex items-center space-x-2">
                  {editingCategory === budget.category ? (
                    <div className="flex items-center space-x-2">
                      <span>$</span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`w-24 px-2 py-1 rounded ${
                          isDark 
                            ? 'bg-gray-700 text-white' 
                            : 'bg-white text-gray-900'
                        } border`}
                      />
                      <button
                        onClick={() => handleSave(budget.category)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>${budget.spent.toFixed(2)} / ${budget.limit}</span>
                      {allowEdit && (
                        <button
                          onClick={() => handleEditClick(budget.category, budget.limit)}
                          className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
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