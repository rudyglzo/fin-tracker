// src/layouts/MainLayout.jsx
import React from 'react';
import { Moon, Sun, CreditCard, PieChart, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation Bar */}
      <nav className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b fixed w-full top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CreditCard className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`ml-2 text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                FinanceTracker
              </span>
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
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full w-64 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r`}>
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className={`flex items-center p-2 rounded-lg ${
                isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              }`}>
                <CreditCard className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="ml-3">Transactions</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-2 rounded-lg ${
                isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              }`}>
                <PieChart className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="ml-3">Analytics</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-2 rounded-lg ${
                isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              }`}>
                <Settings className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="ml-3">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className={`ml-64 pt-16 min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;