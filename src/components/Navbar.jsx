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

  const getMobileTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard';
      case 'customers': return 'Inquiries';
      case 'add-customer': return 'New Lead';
      case 'settings': return 'Settings';
      case 'customer-details': return 'Details';
      default: return 'CRM';
    }
  };

  return (
    <header className="topbar">
      {/* Left: Brand & Page Title */}
      <div className="topbar-left">
        <div 
          className="topbar-brand" 
          onClick={() => setActivePage('dashboard')}
          role="button"
          tabIndex={0}
          title="CallPulse CRM"
        >
          <div className="topbar-brand-icon">
            <PhoneCall size={18} />
          </div>
          <span className="topbar-brand-text">CallPulse</span>
        </div>

        <span className="topbar-divider">/</span>
        <h1 className="topbar-title">{getPageTitle()}</h1>
        <span className="topbar-mobile-badge">{getMobileTitle()}</span>
      </div>

      {/* Right: Search, Quick Add, Status & Profile */}
      <div className="topbar-right">
        {/* Quick Search on Desktop */}
        {activePage !== 'customers' && (
          <div className="topbar-desktop-search">
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
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* Quick Add Button (Desktop Only) */}
        {activePage !== 'add-customer' && (
          <button
            type="button"
            className="btn btn-primary btn-sm topbar-add-btn"
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
          className="topbar-status-btn"
          title={isFirebaseConnected ? 'Firebase Connected' : 'Firebase Disconnected. Click to configure credentials.'}
        >
          <span 
            className="status-badge status-badge-compact" 
            style={{
              backgroundColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isFirebaseConnected ? '#34d399' : '#f87171',
              borderColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            }}
          >
            <span 
              className="status-badge-dot" 
              style={{ backgroundColor: isFirebaseConnected ? '#34d399' : '#f87171' }} 
            />
            <span className="status-text-desktop">{isFirebaseConnected ? 'Firebase Live' : 'Disconnected'}</span>
            <span className="status-text-mobile">{isFirebaseConnected ? 'Live' : 'Offline'}</span>
          </span>
        </button>

        {/* Logout (Header Action) */}
        <button
          type="button"
          className="btn-icon btn-secondary btn-sm topbar-logout-btn"
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
