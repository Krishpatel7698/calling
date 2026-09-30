import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useCustomers } from './context/CustomerContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CallDispositionModal } from './components/CallDispositionModal';
import { EditCustomerModal } from './components/EditCustomerModal';
import { Toast } from './components/Toast';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { AddCustomer } from './pages/AddCustomer';
import { CustomerDetails } from './pages/CustomerDetails';
import { Settings } from './pages/Settings';

import { Plus, PhoneCall } from 'lucide-react';

export default function App() {
  const { currentUser, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Loading Screen
  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-primary)'
        }}
      >
        <div 
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite'
          }} 
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading CallPulse CRM...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in -> Show Login Page
  if (!currentUser) {
    return <Login />;
  }

  // View Customer Details handler
  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomerId(customer.id);
    setActivePage('customer-details');
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Workspace */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar activePage={activePage} setActivePage={setActivePage} />

        {/* Page Switcher */}
        <main>
          {activePage === 'dashboard' && (
            <Dashboard 
              setActivePage={setActivePage} 
              onViewDetails={handleViewCustomerDetails} 
            />
          )}

          {activePage === 'customers' && (
            <Customers 
              setActivePage={setActivePage} 
              onViewDetails={handleViewCustomerDetails} 
            />
          )}

          {activePage === 'add-customer' && (
            <AddCustomer setActivePage={setActivePage} />
          )}

          {activePage === 'customer-details' && (
            <CustomerDetails 
              customerId={selectedCustomerId} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === 'settings' && (
            <Settings />
          )}
        </main>
      </div>

      {/* Floating Action Button (Mobile Quick Add) */}
      {activePage !== 'add-customer' && (
        <button
          type="button"
          className="mobile-quick-add-fab"
          onClick={() => setActivePage('add-customer')}
          aria-label="Add customer"
          title="Add Customer"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav activePage={activePage} setActivePage={setActivePage} />

      {/* Global Modals & Notifications */}
      <CallDispositionModal />
      <EditCustomerModal />
      <Toast />
    </div>
  );
}
