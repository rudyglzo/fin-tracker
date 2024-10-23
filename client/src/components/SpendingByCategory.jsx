import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SpendingByCategory = ({ transactions = [] }) => {
  const { isDark } = useTheme();

  const calculateCategoryTotals = () => {
    // Only include expenses (positive amounts in Plaid are expenses)
    const expenses = transactions.filter(t => t.amount > 0);
    
    // Group by primary category (first category in the array)
    const categoryTotals = {};
    expenses.forEach(transaction => {
      // Get the main category from Plaid's category array
      const category = transaction.category ? transaction.category[0] : 'Other';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    // Convert to array format for the pie chart
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const data = calculateCategoryTotals();
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
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
              }}
            />
            <Legend 
              formatter={(value) => {
                const category = data.find(item => item.name === value);
                return `${value} ($${category.value.toFixed(2)})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingByCategory;