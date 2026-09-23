import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  PhoneCall, 
  LogOut, 
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';

export const Sidebar = ({ activePage, setActivePage }) => {
  const { logout, currentUser, isFirebaseConnected } = useAuth();
  const { stats } = useCustomers();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Inquiries', icon: Users, badge: stats.total },
    { id: 'add-customer', label: 'Add Inquiry', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Building2 size={20} />
        </div>
        <div>
          <div className="sidebar-brand-title">Inquiry CRM</div>
          <div className="sidebar-brand-subtitle">Customer & Projects</div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              role="button"
              tabIndex={0}
              id={`nav-link-${item.id}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </div>
          );
        })}

        {/* Project Type Quick Summary */}
        <div 
          style={{
            marginTop: 'auto',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.78rem'
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Projects Breakdown</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Active Projects (Yes):</span>
            <strong style={{ color: '#34d399' }}>{stats.withProject}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>No Project:</span>
            <strong style={{ color: '#94a3b8' }}>{stats.withoutProject}</strong>
          </div>
        </div>
      </nav>

      {/* Footer / System Status & Logout */}
      <div className="sidebar-footer">
        {/* Firebase Live Indicator */}
        <div 
          className="connection-pill"
          onClick={() => setActivePage('settings')}
          style={{ cursor: 'pointer' }}
          title="Click to manage Firebase connection in Settings"
        >
          <span className={`connection-dot ${isFirebaseConnected ? 'online' : 'offline'}`} />
          <span>{isFirebaseConnected ? 'Firebase Connected' : 'Firebase Disconnected'}</span>
        </div>

        {/* User Account / Logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#38bdf8'
              }}
            >
              {currentUser?.email ? currentUser.email[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.displayName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.email || 'admin@inquirycrm.local'}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon btn-secondary btn-sm"
            onClick={logout}
            title="Sign Out"
            id="sidebar-logout-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
