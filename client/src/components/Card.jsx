// src/components/Card.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '',
  title,
  subtitle,
  ...props 
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        rounded-lg shadow-lg p-6
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;