// src/components/ExpenseItem.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Trash2, Edit2 } from 'lucide-react';

const ExpenseItem = ({ 
  expense,
  onEdit,
  onDelete 
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`
      p-4 rounded-lg flex justify-between items-center
      ${isDark ? 'bg-gray-700' : 'bg-gray-50'}
    `}>
      <div className="flex-1">
        <p className="font-semibold">{expense.description}</p>
        <p className="text-sm text-blue-500">${expense.amount}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Category: {expense.category}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Date: {new Date(expense.date).toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400"
          >
            <Edit2 size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense._id)}
            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseItem;