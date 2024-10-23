import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Wallet, CreditCard, PiggyBank, Receipt } from 'lucide-react';

const OverviewCards = ({ transactions = [], accounts = [] }) => {
  const { isDark } = useTheme();

  const calculateTotals = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate total balance from accounts if available
    const totalBalance = accounts.reduce((sum, account) => sum + account.balances.current, 0);

    // Get current month's transactions
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // In Plaid, negative amounts are expenses and positive are income
    const monthlySpending = monthlyTransactions
      .filter(t => t.amount > 0) // Plaid reverses the signs
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySavings = monthlyTransactions
      .filter(t => t.amount < 0) // Plaid reverses the signs
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate percentage changes
    const previousMonthSpending = calculatePreviousMonthSpending(transactions);
    const spendingChange = previousMonthSpending ? 
      ((monthlySpending - previousMonthSpending) / previousMonthSpending) * 100 : 0;

    return {
      totalBalance: totalBalance || 0,
      monthlySpending,
      monthlySavings,
      spendingChange
    };
  };

  const calculatePreviousMonthSpending = (transactions) => {
    const now = new Date();
    const previousMonth = now.getMonth() - 1;
    const year = now.getFullYear();

    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === previousMonth && 
               date.getFullYear() === year && 
               t.amount > 0; // Plaid reverses the signs
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const { totalBalance, monthlySpending, monthlySavings, spendingChange } = calculateTotals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card
        icon={<Wallet className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
        title="Total Balance"
        value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        change={spendingChange > 0 ? `+${spendingChange.toFixed(1)}%` : `${spendingChange.toFixed(1)}%`}
        isPositive={spendingChange > 0}
      />
      <Card
        icon={<CreditCard className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
        title="Monthly Spending"
        value={`$${monthlySpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        change={`${spendingChange.toFixed(1)}%`}
        isPositive={spendingChange < 0}
      />
      <Card
        icon={<PiggyBank className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />}
        title="Monthly Savings"
        value={`$${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        change={`+${(monthlySavings / monthlySpending * 100).toFixed(1)}%`}
        isPositive={true}
      />
      <Card
        icon={<Receipt className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />}
        title="Upcoming Bills"
        value="$495.00"
        dueDate="Next 7 days"
      />
    </div>
  );
};

const Card = ({ icon, title, value, change, isPositive, dueDate }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </span>
        )}
      </div>
      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {title}
      </h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {dueDate && (
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Due in: {dueDate}
        </p>
      )}
    </div>
  );
};

export default OverviewCards;