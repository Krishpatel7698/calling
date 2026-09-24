import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp,
  CheckSquare,
  FileText,
  UserPlus, 
  Settings, 
  LogOut, 
  Building2,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';

export const Sidebar = ({ activePage, setActivePage, onOpenProfile }) => {
  const { logout, currentUser, isFirebaseConnected } = useAuth();
  const { stats, tasks, quotations, notifications, setNotificationDrawerOpen, companySettings } = useCustomers();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Leads & Customers', icon: Users, badge: stats.total },
    { id: 'pipeline', label: 'Sales Pipeline', icon: TrendingUp },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare, badge: tasks.filter((t) => t.status !== 'Completed').length },
    { id: 'quotations', label: 'Quotations & Invoices', icon: FileText, badge: quotations.length },
    { id: 'add-customer', label: 'Add New Lead', icon: UserPlus },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header" onClick={() => setActivePage('dashboard')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-brand-icon">
          <Building2 size={20} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="sidebar-brand-title" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {companySettings.companyName.split(' ')[0]} CRM
          </div>
          <div className="sidebar-brand-subtitle">Enterprise Calling & Sales</div>
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
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </div>
          );
        })}

        {/* Quick Follow-up Alarm Indicator Box */}
        {stats.pendingFollowUps > 0 && (
          <div 
            onClick={() => setNotificationDrawerOpen(true)}
            style={{
              marginTop: 'auto',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--warning-bg)',
              border: '1px solid var(--warning-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
              <Bell size={15} />
              <span style={{ fontWeight: 700 }}>Follow-ups Due Today</span>
            </div>
            <span 
              style={{
                backgroundColor: 'var(--warning)',
                color: '#FFFFFF',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.75rem'
              }}
            >
              {stats.pendingFollowUps}
            </span>
          </div>
        )}
      </nav>

      {/* Footer / User Account & Logout */}
      <div className="sidebar-footer">
        {/* Firebase Live Indicator */}
        <div 
          className="connection-pill"
          onClick={() => setActivePage('settings')}
          style={{ cursor: 'pointer' }}
          title="Click to manage Firebase connection in Settings"
        >
          <span className={`connection-dot ${isFirebaseConnected ? 'online' : 'offline'}`} />
          <span>{isFirebaseConnected ? 'Cloud Firestore Online' : 'Local CRM Mode'}</span>
        </div>

        {/* User Account / Profile Click */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', cursor: 'pointer' }}
            onClick={onOpenProfile}
            title="Edit Profile"
          >
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}
            >
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.displayName || 'Master Admin'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.role || 'Admin'}
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
