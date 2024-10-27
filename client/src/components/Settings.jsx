import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  Bell, 
  Monitor, // Changed from Display
  Shield, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Wallet,
  Settings2 // Added if we need a general settings icon
} from 'lucide-react';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true
  });

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} />,
          label: 'Profile Information',
          value: 'Demo User',
          onClick: () => console.log('Profile clicked')
        },
        {
          icon: <CreditCard size={20} />,
          label: 'Connected Accounts',
          value: '0 Banks Connected',
          onClick: () => console.log('Connected accounts clicked')
        },
        {
          icon: <Wallet size={20} />,
          label: 'Default Currency',
          value: currency,
          onClick: () => console.log('Currency clicked')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} />,
          label: 'Notifications',
          value: notifications.email ? 'Enabled' : 'Disabled',
          onClick: () => console.log('Notifications clicked'),
          toggle: true,
          checked: notifications.email,
          onToggle: () => setNotifications(prev => ({ ...prev, email: !prev.email }))
        },
        {
          icon: <Monitor size={20} />, // Changed from Display to Monitor
          label: 'Appearance',
          value: isDark ? 'Dark Mode' : 'Light Mode',
          onClick: toggleTheme,
          toggle: true,
          checked: isDark
        }
      ]
    },
    {
      title: 'Security',
      items: [
        {
          icon: <Shield size={20} />,
          label: 'Privacy Settings',
          onClick: () => console.log('Privacy clicked')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} />,
          label: 'Help Center',
          onClick: () => console.log('Help clicked')
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {settingSections.map((section) => (
          <div 
            key={section.title} 
            className={`rounded-lg overflow-hidden border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className={`px-4 py-3 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h2 className="font-semibold">{section.title}</h2>
            </div>
            
            <div className={`divide-y ${
              isDark ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                    isDark 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {item.value && (
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.value}
                      </span>
                    )}
                    
                    {item.toggle ? (
                      <Switch 
                        checked={item.checked}
                        onChange={item.onToggle || item.onClick}
                      />
                    ) : (
                      <ChevronRight size={18} className={
                        isDark ? 'text-gray-600' : 'text-gray-400'
                      } />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Toggle Switch Component
const Switch = ({ checked, onChange }) => {
  const { isDark } = useTheme();
  
  return (
    <button
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus:outline-none
        ${checked 
          ? 'bg-blue-600' 
          : (isDark ? 'bg-gray-600' : 'bg-gray-200')
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default Settings;