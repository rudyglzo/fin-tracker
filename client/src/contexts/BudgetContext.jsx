// contexts/BudgetContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetLimits, setBudgetLimits] = useState(() => {
    const stored = sessionStorage.getItem('budgetLimits');
    return stored ? JSON.parse(stored) : {
      'Payment': 2500,
      'Other': 1500,
      'Transfer': 1200,
      'Food and Drink': 500,
      'Travel': 600
    };
  });

  useEffect(() => {
    sessionStorage.setItem('budgetLimits', JSON.stringify(budgetLimits));
  }, [budgetLimits]);

  const updateBudgetLimit = (category, limit) => {
    setBudgetLimits(prev => ({
      ...prev,
      [category]: Number(limit)
    }));
  };

  return (
    <BudgetContext.Provider value={{ budgetLimits, updateBudgetLimit }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};