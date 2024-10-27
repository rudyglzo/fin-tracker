import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

const Analytics = () => {
  const { isDark } = useTheme();
  const { transactions = [] } = usePlaid();

  // Calculate monthly trends
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

    return Object.values(data);
  }, [transactions]);

  // Calculate category distribution
  const categoryData = useMemo(() => {
    const data = {};
    transactions
      .filter(t => t.amount > 0)
      .forEach(transaction => {
        const category = transaction.category?.[0] || 'Other';
        if (!data[category]) {
          data[category] = {
            name: category,
            value: 0,
            count: 0
          };
        }
        data[category].value += transaction.amount;
        data[category].count += 1;
      });

    return Object.values(data);
  }, [transactions]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Spending"
          value={`$${transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0)
            .toFixed(2)}`}
          icon={<DollarSign />}
          isDark={isDark}
        />
        <SummaryCard
          title="Average Transaction"
          value={`$${(transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0) / 
            transactions.filter(t => t.amount > 0).length || 0)
            .toFixed(2)}`}
          icon={<TrendingUp />}
          isDark={isDark}
        />
        <SummaryCard
          title="Transaction Count"
          value={transactions.length}
          icon={<Calendar />}
          isDark={isDark}
        />
      </div>

      {/* Spending Trends */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Spending Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.5rem',
                }}
              />
              <Line type="monotone" dataKey="spending" stroke="#EF4444" name="Spending" />
              <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Category Analysis</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, isDark }) => (
  <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {React.cloneElement(icon, {
          className: `h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`
        })}
      </div>
    </div>
    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {title}
    </h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Analytics;