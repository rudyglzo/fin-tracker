// src/components/Input.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Input = ({ 
  label,
  type = 'text',
  className = '',
  error,
  ...props 
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full rounded-lg border p-2.5
          ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;