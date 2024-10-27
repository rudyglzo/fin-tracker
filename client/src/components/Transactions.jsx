import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaid } from '../contexts/PlaidContext';
import { 
  Search, 
  Filter,
  ArrowUpDown,
  CreditCard
} from 'lucide-react';

const Transactions = () => {
  const { isDark } = useTheme();
  const { transactions = [], isConnected, loading } = usePlaid();
  
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Get unique categories with null check
  const categories = React.useMemo(() => {
    return [...new Set(
      transactions
        .filter(t => t && t.category && t.category[0])
        .map(t => t.category[0])
    )];
  }, [transactions]);

  useEffect(() => {
    console.log('Current transactions:', transactions);
    if (!Array.isArray(transactions)) return;

    let result = transactions.filter(t => t != null); // Remove null transactions
    
    // Apply search
    if (searchTerm) {
      result = result.filter(t => 
        (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.category && t.category[0] && t.category[0].toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => 
        t.category && t.category[0] && t.category[0].toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, selectedCategory, sortConfig]);

  if (!isConnected) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Please connect your bank account to view transactions.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredTransactions.length} transactions
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className={`relative ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border appearance-none ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split('-');
              setSortConfig({ key, direction });
            }}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border appearance-none ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className={`rounded-lg overflow-hidden border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-sm font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'bg-gray-900' : 'bg-white'}>
                {filteredTransactions.map((transaction, index) => (
                  <tr 
                    key={`${transaction.date}-${index}`}
                    className={`border-t ${
                      isDark ? 'border-gray-800' : 'border-gray-100'
                    } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                        {transaction.name || 'Unnamed Transaction'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                        {transaction.category?.[0] || 'Uncategorized'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right ${
                      transaction.amount > 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      ${Math.abs(transaction.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;