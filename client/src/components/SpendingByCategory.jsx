// src/components/SpendingByCategory.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const SpendingByCategory = () => {
  const { isDark } = useTheme();
  
  const data = [
    { name: 'Housing', value: 1200 },
    { name: 'Food', value: 450 },
    { name: 'Transportation', value: 300 },
    { name: 'Entertainment', value: 200 },
    { name: 'Shopping', value: 350 },
    { name: 'Others', value: 180 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280'];

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
              }}
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingByCategory;