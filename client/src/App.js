import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaidProvider } from './contexts/PlaidContext';
import MainLayout from './layouts/MainLayout';
import FinanceDashboard from './components/FinanceDashboard';
import Transactions from './components/Transactions';
import Analytics from './components/Analytics';
import Budget from './components/Budget';
import Settings from './components/Settings';
import Welcome from './components/Welcome';

function App() {
  const [showDemo, setShowDemo] = useState(() => {
    // Check if user was previously in demo mode
    return JSON.parse(sessionStorage.getItem('showDemo') || 'false');
  });

  const handleStartDemo = () => {
    sessionStorage.setItem('showDemo', 'true');
    setShowDemo(true);
  };

  const handleBack = () => {
    // Show confirmation dialog if Plaid is connected
    const isPlaidConnected = sessionStorage.getItem('plaidAccessToken');
    if (isPlaidConnected) {
      const confirm = window.confirm(
        'Going back will disconnect your bank account. Continue?'
      );
      if (!confirm) return;
    }

    // Clear all session data
    sessionStorage.clear();
    setShowDemo(false);
  };

  // Persist the current route
  useEffect(() => {
    if (showDemo) {
      const currentPath = window.location.pathname;
      sessionStorage.setItem('lastPath', currentPath);
    }
  }, [showDemo]);

  return (
    <ThemeProvider>
      <PlaidProvider>
        {!showDemo ? (
          <Welcome onStartDemo={handleStartDemo} />
        ) : (
          <Router>
            <MainLayout onBack={handleBack}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Navigate 
                      to={sessionStorage.getItem('lastPath') || '/dashboard'} 
                      replace 
                    />
                  } 
                />
                <Route path="/dashboard" element={<FinanceDashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          </Router>
        )}
      </PlaidProvider>
    </ThemeProvider>
  );
}

export default App;