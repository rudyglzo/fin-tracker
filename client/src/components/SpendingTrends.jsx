// src/components/SpendingTrends.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const SpendingTrends = () => {
  const { isDark } = useTheme();

  const data = [
    { month: 'Jan', spending: 2400, income: 4000 },
    { month: 'Feb', spending: 1398, income: 3000 },
    { month: 'Mar', spending: 2800, income: 3500 },
    { month: 'Apr', spending: 3908, income: 4200 },
    { month: 'May', spending: 2800, income: 3800 },
    { month: 'Jun', spending: 2300, income: 3900 }
  ];

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
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
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Line 
              type="monotone" 
              dataKey="spending" 
              stroke="#EF4444" 
              name="Spending"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              name="Income"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrends;