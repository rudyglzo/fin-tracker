// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: ''
  });

  // Fetch expenses
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

  // Handle form submission
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
    <div className="App p-4">
      <h1 className="text-2xl font-bold mb-4">Finance Tracker</h1>
      
      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Expense
        </button>
      </form>

      {/* Expenses List */}
      <div>
        <h2 className="text-xl font-bold mb-2">Expenses</h2>
        {expenses.map((expense) => (
          <div key={expense._id} className="border p-2 mb-2">
            <p>Description: {expense.description}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Category: {expense.category}</p>
            <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;