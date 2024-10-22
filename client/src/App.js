// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import { useTheme } from './contexts/ThemeContext';


// Create a separate component for the main content
const ExpenseTracker = () => {
  const { isDark } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: ''
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', newExpense);
      setExpenses([response.data, ...expenses]);
      setNewExpense({ description: '', amount: '', category: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h1 className="text-2xl font-bold mb-4">Add New Expense</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            className={`w-full border rounded-lg p-2 ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            className={`w-full border rounded-lg p-2 ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            className={`w-full border rounded-lg p-2 ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div 
              key={expense._id} 
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <p className="font-semibold">{expense.description}</p>
              <p className="text-sm text-blue-500">${expense.amount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category: {expense.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <ExpenseTracker />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;