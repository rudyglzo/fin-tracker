import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { PiggyBank } from 'lucide-react';
import BudgetProgress from './BudgetProgress';

const Budget = () => {
  const { isDark } = useTheme();
  const { transactions } = usePlaid();

  const totalBudget = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <PiggyBank className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h1 className="text-2xl font-bold">Budget Management</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and track your spending limits
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Spending</p>
            <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Budget Progress with editing enabled */}
      <BudgetProgress transactions={transactions} allowEdit={true} />
    </div>
  );
};

export default Budget;