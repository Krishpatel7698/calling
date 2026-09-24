import React from 'react';
import { PhoneCall, Search, Plus, LogOut, Bell, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';

export const Navbar = ({ activePage, setActivePage, onOpenProfile }) => {
  const { logout, currentUser, isFirebaseConnected } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    notificationDrawerOpen, 
    setNotificationDrawerOpen 
  } = useCustomers();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Sales & Operations Dashboard';
      case 'customers': return 'Leads & Customers';
      case 'pipeline': return 'Sales Pipeline & Kanban';
      case 'tasks': return 'Task Management';
      case 'quotations': return 'Quotations & Invoices';
      case 'add-customer': return 'Add New Lead';
      case 'settings': return 'Admin & System Settings';
      case 'customer-details': return 'Lead Profile';
      default: return 'CallPulse CRM';
    }
  };

  return (
    <header className="topbar">
      {/* Left: Page Title & Mobile Brand */}
      <div className="topbar-left">
        <div style={{ display: 'none' }} className="mobile-brand-wrapper">
          <PhoneCall size={20} style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <h1 className="topbar-title">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Right: Search, Notification Bell, Add Button & Profile */}
      <div className="topbar-right">
        {/* Desktop Quick Search */}
        {activePage !== 'customers' && activePage !== 'pipeline' && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.85rem',
              gap: '0.5rem',
              width: 200
            }}
          >
            <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
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
                fontSize: '0.82rem',
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
            <Plus size={15} />
            <span>Add Lead</span>
          </button>
        )}

        {/* Notification Bell with Badge */}
        <button
          type="button"
          className="btn-icon btn-secondary btn-sm"
          onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
          title="Notifications & Reminders"
          style={{ position: 'relative' }}
        >
          <Bell size={17} />
          {notifications.length > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: 17,
                height: 17,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)'
              }}
            >
              {notifications.length}
            </span>
          )}
        </button>

        {/* User Profile Avatar Pill */}
        <button
          type="button"
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '0.25rem 0.75rem 0.25rem 0.35rem',
            cursor: 'pointer'
          }}
          title="Manage Profile"
        >
          <div 
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'A'}
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentUser?.displayName?.split(' ')[0] || 'Admin'}
          </span>
          <span 
            style={{
              fontSize: '0.68rem',
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontWeight: 600
            }}
          >
            {currentUser?.role || 'Admin'}
          </span>
        </button>

        {/* Logout Button */}
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
