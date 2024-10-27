import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, Moon, Sun, PieChart, Wallet, LineChart } from 'lucide-react';

const Welcome = ({ onStartDemo }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation Bar */}
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-4 px-6 shadow-lg`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="text-xl font-bold">FinanceTracker</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Track Your Finances with Ease
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-500 dark:text-gray-400">
            Connect your accounts, track expenses, and gain insights into your spending habits.
          </p>
          <button
            onClick={onStartDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg
              text-lg font-semibold flex items-center space-x-2 mx-auto"
          >
            <span>Try Demo</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Wallet className="h-8 w-8" />}
              title="Bank Integration"
              description="Securely connect your bank accounts and track all your transactions in one place."
            />
            <FeatureCard 
              icon={<PieChart className="h-8 w-8" />}
              title="Spending Analytics"
              description="Understand your spending habits with detailed categorization and visual breakdowns."
            />
            <FeatureCard 
              icon={<LineChart className="h-8 w-8" />}
              title="Budget Tracking"
              description="Set budgets, track progress, and receive notifications when approaching limits."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
};

export default Welcome;