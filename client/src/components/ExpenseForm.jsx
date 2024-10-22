// src/components/ExpenseForm.jsx
import React from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';

const ExpenseForm = ({ 
  expense, 
  onSubmit,
  onCancel 
}) => {
  const [formData, setFormData] = React.useState({
    description: expense?.description || '',
    amount: expense?.amount || '',
    category: expense?.category || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card title={expense ? "Edit Expense" : "Add New Expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter expense description"
        />
        
        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          placeholder="Enter amount"
        />
        
        <Input
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          placeholder="Enter category"
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button 
              type="button" 
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExpenseForm;