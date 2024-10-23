// src/App.js
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import FinanceDashboard from './components/FinanceDashboard';

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <FinanceDashboard />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;