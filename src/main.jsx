import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from './context/CustomerContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>
);
