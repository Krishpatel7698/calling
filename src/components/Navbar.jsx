import React from 'react';
import { PhoneCall, Search, Plus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { logout, currentUser, isFirebaseConnected } = useAuth();
  const { searchQuery, setSearchQuery, stats } = useCustomers();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Inquiries Dashboard';
      case 'customers': return 'Customer & Project Inquiries';
      case 'add-customer': return 'Save Project Inquiry';
      case 'settings': return 'System & Firebase Settings';
      case 'customer-details': return 'Inquiry Details';
      default: return 'Inquiry CRM';
    }
  };

  return (
    <header className="topbar">
      {/* Left: Current Page Title & Mobile Brand */}
      <div className="topbar-left">
        <div style={{ display: 'none' }} className="mobile-brand-wrapper">
          <PhoneCall size={20} style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <h1 className="topbar-title">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Right: Search, Quick Add, Status & Profile */}
      <div className="topbar-right">
        {/* Quick Search on Desktop */}
        {activePage !== 'customers' && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.85rem',
              gap: '0.5rem',
              width: 220
            }}
          >
            <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'customers') setActivePage('customers');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                width: '100%'
              }}
            />
          </div>
        )}

        {/* Quick Add Button */}
        {activePage !== 'add-customer' && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('add-customer')}
            id="topbar-add-btn"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        )}

        {/* Firebase Status Badge */}
        <button
          type="button"
          onClick={() => setActivePage('settings')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
          title={isFirebaseConnected ? 'Firebase Connected' : 'Firebase Disconnected. Click to configure credentials.'}
        >
          <span 
            className="status-badge" 
            style={{
              backgroundColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isFirebaseConnected ? '#34d399' : '#f87171',
              borderColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              fontSize: '0.75rem'
            }}
          >
            <span 
              className="status-badge-dot" 
              style={{ backgroundColor: isFirebaseConnected ? '#34d399' : '#f87171' }} 
            />
            {isFirebaseConnected ? 'Firebase Live' : 'Disconnected'}
          </span>
        </button>

        {/* Logout (Mobile Header Action) */}
        <button
          type="button"
          className="btn-icon btn-secondary btn-sm"
          onClick={logout}
          title="Sign out"
          id="topbar-logout-btn"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
