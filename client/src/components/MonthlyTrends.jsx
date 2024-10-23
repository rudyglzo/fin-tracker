import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyTrends = ({ transactions = [] }) => {
  const { isDark } = useTheme();

  const calculateMonthlyTotals = () => {
    const monthlyData = {};
    
    // Process each transaction
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          spending: 0,
          income: 0
        };
      }

      // In Plaid, positive amounts are expenses, negative are income
      if (transaction.amount > 0) {
        monthlyData[monthKey].spending += transaction.amount;
      } else {
        monthlyData[monthKey].income += Math.abs(transaction.amount);
      }
    });

    // Convert to array and sort by month
    return Object.values(monthlyData)
      .map(data => ({
        ...data,
        spending: Number(data.spending.toFixed(2)),
        income: Number(data.income.toFixed(2))
      }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  };

  const data = calculateMonthlyTotals();

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Line 
              type="monotone" 
              dataKey="spending" 
              stroke="#EF4444" 
              name="Spending"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              name="Income"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrends;