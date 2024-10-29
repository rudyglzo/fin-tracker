import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SpendingByCategory = ({ transactions = [] }) => {
  const { isDark } = useTheme();

  const calculateCategoryTotals = () => {
    const expenses = transactions.filter(t => t.amount > 0);
    const categoryTotals = {};
    
    expenses.forEach(transaction => {
      const category = transaction.category ? transaction.category[0] : 'Other';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = calculateCategoryTotals();
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280'];

  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  const tooltipStyle = {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: isDark ? '#E5E7EB' : '#374151',
    padding: '8px 12px'
  };

  const legendFormatter = (value) => {
    const category = data.find(item => item.name === value);
    const percentage = ((category.value / totalSpending) * 100).toFixed(1);
    return `${value} ($${category.value.toFixed(2)} - ${percentage}%)`;
  };

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
              paddingAngle={5}
              dataKey="value"
              label={({name, value}) => {
                const percentage = ((value / totalSpending) * 100).toFixed(1);
                return percentage > 5 ? `${percentage}%` : '';
              }}
              labelLine={{ stroke: isDark ? '#9CA3AF' : '#6B7280', strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={isDark ? '#1F2937' : '#FFFFFF'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
              contentStyle={tooltipStyle}
              itemStyle={{
                color: isDark ? '#E5E7EB' : '#374151',
                fontSize: '0.875rem'
              }}
              labelStyle={{
                color: isDark ? '#E5E7EB' : '#374151',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}
            />
            <Legend
              formatter={legendFormatter}
              iconSize={10}
              iconType="circle"
              verticalAlign="middle"
              align="right"
              layout="vertical"
              wrapperStyle={{
                paddingLeft: '10px',
                color: isDark ? '#E5E7EB' : '#374151'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Total Spending Summary */}
      <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Spending
          </span>
          <span className="text-lg font-semibold">
            ${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategory;