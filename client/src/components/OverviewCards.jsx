// src/components/OverviewCards.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Wallet, CreditCard, PiggyBank, Receipt } from 'lucide-react';

const OverviewCards = () => {
  const { isDark } = useTheme();
  
  const stats = [
    {
      title: "Total Balance",
      value: "$12,345.67",
      change: "+2.5%",
      isPositive: true,
      icon: <Wallet className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
    },
    {
      title: "Monthly Spending",
      value: "$2,345.00",
      change: "-5.2%",
      isPositive: false,
      icon: <CreditCard className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
    },
    {
      title: "Monthly Savings",
      value: "$890.00",
      change: "+12.3%",
      isPositive: true,
      icon: <PiggyBank className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
    },
    {
      title: "Upcoming Bills",
      value: "$495.00",
      dueDate: "Next 7 days",
      icon: <Receipt className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              {stat.icon}
            </div>
            {stat.change && (
              <span className={`text-sm font-semibold ${
                stat.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            )}
          </div>
          <h3 className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {stat.title}
          </h3>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
          {stat.dueDate && (
            <p className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Due in: {stat.dueDate}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;