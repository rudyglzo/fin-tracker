// components/MonthlyTrends.jsx
import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyTrends = ({ transactions = [], className = '' }) => {
  const { isDark } = useTheme();

  const monthlyData = useMemo(() => {
    const data = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!data[monthKey]) {
        data[monthKey] = {
          month: monthKey,
          spending: 0,
          income: 0,
          transactionCount: 0
        };
      }
      
      if (transaction.amount > 0) {
        data[monthKey].spending += transaction.amount;
      } else {
        data[monthKey].income += Math.abs(transaction.amount);
      }
      data[monthKey].transactionCount += 1;
    });

    // Sort months chronologically
    return Object.values(data)
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
  }, [transactions]);

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
              opacity={isDark ? 0.3 : 0.7}
            />
            <XAxis 
              dataKey="month" 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
            />
            <YAxis 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
      
                <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '8px 12px',
            }}
            formatter={(value, name) => {
              const formattedValue = `$${value.toFixed(2)}`;
              if (name === 'Spending') {
                return [<span className="text-red-500">{formattedValue}</span>, 'Spending'];
              }
              return [<span className="text-green-500">{formattedValue}</span>, 'Income'];
            }}
            labelFormatter={(label) => label} // This ensures proper month formatting
            separator=": " // This controls the spacing between name and value
            labelStyle={{
              color: isDark ? '#E5E7EB' : '#374151',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}
            itemStyle={{
              color: isDark ? '#E5E7EB' : '#374151',
              padding: '2px 0'
            }}
          />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#EF4444"  // Red
            name="Spending"
            strokeWidth={2}
            dot={{ fill: isDark ? '#1F2937' : '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#EF4444' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"  // Green
            name="Income"
            strokeWidth={2}
            dot={{ fill: isDark ? '#1F2937' : '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#10B981' }}
          />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrends;