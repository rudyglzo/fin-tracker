import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { 
  Moon, 
  Sun, 
  CreditCard, 
  PieChart, 
  Settings, 
  ArrowLeft,
  LayoutDashboard,
  LineChart 
} from 'lucide-react';

const MainLayout = ({ children, onBack }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isConnected, loading } = usePlaid();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <LayoutDashboard />,
      text: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <CreditCard />,
      text: 'Transactions',
      path: '/transactions'
    },
    {
      icon: <PieChart />,
      text: 'Analytics',
      path: '/analytics'
    },
    {
      icon: <LineChart />,
      text: 'Budget',
      path: '/budget'
    },
    {
      icon: <Settings />,
      text: 'Settings',
      path: '/settings'
    }
  ];

  const handleNavigation = (path) => {
    // Only show connection warning for data-dependent routes if not connected
    const dataRoutes = ['/transactions', '/analytics', '/budget'];
    if (!isConnected && dataRoutes.includes(path) && location.pathname === '/dashboard') {
      const confirm = window.confirm(
        'Please connect your bank account first to view this section. Would you like to stay on the dashboard to connect?'
      );
      if (confirm) return;
    }
    navigate(path);
  };

  const handleBack = () => {
    if (isConnected) {
      const confirm = window.confirm(
        'Going back will disconnect your bank account. Continue?'
      );
      if (!confirm) return;
    }
    onBack();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Loading Indicator */}
      {loading && (
        <div className={`fixed top-0 left-0 right-0 z-50 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } p-2 text-center shadow-lg`}>
          <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Loading your financial data...
          </span>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b fixed w-full top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={handleBack}
                  className={`mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                    text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 
                    transition-colors`}
                  title="Back to Welcome Page"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <CreditCard className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`ml-2 text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                FinanceTracker Demo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected && (
                <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  ● Bank Connected
                </span>
              )}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full w-64 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r`}>
        <div className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                text={item.text}
                active={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                isDark={isDark}
                disabled={!isConnected && item.path !== '/dashboard' && item.path !== '/settings'}
              />
            ))}
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

// Sidebar Item Component
const SidebarItem = ({ icon, text, active = false, onClick, isDark, disabled = false }) => {
  return (
    <li>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center p-2 rounded-lg transition-colors
          ${active 
            ? `${isDark ? 'bg-gray-700' : 'bg-gray-100'}`
            : `hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'}`
          }
          ${isDark ? 'text-white' : 'text-gray-900'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`${active 
          ? (isDark ? 'text-blue-400' : 'text-blue-600')
          : (isDark ? 'text-gray-400' : 'text-gray-500')
        }`}>
          {icon}
        </span>
        <span className="ml-3">{text}</span>
        {disabled && (
          <span className="ml-2 text-xs text-gray-500">
            (Connect Bank)
          </span>
        )}
      </button>
    </li>
  );
};

export default MainLayout;